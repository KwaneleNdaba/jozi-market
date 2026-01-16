import React from 'react';

interface BadgeProps {
  status: string;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    'Active': 'bg-blue-50 text-blue-600 border-blue-100',
    'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${styles[status] || 'bg-gray-50 text-gray-500'}`}>
      {status}
    </span>
  );
};

export default Badge;