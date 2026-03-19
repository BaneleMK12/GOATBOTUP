const moment = require("moment-timezone");

// Import locations from travel.js (same data)
const MINING_LOCATIONS = {
  // AFRICA
  johannesburg: {
    name: "Johannesburg, South Africa",
    country: "South Africa",
    continent: "Africa",
    emoji: "🇿🇦",
    distance: 0,
    rarityBoost: { ultra: 5, rare: 15, uncommon: 30, common: 50 },
    vehicleRequired: null,
    description: "Your starting location. Basic mining opportunities.",
    tier: "starter"
  },
  kimberley: {
    name: "Kimberley Diamond Fields",
    country: "South Africa",
    continent: "Africa",
    emoji: "💎",
    distance: 500,
    rarityBoost: { ultra: 12, rare: 18, uncommon: 30, common: 40 },
    vehicleRequired: null,
    description: "Famous diamond capital. Higher chance of precious gems.",
    tier: "common"
  },
  egypt: {
    name: "Egyptian Gold Mines",
    country: "Egypt",
    continent: "Africa",
    emoji: "🇪🇬",
    distance: 6500,
    rarityBoost: { ultra: 8, rare: 20, uncommon: 32, common: 40 },
    vehicleRequired: "flight",
    description: "Ancient gold deposits. Excellent for precious metals.",
    tier: "uncommon"
  },

  // AMERICAS
  alaska: {
    name: "Alaska Gold Rush",
    country: "USA",
    continent: "North America",
    emoji: "🇺🇸",
    distance: 16000,
    rarityBoost: { ultra: 10, rare: 22, uncommon: 28, common: 40 },
    vehicleRequired: "flight",
    description: "Legendary gold fields. Harsh conditions, great rewards.",
    tier: "rare"
  },
  chile: {
    name: "Chilean Copper Mines",
    country: "Chile",
    continent: "South America",
    emoji: "🇨🇱",
    distance: 8500,
    rarityBoost: { ultra: 5, rare: 18, uncommon: 35, common: 42 },
    vehicleRequired: "flight",
    description: "World's largest copper reserves. Industrial metals abundant.",
    tier: "common"
  },
  colombia: {
    name: "Colombian Emerald Mines",
    country: "Colombia",
    continent: "South America",
    emoji: "🇨🇴",
    distance: 10000,
    rarityBoost: { ultra: 20, rare: 25, uncommon: 25, common: 30 },
    vehicleRequired: "flight",
    requiresPermit: true,
    permitCost: 5000000,
    description: "World's finest emeralds. Requires special permit.",
    tier: "ultra"
  },

  // ASIA
  siberia: {
    name: "Siberian Platinum Fields",
    country: "Russia",
    continent: "Asia",
    emoji: "🇷🇺",
    distance: 12000,
    rarityBoost: { ultra: 15, rare: 25, uncommon: 30, common: 30 },
    vehicleRequired: "flight",
    requiresVehicle: "4x4",
    description: "Frozen tundra rich in platinum and palladium. 4x4 required.",
    tier: "rare"
  },
  myanmar: {
    name: "Myanmar Ruby Mines",
    country: "Myanmar",
    continent: "Asia",
    emoji: "🇲🇲",
    distance: 11000,
    rarityBoost: { ultra: 18, rare: 22, uncommon: 28, common: 32 },
    vehicleRequired: "flight",
    description: "Legendary ruby source. Very high gem rates.",
    tier: "ultra"
  },
  mongolia: {
    name: "Mongolian Rare Earth Deposits",
    country: "Mongolia",
    continent: "Asia",
    emoji: "🇲🇳",
    distance: 13000,
    rarityBoost: { ultra: 7, rare: 20, uncommon: 35, common: 38 },
    vehicleRequired: "flight",
    requiresVehicle: "4x4",
    description: "Remote rare earth elements. Off-road vehicle required.",
    tier: "uncommon"
  },

  // OCEANIA
  australia: {
    name: "Australian Opal Fields",
    country: "Australia",
    continent: "Oceania",
    emoji: "🇦🇺",
    distance: 10500,
    rarityBoost: { ultra: 12, rare: 23, uncommon: 30, common: 35 },
    vehicleRequired: "flight",
    description: "Unique opal deposits. Great for rare gems.",
    tier: "rare"
  },
  newzealand: {
    name: "New Zealand Gold Mines",
    country: "New Zealand",
    continent: "Oceania",
    emoji: "🇳🇿",
    distance: 12500,
    rarityBoost: { ultra: 9, rare: 21, uncommon: 32, common: 38 },
    vehicleRequired: "flight",
    description: "Pristine mining conditions. Balanced rewards.",
    tier: "uncommon"
  },

  // EUROPE
  norway: {
    name: "Norwegian Titanium Mines",
    country: "Norway",
    continent: "Europe",
    emoji: "🇳🇴",
    distance: 9500,
    rarityBoost: { ultra: 6, rare: 18, uncommon: 36, common: 40 },
    vehicleRequired: "flight",
    description: "Industrial metal paradise. High uncommon rates.",
    tier: "common"
  },
  spain: {
    name: "Spanish Silver Mines",
    country: "Spain",
    continent: "Europe",
    emoji: "🇪🇸",
    distance: 8000,
    rarityBoost: { ultra: 7, rare: 19, uncommon: 34, common: 40 },
    vehicleRequired: "flight",
    description: "Historic silver deposits. Solid uncommon yields.",
    tier: "uncommon"
  },

  // EXTREME LOCATIONS
  antarctica: {
    name: "Antarctic Research Station",
    country: "Antarctica",
    continent: "Antarctica",
    emoji: "🇦🇶",
    distance: 6000,
    rarityBoost: { ultra: 25, rare: 30, uncommon: 25, common: 20 },
    vehicleRequired: "privatejet",
    requiresPermit: true,
    permitCost: 50000000,
    description: "Untapped resources. Private jet + $50M permit required.",
    tier: "legendary"
  },
  deepsea: {
    name: "Deep Sea Mining Platform",
    country: "International Waters",
    continent: "Ocean",
    emoji: "🌊",
    distance: 2000,
    rarityBoost: { ultra: 22, rare: 28, uncommon: 28, common: 22 },
    vehicleRequired: "helicopter",
    requiresVehicle: "submarine",
    description: "Underwater riches. Helicopter + submarine required.",
    tier: "legendary"
  }
};

module.exports = {
  config: {
    name: "locations",
    aliases: ["mininglocation", "miningmap", "mines", "mineplaces"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 5,
    role: 0,
    shortDescription: "View all mining locations",
    longDescription: "View all available mining locations around the world with details",
    category: "economy",
    guide: {
      en: "{pn} - View all locations\n" +
          "{pn} <location> - View specific location details\n" +
          "{pn} continent <name> - Filter by continent\n" +
          "{pn} tier <tier> - Filter by tier\n" +
          "{pn} map - View world map"
    }
  },

  langs: {
    en: {
      locationDetails: "%1 %2\n━━━━━━━━━━━━━━━━━━\n\n🌍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: %3, %4\n📏 𝗗𝗶𝘀𝘁𝗮𝗻𝗰𝗲: %5 km\n🎯 𝗧𝗶𝗲𝗿: %6\n\n💎 𝗥𝗮𝗿𝗶𝘁𝘆 𝗕𝗼𝗻𝘂𝘀:\n   🌟 Ultra: %7%\n   ⭐ Rare: %8%\n   ✨ Uncommon: %9%\n   📦 Common: %10%\n\n🚗 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗺𝗲𝗻𝘁𝘀:\n%11\n\n📝 %12\n━━━━━━━━━━━━━━━━━━\n\n💡 𝖴𝗌𝖾: +travel %13 𝗍𝗈 𝗀𝗈 𝗍𝗁𝖾𝗋𝖾",
      
      allLocations: "🗺️ 𝗠𝗜𝗡𝗜𝗡𝗚 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡𝗦\n━━━━━━━━━━━━━━━━━━\n\n%1\n━━━━━━━━━━━━━━━━━━\n\n💡 𝖴𝗌𝖾 +locations <name> 𝖿𝗈𝗋 𝖽𝖾𝗍𝖺𝗂𝗅𝗌\n⛏️ 𝖴𝗌𝖾 +travel <name> 𝗍𝗈 𝗀𝗈 𝗍𝗁𝖾𝗋𝖾",
      
      continentFilter: "🌍 %1 𝗠𝗜𝗡𝗜𝗡𝗚 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡𝗦\n━━━━━━━━━━━━━━━━━━\n\n%2\n━━━━━━━━━━━━━━━━━━",
      
      tierFilter: "%1 𝗧𝗜𝗘𝗥 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡𝗦\n━━━━━━━━━━━━━━━━━━\n\n%2\n━━━━━━━━━━━━━━━━━━",
      
      locationNotFound: "❌ 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽!\n\n💡 𝖴𝗌𝖾 +locations 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗅𝗅",
      
      worldMap: "🗺️ 𝗪𝗢𝗥𝗟𝗗 𝗠𝗜𝗡𝗜𝗡𝗚 𝗠𝗔𝗣\n━━━━━━━━━━━━━━━━━━\n\n🌍 AFRICA: %1 locations\n🌎 AMERICAS: %2 locations\n🌏 ASIA: %3 locations\n🌏 OCEANIA: %4 locations\n🌍 EUROPE: %5 locations\n❄️ EXTREME: %6 locations\n\n📊 𝗧𝗼𝘁𝗮𝗹: %7 locations\n\n💡 𝖴𝗌𝖾 +locations continent <name>\n━━━━━━━━━━━━━━━━━━"
    }
  },

  onStart: async function ({ message, args, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

    // Initialize travel data to check current location
    if (!userData.data.travel) {
      userData.data.travel = {
        currentLocation: "johannesburg",
        traveling: false,
        ownedVehicles: [],
        permits: []
      };
    }

    const travelData = userData.data.travel;
    const currentLocation = travelData.currentLocation;

    // Show world map
    if (args[0] === "map") {
      const continents = {
        Africa: 0,
        Americas: 0,
        Asia: 0,
        Oceania: 0,
        Europe: 0,
        Extreme: 0
      };

      Object.values(MINING_LOCATIONS).forEach(loc => {
        if (loc.continent === "Africa") continents.Africa++;
        else if (loc.continent === "North America" || loc.continent === "South America") continents.Americas++;
        else if (loc.continent === "Asia") continents.Asia++;
        else if (loc.continent === "Oceania") continents.Oceania++;
        else if (loc.continent === "Europe") continents.Europe++;
        else continents.Extreme++;
      });

      const total = Object.values(continents).reduce((a, b) => a + b, 0);

      return message.reply(
        getLang("worldMap",
          continents.Africa,
          continents.Americas,
          continents.Asia,
          continents.Oceania,
          continents.Europe,
          continents.Extreme,
          total
        )
      );
    }

    // Filter by continent
    if (args[0] === "continent" && args[1]) {
      const continentName = args.slice(1).join(" ").toLowerCase();
      const filtered = Object.entries(MINING_LOCATIONS).filter(([id, loc]) => 
        loc.continent.toLowerCase().includes(continentName)
      );

      if (filtered.length === 0) {
        return message.reply("❌ No locations found in that continent!");
      }

      let locationList = "";
      filtered.forEach(([id, loc]) => {
        const isCurrentLocation = id === currentLocation ? " 📍" : "";
        const tierEmoji = getTierEmoji(loc.tier);
        locationList += `${tierEmoji} ${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
        locationList += `   📏 ${loc.distance}km | 🎯 ${loc.tier}\n\n`;
      });

      return message.reply(
        getLang("continentFilter", continentName.toUpperCase(), locationList.trim())
      );
    }

    // Filter by tier
    if (args[0] === "tier" && args[1]) {
      const tierName = args[1].toLowerCase();
      const filtered = Object.entries(MINING_LOCATIONS).filter(([id, loc]) => 
        loc.tier === tierName
      );

      if (filtered.length === 0) {
        return message.reply("❌ No locations found in that tier!");
      }

      let locationList = "";
      filtered.forEach(([id, loc]) => {
        const isCurrentLocation = id === currentLocation ? " 📍" : "";
        locationList += `${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
        locationList += `   🌍 ${loc.country} | 📏 ${loc.distance}km\n\n`;
      });

      const tierEmoji = getTierEmoji(tierName);
      return message.reply(
        getLang("tierFilter", `${tierEmoji} ${tierName.toUpperCase()}`, locationList.trim())
      );
    }

    // Show specific location details
    if (args[0]) {
      const locationId = args[0].toLowerCase();
      const location = MINING_LOCATIONS[locationId];

      if (!location) {
        return message.reply(getLang("locationNotFound"));
      }

      // Build requirements text
      let requirements = "";
      if (location.distance === 0) {
        requirements = "   ✅ Starting location - No requirements";
      } else if (location.distance <= 500) {
        requirements = "   🚶 Can walk or use public transport";
      } else {
        requirements = `   ${getVehicleIcon(location.vehicleRequired)} ${formatVehicleRequirement(location.vehicleRequired)}`;
      }

      if (location.requiresVehicle) {
        requirements += `\n   🚙 ${location.requiresVehicle.toUpperCase()} vehicle required on-site`;
      }

      if (location.requiresPermit) {
        const hasPermit = travelData.permits.includes(locationId);
        const permitStatus = hasPermit ? "✅ Owned" : "❌ Required";
        requirements += `\n   📜 Special permit: ${permitStatus} ($${location.permitCost.toLocaleString()})`;
      }

      const tierEmoji = getTierEmoji(location.tier);
      const isCurrentLocation = locationId === currentLocation;
      const locationName = isCurrentLocation ? `${location.name} 📍 (Current)` : location.name;

      return message.reply(
        getLang("locationDetails",
          tierEmoji,
          locationName,
          location.country,
          location.continent,
          location.distance.toLocaleString(),
          location.tier.toUpperCase(),
          location.rarityBoost.ultra,
          location.rarityBoost.rare,
          location.rarityBoost.uncommon,
          location.rarityBoost.common,
          requirements,
          location.description,
          locationId
        )
      );
    }

    // Show all locations grouped by tier
    const tiers = {
      legendary: [],
      ultra: [],
      rare: [],
      uncommon: [],
      common: [],
      starter: []
    };

    Object.entries(MINING_LOCATIONS).forEach(([id, loc]) => {
      tiers[loc.tier].push({ id, ...loc });
    });

    let locationList = "";

    // Legendary
    if (tiers.legendary.length > 0) {
      locationList += "⭐ 𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬\n";
      tiers.legendary.forEach(loc => {
        const isCurrentLocation = loc.id === currentLocation ? " 📍" : "";
        locationList += `   ${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
      });
      locationList += "\n";
    }

    // Ultra
    if (tiers.ultra.length > 0) {
      locationList += "🌟 𝗨𝗟𝗧𝗥𝗔 𝗥𝗔𝗥𝗘\n";
      tiers.ultra.forEach(loc => {
        const isCurrentLocation = loc.id === currentLocation ? " 📍" : "";
        locationList += `   ${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
      });
      locationList += "\n";
    }

    // Rare
    if (tiers.rare.length > 0) {
      locationList += "⭐ 𝗥𝗔𝗥𝗘\n";
      tiers.rare.forEach(loc => {
        const isCurrentLocation = loc.id === currentLocation ? " 📍" : "";
        locationList += `   ${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
      });
      locationList += "\n";
    }

    // Uncommon
    if (tiers.uncommon.length > 0) {
      locationList += "✨ 𝗨𝗡𝗖𝗢𝗠𝗠𝗢𝗡\n";
      tiers.uncommon.forEach(loc => {
        const isCurrentLocation = loc.id === currentLocation ? " 📍" : "";
        locationList += `   ${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
      });
      locationList += "\n";
    }

    // Common
    if (tiers.common.length > 0) {
      locationList += "📦 𝗖𝗢𝗠𝗠𝗢𝗡\n";
      tiers.common.forEach(loc => {
        const isCurrentLocation = loc.id === currentLocation ? " 📍" : "";
        locationList += `   ${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
      });
      locationList += "\n";
    }

    // Starter
    if (tiers.starter.length > 0) {
      locationList += "🏁 𝗦𝗧𝗔𝗥𝗧𝗘𝗥\n";
      tiers.starter.forEach(loc => {
        const isCurrentLocation = loc.id === currentLocation ? " 📍" : "";
        locationList += `   ${loc.emoji} ${loc.name}${isCurrentLocation}\n`;
      });
    }

    return message.reply(getLang("allLocations", locationList.trim()));
  }
};

// Helper functions
function getTierEmoji(tier) {
  const emojis = {
    legendary: "⭐",
    ultra: "🌟",
    rare: "⭐",
    uncommon: "✨",
    common: "📦",
    starter: "🏁"
  };
  return emojis[tier] || "📦";
}

function getVehicleIcon(vehicleType) {
  const icons = {
    flight: "✈️",
    privatejet: "🛩️",
    helicopter: "🚁",
    car: "🚗",
    "4x4": "🚙"
  };
  return icons[vehicleType] || "🚗";
}

function formatVehicleRequirement(vehicleType) {
  if (!vehicleType) return "No special vehicle required";
  
  const names = {
    flight: "Flight required",
    privatejet: "Private Jet required",
    helicopter: "Helicopter required",
    car: "Car required",
    "4x4": "4x4 Vehicle required"
  };
  return names[vehicleType] || vehicleType;
}
