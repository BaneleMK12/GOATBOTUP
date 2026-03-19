module.exports = {
  config: {
    name: "restricted",
    aliases: ["restrictions", "banned-commands"],
    version: "1.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    description: "View all command restrictions",
    category: "info",
    guide: {
      en: "{pn} - Show all restrictions in this group"
    }
  },

  onStart: async function ({ api, event, threadsData, usersData, message }) {
    const { threadID } = event;

    const threadData = await threadsData.get(threadID);
    
    // Initialize if doesn't exist
    if (!threadData.data) threadData.data = {};
    if (!threadData.data.restrictions) {
      threadData.data.restrictions = { users: {}, global: [] };
    }
    
    const restrictions = threadData.data.restrictions;

    let response = "🚫 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗥𝗘𝗦𝗧𝗥𝗜𝗖𝗧𝗜𝗢𝗡𝗦\n━━━━━━━━━━━━━━━━━━\n\n";

    // Admin-only commands
    if (restrictions.global && restrictions.global.length > 0) {
      response += "👑 𝗔𝗱𝗺𝗶𝗻-𝗢𝗻𝗹𝘆 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:\n";
      restrictions.global.forEach(cmd => response += `   • ${cmd}\n`);
      response += "\n";
    }

    // User-specific restrictions
    const userIDs = Object.keys(restrictions.users || {});
    if (userIDs.length > 0) {
      response += "👤 𝗨𝘀𝗲𝗿 𝗥𝗲𝘀𝘁𝗿𝗶𝗰𝘁𝗶𝗼𝗻𝘀:\n\n";
      
      for (const userID of userIDs) {
        const userName = await usersData.getName(userID);
        const commands = restrictions.users[userID];
        
        if (commands && commands.length > 0) {
          response += `👤 ${userName}:\n`;
          commands.forEach(cmd => response += `   • ${cmd}\n`);
          response += "\n";
        }
      }
    }

    if ((!restrictions.global || restrictions.global.length === 0) && userIDs.length === 0) {
      response += "✅ 𝖭𝗈 𝖺𝖼𝗍𝗂𝗏𝖾 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝗂𝗈𝗇𝗌";
    }

    return message.reply(response);
  }
};
