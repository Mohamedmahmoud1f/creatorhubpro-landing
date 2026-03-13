import { Hono } from 'hono'
import dotenv from 'dotenv'
dotenv.config();

export const analyzeApi = new Hono()

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

analyzeApi.post('/api/analyze', async (c) => {
  try {
    const body = await c.req.json()
    const platform = body.platform
    let username = body.username

    if (!username) {
      return c.json({ error: 'Username or URL is required' }, 400)
    }

    if (platform === 'youtube') {
      let parsed = username.trim()

      // Basic URL parsing
      if (parsed.includes('youtube.com/')) {
        const parts = parsed.split('/')
        if (parsed.includes('/channel/')) {
          parsed = parts[parts.indexOf('channel') + 1]
        } else if (parsed.includes('/c/')) {
          parsed = parts[parts.indexOf('c') + 1]
        } else if (parsed.includes('/user/')) {
          parsed = parts[parts.indexOf('user') + 1]
        } else {
          parsed = parts[parts.length - 1]
        }
      }
      if (parsed.includes('?')) {
        parsed = parsed.split('?')[0]
      }

      let apiUrl = ''

      // 1. channels.list (The Identity Check)
      if (parsed.startsWith('UC') && parsed.length === 24) {
        apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${parsed}&key=${YOUTUBE_API_KEY}`
      } else {
        const handle = parsed.startsWith('@') ? parsed : `@${parsed}`
        apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${handle}&key=${YOUTUBE_API_KEY}`
      }

      console.log('Fetching YouTube Channel:', apiUrl.replace(YOUTUBE_API_KEY!, 'API_KEY'))

      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.error) {
        return c.json({ error: data.error.message }, 400)
      }

      let channelData = null

      if (data.items && data.items.length > 0) {
        channelData = data.items[0]
      } else if (!parsed.startsWith('UC')) {
        // Fallback search
        const cleanName = parsed.replace('@', '')
        const fallbackUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forUsername=${cleanName}&key=${YOUTUBE_API_KEY}`
        const fallbackRes = await fetch(fallbackUrl)
        const fallbackData = await fallbackRes.json()
        if (fallbackData.items && fallbackData.items.length > 0) {
          channelData = fallbackData.items[0]
        }
      }

      if (!channelData) {
        return c.json({ error: 'YouTube channel not found. Please check the username or URL.' }, 404)
      }

      const stats = channelData.statistics || {}
      const snippet = channelData.snippet || {}
      const details = channelData.contentDetails || {}

      const subCount = parseInt(stats.subscriberCount || '0', 10)

      // Get the Uploads Playlist ID
      const uploadsPlaylistId = details.relatedPlaylists?.uploads

      let recentVideos: string[] = []
      let last30DaysCount = 0

      // 2. playlistItems.list (The Activity Check)
      if (uploadsPlaylistId) {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`
        const plRes = await fetch(playlistUrl)
        const plData = await plRes.json()

        if (plData.items && plData.items.length > 0) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          recentVideos = plData.items.map((item: any) => {
            const pubDate = new Date(item.snippet.publishedAt)
            if (pubDate >= thirtyDaysAgo) last30DaysCount++
            return item.snippet.resourceId.videoId
          }).filter((id: string) => id)
        }
      }

      let totalRecentViews = 0
      let totalRecentLikes = 0
      let totalRecentComments = 0
      let validEngagementVideos = 0

      // 3. videos.list (The Engagement Check)
      if (recentVideos.length > 0) {
        const videoIds = recentVideos.join(',')
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        const vRes = await fetch(videosUrl)
        const vData = await vRes.json()

        if (vData.items && vData.items.length > 0) {
          for (const v of vData.items) {
            const vStats = v.statistics || {}
            const views = parseInt(vStats.viewCount || '0', 10)
            const likes = parseInt(vStats.likeCount || '0', 10)
            const comments = parseInt(vStats.commentCount || '0', 10)

            if (views > 0) {
              totalRecentViews += views
              totalRecentLikes += likes
              totalRecentComments += comments
              validEngagementVideos++
            }
          }
        }
      }

      // Calculations based on User Rules
      // A. Engagement Rate
      let erRaw = 0
      if (validEngagementVideos > 0 && totalRecentViews > 0) {
        const avgViews = totalRecentViews / validEngagementVideos
        const avgLikes = totalRecentLikes / validEngagementVideos
        const avgComments = totalRecentComments / validEngagementVideos
        erRaw = ((avgLikes + avgComments) / avgViews) * 100
      } else {
        // Fallback if no recent data
        const channelViews = parseInt(stats.viewCount || '0', 10)
        const channelVideos = parseInt(stats.videoCount || '0', 10)
        const avgViewsAll = channelVideos > 0 ? channelViews / channelVideos : 0
        erRaw = subCount > 0 ? (avgViewsAll / subCount) * 10 : 0
      }

      // Expert Insight Flags
      let engagementInsightEn = ""
      let engagementInsightAr = ""
      if (erRaw > 4) {
        engagementInsightEn = "Your audience is highly active. Great hook potential!"
        engagementInsightAr = "جمهورك متفاعل جداً. فرصة ممتازة لزيادة تأثير فيديوهاتك!"
      } else if (erRaw < 1) {
        engagementInsightEn = "Your content isn't sparking conversation. We need to work on your CTAs."
        engagementInsightAr = "المحتوى لا يثير النقاشات بشكل كافٍ. نحتاج للعمل على نداءات اتخاذ الإجراء (CTAs)."
      } else {
        engagementInsightEn = "Average engagement. We can optimize your hooks to push this higher."
        engagementInsightAr = "تفاعل متوسط. يمكننا تحسين الثواني الأولى لزيادة التفاعل."
      }

      // B. Consistency Score (Videos in 30 days / 8) * 100
      let consistencyScore = Math.min(100, Math.round((last30DaysCount / 8) * 100))
      // Add minimum for old active channels so they dont look fully dead
      if (consistencyScore === 0 && parseInt(stats.videoCount || '0', 10) > 50) consistencyScore = 20

      // Calculate expert scores (0-100 scales)
      // ER scale: 5% is a "100" score
      let engagementScore = Math.min(100, Math.round((erRaw / 5.0) * 100))

      const strategyScore = Math.min(100, Math.round((consistencyScore + engagementScore) / 2))
      const overallScore = Math.round((consistencyScore + engagementScore + strategyScore) / 3) || 10

      let benchmark = 'Bottom 50%'
      if (overallScore >= 80) benchmark = 'Top 5%'
      else if (overallScore >= 60) benchmark = 'Top 25%'
      else if (overallScore >= 40) benchmark = 'Top 50%'

      return c.json({
        success: true,
        data: {
          platform: 'YouTube',
          username: snippet.title || parsed,
          avatar: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
          followers: subCount,
          engagementRate: erRaw,
          videos30Days: last30DaysCount,
          insights: {
            en: engagementInsightEn,
            ar: engagementInsightAr
          },
          scores: {
            overall: overallScore,
            consistency: consistencyScore,
            engagement: engagementScore,
            strategy: strategyScore
          },
          benchmark
        }
      })
    } else if (platform === 'tiktok' || platform === 'instagram') {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

      let cleanInput = username.trim();
      let cleanHandle = cleanInput.replace(/^@/, '');
      
      // Basic extraction if URL is passed
      if (cleanHandle.includes(`${platform}.com/`)) {
        const parts = cleanHandle.split(`${platform}.com/`);
        cleanHandle = parts[1].split('?')[0].split('/')[0].replace(/^@/, '');
      } else if (cleanHandle.startsWith('http')) {
        cleanHandle = cleanHandle.split('/').filter(Boolean).pop()?.split('?')[0].replace(/^@/, '') || cleanHandle;
      }

      const prompt = `
  Analyze the ${platform} account for: ${cleanHandle}.
  
  STEP 1: Use Google Search to find the latest stats from multiple sources. Search for:
  - "${cleanHandle} ${platform} followers count"
  - "${cleanHandle} ${platform} live sub count"
  - "${cleanHandle} ${platform} social blade" (This often has the most readable data for Gemini)
  - "${cleanHandle} ${platform} engagement rate"
  
  STEP 2: Extract the HIGHEST RECENT follower number you find in the search snippets. IF you cannot find any data confirming the account exists or its stats, DO NOT estimate. Set the numbers to 0 and indicate in the insights that data could not be verified. Do NOT guess the follower count, engagement rate, or videos.
  
  STEP 3: Return ONLY a raw JSON object. Use 0 if no data is found after searching 3+ sources.

  {
    "username": "${cleanHandle}",
    "followers": [Integer],
    "engagementRate": [Float],
    "videos30Days": [Integer],
    "insights": {
       "en": "Short 1-sentence analysis. If data not found, state that.",
       "ar": "ترجمة عربية للتحليل. إذا لم يتم العثور على بيانات، اذكر ذلك."
    },
    "scores": { "overall": 80, "consistency": 80, "engagement": 80, "strategy": 80 },
    "benchmark": "Top 1%"
  }
`;
      console.log("prompt is ", prompt);
      const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are a specialized social media data extraction bot. Your ONLY function is to use the Google Search tool to find live statistics about a specific creator, and then format those live statistics into the strict JSON schema provided. Never return text outside the JSON. NEVER ESTIMATE data. If you can't find it, return 0." }]
          },
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }]
        })
      });

      const gData = await gRes.json();
      console.log("\n=== GEMINI API RAW RESPONSE ===");
      console.log(JSON.stringify(gData, null, 2));
      console.log("===============================\n");

      if (gData.error) {
        return c.json({ error: gData.error.message }, 400);
      }

      try {
        const text = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('Gemini returned an empty or invalid response structure');
        }

        let cleanText = text.replace(/```json/ig, '').replace(/```/g, '').trim();
        // Sometimes Gemini still adds text like "Here is the JSON:" before the bracket
        const firstBracket = cleanText.indexOf('{');
        const lastBracket = cleanText.lastIndexOf('}');
        if (firstBracket !== -1 && lastBracket !== -1) {
          cleanText = cleanText.substring(firstBracket, lastBracket + 1);
        }

        const parsed = JSON.parse(cleanText);

        return c.json({
          success: true,
          data: {
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            avatar: '',
            ...parsed
          }
        });
      } catch (err) {
        console.error('Gemini Parsing Error:', err, JSON.stringify(gData));
        return c.json({ error: 'Failed to analyze account. Please try again.' }, 500);
      }
    } else {
      return c.json({ error: 'Platform not supported yet' }, 400)
    }
  } catch (err) {
    console.error('Analyzer error:', err)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

