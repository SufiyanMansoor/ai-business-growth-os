import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = true, onClick }: GlassCardProps) {
  return (
    <div
      className={`glass-card p-6 ${hover ? '' : 'hover:!transform-none hover:!shadow-[0_8px_32px_var(--shadow-color)]'} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
}
