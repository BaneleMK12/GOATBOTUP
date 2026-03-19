const axios = require('axios');

module.exports = {
  config: {
    name: "weather",
    aliases: ["w", "forecast"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 5,
    role: 0,
    description: {
      en: "Get current weather for any city"
    },
    category: "utility",
    guide: {
      en: "{pn} <city name>\nExample: {pn} Durban\n{pn} New York\n{pn} Tokyo"
    }
  },

  onStart: async function ({ args, message }) {
    if (args.length === 0) {
      return message.reply("❌ Please provide a city name.\nExample: +weather Durban");
    }

    const city = args.join(" ");

    try {
      // Using wttr.in API (free, no API key needed)
      const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
        timeout: 10000
      });

      const data = response.data;
      const current = data.current_condition[0];
      const location = data.nearest_area[0];

      const cityName = location.areaName[0].value;
      const country = location.country[0].value;
      const temp = current.temp_C;
      const feelsLike = current.FeelsLikeC;
      const condition = current.weatherDesc[0].value;
      const humidity = current.humidity;
      const windSpeed = current.windspeedKmph;
      const windDir = current.winddir16Point;
      const pressure = current.pressure;
      const visibility = current.visibility;
      const uvIndex = current.uvIndex;

      // Weather emoji based on condition
      let weatherEmoji = "🌤️";
      const condLower = condition.toLowerCase();
      if (condLower.includes("clear") || condLower.includes("sunny")) weatherEmoji = "☀️";
      else if (condLower.includes("cloud")) weatherEmoji = "☁️";
      else if (condLower.includes("rain") || condLower.includes("drizzle")) weatherEmoji = "🌧️";
      else if (condLower.includes("storm") || condLower.includes("thunder")) weatherEmoji = "⛈️";
      else if (condLower.includes("snow")) weatherEmoji = "❄️";
      else if (condLower.includes("fog") || condLower.includes("mist")) weatherEmoji = "🌫️";

      let responseMsg = `${weatherEmoji} 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗥𝗘𝗣𝗢𝗥𝗧\n`;
      responseMsg += "━━━━━━━━━━━━━━━━━━━━\n\n";
      responseMsg += `📍 ${cityName}, ${country}\n\n`;
      responseMsg += `🌡️ Temperature: ${temp}°C\n`;
      responseMsg += `🤔 Feels Like: ${feelsLike}°C\n`;
      responseMsg += `☁️ Condition: ${condition}\n`;
      responseMsg += `💧 Humidity: ${humidity}%\n`;
      responseMsg += `💨 Wind: ${windSpeed} km/h ${windDir}\n`;
      responseMsg += `🔽 Pressure: ${pressure} mb\n`;
      responseMsg += `👁️ Visibility: ${visibility} km\n`;
      responseMsg += `☀️ UV Index: ${uvIndex}\n`;

      return message.reply(responseMsg);

    } catch (error) {
      console.error("Weather error:", error);

      if (error.response?.status === 404) {
        return message.reply(`❌ City "${city}" not found.\n\nPlease check the spelling and try again.`);
      }

      return message.reply(
        `❌ Unable to fetch weather data.\n\n` +
        `This could be due to:\n` +
        `- Invalid city name\n` +
        `- API temporarily unavailable\n` +
        `- Network issues\n\n` +
        `Please try again later.`
      );
    }
			   }
