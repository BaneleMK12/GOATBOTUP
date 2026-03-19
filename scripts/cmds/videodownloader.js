const axios = require('axios');

module.exports = {
  config: {
    name: "autodownload",
    version: "2.0",
    author: "CharlesMK",
    role: 0,
    description: "Auto-download videos from Facebook, TikTok, and YouTube"
  },

  onStart: async function() {
    // This command runs in the background via onChat
  },

  onChat: async function ({ message, event, api }) {
    const { body, messageID } = event;

    if (!body) return;

    // Detect URLs
    const fbRegex = /(https?:\/\/)?(www\.|m\.|web\.)?(facebook\.com|fb\.watch|fb\.com)\/[\w\-\.\/\?\=\&]+/gi;
    const tiktokRegex = /(https?:\/\/)?(www\.|vm\.|vt\.)?(tiktok\.com)\/[\w\-\.\/\?\=\&\@]+/gi;
    const youtubeRegex = /(https?:\/\/)?(www\.|m\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w\-]+/gi;

    const fbMatch = body.match(fbRegex);
    const tiktokMatch = body.match(tiktokRegex);
    const youtubeMatch = body.match(youtubeRegex);

    if (!fbMatch && !tiktokMatch && !youtubeMatch) return;

    // React with downloading emoji
    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);
    } catch (e) {
      console.log("Reaction failed");
    }

    try {
      let videoStream = null;
      let platform = "";

      // ==================== FACEBOOK ====================
      if (fbMatch) {
        platform = "Facebook";
        const url = fbMatch[0];
        
        // API 1: NenlabsAPI
        try {
          const response = await axios.post('https://nenlabs-api.onrender.com/api/facebook', {
            url: url
          }, {
            timeout: 40000,
            headers: { 'Content-Type': 'application/json' }
          });

          if (response.data?.data?.video_sd || response.data?.data?.video_hd) {
            const videoUrl = response.data.data.video_hd || response.data.data.video_sd;
            const videoResponse = await axios.get(videoUrl, {
              responseType: 'stream',
              timeout: 60000,
              headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            videoStream = videoResponse.data;
          }
        } catch (e) {
          console.log("FB API 1 failed:", e.message);
        }

        // API 2: FBDownloader
        if (!videoStream) {
          try {
            const response = await axios.post('https://www.getfvid.com/downloader', 
              `url=${encodeURIComponent(url)}`,
              {
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'User-Agent': 'Mozilla/5.0'
                },
                timeout: 40000
              }
            );

            const hdMatch = response.data.match(/href="([^"]+)"[^>]*>\s*Download in HD Quality/);
            const sdMatch = response.data.match(/href="([^"]+)"[^>]*>\s*Download in Normal Quality/);
            
            const videoUrl = hdMatch?.[1] || sdMatch?.[1];
            
            if (videoUrl) {
              const videoResponse = await axios.get(videoUrl, {
                responseType: 'stream',
                timeout: 60000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
              });
              videoStream = videoResponse.data;
            }
          } catch (e) {
            console.log("FB API 2 failed:", e.message);
          }
        }

        // API 3: SnapSave
        if (!videoStream) {
          try {
            const response = await axios.post('https://snapsave.app/action.php', 
              `url=${encodeURIComponent(url)}`,
              {
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 40000
              }
            );

            const match = response.data.match(/"url":"([^"]+)"/);
            if (match) {
              const videoUrl = match[1].replace(/\\/g, '');
              const videoResponse = await axios.get(videoUrl, {
                responseType: 'stream',
                timeout: 60000
              });
              videoStream = videoResponse.data;
            }
          } catch (e) {
            console.log("FB API 3 failed:", e.message);
          }
        }
      }

      // ==================== TIKTOK ====================
      if (tiktokMatch && !videoStream) {
        platform = "TikTok";
        const url = tiktokMatch[0];

        // API 1: TiklyDown
        try {
          const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, {
            timeout: 40000
          });

          const videoUrl = response.data?.video?.noWatermark || response.data?.video?.watermark;
          
          if (videoUrl) {
            const videoResponse = await axios.get(videoUrl, {
              responseType: 'stream',
              timeout: 60000,
              headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            videoStream = videoResponse.data;
          }
        } catch (e) {
          console.log("TikTok API 1 failed:", e.message);
        }

        // API 2: SnapTik
        if (!videoStream) {
          try {
            const response = await axios.post('https://snaptik.app/abc2.php',
              `url=${encodeURIComponent(url)}&hd=1`,
              {
                headers: { 
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'User-Agent': 'Mozilla/5.0'
                },
                timeout: 40000
              }
            );

            const match = response.data.match(/"url":"([^"]+)"/);
            if (match) {
              const videoUrl = match[1].replace(/\\/g, '');
              const videoResponse = await axios.get(videoUrl, {
                responseType: 'stream',
                timeout: 60000
              });
              videoStream = videoResponse.data;
            }
          } catch (e) {
            console.log("TikTok API 2 failed:", e.message);
          }
        }

        // API 3: TikMate
        if (!videoStream) {
          try {
            const response = await axios.post('https://tikmate.app/download',
              { url: url },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 40000
              }
            );

            const videoUrl = response.data?.data?.hdplay || response.data?.data?.play;
            
            if (videoUrl) {
              const videoResponse = await axios.get(videoUrl, {
                responseType: 'stream',
                timeout: 60000
              });
              videoStream = videoResponse.data;
            }
          } catch (e) {
            console.log("TikTok API 3 failed:", e.message);
          }
        }
      }

      // ==================== YOUTUBE ====================
      if (youtubeMatch && !videoStream) {
        platform = "YouTube";
        const url = youtubeMatch[0];

        // API 1: Y2Mate
        try {
          const response = await axios.post('https://www.y2mate.com/mates/analyzeV2/ajax',
            `url=${encodeURIComponent(url)}&q_auto=0&ajax=1`,
            {
              headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0'
              },
              timeout: 40000
            }
          );

          if (response.data?.links?.mp4) {
            const qualities = response.data.links.mp4;
            const quality = qualities['360'] || qualities['480'] || qualities['720'] || Object.values(qualities)[0];
            
            if (quality?.k) {
              const convertResponse = await axios.post('https://www.y2mate.com/mates/convertV2/index',
                `vid=${response.data.vid}&k=${quality.k}`,
                {
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  timeout: 40000
                }
              );

              const match = convertResponse.data?.dlink;
              if (match) {
                const videoResponse = await axios.get(match, {
                  responseType: 'stream',
                  timeout: 60000
                });
                videoStream = videoResponse.data;
              }
            }
          }
        } catch (e) {
          console.log("YouTube API 1 failed:", e.message);
        }

        // API 2: SaveFrom
        if (!videoStream) {
          try {
            const response = await axios.post('https://api.savefrom.net/download',
              { url: url },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 40000
              }
            );

            const videoUrl = response.data?.data?.[0]?.url;
            
            if (videoUrl) {
              const videoResponse = await axios.get(videoUrl, {
                responseType: 'stream',
                timeout: 60000
              });
              videoStream = videoResponse.data;
            }
          } catch (e) {
            console.log("YouTube API 2 failed:", e.message);
          }
        }
      }

      if (!videoStream) {
        throw new Error("All download attempts failed");
      }

      // Send the video
      await message.reply({
        attachment: videoStream
      });

      // React with success
      try {
        api.setMessageReaction("✅", messageID, () => {}, true);
      } catch (e) {
        console.log("Success reaction failed");
      }

    } catch (error) {
      console.error("Download error:", error.message);
      
      // React with failure
      try {
        api.setMessageReaction("❌", messageID, () => {}, true);
      } catch (e) {
        console.log("Error reaction failed");
      }
    }
  }
};
