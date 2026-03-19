const workCooldowns = new Map();

module.exports = {
  config: {
    name: "work",
    aliases: ["job"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: {
      en: "Work at different jobs to earn money!"
    },
    category: "economy",
    guide: {
      en: "{pn} - View available jobs\n{pn} <job number> - Work at a job\n\n⏰ Cooldown: 30 minutes per job"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID } = event;

    const jobs = [
      {
        id: 1,
        name: "🍔 Fast Food Worker",
        description: "Serve customers at a burger joint",
        minPay: 50,
        maxPay: 150,
        scenarios: [
          { task: "How many burgers should you make?", answer: "5", options: ["3", "5", "10", "15"] },
          { task: "A customer wants extra pickles. What do you say?", answer: "Sure thing!", options: ["No way", "Sure thing!", "Maybe later", "I'm busy"] },
          { task: "The fryer timer is beeping! What do you do?", answer: "Take out the fries", options: ["Ignore it", "Take out the fries", "Turn it off", "Run away"] },
          { task: "How many napkins in a standard dispenser?", answer: "100", options: ["50", "100", "200", "500"] }
        ]
      },
      {
        id: 2,
        name: "📦 Delivery Driver",
        description: "Deliver packages around the city",
        minPay: 100,
        maxPay: 250,
        scenarios: [
          { task: "Which route is fastest to downtown?", answer: "Main Street", options: ["Highway 1", "Main Street", "Back roads", "Tunnel route"] },
          { task: "Package says 'Fragile'. How do you handle it?", answer: "Carefully with both hands", options: ["Throw it", "Carefully with both hands", "Stack heavy items on top", "Leave at door"] },
          { task: "Customer isn't home. What do you do?", answer: "Leave safe location note", options: ["Take it back", "Leave safe location note", "Give to neighbor", "Open it"] },
          { task: "How many packages can fit in the van?", answer: "50", options: ["20", "50", "100", "200"] }
        ]
      },
      {
        id: 3,
        name: "💻 Freelance Coder",
        description: "Code websites and apps for clients",
        minPay: 200,
        maxPay: 500,
        scenarios: [
          { task: "Client wants a login system. What do you use?", answer: "Authentication API", options: ["Paint", "Authentication API", "Excel", "Notepad"] },
          { task: "Bug in production! What's priority?", answer: "Fix immediately", options: ["Ignore it", "Fix immediately", "Tell client later", "Blame intern"] },
          { task: "Which language for web development?", answer: "JavaScript", options: ["C++", "JavaScript", "Assembly", "COBOL"] },
          { task: "Client wants it done in 1 hour. What do you say?", answer: "Need realistic timeline", options: ["Sure!", "Need realistic timeline", "Impossible", "Double the price"] }
        ]
      },
      {
        id: 4,
        name: "🎨 Graphic Designer",
        description: "Create logos and designs for clients",
        minPay: 150,
        maxPay: 400,
        scenarios: [
          { task: "Client wants 'modern minimalist'. What colors?", answer: "Black and white", options: ["Rainbow", "Black and white", "Neon colors", "All red"] },
          { task: "Best software for logo design?", answer: "Adobe Illustrator", options: ["MS Paint", "Adobe Illustrator", "Notepad", "PowerPoint"] },
          { task: "Client hates your design. What do you do?", answer: "Ask for feedback", options: ["Cry", "Ask for feedback", "Quit", "Charge double"] },
          { task: "What file format for print?", answer: "PDF", options: ["JPG", "PDF", "GIF", "BMP"] }
        ]
      },
      {
        id: 5,
        name: "🏥 Medical Assistant",
        description: "Help patients at the hospital",
        minPay: 250,
        maxPay: 600,
        scenarios: [
          { task: "Patient has high fever. What do you check first?", answer: "Temperature", options: ["Weight", "Temperature", "Height", "Blood type"] },
          { task: "Emergency patient arrives. What's priority?", answer: "Call doctor immediately", options: ["Make them wait", "Call doctor immediately", "Take lunch break", "Check insurance"] },
          { task: "How often to sanitize equipment?", answer: "After each use", options: ["Once a day", "After each use", "Weekly", "Never"] },
          { task: "Patient allergic to penicillin. What do you do?", answer: "Note in chart", options: ["Ignore it", "Note in chart", "Give anyway", "Ask Google"] }
        ]
      },
      {
        id: 6,
        name: "🎬 Content Creator",
        description: "Create videos and content online",
        minPay: 100,
        maxPay: 800,
        scenarios: [
          { task: "Video going viral! What do you do?", answer: "Engage with comments", options: ["Delete it", "Engage with comments", "Ignore it", "Sleep"] },
          { task: "Best time to upload content?", answer: "Peak hours", options: ["3 AM", "Peak hours", "Random time", "Never"] },
          { task: "Negative comment appears. How to respond?", answer: "Professional response", options: ["Fight back", "Professional response", "Delete channel", "Cry"] },
          { task: "Sponsor wants partnership. What do you check?", answer: "Brand alignment", options: ["Just take money", "Brand alignment", "Reject all sponsors", "Ask mom"] }
        ]
      },
      {
        id: 7,
        name: "🏗️ Construction Worker",
        description: "Build and repair structures",
        minPay: 200,
        maxPay: 450,
        scenarios: [
          { task: "Safety first! What do you wear?", answer: "Hard hat and boots", options: ["Flip flops", "Hard hat and boots", "Suit and tie", "Nothing"] },
          { task: "Wall needs support. What do you use?", answer: "Steel beams", options: ["Tape", "Steel beams", "Hope", "Cardboard"] },
          { task: "How to measure accurately?", answer: "Use level and tape", options: ["Eyeball it", "Use level and tape", "Ask random person", "Guess"] },
          { task: "Rain starts during roofing. What do you do?", answer: "Stop and cover work", options: ["Keep working", "Stop and cover work", "Run away", "Dance"] }
        ]
      },
      {
        id: 8,
        name: "📸 Photographer",
        description: "Capture stunning photographs",
        minPay: 180,
        maxPay: 550,
        scenarios: [
          { task: "Golden hour is when?", answer: "Sunrise/sunset", options: ["Noon", "Sunrise/sunset", "Midnight", "Anytime"] },
          { task: "Client wants bokeh effect. What setting?", answer: "Wide aperture", options: ["Small aperture", "Wide aperture", "High ISO", "Flash on"] },
          { task: "Indoor event is dark. What do you adjust?", answer: "ISO and aperture", options: ["Nothing", "ISO and aperture", "Turn off camera", "Leave"] },
          { task: "Best format for professional photos?", answer: "RAW", options: ["JPG low quality", "RAW", "BMP", "GIF"] }
        ]
      }
    ];

    // Show job list
    if (!args[0]) {
      let response = "💼 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗝𝗢𝗕𝗦\n";
      response += "━━━━━━━━━━━━━━━━━━━━\n\n";

      for (const job of jobs) {
        response += `${job.id}. ${job.name}\n`;
        response += `   ${job.description}\n`;
        response += `   💵 $${job.minPay} - $${job.maxPay}\n\n`;
      }

      response += "━━━━━━━━━━━━━━━━━━━━\n";
      response += "Use: +work <job number>\n";
      response += "Example: +work 1\n\n";
      response += "⏰ Cooldown: 30 minutes";

      return message.reply(response);
    }

    const jobId = parseInt(args[0]);
    const selectedJob = jobs.find(j => j.id === jobId);

    if (!selectedJob) {
      return message.reply("❌ Invalid job number! Use +work to see available jobs.");
    }

    // Check cooldown
    const now = Date.now();
    const cooldownKey = `${senderID}-${jobId}`;
    const lastWork = workCooldowns.get(cooldownKey);

    if (lastWork && now - lastWork < 1800000) { // 30 minutes
      const timeLeft = 1800000 - (now - lastWork);
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      return message.reply(
        `⏰ You recently worked this job!\n\n` +
        `Wait: ${minutes}m ${seconds}s\n\n` +
        `Try a different job or wait for cooldown.`
      );
    }

    // Random scenario
    const scenario = selectedJob.scenarios[Math.floor(Math.random() * selectedJob.scenarios.length)];

    // Send scenario
    let scenarioMsg = `${selectedJob.name}\n`;
    scenarioMsg += "━━━━━━━━━━━━━━━━━━━━\n\n";
    scenarioMsg += `📋 Task: ${scenario.task}\n\n`;
    
    scenario.options.forEach((option, index) => {
      scenarioMsg += `${index + 1}. ${option}\n`;
    });

    scenarioMsg += "\nReply with the number (1-4):";

    await message.reply(scenarioMsg, (err, info) => {
      if (info) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          messageID: info.messageID,
          jobId: jobId,
          job: selectedJob,
          scenario: scenario
        });
      }
    });
  },

  onReply: async function ({ message, event, Reply, usersData }) {
    const userID = event.senderID;
    const choice = parseInt(event.body?.trim());

    if (userID !== Reply.author) return;

    global.GoatBot.onReply.delete(Reply.messageID);

    if (!choice || choice < 1 || choice > 4) {
      return message.reply("❌ Invalid choice! Please pick 1-4.");
    }

    const selectedOption = Reply.scenario.options[choice - 1];
    const correctAnswer = Reply.scenario.answer;
    const job = Reply.job;

    const userData = await usersData.get(userID);
    const balance = userData.money || 0;

    if (selectedOption === correctAnswer) {
      // Correct answer - earn money
      const earnings = Math.floor(Math.random() * (job.maxPay - job.minPay + 1)) + job.minPay;
      const newBalance = balance + earnings;

      await usersData.set(userID, {
        money: newBalance,
        exp: userData.exp,
        data: userData.data
      });

      // Set cooldown
      const cooldownKey = `${userID}-${Reply.jobId}`;
      workCooldowns.set(cooldownKey, Date.now());

      return message.reply(
        `✅ 𝗚𝗥𝗘𝗔𝗧 𝗪𝗢𝗥𝗞! 🎉\n\n` +
        `You answered correctly!\n` +
        `💰 Earned: $${earnings}\n\n` +
        `💵 New Balance: $${newBalance.toLocaleString()}\n\n` +
        `⏰ Cooldown: 30 minutes for this job`
      );
    } else {
      // Wrong answer - small penalty or no earnings
      return message.reply(
        `❌ 𝗪𝗥𝗢𝗡𝗚 𝗔𝗡𝗦𝗪𝗘𝗥! 😔\n\n` +
        `The correct answer was: ${correctAnswer}\n\n` +
        `You didn't earn anything this time.\n` +
        `Try again in 30 minutes or pick a different job!`
      );
    }
  }
};
