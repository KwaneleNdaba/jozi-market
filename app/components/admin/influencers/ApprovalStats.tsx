import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface ApprovalStatsProps {
  campaigns: any[];
}

const ApprovalStats: React.FC<ApprovalStatsProps> = ({ campaigns }) => {
  const stats = [
    { label: 'Pending Review', val: campaigns.filter(c => c.status === 'Pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-white/10' },
    { label: 'Active Partnerships', val: campaigns.filter(c => c.status === 'Approved').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-white/10' },
    { label: 'Flagged Submissions', val: campaigns.filter(c => c.status === 'Rejected').length, icon: XCircle, color: 'text-rose-400', bg: 'bg-white/10' },
    { label: 'Market Velocity', val: 'Elite', icon: TrendingUp, color: 'text-jozi-gold', bg: 'bg-white/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          key={i}
          className={`${s.bg} backdrop-blur-md p-6 rounded-4xl border border-white/10 text-left group hover:bg-white/15 transition-all cursor-default`}
        >
          <div className="flex items-center justify-between mb-2">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            {/* Added type check for s.val to prevent comparison of string with number when mapping through stats with mixed value types */}
            {i === 0 && typeof s.val === 'number' && s.val > 0 && <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none">{s.label}</p>
          <h4 className="text-3xl font-black text-white mt-2 tracking-tighter">{s.val}</h4>
        </motion.div>
      ))}
    </div>
  );
};

export default ApprovalStats;