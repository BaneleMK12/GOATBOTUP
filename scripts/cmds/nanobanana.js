const axios = require('axios');
const fs = require('fs-extra'); 
const path = require("path");

const API_ENDPOINT = "https://dev.oculux.xyz/api/nanobanana"; 

module.exports = {
  config: {
    name: "nanobanana",
    aliases: ["nb", "nano"],
    version: "1.0", 
    author: "Charles MK",
    countDown: 15,
    role: 0,
    description: { en: "Generate an image using the NanoBanana model with an optional seed." },
    category: "ai-image",
    guide: {
      en: "{pn} <prompt> [--seed <number>]"
    }
  },

  onStart: async function({ message, args, event, api }) {
    let prompt = args.join(" ");
    let seed = '';

    const seedMatch = prompt.match(/--seed (\d+)/);
    if (seedMatch) {
      seed = seedMatch[1];
      prompt = prompt.replace(/--seed \d+/, "").trim();
    }

    if (!prompt) {
        return message.reply("❌ Please provide a prompt to generate an image.");
    }

    message.reaction("⏳", event.messageID);
    let tempFilePath; 

    try {
      let fullApiUrl = `${API_ENDPOINT}?prompt=${encodeURIComponent(prompt.trim())}`;
      if (seed) {
        fullApiUrl += `&seed=${seed}`;
      }
      
      const imageDownloadResponse = await axios.get(fullApiUrl, {
          responseType: 'stream',
          timeout: 60000 
      });

      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
          await fs.ensureDir(cacheDir); 
      }
      
      tempFilePath = path.join(cacheDir, `nanobanana_${Date.now()}.png`);
      const writer = fs.createWriteStream(tempFilePath);
      imageDownloadResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", (err) => {
          writer.close();
          reject(err);
        });
      });

      await message.reply({
        body: `🎨 **NANO BANANA GENERATION**\n\nPrompt: "${prompt}"\nSeed: ${seed || 'Random'}\nModel: Nano Banana`,
        attachment: fs.createReadStream(tempFilePath)
      });

      message.reaction("✅", event.messageID);

    } catch (error) {
      console.error("NanoBanana Error:", error);
      message.reaction("❌", event.messageID);
      return message.reply("❌ Failed to generate image. The API might be busy or the prompt was blocked.");
    } finally {
      // Cleanup file to save space on Render/Termux
      if (tempFilePath && fs.existsSync(tempFilePath)) {
          try {
              fs.unlinkSync(tempFilePath);
          } catch (e) {
              console.error("Cleanup error:", e);
          }
      }
    }
  }
};
