import { UserProfile } from '@/store/slices/authSlice';

export const DEMO_MODE_KEY = 'demoMode';

export const DEMO_USER: UserProfile = {
  uid: 'demo-user',
  email: 'demo@aigrowthos.com',
  displayName: 'Demo User',
  role: 'agency',
  tenantId: 'tenant-demo-agency',
  tenantName: 'Demo Marketing Agency',
  company: 'Demo Marketing Agency',
  industry: 'marketing',
  createdAt: new Date().toISOString(),
};

export const isDemoModeActive = (): boolean =>
  localStorage.getItem(DEMO_MODE_KEY) === 'true';

export const enableDemoMode = (): void => {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
  localStorage.removeItem('authToken');
};

export const disableDemoMode = (): void => {
  localStorage.removeItem(DEMO_MODE_KEY);
};
