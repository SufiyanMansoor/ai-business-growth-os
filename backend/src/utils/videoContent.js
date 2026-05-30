export function buildTopicFromSource(source, sourceType) {
  const trimmed = String(source || '').trim();

  if (
    trimmed.toLowerCase().includes('ai-business-growth') ||
    trimmed.toLowerCase().includes('marketing software') ||
    (sourceType === 'github' && trimmed.includes('ai-business'))
  ) {
    return {
      productName: 'AI Business Growth OS',
      tagline: 'AI Influencer & Marketing Studio',
      hook: 'Kya aapka marketing ab bhi manual hai? AI se 10x tez grow karein!',
      features: [
        'AI Video Creator — Scripts & downloads',
        'One-Click Campaign Generator',
        'Influencer Discovery & Outreach',
        'CRM, SEO & ROI Analytics',
      ],
      benefits: ['No agency needed', 'Demo mode — free try', 'Multi-language support'],
      cta: 'Try Demo Free Today!',
      website: 'sufiyanmansoor.github.io/ai-business-growth-os',
    };
  }

  const repoMatch = trimmed.match(/github\.com\/[^/]+\/([^/?#]+)/i);
  if (sourceType === 'github' || repoMatch) {
    const repo = repoMatch?.[1] || trimmed.split('/').pop();
    const name = repo.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      productName: name,
      tagline: `${name} on GitHub`,
      hook: `Introducing ${name}`,
      features: [`${name} — powerful solution`, 'Easy to deploy', 'Open source', 'Scalable'],
      benefits: ['Free to explore', 'Community driven'],
      cta: `Check out ${name} on GitHub`,
      website: trimmed.replace(/^https?:\/\//, '').slice(0, 50),
    };
  }

  const name = trimmed.length > 40 ? trimmed.slice(0, 40) : trimmed || 'Your Product';
  return {
    productName: name,
    tagline: 'Marketing Video',
    hook: `Discover ${name}`,
    features: [`${name} benefits`, 'Easy to use', 'Proven results'],
    benefits: ['Save time', 'Grow faster'],
    cta: 'Get Started Today',
    website: name.slice(0, 40),
  };
}

export function buildVideoContentPayload(source, sourceType, language, voice) {
  const topic = buildTopicFromSource(source, sourceType);
  return {
    script: `[HOOK] ${topic.hook}\n\n[INTRO] ${topic.productName} — ${topic.tagline}.\n\n[FEATURES] ${topic.features.join('. ')}.\n\n[CTA] ${topic.cta}`,
    storyboard: [
      { scene: 1, headline: topic.hook, description: `${topic.productName}: ${topic.tagline}`, duration: '4s' },
      { scene: 2, headline: 'Key Features', description: topic.features.slice(0, 2).join(' • '), bullets: topic.features, duration: '6s' },
      { scene: 3, headline: 'Why Choose Us?', description: topic.benefits.join(' • '), bullets: topic.benefits, duration: '5s' },
      { scene: 4, headline: topic.cta, description: `${topic.productName} — Start now!`, duration: '4s' },
    ],
    voiceover: `${topic.hook} Introducing ${topic.productName}. ${topic.features.slice(0, 2).join(', ')}. ${topic.cta}`,
  };
}
