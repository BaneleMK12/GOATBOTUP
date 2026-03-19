/*const fs = require("fs");
const path = require("path");

global.rpgBattles = global.rpgBattles || new Map();
global.rpgInvites = global.rpgInvites || new Map();

module.exports = {
    config: {
        name: "dual",
        version: "3.0.0",
        author: "Charles MK",
        countDown: 5,
        role: 0,
        description: "Advanced RPG combat system with 100+ moves",
        category: "game",
        guide: "{pn} @mention / uid"
    },

    onStart: async function ({ api, event, args, usersData }) {
        const { threadID, messageID, senderID, mentions } = event;
        const targetID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[0];

        if (!targetID || targetID == senderID) return api.sendMessage("⚠️ Tag a valid opponent!", threadID, messageID);

        const p1Name = (await usersData.get(senderID)).name;
        const p2Name = (await usersData.get(targetID)).name;
        const inviteID = `${threadID}_${targetID}`;
        
        global.rpgInvites.set(inviteID, { challengerID: senderID, challengerName: p1Name, targetName: p2Name });

        return api.sendMessage(`⚔️ ${p1Name} challenged ${p2Name}!\n\n${p2Name}, reply "Accept" or "Decline" to this message within 60s.`, threadID, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                messageID: info.messageID,
                challengerID: senderID
            });
            setTimeout(() => global.rpgInvites.delete(inviteID), 60000);
        }, messageID);
    },

    onReply: async function ({ api, event, Reply, usersData }) {
        const { threadID, senderID, messageID, body } = event;
        const input = body.toLowerCase();
        const inviteID = `${threadID}_${senderID}`;
        const invite = global.rpgInvites.get(inviteID);

        if (!invite) return;

        if (input === "accept") {
            const p1 = await getOrInitStats(invite.challengerID, usersData);
            const p2 = await getOrInitStats(senderID, usersData);

            let arsenalMsg = `📊 𝗔𝗥𝗦𝗘𝗡𝗔𝗟 𝗖𝗛𝗘𝗖𝗞 📊\n━━━━━━━━━━━━━━\n` +
                `👤 ${invite.challengerName} | 🧬 ${p1.trait.name}\n❤️ HP: ${p1.hp} | 💪 STR: ${p1.str} | 🎯 DEX: ${p1.dex}\n` +
                `━━━━━━━━━━━━━━\n` +
                `👤 ${invite.targetName} | 🧬 ${p2.trait.name}\n❤️ HP: ${p2.hp} | 💪 STR: ${p2.str} | 🎯 DEX: ${p2.dex}\n━━━━━━━━━━━━━━\n\n`;

            const p1Inv = (await usersData.get(invite.challengerID)).data.inventory || [];
            const p2Inv = (await usersData.get(senderID)).data.inventory || [];

            if (p1Inv.length === 0 || p2Inv.length === 0) {
                arsenalMsg += `👊 No equipment! Start FIST FIGHT?\n👉 Reply "Yes" or "No".`;
                return api.sendMessage(arsenalMsg, threadID, (err, info) => {
                    global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, messageID: info.messageID });
                }, messageID);
            }
            global.rpgInvites.delete(inviteID);
            return startBattle(api, invite.challengerID, senderID, p1, p2, threadID);
        }

        if (input === "yes") {
            const p1 = await getOrInitStats(invite.challengerID, usersData);
            const p2 = await getOrInitStats(senderID, usersData);
            global.rpgInvites.delete(inviteID);
            return startBattle(api, invite.challengerID, senderID, p1, p2, threadID);
        }
    },

    onChat: async function ({ api, event, usersData }) {
        const { threadID, senderID, body } = event;
        const input = body.toLowerCase();
        const battleKey = `${threadID}_battle`;
        const battle = global.rpgBattles.get(battleKey);

        if (!battle || battle.turn !== senderID) return;

        // Load dynamic move list
        const movePath = path.join(__dirname, 'rpg', 'moves.json');
        if (!fs.existsSync(movePath)) return;
        const moves = JSON.parse(fs.readFileSync(movePath, 'utf8'));

        const move = moves[input];
        if (!move) return;

        const attacker = battle.p1.id === senderID ? battle.p1 : battle.p2;
        const defender = battle.p1.id === senderID ? battle.p2 : battle.p1;

        if (attacker.energy < move.nrg) return api.sendMessage(`⚠️ Low Energy! Need ${move.nrg} NRG.`, threadID);

        let dmg = Math.floor((attacker.str * (move.mult || 1)) + (Math.random() * 10));
        let log = `${attacker.name} used ${input.toUpperCase()}! ${move.log || ""}`;
        let isStunned = false;

        // Critical Hit (Luck)
        if (Math.random() < (attacker.luk * 0.02)) {
            dmg = Math.floor(dmg * 1.5);
            log = "💥 **CRITICAL!** " + log;
        }

        // Dodge logic
        if (defender.isDodging && Math.random() < 0.4) {
            dmg = 0; log = `🚫 ${defender.name} dodged the attack!`;
            defender.isDodging = false;
        }

        // Special Effects
        if (move.stun && Math.random() < move.stun) isStunned = true;
        attacker.isDodging = move.dodge || false;

        attacker.energy -= move.nrg;
        defender.hp -= dmg;
        attacker.energy = Math.min(attacker.energy + 10, 100 + (attacker.int || 0));

        if (defender.hp <= 0) {
            global.rpgBattles.delete(battleKey);
            return api.sendMessage(`💀 ${defender.name} defeated!\n🏆 WINNER: ${attacker.name}`, threadID);
        }

        if (!isStunned && !move.extraTurn) battle.turn = defender.id;

        const status = `📊 **BATTLE**\n👤 ${battle.p1.name}: ${battle.p1.hp} HP | ${battle.p1.energy} NRG\n👤 ${battle.p2.name}: ${battle.p2.hp} HP | ${battle.p2.energy} NRG\n━━━━━━━━━━━━━━\n📝 ${log}\n💥 Damage: ${dmg}\n👉 Next: ${isStunned || move.extraTurn ? attacker.name : defender.name}`;
        api.sendMessage(status, threadID);
    }
};

async function getOrInitStats(userID, usersData) {
    const userData = await usersData.get(userID);
    if (userData.data.rpgStats) return { ...userData.data.rpgStats, name: userData.name };

    const traits = JSON.parse(fs.readFileSync(path.join(__dirname, 'rpg', 'traits.json'), 'utf8'));
    const trait = traits[Math.floor(Math.random() * traits.length)];
    const stats = { hp: 150, str: 5, dex: 2, speed: 2, int: 2, luk: 2, energy: 100, trait };

    await usersData.set(userID, { data: { ...userData.data, rpgStats: stats } });
    return { ...stats, name: userData.name };
}

async function startBattle(api, p1ID, p2ID, p1, p2, threadID) {
    global.rpgBattles.set(`${threadID}_battle`, { p1: {...p1, id: p1ID}, p2: {...p2, id: p2ID}, turn: p1ID });
    api.sendMessage(`🥊 𝗙𝗜𝗚𝗛𝗧 𝗕𝗘𝗚𝗜𝗡𝗦!\n👉 ${p1.name}, enter your move!`, threadID);
}*/
