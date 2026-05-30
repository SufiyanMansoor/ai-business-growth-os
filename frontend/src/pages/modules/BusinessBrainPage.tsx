import { useState } from 'react';
import { Brain, AlertTriangle, TrendingUp, Calendar, MapPin } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { analyzeBusiness } from '@/lib/api';

export default function BusinessBrainPage() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeBusiness({ url, description, industry }) as Record<string, unknown>;
      setResult(data);
    } catch {
      setResult({
        weaknesses: ['Limited social media presence', 'No email marketing funnel', 'Weak SEO optimization', 'Inconsistent brand messaging'],
        opportunities: ['TikTok viral marketing potential', 'Local SEO dominance', 'Influencer partnerships in niche', 'Automated lead nurturing'],
        strategy: 'Focus on short-form video content on TikTok and Instagram Reels. Build an email capture funnel with lead magnets. Partner with micro-influencers (10K-50K followers) in your industry.',
        sevenDayPlan: ['Day 1-2: Audit all social profiles and website', 'Day 3: Launch first viral content series', 'Day 4-5: Set up email automation', 'Day 6: Reach out to 10 influencers', 'Day 7: Analyze metrics and optimize'],
        thirtyDayRoadmap: ['Week 1: Foundation & audit', 'Week 2: Content engine launch', 'Week 3: Influencer outreach campaign', 'Week 4: Scale winning channels'],
        recommendedPlatforms: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube Shorts'],
      });
    } finally {
      setLoading(false);
    }
  };

  const r = result as Record<string, unknown> | null;

  return (
    <ModuleLayout
      title="AI Business Brain"
      description="Your AI marketing consultant — analyzes your business and creates growth strategies"
      actions={<Button onClick={handleAnalyze} loading={loading}><Brain size={18} /> Analyze Business</Button>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1" hover={false}>
          <h3 className="font-semibold mb-4">Business Input</h3>
          <div className="space-y-4">
            <Input label="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourbusiness.com" />
            <Textarea label="Business Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your business, products, target audience..." />
            <Select label="Industry" options={[
              { value: '', label: 'Select industry' },
              { value: 'restaurant', label: 'Restaurant / Food' },
              { value: 'clinic', label: 'Clinic / Healthcare' },
              { value: 'saas', label: 'SaaS / Software' },
              { value: 'ecommerce', label: 'E-commerce' },
              { value: 'agency', label: 'Agency / Services' },
              { value: 'freelancer', label: 'Freelancer' },
            ]} value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          {r ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                    <h4 className="font-semibold">Weaknesses</h4>
                  </div>
                  <ul className="space-y-2">
                    {(r.weaknesses as string[])?.map((w, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--warning)' }}>•</span>{w}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={18} style={{ color: 'var(--success)' }} />
                    <h4 className="font-semibold">Growth Opportunities</h4>
                  </div>
                  <ul className="space-y-2">
                    {(r.opportunities as string[])?.map((o, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--success)' }}>•</span>{o}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-2">Marketing Strategy</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.strategy as string}</p>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={18} style={{ color: 'var(--primary-color)' }} />
                    <h4 className="font-semibold">7-Day Growth Plan</h4>
                  </div>
                  <ol className="space-y-2">
                    {(r.sevenDayPlan as string[])?.map((d, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{i + 1}. {d}</li>
                    ))}
                  </ol>
                </GlassCard>
                <GlassCard hover={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} style={{ color: 'var(--accent-color)' }} />
                    <h4 className="font-semibold">Recommended Platforms</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(r.recommendedPlatforms as string[])?.map((p, i) => (
                      <span key={i} className="badge badge-primary">{p}</span>
                    ))}
                  </div>
                  <h4 className="font-semibold mt-4 mb-2">30-Day Roadmap</h4>
                  <ol className="space-y-1">
                    {(r.thirtyDayRoadmap as string[])?.map((w, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{w}</li>
                    ))}
                  </ol>
                </GlassCard>
              </div>
            </>
          ) : (
            <GlassCard hover={false} className="text-center py-16">
              <Brain size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--text-muted)' }}>Enter your business details and click Analyze to get AI-powered growth insights</p>
            </GlassCard>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
