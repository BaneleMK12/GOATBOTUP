module.exports = {
  config: {
    name: "setmoney",
    aliases: ["setbalance", "editmoney"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 3,
    role: 2,
    description: {
      en: "Set money balance for yourself or other users (Admin only)"
    },
    category: "economy",
    guide: {
      en: "{pn} <amount> - Set your own balance\n{pn} @mention <amount> - Set mentioned user's balance\n{pn} <uid> <amount> - Set user's balance by UID\n\nExamples:\n{pn} 1000\n{pn} @John 5000\n{pn} 100012345678901 2500\n\n⚠️ Admin only command"
    }
  },

  onStart: async function ({ args, message, event, usersData, api }) {
    const { senderID, mentions } = event;

    if (args.length === 0) {
      return message.reply(
        "❌ Please provide the required information.\n\n" +
        "Usage:\n" +
        "• +setmoney 1000 (set your balance)\n" +
        "• +setmoney @user 5000 (set tagged user's balance)\n" +
        "• +setmoney <uid> 2500 (set user's balance by UID)"
      );
    }

    let targetUID = senderID;
    let amount;
    let targetName = "Your";

    // Check if user is mentioned
    if (Object.keys(mentions).length > 0) {
      targetUID = Object.keys(mentions)[0];
      amount = parseInt(args[1]);
      
      try {
        const userInfo = await api.getUserInfo(targetUID);
        targetName = userInfo[targetUID]?.name || "User";
      } catch (error) {
        targetName = "User";
      }
    }
    // Check if first argument is a UID (numeric and long)
    else if (args[0].length > 10 && !isNaN(args[0])) {
      targetUID = args[0];
      amount = parseInt(args[1]);
      
      try {
        const userInfo = await api.getUserInfo(targetUID);
        targetName = userInfo[targetUID]?.name || "User";
      } catch (error) {
        targetName = "User";
      }
    }
    // Set own balance
    else {
      amount = parseInt(args[0]);
      targetName = "Your";
    }

    if (isNaN(amount)) {
      return message.reply("❌ Please enter a valid amount.\nExample: +setmoney 1000");
    }

    if (amount < 0) {
      return message.reply("❌ Amount cannot be negative!");
    }

    try {
      // Get target user data
      const userData = await usersData.get(targetUID);

      // Set the new money amount
      await usersData.set(targetUID, {
        money: amount,
        exp: userData.exp || 0,
        data: userData.data
      });

      const formattedAmount = amount.toLocaleString();

      // Different message for self vs others
      if (targetUID === senderID) {
        return message.reply(
          `✅ 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗!\n\n` +
          `💰 Your New Balance: $${formattedAmount}\n\n` +
          `Your balance has been set successfully!`
        );
      } else {
        return message.reply(
          `✅ 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗!\n\n` +
          `👤 User: ${targetName}\n` +
          `💰 New Balance: $${formattedAmount}\n\n` +
          `Balance has been set successfully!`
        );
      }

    } catch (error) {
      console.error("Error in setmoney command:", error);
      return message.reply("❌ An error occurred while updating the balance. Please try again.");
    }
  }
};
