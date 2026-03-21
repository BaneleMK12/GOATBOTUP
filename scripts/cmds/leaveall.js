module.exports = {
  config: {
    name: "leaveall",
    version: "1.1",
    author: "Charles MK",
    countDown: 5,
    role: 2,
    description: "Make the bot leave all group chats or specific ones by TID",
    category: "⚙️ Admin",
    guide: {
      en:
        "『 Leave Groups 』\n"
      + "│\n"
      + "│ 🔹 {pn}\n"
      + "│     Leave all group chats\n"
      + "│\n"
      + "│ 🔹 {pn} <tid1> <tid2> ...\n"
      + "│     Leave specific group(s) by thread ID\n"
      + "│     Example: {pn} 1234567890 9876543210\n"
    }
  },

  langs: {
    en: {
      startingAll:
        "┌─『 Leave All Groups 』\n"
      + "│ 🚶 Starting to leave all group chats...\n"
      + "└────────────────────",
      startingSpecific:
        "┌─『 Leave Groups 』\n"
      + "│ 🚶 Leaving %1 specified group(s)...\n"
      + "└────────────────────",
      done:
        "┌─『 Leave Groups 』\n"
      + "│ ✅ Left %1 group(s) successfully.\n"
      + "│ ⚠️ Failed to leave %2 group(s).\n"
      + "└────────────────────",
      invalidTID:
        "┌─『 Leave Groups 』\n"
      + "│ ⛔ Invalid thread ID(s): %1\n"
      + "└────────────────────"
    }
  },

  onStart: async function ({ api, message, event, args, getLang }) {
    let success = 0;
    let failed = 0;

    // ── Specific TIDs mode ──────────────────────────────────────────
    if (args.length > 0) {
      const invalid = args.filter(a => !/^\d+$/.test(a));
      if (invalid.length > 0)
        return message.reply(getLang("invalidTID", invalid.join(", ")));

      await message.reply(getLang("startingSpecific", args.length));

      const isCurrentThread = args.includes(event.threadID);
      const otherTIDs = args.filter(tid => tid !== event.threadID);

      for (const tid of otherTIDs) {
        try {
          await api.sendMessage("🚶", tid);
          await api.removeUserFromGroup(global.botID, tid);
          success++;
        } catch (e) {
          failed++;
        }
      }

      // Leave current thread last if it was listed
      if (isCurrentThread) {
        try {
          await api.sendMessage("🚶", event.threadID);
          await api.removeUserFromGroup(global.botID, event.threadID);
          success++;
        } catch (e) {
          failed++;
        }
      }

      return message.reply(getLang("done", success, failed));
    }

    // ── Leave all mode ──────────────────────────────────────────────
    await message.reply(getLang("startingAll"));

    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    const groups = threadList.filter(t => t.isGroup && t.threadID !== event.threadID);

    for (const group of groups) {
      try {
        await api.sendMessage("🚶", group.threadID);
        await api.removeUserFromGroup(global.botID, group.threadID);
        success++;
      } catch (e) {
        failed++;
      }
    }

    // Leave the current thread last
    try {
      await api.sendMessage("🚶", event.threadID);
      await api.removeUserFromGroup(global.botID, event.threadID);
      success++;
    } catch (e) {
      failed++;
    }

    return message.reply(getLang("done", success, failed));
  }
};
