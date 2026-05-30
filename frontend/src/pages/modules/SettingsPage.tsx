import { useAppSelector } from '@/store/hooks';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { User, Bell, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <ModuleLayout title="Settings" description="Manage your account and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4"><User size={18} /><h3 className="font-semibold">Profile</h3></div>
          <div className="space-y-4">
            <Input label="Display Name" defaultValue={user?.displayName || ''} />
            <Input label="Email" defaultValue={user?.email || ''} disabled />
            <Input label="Company" defaultValue={user?.company || ''} />
            <Select label="Role" options={[
              { value: 'client', label: 'Client' },
              { value: 'agency', label: 'Agency' },
              { value: 'influencer', label: 'Influencer' },
              { value: 'admin', label: 'Admin' },
            ]} value={user?.role || 'client'} disabled />
            <Button>Save Profile</Button>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4"><Shield size={18} /><h3 className="font-semibold">Theme</h3></div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Switch themes instantly — no page reload required
          </p>
          <ThemeSwitcher />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4"><Globe size={18} /><h3 className="font-semibold">Language</h3></div>
          <Select label="Default Language" options={[
            { value: 'en', label: 'English' },
            { value: 'ur', label: 'Urdu' },
            { value: 'ar', label: 'Arabic' },
            { value: 'hi', label: 'Hindi' },
          ]} defaultValue="en" />
        </GlassCard>

        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4"><Bell size={18} /><h3 className="font-semibold">Notifications</h3></div>
          <div className="space-y-3">
            {['Campaign updates', 'New leads', 'Influencer responses', 'Weekly reports'].map((item) => (
              <label key={item} className="flex items-center justify-between p-3 rounded-xl cursor-pointer" style={{ background: 'var(--bg-secondary)' }}>
                <span className="text-sm">{item}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--primary-color)]" />
              </label>
            ))}
          </div>
        </GlassCard>
      </div>
    </ModuleLayout>
  );
}
