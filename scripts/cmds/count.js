module.exports = {
  config: {
    name: "count",
    version: "2.0",
    author: "NTKhang | Improved by Charles MK",
    countDown: 5,
    role: 0,
    description: {
      vi: "Xem số lượng tin nhắn của bạn hoặc mọi người trong nhóm (tính từ khi bot vào)",
      en: "View message count of yourself or all members (since bot joined the group)"
    },
    category: "box chat",
    guide: {
      vi: "{pn}                 → Xem tin nhắn của bạn\n"
        + "{pn} @tag            → Xem của người được tag\n"
        + "{pn} all            → Xem toàn bộ thành viên\n"
        + "{pn} all 2          → Xem trang 2 (nếu có)",
      en: "{pn}                 → Your message count\n"
        + "{pn} @tag            → Tagged users' count\n"
        + "{pn} all            → All members\n"
        + "{pn} all 2          → Page 2 (if exists)"
    }
  },

  langs: {
    vi: {
      header: "📊 𝗧𝗛𝗢̂́𝗡𝗚 𝗞𝗘̂ 𝗧𝗜𝗡 𝗡𝗛𝗔̂́𝗡 𝗡𝗛𝗢́𝗠",
      separator: "━━━━━━━━━━━━━━━━━━",
      yourResult: "🏆 𝖡𝖺̣𝗇 đ𝖺𝗇𝗀 𝗑𝖾̂́𝗉 𝗁𝖺̣𝗇𝗀 #%1 𝗏𝗈̛́𝗂 %2 𝗍𝗂𝗇 𝗇𝗁𝖺̂́𝗇!",
      result: "   %1. %2\n   💬 𝖳𝗂𝗇 𝗇𝗁𝖺̂́𝗇: %3",
      allTitle: "👥 𝗫𝗘̂́𝗣 𝗛𝗔̣𝗡𝗚 𝗧𝗛𝗔̀𝗡𝗛 𝗩𝗜𝗘̂𝗡:",
      noMessage: "\n💭 𝖭𝗁𝗎̛̃𝗇𝗀 𝗇𝗀𝗎̛𝗈̛̀𝗂 𝗄𝗁𝗈̂𝗇𝗀 𝗑𝗎𝖺̂́𝗍 𝗁𝗂𝖾̣̂𝗇 𝖼𝗁𝗎̛𝖺 𝗀𝗎̛̉𝗂 𝗍𝗂𝗇 𝗇𝗁𝖺̂́𝗇",
      page: "\n📄 𝖳𝗋𝖺𝗇𝗀 %1/%2",
      replyPrompt: "💡 𝖳𝗋𝖺̉ 𝗅𝗈̛̀𝗂 𝗍𝗂𝗇 𝗇𝗁𝖺̂́𝗇 𝗇𝖺̀𝗒 + 𝗌𝗈̂́ 𝗍𝗋𝖺𝗇𝗀 đ𝖾̂̉ 𝗑𝖾𝗆 𝗍𝗂𝖾̂́𝗉",
      invalidPage: "❌ 𝖲𝗈̂́ 𝗍𝗋𝖺𝗇𝗀 𝗄𝗁𝗈̂𝗇𝗀 𝗁𝗈̛̣𝗉 𝗅𝖾̣̂!",
      error: "❌ Đ𝖺̃ 𝗑𝖺̉𝗒 𝗋𝖺 𝗅𝗈̂̃𝗂 𝗄𝗁𝗂 𝗅𝖺̂́𝗒 𝖽𝗎̛̃ 𝗅𝗂𝖾̣̂𝗎 𝗇𝗁𝗈́𝗆",
      noMessageYet: "❌ 𝖡𝖺̣𝗇 𝖼𝗁𝗎̛𝖺 𝗀𝗎̛̉𝗂 𝗍𝗂𝗇 𝗇𝗁𝖺̂́𝗇 𝗇𝖺̀𝗈 𝗍𝗋𝗈𝗇𝗀 𝗇𝗁𝗈́𝗆 𝗇𝖺̀𝗒!"
    },
    en: {
      header: "📊 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦",
      separator: "━━━━━━━━━━━━━━━━━━",
      yourResult: "🏆 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗋𝖺𝗇𝗄𝖾𝖽 #%1 𝗐𝗂𝗍𝗁 %2 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌!",
      result: "   %1. %2\n   💬 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌: %3",
      allTitle: "👥 𝗠𝗘𝗠𝗕𝗘𝗥 𝗥𝗔𝗡𝗞𝗜𝗡𝗚:",
      noMessage: "\n💭 𝖯𝖾𝗈𝗉𝗅𝖾 𝗇𝗈𝗍 𝗅𝗂𝗌𝗍𝖾𝖽 𝗁𝖺𝗏𝖾 𝗌𝖾𝗇𝗍 𝟢 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌",
      page: "\n📄 𝖯𝖺𝗀𝖾 %1/%2",
      replyPrompt: "💡 𝖱𝖾𝗉𝗅𝗒 𝗐𝗂𝗍𝗁 𝗉𝖺𝗀𝖾 𝗇𝗎𝗆𝖻𝖾𝗋 𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾",
      invalidPage: "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗉𝖺𝗀𝖾 𝗇𝗎𝗆𝖱𝖾𝗋!",
      error: "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖽𝖺𝗍𝖺",
      noMessageYet: "❌ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾𝗇'𝗍 𝗌𝖾𝗇𝗍 𝖺𝗇𝗒 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!"
    }
  },

  onStart: async function ({ args, threadsData, message, event, api, commandName, getLang }) {
    const { threadID, senderID } = event;

    const threadData = await threadsData.get(threadID);
    if (!threadData?.members) {
      return message.reply(getLang("error"));
    }

    const currentMembers = (await api.getThreadInfo(threadID)).participantIDs;

    // Prepare ranking data
    const ranking = [];
    const invisibleChar = "֏֏֏֏֏֏֏֏֏֏";

    for (const member of threadData.members) {
      if (!currentMembers.includes(member.userID)) continue;

      ranking.push({
        uid: member.userID,
        name: member.name.includes(invisibleChar) ? `UID: ${member.userID}` : member.name,
        count: member.count || 0
      });
    }

    // Sort descending by message count
    ranking.sort((a, b) => b.count - a.count);

    // Add rank number with medals for top 3
    ranking.forEach((item, index) => {
      item.rank = index + 1;
      if (index === 0) item.medal = "🥇";
      else if (index === 1) item.medal = "🥈";
      else if (index === 2) item.medal = "🥉";
      else item.medal = "  ";
    });

    // CASE 1: No arguments → show self
    if (!args[0]) {
      const user = ranking.find(u => u.uid === senderID);
      if (!user) {
        return message.reply(getLang("noMessageYet"));
      }
      
      let response = `${getLang("header")}\n${getLang("separator")}\n\n`;
      response += getLang("yourResult", user.rank, user.count.toLocaleString());
      
      return message.reply(response);
    }

    // CASE 2: Mentioned users
    if (Object.keys(event.mentions || {}).length > 0) {
      let txt = `${getLang("header")}\n${getLang("separator")}\n\n`;
      
      for (const uid in event.mentions) {
        const user = ranking.find(u => u.uid === uid);
        if (user) {
          txt += getLang("result", user.medal + " #" + user.rank, user.name, user.count.toLocaleString()) + "\n\n";
        } else {
          txt += `   ${event.mentions[uid].replace(/@/g, '')}\n   💬 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌: 0\n\n`;
        }
      }
      
      return message.reply(txt.trim());
    }

    // CASE 3: "all" command
    if (args[0].toLowerCase() === "all") {
      const itemsPerPage = 20;
      const pages = Math.ceil(ranking.length / itemsPerPage);

      let page = 1;
      if (args[1] && !isNaN(args[1])) {
        page = parseInt(args[1]);
      }

      if (page < 1 || page > pages) {
        return message.reply(getLang("invalidPage"));
      }

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = ranking.slice(start, end);

      let msg = `${getLang("header")}\n${getLang("separator")}\n${getLang("allTitle")}\n\n`;

      for (const item of pageItems) {
        if (item.count > 0) {
          msg += getLang("result", item.medal + " #" + item.rank, item.name, item.count.toLocaleString()) + "\n\n";
        }
      }

      msg += `${getLang("separator")}`;
      msg += getLang("page", page, pages);
      
      if (pages > 1) {
        msg += `\n${getLang("replyPrompt")}`;
      }
      
      msg += getLang("noMessage");

      // If only one page → no need for reply handler
      if (pages === 1) {
        return message.reply(msg);
      }

      return message.reply(msg, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          type: "all",
          messageID: info.messageID,
          ranking,
          page,
          totalPages: pages,
          itemsPerPage,
          author: senderID
        });
      });
    }

    return message.reply(`ℹ️ 𝖴𝗌𝖺𝗀𝖾: +count | +count @tag | +count all [page]`);
  },

  onReply: async function ({ message, event, Reply, getLang }) {
    const { senderID, body } = event;
    if (Reply.author !== senderID) return;

    const page = parseInt(body.trim());
    if (isNaN(page) || page < 1 || page > Reply.totalPages) {
      return message.reply(getLang("invalidPage"));
    }

    const start = (page - 1) * Reply.itemsPerPage;
    const end = start + Reply.itemsPerPage;
    const pageItems = Reply.ranking.slice(start, end);

    let msg = `${getLang("header")}\n${getLang("separator")}\n${getLang("allTitle")}\n\n`;

    for (const item of pageItems) {
      if (item.count > 0) {
        msg += getLang("result", item.medal + " #" + item.rank, item.name, item.count.toLocaleString()) + "\n\n";
      }
    }

    msg += `${getLang("separator")}`;
    msg += getLang("page", page, Reply.totalPages);
    
    if (Reply.totalPages > 1) {
      msg += `\n${getLang("replyPrompt")}`;
    }
    
    msg += getLang("noMessage");

    message.reply(msg, (err, info) => {
      if (err) return;
      message.unsend(Reply.messageID).catch(() => {});
      global.GoatBot.onReply.set(info.messageID, {
        ...Reply,
        messageID: info.messageID,
        page
      });
    });
  },

  onChat: async function ({ usersData, threadsData, event }) {
    if (event.isGroup !== true) return;

    const { senderID, threadID } = event;

    const members = await threadsData.get(threadID, "members") || [];

    let member = members.find(m => m.userID === senderID);

    if (!member) {
      member = {
        userID: senderID,
        name: await usersData.getName(senderID),
        nickname: null,
        inGroup: true,
        count: 0
      };
      members.push(member);
    }

    member.count += 1;

    await threadsData.set(threadID, { members });
  }
};
