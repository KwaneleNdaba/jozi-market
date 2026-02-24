import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  description?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, prefix, suffix, className = '', ...props }, ref) => {
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
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm font-medium">{prefix}</span>
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full rounded-lg border px-3 py-2 text-sm shadow-sm
              text-gray-900
              bg-white
              transition-colors duration-150
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${prefix ? 'pl-8' : ''}
              ${suffix ? 'pr-16' : ''}
              ${error 
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' 
                : 'border-gray-300 focus:border-[var(--jozi-forest)] focus:ring-[var(--jozi-forest)]'
              }
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-xs">{suffix}</span>
            </div>
          )}
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

Input.displayName = 'Input';
