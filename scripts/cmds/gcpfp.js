const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "gcpfp",
    aliases: ["grouppfp", "groupavatar", "gcavatar"],
    version: "1.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    description: "Get group chat profile picture",
    category: "box chat",
    guide: {
      en: "{pn} - Get current group's profile picture\n" +
          "{pn} [thread_id] - Get specific group's profile picture"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;
    const targetThreadID = args[0] || threadID;

    try {
      // Send loading message
      const loadingMsg = await message.reply("⏳ 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾...");

      // Get thread info
      const threadInfo = await api.getThreadInfo(targetThreadID);

      if (!threadInfo) {
        return message.reply("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝗂𝗇𝖽 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇");
      }

      const groupName = threadInfo.threadName || "Unnamed Group";
      const imageUrl = threadInfo.imageSrc;

      if (!imageUrl) {
        return message.reply(
          `❌ 𝗡𝗢 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗣𝗜𝗖𝗧𝗨𝗥𝗘\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `📝 𝖦𝗋𝗈𝗎𝗉: ${groupName}\n\n` +
          `⚠️ 𝖳𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉 𝖽𝗈𝖾𝗌𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖺 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾`
        );
      }

      // Download image
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const fileName = `gcpfp_${targetThreadID}_${Date.now()}.jpg`;
      const filePath = path.join(cacheDir, fileName);

      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Send image with info
      const msgBody = `🖼️ 𝗚𝗥𝗢𝗨𝗣 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗣𝗜𝗖𝗧𝗨𝗥𝗘\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `📝 𝖦𝗋𝗈𝗎𝗉 𝖭𝖺𝗆𝖾: ${groupName}\n` +
        `🆔 𝖦𝗋𝗈𝗎𝗉 𝖨𝖣: ${targetThreadID}\n` +
        `👥 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${threadInfo.participantIDs.length}\n\n` +
        `━━━━━━━━━━━━━━━━━━`;

      await api.sendMessage(
        {
          body: msgBody,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          // Clean up
          api.unsendMessage(loadingMsg.messageID).catch(() => {});
          fs.unlinkSync(filePath);
        },
        event.messageID
      );

    } catch (error) {
      console.error("GCPFP Error:", error);
      return message.reply(
        `❌ 𝗘𝗥𝗥𝗢𝗥\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗀𝗋𝗈𝗎𝗉 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾\n\n` +
        `💡 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋`
      );
    }
  }
};
