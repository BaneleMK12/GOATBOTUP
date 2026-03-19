module.exports = {
  config: {
    name: "unrestrict",
    aliases: ["unblock-command"],
    version: "1.0",
    author: "Charles MK",
    countDown: 5,
    role: 2,
    description: "Remove command restrictions",
    category: "admin",
    guide: {
      en: "{pn} @user {command} - Unblock user from command\n" +
          "{pn} {command} - Remove admin-only restriction"
    }
  },

  onStart: async function ({ api, event, message, args, usersData, threadsData }) {
    const { threadID, messageReply, mentions } = event;

    // 1. Determine target user and command
    let targetID = null;
    let targetCommand = null;

    if (messageReply) {
      targetID = messageReply.senderID;
      targetCommand = args[0];
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
      targetCommand = args.find(arg => !Object.values(mentions).some(name => arg.includes(name)));
    } else if (args.length >= 2 && /^\d+$/.test(args[0])) {
      targetID = args[0];
      targetCommand = args[1];
    } else if (args.length >= 1) {
      targetCommand = args[0];
    }

    if (!targetCommand) {
      return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 𝖺 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗇𝖺𝗆𝖾\n\n" +
        "𝖴𝗌𝖺𝗀𝖾:\n" +
        "• +unrestrict @user {command}\n" +
        "• +unrestrict {command}");
    }

    // Remove + prefix if included
    targetCommand = targetCommand.replace(/^\+/, '').toLowerCase();

    // 2. Load restrictions
    const threadData = await threadsData.get(threadID);
    
    if (!threadData.data || !threadData.data.restrictions) {
      return message.reply("❌ 𝖭𝗈 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝗂𝗈𝗇𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉");
    }
    
    const restrictions = threadData.data.restrictions;

    // 3. Handle unrestrict
    if (targetID) {
      // Unrestrict user from command
      if (!restrictions.users || !restrictions.users[targetID] || !restrictions.users[targetID].includes(targetCommand)) {
        return message.reply(`⚠️ 𝖴𝗌𝖾𝗋 𝗂𝗌 𝗇𝗈𝗍 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 𝖿𝗋𝗈𝗆 ${targetCommand}`);
      }

      restrictions.users[targetID] = restrictions.users[targetID].filter(cmd => cmd !== targetCommand);
      
      if (restrictions.users[targetID].length === 0) {
        delete restrictions.users[targetID];
      }

      const userName = await usersData.getName(targetID);
      await threadsData.set(threadID, { data: threadData.data });
      
      return message.reply(`✅ 𝖴𝗇𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 ${userName} 𝖿𝗋𝗈𝗆 ${targetCommand}`);
    } else {
      // Remove admin-only restriction
      if (!restrictions.global || !restrictions.global.includes(targetCommand)) {
        return message.reply(`⚠️ ${targetCommand} 𝗂𝗌 𝗇𝗈𝗍 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 𝗍𝗈 𝖺𝖽𝗆𝗂𝗇𝗌`);
      }

      restrictions.global = restrictions.global.filter(cmd => cmd !== targetCommand);
      await threadsData.set(threadID, { data: threadData.data });
      
      return message.reply(`🔓 ${targetCommand} 𝗂𝗌 𝗇𝗈𝗐 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗍𝗈 𝖾𝗏𝖾𝗋𝗒𝗈𝗇𝖾`);
    }
  }
};
