import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input ref={ref} className={`input-glass ${className}`} {...props} />
      {error && <p className="text-xs" style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
export default Input;
