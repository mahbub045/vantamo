import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, options, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{label}</label>}
    <select
      ref={ref}
      className={`w-full h-10 px-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] transition-all duration-200 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)] appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
));

Select.displayName = 'Select';
export default Select;
