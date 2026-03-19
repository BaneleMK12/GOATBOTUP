module.exports = {
  config: {
    name: "findgay",
    aliases: ["whoisgay", "gayfinder"],
    version: "1.0",
    author: "Charles MK",
    countDown: 10,
    role: 0,
    description: "Find the gayest person in the group (just for fun!)",
    category: "fun",
    guide: {
      en: "{pn} - Find a random gay person in the group"
    }
  },

  onStart: async function ({ api, event, usersData, message }) {
    const { threadID, senderID } = event;

    try {
      // Get thread info
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs;

      // Remove bot ID from participants
      const botID = api.getCurrentUserID();
      const eligibleUsers = participants.filter(id => id !== botID);

      if (eligibleUsers.length === 0) {
        return message.reply("❌ 𝖭𝗈 𝗎𝗌𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!");
      }

      // Pick random user
      const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
      const gayUserID = eligibleUsers[randomIndex];
      const userName = await usersData.getName(gayUserID);

      // Gay percentage (random)
      const gayPercentage = Math.floor(Math.random() * 101);

      // Different messages based on percentage
      let statusMessage = "";
      let emoji = "";

      if (gayPercentage >= 90) {
        statusMessage = "𝗘𝗫𝗧𝗥𝗘𝗠𝗘𝗟𝗬 𝗙𝗔𝗕𝗨𝗟𝗢𝗨𝗦! 💅✨";
        emoji = "🏳️‍🌈🏳️‍🌈🏳️‍🌈";
      } else if (gayPercentage >= 70) {
        statusMessage = "𝗩𝗘𝗥𝗬 𝗚𝗔𝗬! 🌈";
        emoji = "🏳️‍🌈🏳️‍🌈";
      } else if (gayPercentage >= 50) {
        statusMessage = "𝗣𝗥𝗘𝗧𝗧𝗬 𝗚𝗔𝗬! 💖";
        emoji = "🏳️‍🌈";
      } else if (gayPercentage >= 30) {
        statusMessage = "𝗦𝗟𝗜𝗚𝗛𝗧𝗟𝗬 𝗚𝗔𝗬 👀";
        emoji = "🌈";
      } else {
        statusMessage = "𝗕𝗔𝗥𝗘𝗟𝗬 𝗚𝗔𝗬 😏";
        emoji = "✨";
      }

      // Fun facts
      const funFacts = [
        "𝖳𝗁𝖾𝗒 𝗁𝖺𝗏𝖾 𝖺 𝗋𝖺𝗂𝗇𝖻𝗈𝗐 𝖺𝗎𝗋𝖺",
        "𝖳𝗁𝖾𝗂𝗋 𝖿𝖺𝗏𝗈𝗋𝗂𝗍𝖾 𝖼𝗈𝗅𝗈𝗋 𝗂𝗌 𝖽𝖾𝖿𝗂𝗇𝗂𝗍𝖾𝗅𝗒 𝗋𝖺𝗂𝗇𝖻𝗈𝗐",
        "𝖳𝗁𝖾𝗒 𝗈𝗐𝗇 𝖺𝗍 𝗅𝖾𝖺𝗌𝗍 5 𝗋𝖺𝗂𝗇𝖻𝗈𝗐 𝗂𝗍𝖾𝗆𝗌",
        "𝖳𝗁𝖾𝗒 𝗐𝖺𝗅𝗄 𝗐𝗂𝗍𝗁 𝖾𝗑𝗍𝗋𝖺 𝖿𝗅𝖺𝗂𝗋",
        "𝖳𝗁𝖾𝗒 𝗌𝗉𝖺𝗋𝗄𝗅𝖾 𝗐𝗁𝖾𝗇 𝗍𝗁𝖾𝗒 𝗐𝖺𝗅𝗄",
        "𝖳𝗁𝖾𝗂𝗋 𝗉𝗅𝖺𝗒𝗅𝗂𝗌𝗍 𝗂𝗌 𝟣𝟢𝟢% 𝖻𝗈𝗉𝗌",
        "𝖳𝗁𝖾𝗒 𝗁𝖺𝗏𝖾 𝗂𝗆𝗉𝖾𝖼𝖼𝖺𝖻𝗅𝖾 𝖿𝖺𝗌𝗁𝗂𝗈𝗇 𝗌𝖾𝗇𝗌𝖾",
        "𝖳𝗁𝖾𝗒'𝗋𝖾 𝗍𝗁𝖾 𝗅𝗂𝖿𝖾 𝗈𝖿 𝖾𝗏𝖾𝗋𝗒 𝗉𝖺𝗋𝗍𝗒",
        "𝖳𝗁𝖾𝗒 𝗄𝗇𝗈𝗐 𝖺𝗅𝗅 𝗍𝗁𝖾 𝖻𝖾𝗌𝗍 𝖽𝗋𝖺𝗆𝖺",
        "𝖳𝗁𝖾𝗒 𝖼𝖺𝗇 𝗏𝗈𝗀𝗎𝖾 𝗅𝗂𝗄𝖾 𝖺 𝗉𝗋𝗈"
      ];

      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

      // Build response
      const response = `🏳️‍🌈 𝗚𝗔𝗬 𝗗𝗘𝗧𝗘𝗖𝗧𝗢𝗥 ${emoji}\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `🎯 𝖳𝖺𝗋𝗀𝖾𝗍 𝖥𝗈𝗎𝗇𝖽: ${userName}\n\n` +
        `📊 𝖦𝖺𝗒 𝖫𝖾𝗏𝖾𝗅: ${gayPercentage}%\n` +
        `🌈 𝖲𝗍𝖺𝗍𝗎𝗌: ${statusMessage}\n\n` +
        `💡 𝖥𝗎𝗇 𝖥𝖺𝖼𝗍:\n` +
        `   ${randomFact}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n`;

      // Create mention
      const mentions = [{
        tag: userName,
        id: gayUserID
      }];

      return message.reply({
        body: response,
        mentions: mentions
      });

    } catch (error) {
      console.error(error);
      return message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝗂𝗇𝖽𝗂𝗇𝗀 𝗍𝗁𝖾 𝗀𝖺𝗒 𝗉𝖾𝗋𝗌𝗈𝗇");
    }
  }
};
