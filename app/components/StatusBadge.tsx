import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const styles: Record<string, string> = {
    'Processing': 'bg-blue-100 text-blue-700 border-blue-300',
    'Ready': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Verified': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Low Stock': 'bg-orange-100 text-orange-700 border-orange-300',
    'Growth': 'bg-jozi-gold text-white border-jozi-gold',
    'In Transit': 'bg-blue-100 text-blue-700 border-blue-300',
    'Scheduled': 'bg-purple-100 text-purple-700 border-purple-300',
    'Active': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Open': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'Closed': 'bg-red-100 text-red-700 border-red-300',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-300',
    'Cancelled': 'bg-red-100 text-red-700 border-red-300',
    'Returned': 'bg-gray-200 text-gray-800 border-gray-400',
    'Return in Progress': 'bg-orange-100 text-orange-700 border-orange-300',
    'Refund Pending': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Refunded': 'bg-emerald-100 text-emerald-700 border-emerald-300',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border inline-block ${styles[status] || 'bg-gray-200 text-gray-800 border-gray-400'} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;