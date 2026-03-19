const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "dualshop",
        version: "1.1.0",
        author: "Charles MK",
        countDown: 5,
        role: 0,
        description: "Modular RPG Shop",
        category: "game",
        guide: "{pn} [ID]"
    },

    onStart: async function ({ api, event, args, usersData }) {
        const { threadID, messageID, senderID } = event;
        const dirPath = path.join(__dirname, "weapons");

        // Helper to load JSON files safely
        const loadData = (file) => JSON.parse(fs.readFileSync(path.join(dirPath, file), "utf8"));

        try {
            const weapons = loadData("weapons.json");
            const utility = loadData("utility.json");
            const allItems = [...weapons, ...utility];

            const userData = await usersData.get(senderID);
            let money = userData.money || 0;
            let inventory = userData.data.inventory || [];

            // 1. SHOW THE SHOP MENU
            if (!args[0]) {
                let msg = `🏪 𝗠𝗞-𝗕𝗢𝗧 𝗠𝗢𝗗𝗨𝗟𝗔𝗥 𝗦𝗛𝗢𝗣 🏪\n`;
                msg += `💰 Balance: $${money.toLocaleString()}\n`;
                msg += `━━━━━━━━━━━━━━━━━━━━\n\n⚔️ 𝗪𝗘𝗔𝗣𝗢𝗡𝗦:\n`;
                weapons.forEach(i => msg += `[${i.id}] ${i.name} - $${i.price.toLocaleString()}\n`);
                
                msg += `\n🧪 𝗨𝗧𝗜𝗟𝗜𝗧𝗬:\n`;
                utility.forEach(i => msg += `[${i.id}] ${i.name} - $${i.price.toLocaleString()}\n`);
                
                msg += `\n━━━━━━━━━━━━━━━━━━━━\n💡 Use +dualshop [ID] to buy.`;
                return api.sendMessage(msg, threadID, messageID);
            }

            // 2. PURCHASE LOGIC
            const selected = allItems.find(i => i.id == args[0]);
            if (!selected) return api.sendMessage("❌ Item ID not found!", threadID, messageID);

            if (money < selected.price) {
                return api.sendMessage(`💸 You need $${(selected.price - money).toLocaleString()} more!`, threadID, messageID);
            }

            // Deduct and Save
            money -= selected.price;
            inventory.push(selected.name);
            
            await usersData.set(senderID, {
                money: money,
                data: { ...userData.data, inventory: inventory }
            });

            return api.sendMessage(`✅ Bought ${selected.name}! Check +inventory`, threadID, messageID);

        } catch (err) {
            console.error(err);
            return api.sendMessage("⚠️ Error loading shop files. Ensure the 'weapons' folder exists.", threadID, messageID);
        }
    }
};
