export type ThemeId = 'dark' | 'light' | 'neon' | 'corporate' | 'viral';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  variables: Record<string, string>;
}

export const themes: ThemeConfig[] = [
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Default premium dark theme',
    icon: '🌙',
    variables: {
      '--bg-color': '#0a0a0f',
      '--bg-secondary': '#12121a',
      '--primary-color': '#6366f1',
      '--accent-color': '#a855f7',
      '--card-bg': 'rgba(255, 255, 255, 0.05)',
      '--card-bg-hover': 'rgba(255, 255, 255, 0.08)',
      '--text-color': '#f8fafc',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#64748b',
      '--border-color': 'rgba(255, 255, 255, 0.1)',
      '--shadow-color': 'rgba(99, 102, 241, 0.2)',
      '--glow-color': 'rgba(99, 102, 241, 0.5)',
      '--gradient-from': '#6366f1',
      '--gradient-via': '#8b5cf6',
      '--gradient-to': '#a855f7',
      '--success': '#22c55e',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--sidebar-bg': 'rgba(10, 10, 15, 0.8)',
      '--navbar-bg': 'rgba(10, 10, 15, 0.6)',
    },
  },
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean professional light theme',
    icon: '☀️',
    variables: {
      '--bg-color': '#f8fafc',
      '--bg-secondary': '#f1f5f9',
      '--primary-color': '#4f46e5',
      '--accent-color': '#7c3aed',
      '--card-bg': 'rgba(255, 255, 255, 0.7)',
      '--card-bg-hover': 'rgba(255, 255, 255, 0.9)',
      '--text-color': '#0f172a',
      '--text-secondary': '#475569',
      '--text-muted': '#94a3b8',
      '--border-color': 'rgba(0, 0, 0, 0.08)',
      '--shadow-color': 'rgba(79, 70, 229, 0.15)',
      '--glow-color': 'rgba(79, 70, 229, 0.3)',
      '--gradient-from': '#4f46e5',
      '--gradient-via': '#6366f1',
      '--gradient-to': '#7c3aed',
      '--success': '#16a34a',
      '--warning': '#d97706',
      '--error': '#dc2626',
      '--sidebar-bg': 'rgba(248, 250, 252, 0.9)',
      '--navbar-bg': 'rgba(248, 250, 252, 0.8)',
    },
  },
  {
    id: 'neon',
    name: 'Neon Marketing',
    description: 'Bold neon marketing vibes',
    icon: '⚡',
    variables: {
      '--bg-color': '#0d0221',
      '--bg-secondary': '#150734',
      '--primary-color': '#00f5ff',
      '--accent-color': '#ff00ff',
      '--card-bg': 'rgba(0, 245, 255, 0.05)',
      '--card-bg-hover': 'rgba(0, 245, 255, 0.1)',
      '--text-color': '#e0f7fa',
      '--text-secondary': '#80deea',
      '--text-muted': '#4dd0e1',
      '--border-color': 'rgba(0, 245, 255, 0.2)',
      '--shadow-color': 'rgba(0, 245, 255, 0.3)',
      '--glow-color': 'rgba(0, 245, 255, 0.6)',
      '--gradient-from': '#00f5ff',
      '--gradient-via': '#bf00ff',
      '--gradient-to': '#ff00ff',
      '--success': '#00e676',
      '--warning': '#ffea00',
      '--error': '#ff1744',
      '--sidebar-bg': 'rgba(13, 2, 33, 0.9)',
      '--navbar-bg': 'rgba(13, 2, 33, 0.7)',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional enterprise look',
    icon: '🏢',
    variables: {
      '--bg-color': '#0f1419',
      '--bg-secondary': '#1a2332',
      '--primary-color': '#2563eb',
      '--accent-color': '#0ea5e9',
      '--card-bg': 'rgba(37, 99, 235, 0.06)',
      '--card-bg-hover': 'rgba(37, 99, 235, 0.1)',
      '--text-color': '#e2e8f0',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#64748b',
      '--border-color': 'rgba(37, 99, 235, 0.15)',
      '--shadow-color': 'rgba(37, 99, 235, 0.2)',
      '--glow-color': 'rgba(37, 99, 235, 0.4)',
      '--gradient-from': '#1e40af',
      '--gradient-via': '#2563eb',
      '--gradient-to': '#0ea5e9',
      '--success': '#059669',
      '--warning': '#d97706',
      '--error': '#dc2626',
      '--sidebar-bg': 'rgba(15, 20, 25, 0.95)',
      '--navbar-bg': 'rgba(15, 20, 25, 0.85)',
    },
  },
  {
    id: 'viral',
    name: 'Viral Creator',
    description: 'Creator-focused vibrant theme',
    icon: '🔥',
    variables: {
      '--bg-color': '#1a0a0a',
      '--bg-secondary': '#2d1515',
      '--primary-color': '#ff4757',
      '--accent-color': '#ffa502',
      '--card-bg': 'rgba(255, 71, 87, 0.08)',
      '--card-bg-hover': 'rgba(255, 71, 87, 0.12)',
      '--text-color': '#fff5f5',
      '--text-secondary': '#fecaca',
      '--text-muted': '#f87171',
      '--border-color': 'rgba(255, 71, 87, 0.2)',
      '--shadow-color': 'rgba(255, 71, 87, 0.25)',
      '--glow-color': 'rgba(255, 71, 87, 0.5)',
      '--gradient-from': '#ff4757',
      '--gradient-via': '#ff6348',
      '--gradient-to': '#ffa502',
      '--success': '#2ed573',
      '--warning': '#ffa502',
      '--error': '#ff4757',
      '--sidebar-bg': 'rgba(26, 10, 10, 0.9)',
      '--navbar-bg': 'rgba(26, 10, 10, 0.75)',
    },
  },
];

export const getTheme = (id: ThemeId): ThemeConfig =>
  themes.find((t) => t.id === id) ?? themes[0];

export const applyTheme = (themeId: ThemeId): void => {
  const theme = getTheme(themeId);
  const root = document.documentElement;
  Object.entries(theme.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.setAttribute('data-theme', themeId);
  localStorage.setItem('theme', themeId);
};

export const getStoredTheme = (): ThemeId => {
  const stored = localStorage.getItem('theme') as ThemeId | null;
  if (stored && themes.some((t) => t.id === stored)) return stored;
  return 'dark';
};
