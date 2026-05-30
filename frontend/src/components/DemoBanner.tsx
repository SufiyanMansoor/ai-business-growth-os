import { Sparkles } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export default function DemoBanner() {
  const isDemoMode = useAppSelector((s) => s.auth.isDemoMode);

  if (!isDemoMode) return null;

  return (
    <div
      className="mb-4 flex items-center gap-3 px-4 py-2.5 rounded-xl border animate-fade-in"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
        borderColor: 'var(--primary-color)',
      }}
    >
      <Sparkles size={18} style={{ color: 'var(--primary-color)' }} />
      <p className="text-sm">
        <span className="font-semibold">Demo Mode</span>
        <span style={{ color: 'var(--text-secondary)' }}> — Login ki zaroorat nahi. Saari features explore karein!</span>
      </p>
      <span className="badge badge-primary ml-auto hidden sm:inline">No Login Required</span>
    </div>
  );
}
