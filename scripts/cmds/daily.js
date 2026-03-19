module.exports = {
  config: {
    name: "daily",
    aliases: ["dailyclaim"],
    version: "1.0.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: "Claim daily rewards and free countersteal upgrade",
    category: "economy",
    guide: {
      en: "{pn} - Claim daily money reward\n{pn} countersteal - Claim free countersteal upgrade (once per day)"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const type = args[0]?.toLowerCase();

    const user = await usersData.get(senderID);

    // Initialize data
    if (!user.data) user.data = {};
    if (!user.data.daily) {
      user.data.daily = {
        lastClaim: 0,
        streak: 0
      };
    }
    if (!user.data.counterSteal) {
      user.data.counterSteal = {
        level: 0,
        defenseRate: 0,
        lastUpgrade: 0,
        upgradesUsedToday: 0,
        lastReset: Date.now(),
        lastFreeUpgrade: 0
      };
    }

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Claim free countersteal upgrade
    if (type === "countersteal") {
      const counterSteal = user.data.counterSteal;

      // Check if already maxed
      if (counterSteal.defenseRate >= 100) {
        return message.reply(
          `✨ 𝗠𝗔𝗫 𝗟𝗘𝗩𝗘𝗟\n\n` +
          `Your countersteal is already at 100%!\n` +
          `Your wallet is fully protected! 🔒`
        );
      }

      // Check if already claimed today
      const timeSinceLastFree = now - (counterSteal.lastFreeUpgrade || 0);
      if (timeSinceLastFree < dayMs) {
        const timeLeft = dayMs - timeSinceLastFree;
        const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
        const minsLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        
        return message.reply(
          `⏰ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗖𝗟𝗔𝗜𝗠𝗘𝗗\n\n` +
          `You already claimed your free countersteal upgrade today!\n` +
          `Come back in: ${hoursLeft}h ${minsLeft}m`
        );
      }

      // Give free upgrade
      counterSteal.level += 1;
      counterSteal.defenseRate = Math.min(counterSteal.defenseRate + 5, 100);
      counterSteal.lastFreeUpgrade = now;

      await usersData.set(senderID, user);

      const maxLevelMsg = counterSteal.defenseRate >= 100 
        ? "\n\n🎉 MAX LEVEL REACHED!\nYour wallet is now completely protected!" 
        : "";

      return message.reply(
        `🎁 𝗙𝗥𝗘𝗘 𝗨𝗣𝗚𝗥𝗔𝗗𝗘 𝗖𝗟𝗔𝗜𝗠𝗘𝗗!\n\n` +
        `🛡️ Countersteal upgraded for FREE!\n` +
        `📈 Level: ${counterSteal.level}\n` +
        `🛡️ Defense Rate: ${counterSteal.defenseRate}% (+5%)\n` +
        `⏰ Come back tomorrow for another!${maxLevelMsg}`
      );
    }

    // Regular daily claim
    const timeSinceLastClaim = now - user.data.daily.lastClaim;

    if (timeSinceLastClaim < dayMs) {
      const timeLeft = dayMs - timeSinceLastClaim;
      const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
      const minsLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      
      return message.reply(
        `⏰ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗖𝗟𝗔𝗜𝗠𝗘𝗗\n\n` +
        `You already claimed your daily reward!\n` +
        `Come back in: ${hoursLeft}h ${minsLeft}m\n\n` +
        `💡 Try: +daily countersteal for free defense upgrade!`
      );
    }

    // Update streak
    const twoDays = 2 * dayMs;
    if (timeSinceLastClaim < twoDays) {
      user.data.daily.streak += 1;
    } else {
      user.data.daily.streak = 1;
    }

    const streak = user.data.daily.streak;
    
    // Calculate reward (base + streak bonus)
    const baseReward = 2000;
    const streakBonus = Math.min(streak * 500, 10000); // Max 10k bonus
    const totalReward = baseReward + streakBonus;

    user.money = (user.money || 0) + totalReward;
    user.data.daily.lastClaim = now;

    await usersData.set(senderID, user);

    return message.reply(
      `🎁 𝗗𝗔𝗜𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗 𝗖𝗟𝗔𝗜𝗠𝗘𝗗!\n\n` +
      `💰 Reward: $${totalReward.toLocaleString()}\n` +
      `🔥 Streak: ${streak} day${streak > 1 ? 's' : ''}\n` +
      `🎯 Bonus: $${streakBonus.toLocaleString()}\n\n` +
      `💡 Don't forget: +daily countersteal for free defense!`
    );
  }
};
