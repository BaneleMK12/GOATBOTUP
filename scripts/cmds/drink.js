module.exports = {
  config: {
    name: "drink",
    aliases: ["sip"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: {
      en: "Drink beverages from your inventory"
    },
    category: "economy",
    guide: {
      en: "{pn} <item> - Drink a beverage\nExample: {pn} water\n{pn} soda\n{pn} beer"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID } = event;

    if (args.length === 0) {
      return message.reply("❌ Please specify what you want to drink.\nExample: +drink water");
    }

    const itemName = args.join(" ").toLowerCase();

    try {
      const userData = await usersData.get(senderID);
      const inventory = userData.data?.inventory || {};

      // Categories that contain drinks
      const drinkCategories = ['drinks', 'alcohol'];
      let foundItem = null;
      let foundCategory = null;
      let foundKey = null;

      // Search for item in drink categories
      for (const category of drinkCategories) {
        if (inventory[category]) {
          for (const [key, item] of Object.entries(inventory[category])) {
            if (key === itemName || item.name.toLowerCase() === itemName) {
              if (item.quantity > 0) {
                foundItem = item;
                foundCategory = category;
                foundKey = key;
                break;
              }
            }
          }
        }
        if (foundItem) break;
      }

      if (!foundItem) {
        return message.reply(
          `❌ You don't have any "${itemName}" to drink!\n\n` +
          `Check your inventory: +inventory\n` +
          `Buy from shop: +shop drinks or +shop alcohol`
        );
      }

      // Consume the item
      inventory[foundCategory][foundKey].quantity -= 1;

      // Different messages for alcohol vs regular drinks
      let drinkMessages;
      
      if (foundCategory === 'alcohol') {
        drinkMessages = [
          "Cheers! 🍻",
          "Feeling good! 🥴",
          "That's the good stuff! 🍷",
          "Bottoms up! 🥂",
          "Smooth! 🍸",
          "Let's party! 🎉",
          "One more! 🍾",
          "Hits different! 🥃"
        ];
      } else {
        drinkMessages = [
          "Refreshing! 😌",
          "So thirst-quenching! 💧",
          "Ahh, much better! 😊",
          "Hydrated! 💪",
          "Delicious! 😋",
          "Just what I needed! ✨",
          "So good! 🤩",
          "Perfect! 👌"
        ];
      }

      const randomMessage = drinkMessages[Math.floor(Math.random() * drinkMessages.length)];

      // Save updated inventory
      await usersData.set(senderID, {
        money: userData.money,
        exp: userData.exp,
        data: userData.data
      });

      return message.reply(
        `${foundItem.emoji} 𝗗𝗥𝗜𝗡𝗞𝗜𝗡𝗚 ${foundItem.name.toUpperCase()}...\n\n` +
        `${randomMessage}\n\n` +
        `📦 Remaining: ${inventory[foundCategory][foundKey].quantity}`
      );

    } catch (error) {
      console.error("Drink command error:", error);
      return message.reply("❌ An error occurred while drinking.");
    }
  }
};
