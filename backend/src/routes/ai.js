import { Router } from 'express';
import { generateAIResponse, SYSTEM_PROMPTS } from '../services/openai.js';
import { scrapeWebsite, buildContextFromScrape } from '../services/scraper.js';

const router = Router();

async function aiOrFallback(systemPrompt, userPrompt, fallback) {
  try {
    const result = await generateAIResponse(systemPrompt, userPrompt);
    return result || fallback;
  } catch (error) {
    console.error('AI generation error:', error.message);
    return fallback;
  }
}

router.post('/business-brain', async (req, res) => {
  const { url, description, industry } = req.body;
  let context = description || '';

  if (url) {
    const scraped = await scrapeWebsite(url);
    context = buildContextFromScrape(scraped, description);
  }

  const fallback = {
    weaknesses: ['Limited social media presence', 'No email marketing funnel', 'Weak SEO optimization'],
    opportunities: ['TikTok viral marketing', 'Local SEO dominance', 'Influencer partnerships'],
    strategy: `Focus on short-form video content and build an email capture funnel for ${industry || 'your industry'}.`,
    sevenDayPlan: ['Audit social profiles', 'Launch content series', 'Set up email automation', 'Reach out to influencers', 'Analyze and optimize'],
    thirtyDayRoadmap: ['Week 1: Foundation', 'Week 2: Content engine', 'Week 3: Influencer outreach', 'Week 4: Scale winners'],
    recommendedPlatforms: ['Instagram', 'TikTok', 'LinkedIn'],
  };

  const result = await aiOrFallback(
    SYSTEM_PROMPTS.businessBrain,
    `Analyze this business:\nIndustry: ${industry}\n${context}`,
    fallback
  );
  res.json(result);
});

router.post('/campaign', async (req, res) => {
  const { input, type } = req.body;
  let context = input;

  if (type === 'url') {
    const scraped = await scrapeWebsite(input);
    context = buildContextFromScrape(scraped, input);
  }

  const fallback = {
    videoScript: `Marketing video script for: ${input}`,
    storyboard: ['Opening hook', 'Product demo', 'Social proof', 'CTA'],
    instagramPosts: Array.from({ length: 10 }, (_, i) => `Instagram post ${i + 1} for ${input}`),
    tiktokScripts: Array.from({ length: 5 }, (_, i) => `TikTok script ${i + 1} for ${input}`),
    linkedinPosts: [`LinkedIn post about ${input}`],
    emailCampaign: { subject: 'Your Marketing Campaign', body: `Campaign content for ${input}` },
    adCopy: { facebook: `Facebook ad for ${input}`, google: `Google ad for ${input}` },
    landingPageCopy: `Landing page copy for ${input}`,
    hashtags: ['#marketing', '#growth', '#business'],
    ctaMessages: ['Start Free Trial', 'Get Started Today'],
  };

  const result = await aiOrFallback(SYSTEM_PROMPTS.campaign, `Generate full campaign for:\n${context}`, fallback);
  res.json(result);
});

router.post('/viral-content', async (req, res) => {
  const { niche, platform, topic } = req.body;
  const fallback = {
    hooks: [`POV: You just discovered the secret in ${niche}...`, 'Stop scrolling if you want to grow...'],
    contentIdeas: ['Behind the scenes', 'Before vs After', 'Top 5 mistakes'],
    viralScore: 85,
    engagementRate: '7.8%',
    bestPostingTime: 'Tuesday & Thursday, 7-9 PM',
    optimizedHashtags: ['#viral', '#fyp', `#${niche}`],
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.viralContent, `Niche: ${niche}, Platform: ${platform}, Topic: ${topic}`, fallback);
  res.json(result);
});

router.post('/video', async (req, res) => {
  const { source, type, language, voice } = req.body;
  let context = source;
  if (type === 'url') {
    const scraped = await scrapeWebsite(source);
    context = buildContextFromScrape(scraped, source);
  }
  const fallback = {
    script: `Video script for ${source}`,
    storyboard: [{ scene: 1, description: 'Opening hook', duration: '3s' }, { scene: 2, description: 'Product showcase', duration: '8s' }],
    voiceover: `Voiceover script (${voice}, ${language})`,
    outputs: {
      youtube: { status: 'ready', duration: '60s', format: '16:9' },
      instagram: { status: 'ready', duration: '30s', format: '9:16' },
      tiktok: { status: 'ready', duration: '15s', format: '9:16' },
      linkedin: { status: 'ready', duration: '45s', format: '16:9' },
    },
    captions: { enabled: true, languages: ['English', 'Urdu', 'Arabic'] },
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.video, context, fallback);
  res.json(result);
});

router.post('/influencers', async (req, res) => {
  const { country, niche, minFollowers } = req.body;
  const fallback = {
    influencers: [
      { name: 'Sarah Chen', handle: '@sarahcreates', followers: '125K', engagement: '6.8%', niche: niche || 'Tech', country: country || 'US', fakeScore: 12, reachEstimate: '85K-110K', strategy: 'Product review series' },
      { name: 'Mike Rodriguez', handle: '@mikegrows', followers: '89K', engagement: '8.2%', niche: niche || 'Business', country: country || 'US', fakeScore: 8, reachEstimate: '72K-95K', strategy: 'Collaborative live session' },
    ],
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.influencers, `Country: ${country}, Niche: ${niche}, Min Followers: ${minFollowers}`, fallback);
  res.json(result);
});

router.post('/outreach', async (req, res) => {
  const { type, target, context } = req.body;
  const fallback = {
    initial: `Hi ${target || '{{name}}'}, I'd love to discuss a potential collaboration...`,
    followUps: ['Follow-up day 3', 'Follow-up day 7', 'Follow-up day 14'],
    sponsorship: 'Sponsorship proposal details...',
    tracking: { opens: 0, clicks: 0, replies: 0, status: 'draft' },
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.outreach, `Type: ${type}, Target: ${target}, Context: ${context}`, fallback);
  res.json(result);
});

router.post('/leads', async (req, res) => {
  const { industry, location, count = 5 } = req.body;
  const fallback = {
    leads: Array.from({ length: count }, (_, i) => ({
      company: `${industry} Company ${i + 1}`,
      website: `${industry}${i + 1}.com`,
      email: `contact@${industry}${i + 1}.com`,
      phone: `+1-555-010${i}`,
      industry,
      score: 70 + Math.floor(Math.random() * 25),
    })),
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.leads, `Industry: ${industry}, Location: ${location}, Count: ${count}`, fallback);
  res.json(result);
});

router.post('/seo', async (req, res) => {
  const { url } = req.body;
  let context = url;
  if (url) {
    const scraped = await scrapeWebsite(url);
    context = buildContextFromScrape(scraped, url);
  }
  const fallback = {
    score: 72,
    issues: ['Missing meta descriptions', 'Slow page load'],
    keywords: ['marketing', 'growth', 'automation'],
    metaTitle: 'Optimized Title',
    metaDescription: 'Optimized meta description',
    blogIdeas: ['Marketing trends 2026', 'Growth hacking guide'],
    rankingSuggestions: ['Add schema markup', 'Improve Core Web Vitals'],
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.seo, context, fallback);
  res.json(result);
});

router.post('/competitor', async (req, res) => {
  const { url } = req.body;
  let context = url;
  if (url) {
    const scraped = await scrapeWebsite(url);
    context = buildContextFromScrape(scraped, url);
  }
  const fallback = {
    swot: {
      strengths: ['Strong brand', 'Large following'],
      weaknesses: ['Limited video content', 'Poor mobile UX'],
      opportunities: ['Untapped TikTok market', 'No email funnel'],
      threats: ['New AI competitors', 'Rising ad costs'],
    },
    contentGaps: ['No short-form video', 'Missing educational content'],
    improvementPlan: ['Launch Reels series', 'Build email funnel'],
    growthOpportunities: ['First-mover on new platforms', 'AI personalization'],
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.competitor, context, fallback);
  res.json(result);
});

router.post('/autopilot', async (req, res) => {
  const { goal, budget, industry } = req.body;
  const fallback = {
    status: 'started',
    plan: ['Strategy created', 'Content generated', 'Influencers identified', 'Outreach sent', 'Campaigns scheduled'],
    estimatedResults: { leads: Math.floor(budget / 10), followers: Math.floor(budget / 2), revenue: budget * 3 },
  };
  const result = await aiOrFallback(SYSTEM_PROMPTS.autopilot, `Goal: ${goal}, Budget: $${budget}, Industry: ${industry}`, fallback);
  res.json(result);
});

router.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  const fallback = { translatedText: `[${targetLanguage}] ${text}`, sourceLanguage: 'auto', targetLanguage };
  const result = await aiOrFallback(SYSTEM_PROMPTS.translate, `Translate to ${targetLanguage}:\n${text}`, fallback);
  res.json(result);
});

export default router;
