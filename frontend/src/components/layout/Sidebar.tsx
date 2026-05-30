import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Brain, Rocket, Video, Flame, Users, Mail,
  Magnet, Kanban, Share2, Search, Swords, BarChart3, Globe,
  Bot, FileText, Settings, ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/dashboardSlice';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/business-brain', icon: Brain, label: 'AI Business Brain' },
  { path: '/campaign', icon: Rocket, label: 'One-Click Campaign' },
  { path: '/video-creator', icon: Video, label: 'AI Video Creator' },
  { path: '/viral-content', icon: Flame, label: 'Viral Content Engine' },
  { path: '/influencers', icon: Users, label: 'Influencer Discovery' },
  { path: '/outreach', icon: Mail, label: 'Outreach Automation' },
  { path: '/leads', icon: Magnet, label: 'Lead Generation' },
  { path: '/crm', icon: Kanban, label: 'CRM Pipeline' },
  { path: '/social', icon: Share2, label: 'Social Manager' },
  { path: '/seo', icon: Search, label: 'AI SEO Engine' },
  { path: '/competitor', icon: Swords, label: 'Competitor Analysis' },
  { path: '/analytics', icon: BarChart3, label: 'ROI Analytics' },
  { path: '/autopilot', icon: Bot, label: 'AI Autopilot' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/client-portal', icon: Globe, label: 'Client Portal' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.dashboard.sidebarOpen);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 flex flex-col border-r ${
        sidebarOpen ? 'w-64' : 'w-[72px]'
      }`}
      style={{
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="w-10 h-10 rounded-xl bg-animated flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="min-w-0">
            <h1 className="font-display font-bold text-sm truncate">AI Growth OS</h1>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>Marketing Studio</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'nav-link-active' : 'hover:bg-[var(--card-bg-hover)]'
              } ${!sidebarOpen ? 'justify-center' : ''}`
            }
            style={({ isActive }) => ({
              color: isActive ? undefined : 'var(--text-secondary)',
            })}
            title={!sidebarOpen ? label : undefined}
          >
            <Icon size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-4 border-t flex items-center justify-center hover:bg-[var(--card-bg-hover)] transition-colors"
        style={{ borderColor: 'var(--border-color)' }}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </aside>
  );
}
