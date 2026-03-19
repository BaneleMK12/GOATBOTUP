const moment = require("moment-timezone");

// Mining locations with requirements and bonuses
const MINING_LOCATIONS = {
  // AFRICA
  johannesburg: {
    name: "Johannesburg, South Africa",
    country: "South Africa",
    continent: "Africa",
    emoji: "🇿🇦",
    distance: 0, // Starting location
    rarityBoost: { ultra: 5, rare: 15, uncommon: 30, common: 50 }, // Default rates
    vehicleRequired: null,
    description: "Your starting location. Basic mining opportunities."
  },
  kimberley: {
    name: "Kimberley Diamond Fields",
    country: "South Africa",
    continent: "Africa",
    emoji: "💎",
    distance: 500, // km from Johannesburg
    rarityBoost: { ultra: 12, rare: 18, uncommon: 30, common: 40 }, // More diamonds
    vehicleRequired: null, // Can walk or take public transport
    description: "Famous diamond capital. Higher chance of precious gems."
  },
  egypt: {
    name: "Egyptian Gold Mines",
    country: "Egypt",
    continent: "Africa",
    emoji: "🇪🇬",
    distance: 6500,
    rarityBoost: { ultra: 8, rare: 20, uncommon: 32, common: 40 },
    vehicleRequired: "flight", // Too far to drive
    description: "Ancient gold deposits. Excellent for precious metals."
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
    description: "Legendary gold fields. Harsh conditions, great rewards."
  },
  chile: {
    name: "Chilean Copper Mines",
    country: "Chile",
    continent: "South America",
    emoji: "🇨🇱",
    distance: 8500,
    rarityBoost: { ultra: 5, rare: 18, uncommon: 35, common: 42 },
    vehicleRequired: "flight",
    description: "World's largest copper reserves. Industrial metals abundant."
  },
  colombia: {
    name: "Colombian Emerald Mines",
    country: "Colombia",
    continent: "South America",
    emoji: "🇨🇴",
    distance: 10000,
    rarityBoost: { ultra: 20, rare: 25, uncommon: 25, common: 30 }, // ULTRA RARE BOOST!
    vehicleRequired: "flight",
    requiresPermit: true,
    permitCost: 5000000,
    description: "🌟 ULTRA RARE! World's finest emeralds. Requires special permit."
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
    requiresVehicle: "4x4", // Need off-road vehicle on arrival
    description: "Frozen tundra rich in platinum and palladium. 4x4 required."
  },
  myanmar: {
    name: "Myanmar Ruby Mines",
    country: "Myanmar",
    continent: "Asia",
    emoji: "🇲🇲",
    distance: 11000,
    rarityBoost: { ultra: 18, rare: 22, uncommon: 28, common: 32 },
    vehicleRequired: "flight",
    description: "Legendary ruby source. Very high gem rates."
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
    description: "Remote rare earth elements. Off-road vehicle required."
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
    description: "Unique opal deposits. Great for rare gems."
  },
  newzealand: {
    name: "New Zealand Gold Mines",
    country: "New Zealand",
    continent: "Oceania",
    emoji: "🇳🇿",
    distance: 12500,
    rarityBoost: { ultra: 9, rare: 21, uncommon: 32, common: 38 },
    vehicleRequired: "flight",
    description: "Pristine mining conditions. Balanced rewards."
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
    description: "Industrial metal paradise. High uncommon rates."
  },
  spain: {
    name: "Spanish Silver Mines",
    country: "Spain",
    continent: "Europe",
    emoji: "🇪🇸",
    distance: 8000,
    rarityBoost: { ultra: 7, rare: 19, uncommon: 34, common: 40 },
    vehicleRequired: "flight",
    description: "Historic silver deposits. Solid uncommon yields."
  },

  // EXTREME LOCATIONS
  antarctica: {
    name: "Antarctic Research Station",
    country: "Antarctica",
    continent: "Antarctica",
    emoji: "🇦🇶",
    distance: 6000,
    rarityBoost: { ultra: 25, rare: 30, uncommon: 25, common: 20 }, // INSANE ULTRA RARE!
    vehicleRequired: "privatejet",
    requiresPermit: true,
    permitCost: 50000000,
    description: "⭐ LEGENDARY! Untapped resources. Private jet + $50M permit required."
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
    description: "⭐ LEGENDARY! Underwater riches. Helicopter + submarine required."
  }
};

// Vehicle definitions
const VEHICLES = {
  // PUBLIC TRANSPORT
  publictransport: {
    name: "Public Transport",
    type: "public",
    emoji: "🚌",
    speed: 60, // km/h
    maxDistance: 10000,
    costPerKm: 2,
    oneTime: false,
    description: "Cheap but slow. Good for nearby locations."
  },
  
  // CARS (One-time purchase)
  car_basic: {
    name: "Basic Car",
    type: "car",
    emoji: "🚗",
    speed: 100,
    maxDistance: 3000,
    purchaseCost: 50000,
    fuelPerKm: 5,
    oneTime: true,
    description: "Your first vehicle. Good for regional travel."
  },
  car_suv: {
    name: "SUV 4x4",
    type: "4x4",
    emoji: "🚙",
    speed: 120,
    maxDistance: 5000,
    purchaseCost: 150000,
    fuelPerKm: 8,
    oneTime: true,
    unlocks: ["siberia", "mongolia"],
    description: "Off-road capable. Required for extreme terrain."
  },
  car_sports: {
    name: "Sports Car",
    type: "car",
    emoji: "🏎️",
    speed: 200,
    maxDistance: 4000,
    purchaseCost: 500000,
    fuelPerKm: 15,
    oneTime: true,
    description: "Fast travel for rich miners. High fuel cost."
  },

  // FLIGHTS
  flight_economy: {
    name: "Economy Flight",
    type: "flight",
    emoji: "✈️",
    speed: 800,
    maxDistance: 999999,
    costPerKm: 10,
    oneTime: false,
    description: "Affordable air travel. Access any location."
  },
  flight_business: {
    name: "Business Class Flight",
    type: "flight",
    emoji: "🛫",
    speed: 850,
    maxDistance: 999999,
    costPerKm: 25,
    oneTime: false,
    description: "Faster boarding, more comfort. 6% time reduction."
  },

  // PREMIUM VEHICLES
  helicopter: {
    name: "Private Helicopter",
    type: "helicopter",
    emoji: "🚁",
    speed: 250,
    maxDistance: 2500,
    purchaseCost: 5000000,
    fuelPerKm: 50,
    oneTime: true,
    unlocks: ["deepsea"],
    description: "Access remote locations. Required for deep sea."
  },
  privatejet: {
    name: "Private Jet",
    type: "privatejet",
    emoji: "🛩️",
    speed: 900,
    maxDistance: 999999,
    purchaseCost: 50000000,
    fuelPerKm: 100,
    oneTime: true,
    unlocks: ["antarctica"],
    description: "Ultimate travel luxury. Required for Antarctica."
  },
  submarine: {
    name: "Mining Submarine",
    type: "submarine",
    emoji: "🔱",
    speed: 0, // Doesn't affect travel, needed on-site
    maxDistance: 0,
    purchaseCost: 10000000,
    fuelPerKm: 0,
    oneTime: true,
    unlocks: ["deepsea"],
    description: "Required for deep sea mining operations."
  }
};

module.exports = {
  config: {
    name: "travel",
    aliases: ["goto", "mine travel"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 5,
    role: 0,
    shortDescription: "Travel to mining locations",
    longDescription: "Travel to different mining locations around the world with realistic time delays",
    category: "economy",
    guide: {
      en: "{pn} - View current location\n" +
          "{pn} list - View all locations\n" +
          "{pn} <location> - Travel to location\n" +
          "{pn} <location> <vehicle> - Travel with specific vehicle\n" +
          "{pn} cancel - Cancel current travel\n" +
          "{pn} vehicles - View your vehicles\n" +
          "{pn} map - View world map"
    }
  },

  langs: {
    en: {
      currentLocation: "📍 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━\n\n%1 %2\n🌍 %3, %4\n\n💎 𝗥𝗮𝗿𝗶𝘁𝘆 𝗕𝗼𝗻𝘂𝘀:\n   🌟 Ultra: %5%\n   ⭐ Rare: %6%\n   ✨ Uncommon: %7%\n   📦 Common: %8%\n\n📝 %9\n━━━━━━━━━━━━━━━━━━",
      
      traveling: "✈️ 𝗧𝗥𝗔𝗩𝗘𝗟𝗜𝗡𝗚\n━━━━━━━━━━━━━━━━━━\n\n🚀 𝗩𝗲𝗵𝗶𝗰𝗹𝗲: %1\n📍 𝗗𝗲𝘀𝘁𝗶𝗻𝗮𝘁𝗶𝗼𝗻: %2\n📏 𝗗𝗶𝘀𝘁𝗮𝗻𝗰𝗲: %3 km\n⏱️ 𝗔𝗿𝗿𝗶𝘃𝗮𝗹: %4\n\n⚠️ 𝖸𝗈𝗎 𝖼𝖺𝗇𝗇𝗈𝗍 𝗆𝗂𝗇𝖾 𝗐𝗁𝗂𝗅𝖾 𝗍𝗋𝖺𝗏𝖾𝗅𝗂𝗇𝗀!\n💡 𝖴𝗌𝖾 +travel cancel 𝗍𝗈 𝖼𝖺𝗇𝖼𝖾𝗅\n━━━━━━━━━━━━━━━━━━",
      
      travelStarted: "🚀 𝗧𝗥𝗔𝗩𝗘𝗟 𝗦𝗧𝗔𝗥𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n%1 𝖣𝖾𝗉𝖺𝗋𝗍𝗂𝗇𝗀 𝗍𝗈: %2\n📏 𝗗𝗶𝘀𝘁𝗮𝗻𝗰𝗲: %3 km\n⏱️ 𝗧𝗿𝗮𝘃𝗲𝗹 𝗧𝗶𝗺𝗲: %4\n💰 𝗖𝗼𝘀𝘁: $%5\n\n⏰ 𝖠𝗋𝗋𝗂𝗏𝖺𝗅: %6\n━━━━━━━━━━━━━━━━━━",
      
      arrived: "✅ 𝗔𝗥𝗥𝗜𝗩𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n%1 %2\n🌍 %3\n\n💎 𝖸𝗈𝗎 𝖼𝖺𝗇 𝗇𝗈𝗐 𝗆𝗂𝗇𝖾 𝗁𝖾𝗋𝖾!\n⛏️ 𝖴𝗌𝖾 +mine 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍\n━━━━━━━━━━━━━━━━━━",
      
      travelCancelled: "❌ 𝗧𝗥𝗔𝗩𝗘𝗟 𝗖𝗔𝗡𝗖𝗘𝗟𝗟𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n🔙 𝖱𝖾𝗆𝖺𝗂𝗇𝗂𝗇𝗀 𝖺𝗍: %1\n💰 𝖭𝗈 𝗋𝖾𝖿𝗎𝗇𝖽 𝖿𝗈𝗋 𝖼𝖺𝗇𝖼𝖾𝗅𝗅𝖾𝖽 𝗍𝗋𝖺𝗏𝖾𝗅\n━━━━━━━━━━━━━━━━━━",
      
      notTraveling: "❌ 𝖸𝗈𝗎'𝗋𝖾 𝗇𝗈𝗍 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗍𝗋𝖺𝗏𝖾𝗅𝗂𝗇𝗀!",
      
      insufficientFunds: "❌ 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗖𝗜𝗘𝗡𝗧 𝗙𝗨𝗡𝗗𝗦\n━━━━━━━━━━━━━━━━━━\n\n💰 𝗖𝗼𝘀𝘁: $%1\n💵 𝗬𝗼𝘂𝗿 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $%2\n📊 𝗡𝗲𝗲𝗱𝗲𝗱: $%3\n━━━━━━━━━━━━━━━━━━",
      
      vehicleRequired: "❌ 𝗩𝗘𝗛𝗜𝗖𝗟𝗘 𝗥𝗘𝗤𝗨𝗜𝗥𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n📍 %1 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝗌: %2\n\n💡 𝖴𝗌𝖾 +buy vehicles 𝗍𝗈 𝗉𝗎𝗋𝖼𝗁𝖺𝗌𝖾\n━━━━━━━━━━━━━━━━━━",
      
      permitRequired: "❌ 𝗣𝗘𝗥𝗠𝗜𝗧 𝗥𝗘𝗤𝗨𝗜𝗥𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n📍 %1\n💰 𝗣𝗲𝗿𝗺𝗶𝘁 𝗖𝗼𝘀𝘁: $%2\n\n💡 𝖴𝗌𝖾: +travel %3 permit\n━━━━━━━━━━━━━━━━━━",
      
      locationNotFound: "❌ 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽!\n\n💡 𝖴𝗌𝖾 +mininglocation 𝗍𝗈 𝗌𝖾𝖾 𝖺𝗅𝗅 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇𝗌"
    }
  },

  onStart: async function ({ message, args, event, usersData, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);

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

    const travelData = userData.data.travel;

    // Check if currently traveling
    if (travelData.traveling && travelData.arrivalTime) {
      const now = Date.now();
      const arrivalTime = new Date(travelData.arrivalTime).getTime();
      
      if (now >= arrivalTime) {
        // Arrived!
        travelData.currentLocation = travelData.destination;
        travelData.traveling = false;
        travelData.destination = null;
        travelData.arrivalTime = null;
        
        await usersData.set(senderID, { data: userData.data });
        
        const location = MINING_LOCATIONS[travelData.currentLocation];
        return message.reply(
          getLang("arrived", location.emoji, location.name, location.description)
        );
      }
    }

    // Show current location
    if (!args[0] || args[0] === "status") {
      if (travelData.traveling) {
        const location = MINING_LOCATIONS[travelData.destination];
        const arrivalTime = moment(travelData.arrivalTime).tz("Africa/Johannesburg").format("HH:mm:ss");
        const timeLeft = moment(travelData.arrivalTime).fromNow();
        
        return message.reply(
          getLang("traveling", 
            "✈️", 
            location.name, 
            location.distance,
            `${arrivalTime} (${timeLeft})`
          )
        );
      }
      
      const location = MINING_LOCATIONS[travelData.currentLocation];
      const boost = location.rarityBoost;
      
      return message.reply(
        getLang("currentLocation",
          location.emoji,
          location.name,
          location.country,
          location.continent,
          boost.ultra,
          boost.rare,
          boost.uncommon,
          boost.common,
          location.description
        )
      );
    }

    // Cancel travel
    if (args[0] === "cancel") {
      if (!travelData.traveling) {
        return message.reply(getLang("notTraveling"));
      }
      
      const currentLoc = MINING_LOCATIONS[travelData.currentLocation];
      travelData.traveling = false;
      travelData.destination = null;
      travelData.arrivalTime = null;
      
      await usersData.set(senderID, { data: userData.data });
      
      return message.reply(getLang("travelCancelled", currentLoc.name));
    }

    // List locations (will create separate command for this)
    if (args[0] === "list") {
      return message.reply("💡 Use +locations to see all mining locations");
    }

    // Travel to location
    const locationId = args[0].toLowerCase();
    const location = MINING_LOCATIONS[locationId];
    
    if (!location) {
      return message.reply(getLang("locationNotFound"));
    }

    // Check if already at location
    if (travelData.currentLocation === locationId) {
      return message.reply(`✅ You're already at ${location.name}!`);
    }

    // Check if traveling
    if (travelData.traveling) {
      return message.reply("⚠️ You're already traveling! Use +travel cancel first.");
    }

    // Check permit requirement
    if (location.requiresPermit && !travelData.permits.includes(locationId)) {
      if (args[1] === "permit") {
        // Buy permit
        if (userData.money < location.permitCost) {
          return message.reply(
            getLang("insufficientFunds",
              location.permitCost.toLocaleString(),
              userData.money.toLocaleString(),
              (location.permitCost - userData.money).toLocaleString()
            )
          );
        }
        
        travelData.permits.push(locationId);
        await usersData.set(senderID, {
          money: userData.money - location.permitCost,
          data: userData.data
        });
        
        return message.reply(
          `✅ 𝗣𝗘𝗥𝗠𝗜𝗧 𝗣𝗨𝗥𝗖𝗛𝗔𝗦𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n📍 ${location.name}\n💰 Cost: $${location.permitCost.toLocaleString()}\n\n💡 You can now travel there!`
        );
      }
      
      return message.reply(
        getLang("permitRequired", location.name, location.permitCost.toLocaleString(), locationId)
      );
    }

    // Determine vehicle to use
    let selectedVehicle = null;
    const distance = location.distance;
    
    // Check if specific vehicle type is required
    if (location.vehicleRequired) {
      const requiredType = location.vehicleRequired;
      
      // Check if user owns required vehicle
      const ownedVehicle = Object.entries(VEHICLES).find(([id, v]) => 
        v.type === requiredType && travelData.ownedVehicles.includes(id)
      );
      
      if (!ownedVehicle && requiredType !== "flight") {
        return message.reply(
          getLang("vehicleRequired", location.name, requiredType.toUpperCase())
        );
      }
      
      if (requiredType === "flight") {
        // Use economy flight by default
        selectedVehicle = { id: "flight_economy", ...VEHICLES.flight_economy };
      } else {
        selectedVehicle = { id: ownedVehicle[0], ...ownedVehicle[1] };
      }
    } else {
      // Can walk or use public transport for short distances
      if (distance <= 500) {
        // Free walking!
        selectedVehicle = { 
          id: "walk", 
          name: "Walking", 
          emoji: "🚶",
          speed: 5,
          costPerKm: 0,
          fuelPerKm: 0
        };
      } else {
        // Use public transport
        selectedVehicle = { id: "publictransport", ...VEHICLES.publictransport };
      }
    }

    // Calculate travel cost
    let travelCost = 0;
    if (selectedVehicle.costPerKm) {
      travelCost = distance * selectedVehicle.costPerKm;
    }
    if (selectedVehicle.fuelPerKm) {
      travelCost += distance * selectedVehicle.fuelPerKm;
    }

    // Check if user can afford
    if (userData.money < travelCost) {
      return message.reply(
        getLang("insufficientFunds",
          travelCost.toLocaleString(),
          userData.money.toLocaleString(),
          (travelCost - userData.money).toLocaleString()
        )
      );
    }

    // Calculate travel time (in minutes)
    let travelTimeMinutes = Math.ceil((distance / selectedVehicle.speed) * 60);
    
    // Add arrival time
    const arrivalTime = moment().add(travelTimeMinutes, 'minutes').toISOString();
    
    // Update travel data
    travelData.traveling = true;
    travelData.destination = locationId;
    travelData.arrivalTime = arrivalTime;
    
    await usersData.set(senderID, {
      money: userData.money - travelCost,
      data: userData.data
    });

    // Format travel time
    const hours = Math.floor(travelTimeMinutes / 60);
    const minutes = travelTimeMinutes % 60;
    let timeStr = "";
    if (hours > 0) timeStr += `${hours}h `;
    timeStr += `${minutes}m`;
    
    const arrivalTimeStr = moment(arrivalTime).tz("Africa/Johannesburg").format("HH:mm:ss");

    return message.reply(
      getLang("travelStarted",
        selectedVehicle.emoji,
        location.name,
        distance.toLocaleString(),
        timeStr,
        travelCost.toLocaleString(),
        arrivalTimeStr
      )
    );
  }
};
