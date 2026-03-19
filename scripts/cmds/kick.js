module.exports = {
  config: {
    name: "kick",
    version: "1.3",
    author: "CharlesMK",
    countDown: 5,
    role: 1,
    description: {
      vi: "Kick thành viên khỏi box chat",
      en: "Kick member out of chat box"
    },
    category: "box chat",
    guide: {
      vi: "   {pn} @tags: dùng để kick những người được tag",
      en: "   {pn} @tags: use to kick members who are tagged"
    }
  },

  langs: {
    vi: {
      needAdmin: "Vui lòng thêm quản trị viên cho bot trước khi sử dụng tính năng này"
    },
    en: {
      needAdmin: "Please add the bot as an admin before using this feature"
    }
  },

  onStart: async function ({ message, event, args, api, getLang }) {
    // Fetch live thread info directly from Facebook
    const threadInfo = await api.getThreadInfo(event.threadID);
    const botID = api.getCurrentUserID();
    const isAdmin = threadInfo.adminIDs.some(a => a.id === botID);

    if (!isAdmin) return message.reply(getLang("needAdmin"));

    async function kickAndCheckError(uid) {
      try {
        await api.removeUserFromGroup(uid, event.threadID);
      } catch (e) {
        message.reply(getLang("needAdmin"));
        return "ERROR";
      }
    }

    if (!args[0]) {
      if (!event.messageReply) return message.SyntaxError();
      await kickAndCheckError(event.messageReply.senderID);
    } else {
      const uids = Object.keys(event.mentions);
      if (uids.length === 0) return message.SyntaxError();
      if (await kickAndCheckError(uids.shift()) === "ERROR") return;
      for (const uid of uids)
        api.removeUserFromGroup(uid, event.threadID);
    }
  }
};
