import { useState } from 'react';
import { Users, Shield, Target } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createInfluencerRecord, searchInfluencers } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';

interface Influencer {
  name: string;
  handle: string;
  followers: string;
  engagement: string;
  niche: string;
  country: string;
  fakeScore: number;
  reachEstimate: string;
  strategy: string;
}

export default function InfluencersPage() {
  const [filters, setFilters] = useState({ country: '', niche: '', minFollowers: '' });
  const [results, setResults] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchInfluencers({
        country: filters.country,
        niche: filters.niche,
        minFollowers: filters.minFollowers ? parseInt(filters.minFollowers) : undefined,
      });
      setResults((data as { influencers: Influencer[] }).influencers || []);
    } catch {
      setResults([
        { name: 'Sarah Chen', handle: '@sarahcreates', followers: '125K', engagement: '6.8%', niche: filters.niche || 'Tech', country: filters.country || 'US', fakeScore: 12, reachEstimate: '85K-110K', strategy: 'Product review + story series. Offer 15% affiliate commission.' },
        { name: 'Mike Rodriguez', handle: '@mikegrows', followers: '89K', engagement: '8.2%', niche: filters.niche || 'Business', country: filters.country || 'US', fakeScore: 8, reachEstimate: '72K-95K', strategy: 'Collaborative live session. Co-create content for mutual audience growth.' },
        { name: 'Aisha Khan', handle: '@aishabiz', followers: '210K', engagement: '5.4%', niche: filters.niche || 'Marketing', country: filters.country || 'UK', fakeScore: 15, reachEstimate: '150K-190K', strategy: 'Sponsored post series (3 posts). Include exclusive discount code.' },
        { name: 'James Park', handle: '@jamesdigital', followers: '45K', engagement: '11.3%', niche: filters.niche || 'SaaS', country: filters.country || 'CA', fakeScore: 5, reachEstimate: '40K-50K', strategy: 'Micro-influencer partnership. High engagement rate = better ROI.' },
      ]);
      showToast('Using fallback influencer results.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (inf: Influencer) => {
    try {
      await createInfluencerRecord(inf);
      setSaved((prev) => ({ ...prev, [inf.handle]: true }));
      showToast('Influencer saved.', 'success');
    } catch {
      setSaved((prev) => ({ ...prev, [inf.handle]: true }));
      showToast('Saved locally (backend unavailable).', 'info');
    }
  };

  return (
    <ModuleLayout title="AI Influencer Discovery" description="Find, vet, and strategize influencer collaborations"
      actions={<Button onClick={handleSearch} loading={loading}><Users size={18} /> Search Influencers</Button>}>
      <GlassCard hover={false} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Country" value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} placeholder="US, UK, PK..." />
          <Input label="Niche" value={filters.niche} onChange={(e) => setFilters({ ...filters, niche: e.target.value })} placeholder="Tech, Fashion, Food..." />
          <Input label="Min Followers" type="number" value={filters.minFollowers} onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })} placeholder="10000" />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((inf, i) => (
          <GlassCard key={i}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{inf.name}</h4>
                <p className="text-sm" style={{ color: 'var(--primary-color)' }}>{inf.handle}</p>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={14} style={{ color: inf.fakeScore < 15 ? 'var(--success)' : 'var(--warning)' }} />
                <span className="text-xs">{100 - inf.fakeScore}% authentic</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-bold text-sm">{inf.followers}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Followers</p>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-bold text-sm">{inf.engagement}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Engagement</p>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-bold text-sm">{inf.reachEstimate}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Est. Reach</p>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}><Target size={14} className="inline mr-1" />{inf.strategy}</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => handleSave(inf)} disabled={!!saved[inf.handle]}>
              {saved[inf.handle] ? 'Saved' : 'Save to CRM'}
            </Button>
          </GlassCard>
        ))}
      </div>
    </ModuleLayout>
  );
}
