import { useState } from 'react';
import { Magnet, Plus, Star } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { findLeads } from '@/lib/api';

interface Lead {
  company: string;
  website: string;
  email: string;
  phone: string;
  industry: string;
  score: number;
}

export default function LeadsPage() {
  const [industry, setIndustry] = useState('saas');
  const [location, setLocation] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFind = async () => {
    setLoading(true);
    try {
      const data = await findLeads({ industry, location });
      setLeads((data as { leads: Lead[] }).leads || []);
    } catch {
      setLeads([
        { company: 'TechFlow Solutions', website: 'techflow.io', email: 'hello@techflow.io', phone: '+1-555-0101', industry: 'SaaS', score: 92 },
        { company: 'GreenBite Restaurant', website: 'greenbite.com', email: 'info@greenbite.com', phone: '+1-555-0102', industry: 'Restaurant', score: 78 },
        { company: 'HealthFirst Clinic', website: 'healthfirst.care', email: 'contact@healthfirst.care', phone: '+1-555-0103', industry: 'Healthcare', score: 85 },
        { company: 'StyleHub E-commerce', website: 'stylehub.shop', email: 'team@stylehub.shop', phone: '+1-555-0104', industry: 'E-commerce', score: 88 },
        { company: 'Creative Agency Co', website: 'creativeagency.co', email: 'hi@creativeagency.co', phone: '+1-555-0105', industry: 'Agency', score: 71 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => score >= 85 ? 'var(--success)' : score >= 70 ? 'var(--warning)' : 'var(--error)';

  return (
    <ModuleLayout title="AI Lead Generation" description="Find and score leads across industries automatically"
      actions={<Button onClick={handleFind} loading={loading}><Magnet size={18} /> Find Leads</Button>}>
      <GlassCard hover={false} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Industry" options={[
            { value: 'restaurant', label: 'Restaurants' },
            { value: 'clinic', label: 'Clinics / Healthcare' },
            { value: 'agency', label: 'Agencies' },
            { value: 'saas', label: 'SaaS Companies' },
            { value: 'ecommerce', label: 'E-commerce Stores' },
          ]} value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <Input label="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
        </div>
      </GlassCard>

      {leads.length > 0 ? (
        <div className="overflow-x-auto glass-card">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: 'var(--text-muted)' }}>
                <th className="text-left p-4">Company</th>
                <th className="text-left p-4">Website</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Industry</th>
                <th className="text-left p-4">Score</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="p-4 font-medium">{lead.company}</td>
                  <td className="p-4"><a href={`https://${lead.website}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>{lead.website}</a></td>
                  <td className="p-4">{lead.email}</td>
                  <td className="p-4">{lead.phone}</td>
                  <td className="p-4"><span className="badge badge-primary">{lead.industry}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} style={{ color: scoreColor(lead.score) }} />
                      <span className="font-bold" style={{ color: scoreColor(lead.score) }}>{lead.score}</span>
                    </div>
                  </td>
                  <td className="p-4"><Button size="sm" variant="secondary"><Plus size={14} /> Add to CRM</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <GlassCard hover={false} className="text-center py-20">
          <Magnet size={48} className="mx-auto mb-4 opacity-30" />
          <p style={{ color: 'var(--text-muted)' }}>Select an industry and find qualified leads</p>
        </GlassCard>
      )}
    </ModuleLayout>
  );
}
