import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  description?: string;
  error?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, description, error, options, onChange, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        {description && (
          <p className="text-xs text-gray-600 mb-2">{description}</p>
        )}
        <div className="relative">
          <select
            ref={ref}
            onChange={(e) => onChange?.(e.target.value)}
            className={`
              block w-full rounded-lg border px-3 py-2 pr-10 text-sm shadow-sm appearance-none
              text-gray-900
              bg-white
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${error 
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' 
                : 'border-gray-300 focus:border-[var(--jozi-forest)] focus:ring-[var(--jozi-forest)]'
              }
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <p className="text-xs text-rose-600">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
