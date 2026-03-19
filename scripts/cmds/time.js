module.exports = {
  config: {
    name: "time",
    aliases: ["timezone", "clock"],
    version: "1.0",
    author: "CharlesMK",
    countDown: 3,
    role: 0,
    description: {
      en: "Get the current time for any country"
    },
    category: "utility",
    guide: {
      en: "{pn} <country name>\nExample: {pn} South Africa\n{pn} Japan\n{pn} United States"
    }
  },

  onStart: async function ({ args, message }) {
    if (args.length === 0) {
      return message.reply("❌ Please provide a country name.\nExample: +time South Africa");
    }

    const country = args.join(" ");

    // Map countries to their primary timezones
    const countryTimezones = {
      // Africa
      "south africa": "Africa/Johannesburg",
      "nigeria": "Africa/Lagos",
      "egypt": "Africa/Cairo",
      "kenya": "Africa/Nairobi",
      "morocco": "Africa/Casablanca",
      "ethiopia": "Africa/Addis_Ababa",
      "ghana": "Africa/Accra",
      "tanzania": "Africa/Dar_es_Salaam",
      "uganda": "Africa/Kampala",
      "algeria": "Africa/Algiers",
      
      // Asia
      "japan": "Asia/Tokyo",
      "china": "Asia/Shanghai",
      "india": "Asia/Kolkata",
      "south korea": "Asia/Seoul",
      "thailand": "Asia/Bangkok",
      "vietnam": "Asia/Ho_Chi_Minh",
      "philippines": "Asia/Manila",
      "indonesia": "Asia/Jakarta",
      "singapore": "Asia/Singapore",
      "malaysia": "Asia/Kuala_Lumpur",
      "pakistan": "Asia/Karachi",
      "bangladesh": "Asia/Dhaka",
      "saudi arabia": "Asia/Riyadh",
      "uae": "Asia/Dubai",
      "united arab emirates": "Asia/Dubai",
      "israel": "Asia/Jerusalem",
      "turkey": "Europe/Istanbul",
      
      // Europe
      "united kingdom": "Europe/London",
      "uk": "Europe/London",
      "france": "Europe/Paris",
      "germany": "Europe/Berlin",
      "italy": "Europe/Rome",
      "spain": "Europe/Madrid",
      "netherlands": "Europe/Amsterdam",
      "belgium": "Europe/Brussels",
      "sweden": "Europe/Stockholm",
      "norway": "Europe/Oslo",
      "denmark": "Europe/Copenhagen",
      "finland": "Europe/Helsinki",
      "poland": "Europe/Warsaw",
      "greece": "Europe/Athens",
      "portugal": "Europe/Lisbon",
      "russia": "Europe/Moscow",
      "ukraine": "Europe/Kiev",
      "switzerland": "Europe/Zurich",
      "austria": "Europe/Vienna",
      
      // Americas
      "united states": "America/New_York",
      "usa": "America/New_York",
      "us": "America/New_York",
      "canada": "America/Toronto",
      "mexico": "America/Mexico_City",
      "brazil": "America/Sao_Paulo",
      "argentina": "America/Argentina/Buenos_Aires",
      "chile": "America/Santiago",
      "colombia": "America/Bogota",
      "peru": "America/Lima",
      "venezuela": "America/Caracas",
      "cuba": "America/Havana",
      "jamaica": "America/Jamaica",
      
      // Oceania
      "australia": "Australia/Sydney",
      "new zealand": "Pacific/Auckland",
      "fiji": "Pacific/Fiji"
    };

    const timezone = countryTimezones[country.toLowerCase()];

    if (!timezone) {
      return message.reply(
        `❌ Country "${country}" not found in database.\n\n💡 Try these formats:\n- +time South Africa\n- +time Japan\n- +time United States`
      );
    }

    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      const dateString = now.toLocaleDateString("en-US", {
        timeZone: timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      const response = `🕐 ${country.toUpperCase()}\n\n` +
                      `📅 ${dateString}\n` +
                      `⏰ ${timeString}\n` +
                      `🌍 Timezone: ${timezone}`;

      return message.reply(response);

    } catch (error) {
      return message.reply("❌ Error getting time information. Please try again.");
    }
  }
};
