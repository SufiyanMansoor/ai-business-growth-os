import { ReactNode } from 'react';

interface ModuleLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ModuleLayout({ title, description, children, actions }: ModuleLayoutProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">{title}</h1>
          {description && (
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
