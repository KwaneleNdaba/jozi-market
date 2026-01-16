import React from 'react';
import { motion } from 'framer-motion';
// Added missing RefreshCw to imports
import { Flame, MoreVertical, Play, Pause, Edit3, Trash2, TrendingUp, Users, Target, RefreshCw } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import SectionHeader from '../SectionHeader';

const MOCK_CAMPAIGNS = [
  { id: 'c1', name: 'Spring Shweshwe Flash', type: 'Voucher', status: 'Active', reach: '4.2k', ctr: '12%', conversion: '8%', revenue: 'R12,450', color: 'bg-emerald-500' },
  { id: 'c2', name: 'Zebu Wallet Video Ad', type: 'Sponsored Video', status: 'Active', reach: '8.1k', ctr: '8%', conversion: '4%', revenue: 'R8,100', color: 'bg-jozi-gold' },
  { id: 'c3', name: 'Heritage Month Early Bird', type: 'Featured Store', status: 'Scheduled', reach: '0', ctr: '0%', conversion: '0%', revenue: 'R0', color: 'bg-blue-500' },
  { id: 'c4', name: 'Winter Wrap Clearance', type: 'Discount Code', status: 'Expired', reach: '12.4k', ctr: '15%', conversion: '12%', revenue: 'R42,100', color: 'bg-gray-400' },
];

const MarketingActive: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Ongoing Strategy" 
        sub="Monitor and manage your live marketing efforts across the platform." 
        icon={Flame}
      />

      <div className="grid grid-cols-1 gap-6">
        {MOCK_CAMPAIGNS.map((campaign, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={campaign.id}
            className="bg-white rounded-[2.5rem] p-8 border border-jozi-forest/5 shadow-soft hover:shadow-lg transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                <div className={`w-3 h-16 rounded-full ${campaign.color}`} />
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="text-xl font-black text-jozi-forest">{campaign.name}</h4>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{campaign.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-grow max-w-3xl">
                {[
                  { label: 'Reach', val: campaign.reach, icon: Users },
                  { label: 'CTR', val: campaign.ctr, icon: MousePointer2 },
                  { label: 'Conv.', val: campaign.conversion, icon: Target },
                  { label: 'Revenue', val: campaign.revenue, icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">{stat.label}</p>
                    <p className="font-black text-jozi-dark text-lg">{stat.val}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                {campaign.status === 'Active' ? (
                  <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-colors" title="Pause">
                    <Pause className="w-5 h-5" />
                  </button>
                ) : campaign.status === 'Scheduled' ? (
                  <button className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl hover:bg-emerald-100 transition-colors" title="Start Now">
                    <Play className="w-5 h-5" />
                  </button>
                ) : null}
                <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-colors">
                  <Edit3 className="w-5 h-5" />
                </button>
                <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="p-4 text-gray-300">
                   <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-jozi-cream/50 rounded-[3rem] border border-jozi-forest/5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <div className="p-3 bg-white rounded-2xl text-jozi-gold"><RefreshCw className="w-5 h-5" /></div>
           <p className="text-sm font-bold text-jozi-forest">View Expired Campaigns History</p>
        </div>
        <button className="text-xs font-black uppercase tracking-widest text-jozi-gold hover:underline">Full Archive</button>
      </div>
    </div>
  );
};

const MousePointer2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M6 6l.01 0" />
  </svg>
);

export default MarketingActive;