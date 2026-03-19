module.exports = {
  config: {
    name: "findlove",
    aliases: ["matchmaker", "couple"],
    version: "1.0",
    author: "Charles MK",
    countDown: 10,
    role: 0,
    description: "Find love matches in the group",
    category: "fun",
    guide: {
      en: "{pn} - Find random couple\n" +
          "{pn} @user1 @user2 - Check compatibility\n" +
          "{pn} @user - Find match for tagged user"
    }
  },

  onStart: async function ({ api, event, usersData, message }) {
    const { threadID, senderID, mentions } = event;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const participants = threadInfo.participantIDs;
      const botID = api.getCurrentUserID();
      const eligibleUsers = participants.filter(id => id !== botID);

      if (eligibleUsers.length < 2) {
        return message.reply("❌ 𝖭𝗈𝗍 𝖾𝗇𝗈𝗎𝗀𝗁 𝗎𝗌𝖾𝗋𝗌 𝖿𝗈𝗋 𝗆𝖺𝗍𝖼𝗁𝗆𝖺𝗄𝗂𝗇𝗀!");
      }

      let user1ID, user2ID, user1Name, user2Name;
      const mentionedUsers = Object.keys(mentions || {});

      // Case 1: Two users mentioned
      if (mentionedUsers.length >= 2) {
        user1ID = mentionedUsers[0];
        user2ID = mentionedUsers[1];
        user1Name = await usersData.getName(user1ID);
        user2Name = await usersData.getName(user2ID);
      }
      // Case 2: One user mentioned
      else if (mentionedUsers.length === 1) {
        user1ID = mentionedUsers[0];
        user1Name = await usersData.getName(user1ID);
        
        const otherUsers = eligibleUsers.filter(id => id !== user1ID);
        user2ID = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        user2Name = await usersData.getName(user2ID);
      }
      // Case 3: Random couple
      else {
        const shuffled = [...eligibleUsers].sort(() => Math.random() - 0.5);
        user1ID = shuffled[0];
        user2ID = shuffled[1];
        user1Name = await usersData.getName(user1ID);
        user2Name = await usersData.getName(user2ID);
      }

      // Calculate compatibility
      const compatibility = Math.floor(Math.random() * 101);

      // Relationship status based on compatibility
      let status = "";
      let emoji = "";

      if (compatibility >= 90) {
        status = "𝗣𝗘𝗥𝗙𝗘𝗖𝗧 𝗠𝗔𝗧𝗖𝗛! 💕";
        emoji = "💑💖✨";
      } else if (compatibility >= 70) {
        status = "𝗚𝗥𝗘𝗔𝗧 𝗖𝗢𝗨𝗣𝗟𝗘! 💝";
        emoji = "💑💕";
      } else if (compatibility >= 50) {
        status = "𝗚𝗢𝗢𝗗 𝗖𝗛𝗔𝗡𝗖𝗘! 💓";
        emoji = "💑";
      } else if (compatibility >= 30) {
        status = "𝗠𝗔𝗬𝗕𝗘... 💭";
        emoji = "🤔";
      } else {
        status = "𝗡𝗢𝗧 𝗥𝗘𝗔𝗟𝗟𝗬... 💔";
        emoji = "😅";
      }

      // Love quotes
      const quotes = [
        "𝖳𝗁𝖾𝗂𝗋 𝗁𝖾𝖺𝗋𝗍𝗌 𝖻𝖾𝖺𝗍 𝗂𝗇 𝗌𝗒𝗇𝖼",
        "𝖣𝖾𝗌𝗍𝗂𝗇𝗒 𝖻𝗋𝗈𝗎𝗀𝗁𝗍 𝗍𝗁𝖾𝗆 𝗍𝗈𝗀𝖾𝗍𝗁𝖾𝗋",
        "𝖳𝗁𝖾𝗒 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾 𝖾𝖺𝖼𝗁 𝗈𝗍𝗁𝖾𝗋",
        "𝖫𝗈𝗏𝖾 𝗂𝗌 𝗂𝗇 𝗍𝗁𝖾 𝖺𝗂𝗋",
        "𝖠 𝗆𝖺𝗍𝖼𝗁 𝗆𝖺𝖽𝖾 𝗂𝗇 𝗁𝖾𝖺𝗏𝖾𝗇",
        "𝖳𝗁𝖾𝗒'𝗋𝖾 𝗆𝖾𝖺𝗇𝗍 𝗍𝗈 𝖻𝖾",
        "𝖳𝗋𝗎𝖾 𝗅𝗈𝗏𝖾 𝗇𝖾𝗏𝖾𝗋 𝖽𝗂𝖾𝗌",
        "𝖲𝗈𝗎𝗅𝗆𝖺𝗍𝖾𝗌 𝖿𝗈𝗋𝖾𝗏𝖾𝗋",
        "𝖳𝗁𝖾 𝗌𝗍𝖺𝗋𝗌 𝖺𝗅𝗂𝗀𝗇𝖾𝖽 𝖿𝗈𝗋 𝗍𝗁𝖾𝗆",
        "𝖫𝗈𝗏𝖾 𝖺𝗍 𝖿𝗂𝗋𝗌𝗍 𝗌𝗂𝗀𝗁𝗍"
      ];

      const quote = quotes[Math.floor(Math.random() * quotes.length)];

      // Build response
      const response = `💕 𝗟𝗢𝗩𝗘 𝗠𝗔𝗧𝗖𝗛𝗠𝗔𝗞𝗘𝗥 ${emoji}\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `👫 𝖢𝗈𝗎𝗉𝗅𝖾:\n` +
        `   ${user1Name} 💖 ${user2Name}\n\n` +
        `📊 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒: ${compatibility}%\n` +
        `💝 𝖲𝗍𝖺𝗍𝗎𝗌: ${status}\n\n` +
        `✨ 𝖰𝗎𝗈𝗍𝖾:\n` +
        `   "${quote}"\n\n` +
        `━━━━━━━━━━━━━━━━━━`;

      const mentionsList = [
        { tag: user1Name, id: user1ID },
        { tag: user2Name, id: user2ID }
      ];

      return message.reply({
        body: response,
        mentions: mentionsList
      });

    } catch (error) {
      console.error(error);
      return message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗆𝖺𝗍𝖼𝗁𝗆𝖺𝗄𝗂𝗇𝗀");
    }
  }
};
