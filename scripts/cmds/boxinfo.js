const fs = require("fs");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "boxinfo",
    aliases: ["groupinfo", "gcinfo"],
    version: "3.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "View detailed group information",
    category: "box chat",
    guide: {
      en: "{pn} - Show complete group information"
    }
  },

  onStart: async function ({ api, event, threadsData }) {
    const { threadID } = event;
    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, `groupinfo_${threadID}.png`);

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    try {
      const info = await api.getThreadInfo(threadID);
      const threadData = await threadsData.get(threadID);

      // Count genders
      let male = 0, female = 0, unknown = 0;
      for (const u of info.userInfo) {
        if (u.gender === "MALE") male++;
        else if (u.gender === "FEMALE") female++;
        else unknown++;
      }

      // Calculate group stats
      const totalMembers = info.participantIDs.length;
      const totalAdmins = info.adminIDs.length;
      const totalMessages = info.messageCount || 0;

      // Format creation date
      const createdDate = info.threadCreatedTime 
        ? new Date(info.threadCreatedTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";

      // Build message
      const text = 
`📊 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
━━━━━━━━━━━━━━━━━━

📝 𝖦𝗋𝗈𝗎𝗉 𝖭𝖺𝗆𝖾:
   ${info.threadName || "𝖭𝗈 𝖭𝖺𝗆𝖾"}

🆔 𝖦𝗋𝗈𝗎𝗉 𝖨𝖣:
   ${threadID}

😀 𝖦𝗋𝗈𝗎𝗉 𝖤𝗆𝗈𝗃𝗂:
   ${info.emoji || "❌ 𝖭𝗈𝗍 𝖲𝖾𝗍"}

✅ 𝖠𝗉𝗉𝗋𝗈𝗏𝖺𝗅 𝖬𝗈𝖽𝖾:
   ${info.approvalMode ? "🟢 𝖤𝗇𝖺𝖻𝗅𝖾𝖽" : "🔴 𝖣𝗂𝗌𝖺𝖻𝗅𝖾𝖽"}

📅 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖮𝗇:
   ${createdDate}

━━━━━━━━━━━━━━━━━━

👥 𝗠𝗘𝗠𝗕𝗘𝗥 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦

👤 𝖳𝗈𝗍𝖺𝗅 𝖬𝖾𝗆𝖻𝖾𝗋𝗌: ${totalMembers.toLocaleString()}
👨 𝖬𝖺𝗅𝖾: ${male} (${((male/totalMembers)*100).toFixed(1)}%)
👩 𝖥𝖾𝗆𝖺𝗅𝖾: ${female} (${((female/totalMembers)*100).toFixed(1)}%)
⚧️ 𝖴𝗇𝗄𝗇𝗈𝗐𝗇: ${unknown}
👑 𝖠𝖽𝗆𝗂𝗇𝗌: ${totalAdmins}

━━━━━━━━━━━━━━━━━━

📈 𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗬 𝗦𝗧𝗔𝗧𝗦

💬 𝖳𝗈𝗍𝖺𝗅 𝖬𝖾𝗌𝗌𝖺𝗀𝖾𝗌: ${totalMessages.toLocaleString()}
📊 𝖠𝗏𝖾𝗋𝖺𝗀𝖾/𝖬𝖾𝗆𝖻𝖾𝗋: ${Math.floor(totalMessages/totalMembers).toLocaleString()}

━━━━━━━━━━━━━━━━━━`;

      const send = () => {
        api.sendMessage(
          {
            body: text,
            attachment: fs.existsSync(imgPath)
              ? fs.createReadStream(imgPath)
              : null
          },
          threadID,
          () => {
            // Clean up image after sending
            if (fs.existsSync(imgPath)) {
              fs.unlinkSync(imgPath);
            }
          },
          event.messageID
        );
      };

      // If no group image, send text only
      if (!info.imageSrc) {
        return api.sendMessage(text, threadID, event.messageID);
      }

      // Download and send with image
      request(encodeURI(info.imageSrc))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", send)
        .on("error", (err) => {
          console.error("Image download error:", err);
          // Send without image if download fails
          api.sendMessage(text, threadID, event.messageID);
        });

    } catch (error) {
      console.error("Boxinfo error:", error);
      return api.sendMessage(
        "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇",
        event.threadID,
        event.messageID
      );
    }
  }
};
