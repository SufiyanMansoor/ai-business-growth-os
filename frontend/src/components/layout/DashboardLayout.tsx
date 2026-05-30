import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DemoBanner from '@/components/DemoBanner';
import { useAppSelector } from '@/store/hooks';

export default function DashboardLayout() {
  const sidebarOpen = useAppSelector((s) => s.dashboard.sidebarOpen);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'var(--bg-color)' }} />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
          style={{ background: 'var(--primary-color)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl animate-float"
          style={{ background: 'var(--accent-color)', animationDelay: '3s' }}
        />
      </div>

      <Sidebar />
      <Navbar />

      <main
        className="pt-16 min-h-screen transition-all duration-300 p-6"
        style={{ marginLeft: sidebarOpen ? '256px' : '72px' }}
      >
        <DemoBanner />
        <Outlet />
      </main>
    </div>
  );
}
