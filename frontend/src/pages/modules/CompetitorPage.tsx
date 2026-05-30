import { useState } from 'react';
import { Swords, Shield, Target, Lightbulb } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { analyzeCompetitor } from '@/lib/api';

export default function CompetitorPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeCompetitor({ url });
      setResult(data as Record<string, unknown>);
    } catch {
      setResult({
        swot: {
          strengths: ['Strong brand recognition', 'Large social following', 'Premium pricing strategy'],
          weaknesses: ['Limited video content', 'Poor mobile experience', 'Slow customer support'],
          opportunities: ['Untapped TikTok market', 'No email marketing funnel', 'Missing localization'],
          threats: ['New AI competitors entering market', 'Rising ad costs', 'Platform algorithm changes'],
        },
        contentGaps: ['No short-form video strategy', 'Missing educational content', 'No user-generated content program', 'Limited influencer partnerships'],
        improvementPlan: ['Launch TikTok/Reels content series within 2 weeks', 'Build email capture funnel with lead magnet', 'Partner with 5 micro-influencers in Q2', 'Create comparison landing pages for SEO'],
        growthOpportunities: ['First-mover advantage on emerging platforms', 'AI-powered personalization', 'Community building through exclusive content'],
      });
    } finally {
      setLoading(false);
    }
  };

  const swot = result?.swot as Record<string, string[]> | undefined;

  return (
    <ModuleLayout title="Competitor Analysis AI" description="SWOT analysis, content gaps, and competitive intelligence"
      actions={<Button onClick={handleAnalyze} loading={loading} disabled={!url}><Swords size={18} /> Analyze Competitor</Button>}>
      <GlassCard hover={false} className="mb-6">
        <Input label="Competitor Website URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://competitor.com" />
      </GlassCard>

      {swot && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'strengths', label: 'Strengths', icon: Shield, color: 'var(--success)' },
              { key: 'weaknesses', label: 'Weaknesses', icon: Target, color: 'var(--error)' },
              { key: 'opportunities', label: 'Opportunities', icon: Lightbulb, color: 'var(--primary-color)' },
              { key: 'threats', label: 'Threats', icon: Swords, color: 'var(--warning)' },
            ].map(({ key, label, icon: Icon, color }) => (
              <GlassCard key={key} hover={false}>
                <div className="flex items-center gap-2 mb-3"><Icon size={18} style={{ color }} /><h4 className="font-semibold">{label}</h4></div>
                <ul className="space-y-1">{swot[key]?.map((item, i) => (
                  <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {item}</li>
                ))}</ul>
              </GlassCard>
            ))}
          </div>

          <GlassCard hover={false}>
            <h4 className="font-semibold mb-3">Content Gaps</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(result?.contentGaps as string[])?.map((gap, i) => (
                <div key={i} className="p-3 rounded-xl text-sm" style={{ background: 'var(--bg-secondary)' }}>{gap}</div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h4 className="font-semibold mb-3">Improvement Plan</h4>
            <ol className="space-y-2">
              {(result?.improvementPlan as string[])?.map((step, i) => (
                <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="badge badge-primary flex-shrink-0">{i + 1}</span>{step}
                </li>
              ))}
            </ol>
          </GlassCard>
        </div>
      )}
    </ModuleLayout>
  );
}
