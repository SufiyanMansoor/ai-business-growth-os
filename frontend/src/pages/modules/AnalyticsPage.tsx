import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, Users, Award } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import StatCard from '@/components/ui/StatCard';

const roiData = [
  { month: 'Jan', cost: 2000, revenue: 5200, roi: 160 },
  { month: 'Feb', cost: 2500, revenue: 7800, roi: 212 },
  { month: 'Mar', cost: 3000, revenue: 9500, roi: 217 },
  { month: 'Apr', cost: 2800, revenue: 11200, roi: 300 },
  { month: 'May', cost: 3500, revenue: 15800, roi: 351 },
];

const contentPerformance = [
  { name: 'Instagram Reels', engagement: 8.2, conversions: 45 },
  { name: 'TikTok Videos', engagement: 12.1, conversions: 62 },
  { name: 'LinkedIn Posts', engagement: 4.5, conversions: 28 },
  { name: 'Email Campaigns', engagement: 22.3, conversions: 89 },
  { name: 'Blog Posts', engagement: 3.1, conversions: 15 },
];

const influencerROI = [
  { name: '@sarahcreates', spent: 500, revenue: 2400, roi: 380 },
  { name: '@mikegrows', spent: 300, revenue: 1800, roi: 500 },
  { name: '@aishabiz', spent: 800, revenue: 3200, roi: 300 },
  { name: '@jamesdigital', spent: 200, revenue: 1200, roi: 500 },
];

export default function AnalyticsPage() {
  return (
    <ModuleLayout title="ROI & Analytics Engine" description="Track campaign performance, conversions, and return on investment">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total ROI" value="351%" change="+51% vs last month" changeType="positive" icon={TrendingUp} />
        <StatCard title="Campaign Spend" value="$3,500" change="May 2026" changeType="neutral" icon={DollarSign} iconColor="var(--warning)" />
        <StatCard title="Leads Generated" value="224" change="+38% this month" changeType="positive" icon={Users} iconColor="var(--accent-color)" />
        <StatCard title="Best Performer" value="TikTok" change="12.1% engagement" changeType="positive" icon={Award} iconColor="var(--success)" />
      </div>

      <GlassCard hover={false}>
        <h3 className="text-lg font-semibold mb-4">ROI Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={roiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
            <YAxis stroke="var(--text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="var(--error)" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="var(--success)" strokeWidth={2} />
            <Line type="monotone" dataKey="roi" stroke="var(--primary-color)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={contentPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} width={100} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Bar dataKey="engagement" fill="var(--primary-color)" radius={[0, 4, 4, 0]} name="Engagement %" />
              <Bar dataKey="conversions" fill="var(--accent-color)" radius={[0, 4, 4, 0]} name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold mb-4">Influencer ROI</h3>
          <div className="space-y-3">
            {influencerROI.map((inf, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex-1">
                  <p className="font-medium text-sm">{inf.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Spent: ${inf.spent} → Revenue: ${inf.revenue}</p>
                </div>
                <span className="badge badge-success">{inf.roi}% ROI</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </ModuleLayout>
  );
}
