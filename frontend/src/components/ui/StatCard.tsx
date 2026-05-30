import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor,
}: StatCardProps) {
  const changeColors = {
    positive: 'var(--success)',
    negative: 'var(--error)',
    neutral: 'var(--text-muted)',
  };

  return (
    <div className="glass-card p-5 gradient-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{title}</p>
          <p className="text-2xl font-bold mt-1 font-display">{value}</p>
          {change && (
            <p className="text-xs mt-1" style={{ color: changeColors[changeType] }}>
              {change}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-xl"
          style={{ background: `${iconColor || 'var(--primary-color)'}20` }}
        >
          <Icon size={22} style={{ color: iconColor || 'var(--primary-color)' }} />
        </div>
      </div>
    </div>
  );
}
