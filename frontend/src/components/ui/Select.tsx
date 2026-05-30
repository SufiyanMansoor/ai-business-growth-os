import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <select ref={ref} className={`input-glass cursor-pointer ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-secondary)' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
);

Select.displayName = 'Select';
export default Select;
