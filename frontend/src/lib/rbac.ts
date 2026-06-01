import type { UserRole } from '@/store/slices/authSlice';

export type AppRoute =
  | '/dashboard'
  | '/business-brain'
  | '/campaign'
  | '/video-creator'
  | '/viral-content'
  | '/influencers'
  | '/outreach'
  | '/leads'
  | '/crm'
  | '/social'
  | '/seo'
  | '/competitor'
  | '/analytics'
  | '/autopilot'
  | '/reports'
  | '/client-portal'
  | '/settings';

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  sales: 'Sales',
  marketing: 'Marketing',
  viewer: 'Viewer',
  agency: 'Agency',
  client: 'Client',
  influencer: 'Influencer',
};

export const ROUTE_ROLE_RULES: Record<AppRoute, UserRole[]> = {
  '/dashboard': ['owner', 'admin', 'manager', 'sales', 'marketing', 'viewer', 'agency', 'client', 'influencer'],
  '/business-brain': ['owner', 'admin', 'manager', 'marketing', 'agency', 'client'],
  '/campaign': ['owner', 'admin', 'manager', 'marketing', 'agency'],
  '/video-creator': ['owner', 'admin', 'manager', 'marketing', 'agency', 'influencer'],
  '/viral-content': ['owner', 'admin', 'manager', 'marketing', 'agency', 'influencer'],
  '/influencers': ['owner', 'admin', 'manager', 'marketing', 'agency'],
  '/outreach': ['owner', 'admin', 'manager', 'sales', 'marketing', 'agency'],
  '/leads': ['owner', 'admin', 'manager', 'sales', 'agency'],
  '/crm': ['owner', 'admin', 'manager', 'sales', 'agency', 'client'],
  '/social': ['owner', 'admin', 'manager', 'marketing', 'agency', 'influencer'],
  '/seo': ['owner', 'admin', 'manager', 'marketing', 'agency'],
  '/competitor': ['owner', 'admin', 'manager', 'marketing', 'agency'],
  '/analytics': ['owner', 'admin', 'manager', 'sales', 'marketing', 'agency', 'client'],
  '/autopilot': ['owner', 'admin', 'manager', 'agency'],
  '/reports': ['owner', 'admin', 'manager', 'agency', 'client'],
  '/client-portal': ['owner', 'admin', 'manager', 'agency', 'client'],
  '/settings': ['owner', 'admin'],
};

export function hasRequiredRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function canAccessRoute(userRole: UserRole | undefined, path: AppRoute): boolean {
  return hasRequiredRole(userRole, ROUTE_ROLE_RULES[path]);
}
