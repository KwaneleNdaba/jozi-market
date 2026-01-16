import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const styles: Record<string, string> = {
    'Processing': 'bg-blue-50 text-blue-600 border-blue-100',
    'Ready': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Delivered': 'bg-gray-50 text-gray-400 border-gray-100',
    'Verified': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Low Stock': 'bg-orange-50 text-orange-600 border-orange-100',
    'Growth': 'bg-jozi-gold text-white',
    'In Transit': 'bg-blue-100 text-blue-600 border-blue-200',
    'Scheduled': 'bg-purple-50 text-purple-600 border-purple-100',
    'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Open': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Closed': 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border inline-block ${styles[status] || 'bg-gray-100'} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;