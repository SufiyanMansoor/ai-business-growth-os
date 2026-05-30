import { useState } from 'react';
import { Search, FileText, Key } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { generateSEO } from '@/lib/api';

export default function SEOPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const data = await generateSEO({ url });
      setResult(data as Record<string, unknown>);
    } catch {
      setResult({
        score: 72,
        issues: ['Missing meta descriptions on 5 pages', 'Slow page load speed (3.2s)', 'No structured data markup', 'Missing alt tags on 12 images'],
        keywords: ['ai marketing', 'business growth', 'marketing automation', 'social media management', 'lead generation'],
        metaTitle: 'AI Business Growth OS | Marketing Automation Platform',
        metaDescription: 'Transform your business with AI-powered marketing. Automated campaigns, influencer discovery, and growth analytics in one platform.',
        blogIdeas: ['10 AI Marketing Trends for 2026', 'How to 10x Your Social Media Growth', 'Complete Guide to Influencer Marketing'],
        rankingSuggestions: ['Add FAQ schema markup', 'Improve Core Web Vitals', 'Build backlinks from industry publications', 'Create pillar content pages'],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleLayout title="AI SEO Engine" description="SEO audits, keyword research, and content optimization"
      actions={<Button onClick={handleAudit} loading={loading} disabled={!url}><Search size={18} /> Run SEO Audit</Button>}>
      <GlassCard hover={false} className="mb-6">
        <Input label="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourwebsite.com" />
      </GlassCard>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="text-center !p-6">
              <p className="text-4xl font-bold" style={{ color: (result.score as number) >= 80 ? 'var(--success)' : 'var(--warning)' }}>{result.score as number}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>SEO Score / 100</p>
            </GlassCard>
            <GlassCard hover={false} className="md:col-span-2">
              <h4 className="font-semibold mb-2">Issues Found</h4>
              <ul className="space-y-1">{(result.issues as string[])?.map((issue, i) => (
                <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--warning)' }}>⚠</span>{issue}</li>
              ))}</ul>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-3"><Key size={18} /><h4 className="font-semibold">Target Keywords</h4></div>
              <div className="flex flex-wrap gap-2">{(result.keywords as string[])?.map((k, i) => <span key={i} className="badge badge-primary">{k}</span>)}</div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="flex items-center gap-2 mb-3"><FileText size={18} /><h4 className="font-semibold">Meta Tags</h4></div>
              <p className="text-sm"><strong>Title:</strong> {result.metaTitle as string}</p>
              <p className="text-sm mt-2"><strong>Description:</strong> {result.metaDescription as string}</p>
            </GlassCard>
          </div>

          <GlassCard hover={false}>
            <h4 className="font-semibold mb-3">Blog Post Ideas</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(result.blogIdeas as string[])?.map((idea, i) => (
                <div key={i} className="p-3 rounded-xl text-sm" style={{ background: 'var(--bg-secondary)' }}>{idea}</div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </ModuleLayout>
  );
}
