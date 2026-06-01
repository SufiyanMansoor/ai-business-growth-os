import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  DollarSign, Target, Megaphone, Heart, Activity,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';
import ModuleLayout from '@/components/ui/ModuleLayout';
import { useAppSelector } from '@/store/hooks';
import { DEMO_WIDGETS_BY_TENANT } from '@/lib/demoTenantSeed';

const revenueData = [
  { month: 'Jan', revenue: 4200, leads: 120 },
  { month: 'Feb', revenue: 5800, leads: 180 },
  { month: 'Mar', revenue: 7200, leads: 240 },
  { month: 'Apr', revenue: 9100, leads: 310 },
  { month: 'May', revenue: 12400, leads: 420 },
  { month: 'Jun', revenue: 15800, leads: 520 },
];

const campaignData = [
  { name: 'Instagram', value: 35, color: 'var(--primary-color)' },
  { name: 'TikTok', value: 28, color: 'var(--accent-color)' },
  { name: 'LinkedIn', value: 20, color: 'var(--success)' },
  { name: 'Email', value: 17, color: 'var(--warning)' },
];

const engagementData = [
  { day: 'Mon', rate: 4.2 },
  { day: 'Tue', rate: 5.1 },
  { day: 'Wed', rate: 3.8 },
  { day: 'Thu', rate: 6.2 },
  { day: 'Fri', rate: 5.8 },
  { day: 'Sat', rate: 7.1 },
  { day: 'Sun', rate: 6.5 },
];

const activeCampaigns = [
  { name: 'Summer Sale 2026', platform: 'Instagram', status: 'Active', roi: '+245%', budget: '$2,500' },
  { name: 'Product Launch', platform: 'TikTok', status: 'Active', roi: '+180%', budget: '$1,800' },
  { name: 'B2B Outreach', platform: 'LinkedIn', status: 'Paused', roi: '+92%', budget: '$900' },
  { name: 'Email Nurture', platform: 'Email', status: 'Active', roi: '+310%', budget: '$500' },
];

const activityFeed = [
  { action: 'Campaign "Summer Sale" reached 10K impressions', time: '2 min ago', type: 'success' },
  { action: 'New lead: TechCorp Solutions added to pipeline', time: '15 min ago', type: 'info' },
  { action: 'AI generated 10 Instagram posts for review', time: '1 hour ago', type: 'info' },
  { action: 'Influencer @creator123 accepted collaboration', time: '3 hours ago', type: 'success' },
  { action: 'ROI report for Q2 ready for download', time: '5 hours ago', type: 'warning' },
];

export default function DashboardPage() {
  const activeTenantId = useAppSelector((s) => s.tenant.activeTenantId) || 'tenant-demo-agency';
  const widgets = DEMO_WIDGETS_BY_TENANT[activeTenantId] || DEMO_WIDGETS_BY_TENANT['tenant-demo-agency'];

  const widgetIconMap = {
    revenue: DollarSign,
    campaigns: Megaphone,
    leads: Target,
    engagement: Heart,
  };

  return (
    <ModuleLayout
      title="Dashboard"
      description="Your business growth command center"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget) => (
          <StatCard
            key={widget.id}
            title={widget.title}
            value={widget.value}
            change={widget.change}
            changeType={widget.changeType}
            icon={widgetIconMap[widget.icon]}
            iconColor={
              widget.icon === 'campaigns'
                ? 'var(--accent-color)'
                : widget.icon === 'leads'
                  ? 'var(--success)'
                  : widget.icon === 'engagement'
                    ? 'var(--warning)'
                    : undefined
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" hover={false}>
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary-color)" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold mb-4">Campaign Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={campaignData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                {campaignData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold mb-4">Engagement Rate</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="rate" stroke="var(--accent-color)" strokeWidth={2} dot={{ fill: 'var(--accent-color)' }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold mb-4">Lead Analytics</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Bar dataKey="leads" fill="var(--primary-color)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Campaigns</h3>
            <span className="badge badge-primary">{activeCampaigns.length} active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-3 px-2">Campaign</th>
                  <th className="text-left py-3 px-2">Platform</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">ROI</th>
                  <th className="text-left py-3 px-2">Budget</th>
                </tr>
              </thead>
              <tbody>
                {activeCampaigns.map((c, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="py-3 px-2 font-medium">{c.name}</td>
                    <td className="py-3 px-2">{c.platform}</td>
                    <td className="py-3 px-2">
                      <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span>
                    </td>
                    <td className="py-3 px-2" style={{ color: 'var(--success)' }}>{c.roi}</td>
                    <td className="py-3 px-2">{c.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} style={{ color: 'var(--primary-color)' }} />
            <h3 className="text-lg font-semibold">Activity Feed</h3>
          </div>
          <div className="space-y-4">
            {activityFeed.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: item.type === 'success' ? 'var(--success)' : item.type === 'warning' ? 'var(--warning)' : 'var(--primary-color)' }} />
                <div>
                  <p className="text-sm">{item.action}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </ModuleLayout>
  );
}
