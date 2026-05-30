import { useState } from 'react';
import { Flame, TrendingUp, Clock, Hash } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { generateViralContent } from '@/lib/api';

export default function ViralContentPage() {
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateViralContent({ niche, platform, topic });
      setResult(data as Record<string, unknown>);
    } catch {
      setResult({
        hooks: [
          'POV: You just discovered the secret that 99% of marketers miss...',
          'Stop scrolling if you want to 10x your business in 30 days',
          'I tried this marketing hack for 7 days and here\'s what happened',
          'The algorithm doesn\'t want you to know this...',
          'Why everyone in [niche] is switching to this strategy',
        ],
        contentIdeas: [
          'Behind-the-scenes day in the life',
          'Before vs After transformation',
          'Top 5 mistakes in [niche]',
          'React to trending topic in your industry',
          'Quick tutorial / how-to in 60 seconds',
        ],
        viralScore: 87,
        engagementRate: '8.4%',
        bestPostingTime: 'Tuesday & Thursday, 7-9 PM',
        optimizedHashtags: ['#viral', '#fyp', '#trending', `#${niche || 'marketing'}`, '#growthhacks'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleLayout
      title="Viral Content Engine"
      description="Generate viral hooks, predict engagement, and optimize posting"
      actions={<Button onClick={handleGenerate} loading={loading} disabled={!niche}><Flame size={18} /> Generate Content</Button>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <div className="space-y-4">
            <Input label="Niche / Industry" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. fitness, SaaS, food" />
            <Select label="Platform" options={[
              { value: 'tiktok', label: 'TikTok' },
              { value: 'instagram', label: 'Instagram Reels' },
              { value: 'youtube', label: 'YouTube Shorts' },
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'twitter', label: 'X (Twitter)' },
            ]} value={platform} onChange={(e) => setPlatform(e.target.value)} />
            <Input label="Topic (optional)" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Specific topic or trend" />
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <GlassCard className="text-center !p-4">
                  <TrendingUp size={24} className="mx-auto mb-2" style={{ color: 'var(--success)' }} />
                  <p className="text-2xl font-bold">{result.viralScore as number}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Viral Score</p>
                </GlassCard>
                <GlassCard className="text-center !p-4">
                  <Flame size={24} className="mx-auto mb-2" style={{ color: 'var(--warning)' }} />
                  <p className="text-2xl font-bold">{result.engagementRate as string}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Est. Engagement</p>
                </GlassCard>
                <GlassCard className="text-center !p-4">
                  <Clock size={24} className="mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
                  <p className="text-sm font-bold">{result.bestPostingTime as string}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Best Time</p>
                </GlassCard>
              </div>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3">Viral Hooks</h4>
                <div className="space-y-2">
                  {(result.hooks as string[])?.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl flex gap-3" style={{ background: 'var(--bg-secondary)' }}>
                      <span className="badge badge-primary flex-shrink-0">{i + 1}</span>
                      <p className="text-sm">{h}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3">Content Ideas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(result.contentIdeas as string[])?.map((idea, i) => (
                    <div key={i} className="p-3 rounded-xl text-sm" style={{ background: 'var(--bg-secondary)' }}>{idea}</div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <div className="flex items-center gap-2 mb-3"><Hash size={18} /><h4 className="font-semibold">Optimized Hashtags</h4></div>
                <div className="flex flex-wrap gap-2">
                  {(result.optimizedHashtags as string[])?.map((h, i) => (
                    <span key={i} className="badge badge-primary">{h}</span>
                  ))}
                </div>
              </GlassCard>
            </>
          ) : (
            <GlassCard hover={false} className="text-center py-20">
              <Flame size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--text-muted)' }}>Enter your niche to generate viral content ideas</p>
            </GlassCard>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
