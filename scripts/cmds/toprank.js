module.exports = {
  config: {
    name: "toprank",
    aliases: ["top rank", "leaderboard", "lb"],
    version: "2.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    shortDescription: "Show top ranked users",
    longDescription: "Display the top 10 users with highest levels and experience points",
    category: "rank",
    guide: {
      en: "{pn} - View top 10 users\n" +
          "{pn} [number] - View top N users (max 20)\n" +
          "Examples:\n" +
          "{pn}\n" +
          "{pn} 15"
    }
  },

  onStart: async function ({ message, usersData, args, event }) {
    // Allow custom top N (default 10, max 20)
    let topCount = parseInt(args[0]) || 10;
    if (topCount > 20) topCount = 20;
    if (topCount < 1) topCount = 10;

    const deltaNext = 5;

    const expToLevel = (exp) => {
      if (!exp || isNaN(exp) || exp < 0) return 1;
      return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
    };

    const allUsers = await usersData.getAll();

    // Sort by EXP descending
    const sortedUsers = allUsers
      .filter(u => u.name && typeof u.exp === 'number')
      .sort((a, b) => b.exp - a.exp);

    const topUsers = sortedUsers.slice(0, topCount);
    const totalUsers = allUsers.length;

    // Find current user's rank
    const senderID = event.senderID;
    const userRank = sortedUsers.findIndex(u => u.userID === senderID) + 1;
    const userData = await usersData.get(senderID);
    const userLevel = expToLevel(userData.exp);

    let msg = `╔═══════════════════╗\n`;
    msg += `║  🏆 𝗧𝗢𝗣 ${topCount} 𝗥𝗔𝗡𝗞𝗜𝗡𝗚𝗦 🏆  ║\n`;
    msg += `╚═══════════════════╝\n\n`;

    topUsers.forEach((user, index) => {
      const level = expToLevel(user.exp);
      const rank = index + 1;
      
      let rankIcon;
      if (rank === 1) rankIcon = "🥇";
      else if (rank === 2) rankIcon = "🥈";
      else if (rank === 3) rankIcon = "🥉";
      else rankIcon = `${rank}.`;

      // Highlight current user
      const isCurrentUser = user.userID === senderID;
      const nameDisplay = isCurrentUser ? `${user.name} (𝖸𝗈𝗎)` : user.name;

      msg += `${rankIcon} ${nameDisplay}\n`;
      msg += `   ⭐ 𝗟𝗲𝘃𝗲𝗹: ${level}\n`;
      msg += `   ✨ 𝗘𝗫𝗣: ${user.exp.toLocaleString()}\n`;
      
      // Add progress bar for top 3
      if (rank <= 3) {
        const nextLevelExp = Math.floor(deltaNext * level * (level + 1) / 2);
        const currentLevelExp = Math.floor(deltaNext * (level - 1) * level / 2);
        const expInLevel = user.exp - currentLevelExp;
        const expNeeded = nextLevelExp - currentLevelExp;
        const percentage = Math.floor((expInLevel / expNeeded) * 100);
        const barLength = 10;
        const filledBars = Math.floor((percentage / 100) * barLength);
        const emptyBars = barLength - filledBars;
        const progressBar = "█".repeat(filledBars) + "░".repeat(emptyBars);
        
        msg += `   📊 [${progressBar}] ${percentage}%\n`;
      }
      
      msg += `\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━\n`;
    msg += `📊 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦\n`;
    msg += `━━━━━━━━━━━━━━━━━━\n`;
    msg += `👥 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${totalUsers.toLocaleString()}\n`;
    
    if (userRank > 0) {
      msg += `🎯 𝗬𝗼𝘂𝗿 𝗥𝗮𝗻𝗸: #${userRank.toLocaleString()}\n`;
      msg += `⭐ 𝗬𝗼𝘂𝗿 𝗟𝗲𝘃𝗲𝗹: ${userLevel}\n`;
      msg += `✨ 𝗬𝗼𝘂𝗿 𝗘𝗫𝗣: ${userData.exp.toLocaleString()}\n`;
      
      // Show distance from top if not in top 10
      if (userRank > topCount) {
        const topUserExp = topUsers[topCount - 1].exp;
        const expNeeded = topUserExp - userData.exp;
        msg += `📈 𝗧𝗼 𝗧𝗼𝗽 ${topCount}: ${expNeeded.toLocaleString()} 𝖤𝖷𝖯\n`;
      }
    }
    
    msg += `━━━━━━━━━━━━━━━━━━`;

    return message.reply(msg);
  }
};
