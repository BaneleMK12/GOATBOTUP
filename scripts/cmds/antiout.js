module.exports = {
  config: {
    name: "antiout",
    aliases: ["anti-out", "antileave"],
    version: "2.0.0",
    author: "CharlesMK",
    countDown: 5,
    role: 1,
    description: "Automatically add back users who leave the group",
    category: "group",
    guide: {
      en: "{pn} on - Enable antiout\n{pn} off - Disable antiout\n{pn} status - Check current status"
    }
  },

  onStart: async function ({ message, event, args, threadsData, api }) {
    const { threadID, senderID } = event;
    
    const botAdmins = global.GoatBot.config.adminBot || [];
    const threadInfo = await api.getThreadInfo(threadID);
    const isGroupAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
    const isBotAdmin = botAdmins.includes(senderID);

    if (!isBotAdmin && !isGroupAdmin) {
      return message.reply("❌ Only bot admins and group admins can use this command!");
    }

    const action = args[0]?.toLowerCase();

    if (!action || !["on", "off", "status"].includes(action)) {
      return message.reply(
        "📋 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗\n\n" +
        "Usage:\n" +
        "• +antiout on - Enable\n" +
        "• +antiout off - Disable\n" +
        "• +antiout status - Check status"
      );
    }

    const threadData = await threadsData.get(threadID);

    if (action === "status") {
      const isEnabled = threadData.data?.antiout?.enabled || false;
      const totalReadded = threadData.data?.antiout?.totalReadded || 0;
      const lastReadded = threadData.data?.antiout?.lastReadded;
      
      let lastReaddedText = "";
      if (lastReadded) {
        const timeAgo = Math.floor((Date.now() - lastReadded.timestamp) / 1000);
        const mins = Math.floor(timeAgo / 60);
        const timeText = mins > 0 ? `${mins}m ago` : `${timeAgo}s ago`;
        lastReaddedText = `\nLast: ${lastReadded.userName} (${timeText})`;
      }
      
      return message.reply(
        `📊 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 𝗦𝗧𝗔𝗧𝗨𝗦\n\n` +
        `Status: ${isEnabled ? "✅ ENABLED" : "❌ DISABLED"}\n` +
        `Total Re-added: ${totalReadded} users${lastReaddedText}\n\n` +
        `${isEnabled ? "⚡ Users who leave will be silently added back!" : "💤 Antiout is currently disabled"}`
      );
    }

    if (action === "on") {
      await threadsData.set(threadID, {
        data: {
          ...threadData.data,
          antiout: {
            enabled: true,
            totalReadded: threadData.data?.antiout?.totalReadded || 0,
            enabledBy: senderID,
            enabledAt: Date.now()
          }
        }
      });

      return message.reply(
        "✅ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n\n" +
        "🔒 Users who leave will be silently added back!\n" +
        "⚡ Protection is now active."
      );
    }

    if (action === "off") {
      await threadsData.set(threadID, {
        data: {
          ...threadData.data,
          antiout: {
            ...threadData.data?.antiout,
            enabled: false,
            disabledBy: senderID,
            disabledAt: Date.now()
          }
        }
      });

      return message.reply(
        "❌ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗\n\n" +
        "🔓 Users can now leave freely.\n" +
        "💤 Protection is now inactive."
      );
    }
  },

  onEvent: async function ({ event, api, threadsData }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData, author } = event;

    let threadData;
    try {
      threadData = await threadsData.get(threadID);
    } catch (e) {
      return;
    }

    const antioutEnabled = threadData?.data?.antiout?.enabled || false;
    if (!antioutEnabled) return;

    const leftUserID = logMessageData?.leftParticipantFbId;
    if (!leftUserID) return;

    if (author && author !== leftUserID) {
      return;
    }

    setTimeout(async () => {
      try {
        await api.addUserToGroup(leftUserID, threadID);
        
        let userName = "User";
        try {
          const userInfo = await api.getUserInfo(leftUserID);
          userName = userInfo[leftUserID]?.name || "User";
        } catch (e) {}

        const currentTotal = threadData?.data?.antiout?.totalReadded || 0;
        
        await threadsData.set(threadID, {
          data: {
            ...threadData.data,
            antiout: {
              ...threadData.data.antiout,
              totalReadded: currentTotal + 1,
              lastReadded: {
                userID: leftUserID,
                userName: userName,
                timestamp: Date.now()
              }
            }
          }
        });
      } catch (err) {
        // Silently fail
      }
    }, 2000);
  }
};
