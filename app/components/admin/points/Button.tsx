import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, icon, className = '', disabled, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return 'bg-[var(--jozi-forest)] text-white hover:bg-[var(--jozi-forest-dark)] shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed';
        case 'secondary':
          return 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed';
        case 'ghost':
          return 'bg-transparent text-gray-700 hover:bg-gray-100 disabled:bg-transparent disabled:cursor-not-allowed';
        case 'danger':
          return 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed';
        default:
          return '';
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1.5 text-sm';
        case 'md':
          return 'px-4 py-2 text-sm';
        case 'lg':
          return 'px-6 py-3 text-base';
        default:
          return '';
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-medium
          transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--jozi-forest)]
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${className}
        `}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
