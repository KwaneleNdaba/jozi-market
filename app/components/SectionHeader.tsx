import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  sub: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, sub, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="text-left space-y-1">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-5 h-5 text-jozi-gold" />}
        <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">{title}</h3>
      </div>
      <p className="text-gray-400 text-xs font-medium italic">{sub}</p>
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default SectionHeader;