import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'bronze' | 'silver' | 'gold' | 'platinum';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'error':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getVariantStyles()} ${className}`}>
      {children}
    </span>
  );
};
