module.exports = {
  config: {
    name: "restrict",
    aliases: ["block-command"],
    version: "1.0",
    author: "Charles MK",
    countDown: 5,
    role: 2,
    description: "Restrict users or commands from being used",
    category: "admin",
    guide: {
      en: "{pn} @user {command} - Block user from command\n" +
          "{pn} {command} - Make command admin-only"
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
        "• +restrict @user {command}\n" +
        "• +restrict {command}");
    }

    // Remove + prefix if included
    targetCommand = targetCommand.replace(/^\+/, '').toLowerCase();

    // 2. Load and initialize restrictions
    const threadData = await threadsData.get(threadID);
    if (!threadData.data) threadData.data = {};
    if (!threadData.data.restrictions) {
      threadData.data.restrictions = { users: {}, global: [] };
    }
    
    const restrictions = threadData.data.restrictions;

    // 3. Handle restrict
    if (targetID) {
      // Restrict user from command
      if (!restrictions.users) restrictions.users = {};
      if (!restrictions.users[targetID]) {
        restrictions.users[targetID] = [];
      }

      if (restrictions.users[targetID].includes(targetCommand)) {
        return message.reply(`⚠️ 𝖴𝗌𝖾𝗋 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 𝖿𝗋𝗈𝗆 ${targetCommand}`);
      }

      restrictions.users[targetID].push(targetCommand);
      await threadsData.set(threadID, { data: threadData.data });

      const userName = await usersData.getName(targetID);
      return message.reply(`🚫 𝖱𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 ${userName} 𝖿𝗋𝗈𝗆 ${targetCommand}`);
    } else {
      // Restrict command to admins only
      if (!restrictions.global) restrictions.global = [];

      if (restrictions.global.includes(targetCommand)) {
        return message.reply(`⚠️ ${targetCommand} 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝖾𝖽 𝗍𝗈 𝖺𝖽𝗆𝗂𝗇𝗌`);
      }

      restrictions.global.push(targetCommand);
      await threadsData.set(threadID, { data: threadData.data });
      
      return message.reply(`👑 ${targetCommand} 𝗂𝗌 𝗇𝗈𝗐 𝖺𝖽𝗆𝗂𝗇-𝗈𝗇𝗅𝗒`);
    }
  }
};
