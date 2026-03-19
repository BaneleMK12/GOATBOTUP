// ═══════════════════════════════════════════════════════════════
//   train.js  —  Train your fighter every 5 hours
// ═══════════════════════════════════════════════════════════════

const TRAIN_COOLDOWN_MS = 5 * 60 * 60 * 1000; // 5 hours

// Possible random training outcomes
const OUTCOMES = [
  { stat: "fightAtkBonus",     label: "𝗔𝘁𝘁𝗮𝗰𝗸",    gain: () => randomInt(1, 4),  emoji: "💥" },
  { stat: "fightDefBonus",     label: "𝗗𝗲𝗳𝗲𝗻𝘀𝗲",   gain: () => randomInt(1, 4),  emoji: "🛡️" },
  { stat: "fightAgilityBonus", label: "𝗔𝗴𝗶𝗹𝗶𝘁𝘆",   gain: () => randomInt(1, 4),  emoji: "💨" },
  { stat: "fightAtkBonus",     label: "𝗔𝘁𝘁𝗮𝗰𝗸",    gain: () => randomInt(2, 6),  emoji: "🔥", rare: true },
  { stat: "fightDefBonus",     label: "𝗗𝗲𝗳𝗲𝗻𝘀𝗲",   gain: () => randomInt(2, 6),  emoji: "🔥", rare: true },
  { stat: "fightAgilityBonus", label: "𝗔𝗴𝗶𝗹𝗶𝘁𝘆",   gain: () => randomInt(2, 6),  emoji: "🔥", rare: true },
];

const TRAINING_FLAVORS = [
  "𝘚𝘱𝘢𝘳𝘳𝘦𝘥 𝘪𝘯𝘵𝘦𝘯𝘴𝘦𝘭𝘺 𝘸𝘪𝘵𝘩 𝘢 𝘴𝘩𝘢𝘥𝘰𝘸 𝘸𝘢𝘳𝘳𝘪𝘰𝘳…",
  "𝘛𝘳𝘢𝘪𝘯𝘦𝘥 𝘶𝘯𝘥𝘦𝘳 𝘢 𝘸𝘢𝘵𝘦𝘳𝘧𝘢𝘭𝘭 𝘧𝘰𝘳 𝘩𝘰𝘶𝘳𝘴…",
  "𝘚𝘱𝘦𝘯𝘵 𝘵𝘩𝘦 𝘮𝘰𝘳𝘯𝘪𝘯𝘨 𝘵𝘩𝘳𝘰𝘸𝘪𝘯𝘨 𝘱𝘶𝘯𝘤𝘩𝘦𝘴 𝘢𝘵 𝘳𝘰𝘤𝘬𝘴…",
  "𝘙𝘢𝘯 50 𝘮𝘪𝘭𝘦𝘴 𝘢𝘯𝘥 𝘤𝘢𝘳𝘳𝘪𝘦𝘥 𝘢 𝘣𝘰𝘶𝘭𝘥𝘦𝘳…",
  "𝘚𝘵𝘶𝘥𝘪𝘦𝘥 𝘢𝘯𝘤𝘪𝘦𝘯𝘵 𝘮𝘢𝘳𝘵𝘪𝘢𝘭 𝘢𝘳𝘵𝘴 𝘴𝘤𝘳𝘰𝘭𝘭𝘴…",
  "𝘔𝘦𝘥𝘪𝘵𝘢𝘵𝘦𝘥 𝘰𝘯 𝘵𝘩𝘦 𝘦𝘥𝘨𝘦 𝘰𝘧 𝘢 𝘤𝘭𝘪𝘧𝘧…",
  "𝘚𝘱𝘢𝘳𝘳𝘦𝘥 𝘢𝘨𝘢𝘪𝘯𝘴𝘵 𝘵𝘩𝘳𝘦𝘦 𝘰𝘱𝘱𝘰𝘯𝘦𝘯𝘵𝘴 𝘢𝘵 𝘰𝘯𝘤𝘦…",
  "𝘋𝘳𝘪𝘭𝘭𝘦𝘥 𝘧𝘰𝘰𝘵𝘸𝘰𝘳𝘬 𝘶𝘯𝘵𝘪𝘭 𝘴𝘶𝘯𝘥𝘰𝘸𝘯…",
];

// Skill-specific training messages
const SKILL_FLAVORS = {
  punch:     "𝘊𝘭𝘦𝘢𝘯𝘦𝘥 𝘺𝘰𝘶𝘳 𝘱𝘶𝘯𝘤𝘩 𝘧𝘰𝘳𝘮 𝘰𝘯 𝘵𝘩𝘦 𝘣𝘢𝘨…",
  kick:      "𝘒𝘪𝘤𝘬𝘦𝘥 𝘵𝘩𝘳𝘰𝘶𝘨𝘩 100 𝘣𝘰𝘢𝘳𝘥𝘴…",
  slap:      "𝘚𝘭𝘢𝘱𝘱𝘦𝘥 𝘸𝘢𝘵𝘦𝘳 𝘸𝘪𝘵𝘩 𝘱𝘳𝘦𝘤𝘪𝘴𝘪𝘰𝘯…",
  headbutt:  "𝘏𝘦𝘢𝘥𝘣𝘶𝘵𝘵𝘦𝘥 𝘴𝘵𝘰𝘯𝘦 𝘸𝘢𝘭𝘭𝘴 𝘵𝘰 𝘩𝘢𝘳𝘥𝘦𝘯 𝘺𝘰𝘶𝘳 𝘴𝘬𝘶𝘭𝘭…",
  elbow:     "𝘋𝘳𝘪𝘭𝘭𝘦𝘥 𝘦𝘭𝘣𝘰𝘸 𝘴𝘵𝘳𝘪𝘬𝘦𝘴 𝘪𝘯𝘵𝘰 𝘢 𝘵𝘳𝘦𝘦 𝘵𝘳𝘶𝘯𝘬…",
  uppercut:  "𝘜𝘱𝘱𝘦𝘳𝘤𝘶𝘵 𝘮𝘢𝘯𝘪𝘢𝘤𝘦 𝘤𝘢𝘴𝘦 — 500 𝘳𝘦𝘱𝘴…",
  backslash: "𝘓𝘦𝘢𝘳𝘯𝘦𝘥 𝘴𝘭𝘢𝘴𝘩𝘪𝘯𝘨 𝘸𝘪𝘯𝘥 𝘵𝘦𝘤𝘩𝘯𝘪𝘲𝘶𝘦…",
  dropkick:  "𝘋𝘳𝘰𝘱𝘬𝘪𝘤𝘬 𝘵𝘢𝘳𝘨𝘦𝘵 𝘥𝘳𝘪𝘭𝘭 𝘥𝘰𝘯𝘦…",
  suplex:    "𝘓𝘪𝘧𝘵𝘦𝘥 𝘣𝘰𝘶𝘭𝘥𝘦𝘳𝘴 𝘧𝘰𝘳 𝘴𝘶𝘱𝘭𝘦𝘹 𝘴𝘵𝘳𝘦𝘯𝘨𝘵𝘩…",
  haymaker:  "𝘚𝘸𝘶𝘯𝘨 𝘢 𝘩𝘢𝘺𝘮𝘢𝘬𝘦𝘳 𝘵𝘩𝘳𝘰𝘶𝘨𝘩 𝘣𝘳𝘪𝘤𝘬𝘴…",
  stomp:     "𝘚𝘵𝘰𝘮𝘱𝘦𝘥 𝘢 𝘵𝘳𝘢𝘪𝘭 𝘧𝘰𝘳 𝘩𝘰𝘶𝘳𝘴…",
};

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function msToCd(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

// ═══════════════════════════════════════════════════════════════
module.exports = {
  config: {
    name: "train",
    aliases: ["fightrain", "ftrain"],
    version: "1.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    shortDescription: { en: "🏋️ Train your fighter (every 5 hours)" },
    category: "fun",
    guide: {
      en:
        "+train           — Random training boost\n" +
        "+train [move]    — Train a specific attack (improves its damage)\n" +
        "  Cooldown: 5 hours (your body needs rest!)",
    },
  },

  onStart: async function ({ event, message, usersData, args }) {
    const senderID = event.senderID;
    const userData = await usersData.get(senderID);
    const data     = userData.data || {};

    const now       = Date.now();
    const lastTrain = data.fightTrainedAt || 0;
    const elapsed   = now - lastTrain;

    if (elapsed < TRAIN_COOLDOWN_MS) {
      const remaining = TRAIN_COOLDOWN_MS - elapsed;
      return message.send(
        `⏳ 𝗡𝗲𝗲𝗱 𝗿𝗲𝘀𝘁!\n━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🛌 𝗬𝗼𝘂𝗿 𝗯𝗼𝗱𝘆 𝗶𝘀 𝘀𝘁𝗶𝗹𝗹 𝗿𝗲𝗰𝗼𝘃𝗲𝗿𝗶𝗻𝗴!\n` +
        `⏱️ 𝗧𝗿𝗮𝗶𝗻 𝗮𝗴𝗮𝗶𝗻 𝗶𝗻: ${msToCd(remaining)}`
      );
    }

    const targetMove = args[0]?.toLowerCase();
    const VALID_MOVES = [
      "punch","kick","slap","headbutt","elbow","uppercut",
      "backslash","dropkick","suplex","haymaker","stomp",
    ];

    let outcome, flavorText, isSkillTrain = false;

    // ── Specific move training ──────────────────────────────
    if (targetMove && VALID_MOVES.includes(targetMove)) {
      isSkillTrain = true;
      const skills = data.fightSkills || {};
      const curLvl = skills[targetMove] || 0;
      const gain   = randomInt(1, 3);
      const newLvl = curLvl + gain;

      flavorText = SKILL_FLAVORS[targetMove] || TRAINING_FLAVORS[randomInt(0, TRAINING_FLAVORS.length - 1)];

      await usersData.set(senderID, {
        data: {
          ...data,
          fightSkills:   { ...skills, [targetMove]: newLvl },
          fightTrainedAt: now,
        },
      });

      return message.send(
        `🏋️ 𝗦𝗞𝗜𝗟𝗟 𝗧𝗥𝗔𝗜𝗡𝗜𝗡𝗚!\n━━━━━━━━━━━━━━━━━━━━━━\n` +
        `${flavorText}\n\n` +
        `⚔️ ${targetMove.toUpperCase()} skill: 𝗟𝘃.${curLvl} → 𝗟𝘃.${newLvl}\n` +
        `💪 +${gain} 𝘴𝘬𝘪𝘭𝘭 𝘭𝘦𝘷𝘦𝘭 (𝗱𝗮𝗺𝗮𝗴𝗲 +${gain * 3} 𝗽𝗲𝗿 𝗵𝗶𝘁)\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `⏱️ 𝘕𝘦𝘹𝘵 𝘵𝘳𝘢𝘪𝘯 𝘪𝘯 5𝘩`
      );
    }

    // ── General random training ─────────────────────────────
    const isRare = Math.random() < 0.12; // 12% rare outcome
    const pool   = OUTCOMES.filter(o => !!o.rare === isRare);
    outcome      = pool[randomInt(0, pool.length - 1)];
    flavorText   = TRAINING_FLAVORS[randomInt(0, TRAINING_FLAVORS.length - 1)];
    const gained = outcome.gain();

    const curVal = data[outcome.stat] || 0;
    const newVal = curVal + gained;

    await usersData.set(senderID, {
      data: {
        ...data,
        [outcome.stat]:  newVal,
        fightTrainedAt: now,
      },
    });

    const rareTag = isRare ? "🔥 𝗥𝗔𝗥𝗘 𝗧𝗥𝗔𝗜𝗡𝗜𝗡𝗚 𝗕𝗢𝗡𝗨𝗦!\n" : "";

    return message.send(
      `🏋️ 𝗧𝗥𝗔𝗜𝗡𝗜𝗡𝗚 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘!\n━━━━━━━━━━━━━━━━━━━━━━\n` +
      `${flavorText}\n\n` +
      `${rareTag}` +
      `${outcome.emoji} ${outcome.label}: +${gained} (𝗧𝗼𝘁𝗮𝗹: ${newVal})\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⏱️ 𝘕𝘦𝘹𝘵 𝘵𝘳𝘢𝘪𝘯 𝘪𝘯 5𝘩\n` +
      `💡 𝘛𝘪𝘱: Use +train [move] to train a specific attack!`
    );
  },
};
