import { useState } from 'react';
import { Rocket, Copy, Check } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { generateCampaign } from '@/lib/api';

type CampaignResult = {
  videoScript?: string;
  storyboard?: string[];
  instagramPosts?: string[];
  tiktokScripts?: string[];
  linkedinPosts?: string[];
  emailCampaign?: { subject: string; body: string };
  adCopy?: { facebook: string; google: string };
  landingPageCopy?: string;
  hashtags?: string[];
  ctaMessages?: string[];
};

export default function CampaignPage() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'url' | 'product' | 'description'>('url');
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateCampaign({ input, type: inputType }) as CampaignResult;
      setResult(data);
    } catch {
      setResult({
        videoScript: '🎬 HOOK: "What if I told you there\'s a way to 10x your business growth?"\n\nINTRO: Introducing the future of marketing...\n\nFEATURES: AI-powered campaigns, automated outreach, viral content engine\n\nCTA: Start your free trial today!',
        storyboard: ['Scene 1: Bold text hook on dark background', 'Scene 2: Product demo screen recording', 'Scene 3: Customer testimonial', 'Scene 4: Feature highlights montage', 'Scene 5: CTA with logo'],
        instagramPosts: Array.from({ length: 10 }, (_, i) => `📸 Post ${i + 1}: Engaging visual content with hook, value proposition, and CTA. #marketing #growth #business`),
        tiktokScripts: Array.from({ length: 5 }, (_, i) => `🎵 Reel ${i + 1}: "POV: You discover the secret to 10x growth..." [Trending audio] [Quick cuts] [Text overlay] [CTA]`),
        linkedinPosts: ['Professional insight post about industry trends...', 'Case study format post with results...'],
        emailCampaign: { subject: '🚀 Your Complete Marketing Campaign is Ready!', body: 'Hi {{name}},\n\nWe\'ve prepared a complete marketing campaign tailored for your business...' },
        adCopy: { facebook: 'Stop wasting money on ads that don\'t convert. Our AI creates campaigns that actually work. Start free →', google: 'AI Marketing Platform | 10x Your Growth | Free Trial | Automated Campaigns' },
        landingPageCopy: 'Headline: Transform Your Business Growth with AI\n\nSubheadline: The all-in-one marketing OS that works while you sleep\n\nFeatures: One-click campaigns, AI video creator, influencer discovery\n\nCTA: Start Free Trial',
        hashtags: ['#marketing', '#growth', '#AI', '#business', '#startup', '#digitalmarketing', '#contentcreator', '#socialmedia'],
        ctaMessages: ['Start Your Free Trial', 'Get 10x Growth Today', 'Book a Free Demo', 'Join 10,000+ Businesses'],
      });
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const tabs = [
    { key: 'videoScript', label: 'Video Script' },
    { key: 'instagramPosts', label: 'Instagram (10)' },
    { key: 'tiktokScripts', label: 'TikTok (5)' },
    { key: 'linkedinPosts', label: 'LinkedIn' },
    { key: 'emailCampaign', label: 'Email' },
    { key: 'adCopy', label: 'Ad Copy' },
    { key: 'landingPageCopy', label: 'Landing Page' },
    { key: 'hashtags', label: 'Hashtags' },
  ];

  const [activeTab, setActiveTab] = useState('videoScript');

  return (
    <ModuleLayout
      title="One-Click Campaign System"
      description="Generate a complete marketing campaign from a single input"
      actions={<Button onClick={handleGenerate} loading={loading} disabled={!input}><Rocket size={18} /> Generate Campaign</Button>}
    >
      <GlassCard hover={false} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Input Type" options={[
            { value: 'url', label: 'Website URL' },
            { value: 'product', label: 'Product Name' },
            { value: 'description', label: 'Description' },
          ]} value={inputType} onChange={(e) => setInputType(e.target.value as typeof inputType)} />
          <div className="md:col-span-2">
            <Input label="Campaign Input" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={inputType === 'url' ? 'https://yourbusiness.com' : inputType === 'product' ? 'Product name' : 'Describe your product/service...'} />
          </div>
        </div>
      </GlassCard>

      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'nav-link-active' : 'glass-card hover:!transform-none'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <GlassCard hover={false}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h3>
              <Button variant="ghost" size="sm" onClick={() => {
                const val = result[activeTab as keyof CampaignResult];
                copyText(typeof val === 'string' ? val : JSON.stringify(val, null, 2), activeTab);
              }}>
                {copied === activeTab ? <Check size={16} /> : <Copy size={16} />}
                {copied === activeTab ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            {activeTab === 'videoScript' && <pre className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{result.videoScript}</pre>}
            {activeTab === 'storyboard' && result.storyboard?.map((s, i) => <p key={i} className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Scene {i + 1}: {s}</p>)}
            {['instagramPosts', 'tiktokScripts', 'linkedinPosts', 'hashtags', 'ctaMessages'].includes(activeTab) && (
              <div className="space-y-3">
                {(result[activeTab as keyof CampaignResult] as string[])?.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'emailCampaign' && result.emailCampaign && (
              <div className="space-y-3">
                <p className="text-sm"><strong>Subject:</strong> {result.emailCampaign.subject}</p>
                <pre className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{result.emailCampaign.body}</pre>
              </div>
            )}
            {activeTab === 'adCopy' && result.adCopy && (
              <div className="space-y-4">
                <div><h4 className="font-medium mb-1">Facebook</h4><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.adCopy.facebook}</p></div>
                <div><h4 className="font-medium mb-1">Google</h4><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.adCopy.google}</p></div>
              </div>
            )}
            {activeTab === 'landingPageCopy' && <pre className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{result.landingPageCopy}</pre>}
          </GlassCard>
        </div>
      )}
    </ModuleLayout>
  );
}
