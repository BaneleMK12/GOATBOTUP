const axios = require("axios");

module.exports = {
  config: {
    name: "waifu",
    aliases: ["anime", "girl"],
    version: "1.1",
    author: "CharlesMK (updated 2026 - nekos.best)",
    countDown: 5,
    role: 0,
    description: {
      en: "Generate a random anime waifu image (SFW)"
    },
    category: "AI",
    guide: {
      en: "{pn}\nExample: {pn}"
    }
  },

  onStart: async function ({ message }) {
    try {
      await message.reply("🎌 Fetching a waifu for you... 💖");

      // Primary: nekos.best (very reliable in 2026)
      let imageUrl;
      try {
        const res = await axios.get("https://nekos.best/api/v2/waifu");
        imageUrl = res.data?.results?.[0]?.url;
      } catch (e) {
        console.log("nekos.best failed, trying fallback");
      }

      // Fallback 1: waifu.pics
      if (!imageUrl) {
        const fallbackRes = await axios.get("https://api.waifu.pics/sfw/waifu");
        imageUrl = fallbackRes.data?.url;
      }

      if (!imageUrl) {
        throw new Error("No image URL from APIs");
      }

      const img = await axios.get(imageUrl, {
        responseType: "stream"
      });

      await message.reply({
        body: "💖 𝗪𝗔𝗜𝗙𝗨 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗!",
        attachment: img.data
      });

    } catch (err) {
      console.error("Waifu error:", err?.response?.status, err?.message || err);
      message.reply("❌ Failed to fetch waifu. API(s) down or rate-limited – try again in a minute.");
    }
  }
};
