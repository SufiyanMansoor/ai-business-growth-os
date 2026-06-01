import type { UserRole } from '@/store/slices/authSlice';

export interface TenantSummary {
  id: string;
  name: string;
  plan: 'starter' | 'growth' | 'scale';
}

export interface TenantMembership {
  tenantId: string;
  role: UserRole;
}

export interface DashboardWidget {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: 'revenue' | 'campaigns' | 'leads' | 'engagement';
}

export const DEMO_TENANTS: TenantSummary[] = [
  { id: 'tenant-demo-agency', name: 'Demo Marketing Agency', plan: 'scale' },
  { id: 'tenant-demo-brand', name: 'Demo D2C Brand', plan: 'growth' },
];

export const DEMO_MEMBERSHIPS: TenantMembership[] = [
  { tenantId: 'tenant-demo-agency', role: 'agency' },
  { tenantId: 'tenant-demo-brand', role: 'marketing' },
];

export const DEMO_WIDGETS_BY_TENANT: Record<string, DashboardWidget[]> = {
  'tenant-demo-agency': [
    { id: 'revenue', title: 'Total Revenue', value: '$15,800', change: '+24.5% vs last month', changeType: 'positive', icon: 'revenue' },
    { id: 'campaigns', title: 'Active Campaigns', value: '12', change: '4 launching this week', changeType: 'neutral', icon: 'campaigns' },
    { id: 'leads', title: 'Total Leads', value: '520', change: '+38% this month', changeType: 'positive', icon: 'leads' },
    { id: 'engagement', title: 'Engagement Rate', value: '6.2%', change: '+1.4% improvement', changeType: 'positive', icon: 'engagement' },
  ],
  'tenant-demo-brand': [
    { id: 'revenue', title: 'Total Revenue', value: '$9,420', change: '+11.2% vs last month', changeType: 'positive', icon: 'revenue' },
    { id: 'campaigns', title: 'Active Campaigns', value: '7', change: '2 launching this week', changeType: 'neutral', icon: 'campaigns' },
    { id: 'leads', title: 'Total Leads', value: '286', change: '+16% this month', changeType: 'positive', icon: 'leads' },
    { id: 'engagement', title: 'Engagement Rate', value: '4.9%', change: '-0.6% this week', changeType: 'negative', icon: 'engagement' },
  ],
};
