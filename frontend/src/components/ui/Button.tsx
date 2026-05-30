import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'neon' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'neon',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    neon: 'btn-neon',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent border-none text-[var(--text-secondary)] hover:text-[var(--text-color)] hover:bg-[var(--card-bg)] rounded-xl px-4 py-2 transition-all',
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} inline-flex items-center justify-center gap-2`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : variant === 'neon' ? (
        <span>{children}</span>
      ) : (
        children
      )}
    </button>
  );
}
