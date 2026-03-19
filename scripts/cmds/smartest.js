module.exports = {
  config: {
    name: "smartest",
    aliases: ["quiztop", "qtop"],
    version: "1.0.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    description: "View the lifetime quiz leaderboard and accuracy rankings.",
    category: "game",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, usersData }) {
    try {
      const allUsers = await usersData.getAll();

      // Filter users who have played the quiz and have at least 1 point
      const quizPlayers = allUsers
        .filter(u => u.data && u.data.quizScore > 0)
        .sort((a, b) => b.data.quizScore - a.data.quizScore);

      if (quizPlayers.length === 0) {
        return message.reply("🏆 𝗦𝗠𝗔𝗥𝗧𝗘𝗦𝗧 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗\n━━━━━━━━━━━━━━━━━━━━━━\nNo data found. Start playing with +quiz!");
      }

      let msg = "🧠 𝗦𝗠𝗔𝗥𝗧𝗘𝗦𝗧 𝗣𝗟𝗔𝗬𝗘𝗥𝗦\n━━━━━━━━━━━━━━━━━━━━━━\n";

      quizPlayers.slice(0, 10).forEach((user, index) => {
        const score = user.data.quizScore || 0;
        const total = user.data.quizTotal || 0;
        const correct = user.data.quizCorrect || 0;
        
        // Calculate lifetime accuracy
        const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;
        
        // Use a crown for the top player
        const medal = index === 0 ? "👑" : `${index + 1}.`;

        msg += `${medal} **${user.name}**\n`;
        msg += `   ✨ 𝗣𝗼𝗶𝗻𝘁𝘀: ${score.toLocaleString()}\n`;
        msg += `   🎯 𝗔𝗰𝗰𝘂𝗿𝗮𝗰𝘆: ${accuracy}%\n\n`;
      });

      msg += "━━━━━━━━━━━━━━━━━━━━━━\nKeep playing to climb the ranks!";
      
      return message.reply(msg);
    } catch (error) {
      console.error(error);
      return message.reply("❌ Unable to fetch the leaderboard at this time.");
    }
  }
};
