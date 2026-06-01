import { buildVideoMarketingPackage, getBusinessProfile, type VideoMarketingPackage } from './videoMarketingEngine';

export type { VideoMarketingPackage, BusinessSummary, MarketingScene } from './videoMarketingEngine';
export { buildVideoMarketingPackage, getBusinessProfile, formatFullMarketingReport } from './videoMarketingEngine';

export interface VideoTopic {
  productName: string;
  tagline: string;
  hook: string;
  features: string[];
  benefits: string[];
  cta: string;
  website: string;
}

export interface VideoContentResult extends VideoMarketingPackage {
  storyboard: VideoMarketingPackage['scenes'];
}

export function buildVideoContent(
  source: string,
  sourceType: string,
  language: string,
  voice: string
): VideoContentResult {
  const pkg = buildVideoMarketingPackage(source, sourceType, language, voice);
  const voiceTag = language !== 'english' ? ` [${voice} voice, ${language}]` : '';
  return {
    ...pkg,
    voiceover: `${pkg.voiceover}${voiceTag}`,
    storyboard: pkg.scenes,
  };
}

export function getVideoTopic(source: string, sourceType: string): VideoTopic {
  const profile = getBusinessProfile(source, sourceType);
  return {
    productName: profile.companyName,
    tagline: profile.tagline,
    hook: profile.hook,
    features: profile.mainServices.slice(0, 5),
    benefits: profile.benefits,
    cta: profile.cta,
    website: profile.website,
  };
}
