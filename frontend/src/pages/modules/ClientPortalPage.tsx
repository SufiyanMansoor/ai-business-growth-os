import { Eye, Download, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';

const campaigns = [
  { name: 'Summer Sale 2026', status: 'pending_approval', platform: 'Instagram', date: '2026-05-28' },
  { name: 'Product Launch Video', status: 'approved', platform: 'TikTok', date: '2026-05-25' },
  { name: 'B2B LinkedIn Series', status: 'in_review', platform: 'LinkedIn', date: '2026-05-22' },
];

const statusBadge = (status: string) => {
  const map: Record<string, { class: string; label: string }> = {
    pending_approval: { class: 'badge-warning', label: 'Pending Approval' },
    approved: { class: 'badge-success', label: 'Approved' },
    in_review: { class: 'badge-primary', label: 'In Review' },
  };
  return map[status] || { class: 'badge-primary', label: status };
};

export default function ClientPortalPage() {
  return (
    <ModuleLayout title="Client Portal" description="View campaigns, approve content, and download reports">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Active Campaigns" value="3" icon={Eye} />
        <StatCard title="Pending Approval" value="1" icon={Clock} iconColor="var(--warning)" />
        <StatCard title="Approved" value="12" icon={CheckCircle} iconColor="var(--success)" />
      </div>

      <GlassCard hover={false}>
        <h3 className="font-semibold mb-4">Campaigns</h3>
        <div className="space-y-3">
          {campaigns.map((c, i) => {
            const badge = statusBadge(c.status);
            return (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{c.platform} • {c.date}</p>
                </div>
                <span className={`badge ${badge.class}`}>{badge.label}</span>
                <div className="flex gap-2">
                  {c.status === 'pending_approval' && (
                    <>
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="secondary"><MessageSquare size={14} /> Request Changes</Button>
                    </>
                  )}
                  <Button size="sm" variant="secondary"><Download size={14} /> Report</Button>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </ModuleLayout>
  );
}
