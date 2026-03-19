module.exports = {
  config: {
    name: "editmoney",
    aliases: ["moneyadd", "moneyremove", "addmoney", "removemoney"],
    version: "1.5",
    author: "Charles MK",
    countDown: 2,
    role: 2,
    description: { en: "Add or remove money from a user's balance." },
    category: "admin",
    guide: { en: "{pn} add [amount] | {pn} remove [amount]" }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const action = args[0]?.toLowerCase();
    if (!["add", "remove"].includes(action)) {
      return message.reply("❌ **INVALID SYNTAX**\n\nUse: **+editmoney add [target] [amount]**\nOr: **+editmoney remove [target] [amount]**");
    }

    let targetID;
    let amountStr;

    // 1. Check if replying to a message
    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
      amountStr = args[1];
    }
    // 2. Check if tagging someone
    else if (Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
      amountStr = args[args.length - 1];
    }
    // 3. Check if UID is provided (Facebook UIDs are typically 15-17 digits)
    else if (args[1] && args[2] && args[1].length >= 15 && args[1].length <= 17 && !isNaN(args[1])) {
      targetID = args[1];
      amountStr = args[2];
    }
    // 4. Default to SENDER if only amount is provided
    else {
      targetID = event.senderID;
      amountStr = args[1];
    }

    // Remove commas and validate
    const cleanAmount = amountStr?.replace(/,/g, "");
    
    // Check if it's a valid number string
    if (!cleanAmount || !/^\d+(\.\d+)?$/.test(cleanAmount)) {
      return message.reply("❌ **ERROR**\n\nPlease provide a valid positive number.\n\nExample: **+editmoney add 50000**");
    }

    // Use BigInt for extremely large numbers, fallback to Number for smaller ones
    let amount;
    let useBigInt = false;
    
    try {
      // If number is larger than safe integer range, use BigInt
      if (cleanAmount.length > 15) {
        amount = BigInt(cleanAmount.split('.')[0]); // BigInt doesn't support decimals
        useBigInt = true;
      } else {
        amount = Number(cleanAmount);
        if (amount <= 0) {
          return message.reply("❌ **ERROR**\n\nAmount must be greater than 0.");
        }
      }
    } catch (err) {
      return message.reply("❌ **ERROR**\n\nInvalid number format.");
    }

    try {
      const userData = await usersData.get(targetID);
      if (!userData) return message.reply("❌ **User not found in database.**");

      let currentMoney = userData.money || 0;
      let newBalance;
      let statusIcon;

      if (useBigInt) {
        const currentBigInt = BigInt(Math.floor(currentMoney));
        
        if (action === "add") {
          newBalance = currentBigInt + amount;
          statusIcon = "💰";
        } else {
          newBalance = currentBigInt >= amount ? currentBigInt - amount : 0n;
          statusIcon = "💸";
        }
        
        // Convert back to number for storage (may lose precision if too large)
        newBalance = Number(newBalance);
      } else {
        if (action === "add") {
          newBalance = currentMoney + amount;
          statusIcon = "💰";
        } else {
          newBalance = Math.max(0, currentMoney - amount);
          statusIcon = "💸";
        }
      }

      await usersData.set(targetID, { money: newBalance });
      const targetName = userData.name || "User";

      // Format display (handle very large numbers)
      const displayAmount = useBigInt ? amount.toString() : amount.toLocaleString();
      const displayBalance = newBalance.toLocaleString('en-US', { maximumFractionDigits: 0 });

      return message.reply(
        `${statusIcon} **ECONOMY UPDATE**\n\n` +
        `Target: **${targetName}**\n` +
        `Action: **${action.toUpperCase()}**\n` +
        `Amount: **$${displayAmount}**\n\n` +
        `New Balance: **$${displayBalance}**`
      );
    } catch (err) {
      return message.reply(`❌ **Database Error:** ${err.message}`);
    }
  }
};
