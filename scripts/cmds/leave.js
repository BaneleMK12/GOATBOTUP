module.exports = {
  config: {
    name: "leave",
    version: "1.1",
    author: "ArYAN",
    countDown: 10,
    role: 1,
    shortDescription: {
      en: "List groups & leave selected"
    },
    longDescription: {
      en: "Shows groups where bot is a member (8 per page). On reply with number, bot sends a goodbye message in that group then leaves."
    },
    category: "owner",
    guide: {
      en: "{p}leave → list groups\nReply with number → bot leaves group\nReply 'next'/'prev' → paginate"
    }
  },

  onStart: async function ({ api, message, threadsData, event }) {
    const allThreads = await threadsData.getAll();
    const groups = allThreads.filter(t => t.isGroup);

    if (groups.length === 0) return message.reply("❌ No groups found.");

    const page = 1;
    const perPage = 8;
    const totalPages = Math.ceil(groups.length / perPage);

    const msg = await this.renderPage(api, groups, page, perPage, totalPages);

    return message.reply(msg, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        groups,
        page,
        perPage,
        totalPages
      });
    });
  },

  onReply: async function ({ api, message, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const body = event.body.trim().toLowerCase();

    if (body === "next" || body === "prev") {
      let newPage = Reply.page;
      if (body === "next" && Reply.page < Reply.totalPages) newPage++;
      else if (body === "prev" && Reply.page > 1) newPage--;

      const msg = await this.renderPage(api, Reply.groups, newPage, Reply.perPage, Reply.totalPages);
      return message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          ...Reply,
          page: newPage
        });
      });
    }

    const choice = parseInt(body);
    if (isNaN(choice)) return message.reply("❌ Invalid input. Reply with number, 'next', or 'prev'.");

    const index = (Reply.page - 1) * Reply.perPage + (choice - 1);
    if (index < 0 || index >= Reply.groups.length) return message.reply("❌ Invalid choice.");

    const selectedGroup = Reply.groups[index];
    const threadID = selectedGroup.threadID;

    try {
      const info = await api.getThreadInfo(threadID);
      const memberCount = info.participantIDs.length;

      const goodbyeBox =
        `┌──────────────┐\n` +
        `│ 👋 𝗕𝗼𝘁 𝗟𝗲𝗮𝘃𝗶𝗻𝗴\n` +
        `├──────────────┤\n` +
        `│ 📌 Group : ${info.threadName || "Unnamed"}\n` +
        `│ 🆔 ID    : ${threadID}\n` +
        `│ 👥 Members: ${memberCount}\n` +
        `└──────────────┘\n` +
        `🙏 Thank you!`;

      await api.sendMessage(goodbyeBox, threadID);
      await api.removeUserFromGroup(api.getCurrentUserID(), threadID);

      return message.reply(`✅ Bot left the group: ${info.threadName || "Unnamed"} (${threadID})`);

    } catch (err) {
      return message.reply(`❌ Error leaving group: ${err.message}`);
    }
  },

  renderPage: async function (api, groups, page, perPage, totalPages) {
    let msg = `📦 Groups where bot is a member (Page ${page}/${totalPages}):\n\n`;
    const start = (page - 1) * perPage;
    const end = Math.min(start + perPage, groups.length);

    for (let i = start; i < end; i++) {
      const g = groups[i];
      try {
        const info = await api.getThreadInfo(g.threadID);
        const approval = info.approvalMode ? "✅ Approved On" : "❌ Approved Off";
        const memberCount = info.participantIDs.length;

        msg += `${i - start + 1}. ${g.threadName || "Unnamed"}\n🆔 ${g.threadID}\n👥 Members: ${memberCount}\n🔐 ${approval}\n\n`;
      } catch {
        msg += `${i - start + 1}. ${g.threadName || "Unnamed"}\n🆔 ${g.threadID}\n⚠️ Failed to fetch info\n\n`;
      }
    }

    msg += `👉 Reply with number to make bot leave.\n`;
    if (page < totalPages) msg += `➡️ Reply "next" for next page.\n`;
    if (page > 1) msg += `⬅️ Reply "prev" for previous page.\n`;

    return msg;
  }
};
