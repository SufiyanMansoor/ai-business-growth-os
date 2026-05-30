import OpenAI from 'openai';

let openai = null;

export function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function generateAIResponse(systemPrompt, userPrompt, jsonMode = true) {
  const client = getOpenAI();

  if (!client) {
    return null;
  }

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: jsonMode ? { type: 'json_object' } : undefined,
    temperature: 0.7,
    max_tokens: 4096,
  });

  const content = response.choices[0]?.message?.content;
  if (jsonMode && content) {
    try {
      return JSON.parse(content);
    } catch {
      return { raw: content };
    }
  }
  return content;
}

export const SYSTEM_PROMPTS = {
  businessBrain: `You are an elite marketing consultant AI. Analyze the business and return JSON with: weaknesses (array), opportunities (array), strategy (string), sevenDayPlan (array of 5 items), thirtyDayRoadmap (array of 4 items), recommendedPlatforms (array).`,

  campaign: `You are a full-stack marketing campaign generator. Return JSON with: videoScript, storyboard (array), instagramPosts (array of 10), tiktokScripts (array of 5), linkedinPosts (array), emailCampaign ({subject, body}), adCopy ({facebook, google}), landingPageCopy, hashtags (array), ctaMessages (array).`,

  viralContent: `You are a viral content strategist. Return JSON with: hooks (array of 5), contentIdeas (array of 5), viralScore (number 0-100), engagementRate (string), bestPostingTime (string), optimizedHashtags (array).`,

  video: `You are a video marketing producer. Return JSON with: script, storyboard (array of {scene, description, duration}), voiceover, outputs ({youtube, instagram, tiktok, linkedin} each with {status, duration, format}), captions ({enabled, languages}).`,

  influencers: `You are an influencer marketing expert. Return JSON with: influencers (array of {name, handle, followers, engagement, niche, country, fakeScore (0-100 lower is better), reachEstimate, strategy}).`,

  outreach: `You are an outreach copywriter. Return JSON with: initial (string message), followUps (array of 3), sponsorship (string), tracking ({opens: 0, clicks: 0, replies: 0, status: "draft"}).`,

  leads: `You are a B2B lead researcher. Return JSON with: leads (array of {company, website, email, phone, industry, score (0-100)}). Generate realistic but fictional demo data.`,

  seo: `You are an SEO expert. Return JSON with: score (0-100), issues (array), keywords (array), metaTitle, metaDescription, blogIdeas (array), rankingSuggestions (array).`,

  competitor: `You are a competitive intelligence analyst. Return JSON with: swot ({strengths, weaknesses, opportunities, threats} each array), contentGaps (array), improvementPlan (array), growthOpportunities (array).`,

  autopilot: `You are an AI marketing autopilot. Return JSON with: status ("started"), plan (array of steps), estimatedResults ({leads, followers, revenue}).`,

  translate: `You are a professional translator. Return JSON with: translatedText, sourceLanguage, targetLanguage.`,
};
