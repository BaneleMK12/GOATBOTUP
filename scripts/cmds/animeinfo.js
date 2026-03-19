const axios = require("axios");

module.exports = {
    config: {
        name: "animeinfo",
        version: "1.0.0",
        author: "Charles MK",
        countDown: 5,
        role: 0,
        description: "Search for anime details and synopsis",
        category: "info",
        guide: "{pn} [anime name]"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const query = args.join(" ");

        if (!query) {
            return api.sendMessage("⚠️ Please provide an anime name (e.g., +animeinfo Naruto)", threadID, messageID);
        }

        api.sendMessage(`🔍 Searching for "${query}"...`, threadID, messageID);

        try {
            // Fetch data from Jikan API (MyAnimeList)
            const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
            
            if (!res.data || res.data.data.length === 0) {
                return api.sendMessage("❌ No anime found with that name.", threadID, messageID);
            }

            const anime = res.data.data[0];
            
            // Format the details
            const title = anime.title;
            const jpTitle = anime.title_japanese || "N/A";
            const type = anime.type || "N/A";
            const episodes = anime.episodes || "Ongoing";
            const status = anime.status || "N/A";
            const score = anime.score || "N/A";
            const rating = anime.rating || "N/A";
            const genres = anime.genres.map(g => g.name).join(", ") || "N/A";
            const synopsis = anime.synopsis 
                ? (anime.synopsis.length > 500 ? anime.synopsis.substring(0, 500) + "..." : anime.synopsis) 
                : "No synopsis available.";

            const msg = `⛩️ 𝗔𝗡𝗜𝗠𝗘 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 ⛩️\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `🌸 𝗧𝗶𝘁𝗹𝗲: ${title}\n` +
                `🏮 𝗝𝗮𝗽𝗮𝗻𝗲𝘀𝗲: ${jpTitle}\n` +
                `⭐ 𝗦𝗰𝗼𝗿𝗲: ${score}\n` +
                `📺 𝗧𝘆𝗽𝗲: ${type}\n` +
                `🎞️ 𝗘𝗽𝗶𝘀𝗼𝗱𝗲𝘀: ${episodes}\n` +
                `⏳ 𝗦𝘁𝗮𝘁𝘂𝘀: ${status}\n` +
                `🔞 𝗥𝗮𝘁𝗶𝗻𝗴: ${rating}\n` +
                `🎭 𝗚𝗲𝗻𝗿𝗲𝘀: ${genres}\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `📝 𝗦𝘆𝗻𝗼𝗽𝘀𝗶𝘀:\n${synopsis}\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `🔗 URL: ${anime.url}`;

            // Send with poster image
            return api.sendMessage({
                body: msg,
                attachment: await global.utils.getStreamFromURL(anime.images.jpg.large_image_url)
            }, threadID, messageID);

        } catch (error) {
            console.error(error);
            return api.sendMessage("⚠️ Error: Unable to fetch anime data. The API might be busy.", threadID, messageID);
        }
    }
};
