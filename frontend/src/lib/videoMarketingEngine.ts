export interface BusinessSummary {
  companyName: string;
  industry: string;
  mainServices: string[];
  targetAudience: string;
}

export interface MarketingScene {
  scene: number;
  duration: string;
  visual: string;
  voiceover: string;
  onScreenText: string;
  caption: string;
  imagePrompt: string;
  videoPrompt: string;
  headline?: string;
  bullets?: string[];
  description: string;
  visualTheme?: 'hook' | 'features' | 'benefits' | 'cta' | 'problem' | 'solution';
}

export interface VideoMarketingPackage {
  businessSummary: BusinessSummary;
  videoConcept: string;
  hook: string;
  script: string;
  voiceover: string;
  scenes: MarketingScene[];
  storyboard: MarketingScene[];
  backgroundMusic: string;
  cta: string;
  socialMedia: {
    linkedin: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  hashtags: string[];
}

interface BusinessProfile {
  companyName: string;
  industry: string;
  mainServices: string[];
  targetAudience: string;
  tagline: string;
  hook: string;
  painPoints: string[];
  solutions: string[];
  benefits: string[];
  cta: string;
  website: string;
  region: string;
}

function titleCase(text: string): string {
  return text.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

function extractLinkedInName(source: string): string {
  const company = source.match(/linkedin\.com\/company\/([^/?#]+)/i);
  if (company) return titleCase(decodeURIComponent(company[1]));
  const profile = source.match(/linkedin\.com\/in\/([^/?#]+)/i);
  if (profile) return titleCase(decodeURIComponent(profile[1].replace(/-/g, ' ')));
  return 'Your Business';
}

function extractDomainName(source: string): string {
  try {
    const url = new URL(source.startsWith('http') ? source : `https://${source}`);
    return titleCase(url.hostname.replace(/^www\./, '').split('.')[0]);
  } catch {
    return titleCase(source.slice(0, 40));
  }
}

function detectIndustry(text: string): string {
  const s = text.toLowerCase();
  if (/saas|software|platform|app|ai\b|automation|cloud/.test(s)) return 'AI & SaaS Technology';
  if (/marketing|agency|advertis|brand|social media/.test(s)) return 'Digital Marketing';
  if (/consult|advisory|strategy|coaching/.test(s)) return 'Business Consulting';
  if (/finance|accounting|fintech|bank/.test(s)) return 'Financial Services';
  if (/health|clinic|medical|wellness|pharma/.test(s)) return 'Healthcare & Wellness';
  if (/real estate|property|construction|architect/.test(s)) return 'Real Estate & Property';
  if (/restaurant|food|hospitality|catering/.test(s)) return 'Hospitality & Food';
  if (/education|training|learning|course/.test(s)) return 'Education & Training';
  if (/ecommerce|retail|shop|store/.test(s)) return 'E-Commerce & Retail';
  if (/legal|law firm|solicitor/.test(s)) return 'Legal Services';
  if (/logistics|supply chain|shipping/.test(s)) return 'Logistics & Supply Chain';
  return 'Professional Business Services';
}

function detectRegion(text: string): string {
  const s = text.toLowerCase();
  if (/\.uk\b|london|manchester|birmingham|united kingdom|british/.test(s)) return 'UK';
  if (/\.ae\b|dubai|abu dhabi|uae|emirates|sharjah/.test(s)) return 'UAE';
  if (/\.pk\b|pakistan|karachi|lahore/.test(s)) return 'Pakistan';
  if (/\.in\b|india|mumbai|delhi/.test(s)) return 'India';
  return 'International (UK, UAE & Global)';
}

function isGrowthOsSource(source: string): boolean {
  const s = source.toLowerCase();
  return (
    s.includes('ai-business-growth') ||
    s.includes('ai marketing') ||
    s.includes('marketing software') ||
    s.includes('business growth os') ||
    s.includes('sufiyanmansoor.github.io')
  );
}

function buildGrowthOsProfile(source: string): BusinessProfile {
  return {
    companyName: 'AI Business Growth OS',
    industry: 'AI & SaaS Technology',
    mainServices: [
      'AI Video Marketing Creator',
      'One-Click Multi-Platform Campaigns',
      'Influencer Discovery & Auto Outreach',
      'CRM Pipeline & Lead Generation',
      'SEO Engine & ROI Analytics',
    ],
    targetAudience: 'SMEs, startups, agencies & founders in UK, UAE & globally who want AI-powered marketing without hiring an agency',
    tagline: 'AI Influencer & Marketing Studio — Your Complete Growth Operating System',
    hook: 'Still running marketing manually in 2026? What if AI could handle your entire growth strategy — while you focus on closing deals?',
    painPoints: [
      'Marketing agencies cost £3,000–£10,000/month',
      'Creating videos, posts & campaigns takes weeks',
      'No unified system for leads, content & analytics',
    ],
    solutions: [
      'AI generates videos, scripts & social posts in minutes',
      'One platform for CRM, campaigns, SEO & influencers',
      'Demo-ready — start free, scale when ready',
    ],
    benefits: [
      '10x faster campaign launch vs traditional agencies',
      'Works for UK, UAE & international markets',
      'Multi-language: English, Urdu, Arabic, Hindi',
    ],
    cta: 'Start Your Free Demo Today → sufiyanmansoor.github.io/ai-business-growth-os',
    website: source.includes('http') ? source.replace(/^https?:\/\//, '').slice(0, 55) : 'sufiyanmansoor.github.io/ai-business-growth-os',
    region: 'International (UK, UAE & Global)',
  };
}

function buildProfileFromSource(source: string, sourceType: string): BusinessProfile {
  const trimmed = source.trim();
  if (!trimmed) return buildGrowthOsProfile('AI Business Growth OS');
  if (isGrowthOsSource(trimmed)) return buildGrowthOsProfile(trimmed);

  let companyName: string;
  let website: string;

  if (sourceType === 'linkedin' || trimmed.includes('linkedin.com')) {
    companyName = extractLinkedInName(trimmed);
    website = trimmed.replace(/^https?:\/\//, '').slice(0, 55);
  } else if (sourceType === 'url' || (trimmed.includes('.') && !trimmed.includes(' '))) {
    companyName = extractDomainName(trimmed);
    website = trimmed.replace(/^https?:\/\//, '').slice(0, 55);
  } else {
    companyName = trimmed.length > 50 ? `${trimmed.slice(0, 47)}...` : trimmed;
    website = companyName.slice(0, 45);
  }

  const industry = detectIndustry(trimmed);
  const region = detectRegion(trimmed);

  const industryServices: Record<string, string[]> = {
    'AI & SaaS Technology': ['AI-powered automation', 'Cloud SaaS platform', 'Analytics dashboard', 'API integrations', 'Enterprise onboarding'],
    'Digital Marketing': ['Social media management', 'Paid ad campaigns', 'Content strategy', 'Brand positioning', 'Performance analytics'],
    'Business Consulting': ['Strategy consulting', 'Growth advisory', 'Process optimisation', 'Market entry support', 'Executive coaching'],
    'Financial Services': ['Wealth management', 'Tax advisory', 'Financial planning', 'Compliance support', 'Investment guidance'],
    'Healthcare & Wellness': ['Patient care solutions', 'Telehealth services', 'Wellness programmes', 'Clinical support', 'Health analytics'],
    'Real Estate & Property': ['Property sales & lettings', 'Investment advisory', 'Market analysis', 'Portfolio management', 'Off-plan projects'],
    'Hospitality & Food': ['Fine dining experience', 'Catering services', 'Event hospitality', 'Menu innovation', 'Customer loyalty programmes'],
    'Education & Training': ['Online courses', 'Corporate training', 'Certification programmes', 'Skills development', 'Learning analytics'],
    'E-Commerce & Retail': ['Online storefront', 'Product curation', 'Fast delivery', 'Customer support', 'Loyalty rewards'],
    'Legal Services': ['Corporate law', 'Contract advisory', 'Compliance & regulation', 'Dispute resolution', 'International legal support'],
    'Logistics & Supply Chain': ['Freight forwarding', 'Warehouse management', 'Last-mile delivery', 'Supply chain optimisation', 'Customs clearance'],
    'Professional Business Services': ['Business solutions', 'Client advisory', 'Project delivery', 'Quality assurance', 'Growth support'],
  };

  const services = industryServices[industry] || industryServices['Professional Business Services'];

  return {
    companyName,
    industry,
    mainServices: services.map((s) => `${companyName}: ${s}`),
    targetAudience: `Business owners, decision-makers & growth-focused teams in ${region} seeking reliable ${industry.toLowerCase()} partners`,
    tagline: `${companyName} — Trusted ${industry} Partner for ${region} Clients`,
    hook: `What if ${companyName} could solve your biggest ${industry.toLowerCase()} challenge — in half the time and cost?`,
    painPoints: [
      `Most ${industry.toLowerCase()} providers overpromise and underdeliver`,
      'Clients waste budget on outdated approaches',
      'Growth stalls without a clear, measurable strategy',
    ],
    solutions: services.slice(0, 3).map((s) => s.replace(`${companyName}: `, '')),
    benefits: [
      `Proven results for ${region} clients`,
      'Transparent pricing — no hidden fees',
      'Dedicated support from day one',
    ],
    cta: `Book a Free Consultation → ${website}`,
    website,
    region,
  };
}

function buildScenes(profile: BusinessProfile): MarketingScene[] {
  const { companyName, industry, hook, painPoints, solutions, benefits, cta, tagline } = profile;

  const raw: Omit<MarketingScene, 'scene'>[] = [
    {
      duration: '10s',
      visual: `Cinematic slow-motion: frustrated business owner at desk, papers scattered, clock ticking. Modern ${industry.toLowerCase()} office. Cool blue tones transitioning to warm light.`,
      voiceover: hook,
      onScreenText: hook.length > 80 ? `${hook.slice(0, 77)}...` : hook,
      caption: `😤 Tired of outdated ${industry.toLowerCase()}? There's a better way. 👇`,
      imagePrompt: `Cinematic photo, frustrated business professional in modern office, ${industry} context, dramatic lighting, shallow depth of field, 4K, corporate documentary style, UK/UAE international aesthetic`,
      videoPrompt: `Cinematic 10-second video: slow dolly-in on stressed business owner at desk, papers flying, clock ticking fast, cool blue grade, professional ${industry} office environment, 24fps film look`,
      headline: hook,
      description: hook,
      visualTheme: 'hook',
    },
    {
      duration: '10s',
      visual: `${companyName} logo reveal with sleek motion graphics. Professional team collaborating. Modern SaaS dashboard or ${industry} workspace. Clean, premium brand aesthetic.`,
      voiceover: `Meet ${companyName} — ${tagline}. We help ambitious businesses across the UK, UAE and worldwide achieve measurable growth.`,
      onScreenText: `${companyName}\n${tagline}`,
      caption: `Introducing ${companyName} ✨ — built for modern businesses.`,
      imagePrompt: `Professional brand hero shot, ${companyName} style modern office, diverse team collaborating, premium ${industry} aesthetic, clean minimal design, golden hour lighting, 4K commercial photography`,
      videoPrompt: `Smooth logo animation reveal, camera pans across modern professional team working, ${industry} environment, warm premium lighting, corporate brand film style, 10 seconds`,
      headline: companyName,
      bullets: [tagline],
      description: tagline,
      visualTheme: 'problem',
    },
    {
      duration: '10s',
      visual: `Split-screen "Before vs After". Left: chaos, missed deadlines, declining graph. Right: organised workflow, rising metrics, confident team.`,
      voiceover: `${painPoints[0]}. ${painPoints[1]}. It's time for a smarter approach.`,
      onScreenText: 'The Problem:\nOutdated. Expensive. Slow.',
      caption: `Sound familiar? You're not alone. ${painPoints[0]} 💡`,
      imagePrompt: `Split screen comparison, left side chaotic stressed office red tones, right side organised modern workspace green success tones, ${industry} business context, editorial photography`,
      videoPrompt: `Dramatic split-screen transition, left side showing business chaos and stress, right side showing success and growth, smooth wipe transition, cinematic corporate video, 10 seconds`,
      headline: 'The Challenge',
      bullets: painPoints,
      description: painPoints.join(' • '),
      visualTheme: 'problem',
    },
    {
      duration: '10s',
      visual: `Product/service showcase montage. UI demos, client meetings, results dashboards. Dynamic cuts synced to beat. ${industry}-specific visuals.`,
      voiceover: `${companyName} delivers: ${solutions.join('. ')}. Everything you need, one powerful platform.`,
      onScreenText: `Solutions:\n${solutions.slice(0, 2).join('\n')}`,
      caption: `Here's how ${companyName} transforms your ${industry.toLowerCase()} game 🚀`,
      imagePrompt: `Modern ${industry} service showcase, sleek UI dashboard, professional delivering results, dynamic composition, tech-forward aesthetic, blue and purple gradient accents, 4K`,
      videoPrompt: `Fast-paced montage of ${industry} solutions in action, UI animations, happy clients, results graphs rising, dynamic camera movements, modern corporate video style, 10 seconds`,
      headline: 'Our Solution',
      bullets: solutions,
      description: solutions.join(' • '),
      visualTheme: 'features',
    },
    {
      duration: '10s',
      visual: `Happy clients, handshake deals, 5-star reviews floating, growth charts ascending. Testimonial-style shots. Global map highlighting UK, UAE, international markets.`,
      voiceover: `${benefits[0]}. ${benefits[1]}. Join businesses already growing with ${companyName}.`,
      onScreenText: `Results:\n${benefits[0]}`,
      caption: `Real results. Real growth. ${benefits[0]} 📈`,
      imagePrompt: `Success celebration, business handshake, growth chart ascending, global map with UK UAE markers, testimonial style portrait, warm confident lighting, corporate success photography 4K`,
      videoPrompt: `Uplifting success montage, client testimonials, rising analytics graphs, global business connections UK UAE, warm golden lighting, inspiring corporate video, 10 seconds`,
      headline: 'Proven Results',
      bullets: benefits,
      description: benefits.join(' • '),
      visualTheme: 'benefits',
    },
    {
      duration: '10s',
      visual: `${companyName} branding full screen. Bold CTA button animation. Website URL. Contact details. Confident spokesperson or brand mascot. Premium closing shot.`,
      voiceover: `${cta}. Don't wait — your competitors won't. Start your journey with ${companyName} today.`,
      onScreenText: cta.length > 60 ? `${cta.slice(0, 57)}...` : cta,
      caption: `Ready to grow? ${cta} 🔥 Link in bio!`,
      imagePrompt: `Premium brand closing slide, ${companyName} logo center, bold call to action, modern gradient background purple and gold, professional marketing design, 4K`,
      videoPrompt: `Cinematic brand outro, logo animation center screen, CTA button pulse, website URL reveal, confident professional closing shot, premium corporate video ending, 10 seconds`,
      headline: cta,
      description: `${companyName} — Start today!`,
      visualTheme: 'cta',
    },
  ];

  return raw.map((s, i) => ({ ...s, scene: i + 1 }));
}

function build60SecondScript(profile: BusinessProfile, scenes: MarketingScene[]): string {
  const lines = scenes.map((s) => `[${s.duration}] Scene ${s.scene}\n${s.voiceover}`);
  return [
    `# 60-Second Promotional Video Script — ${profile.companyName}`,
    `# Industry: ${profile.industry} | Audience: ${profile.targetAudience}`,
    '',
    ...lines,
    '',
    `[TOTAL: 60 seconds]`,
  ].join('\n');
}

function buildHashtags(profile: BusinessProfile): string[] {
  const base = profile.companyName.replace(/\s+/g, '');
  const industryTags: Record<string, string[]> = {
    'AI & SaaS Technology': ['#AI', '#SaaS', '#TechStartup', '#Automation', '#Innovation'],
    'Digital Marketing': ['#DigitalMarketing', '#SocialMedia', '#ContentMarketing', '#BrandGrowth', '#MarketingStrategy'],
    'Business Consulting': ['#BusinessGrowth', '#Consulting', '#Strategy', '#Leadership', '#Entrepreneur'],
    'Financial Services': ['#Finance', '#WealthManagement', '#FinTech', '#Investment', '#FinancialPlanning'],
    'Healthcare & Wellness': ['#Healthcare', '#Wellness', '#HealthTech', '#PatientCare', '#Medical'],
    'Real Estate & Property': ['#RealEstate', '#Property', '#Investment', '#DubaiProperty', '#UKProperty'],
    'Hospitality & Food': ['#Hospitality', '#FoodBusiness', '#Restaurant', '#Catering', '#Dining'],
    'Education & Training': ['#Education', '#Elearning', '#Training', '#SkillsDevelopment', '#OnlineLearning'],
    'E-Commerce & Retail': ['#Ecommerce', '#OnlineShopping', '#Retail', '#D2C', '#ShopSmall'],
    'Legal Services': ['#Legal', '#LawFirm', '#Compliance', '#BusinessLaw', '#LegalAdvice'],
    'Logistics & Supply Chain': ['#Logistics', '#SupplyChain', '#Shipping', '#Freight', '#Delivery'],
    'Professional Business Services': ['#Business', '#ProfessionalServices', '#B2B', '#Growth', '#Success'],
  };

  const tags = industryTags[profile.industry] || industryTags['Professional Business Services'];
  return [
    `#${base}`,
    '#BusinessGrowth',
    '#UKBusiness',
    '#DubaiBusiness',
    '#UAEBusiness',
    '#Startup',
    '#Entrepreneur',
    '#Marketing',
    '#VideoMarketing',
    '#BrandBuilding',
    '#SmallBusiness',
    '#B2BMarketing',
    '#ClientSuccess',
    '#Innovation',
    '#ScaleUp',
    ...tags,
  ].slice(0, 20);
}

function buildSocialPosts(profile: BusinessProfile, hook: string): VideoMarketingPackage['socialMedia'] {
  const { companyName, industry, cta, website, region } = profile;
  return {
    linkedin: `🚀 ${hook}\n\n${companyName} is redefining ${industry.toLowerCase()} for ${region} clients.\n\n✅ Proven results\n✅ Transparent pricing\n✅ Dedicated support\n\n${cta}\n\n#BusinessGrowth #${industry.replace(/\s+/g, '')} #UKBusiness #UAEBusiness`,
    facebook: `🎬 New video alert! Discover how ${companyName} helps businesses like yours grow faster.\n\n${hook}\n\n👉 ${cta}\n\nPerfect for business owners in the UK, UAE & worldwide. Watch now and share with someone who needs this! 🙌`,
    instagram: `✨ ${hook}\n\n${companyName} | ${industry}\n\n📍 Serving ${region}\n🎯 Results-driven\n💡 Modern solutions\n\n${cta}\n\n.\n.\n.\n#${companyName.replace(/\s+/g, '')} #BusinessGrowth #Marketing #Reels #VideoMarketing`,
    youtube: `${companyName} — Professional Promotional Video\n\n${hook}\n\nAbout ${companyName}:\n${profile.tagline}\n\nServices:\n${profile.mainServices.slice(0, 3).map((s) => `• ${s}`).join('\n')}\n\nTarget Audience: ${profile.targetAudience}\n\n${cta}\n\nWebsite: ${website}\n\n#${companyName.replace(/\s+/g, '')} #Business #Marketing`,
  };
}

export function buildVideoMarketingPackage(
  source: string,
  sourceType: string,
  _language: string,
  _voice: string
): VideoMarketingPackage {
  const profile = buildProfileFromSource(source, sourceType);
  const scenes = buildScenes(profile);
  const hook = profile.hook;
  const script = build60SecondScript(profile, scenes);
  const voiceover = scenes.map((s) => s.voiceover).join(' ');
  const videoConcept = `Position ${profile.companyName} as the modern, results-driven ${profile.industry.toLowerCase()} partner for ${profile.region} clients. Lead with pain-point hook, demonstrate transformation, showcase solutions with proof, close with urgency-driven CTA. Professional corporate style with cinematic visuals — optimised for LinkedIn, YouTube & Instagram.`;

  return {
    businessSummary: {
      companyName: profile.companyName,
      industry: profile.industry,
      mainServices: profile.mainServices,
      targetAudience: profile.targetAudience,
    },
    videoConcept,
    hook,
    script,
    voiceover,
    scenes,
    storyboard: scenes,
    backgroundMusic: `Upbeat corporate ambient — modern piano with subtle electronic beat. Style: Inspiring, professional, forward-momentum. Similar to: premium SaaS launch videos & Apple keynote background. Tempo: 100-110 BPM. Mood: Confident → Energetic → Triumphant. Suitable for UK, UAE & international B2B audiences.`,
    cta: profile.cta,
    socialMedia: buildSocialPosts(profile, hook),
    hashtags: buildHashtags(profile),
  };
}

export function formatFullMarketingReport(pkg: VideoMarketingPackage): string {
  const sections: string[] = [
    '═'.repeat(60),
    '  AI VIDEO MARKETING CREATOR — FULL REPORT',
    '═'.repeat(60),
    '',
    '▸ BUSINESS SUMMARY',
    `  Company Name:    ${pkg.businessSummary.companyName}`,
    `  Industry:        ${pkg.businessSummary.industry}`,
    `  Main Services:   ${pkg.businessSummary.mainServices.join(' | ')}`,
    `  Target Audience: ${pkg.businessSummary.targetAudience}`,
    '',
    '▸ VIDEO CONCEPT',
    `  ${pkg.videoConcept}`,
    '',
    '▸ HOOK (First 5 Seconds)',
    `  ${pkg.hook}`,
    '',
    '▸ 60-SECOND VIDEO SCRIPT',
    pkg.script,
    '',
    '▸ SCENE BREAKDOWN',
  ];

  for (const s of pkg.scenes) {
    sections.push(
      '',
      `  Scene ${s.scene} (${s.duration}):`,
      `  Visual:          ${s.visual}`,
      `  Voice-over:      ${s.voiceover}`,
      `  On-screen Text:  ${s.onScreenText}`,
      `  Caption:         ${s.caption}`,
      `  AI Image Prompt: ${s.imagePrompt}`,
      `  AI Video Prompt: ${s.videoPrompt}`,
    );
  }

  sections.push(
    '',
    '▸ BACKGROUND MUSIC STYLE',
    `  ${pkg.backgroundMusic}`,
    '',
    '▸ CALL TO ACTION',
    `  ${pkg.cta}`,
    '',
    '▸ SOCIAL MEDIA VERSIONS',
    '',
    '  LinkedIn:',
    `  ${pkg.socialMedia.linkedin}`,
    '',
    '  Facebook:',
    `  ${pkg.socialMedia.facebook}`,
    '',
    '  Instagram:',
    `  ${pkg.socialMedia.instagram}`,
    '',
    '  YouTube Description:',
    `  ${pkg.socialMedia.youtube}`,
    '',
    '▸ HASHTAGS (20)',
    `  ${pkg.hashtags.join(' ')}`,
    '',
    '═'.repeat(60),
  );

  return sections.join('\n');
}

export function getBusinessProfile(source: string, sourceType: string) {
  return buildProfileFromSource(source, sourceType);
}
