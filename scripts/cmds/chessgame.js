let Chess;
try {
  const chessModule = require("chess.js");
  Chess = chessModule.Chess || chessModule;
} catch (e) {
  console.error("CHESS ERROR: 'chess.js' is not installed.");
}

const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "chessgame",
    aliases: ["chess", "playchess"],
    version: "7.1.0",
    author: "Charles MK",
    countDown: 5,
    role: 0,
    description: "Professional Chess with chess.js engine",
    category: "game",
    guide: {
      en: "{pn} @user - Start\n{pn} move [from] [to]\n{pn} board\n{pn} resign"
    }
  },

  onStart: async function ({ message, event, args }) {
    const { threadID, senderID } = event;
    if (!global.chessGames) global.chessGames = {};

    if (!Chess) {
      return message.reply("❌ Server Error: 'chess.js' is not installed. Please run 'npm install chess.js' in the terminal.");
    }

    const action = args[0]?.toLowerCase();
    const game = global.chessGames[threadID];

    // --- 1. HANDLE NEW GAME START ---
    // If there's no game and the user didn't say "move" or "board", assume they want to start
    if (!game) {
      let opponentID = event.messageReply?.senderID || Object.keys(event.mentions)[0];
      
      if (!opponentID) {
        return message.reply("❌ Tag an opponent or reply to their message to start a new game!");
      }

      global.chessGames[threadID] = {
        white: senderID,
        black: opponentID,
        engine: new Chess(),
        lastMove: null
      };
      return this.sendBoard(message, global.chessGames[threadID], "♟️ 𝗖𝗛𝗘𝗦𝗦 𝗠𝗔𝗧𝗖𝗛 𝗕𝗘𝗚𝗨𝗡!\nWhite moves first.");
    }

    // --- 2. HANDLE ACTIONS FOR EXISTING GAME ---
    if (action === "move") {
      const turn = game.engine.turn(); // 'w' or 'b'
      const currentPlayer = turn === 'w' ? game.white : game.black;
      
      if (senderID !== currentPlayer) {
        return message.reply(`❌ It's not your turn! Waiting for ${turn === 'w' ? 'White' : 'Black'}.`);
      }

      const from = args[1]?.toLowerCase();
      const to = args[2]?.toLowerCase();

      try {
        const move = game.engine.move({ from, to, promotion: 'q' });
        if (!move) return message.reply("❌ Illegal move! The engine has blocked this path.");
        game.lastMove = { from, to };
      } catch (e) {
        return message.reply("❌ Invalid squares. Format: move e2 e4");
      }

      if (game.engine.isGameOver()) {
        const finalImg = await this.renderBoard(game);
        let msg = "🏁 𝗚𝗔𝗠𝗘 𝗢𝗩𝗘𝗥!";
        if (game.engine.isCheckmate()) msg = `🏆 𝗖𝗛𝗘𝗖𝗞𝗠𝗔𝗧𝗘! ${turn === 'w' ? 'White' : 'Black'} wins!`;
        else if (game.engine.isDraw()) msg = "🤝 𝗗𝗥𝗔𝗪!";

        delete global.chessGames[threadID];
        return message.reply({ body: msg, attachment: fs.createReadStream(finalImg) }, () => fs.unlinkSync(finalImg));
      }

      return this.sendBoard(message, game, `✅ Move accepted! Next: ${game.engine.turn() === 'w' ? 'White' : 'Black'}`);
    }

    if (action === "resign") {
      delete global.chessGames[threadID];
      return message.reply("🏳️ 𝗚𝗮𝗺𝗲 𝗘𝗻𝗱𝗲𝗱 by resignation.");
    }

    // Default: Just show the board
    return this.sendBoard(message, game, `💬 Current Turn: ${game.engine.turn() === 'w' ? 'White' : 'Black'}`);
  },

  renderBoard: async function (game) {
    const sz = 80, pad = 50;
    const canvasSize = sz * 8 + pad * 2;
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#262421"; 
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        ctx.fillStyle = (r + f) % 2 === 0 ? "#ebecd0" : "#779556";
        ctx.fillRect(pad + f * sz, pad + r * sz, sz, sz);
      }
    }

    if (game.lastMove) {
      try {
        const fPos = { x: game.lastMove.from.charCodeAt(0) - 97, y: 8 - parseInt(game.lastMove.from[1]) };
        const tPos = { x: game.lastMove.to.charCodeAt(0) - 97, y: 8 - parseInt(game.lastMove.to[1]) };
        ctx.fillStyle = "rgba(255, 255, 0, 0.35)";
        ctx.fillRect(pad + fPos.x * sz, pad + fPos.y * sz, sz, sz);
        ctx.fillRect(pad + tPos.x * sz, pad + tPos.y * sz, sz, sz);
      } catch (e) {}
    }

    ctx.fillStyle = "#bababa"; ctx.font = "bold 20px Arial"; ctx.textAlign = "center";
    const letters = "abcdefgh";
    for (let i = 0; i < 8; i++) {
      ctx.fillText(letters[i], pad + i * sz + sz / 2, canvasSize - 15);
      ctx.fillText(8 - i, 20, pad + i * sz + sz / 2 + 7);
    }

    const pieceMap = { 'p': 'B_p', 'r': 'B_r', 'n': 'B_n', 'b': 'B_b', 'q': 'B_q', 'k': 'B_k', 'P': 'W_P', 'R': 'W_R', 'N': 'W_N', 'B': 'W_B', 'Q': 'W_Q', 'K': 'W_K' };
    const board = game.engine.board();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece) {
          const char = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
          const assetPath = path.join(__dirname, "chess_assets", `${pieceMap[char]}.png`);
          try {
            const img = await loadImage(assetPath);
            ctx.drawImage(img, pad + f * sz + 5, pad + r * sz + 5, sz - 10, sz - 10);
          } catch (e) {
            ctx.fillStyle = piece.color === 'w' ? "#FFF" : "#000";
            ctx.fillText(char, pad + f * sz + sz/2, pad + r * sz + sz/2);
          }
        }
      }
    }

    const imgPath = path.join(__dirname, `chess_${Date.now()}.png`);
    fs.writeFileSync(imgPath, canvas.toBuffer());
    return imgPath;
  },

  sendBoard: async function (message, game, bodyText) {
    const imgPath = await this.renderBoard(game);
    return message.reply({ body: bodyText, attachment: fs.createReadStream(imgPath) }, () => {
      try { if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); } catch (e) {}
    });
  }
};
