const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "hug",
    aliases: ["us", "抱"],
    version: "1.2",
    author: "AceGun, ChalresMK",
    countDown: 5,
    role: 0,
    shortDescription: "Send a hug",
    longDescription: "Hug someone with a cute image",
    category: "love",
    guide: {
      en: "{pn} [@tag] | {pn} [uid] | Reply to a message with {pn}"
    }
  },

  onStart: async function ({ api, message, event, args }) {
    let targetId;
    const senderId = event.senderID;

    // Method 1: Check if replying to a message
    if (event.messageReply) {
      targetId = event.messageReply.senderID;
    }
    // Method 2: Check for mentions (tags)
    else if (Object.keys(event.mentions).length > 0) {
      const mentions = Object.keys(event.mentions);
      targetId = mentions[0];
    }
    // Method 3: Check if a UID is provided as argument
    else if (args[0]) {
      // Validate if it's a numeric UID
      if (/^\d+$/.test(args[0])) {
        targetId = args[0];
      } else {
        return message.reply("Please provide a valid UID, tag someone, or reply to their message! 💕");
      }
    }
    // No valid target found
    else {
      return message.reply("Please mention someone, provide their UID, or reply to their message to hug them! 🤗");
    }

    // Don't allow hugging yourself
    if (targetId === senderId) {
      return message.reply("You can't hug yourself silly! Tag someone else 😄");
    }

    try {
      const path = await createHugImage(senderId, targetId, api);
      await message.reply({
        body: "Come here~ 🤗💕",
        attachment: fs.createReadStream(path)
      });

      // Clean up
      setTimeout(() => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }, 5000);

    } catch (err) {
      console.error("Hug error:", err);
      message.reply("Couldn't create the hug image... sorry 😔");
    }
  }
};

async function createHugImage(one, two, api) {
  let info1, info2;
  try {
    info1 = await api.getUserInfo(one);
    info2 = await api.getUserInfo(two);
  } catch (err) {
    console.error("getUserInfo failed:", err);
  }

  const url1 = info1?.profilePicture || `https://graph.facebook.com/${one}/picture?type=large`;
  const url2 = info2?.profilePicture || `https://graph.facebook.com/${two}/picture?type=large`;

  const avone = await jimp.read(url1);
  avone.circle();

  const avtwo = await jimp.read(url2);
  avtwo.circle();

  const template = await jimp.read("https://i.imgur.com/ReWuiwU.jpg");
  template.resize(466, 659);

  template.composite(avone.resize(110, 110), 150, 76);
  template.composite(avtwo.resize(100, 100), 245, 305);

  const outputPath = `${__dirname}/cache/hug_${Date.now()}.png`;
  await template.writeAsync(outputPath);

  return outputPath;
}
