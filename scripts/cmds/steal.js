module.exports = {
  config: {
    name: "steal",
    aliases: ["rob"],
    version: "1.0.0",
    author: "CharlesMK",
    countDown: 5,
    role: 0,
    description: "Attempt to steal money from another user's wallet",
    category: "economy",
    guide: {
      en: "{pn} [@mention/reply/UID] [percentage]\n\nExamples:\n{pn} @user - Steal random amount\n{pn} 50% - Steal 50% (requires max level)\n{pn} 100% - Steal all (requires max level)"
    }
  },

  onStart: async function ({ message, event, args, usersData, api }) {
    const { senderID, messageReply } = event;

    // Get target user
    let targetID;
    let percentageArg = null;

    if (messageReply) {
      targetID = messageReply.senderID;
      percentageArg = args[0];
    } else if (Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
      percentageArg = args[1];
    } else if (args[0]) {
      targetID = args[0].replace(/[^0-9]/g, '');
      percentageArg = args[1];
      if (!targetID) {
        return message.reply("❌ Invalid user ID!");
      }
    } else {
      return message.reply("❌ Please mention a user, reply to their message, or provide their UID!");
    }

    // Can't rob yourself
    if (targetID === senderID) {
      return message.reply("🤡 You can't rob yourself, genius!");
    }

    const robber = await usersData.get(senderID);
    const victim = await usersData.get(targetID);

    // Initialize skill data
    if (!robber.data) robber.data = {};
    if (!robber.data.robSkill) {
      robber.data.robSkill = {
        level: 0,
        successRate: 1, // Start at 1%
        lastUpgrade: 0,
        upgradesUsedToday: 0,
        lastReset: Date.now()
      };
    }

    if (!robber.data.robberyLog) robber.data.robberyLog = {};
    if (!robber.data.robberyLog[targetID]) {
      robber.data.robberyLog[targetID] = { lastRob: 0, totalRobbed: 0 };
    }

    if (!victim.data) victim.data = {};
    if (!victim.data.counterSteal) {
      victim.data.counterSteal = {
        level: 0,
        defenseRate: 0,
        lastUpgrade: 0,
        upgradesUsedToday: 0,
        lastReset: Date.now()
      };
    }

    // Check cooldown (24 hours per user)
    const lastRob = robber.data.robberyLog[targetID].lastRob;
    const timeSinceLastRob = Date.now() - lastRob;
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours

    if (timeSinceLastRob < cooldown) {
      const timeLeft = cooldown - timeSinceLastRob;
      const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
      const minsLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      return message.reply(
        `⏰ 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡\n\n` +
        `You already robbed this user today!\n` +
        `Try again in: ${hoursLeft}h ${minsLeft}m`
      );
    }

    // Check if victim has money
    const victimMoney = victim.money || 0;
    if (victimMoney < 100) {
      return message.reply("💸 This user is broke! Not worth robbing.");
    }

    // Get names
    let robberName = "You";
    let victimName = "User";
    try {
      const userInfo = await api.getUserInfo([senderID, targetID]);
      robberName = userInfo[senderID]?.name || "You";
      victimName = userInfo[targetID]?.name || "User";
    } catch (e) {}

    // Calculate success rate
    const robberSkill = robber.data.robSkill.successRate;
    const victimDefense = victim.data.counterSteal.defenseRate;

    // If victim has max defense (100%), they're immune
    if (victimDefense >= 100) {
      return message.reply(
        `🛡️ 𝗜𝗠𝗠𝗨𝗡𝗘 𝗧𝗔𝗥𝗚𝗘𝗧\n\n` +
        `${victimName} has maxed their countersteal!\n` +
        `Their wallet is completely protected! 🔒`
      );
    }

    // Calculate final success rate
    let finalSuccessRate = robberSkill - victimDefense;
    if (finalSuccessRate < 1) finalSuccessRate = 1; // Minimum 1%
    if (finalSuccessRate > 95) finalSuccessRate = 95; // Max 95% to keep it fair

    // Roll the dice
    const roll = Math.random() * 100;
    const success = roll < finalSuccessRate;

    if (!success) {
      // Failed robbery
      robber.data.robberyLog[targetID].lastRob = Date.now();
      await usersData.set(senderID, robber);

      return message.reply(
        `❌ 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗙𝗔𝗜𝗟𝗘𝗗\n\n` +
        `Lmfao, you suck at robbing people. Why don't you just go home and sleep.\n\n` +
        `Or better yet 😎 upgrade your ability to steal\n` +
        `Use: +upgrade rob`
      );
    }

    // Successful robbery!
    let stolenAmount;

    if (robberSkill >= 100 && percentageArg) {
      // Max level - can choose percentage
      const percentage = parseInt(percentageArg.replace('%', ''));
      if (isNaN(percentage) || percentage < 1 || percentage > 100) {
        return message.reply("❌ Invalid percentage! Use 1-100%");
      }
      stolenAmount = Math.floor((victimMoney * percentage) / 100);
    } else {
      // Random amount between 15% and 35% of victim's wallet
      const minPercent = 15;
      const maxPercent = 35;
      const randomPercent = Math.floor(Math.random() * (maxPercent - minPercent + 1)) + minPercent;
      stolenAmount = Math.floor((victimMoney * randomPercent) / 100);
    }

    // Transfer money
    robber.money = (robber.money || 0) + stolenAmount;
    victim.money = victimMoney - stolenAmount;

    robber.data.robberyLog[targetID].lastRob = Date.now();
    robber.data.robberyLog[targetID].totalRobbed += stolenAmount;

    await usersData.set(senderID, robber);
    await usersData.set(targetID, victim);

    // Success message to robber
    message.reply(
      `✅ 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗦𝗨𝗖𝗖𝗘𝗦𝗦! 💰\n\n` +
      `You successfully stole $${stolenAmount.toLocaleString()} from ${victimName}!\n\n` +
      `🎯 Success Rate: ${finalSuccessRate.toFixed(1)}%\n` +
      `💼 Your Skill: ${robberSkill}%\n` +
      `🛡️ Their Defense: ${victimDefense}%`
    );

    // Notify victim
    api.sendMessage(
      `🚨 𝗬𝗢𝗨'𝗩𝗘 𝗕𝗘𝗘𝗡 𝗥𝗢𝗕𝗕𝗘𝗗!\n\n` +
      `${robberName} just stole $${stolenAmount.toLocaleString()} from your wallet account.\n\n` +
      `💡 𝗧𝗶𝗽𝘀:\n` +
      `• Put money in the bank: +bank deposit [amount]\n` +
      `• Upgrade your defenses: +upgrade countersteal\n` +
      `• Claim free daily upgrade: +daily countersteal`,
      targetID
    );
  }
};
