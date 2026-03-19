module.exports = {
  config: {
    name: "fork",
    aliases: ["repo", "source"],
    version: "1.5",
    author: "CharlesMK",
    countDown: 5,
    role: 0,
    longDescription: "Returns the link to the official, updated fork of the bot's repository.",
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const text = "✓ | Here is the updated fork:\n\nhttps://github.com/BaneleMK12/C.MK-MESSENGER-BOT.git\n\n" +
                 "Changes:\n1. No Google Credentials needed\n2. Enhanced overall performance\n3. Now using fca-neokex (v1.0.1)\n\n" +
                 "Keep supporting^_^";
    
    message.reply(text);
  }
};
