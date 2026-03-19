module.exports = {
  config: {
    name: "inventory",
    aliases: ["inv", "bag", "items"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: {
      en: "View your purchased items from MK-TUCKSHOP"
    },
    category: "economy",
    guide: {
      en: "{pn} - View all your items\n{pn} <category> - View items in a specific category\n\nCategories: bakery, drinks, snacks, alcohol, tech, clothing"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID } = event;

    try {
      const userData = await usersData.get(senderID);
      const inventory = userData.data?.inventory || {};

      // Category display names
      const categoryNames = {
        bakery: "🥐 BAKERY",
        drinks: "🥤 DRINKS",
        snacks: "🍿 SNACKS",
        alcohol: "🍺 ALCOHOL",
        tech: "📱 TECH",
        clothing: "👕 CLOTHING"
      };

      // Check if inventory is empty
      const hasItems = Object.keys(inventory).some(cat => 
        Object.keys(inventory[cat] || {}).length > 0
      );

      if (!hasItems) {
        return message.reply(
          "📦 𝗬𝗢𝗨𝗥 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬\n" +
          "━━━━━━━━━━━━━━━━━━━━\n\n" +
          "Your inventory is empty! 😢\n\n" +
          "Visit the shop to buy items:\n" +
          "+shop"
        );
      }

      // Show specific category
      if (args.length > 0) {
        const category = args[0].toLowerCase();

        if (!categoryNames[category]) {
          return message.reply(
            `❌ Category "${category}" not found.\n\n` +
            `Available categories:\n` +
            `bakery, drinks, snacks, alcohol, tech, clothing`
          );
        }

        const categoryItems = inventory[category] || {};

        if (Object.keys(categoryItems).length === 0) {
          return message.reply(
            `${categoryNames[category]}\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `You don't have any items in this category.\n\n` +
            `Visit +shop ${category} to buy items!`
          );
        }

        let response = `${categoryNames[category]}\n`;
        response += "━━━━━━━━━━━━━━━━━━━━\n\n";

        for (const [key, item] of Object.entries(categoryItems)) {
          if (item.quantity > 0) {
            response += `${item.emoji} ${item.name}\n`;
            response += `   📦 Quantity: ${item.quantity}\n\n`;
          }
        }

        return message.reply(response);
      }

      // Show all items
      let response = "📦 𝗬𝗢𝗨𝗥 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬\n";
      response += "━━━━━━━━━━━━━━━━━━━━\n\n";

      let totalItems = 0;

      for (const [catKey, categoryItems] of Object.entries(inventory)) {
        const items = Object.entries(categoryItems).filter(([_, item]) => item.quantity > 0);
        
        if (items.length > 0) {
          response += `${categoryNames[catKey]}\n`;
          
          for (const [key, item] of items) {
            response += `  ${item.emoji} ${item.name} x${item.quantity}\n`;
            totalItems += item.quantity;
          }
          
          response += "\n";
        }
      }

      response += "━━━━━━━━━━━━━━━━━━━━\n";
      response += `📊 Total Items: ${totalItems}\n`;
      response += `💰 Balance: $${(userData.money || 0).toLocaleString()}`;

      return message.reply(response);

    } catch (error) {
      console.error("Inventory error:", error);
      return message.reply("❌ An error occurred while loading your inventory.");
    }
  }
};
