import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary-color)' }} />
      <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  );
}

interface ResultDisplayProps {
  title: string;
  data: unknown;
  children?: ReactNode;
}

export function ResultDisplay({ title, data, children }: ResultDisplayProps) {
  if (!data) return null;

  return (
    <div className="glass-card p-6 space-y-4 animate-slide-up">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children || (
        <pre
          className="text-sm whitespace-pre-wrap overflow-auto max-h-96 p-4 rounded-xl"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--card-bg)' }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
      {action}
    </div>
  );
}
