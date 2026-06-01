import type { VideoScene } from './videoExport';

export interface SoftwareModule {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  tagline: string;
  features: string[];
  demoAction: string;
  stats: { label: string; value: string }[];
}

export interface SoftwareDemoVideo {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  moduleId: string;
  duration: string;
  scenes: VideoScene[];
  voiceover: string;
  isFullTour?: boolean;
}

export interface SoftwareProduct {
  id: string;
  name: string;
  tagline: string;
  website: string;
  modules: SoftwareModule[];
}

const GROWTH_OS_MODULES: SoftwareModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    shortName: 'Dashboard',
    icon: '📊',
    color: '#6366f1',
    tagline: 'Your command centre — revenue, leads & campaigns at a glance',
    features: ['Live revenue & ROI metrics', 'Active campaign tracker', 'Lead pipeline overview', 'Quick-action shortcuts'],
    demoAction: 'See all KPIs in one beautiful dashboard',
    stats: [{ label: 'Revenue', value: '£15.8K' }, { label: 'Leads', value: '520' }, { label: 'ROI', value: '351%' }],
  },
  {
    id: 'business-brain',
    name: 'AI Business Brain',
    shortName: 'AI Brain',
    icon: '🧠',
    color: '#8b5cf6',
    tagline: 'AI analyzes your business & builds growth strategy',
    features: ['Weakness & opportunity scan', '7-day action plan', '30-day roadmap', 'Platform recommendations'],
    demoAction: 'Get AI strategy in 30 seconds',
    stats: [{ label: 'Score', value: '92/100' }, { label: 'Opportunities', value: '12' }, { label: 'Plan', value: 'Ready' }],
  },
  {
    id: 'campaign',
    name: 'One-Click Campaign',
    shortName: 'Campaign',
    icon: '🚀',
    color: '#ec4899',
    tagline: 'Full marketing campaign — one click, all platforms',
    features: ['Instagram + TikTok posts', 'LinkedIn & email copy', 'Ad copy & landing page', 'Hashtags & CTAs auto-generated'],
    demoAction: 'Launch campaign across 4 platforms instantly',
    stats: [{ label: 'Posts', value: '10+' }, { label: 'Platforms', value: '4' }, { label: 'Time', value: '1 click' }],
  },
  {
    id: 'video-creator',
    name: 'AI Video Creator',
    shortName: 'Video',
    icon: '🎬',
    color: '#f59e0b',
    tagline: 'Professional demo & promo videos — automatically',
    features: ['60-second script & storyboard', 'Multiple module demo videos', 'AI image & video prompts', 'Download WebM/MP4'],
    demoAction: 'Create software demo videos like this one',
    stats: [{ label: 'Scenes', value: '6+' }, { label: 'Demos', value: '8' }, { label: 'Format', value: 'HD' }],
  },
  {
    id: 'viral-content',
    name: 'Viral Content Engine',
    shortName: 'Viral',
    icon: '🔥',
    color: '#ef4444',
    tagline: 'Hooks & content ideas engineered to go viral',
    features: ['Viral hook generator', 'Content idea bank', 'Best posting times', 'Engagement score predictor'],
    demoAction: 'Generate viral hooks for any niche',
    stats: [{ label: 'Viral Score', value: '85' }, { label: 'Hooks', value: '20+' }, { label: 'Engagement', value: '7.8%' }],
  },
  {
    id: 'crm',
    name: 'CRM Pipeline',
    shortName: 'CRM',
    icon: '📋',
    color: '#06b6d4',
    tagline: 'Track leads from first contact to closed deal',
    features: ['Kanban pipeline view', 'Lead scoring & stages', 'Notes & follow-ups', 'Deal value tracking'],
    demoAction: 'Manage your entire sales pipeline visually',
    stats: [{ label: 'Leads', value: '520' }, { label: 'Deals', value: '28' }, { label: 'Win Rate', value: '34%' }],
  },
  {
    id: 'seo',
    name: 'AI SEO Engine',
    shortName: 'SEO',
    icon: '🔍',
    color: '#10b981',
    tagline: 'Rank higher with AI-powered SEO optimization',
    features: ['SEO score audit', 'Keyword research', 'Meta tag generator', 'Blog idea engine'],
    demoAction: 'Boost search rankings with AI recommendations',
    stats: [{ label: 'SEO Score', value: '72' }, { label: 'Keywords', value: '45' }, { label: 'Issues', value: 'Fixed' }],
  },
  {
    id: 'autopilot',
    name: 'AI Autopilot',
    shortName: 'Autopilot',
    icon: '🤖',
    color: '#a855f7',
    tagline: 'Set it and forget it — AI runs your marketing 24/7',
    features: ['Auto content scheduling', 'Smart lead follow-ups', 'Campaign optimization', 'Performance alerts'],
    demoAction: 'Let AI handle marketing while you sleep',
    stats: [{ label: 'Tasks', value: 'Auto' }, { label: 'Uptime', value: '24/7' }, { label: 'Saved', value: '10h/wk' }],
  },
];

function titleCase(text: string): string {
  return text.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

function extractRepoName(source: string): string {
  const match = source.match(/github\.com\/[^/]+\/([^/?#]+)/i);
  return match?.[1] ? titleCase(match[1]) : titleCase(source.slice(0, 30));
}

function isGrowthOs(source: string): boolean {
  const s = source.toLowerCase();
  return s.includes('ai-business-growth') || s.includes('growth-os') || s.includes('ai marketing') || s.includes('sufiyanmansoor');
}

export function getSoftwareProduct(source: string, sourceType: string): SoftwareProduct {
  if (isGrowthOs(source) || !source.trim()) {
    return {
      id: 'ai-growth-os',
      name: 'AI Growth OS',
      tagline: 'Marketing Studio — 16 AI Modules, One Platform',
      website: 'sufiyanmansoor.github.io/ai-business-growth-os',
      modules: GROWTH_OS_MODULES,
    };
  }

  const name = sourceType === 'github' || source.includes('github.com')
    ? extractRepoName(source)
    : source.length > 40 ? source.slice(0, 37) + '...' : source;

  const genericModules: SoftwareModule[] = [
    { id: 'overview', name: `${name} Overview`, shortName: 'Overview', icon: '✨', color: '#6366f1', tagline: `Introducing ${name}`, features: [`${name} core platform`, 'Easy setup & deploy', 'Modern UI', 'Scalable architecture'], demoAction: `Explore ${name}`, stats: [{ label: 'Status', value: 'Live' }, { label: 'Users', value: '1K+' }, { label: 'Uptime', value: '99.9%' }] },
    { id: 'features', name: 'Key Features', shortName: 'Features', icon: '⚡', color: '#8b5cf6', tagline: 'Powerful features built for growth', features: ['Feature-rich dashboard', 'Automation tools', 'Analytics & reports', 'API integrations'], demoAction: 'See features in action', stats: [{ label: 'Features', value: '20+' }, { label: 'APIs', value: '10' }, { label: 'Speed', value: 'Fast' }] },
    { id: 'dashboard', name: 'Dashboard', shortName: 'Dashboard', icon: '📊', color: '#06b6d4', tagline: 'Real-time analytics & control panel', features: ['Live metrics', 'Custom widgets', 'Export reports', 'Team view'], demoAction: 'Monitor everything from one place', stats: [{ label: 'Metrics', value: '50+' }, { label: 'Reports', value: 'Auto' }, { label: 'Export', value: 'PDF' }] },
    { id: 'automation', name: 'Automation', shortName: 'Auto', icon: '🤖', color: '#a855f7', tagline: 'Automate repetitive tasks instantly', features: ['Workflow builder', 'Scheduled tasks', 'Smart triggers', 'Notifications'], demoAction: 'Save hours every week', stats: [{ label: 'Workflows', value: '∞' }, { label: 'Saved', value: '5h/day' }, { label: 'Errors', value: '0' }] },
  ];

  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    tagline: `${name} — Professional Software Platform`,
    website: source.replace(/^https?:\/\//, '').slice(0, 50),
    modules: genericModules,
  };
}

function buildModuleDemoScenes(product: SoftwareProduct, mod: SoftwareModule): VideoScene[] {
  return [
    {
      scene: 1,
      duration: '4s',
      headline: `${product.name}`,
      description: mod.tagline,
      bullets: [mod.demoAction],
      visualTheme: 'hook',
      moduleId: mod.id,
      moduleName: mod.name,
      moduleIcon: mod.icon,
      moduleColor: mod.color,
    } as VideoScene,
    {
      scene: 2,
      duration: '5s',
      headline: mod.name,
      description: 'Live software walkthrough',
      bullets: mod.features,
      visualTheme: 'features',
      moduleId: mod.id,
      moduleName: mod.name,
      moduleIcon: mod.icon,
      moduleColor: mod.color,
      stats: mod.stats,
    } as VideoScene,
    {
      scene: 3,
      duration: '4s',
      headline: mod.demoAction,
      description: `${product.name} — Try free demo now`,
      bullets: mod.stats.map((s) => `${s.label}: ${s.value}`),
      visualTheme: 'cta',
      moduleId: mod.id,
      moduleName: mod.name,
      moduleIcon: mod.icon,
      moduleColor: mod.color,
    } as VideoScene,
  ];
}

function buildFullTourScenes(product: SoftwareProduct): VideoScene[] {
  const intro: VideoScene = {
    scene: 1,
    duration: '5s',
    headline: product.name,
    description: product.tagline,
    bullets: [`${product.modules.length} powerful modules`, 'One unified platform', 'Free demo — no login needed'],
    visualTheme: 'hook',
    moduleId: 'intro',
    moduleName: product.name,
    moduleIcon: '✨',
    moduleColor: '#6366f1',
    isIntro: true,
  } as VideoScene;

  const moduleScenes: VideoScene[] = product.modules.slice(0, 6).map((mod, i) => ({
    scene: i + 2,
    duration: '5s',
    headline: mod.name,
    description: mod.tagline,
    bullets: mod.features.slice(0, 3),
    visualTheme: (i % 2 === 0 ? 'features' : 'solution') as VideoScene['visualTheme'],
    moduleId: mod.id,
    moduleName: mod.name,
    moduleIcon: mod.icon,
    moduleColor: mod.color,
    stats: mod.stats,
  } as VideoScene));

  const outro: VideoScene = {
    scene: moduleScenes.length + 2,
    duration: '5s',
    headline: 'Start Free Demo Today',
    description: product.website,
    bullets: ['UK • UAE • Global', '16 AI Modules', 'No credit card required'],
    visualTheme: 'cta',
    moduleId: 'cta',
    moduleName: product.name,
    moduleIcon: '🚀',
    moduleColor: '#fbbf24',
  } as VideoScene;

  return [intro, ...moduleScenes, outro];
}

export function getSoftwareDemoVideos(source: string, sourceType: string): SoftwareDemoVideo[] {
  const product = getSoftwareProduct(source, sourceType);
  const demos: SoftwareDemoVideo[] = [];

  demos.push({
    id: 'full-tour',
    title: 'Complete Platform Tour',
    subtitle: `${product.modules.length} modules • 60 seconds`,
    icon: '🎯',
    moduleId: 'full',
    duration: '60s',
    isFullTour: true,
    scenes: buildFullTourScenes(product),
    voiceover: `Welcome to ${product.name}. ${product.tagline}. Let me show you every module.`,
  });

  for (const mod of product.modules) {
    demos.push({
      id: `demo-${mod.id}`,
      title: mod.name,
      subtitle: 'Module Demo Video',
      icon: mod.icon,
      moduleId: mod.id,
      duration: '15s',
      scenes: buildModuleDemoScenes(product, mod),
      voiceover: `${mod.name}: ${mod.tagline}. ${mod.demoAction}.`,
    });
  }

  return demos;
}

export function getModuleById(product: SoftwareProduct, moduleId: string): SoftwareModule | undefined {
  return product.modules.find((m) => m.id === moduleId);
}

export { GROWTH_OS_MODULES };
