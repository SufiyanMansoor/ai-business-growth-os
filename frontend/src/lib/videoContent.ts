export interface VideoTopic {
  productName: string;
  tagline: string;
  hook: string;
  features: string[];
  benefits: string[];
  cta: string;
  website: string;
}

export interface VideoContentResult {
  script: string;
  storyboard: { scene: number; description: string; duration: string; headline?: string; bullets?: string[] }[];
  voiceover: string;
}

function titleCase(text: string): string {
  return text
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function extractRepoName(source: string): string {
  const match = source.match(/github\.com\/[^/]+\/([^/?#]+)/i);
  return match?.[1] || source.split('/').pop() || source;
}

function extractDomainName(source: string): string {
  try {
    const url = new URL(source.startsWith('http') ? source : `https://${source}`);
    const part = url.hostname.replace(/^www\./, '').split('.')[0];
    return titleCase(part);
  } catch {
    return titleCase(source.slice(0, 40));
  }
}

function isGrowthOsSource(source: string): boolean {
  const s = source.toLowerCase();
  return (
    s.includes('ai-business-growth') ||
    s.includes('ai marketing') ||
    s.includes('marketing software') ||
    s.includes('ai-business-growth-os')
  );
}

function getGrowthOsTopic(source: string): VideoTopic {
  return {
    productName: 'AI Business Growth OS',
    tagline: 'AI Influencer & Marketing Studio — SaaS Platform',
    hook: 'Kya aapka marketing ab bhi manual hai? AI se 10x tez grow karein!',
    features: [
      'AI Video Creator — Scripts, storyboards & downloads',
      'One-Click Campaign — Instagram, TikTok, LinkedIn',
      'Influencer Discovery & Auto Outreach',
      'CRM Pipeline, SEO Engine & ROI Analytics',
      'AI Autopilot — Poora marketing automatic',
    ],
    benefits: [
      'Agency ki zaroorat nahi — AI sab karega',
      'Demo mode — bina login explore karein',
      'Multi-language: English, Urdu, Arabic, Hindi',
    ],
    cta: 'Try Demo Free — sufiyanmansoor.github.io/ai-business-growth-os',
    website: source.includes('http') ? source.replace(/^https?:\/\//, '').slice(0, 50) : 'sufiyanmansoor.github.io/ai-business-growth-os',
  };
}

function buildTopicFromSource(source: string, sourceType: string): VideoTopic {
  const trimmed = source.trim();
  if (!trimmed) {
    return getGrowthOsTopic('AI Business Growth OS');
  }

  if (isGrowthOsSource(trimmed) || (sourceType === 'github' && trimmed.includes('ai-business'))) {
    return getGrowthOsTopic(trimmed);
  }

  if (sourceType === 'github' || trimmed.includes('github.com')) {
    const repo = extractRepoName(trimmed);
    const name = titleCase(repo);
    return {
      productName: name,
      tagline: `${name} — Open Source on GitHub`,
      hook: `Introducing ${name} — built for developers & creators`,
      features: [
        `${name}: Modern & powerful solution`,
        'Easy setup — clone & deploy in minutes',
        'Active development on GitHub',
        'Community-driven & scalable',
      ],
      benefits: ['Free to explore', 'Full source code available', 'Deploy anywhere'],
      cta: `Star on GitHub — ${trimmed.slice(0, 45)}`,
      website: trimmed.replace(/^https?:\/\//, '').slice(0, 50),
    };
  }

  if (sourceType === 'url' || trimmed.includes('.') && !trimmed.includes(' ')) {
    const name = extractDomainName(trimmed);
    return {
      productName: name,
      tagline: `${name} — Transform Your Online Presence`,
      hook: `Discover why thousands choose ${name}`,
      features: [
        `${name} — Premium quality service`,
        'Fast, reliable & customer-focused',
        'Proven results for your business',
        'Easy to get started today',
      ],
      benefits: ['Trusted by growing businesses', '24/7 support ready', 'Results you can measure'],
      cta: `Visit Now — ${extractDomainName(trimmed).toLowerCase()}.com`,
      website: trimmed.replace(/^https?:\/\//, '').slice(0, 50),
    };
  }

  const name = trimmed.length > 50 ? `${trimmed.slice(0, 47)}...` : trimmed;
  return {
    productName: name,
    tagline: 'Your Next Big Marketing Opportunity',
    hook: `What if ${name} could change everything?`,
    features: [
      `Core value: ${name}`,
      'Solves real customer pain points',
      'Easy to understand & share',
      'Built for growth & scale',
    ],
    benefits: ['Saves time & money', 'Stands out from competitors', 'Ready to launch campaigns'],
    cta: 'Get Started Today — Limited Time Offer',
    website: name.slice(0, 40),
  };
}

export function buildVideoContent(
  source: string,
  sourceType: string,
  language: string,
  voice: string
): VideoContentResult {
  const topic = buildTopicFromSource(source, sourceType);
  const langNote = language !== 'english' ? ` (${language} audience)` : '';

  const script = [
    `[HOOK] ${topic.hook}`,
    `[INTRO] Meet ${topic.productName} — ${topic.tagline}.`,
    `[FEATURES] ${topic.features.slice(0, 3).join('. ')}.`,
    `[BENEFITS] ${topic.benefits.join('. ')}.`,
    `[CTA] ${topic.cta}${langNote}`,
  ].join('\n\n');

  const storyboard = [
    {
      scene: 1,
      headline: topic.hook,
      description: `${topic.productName}: ${topic.tagline}`,
      duration: '4s',
    },
    {
      scene: 2,
      headline: 'Key Features',
      description: topic.features.slice(0, 2).join(' • '),
      bullets: topic.features.slice(0, 4),
      duration: '6s',
    },
    {
      scene: 3,
      headline: 'Why Choose Us?',
      description: topic.benefits.join(' • '),
      bullets: topic.benefits,
      duration: '5s',
    },
    {
      scene: 4,
      headline: topic.cta,
      description: `${topic.productName} — Start your free demo now!`,
      duration: '4s',
    },
  ];

  const voiceover = [
    topic.hook,
    `Introducing ${topic.productName}. ${topic.tagline}.`,
    `Here's what you get: ${topic.features.slice(0, 3).join(', ')}.`,
    `${topic.benefits[0]}. ${topic.benefits[1]}.`,
    `${topic.cta}. Don't wait — start today!`,
  ].join(' ');

  return { script, storyboard, voiceover: `${voiceover} [${voice} voice, ${language}]` };
}

export function getVideoTopic(source: string, sourceType: string): VideoTopic {
  return buildTopicFromSource(source, sourceType);
}
