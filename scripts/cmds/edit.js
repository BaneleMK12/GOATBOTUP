const axios = require("axios");

module.exports = {
  config: {
    name: "edit",
    aliases: ["imgedit"],
    version: "3.0",
    author: "Neoaz & Charles", //API by RIFAT | Premium by CharlesMK
    countDown: 15,
    role: 0,
    shortDescription: { en: "Edit image with Seedream V4 (Premium)" },
    longDescription: { en: "Edit or modify an existing image using Seedream V4 Edit AI model - Premium Feature" },
    category: "image",
    guide: {
      en: "{pn} <prompt> - Reply to an image\n" +
          "{pn} buy - Purchase premium access ($1,000,000,000)\n" +
          "{pn} status - Check your premium status"
    }
  },

  onStart: async function ({ message, event, api, args, usersData }) {
    const { senderID } = event;
    const PREMIUM_PRICE = 1000000000; // $1,000,000,000

    // Get user data
    const userData = await usersData.get(senderID);
    
    // Initialize premium data if it doesn't exist
    if (!userData.data.premiumEdit) {
      userData.data.premiumEdit = {
        isPremium: false,
        purchaseDate: null
      };
    }

    const premiumData = userData.data.premiumEdit;

    // Check status command (BEFORE image check)
    if (args[0] === "status") {
      if (premiumData.isPremium) {
        const purchaseDate = new Date(premiumData.purchaseDate).toLocaleDateString();
        return message.reply(
          `✅ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗦𝗧𝗔𝗧𝗨𝗦\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `💎 𝗦𝘁𝗮𝘁𝘂𝘀: 𝖠𝖼𝗍𝗂𝗏𝖾\n` +
          `📅 𝗣𝘂𝗿𝗰𝗵𝗮𝘀𝗲𝗱: ${purchaseDate}\n` +
          `✨ 𝖸𝗈𝗎 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝖾 𝖾𝖽𝗂𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!\n` +
          `━━━━━━━━━━━━━━━━━━`
        );
      } else {
        return message.reply(
          `❌ 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗦𝗧𝗔𝗧𝗨𝗦\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `💎 𝗦𝘁𝗮𝘁𝘂𝘀: 𝖭𝗈𝗍 𝖠𝖼𝗍𝗂𝗏𝖾\n` +
          `💰 𝗣𝗿𝗶𝗰𝗲: $${PREMIUM_PRICE.toLocaleString()}\n\n` +
          `🛒 𝖴𝗌𝖾 +edit buy 𝗍𝗈 𝗉𝗎𝗋𝖼𝗁𝖺𝗌𝖾\n` +
          `━━━━━━━━━━━━━━━━━━`
        );
      }
    }

    // Buy premium command (BEFORE image check)
    if (args[0] === "buy") {
      if (premiumData.isPremium) {
        return message.reply(
          `✅ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗣𝗥𝗘𝗠𝗜𝗨𝗠\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `💎 𝖸𝗈𝗎 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗁𝖺𝗏𝖾 𝗉𝗋𝖾𝗆𝗂𝗎𝗆 𝖺𝖼𝖼𝖾𝗌𝗌!\n` +
          `✨ 𝖲𝗍𝖺𝗋𝗍 𝗎𝗌𝗂𝗇𝗀 +edit 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗂𝗆𝖺𝗀𝖾𝗌`
        );
      }

      // Check if user has enough money
      if (userData.money < PREMIUM_PRICE) {
        const needed = PREMIUM_PRICE - userData.money;
        return message.reply(
          `❌ 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗖𝗜𝗘𝗡𝗧 𝗙𝗨𝗡𝗗𝗦\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `💰 𝗬𝗼𝘂𝗿 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $${userData.money.toLocaleString()}\n` +
          `💎 𝗥𝗲𝗾𝘂𝗶𝗿𝗲𝗱: $${PREMIUM_PRICE.toLocaleString()}\n` +
          `📊 𝗡𝗲𝗲𝗱𝗲𝗱: $${needed.toLocaleString()}\n\n` +
          `💡 𝖤𝖺𝗋𝗇 𝗆𝗈𝗋𝖾 𝗆𝗈𝗇𝖾𝗒 𝗍𝗈 𝗉𝗎𝗋𝖼𝗁𝖺𝗌𝖾!\n` +
          `━━━━━━━━━━━━━━━━━━`
        );
      }

      // Process purchase
      userData.data.premiumEdit = {
        isPremium: true,
        purchaseDate: new Date().toISOString()
      };

      await usersData.set(senderID, {
        money: userData.money - PREMIUM_PRICE,
        data: userData.data
      });

      return message.reply(
        `🎉 𝗣𝗨𝗥𝗖𝗛𝗔𝗦𝗘 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟!\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `💎 𝖯𝗋𝖾𝗆𝗂𝗎𝗆 𝖤𝖽𝗂𝗍 𝖠𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽!\n` +
        `💰 𝗣𝗮𝗶𝗱: $${PREMIUM_PRICE.toLocaleString()}\n` +
        `💵 𝗡𝗲𝘄 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $${(userData.money - PREMIUM_PRICE).toLocaleString()}\n\n` +
        `✨ 𝖸𝗈𝗎 𝖼𝖺𝗇 𝗇𝗈𝗐 𝗎𝗌𝖾 +edit 𝗍𝗈 𝖾𝖽𝗂𝗍 𝗂𝗆𝖺𝗀𝖾𝗌!\n` +
        `🎨 𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 +edit <𝗉𝗋𝗈𝗆𝗉𝗍>\n` +
        `━━━━━━━━━━━━━━━━━━`
      );
    }

    // NOW check for image editing (only if not buy/status command)
    
    // Check premium access for actual edit command
    if (!premiumData.isPremium) {
      return message.reply(
        `🔒 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗙𝗘𝗔𝗧𝗨𝗥𝗘\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `💎 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝗌 𝗉𝗋𝖾𝗆𝗂𝗎𝗆 𝖺𝖼𝖼𝖾𝗌𝗌\n\n` +
        `💰 𝗣𝗿𝗶𝗰𝗲: $${PREMIUM_PRICE.toLocaleString()}\n` +
        `💵 𝗬𝗼𝘂𝗿 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $${userData.money.toLocaleString()}\n\n` +
        `🛒 𝖴𝗌𝖾 +edit buy 𝗍𝗈 𝗉𝗎𝗋𝖼𝗁𝖺𝗌𝖾\n` +
        `📊 𝖴𝗌𝖾 +edit status 𝗍𝗈 𝖼𝗁𝖾𝖼𝗄 𝗌𝗍𝖺𝗍𝗎𝗌\n` +
        `━━━━━━━━━━━━━━━━━━`
      );
    }

    // Original edit command logic (only runs if premium)
    const hasPhotoReply = event.type === "message_reply" && event.messageReply?.attachments?.[0]?.type === "photo";

    if (!hasPhotoReply) {
      return message.reply(
        `❌ 𝗡𝗢 𝗜𝗠𝗔𝗚𝗘 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `📸 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾\n` +
        `💡 𝖴𝗌𝖺𝗀𝖾: +edit <𝗉𝗋𝗈𝗆𝗉𝗍>`
      );
    }

    const prompt = args.join(" ").trim();
    if (!prompt) {
      return message.reply(
        `❌ 𝗠𝗜𝗦𝗦𝗜𝗡𝗚 𝗣𝗥𝗢𝗠𝗣𝗧\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `✍️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗉𝗋𝗈𝗆𝗉𝗍\n` +
        `💡 𝖤𝗑𝖺𝗆𝗉𝗅𝖾: +edit 𝗆𝖺𝗄𝖾 𝗂𝗍 𝗌𝗎𝗇𝗇𝗒`
      );
    }

    const model = "seedream v4 edit";
    const imageUrl = event.messageReply.attachments[0].url;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const res = await axios.get("https://fluxcdibai-1.onrender.com/generate", {
        params: { prompt, model, imageUrl },
        timeout: 120000
      });

      const data = res.data;
      const resultUrl = data?.data?.imageResponseVo?.url;

      if (!resultUrl) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(
          `❌ 𝗘𝗗𝗜𝗧 𝗙𝗔𝗜𝗟𝗘𝗗\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖾𝖽𝗂𝗍 𝗂𝗆𝖺𝗀𝖾\n` +
          `💡 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇`
        );
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: "🎨 𝗜𝗠𝗔𝗚𝗘 𝗘𝗗𝗜𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬\n━━━━━━━━━━━━━━━━━━\n\n✨ 𝖸𝗈𝗎𝗋 𝗂𝗆𝖺𝗀𝖾 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖾𝖽𝗂𝗍𝖾𝖽! 🐦",
        attachment: await global.utils.getStreamFromURL(resultUrl)
      });

    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply(
        `❌ 𝗘𝗥𝗥𝗢𝗥 𝗢𝗖𝗖𝗨𝗥𝗥𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `⚠️ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗁𝗂𝗅𝖾 𝖾𝖽𝗂𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾\n` +
        `💡 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋`
      );
    }
  }
};
