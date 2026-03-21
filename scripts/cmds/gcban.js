const fs = require("fs-extra");
const path = require("path");

const BANNED_PATH = path.join(__dirname, "data", "gcban.json");

function loadBanned() {
  try {
    fs.ensureDirSync(path.dirname(BANNED_PATH));
    return fs.existsSync(BANNED_PATH) ? fs.readJsonSync(BANNED_PATH) : {};
  } catch {
    return {};
  }
}

function saveBanned(data) {
  fs.ensureDirSync(path.dirname(BANNED_PATH));
  fs.writeJsonSync(BANNED_PATH, data, { spaces: 2 });
}

module.exports = {
  config: {
    name: "gcban",
    version: "1.1",
    author: "Charles MK",
    countDown: 5,
    role: 2,
    description: "Ban a group chat by TID — bot leaves and never stays",
    category: "⚙️ Admin",
    guide: {
      en:
        "『 GC Ban 』\n"
      + "│\n"
      + "│ 🔹 {pn} <tid>\n"
      + "│     Ban a GC and leave it\n"
      + "│     Example: {pn} 1234567890\n"
      + "│\n"
      + "│ 🔹 {pn} unban <tid>\n"
      + "│     Unban a GC\n"
      + "│\n"
      + "│ 🔹 {pn} list\n"
      + "│     Show all banned GCs\n"
      + "│\n"
      + "│ 🔹 {pn} update\n"
      + "│     Scan all current GCs and leave any banned ones\n"
    }
  },

  langs: {
    en: {
      banned:
        "┌─『 GC Ban 』\n"
      + "│ ✅ GC banned: %1\n"
      + "│ 🚶 Leaving now...\n"
      + "└────────────────────",
      banFailedLeave:
        "┌─『 GC Ban 』\n"
      + "│ ✅ GC banned and saved: %1\n"
      + "│ ⚠️ Failed to leave: %2\n"
      + "└────────────────────",
      alreadyBanned:
        "┌─『 GC Ban 』\n"
      + "│ ⚠️ GC %1 is already banned.\n"
      + "└────────────────────",
      unbanned:
        "┌─『 GC Ban 』\n"
      + "│ ✅ GC unbanned: %1\n"
      + "└────────────────────",
      notBanned:
        "┌─『 GC Ban 』\n"
      + "│ ⚠️ GC %1 is not in the ban list.\n"
      + "└────────────────────",
      listEmpty:
        "┌─『 GC Ban 』\n"
      + "│ 📋 No GCs are currently banned.\n"
      + "└────────────────────",
      listHeader:
        "┌─『 Banned GCs 』\n",
      listItem: "│ 🚫 %1 — %2\n",
      listFooter: "└────────────────────",
      updateStart:
        "┌─『 GC Ban Update 』\n"
      + "│ 🔍 Scanning all GCs...\n"
      + "└────────────────────",
      updateDone:
        "┌─『 GC Ban Update 』\n"
      + "│ ✅ Left %1 banned GC(s).\n"
      + "│ 🟢 %2 GC(s) were clean.\n"
      + "└────────────────────",
      invalidTID:
        "┌─『 GC Ban 』\n"
      + "│ ⛔ Invalid TID: %1\n"
      + "└────────────────────"
    }
  },

  onLoad: async function ({ api }) {
    const banned = loadBanned();
    if (!Object.keys(banned).length) return;
    try {
      const botID = api.getCurrentUserID();
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const groups = threadList.filter(t => t.isGroup);
      for (const group of groups) {
        if (banned[group.threadID]) {
          try {
            await api.sendMessage("🚶", group.threadID);
            await api.removeUserFromGroup(botID, group.threadID);
          } catch {}
        }
      }
    } catch {}
  },

  onStart: async function ({ api, message, event, args, getLang }) {
    const banned = loadBanned();
    const sub = args[0];

    // ── List ────────────────────────────────────────────────────────
    if (sub === "list") {
      const entries = Object.entries(banned);
      if (!entries.length) return message.reply(getLang("listEmpty"));
      let body = getLang("listHeader");
      for (const [tid, info] of entries)
        body += getLang("listItem", tid, info.reason || "No reason");
      body += getLang("listFooter");
      return message.reply(body);
    }

    // ── Unban ───────────────────────────────────────────────────────
    if (sub === "unban") {
      const tid = args[1];
      if (!tid || !/^\d+$/.test(tid))
        return message.reply(getLang("invalidTID", tid || "none"));
      if (!banned[tid])
        return message.reply(getLang("notBanned", tid));
      delete banned[tid];
      saveBanned(banned);
      return message.reply(getLang("unbanned", tid));
    }

    // ── Update (scan + leave) ───────────────────────────────────────
    if (sub === "update") {
      await message.reply(getLang("updateStart"));
      const botID = api.getCurrentUserID();
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const groups = threadList.filter(t => t.isGroup);
      let left = 0;
      let clean = 0;
      for (const group of groups) {
        if (banned[group.threadID]) {
          try {
            await api.sendMessage("🚶", group.threadID);
            await api.removeUserFromGroup(botID, group.threadID);
            left++;
          } catch {}
        } else {
          clean++;
        }
      }
      return message.reply(getLang("updateDone", left, clean));
    }

    // ── Ban <tid> [reason] ──────────────────────────────────────────
    const tid = sub;
    if (!tid || !/^\d+$/.test(tid))
      return message.reply(getLang("invalidTID", tid || "none"));

    if (banned[tid])
      return message.reply(getLang("alreadyBanned", tid));

    const reason = args.slice(1).join(" ").trim() || null;
    banned[tid] = { reason, bannedAt: Date.now() };
    saveBanned(banned);

    await message.reply(getLang("banned", tid));

    try {
      const botID = api.getCurrentUserID();
      await api.sendMessage("🚶", tid);
      await api.removeUserFromGroup(botID, tid);
    } catch (e) {
      await message.reply(getLang("banFailedLeave", tid, e.message));
    }
  },

  // ── Auto-leave if added to a banned GC ───────────────────────────
  onEvent: async function ({ api, event }) {
    if (event.type !== "event" || event.logMessageType !== "log:subscribe") return;

    const addedIDs = event.logMessageData?.addedParticipants?.map(p => p.userFbId) || [];
    const botID = api.getCurrentUserID();
    if (!addedIDs.includes(botID)) return;

    const banned = loadBanned();
    if (!banned[event.threadID]) return;

    try {
      await api.sendMessage("🚶", event.threadID);
      await api.removeUserFromGroup(botID, event.threadID);
    } catch {}
  }
};
