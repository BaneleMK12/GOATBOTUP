module.exports = {
  config: {
    name: "name",
    aliases: ["rename", "namelocation"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 5,
    role: 0,
    shortDescription: "Name your discovered location",
    longDescription: "Give a custom name to your discovered mining location",
    category: "economy",
    guide: {
      en: "{pn} <location_id> <name> - Name your location\n" +
          "Example: {pn} user_123_456 MK's Diamond Paradise"
    }
  },

  langs: {
    en: {
      nameSuccess: "✅ 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡 𝗡𝗔𝗠𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n\n%1 %2\n\n🏷️ 𝗡𝗲𝘄 𝗡𝗮𝗺𝗲: %3\n🆔 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 𝗜𝗗: %4\n\n💡 𝖮𝗍𝗁𝖾𝗋 𝗉𝗅𝖺𝗒𝖾𝗋𝗌 𝖼𝖺𝗇 𝗇𝗈𝗐 𝗏𝗂𝗌𝗂𝗍!\n🌍 𝖳𝗁𝖾𝗒 𝗎𝗌𝖾: +travel %4\n━━━━━━━━━━━━━━━━━━",
      
      notOwner: "❌ 𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗈𝗐𝗇 𝗍𝗁𝗂𝗌 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇!",
      
      locationNotFound: "❌ 𝖫𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽!\n\n💡 𝖴𝗌𝖾 +discover owned 𝗍𝗈 𝗌𝖾𝖾 𝗒𝗈𝗎𝗋 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇𝗌",
      
      nameTooLong: "❌ 𝖭𝖺𝗆𝖾 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀!\n\n💡 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 30 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌",
      
      invalidName: "❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗇𝖺𝗆𝖾!\n\n💡 𝖴𝗌𝖺𝗀𝖾: +name <location_id> <name>"
    }
  },

  onStart: async function ({ message, args, event, usersData, getLang }) {
    const { senderID } = event;

    if (!args[0] || !args[1]) {
      return message.reply(getLang("invalidName"));
    }

    const locationId = args[0].toLowerCase();
    const locationName = args.slice(1).join(" ");

    // Check name length
    if (locationName.length > 30) {
      return message.reply(getLang("nameTooLong"));
    }

    // Get location
    if (!global.discoveredLocations) {
      global.discoveredLocations = {};
    }

    const location = global.discoveredLocations[locationId];

    if (!location) {
      return message.reply(getLang("locationNotFound"));
    }

    // Check ownership
    if (location.ownerId !== senderID) {
      return message.reply(getLang("notOwner"));
    }

    // Update name
    location.customName = locationName;

    return message.reply(
      getLang("nameSuccess",
        location.emoji,
        location.baseName,
        locationName,
        locationId
      )
    );
  }
};
