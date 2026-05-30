import { buildVideoContent } from './videoContent';

type DemoBody = Record<string, unknown>;

const DEFAULT_VIDEO_OUTPUTS = {
  youtube: { status: 'ready', duration: '60s', format: '16:9' },
  instagram: { status: 'ready', duration: '30s', format: '9:16' },
  tiktok: { status: 'ready', duration: '15s', format: '9:16' },
  linkedin: { status: 'ready', duration: '45s', format: '16:9' },
};

export function getDemoResponse(endpoint: string, method: string, body: DemoBody = {}): unknown {
  const path = endpoint.split('?')[0];

  if (method === 'GET' && path === '/analytics/dashboard') {
    return {
      revenue: { total: 15800, change: 24.5 },
      campaigns: { active: 12, total: 28 },
      leads: { total: 520, change: 38 },
      engagement: { rate: 6.2, change: 1.4 },
      roi: { average: 351, best: 500 },
    };
  }

  if (method === 'GET' && path === '/crm/leads') {
    return {
      leads: [
        { id: '1', company: 'TechFlow Solutions', website: 'techflow.io', email: 'hello@techflow.io', phone: '+1-555-0101', industry: 'SaaS', stage: 'new', score: 92, notes: '', createdAt: new Date().toISOString() },
        { id: '2', company: 'GreenBite Restaurant', website: 'greenbite.com', email: 'info@greenbite.com', phone: '+1-555-0102', industry: 'Restaurant', stage: 'contacted', score: 78, notes: 'Follow up Monday', createdAt: new Date().toISOString() },
      ],
    };
  }

  if (method === 'GET' && path === '/campaigns') {
    return {
      campaigns: [
        { id: '1', name: 'Summer Sale 2026', platform: 'Instagram', status: 'active', budget: 2500, roi: 245, createdAt: '2026-05-01' },
        { id: '2', name: 'Product Launch', platform: 'TikTok', status: 'active', budget: 1800, roi: 180, createdAt: '2026-05-10' },
      ],
    };
  }

  if (method === 'POST' && path === '/reports/generate') {
    return {
      type: body.type || 'summary',
      generatedAt: new Date().toISOString(),
      data: { revenue: 15800, roi: 351, leads: 520, engagement: 6.2 },
    };
  }

  if (method === 'POST' && path === '/ai/business-brain') {
    const industry = String(body.industry || 'your industry');
    return {
      weaknesses: ['Limited social media presence', 'No email marketing funnel', 'Weak SEO optimization'],
      opportunities: ['TikTok viral marketing', 'Local SEO dominance', 'Influencer partnerships'],
      strategy: `Focus on short-form video content and build an email capture funnel for ${industry}.`,
      sevenDayPlan: ['Audit social profiles', 'Launch content series', 'Set up email automation', 'Reach out to influencers', 'Analyze and optimize'],
      thirtyDayRoadmap: ['Week 1: Foundation', 'Week 2: Content engine', 'Week 3: Influencer outreach', 'Week 4: Scale winners'],
      recommendedPlatforms: ['Instagram', 'TikTok', 'LinkedIn'],
    };
  }

  if (method === 'POST' && path === '/ai/campaign') {
    const input = String(body.input || 'your product');
    return {
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
  }

  if (method === 'POST' && path === '/ai/viral-content') {
    const niche = String(body.niche || 'marketing');
    return {
      hooks: [`POV: You just discovered the secret in ${niche}...`, 'Stop scrolling if you want to grow...'],
      contentIdeas: ['Behind the scenes', 'Before vs After', 'Top 5 mistakes'],
      viralScore: 85,
      engagementRate: '7.8%',
      bestPostingTime: 'Tuesday & Thursday, 7-9 PM',
      optimizedHashtags: ['#viral', '#fyp', `#${niche}`],
    };
  }

  if (method === 'POST' && path === '/ai/video') {
    const source = String(body.source || 'AI Business Growth OS');
    const sourceType = String(body.type || 'description');
    const language = String(body.language || 'english');
    const voice = String(body.voice || 'female');
    const content = buildVideoContent(source, sourceType, language, voice);
    return {
      ...content,
      outputs: DEFAULT_VIDEO_OUTPUTS,
      captions: { enabled: true, languages: ['English', 'Urdu', 'Arabic'] },
    };
  }

  if (method === 'POST' && path === '/ai/influencers') {
    const niche = String(body.niche || 'Tech');
    const country = String(body.country || 'US');
    return {
      influencers: [
        { name: 'Sarah Chen', handle: '@sarahcreates', followers: '125K', engagement: '6.8%', niche, country, fakeScore: 12, reachEstimate: '85K-110K', strategy: 'Product review series' },
        { name: 'Mike Rodriguez', handle: '@mikegrows', followers: '89K', engagement: '8.2%', niche, country, fakeScore: 8, reachEstimate: '72K-95K', strategy: 'Collaborative live session' },
      ],
    };
  }

  if (method === 'POST' && path === '/ai/outreach') {
    const target = String(body.target || '{{name}}');
    return {
      initial: `Hi ${target}, I'd love to discuss a potential collaboration...`,
      followUps: ['Follow-up day 3', 'Follow-up day 7', 'Follow-up day 14'],
      sponsorship: 'Sponsorship proposal details...',
      tracking: { opens: 0, clicks: 0, replies: 0, status: 'draft' },
    };
  }

  if (method === 'POST' && path === '/ai/leads') {
    const industry = String(body.industry || 'Tech');
    const count = Number(body.count) || 5;
    return {
      leads: Array.from({ length: count }, (_, i) => ({
        company: `${industry} Company ${i + 1}`,
        website: `${industry}${i + 1}.com`,
        email: `contact@${industry}${i + 1}.com`,
        phone: `+1-555-010${i}`,
        industry,
        score: 70 + Math.floor(Math.random() * 25),
      })),
    };
  }

  if (method === 'POST' && path === '/ai/seo') {
    return {
      score: 72,
      issues: ['Missing meta descriptions', 'Slow page load'],
      keywords: ['marketing', 'growth', 'automation'],
      metaTitle: 'Optimized Title',
      metaDescription: 'Optimized meta description',
      blogIdeas: ['Marketing trends 2026', 'Growth hacking guide'],
      rankingSuggestions: ['Add schema markup', 'Improve Core Web Vitals'],
    };
  }

  if (method === 'POST' && path === '/ai/competitor') {
    return {
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
  }

  if (method === 'POST' && path === '/ai/autopilot') {
    const budget = Number(body.budget) || 1000;
    const industry = String(body.industry || 'marketing');
    return {
      status: 'started',
      plan: ['Strategy created', 'Content generated', 'Influencers identified', 'Outreach sent', 'Campaigns scheduled'],
      estimatedResults: { leads: Math.floor(budget / 10), followers: Math.floor(budget / 2), revenue: budget * 3, industry },
    };
  }

  if (method === 'POST' && path === '/ai/translate') {
    const text = String(body.text || '');
    const targetLanguage = String(body.targetLanguage || 'Urdu');
    return { translatedText: `[${targetLanguage}] ${text}`, sourceLanguage: 'auto', targetLanguage };
  }

  return { message: 'Demo response', endpoint: path };
}

export function shouldUseClientDemo(): boolean {
  if (import.meta.env.VITE_STATIC_DEMO === 'true') return true;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.endsWith('.github.io')) return true;
  }
  return false;
}
