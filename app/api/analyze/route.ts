import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const platform = body.platform;
        let username = body.username;

        if (!username) {
            return NextResponse.json({ error: 'Username or URL is required' }, { status: 400 });
        }

        // --- YOUTUBE LOGIC ---
        if (platform === 'youtube') {
            let parsed = username.trim();

            // URL parsing
            if (parsed.includes('[youtube.com/](https://youtube.com/)')) {
                const parts = parsed.split('/');
                if (parsed.includes('/channel/')) {
                    parsed = parts[parts.indexOf('channel') + 1];
                } else if (parsed.includes('/c/')) {
                    parsed = parts[parts.indexOf('c') + 1];
                } else if (parsed.includes('/user/')) {
                    parsed = parts[parts.indexOf('user') + 1];
                } else {
                    parsed = parts[parts.length - 1];
                }
            }
            if (parsed.includes('?')) {
                parsed = parsed.split('?')[0];
            }

            let apiUrl = '';
            if (parsed.startsWith('UC') && parsed.length === 24) {
                apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${parsed}&key=${YOUTUBE_API_KEY}`;
            } else {
                const handle = parsed.startsWith('@') ? parsed : `@${parsed}`;
                apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle=${handle}&key=${YOUTUBE_API_KEY}`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.error) {
                return NextResponse.json({ error: data.error.message }, { status: 400 });
            }

            let channelData = data.items?.[0] || null;

            if (!channelData && !parsed.startsWith('UC')) {
                const cleanName = parsed.replace('@', '');
                const fallbackUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forUsername=${cleanName}&key=${YOUTUBE_API_KEY}`;
                const fallbackRes = await fetch(fallbackUrl);
                const fallbackData = await fallbackRes.json();
                channelData = fallbackData.items?.[0] || null;
            }

            if (!channelData) {
                return NextResponse.json({ error: 'YouTube channel not found.' }, { status: 404 });
            }

            const stats = channelData.statistics || {};
            const snippet = channelData.snippet || {};
            const details = channelData.contentDetails || {};
            const subCount = parseInt(stats.subscriberCount || '0', 10);
            const uploadsPlaylistId = details.relatedPlaylists?.uploads;

            let recentVideos: string[] = [];
            let last30DaysCount = 0;

            if (uploadsPlaylistId) {
                const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`;
                const plRes = await fetch(playlistUrl);
                const plData = await plRes.json();

                if (plData.items?.length > 0) {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    recentVideos = plData.items.map((item: any) => {
                        const pubDate = new Date(item.snippet.publishedAt);
                        if (pubDate >= thirtyDaysAgo) last30DaysCount++;
                        return item.snippet.resourceId.videoId;
                    }).filter(Boolean);
                }
            }

            let totalRecentViews = 0, totalRecentLikes = 0, totalRecentComments = 0, validEngagementVideos = 0;

            if (recentVideos.length > 0) {
                const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${recentVideos.join(',')}&key=${YOUTUBE_API_KEY}`;
                const vRes = await fetch(videosUrl);
                const vData = await vRes.json();

                vData.items?.forEach((v: any) => {
                    const vStats = v.statistics || {};
                    const views = parseInt(vStats.viewCount || '0', 10);
                    if (views > 0) {
                        totalRecentViews += views;
                        totalRecentLikes += parseInt(vStats.likeCount || '0', 10);
                        totalRecentComments += parseInt(vStats.commentCount || '0', 10);
                        validEngagementVideos++;
                    }
                });
            }

            let erRaw = (validEngagementVideos > 0 && totalRecentViews > 0)
                ? (((totalRecentLikes / validEngagementVideos) + (totalRecentComments / validEngagementVideos)) / (totalRecentViews / validEngagementVideos)) * 100
                : (subCount > 0 ? ((parseInt(stats.viewCount || '0') / parseInt(stats.videoCount || '1')) / subCount) * 10 : 0);

            const engagementInsightEn = erRaw > 4 ? "Your audience is highly active. Great hook potential!" : erRaw < 1 ? "Your content isn't sparking conversation. We need to work on your CTAs." : "Average engagement. We can optimize your hooks to push this higher.";
            const engagementInsightAr = erRaw > 4 ? "جمهورك متفاعل جداً. فرصة ممتازة لزيادة تأثير فيديوهاتك!" : erRaw < 1 ? "المحتوى لا يثير النقاشات بشكل كافٍ. نحتاج للعمل على نداءات اتخاذ الإجراء (CTAs)." : "تفاعل متوسط. يمكننا تحسين الثواني الأولى لزيادة التفاعل.";

            let consistencyScore = Math.min(100, Math.round((last30DaysCount / 8) * 100));
            if (consistencyScore === 0 && parseInt(stats.videoCount || '0') > 50) consistencyScore = 20;

            const engagementScore = Math.min(100, Math.round((erRaw / 5.0) * 100));
            const strategyScore = Math.min(100, Math.round((consistencyScore + engagementScore) / 2));
            const overallScore = Math.round((consistencyScore + engagementScore + strategyScore) / 3) || 10;

            let benchmark = overallScore >= 80 ? 'Top 5%' : overallScore >= 60 ? 'Top 25%' : overallScore >= 40 ? 'Top 50%' : 'Bottom 50%';

            return NextResponse.json({
                success: true,
                data: {
                    platform: 'YouTube',
                    username: snippet.title || parsed,
                    avatar: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
                    followers: subCount,
                    engagementRate: erRaw,
                    videos30Days: last30DaysCount,
                    insights: { en: engagementInsightEn, ar: engagementInsightAr },
                    scores: { overall: overallScore, consistency: consistencyScore, engagement: engagementScore, strategy: strategyScore },
                    benchmark
                }
            });

            // --- TIKTOK / INSTAGRAM LOGIC ---
        } else if (platform === 'tiktok' || platform === 'instagram') {
            let cleanHandle = username.trim().replace(/^@/, '');

            const prompt = `Search for and analyze the ${platform} account: ${cleanHandle}. Return strictly JSON format based on the most recent publicly available data.`;

            const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generationConfig: {
                        response_mime_type: "application/json"
                    },
                    systemInstruction: { 
                        parts: [{ 
                            text: `You are a social media analyzer. Use Google Search to find stats for the requested handle. 
                            Return strictly JSON with this schema: 
                            {"username": string, "followers": integer, "engagementRate": float, "videos30Days": integer, "insights": {"en": string, "ar": string}, "scores": {"overall": integer, "consistency": integer, "engagement": integer, "strategy": integer}, "benchmark": string}. 
                            Do not include any text outside the JSON object.` 
                        }] 
                    },
                    contents: [{ parts: [{ text: prompt }] }],
                    tools: [{ googleSearch: {} }]
                })
            });

            const gData = await gRes.json();
            if (gData.error) return NextResponse.json({ error: gData.error.message }, { status: 400 });

            try {
                const textResponse = gData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
                const parsedResult = JSON.parse(textResponse);

                return NextResponse.json({
                    success: true,
                    data: { 
                        platform: platform.charAt(0).toUpperCase() + platform.slice(1), 
                        avatar: '', 
                        ...parsedResult 
                    }
                });
            } catch (parseError) {
                console.error('Gemini JSON Parse Error:', parseError);
                return NextResponse.json({ error: 'Failed to parse account data.' }, { status: 500 });
            }
        }

        return NextResponse.json({ error: 'Platform not supported' }, { status: 400 });
    } catch (err) {
        console.error('Analyzer error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}