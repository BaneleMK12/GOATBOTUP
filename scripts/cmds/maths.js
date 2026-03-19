module.exports = {
  config: {
    name: "maths",
    aliases: ["math", "quiz maths"],
    version: "5.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: {
      en: "Answer math questions and earn money + EXP!"
    },
    category: "game",
    guide: {
      en: "{pn} <difficulty>\nDifficulties: easy, mid, hard, hell\n\nExample: {pn} easy\n\nRewards:\n🟢 Easy: $500 + 25 EXP\n🟡 Mid: $1,250 + 62 EXP\n🟠 Hard: $2,500 + 100 EXP\n🔴 Hell: $20,000 + 1000 EXP (Multi-step, timed!)"
    }
  },

  onStart: async function ({ args, message, event, usersData, api }) {
    const { senderID } = event;

    if (args.length === 0) {
      return message.reply(
        "📚 𝗠𝗔𝗧𝗛 𝗤𝗨𝗜𝗭\n\n" +
        "Choose a difficulty:\n" +
        "🟢 +maths easy ($500 + 25 EXP)\n" +
        "🟡 +maths mid ($1,250 + 62 EXP)\n" +
        "🟠 +maths hard ($2,500 + 100 EXP)\n" +
        "🔴 +maths hell ($20,000 + 1000 EXP)\n\n"
      );
    }

    const difficulty = args[0].toLowerCase();

    const random = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const generateQuestion = (difficulty) => {
      let question, answer, hint = "";

      switch (difficulty) {
        case "easy": {
          const ops = ["+", "-", "×", "÷"];
          const op = ops[random(0, 3)];

          if (op === "+") {
            const a = random(1, 25);
            const b = random(1, 25);
            question = `${a} + ${b} = ?`;
            answer = a + b;
          } else if (op === "-") {
            const a = random(10, 30);
            const b = random(1, a - 1);
            question = `${a} - ${b} = ?`;
            answer = a - b;
          } else if (op === "×") {
            const a = random(2, 12);
            const b = random(2, 12);
            question = `${a} × ${b} = ?`;
            answer = a * b;
          } else {
            const b = random(2, 10);
            const ans = random(2, 10);
            question = `${b * ans} ÷ ${b} = ?`;
            answer = ans;
          }
          break;
        }

        case "mid": {
          const ops = ["+", "-", "×", "÷"];
          const op = ops[random(0, 3)];

          if (op === "+") {
            const a = random(20, 150);
            const b = random(20, 150);
            question = `${a} + ${b} = ?`;
            answer = a + b;
          } else if (op === "-") {
            const a = random(100, 250);
            const b = random(20, a - 20);
            question = `${a} - ${b} = ?`;
            answer = a - b;
          } else if (op === "×") {
            const a = random(10, 30);
            const b = random(5, 20);
            question = `${a} × ${b} = ?`;
            answer = a * b;
          } else {
            const b = random(10, 20);
            const ans = random(10, 20);
            question = `${b * ans} ÷ ${b} = ?`;
            answer = ans;
          }
          break;
        }

        case "hard": {
          const ops = ["+", "-", "×", "÷"];
          const op = ops[random(0, 3)];

          if (op === "+") {
            const a = random(200, 800);
            const b = random(200, 800);
            question = `${a} + ${b} = ?`;
            answer = a + b;
          } else if (op === "-") {
            const a = random(500, 2000);
            const b = random(100, a - 100);
            question = `${a} - ${b} = ?`;
            answer = a - b;
          } else if (op === "×") {
            const a = random(30, 99);
            const b = random(30, 99);
            question = `${a} × ${b} = ?`;
            answer = a * b;
          } else {
            const b = random(20, 50);
            const ans = random(20, 80);
            question = `${b * ans} ÷ ${b} = ?`;
            answer = ans;
          }
          break;
        }

        case "hell": {
          const type = random(1, 20);

          // STRATEGY: Multi-step problems that require calculating intermediate steps
          // The question shows the process but requires mental calculation
          // Too complex to type into AI quickly within 45 seconds

          if (type === 1) {
            // Multi-step arithmetic with hidden pattern
            const a = random(15, 25);
            const b = random(3, 7);
            const c = random(2, 5);
            const step1 = a * b;
            const step2 = step1 + c;
            const step3 = step2 - a;
            answer = step3;
            question = `🧮 Calculate: [(${a} × ${b}) + ${c}] - ${a}`;
            hint = "Solve step by step";
          } else if (type === 2) {
            // Prime factorization result
            const primes = [2, 3, 5, 7, 11, 13];
            const p1 = primes[random(0, 3)];
            const p2 = primes[random(2, 5)];
            const e1 = random(2, 3);
            const e2 = random(1, 2);
            answer = Math.pow(p1, e1) * Math.pow(p2, e2);
            question = `🔢 ${p1}^${e1} × ${p2}^${e2} = ?`;
            hint = "Calculate powers first";
          } else if (type === 3) {
            // Modular arithmetic
            const a = random(50, 150);
            const b = random(20, 40);
            const mod = random(7, 15);
            answer = (a + b) % mod;
            question = `🎯 (${a} + ${b}) mod ${mod} = ?`;
            hint = "Add first, then find remainder";
          } else if (type === 4) {
            // Digit sum puzzle
            const num = random(1000, 9999);
            const digits = String(num).split('').map(Number);
            const sum = digits.reduce((a, b) => a + b, 0);
            answer = sum * random(2, 5);
            const multiplier = answer / sum;
            question = `🧩 Sum of digits in ${num}, then multiply by ${multiplier}`;
            hint = "Add all digits first";
          } else if (type === 5) {
            // Reverse calculation
            const result = random(100, 300);
            const divisor = random(4, 9);
            const subtractor = random(10, 30);
            answer = (result + subtractor) * divisor;
            question = `🔄 What number divided by ${divisor} then minus ${subtractor} equals ${result}?`;
            hint = "Work backwards";
          } else if (type === 6) {
            // Consecutive numbers
            const n = random(10, 20);
            const count = random(3, 5);
            let sum = 0;
            for (let i = 0; i < count; i++) {
              sum += (n + i);
            }
            answer = sum;
            question = `➕ Sum of ${count} consecutive integers starting from ${n}`;
            hint = `${n} + ${n+1} + ...`;
          } else if (type === 7) {
            // Percentage chain
            const start = random(200, 400);
            const percent1 = random(10, 30);
            const percent2 = random(15, 35);
            const step1 = start + (start * percent1 / 100);
            answer = Math.round(step1 - (step1 * percent2 / 100));
            question = `💹 $${start} increased by ${percent1}%, then decreased by ${percent2}%`;
            hint = "Calculate each step";
          } else if (type === 8) {
            // Factorial division
            const n1 = random(6, 8);
            const n2 = random(3, 5);
            let fact1 = 1, fact2 = 1;
            for (let i = 2; i <= n1; i++) fact1 *= i;
            for (let i = 2; i <= n2; i++) fact2 *= i;
            answer = fact1 / fact2;
            question = `❗ ${n1}! ÷ ${n2}! = ?`;
            hint = "Calculate factorials";
          } else if (type === 9) {
            // Fibonacci-like sequence
            const a = random(2, 5);
            const b = random(3, 7);
            const steps = random(3, 4);
            let seq = [a, b];
            for (let i = 0; i < steps; i++) {
              seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
            }
            answer = seq[seq.length - 1];
            question = `🔄 Sequence: ${a}, ${b}, then each = sum of previous 2. What's the ${steps + 2}th term?`;
            hint = "Add previous two numbers";
          } else if (type === 10) {
            // Average then operation
            const nums = [random(10, 30), random(20, 40), random(30, 50), random(15, 35)];
            const avg = Math.round(nums.reduce((a, b) => a + b) / nums.length);
            const multiplier = random(3, 6);
            answer = avg * multiplier;
            question = `📊 Average of [${nums.join(', ')}] × ${multiplier}`;
            hint = "Find average first";
          } else if (type === 11) {
            // GCD puzzle
            const a = random(12, 36);
            const b = random(18, 48);
            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
            answer = gcd(a, b) * random(2, 4);
            const mult = answer / gcd(a, b);
            question = `🔗 GCD(${a}, ${b}) × ${mult} = ?`;
            hint = "Find greatest common divisor";
          } else if (type === 12) {
            // Power of difference
            const a = random(10, 20);
            const b = random(5, 10);
            const exp = 2;
            answer = Math.pow(a - b, exp);
            question = `⚡ (${a} - ${b})² = ?`;
            hint = "Subtract first, then square";
          } else if (type === 13) {
            // Compound calculation
            const a = random(5, 15);
            const b = random(3, 8);
            const c = random(2, 5);
            answer = (a * b) + (b * c) + (a * c);
            question = `🎲 (${a} × ${b}) + (${b} × ${c}) + (${a} × ${c}) = ?`;
            hint = "Calculate each product";
          } else if (type === 14) {
            // Binary to decimal (small)
            const decimal = random(16, 63);
            const binary = decimal.toString(2);
            answer = decimal;
            question = `💾 Binary ${binary} in decimal = ?`;
            hint = "Convert from base 2";
          } else if (type === 15) {
            // Arithmetic sequence sum
            const first = random(5, 15);
            const diff = random(3, 7);
            const terms = random(4, 6);
            const last = first + (terms - 1) * diff;
            answer = Math.round((terms * (first + last)) / 2);
            question = `📈 Sum: ${first}, ${first+diff}, ${first+2*diff}... (${terms} terms, diff=${diff})`;
            hint = "Arithmetic series";
          } else if (type === 16) {
            // Ratio calculation
            const total = random(60, 120);
            const ratio1 = random(2, 5);
            const ratio2 = random(3, 6);
            const part1 = Math.round((total * ratio1) / (ratio1 + ratio2));
            answer = part1;
            question = `⚖️ Split ${total} in ratio ${ratio1}:${ratio2}. What's the first part?`;
            hint = "Total parts = " + (ratio1 + ratio2);
          } else if (type === 17) {
            // Nested operations
            const a = random(8, 15);
            const b = random(3, 7);
            const c = random(2, 4);
            answer = a * (b + c) - b;
            question = `🪆 ${a} × (${b} + ${c}) - ${b} = ?`;
            hint = "Parentheses first";
          } else if (type === 18) {
            // Digital root variation
            const num = random(100, 999);
            let temp = num;
            while (temp >= 10) {
              temp = String(temp).split('').map(Number).reduce((a, b) => a + b);
            }
            answer = temp * random(5, 10);
            const mult = answer / temp;
            question = `🔄 Digital root of ${num}, × ${mult}`;
            hint = "Sum digits until single digit";
          } else if (type === 19) {
            // Time calculation
            const minutes = random(120, 300);
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            answer = hours * 60 + mins; // Should equal minutes, but testing comprehension
            question = `⏰ ${hours}h ${mins}m in total minutes?`;
            answer = minutes;
            hint = "Convert to minutes";
          } else {
            // Mixed fraction calculation
            const whole1 = random(3, 8);
            const num1 = random(1, 3);
            const den1 = random(4, 6);
            const whole2 = random(2, 5);
            const num2 = random(1, 3);
            const den2 = den1; // Same denominator for simplicity
            const total = whole1 + whole2 + (num1 + num2) / den1;
            answer = Math.round(total);
            question = `📐 ${whole1} ${num1}/${den1} + ${whole2} ${num2}/${den2} ≈ ? (round to nearest integer)`;
            hint = "Add whole numbers, then fractions";
          }
          break;
        }

        default:
          return null;
      }

      return { q: question, a: answer, h: hint };
    };

    const rewards = {
      easy: { exp: 25, money: 500 },
      mid: { exp: 62, money: 1250 },
      hard: { exp: 100, money: 2500 },
      hell: { exp: 1000, money: 20000 }
    };

    const timeLimits = {
      easy: 0,
      mid: 70 * 1000,
      hard: 80 * 1000,
      hell: 20 * 1000  // Tight time limit!
    };

    const emojis = { easy: "🟢", mid: "🟡", hard: "🟠", hell: "🔴" };

    if (!rewards[difficulty]) {
      return message.reply("❌ Invalid difficulty!");
    }

    const question = generateQuestion(difficulty);
    if (!question) return;

    const timeText =
      timeLimits[difficulty] === 0
        ? "⏳ No time limit"
        : `⏳ Time limit: ${timeLimits[difficulty] / 1000}s`;

    const hintText = question.h ? `\n💡 Hint: ${question.h}` : "";

    await message.reply(
      `${emojis[difficulty]} 𝗠𝗔𝗧𝗛 𝗤𝗨𝗘𝗦𝗧𝗜𝗢𝗡 ${emojis[difficulty]}\n\n` +
      `Difficulty: ${difficulty.toUpperCase()}\n` +
      `💰 Reward: $${rewards[difficulty].money.toLocaleString()} + ${rewards[difficulty].exp} EXP\n` +
      `${timeText}${hintText}\n\n` +
      `❓ ${question.q}\n\n` +
      (difficulty === "hell" ? "🔥 Good luck" : "")
    );

    global.GoatBot = global.GoatBot || {};
    global.GoatBot.mathQuestions = global.GoatBot.mathQuestions || {};
    global.GoatBot.mathQuestions[senderID] = {
      answer: question.a,
      reward: rewards[difficulty],
      difficulty,
      timestamp: Date.now(),
      timeLimit: timeLimits[difficulty]
    };
  },

  onChat: async function ({ message, event, usersData, api }) {
    const { senderID, body } = event;
    const data = global.GoatBot?.mathQuestions?.[senderID];
    if (!data) return;

    // Check time limit
    const timeTaken = (Date.now() - data.timestamp) / 1000;

    if (data.timeLimit > 0 && Date.now() - data.timestamp > data.timeLimit) {
      delete global.GoatBot.mathQuestions[senderID];
      return message.reply("⏰ Time's up! You need to be faster! ⚡");
    }

    const userAnswer = parseInt(body.trim());
    if (isNaN(userAnswer)) return;

    const user = await usersData.get(senderID);

    // Get user info for name
    let userName = "User";
    try {
      const userInfo = await api.getUserInfo(senderID);
      userName = userInfo[senderID]?.name || "User";
    } catch (e) {
      userName = "User";
    }

    // Initialize stats if not exists
    if (!user.data) user.data = {};
    if (!user.data.mathStats) {
      user.data.mathStats = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalEarned: 0,
        hellSolved: 0,
        fastestHell: 999
      };
    }

    const stats = user.data.mathStats;
    stats.totalQuestions += 1;

    if (userAnswer === data.answer) {
      // CORRECT ANSWER
      stats.correctAnswers += 1;
      stats.totalEarned += data.reward.money;
      
      if (data.difficulty === "hell") {
        stats.hellSolved = (stats.hellSolved || 0) + 1;
        if (timeTaken < (stats.fastestHell || 999)) {
          stats.fastestHell = timeTaken;
        }
      }

      // Bonus for speed in hell mode
      let speedBonus = 0;
      if (data.difficulty === "hell" && timeTaken < 20) {
        speedBonus = Math.round(data.reward.money * 0.5); // 50% bonus for under 20s
      } else if (data.difficulty === "hell" && timeTaken < 30) {
        speedBonus = Math.round(data.reward.money * 0.25); // 25% bonus for under 30s
      }

      const totalExp = (user.exp || 0) + data.reward.exp;
      const totalMoney = (user.money || 0) + data.reward.money + speedBonus;

      // Calculate accuracy
      const accuracy = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);

      // Rank based on accuracy and hell questions
      let rank = "🌟";
      const hellCount = stats.hellSolved || 0;
      const fastestTime = stats.fastestHell || 999;

      if (hellCount >= 100 && accuracy >= 95 && fastestTime < 15) rank = "⚡ Speed Demon";
      else if (hellCount >= 50 && accuracy >= 90 && fastestTime < 20) rank = "🧠 Math Prodigy";
      else if (hellCount >= 25 && accuracy >= 85) rank = "🔥 Calculator";
      else if (hellCount >= 10 && accuracy >= 80) rank = "💪 Problem Solver";
      else if (accuracy >= 95) rank = "🏆 Legend";
      else if (accuracy >= 85) rank = "⭐ Expert";
      else if (accuracy >= 75) rank = "🚀 Pro";
      else if (accuracy >= 60) rank = "💫 Rising Star";
      else rank = "🌟 Beginner";

      await usersData.set(senderID, {
        ...user,
        exp: totalExp,
        money: totalMoney,
        data: user.data
      });

      const hellInfo = data.difficulty === "hell" 
        ? `\n🔥 Hell Solved: ${stats.hellSolved} | Fastest: ${stats.fastestHell.toFixed(1)}s`
        : "";
      
      const bonusText = speedBonus > 0 
        ? `\n⚡ 𝗦𝗽𝗲𝗲𝗱 𝗕𝗼𝗻𝘂𝘀: +$${speedBonus.toLocaleString()}` 
        : "";

      message.reply(
        `✅ 𝗖𝗢𝗥𝗥𝗘𝗖𝗧! 🎉\n\n` +
        `💰 𝗠𝗼𝗻𝗲𝘆: +$${data.reward.money.toLocaleString()}${bonusText}\n` +
        `✨ 𝗘𝗫𝗣: +${data.reward.exp}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📊 𝗦𝗰𝗼𝗿𝗲: ${stats.correctAnswers}/${stats.totalQuestions} (${accuracy}%)${hellInfo}\n` +
        `⚡ 𝗧𝗶𝗺𝗲: ${timeTaken.toFixed(1)}s\n` +
        `💵 𝗧𝗼𝘁𝗮𝗹 𝗘𝗮𝗿𝗻𝗲𝗱: $${stats.totalEarned.toLocaleString()}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 ${userName} ${rank}`
      );
    } else {
      // WRONG ANSWER
      const accuracy = Math.round((stats.correctAnswers / stats.totalQuestions) * 100);

      await usersData.set(senderID, {
        ...user,
        data: user.data
      });

      message.reply(
        `❌ 𝗪𝗥𝗢𝗡𝗚! \n\n` +
        `💭 𝗬𝗼𝘂𝗿 𝗔𝗻𝘀𝘄𝗲𝗿: ${userAnswer}\n` +
        `✅ 𝗖𝗼𝗿𝗿𝗲𝗰𝘁: ${data.answer}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📊 𝗦𝗰𝗼𝗿𝗲: ${stats.correctAnswers}/${stats.totalQuestions} (${accuracy}%)\n` +
        `⚡ 𝗧𝗶𝗺𝗲: ${timeTaken.toFixed(1)}s\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `Keep trying! 💪`
      );
    }

    delete global.GoatBot.mathQuestions[senderID];
  }
};
