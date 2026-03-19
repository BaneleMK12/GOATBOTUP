// Store coin flip usage data for each user
const flipUsage = new Map();

module.exports = {
  config: {
    name: "flip",
    aliases: ["coinflip", "coin"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: {
      en: "Flip a coin and win $2000! (30 flips per hour)"
    },
    category: "game",
    guide: {
      en: "{pn} <head/tail>\nExample: {pn} head\n{pn} tail\n\n⏰ Limit: 30 flips per hour\n💰 Win: $2,000 | Lose: $0"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID } = event;

    // Check if user wants to see their remaining flips
    if (args[0] && args[0].toLowerCase() === "status") {
      const usage = flipUsage.get(senderID);
      
      if (!usage || usage.flips < 30) {
        const flipsLeft = usage ? 30 - usage.flips : 30;
        return message.reply(
          `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣 𝗦𝗧𝗔𝗧𝗨𝗦\n\n` +
          `🎮 Flips remaining: ${flipsLeft}/30\n` +
          `✅ Ready to play!`
        );
      }

      const now = Date.now();
      const timeLeft = usage.resetTime - now;
      
      if (timeLeft <= 0) {
        flipUsage.delete(senderID);
        return message.reply(
          `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣 𝗦𝗧𝗔𝗧𝗨𝗦\n\n` +
          `🎮 Flips remaining: 30/30\n` +
          `✅ Your flips have been reset!`
        );
      }

      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      
      return message.reply(
        `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣 𝗦𝗧𝗔𝗧𝗨𝗦\n\n` +
        `🎮 Flips used: 30/30\n` +
        `⏰ Cooldown: ${minutes}m ${seconds}s\n\n` +
        `Come back later to flip again!`
      );
    }

    if (!args[0]) {
      return message.reply(
        `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣\n\n` +
        `Choose your side:\n` +
        `+flip head\n` +
        `+flip tail\n\n` +
        `💰 Win: $2,000\n` +
        `❌ Lose: $0 (Free to play!)\n\n` +
        `Check status: +flip status`
      );
    }

    const choice = args[0].toLowerCase();

    // Validate choice
    if (choice !== "head" && choice !== "heads" && choice !== "tail" && choice !== "tails") {
      return message.reply(
        `❌ Invalid choice!\n\n` +
        `Choose either:\n` +
        `+flip head\n` +
        `+flip tail`
      );
    }

    // Normalize choice
    const userChoice = (choice === "head" || choice === "heads") ? "head" : "tail";

    // Get or initialize user's flip usage
    const now = Date.now();
    let usage = flipUsage.get(senderID);

    // Reset if cooldown period has passed
    if (usage && now >= usage.resetTime) {
      flipUsage.delete(senderID);
      usage = null;
    }

    // Initialize usage if not exists
    if (!usage) {
      usage = {
        flips: 0,
        resetTime: now + 3600000 // 1 hour from now
      };
      flipUsage.set(senderID, usage);
    }

    // Check if user has exceeded flip limit
    if (usage.flips >= 30) {
      const timeLeft = usage.resetTime - now;
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      return message.reply(
        `⏰ 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡\n\n` +
        `You've used all 30 flips! 🪙\n\n` +
        `⏳ Time remaining: ${minutes}m ${seconds}s\n\n` +
        `Come back later to play again!\n` +
        `Check status anytime: +flip status`
      );
    }

    // Flip the coin (50/50 chance)
    const coinResult = Math.random() < 0.5 ? "head" : "tail";

    // Get user data
    const userData = await usersData.get(senderID);
    const balance = userData.money || 0;

    // Increment flip count
    usage.flips += 1;
    flipUsage.set(senderID, usage);

    // Calculate flips remaining
    const flipsLeft = 30 - usage.flips;

    // Coin flip animation
    const coinEmoji = coinResult === "head" ? "🟡" : "⚪";
    const resultEmoji = coinResult === "head" ? "👑" : "🦅";

    if (userChoice === coinResult) {
      // WIN!
      const newBalance = balance + 2000;

      await usersData.set(senderID, {
        money: newBalance,
        exp: userData.exp,
        data: userData.data
      });

      let flipInfo = flipsLeft > 0 ? `\n🎮 Flips left: ${flipsLeft}/30` : `\n⏰ No flips left! Cooldown: 1 hour`;

      return message.reply(
        `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣\n\n` +
        `${coinEmoji} Flipping...\n\n` +
        `${resultEmoji} Result: ${coinResult.toUpperCase()}!\n` +
        `Your choice: ${userChoice.toUpperCase()}\n\n` +
        `✅ 𝗬𝗢𝗨 𝗪𝗜𝗡! 🎉\n` +
        `+$2,000\n\n` +
        `💰 New Balance: $${newBalance.toLocaleString()}${flipInfo}`
      );
    } else {
      // LOSE (but no money lost)
      let flipInfo = flipsLeft > 0 ? `\n🎮 Flips left: ${flipsLeft}/30` : `\n⏰ No flips left! Cooldown: 1 hour`;

      return message.reply(
        `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣\n\n` +
        `${coinEmoji} Flipping...\n\n` +
        `${resultEmoji} Result: ${coinResult.toUpperCase()}\n` +
        `Your choice: ${userChoice.toUpperCase()}\n\n` +
        `❌ 𝗬𝗢𝗨 𝗟𝗢𝗦𝗘! 😔\n` +
        `Better luck next time!\n\n` +
        `💰 Balance: $${balance.toLocaleString()}${flipInfo}`
      );
    }
  }
};
