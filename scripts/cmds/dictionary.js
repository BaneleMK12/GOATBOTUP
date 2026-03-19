const axios = require('axios');

module.exports = {
  config: {
    name: "dictionary",
    aliases: ["dict", "define"],
    version: "2.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    description: {
      en: "Look up word definitions, pronunciation, and examples"
    },
    category: "study",
    guide: {
      en: "{pn} [word] - Get definition and examples\n" +
          "Example: {pn} serendipity"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;

    if (!args[0]) {
      return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗐𝗈𝗋𝖽 𝗍𝗈 𝗅𝗈𝗈𝗄 𝗎𝗉\n\n" +
        "𝖴𝗌𝖺𝗀𝖾: +dict [word]");
    }

    const word = args.join(" ").trim().toLowerCase();

    try {
      const response = await axios.get(
        encodeURI(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      );

      const data = response.data[0];
      const phonetics = data.phonetics || [];
      const meanings = data.meanings || [];

      // Build phonetics section
      let phoneticText = "";
      for (const item of phonetics) {
        if (item.text) {
          phoneticText += `   /${item.text}/\n`;
        }
      }

      // Build meanings section
      let meaningsText = "";
      let meaningCount = 0;

      for (const meaning of meanings) {
        if (meaningCount >= 3) break; // Limit to 3 meanings for cleaner output

        const partOfSpeech = meaning.partOfSpeech;
        const definitions = meaning.definitions || [];

        if (definitions.length > 0) {
          const def = definitions[0];
          const definition = def.definition;
          const example = def.example;

          meaningsText += `\n📖 ${partOfSpeech.toUpperCase()}\n`;
          meaningsText += `   ${definition.charAt(0).toUpperCase() + definition.slice(1)}\n`;

          if (example) {
            meaningsText += `\n   💭 𝖤𝗑𝖺𝗆𝗉𝗅𝖾:\n`;
            meaningsText += `   "${example.charAt(0).toUpperCase() + example.slice(1)}"\n`;
          }

          meaningCount++;
        }
      }

      // Build final message
      let msg = `📚 𝗗𝗜𝗖𝗧𝗜𝗢𝗡𝗔𝗥𝗬\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n\n`;
      msg += `📌 𝖶𝗈𝗋𝖽: ${data.word.toUpperCase()}\n`;

      if (phoneticText) {
        msg += `\n🔊 𝖯𝗋𝗈𝗇𝗎𝗇𝖼𝗂𝖺𝗍𝗂𝗈𝗇:\n${phoneticText}`;
      }

      if (meaningsText) {
        msg += meaningsText;
      }

      msg += `\n━━━━━━━━━━━━━━━━━━`;

      if (meanings.length > 3) {
        msg += `\n\n💡 ${meanings.length - 3} 𝗆𝗈𝗋𝖾 𝖽𝖾𝖿𝗂𝗇𝗂𝗍𝗂𝗈𝗇(𝗌) 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾`;
      }

      return message.reply(msg);

    } catch (error) {
      if (error.response?.status === 404) {
        return message.reply(
          `❌ 𝖭𝗈 𝖽𝖾𝖿𝗂𝗇𝗂𝗍𝗂𝗈𝗇 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 "${word}"\n\n` +
          `💡 𝖢𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗌𝗉𝖾𝗅𝗅𝗂𝗇𝗀 𝖺𝗇𝖽 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇`
        );
      }

      console.error(error);
      return message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖽𝖾𝖿𝗂𝗇𝗂𝗍𝗂𝗈𝗇");
    }
  }
};
