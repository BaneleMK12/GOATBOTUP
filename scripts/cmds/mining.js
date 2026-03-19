const moment = require("moment-timezone");

// Resource definitions with MINIMUM $70,000 value per mine
const RESOURCES = {
  // Ultra Rare (Precious Metals & Gems) - GUARANTEED $150,000+
  rhodium: { 
    name: "Rhodium", 
    valuePerGram: 15000, 
    unit: "g", 
    rarity: "ultra", 
    emoji: "⚪", 
    minGrams: 10,
    maxGrams: 20
  },
  platinum: { 
    name: "Platinum", 
    valuePerGram: 12000, 
    unit: "g", 
    rarity: "ultra", 
    emoji: "⚪", 
    minGrams: 8,
    maxGrams: 25
  },
  gold: { 
    name: "Gold", 
    valuePerGram: 10000, 
    unit: "g", 
    rarity: "ultra", 
    emoji: "🟡", 
    minGrams: 8,
    maxGrams: 30
  },
  diamond: { 
    name: "Diamond", 
    valuePerGram: 50000, 
    unit: "ct", 
    rarity: "ultra", 
    emoji: "💎", 
    minGrams: 2,
    maxGrams: 5
  },
  emerald: { 
    name: "Emerald", 
    valuePerGram: 40000, 
    unit: "ct", 
    rarity: "ultra", 
    emoji: "💚", 
    minGrams: 2,
    maxGrams: 6
  },
  ruby: { 
    name: "Ruby", 
    valuePerGram: 35000, 
    unit: "ct", 
    rarity: "ultra", 
    emoji: "❤️", 
    minGrams: 3,
    maxGrams: 7
  },
  
  // Rare (High-value metals) - GUARANTEED $120,000+
  palladium: { 
    name: "Palladium", 
    valuePerGram: 8000, 
    unit: "g", 
    rarity: "rare", 
    emoji: "⚪", 
    minGrams: 15,
    maxGrams: 35
  },
  iridium: { 
    name: "Iridium", 
    valuePerGram: 7000, 
    unit: "g", 
    rarity: "rare", 
    emoji: "⚪", 
    minGrams: 12,
    maxGrams: 30
  },
  osmium: { 
    name: "Osmium", 
    valuePerGram: 6000, 
    unit: "g", 
    rarity: "rare", 
    emoji: "🔵", 
    minGrams: 15,
    maxGrams: 40
  },
  sapphire: { 
    name: "Sapphire", 
    valuePerGram: 30000, 
    unit: "ct", 
    rarity: "rare", 
    emoji: "💙", 
    minGrams: 3,
    maxGrams: 8
  },
  
  // Uncommon (Industrial precious metals) - GUARANTEED $100,000+
  rhenium: { 
    name: "Rhenium", 
    valuePerGram: 5000, 
    unit: "g", 
    rarity: "uncommon", 
    emoji: "⚪", 
    minGrams: 20,
    maxGrams: 50
  },
  ruthenium: { 
    name: "Ruthenium", 
    valuePerGram: 4500, 
    unit: "g", 
    rarity: "uncommon", 
    emoji: "⚪", 
    minGrams: 18,
    maxGrams: 45
  },
  silver: { 
    name: "Silver", 
    valuePerGram: 1000, 
    unit: "g", 
    rarity: "uncommon", 
    emoji: "⚪", 
    minGrams: 80,
    maxGrams: 200
  },
  
  // Common (Industrial metals) - GUARANTEED $70,000+
  lithium: { 
    name: "Lithium", 
    valuePerGram: 150, 
    unit: "kg", 
    rarity: "common", 
    emoji: "⚪", 
    minGrams: 500,
    maxGrams: 1000
  },
  cobalt: { 
    name: "Cobalt", 
    valuePerGram: 120, 
    unit: "kg", 
    rarity: "common", 
    emoji: "🔵", 
    minGrams: 600,
    maxGrams: 1200
  },
  titanium: { 
    name: "Titanium", 
    valuePerGram: 100, 
    unit: "kg", 
    rarity: "common", 
    emoji: "⚪", 
    minGrams: 700,
    maxGrams: 1500
  },
  tungsten: { 
    name: "Tungsten", 
    valuePerGram: 90, 
    unit: "kg", 
    rarity: "common", 
    emoji: "⚫", 
    minGrams: 800,
    maxGrams: 1600
  },
  copper: { 
    name: "Copper", 
    valuePerGram: 80, 
    unit: "kg", 
    rarity: "common", 
    emoji: "🟠", 
    minGrams: 900,
    maxGrams: 1800
  },
  nickel: { 
    name: "Nickel", 
    valuePerGram: 75, 
    unit: "kg", 
    rarity: "common", 
    emoji: "⚪", 
    minGrams: 1000,
    maxGrams: 2000
  }
};

// Mining locations data (official locations)
const MINING_LOCATIONS = {
  johannesburg: {
    name: "Johannesburg, South Africa",
    emoji: "🇿🇦",
    rarityBoost: { ultra: 5, rare: 15, uncommon: 30, common: 50 }
  },
  kimberley: {
    name: "Kimberley Diamond Fields",
    emoji: "💎",
    rarityBoost: { ultra: 12, rare: 18, uncommon: 30, common: 40 }
  },
  egypt: {
    name: "Egyptian Gold Mines",
    emoji: "🇪🇬",
    rarityBoost: { ultra: 8, rare: 20, uncommon: 32, common: 40 }
  },
  alaska: {
    name: "Alaska Gold Rush",
    emoji: "🇺🇸",
    rarityBoost: { ultra: 10, rare: 22, uncommon: 28, common: 40 }
  },
  chile: {
    name: "Chilean Copper Mines",
    emoji: "🇨🇱",
    rarityBoost: { ultra: 5, rare: 18, uncommon: 35, common: 42 }
  },
  colombia: {
    name: "Colombian Emerald Mines",
    emoji: "🇨🇴",
    rarityBoost: { ultra: 20, rare: 25, uncommon: 25, common: 30 }
  },
  siberia: {
    name: "Siberian Platinum Fields",
    emoji: "🇷🇺",
    rarityBoost: { ultra: 15, rare: 25, uncommon: 30, common: 30 }
  },
  myanmar: {
    name: "Myanmar Ruby Mines",
    emoji: "🇲🇲",
    rarityBoost: { ultra: 18, rare: 22, uncommon: 28, common: 32 }
  },
  mongolia: {
    name: "Mongolian Rare Earth Deposits",
    emoji: "🇲🇳",
    rarityBoost: { ultra: 7, rare: 20, uncommon: 35, common: 38 }
  },
  australia: {
    name: "Australian Opal Fields",
    emoji: "🇦🇺",
    rarityBoost: { ultra: 12, rare: 23, uncommon: 30, common: 35 }
  },
  newzealand: {
    name: "New Zealand Gold Mines",
    emoji: "🇳🇿",
    rarityBoost: { ultra: 9, rare: 21, uncommon: 32, common: 38 }
  },
  norway: {
    name: "Norwegian Titanium Mines",
    emoji: "🇳🇴",
    rarityBoost: { ultra: 6, rare: 18, uncommon: 36, common: 40 }
  },
  spain: {
    name: "Spanish Silver Mines",
    emoji: "🇪🇸",
    rarityBoost: { ultra: 7, rare: 19, uncommon: 34, common: 40 }
  },
  antarctica: {
    name: "Antarctic Research Station",
    emoji: "🇦🇶",
    rarityBoost: { ultra: 25, rare: 30, uncommon: 25, common: 20 }
  },
  deepsea: {
    name: "Deep Sea Mining Platform",
    emoji: "🌊",
    rarityBoost: { ultra: 22, rare: 28, uncommon: 28, common: 22 }
  }
};

module.exports = {
  config: {
    name: "mine",
    aliases: ["mining", "dig"],
    version: "5.0",
    author: "CharlesMK",
    countDown: 5,
    role: 0,
    shortDescription: "Mine for valuable resources",
    longDescription: "Mine for precious metals, gems, and industrial materials - Location affects rarity!",
    category: "economy",
    guide: {
      en: "{pn} - Mine for resources (3 times per day)\n" +
          "{pn} info - View mining information\n" +
          "{pn} stats - View your mining statistics\n" +
          "{pn} inventory - View all your resources\n" +
          "{pn} reset [@user/reply/UID] - Admin: Reset user's daily mines"
    }
  },

  langs: {
    en: {
      noMinesLeft: "⛏️ 𝗡𝗢 𝗠𝗜𝗡𝗘𝗦 𝗟𝗘𝗙𝗧\n━━━━━━━━━━━━━━━━━━\n\n❌ 𝖸𝗈𝗎'𝗏𝖾 𝗎𝗌𝖾𝖽 𝖺𝗅𝗅 𝗒𝗈𝗎𝗋 𝗆𝗂𝗇𝖾𝗌 𝖿𝗈𝗋 𝗍𝗈𝖽𝖺𝗒!\n\n⏰ 𝖢𝗈𝗆𝖾 𝖻𝖺𝖼𝗄 𝗍𝗈𝗆𝗈𝗋𝗋𝗈𝗐 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾\n⛏️ 𝖣𝖺𝗂𝗅𝗒 𝗋𝖾𝗌𝖾𝗍: 𝖬𝗂𝖽𝗇𝗂𝗀𝗁𝗍 (𝖲𝖠𝖲𝖳)",
      
      miningSuccess: "⛏️ 𝗠𝗜𝗡𝗜𝗡𝗚 𝗥𝗘𝗦𝗨𝗟𝗧\n━━━━━━━━━━━━━━━━━━\n\n📍 %1 %2\n%3\n\n%4\n\n📊 𝗠𝗶𝗻𝗲𝘀 𝗟𝗲𝗳𝘁: %5/3\n🔥 𝗦𝘁𝗿𝗲𝗮𝗸: %6 𝖽𝖺𝗒(𝗌)\n%7\n━━━━━━━━━━━━━━━━━━",
      
      goldStoneReward: "🎉 𝗚𝗢𝗟𝗗 𝗦𝗧𝗢𝗡𝗘 𝗕𝗢𝗡𝗨𝗦!\n🏆 +1 𝖦𝗈𝗅𝖽 𝖲𝗍𝗈𝗇𝖾 (5-𝖽𝖺𝗒 𝗌𝗍𝗋𝖾𝖺𝗄!)\n💰 𝖵𝖺𝗅𝗎𝖾: $500,000",
      
      streakProgress: "💪 %1 𝗆𝗈𝗋𝖾 𝖽𝖺𝗒(𝗌) 𝖿𝗈𝗋 𝖦𝗈𝗅𝖽 𝖲𝗍𝗈𝗇𝖾!",
      
      streakLost: "⚠️ 𝖲𝗍𝗋𝖾𝖺𝗄 𝗋𝖾𝗌𝖾𝗍! 𝖬𝗂𝗇𝖾 𝖽𝖺𝗂𝗅𝗒 𝗍𝗈 𝖻𝗎𝗂𝗅𝖽 𝗌𝗍𝗋𝖾𝖺𝗄",
      
      info: "⛏️ 𝗠𝗜𝗡𝗜𝗡𝗚 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━\n\n💎 𝗚𝘂𝗮𝗿𝗮𝗻𝘁𝗲𝗲𝗱 𝗩𝗮𝗹𝘂𝗲:\n   • 𝖤𝗏𝖾𝗋𝗒 𝗆𝗂𝗇𝖾: $70,000+\n   • 𝖴𝗅𝗍𝗋𝖺 𝖱𝖺𝗋𝖾: $80,000-$300,000\n   • 𝖱𝖺𝗋𝖾: $84,000-$280,000\n   • 𝖴𝗇𝖼𝗈𝗆𝗆𝗈𝗇: $80,000-$250,000\n   • 𝖢𝗈𝗆𝗆𝗈𝗇: $70,000-$150,000\n\n🌍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 𝗠𝗮𝘁𝘁𝗲𝗿𝘀!\n   • 𝖣𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇𝗌 = 𝖣𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗋𝖺𝗋𝗂𝗍𝗒 𝗋𝖺𝗍𝖾𝗌\n   • 𝖴𝗌𝖾 +locations 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗅𝗅\n   • 𝖴𝗌𝖾 +travel 𝗍𝗈 𝗆𝗈𝗏𝖾\n\n👑 𝗨𝘀𝗲𝗿-𝗢𝘄𝗻𝗲𝗱 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻𝘀:\n   • 𝖮𝗐𝗇𝖾𝗋 𝖾𝖺𝗋𝗇𝗌 80%% 𝗈𝖿 𝖺𝗅𝗅 𝗆𝗂𝗇𝖾𝗌\n   • 𝖸𝗈𝗎 𝗄𝖾𝖾𝗉 20%%\n   • 𝖴𝗌𝖾 +discover 𝗍𝗈 𝖿𝗂𝗇𝖽 𝗇𝖾𝗐 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇𝗌\n\n🏆 𝗚𝗼𝗹𝗱 𝗦𝘁𝗼𝗻𝗲:\n   • 𝖱𝖾𝗐𝖺𝗋𝖽: 5-𝖽𝖺𝗒 𝗌𝗍𝗋𝖾𝖺𝗄\n   • 𝖵𝖺𝗅𝗎𝖾: $500,000\n\n⏰ 𝗗𝗮𝗶𝗹𝘆 𝗟𝗶𝗺𝗶𝘁: 3 𝗆𝗂𝗇𝖾𝗌\n━━━━━━━━━━━━━━━━━━",
      
      stats: "📊 𝗠𝗜𝗡𝗜𝗡𝗚 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦\n━━━━━━━━━━━━━━━━━━\n\n📍 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻:\n   %1 %2\n\n⛏️ 𝗧𝗼𝗱𝗮𝘆'𝘀 𝗠𝗶𝗻𝗲𝘀: %3/3\n🔥 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝘁𝗿𝗲𝗮𝗸: %4 𝖽𝖺𝗒(𝗌)\n📈 𝗧𝗼𝘁𝗮𝗹 𝗠𝗶𝗻𝗲𝘀: %5\n🏆 𝗚𝗼𝗹𝗱 𝗦𝘁𝗼𝗻𝗲𝘀: %6\n\n💰 𝗧𝗼𝘁𝗮𝗹 𝗪𝗲𝗮𝗹𝘁𝗵: $%7\n\n💡 𝖴𝗌𝖾 +mine inventory 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗅𝗅 𝗋𝖾𝗌𝗈𝗎𝗋𝖼𝖾𝗌\n━━━━━━━━━━━━━━━━━━",
      
      inventory: "🎒 𝗥𝗘𝗦𝗢𝗨𝗥𝗖𝗘 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬\n━━━━━━━━━━━━━━━━━━\n\n%1\n\n💰 𝗧𝗼𝘁𝗮𝗹 𝗩𝗮𝗹𝘂𝗲: $%2\n🏆 𝗚𝗼𝗹𝗱 𝗦𝘁𝗼𝗻𝗲𝘀: %3 ($%4)\n💎 𝗚𝗿𝗮𝗻𝗱 𝗧𝗼𝘁𝗮𝗹: $%5\n━━━━━━━━━━━━━━━━━━",
      
      emptyInventory: "📦 𝖸𝗈𝗎𝗋 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒!\n⛏️ 𝖲𝗍𝖺𝗋𝗍 𝗆𝗂𝗇𝗂𝗇𝗀 𝗍𝗈 𝖼𝗈𝗅𝗅𝖾𝖼𝗍 𝗋𝖾𝗌𝗈𝗎𝗋𝖼𝖾𝗌",
      
      resetSuccess: "✅ 𝗥𝗘𝗦𝗘𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n━━━━━━━━━━━━━━━━━━\n\n👤 𝗨𝘀𝗲𝗿: %1\n⛏️ 𝗗𝗮𝗶𝗹𝘆 𝗠𝗶𝗻𝗲𝘀: 𝖱𝖾𝗌𝖾𝗍 𝗍𝗈 3/3\n\n💡 𝖳𝗁𝖾𝗒 𝖼𝖺𝗇 𝗇𝗈𝗐 𝗆𝗂𝗇𝖾 𝖺𝗀𝖺𝗂𝗇!\n━━━━━━━━━━━━━━━━━━",
      
      noPermission: "❌ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!",
      
      userNotFound: "❌ 𝖴𝗌𝖾𝗋 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽!\n\n💡 𝖴𝗌𝖺𝗀𝖾: +mine reset [@user/reply/UID]",
      
      traveling: "✈️ 𝗖𝗔𝗡'𝗧 𝗠𝗜𝗡𝗘 𝗪𝗛𝗜𝗟𝗘 𝗧𝗥𝗔𝗩𝗘𝗟𝗜𝗡𝗚\n━━━━━━━━━━━━━━━━━━\n\n🚀 𝖸𝗈𝗎'𝗋𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗍𝗋𝖺𝗏𝖾𝗅𝗂𝗇𝗀 𝗍𝗈: %1\n⏰ 𝖠𝗋𝗋𝗂𝗏𝖺𝗅: %2\n\n💡 𝖶𝖺𝗂𝗍 𝗎𝗇𝗍𝗂𝗅 𝗒𝗈𝗎 𝖺𝗋𝗋𝗂𝗏𝖾 𝗍𝗈 𝗆𝗂𝗇𝖾!\n━━━━━━━━━━━━━━━━━━"
    }
  },

  onStart: async function ({ message, args, event, usersData, getLang }) {
    const { senderID, mentions, messageReply } = event;
    const userData = await usersData.get(senderID);

    // Admin reset feature
    if (args[0] === "reset") {
      const config = global.GoatBot.config;
      const adminBot = config.adminBot || [];
      
      if (!adminBot.includes(senderID)) {
        return message.reply(getLang("noPermission"));
      }

      let targetID = null;
      let targetName = "";

      if (messageReply) {
        targetID = messageReply.senderID;
      } else if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
      } else if (args[1] && /^\d+$/.test(args[1])) {
        targetID = args[1];
      }

      if (!targetID) {
        return message.reply(getLang("userNotFound"));
      }

      const targetUserData = await usersData.get(targetID);
      targetName = targetUserData.name || "User";

      if (!targetUserData.data.mining) {
        targetUserData.data.mining = {
          resources: {},
          goldStones: 0,
          dailyMines: 3,
          lastMineDate: null,
          streak: 0,
          lastStreakDate: null,
          totalMines: 0
        };
      }

      targetUserData.data.mining.dailyMines = 3;
      
      await usersData.set(targetID, {
        data: targetUserData.data
      });

      return message.reply(getLang("resetSuccess", targetName));
    }

    // Show info
    if (args[0] === "info") {
      return message.reply(getLang("info"));
    }

    // Initialize mining data
    if (!userData.data.mining) {
      userData.data.mining = {
        resources: {},
        goldStones: 0,
        dailyMines: 3,
        lastMineDate: null,
        streak: 0,
        lastStreakDate: null,
        totalMines: 0
      };
    }

    // Initialize travel data
    if (!userData.data.travel) {
      userData.data.travel = {
        currentLocation: "johannesburg",
        traveling: false,
        destination: null,
        arrivalTime: null,
        ownedVehicles: [],
        permits: []
      };
    }

    // Initialize global discovered locations
    if (!global.discoveredLocations) {
      global.discoveredLocations = {};
    }

    const miningData = userData.data.mining;
    const travelData = userData.data.travel;

    if (!miningData.resources) {
      miningData.resources = {};
    }

    // Check if traveling
    if (travelData.traveling && travelData.arrivalTime) {
      const now = Date.now();
      const arrivalTime = new Date(travelData.arrivalTime).getTime();
      
      if (now < arrivalTime) {
        const destination = MINING_LOCATIONS[travelData.destination] || 
                          global.discoveredLocations[travelData.destination];
        const arrivalTimeStr = moment(travelData.arrivalTime).tz("Africa/Johannesburg").format("HH:mm:ss");
        
        return message.reply(
          getLang("traveling", destination.name || destination.customName, arrivalTimeStr)
        );
      } else {
        // Auto-arrive
        travelData.currentLocation = travelData.destination;
        travelData.traveling = false;
        travelData.destination = null;
        travelData.arrivalTime = null;
      }
    }

    // Get current location (check both official and discovered)
    let currentLocation = MINING_LOCATIONS[travelData.currentLocation];
    let isDiscoveredLocation = false;
    
    if (!currentLocation && travelData.currentLocation.startsWith("user_")) {
      currentLocation = global.discoveredLocations[travelData.currentLocation];
      isDiscoveredLocation = true;
    }
    
    if (!currentLocation) {
      currentLocation = MINING_LOCATIONS.johannesburg;
      travelData.currentLocation = "johannesburg";
    }

    // Show inventory
    if (args[0] === "inventory" || args[0] === "inv") {
      if (Object.keys(miningData.resources).length === 0 && miningData.goldStones === 0) {
        return message.reply(getLang("emptyInventory"));
      }

      let inventoryText = "";
      let totalValue = 0;

      const grouped = { ultra: [], rare: [], uncommon: [], common: [] };
      
      for (const [resourceId, amount] of Object.entries(miningData.resources)) {
        if (amount > 0 && RESOURCES[resourceId]) {
          const resource = RESOURCES[resourceId];
          const value = amount * resource.valuePerGram;
          totalValue += value;
          grouped[resource.rarity].push({
            emoji: resource.emoji,
            name: resource.name,
            amount: amount,
            unit: resource.unit,
            value: value
          });
        }
      }

      const rarityLabels = {
        ultra: "🌟 𝗨𝗹𝘁𝗿𝗮 𝗥𝗮𝗿𝗲",
        rare: "⭐ 𝗥𝗮𝗿𝗲",
        uncommon: "✨ 𝗨𝗻𝗰𝗼𝗺𝗺𝗼𝗻",
        common: "📦 𝗖𝗼𝗺𝗺𝗼𝗻"
      };

      for (const [rarity, items] of Object.entries(grouped)) {
        if (items.length > 0) {
          inventoryText += `${rarityLabels[rarity]}:\n`;
          items.forEach(item => {
            inventoryText += `   ${item.emoji} ${item.name}: ${item.amount.toFixed(2)}${item.unit} ($${item.value.toLocaleString()})\n`;
          });
          inventoryText += "\n";
        }
      }

      if (inventoryText === "") {
        return message.reply(getLang("emptyInventory"));
      }

      const goldValue = (miningData.goldStones || 0) * 500000;
      const grandTotal = totalValue + goldValue;

      return message.reply(
        getLang("inventory", 
          inventoryText.trim(),
          totalValue.toLocaleString(),
          miningData.goldStones || 0,
          goldValue.toLocaleString(),
          grandTotal.toLocaleString()
        )
      );
    }

    // Show stats
    if (args[0] === "stats") {
      let totalValue = 0;
      
      if (miningData.resources && typeof miningData.resources === 'object') {
        for (const [resourceId, amount] of Object.entries(miningData.resources)) {
          if (RESOURCES[resourceId]) {
            totalValue += amount * RESOURCES[resourceId].valuePerGram;
          }
        }
      }
      
      totalValue += (miningData.goldStones || 0) * 500000;

      const minesUsed = 3 - (miningData.dailyMines || 3);
      const locationName = currentLocation.customName || currentLocation.name;

      return message.reply(
        getLang("stats",
          currentLocation.emoji,
          locationName,
          minesUsed,
          miningData.streak || 0,
          miningData.totalMines || 0,
          miningData.goldStones || 0,
          totalValue.toLocaleString()
        )
      );
    }

    // Mining logic
    const currentDate = moment.tz("Africa/Johannesburg").format("YYYY-MM-DD");
    const lastMineDate = miningData.lastMineDate;

    if (lastMineDate !== currentDate) {
      miningData.dailyMines = 3;
      miningData.lastMineDate = currentDate;
    }

    if (miningData.dailyMines <= 0) {
      return message.reply(getLang("noMinesLeft"));
    }

    // Determine rarity using LOCATION BOOST
    const rarityRoll = Math.random() * 100;
    let selectedRarity = "common";
    let cumulativeChance = 0;

    // Use location's rarity chances
    const locationRarities = currentLocation.rarityBoost;
    
    for (const [rarity, chance] of Object.entries(locationRarities)) {
      cumulativeChance += chance;
      if (rarityRoll <= cumulativeChance) {
        selectedRarity = rarity;
        break;
      }
    }

    // Get resources of selected rarity
    const availableResources = Object.entries(RESOURCES)
      .filter(([_, res]) => res.rarity === selectedRarity);
    
    const [resourceId, resource] = availableResources[
      Math.floor(Math.random() * availableResources.length)
    ];

    // Calculate amount using minGrams/maxGrams
    const gramsFound = Math.random() * (resource.maxGrams - resource.minGrams) + resource.minGrams;
    const roundedAmount = Math.round(gramsFound * 100) / 100;
    const value = Math.floor(roundedAmount * resource.valuePerGram);

    // Check if current location is user-discovered and calculate tax
    let ownerTax = 0;
    let locationOwner = null;
    let ownerName = "";

    if (isDiscoveredLocation && currentLocation.ownerId !== senderID) {
      // Calculate 80% tax for location owner
      ownerTax = Math.floor(value * 0.80);
      locationOwner = currentLocation.ownerId;
      
      // Add to owner's pending earnings
      try {
        const ownerData = await usersData.get(locationOwner);
        if (ownerData) {
          if (!ownerData.data.discoveries) {
            ownerData.data.discoveries = {
              ownedLocations: [],
              pendingEarnings: 0,
              totalEarnings: 0,
              totalDiscoveries: 0
            };
          }
          
          ownerData.data.discoveries.pendingEarnings += ownerTax;
          ownerData.data.discoveries.totalEarnings += ownerTax;
          await usersData.set(locationOwner, { data: ownerData.data });
          
          ownerName = ownerData.name || "Unknown";
        }
      } catch (error) {
        console.error("Error updating owner earnings:", error);
      }
      
      // Update location stats
      currentLocation.totalMines += 1;
      currentLocation.ownerEarnings += ownerTax;
    }

    // Calculate final value after tax
    const finalValue = value - ownerTax;

    // Update resources
    if (!miningData.resources[resourceId]) {
      miningData.resources[resourceId] = 0;
    }
    miningData.resources[resourceId] += roundedAmount;

    // Update streak
    const yesterday = moment.tz("Africa/Johannesburg").subtract(1, 'days').format("YYYY-MM-DD");
    const lastStreakDate = miningData.lastStreakDate;

    let streakMessage = "";

    if (lastStreakDate === yesterday || lastStreakDate === currentDate) {
      if (lastStreakDate !== currentDate) {
        miningData.streak += 1;
        miningData.lastStreakDate = currentDate;
      }
    } else if (lastStreakDate !== currentDate) {
      if (miningData.streak > 0 && lastStreakDate !== null) {
        streakMessage = getLang("streakLost") + "\n";
      }
      miningData.streak = 1;
      miningData.lastStreakDate = currentDate;
    }

    // Check for gold stone
    if (miningData.streak === 5) {
      miningData.goldStones = (miningData.goldStones || 0) + 1;
      miningData.streak = 0;
      streakMessage = getLang("goldStoneReward");
    } else if (miningData.streak > 0) {
      const daysLeft = 5 - miningData.streak;
      streakMessage = getLang("streakProgress", daysLeft);
    }

    // Update data
    miningData.dailyMines -= 1;
    miningData.totalMines = (miningData.totalMines || 0) + 1;

    userData.data.mining = miningData;
    userData.data.travel = travelData;
    await usersData.set(senderID, {
      data: userData.data
    });

    // Build result message
    const rarityEmojis = {
      ultra: "🌟",
      rare: "⭐",
      uncommon: "✨",
      common: "📦"
    };

    // Build tax message
    let taxText = "";
    if (ownerTax > 0) {
      taxText = `\n👑 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 𝗢𝘄𝗻𝗲𝗿: ${ownerName}\n💸 𝗢𝘄𝗻𝗲𝗿 𝗧𝗮𝘅 (80%): $${ownerTax.toLocaleString()}\n💵 𝗬𝗼𝘂 𝗞𝗲𝗲𝗽 (20%): $${finalValue.toLocaleString()}`;
    }

    const resultText = `${rarityEmojis[selectedRarity]} ${resource.emoji} +${roundedAmount}${resource.unit} ${resource.name}\n💰 𝖳𝗈𝗍𝖺𝗅 𝖵𝖺𝗅𝗎𝖾: $${value.toLocaleString()}${taxText}\n🎯 𝖱𝖺𝗋𝗂𝗍𝗒: ${resource.rarity.toUpperCase()}`;

    const minesLeft = miningData.dailyMines;
    const currentStreak = miningData.streak;
    const locationName = currentLocation.customName || currentLocation.name;
    const locationOwnerTag = isDiscoveredLocation && currentLocation.ownerId === senderID ? " 👑" : "";

    return message.reply(
      getLang("miningSuccess",
        currentLocation.emoji,
        locationName + locationOwnerTag,
        resultText,
        "",
        minesLeft,
        currentStreak,
        streakMessage
      )
    );
  }
};
