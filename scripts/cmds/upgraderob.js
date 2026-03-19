module.exports = {
  config: {
    name: "upgrade",
    aliases: ["upskill", "levelupskill"],
    version: "1.0.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: "Upgrade your robbery or countersteal abilities",
    category: "economy",
    guide: {
      en: "{pn} rob - Upgrade robbery skill ($10,000)\n{pn} countersteal - Upgrade defense ($5,000)\n{pn} status - Check your skill levels"
    }
  },

  onStart: async function ({ message, event, args, usersData, api }) {
    const { senderID } = event;
    const skill = args[0]?.toLowerCase();

    if (!skill || !["rob", "countersteal", "status"].includes(skill)) {
      return message.reply(
        "📋 𝗨𝗣𝗚𝗥𝗔𝗗𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗\n\n" +
        "Available upgrades:\n" +
        "• +upgrade rob ($10,000)\n" +
        "• +upgrade countersteal ($5,000)\n" +
        "• +upgrade status - Check levels\n\n" +
        "💡 Limits: 2 upgrades per day for each skill"
      );
    }

    const user = await usersData.get(senderID);

    // Initialize data
    if (!user.data) user.data = {};
    if (!user.data.robSkill) {
      user.data.robSkill = {
        level: 0,
        successRate: 1,
        lastUpgrade: 0,
        upgradesUsedToday: 0,
        lastReset: Date.now()
      };
    }
    if (!user.data.counterSteal) {
      user.data.counterSteal = {
        level: 0,
        defenseRate: 0,
        lastUpgrade: 0,
        upgradesUsedToday: 0,
        lastReset: Date.now()
      };
    }

    // Reset daily counters if new day
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    if (now - user.data.robSkill.lastReset > dayMs) {
      user.data.robSkill.upgradesUsedToday = 0;
      user.data.robSkill.lastReset = now;
    }

    if (now - user.data.counterSteal.lastReset > dayMs) {
      user.data.counterSteal.upgradesUsedToday = 0;
      user.data.counterSteal.lastReset = now;
    }

    // Status command
    if (skill === "status") {
      const robSkill = user.data.robSkill;
      const counterSteal = user.data.counterSteal;

      const robProgress = Math.min((robSkill.successRate / 100) * 100, 100);
      const defenseProgress = Math.min((counterSteal.defenseRate / 100) * 100, 100);

      const robBar = createProgressBar(robProgress);
      const defenseBar = createProgressBar(defenseProgress);

      return message.reply(
        `📊 𝗬𝗢𝗨𝗥 𝗦𝗞𝗜𝗟𝗟𝗦\n\n` +
        `🔪 𝗥𝗼𝗯𝗯𝗲𝗿𝘆 𝗦𝗸𝗶𝗹𝗹\n` +
        `${robBar} ${robSkill.successRate}%\n` +
        `Level: ${robSkill.level}\n` +
        `Upgrades today: ${robSkill.upgradesUsedToday}/2\n` +
        `${robSkill.successRate >= 100 ? "✨ MAX LEVEL - Choose steal %" : ""}\n\n` +
        `🛡️ 𝗖𝗼𝘂𝗻𝘁𝗲𝗿𝘀𝘁𝗲𝗮𝗹\n` +
        `${defenseBar} ${counterSteal.defenseRate}%\n` +
        `Level: ${counterSteal.level}\n` +
        `Upgrades today: ${counterSteal.upgradesUsedToday}/2\n` +
        `${counterSteal.defenseRate >= 100 ? "✨ MAX LEVEL - Immune to theft!" : ""}`
      );
    }

    // Upgrade robbery skill
    if (skill === "rob") {
      const robSkill = user.data.robSkill;
      const cost = 10000;

      // Check if already maxed
      if (robSkill.successRate >= 100) {
        return message.reply("✨ Your robbery skill is already maxed out at 100%!");
      }

      // Check daily limit
      if (robSkill.upgradesUsedToday >= 2) {
        return message.reply(
          `⏰ 𝗗𝗔𝗜𝗟𝗬 𝗟𝗜𝗠𝗜𝗧 𝗥𝗘𝗔𝗖𝗛𝗘𝗗\n\n` +
          `You can only upgrade robbery skill twice per day!\n` +
          `Come back tomorrow for more upgrades.`
        );
      }

      // Check money
      if ((user.money || 0) < cost) {
        return message.reply(
          `❌ 𝗡𝗢𝗧 𝗘𝗡𝗢𝗨𝗚𝗛 𝗠𝗢𝗡𝗘𝗬\n\n` +
          `Cost: $${cost.toLocaleString()}\n` +
          `You have: $${(user.money || 0).toLocaleString()}\n` +
          `Need: $${(cost - (user.money || 0)).toLocaleString()} more`
        );
      }

      // Perform upgrade
      user.money -= cost;
      robSkill.level += 1;
      robSkill.successRate = Math.min(robSkill.successRate + 5, 100);
      robSkill.upgradesUsedToday += 1;
      robSkill.lastUpgrade = now;

      await usersData.set(senderID, user);

      const maxLevelMsg = robSkill.successRate >= 100 
        ? "\n\n🎉 MAX LEVEL REACHED!\nYou can now choose the % to steal!\nExample: +rob @user 50%" 
        : "";

      return message.reply(
        `✅ 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗦𝗞𝗜𝗟𝗟 𝗨𝗣𝗚𝗥𝗔𝗗𝗘𝗗!\n\n` +
        `💰 Paid: $${cost.toLocaleString()}\n` +
        `📈 Level: ${robSkill.level}\n` +
        `🎯 Success Rate: ${robSkill.successRate}% (+5%)\n` +
        `📊 Upgrades today: ${robSkill.upgradesUsedToday}/2${maxLevelMsg}`
      );
    }

    // Upgrade countersteal
    if (skill === "countersteal") {
      const counterSteal = user.data.counterSteal;
      const cost = 5000;

      // Check if already maxed
      if (counterSteal.defenseRate >= 100) {
        return message.reply("✨ Your countersteal is already maxed out at 100%!");
      }

      // Check daily limit
      if (counterSteal.upgradesUsedToday >= 2) {
        return message.reply(
          `⏰ 𝗗𝗔𝗜𝗟𝗬 𝗟𝗜𝗠𝗜𝗧 𝗥𝗘𝗔𝗖𝗛𝗘𝗗\n\n` +
          `You can only upgrade countersteal twice per day!\n` +
          `Come back tomorrow for more upgrades.`
        );
      }

      // Check money
      if ((user.money || 0) < cost) {
        return message.reply(
          `❌ 𝗡𝗢𝗧 𝗘𝗡𝗢𝗨𝗚𝗛 𝗠𝗢𝗡𝗘𝗬\n\n` +
          `Cost: $${cost.toLocaleString()}\n` +
          `You have: $${(user.money || 0).toLocaleString()}\n` +
          `Need: $${(cost - (user.money || 0)).toLocaleString()} more`
        );
      }

      // Perform upgrade
      user.money -= cost;
      counterSteal.level += 1;
      counterSteal.defenseRate = Math.min(counterSteal.defenseRate + 5, 100);
      counterSteal.upgradesUsedToday += 1;
      counterSteal.lastUpgrade = now;

      await usersData.set(senderID, user);

      const maxLevelMsg = counterSteal.defenseRate >= 100 
        ? "\n\n🎉 MAX LEVEL REACHED!\nYour wallet is now completely protected!\nNo one can steal from you! 🔒" 
        : "";

      return message.reply(
        `✅ 𝗖𝗢𝗨𝗡𝗧𝗘𝗥𝗦𝗧𝗘𝗔𝗟 𝗨𝗣𝗚𝗥𝗔𝗗𝗘𝗗!\n\n` +
        `💰 Paid: $${cost.toLocaleString()}\n` +
        `📈 Level: ${counterSteal.level}\n` +
        `🛡️ Defense Rate: ${counterSteal.defenseRate}% (+5%)\n` +
        `📊 Upgrades today: ${counterSteal.upgradesUsedToday}/2${maxLevelMsg}`
      );
    }
  }
};

// Helper function to create progress bar
function createProgressBar(percentage) {
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}
