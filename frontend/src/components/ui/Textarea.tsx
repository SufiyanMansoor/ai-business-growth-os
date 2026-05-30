import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`input-glass min-h-[120px] resize-y ${className}`}
        {...props}
      />
      {error && <p className="text-xs" style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  )
);

Textarea.displayName = 'Textarea';
export default Textarea;
