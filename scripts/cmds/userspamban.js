const moment = require("moment-timezone");

module.exports = {
        config: {
                name: "userspamban",
                aliases: ["userban", "uspamlist"],
                version: "1.0",
                author: "Charles MK",
                countDown: 5,
                role: 2,
                description: {
                        vi: "Quản lý danh sách người dùng bị spam ban tự động",
                        en: "Manage auto spam-banned users (unban only)"
                },
                category: "owner",
                guide: {
                        vi: "   {pn} list: Xem danh sách người dùng bị spam ban"
                                + "\n   {pn} unban <userID>: Bỏ spam ban người dùng"
                                + "\n   {pn} warnings: Xem danh sách cảnh báo hiện tại"
                                + "\n   {pn} clearwarnings <userID>: Xóa cảnh báo của người dùng"
                                + "\n   {pn} info: Xem cấu hình spam detection",
                        en: "   {pn} list: View list of spam-banned users"
                                + "\n   {pn} unban <userID>: Unban a spam-banned user"
                                + "\n   {pn} warnings: View current warnings list"
                                + "\n   {pn} clearwarnings <userID>: Clear warnings for a user"
                                + "\n   {pn} info: View spam detection config"
                }
        },

        langs: {
                vi: {
                        noData: "≡ | Không có người dùng nào bị spam ban",
                        listBanned: "≡ | Danh sách người dùng spam ban (trang %1/%2):\n\n%3",
                        unbanned: "✅ | Đã bỏ spam ban cho người dùng %1",
                        notBanned: "⚠ | Người dùng này không bị spam ban",
                        invalidUserID: "⚠ | Vui lòng nhập userID hợp lệ",
                        info: "📊 | User Spam Detection Config:\n• Threshold: %1 commands in %2 seconds\n• Warnings before ban: %3\n• Ban duration: %4 hours\n• Total banned users: %5\n• Users with warnings: %6",
                        noWarnings: "≡ | Không có người dùng nào có cảnh báo",
                        listWarnings: "≡ | Danh sách cảnh báo (trang %1/%2):\n\n%3",
                        warningsCleared: "✅ | Đã xóa cảnh báo cho người dùng %1",
                        noWarningsForUser: "⚠ | Người dùng này không có cảnh báo"
                },
                en: {
                        noData: "≡ | No spam-banned users",
                        listBanned: "≡ | Spam banned users (page %1/%2):\n\n%3",
                        unbanned: "✅ | Unbanned user %1 from spam ban",
                        notBanned: "⚠ | This user is not spam-banned",
                        invalidUserID: "⚠ | Please enter a valid userID",
                        info: "📊 | User Spam Detection Config:\n• Threshold: %1 commands in %2 seconds\n• Warnings before ban: %3\n• Ban duration: %4 hours\n• Total banned users: %5\n• Users with warnings: %6",
                        noWarnings: "≡ | No users with warnings",
                        listWarnings: "≡ | Warnings list (page %1/%2):\n\n%3",
                        warningsCleared: "✅ | Cleared warnings for user %1",
                        noWarningsForUser: "⚠ | This user has no warnings"
                }
        },

        onStart: async function ({ message, args, usersData, globalData, getLang }) {
                const spamConfig = global.GoatBot.config.userSpamProtection || {
                        commandThreshold: 2,
                        timeWindow: 5,
                        maxWarnings: 3,
                        banDuration: 24
                };

                const spamBannedUsers = await globalData.get("spamBannedUsers", "data", {});
                const userWarnings = await globalData.get("userSpamWarnings", "data", {});

                // Clean up expired bans
                const now = Date.now();
                let hasExpired = false;
                for (const userID in spamBannedUsers) {
                        if (spamBannedUsers[userID].expireTime <= now) {
                                delete spamBannedUsers[userID];
                                hasExpired = true;
                        }
                }
                if (hasExpired) {
                        await globalData.set("spamBannedUsers", spamBannedUsers, "data");
                }

                switch (args[0]) {
                        case "list":
                        case "-l": {
                                const userIDs = Object.keys(spamBannedUsers);
                                if (userIDs.length === 0) {
                                        return message.reply(getLang("noData"));
                                }

                                const limit = 10;
                                const page = parseInt(args[1]) || 1;
                                const start = (page - 1) * limit;
                                const end = page * limit;
                                const data = userIDs.slice(start, end);

                                let msg = "";
                                for (let i = 0; i < data.length; i++) {
                                        const userID = data[i];
                                        const banInfo = spamBannedUsers[userID];
                                        const expireTime = moment(banInfo.expireTime)
                                                .tz(global.GoatBot.config.timeZone || "Asia/Ho_Chi_Minh")
                                                .format("HH:mm:ss DD/MM/YYYY");
                                        const userName = banInfo.userName || "Unknown";
                                        msg += `${start + i + 1}. ${userName}\n   ID: ${userID}\n   Expires: ${expireTime}\n\n`;
                                }

                                return message.reply(getLang("listBanned", page, Math.ceil(userIDs.length / limit), msg));
                        }

                        case "unban":
                        case "-u": {
                                const userID = args[1];
                                if (!userID || isNaN(userID)) {
                                        return message.reply(getLang("invalidUserID"));
                                }

                                if (!spamBannedUsers[userID]) {
                                        return message.reply(getLang("notBanned"));
                                }

                                const userName = spamBannedUsers[userID].userName || userID;
                                delete spamBannedUsers[userID];
                                await globalData.set("spamBannedUsers", spamBannedUsers, "data");

                                // Also clear warnings
                                if (userWarnings[userID]) {
                                        delete userWarnings[userID];
                                        await globalData.set("userSpamWarnings", userWarnings, "data");
                                }

                                return message.reply(getLang("unbanned", userName));
                        }

                        case "warnings":
                        case "-w": {
                                const warningUserIDs = Object.keys(userWarnings);
                                if (warningUserIDs.length === 0) {
                                        return message.reply(getLang("noWarnings"));
                                }

                                const limit = 10;
                                const page = parseInt(args[1]) || 1;
                                const start = (page - 1) * limit;
                                const end = page * limit;
                                const data = warningUserIDs.slice(start, end);

                                let msg = "";
                                for (let i = 0; i < data.length; i++) {
                                        const userID = data[i];
                                        const warningInfo = userWarnings[userID];
                                        const userName = warningInfo.userName || "Unknown";
                                        msg += `${start + i + 1}. ${userName}\n   ID: ${userID}\n   Warnings: ${warningInfo.count}/${spamConfig.maxWarnings}\n\n`;
                                }

                                return message.reply(getLang("listWarnings", page, Math.ceil(warningUserIDs.length / limit), msg));
                        }

                        case "clearwarnings":
                        case "-cw": {
                                const userID = args[1];
                                if (!userID || isNaN(userID)) {
                                        return message.reply(getLang("invalidUserID"));
                                }

                                if (!userWarnings[userID]) {
                                        return message.reply(getLang("noWarningsForUser"));
                                }

                                const userName = userWarnings[userID].userName || userID;
                                delete userWarnings[userID];
                                await globalData.set("userSpamWarnings", userWarnings, "data");

                                return message.reply(getLang("warningsCleared", userName));
                        }

                        case "info":
                        case "-i": {
                                const bannedCount = Object.keys(spamBannedUsers).length;
                                const warningCount = Object.keys(userWarnings).length;
                                return message.reply(getLang("info",
                                        spamConfig.commandThreshold,
                                        spamConfig.timeWindow,
                                        spamConfig.maxWarnings,
                                        spamConfig.banDuration,
                                        bannedCount,
                                        warningCount
                                ));
                        }

                        default: {
                                return message.reply(
                                        "📋 | User Spam Ban Management\n\n" +
                                        "Usage:\n" +
                                        "• list - View banned users\n" +
                                        "• unban <userID> - Unban a user\n" +
                                        "• warnings - View users with warnings\n" +
                                        "• clearwarnings <userID> - Clear user warnings\n" +
                                        "• info - View spam detection config\n\n" +
                                        "Note: Users are auto-banned after 3 warnings for spamming commands."
                                );
                        }
                }
        }
};
