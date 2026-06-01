import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { disableDemoMode } from '@/lib/demo';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { markNotificationRead } from '@/store/slices/dashboardSlice';
import { setActiveTenant } from '@/store/slices/tenantSlice';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Select from '@/components/ui/Select';
import { ROLE_LABELS } from '@/lib/rbac';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const isDemoMode = useAppSelector((s) => s.auth.isDemoMode);
  const notifications = useAppSelector((s) => s.dashboard.notifications);
  const sidebarOpen = useAppSelector((s) => s.dashboard.sidebarOpen);
  const tenants = useAppSelector((s) => s.tenant.tenants);
  const activeTenantId = useAppSelector((s) => s.tenant.activeTenantId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    if (isDemoMode) {
      disableDemoMode();
      dispatch(logout());
      navigate('/login');
      return;
    }
    try {
      await signOut(auth);
    } catch {
      // Firebase may be unavailable
    }
    disableDemoMode();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 border-b transition-all duration-300"
      style={{
        left: sidebarOpen ? '256px' : '72px',
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div>
        {isDemoMode && (
          <span className="badge badge-primary text-xs">Demo Mode</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {tenants.length > 1 && (
          <div className="w-44 hidden md:block">
            <Select
              aria-label="Workspace"
              options={tenants.map((tenant) => ({ value: tenant.id, label: tenant.name }))}
              value={activeTenantId || undefined}
              onChange={(e) => dispatch(setActiveTenant(e.target.value))}
            />
          </div>
        )}
        <ThemeSwitcher />

        <div className="relative group">
          <button className="relative p-2 rounded-xl hover:bg-[var(--card-bg-hover)] transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold"
                style={{ background: 'var(--primary-color)' }}>
                {unreadCount}
              </span>
            )}
          </button>
          <div className="absolute right-0 top-full mt-2 w-80 glass-card p-2 hidden group-hover:block z-50">
            <p className="text-xs px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>
              Notifications
            </p>
            {notifications.slice(0, 5).map((n) => (
              <button
                key={n.id}
                onClick={() => dispatch(markNotificationRead(n.id))}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[var(--card-bg-hover)] transition-colors"
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.message}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: 'var(--border-color)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--primary-color)' }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <User size={16} className="text-white" />
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
              {isDemoMode ? 'demo' : (user?.role ? ROLE_LABELS[user.role] : 'User')}
            </p>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-[var(--card-bg-hover)] transition-colors ml-1"
            title={isDemoMode ? 'Exit Demo' : 'Logout'}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
