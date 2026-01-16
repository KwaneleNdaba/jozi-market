import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet, 
  Clock 
} from 'lucide-react';

const STATS = [
  { 
    label: 'Initial Capital', 
    val: 'R15,000', 
    trend: 'Confirmed', 
    icon: DollarSign, 
    color: 'text-jozi-forest', 
    bg: 'bg-jozi-forest/5',
    desc: 'Total contribution to date.'
  },
  { 
    label: 'Cycle Profits', 
    val: 'R42,850', 
    trend: '+12%', 
    icon: TrendingUp, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50',
    desc: 'Net revenue from sales.'
  },
  { 
    label: 'Total Withdrawals', 
    val: 'R25,400', 
    trend: 'Processed', 
    icon: ArrowDownRight, 
    color: 'text-rose-500', 
    bg: 'bg-rose-50',
    desc: 'Capital moved to bank.'
  },
  { 
    label: 'Ledger Balance', 
    val: 'R32,450', 
    trend: 'Liquidity', 
    icon: Wallet, 
    color: 'text-jozi-gold', 
    bg: 'bg-jozi-gold/10',
    desc: 'Current spendable assets.'
  },
  { 
    label: 'Pending Payout', 
    val: 'R12,450', 
    trend: 'Next Fri', 
    icon: Clock, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    desc: 'Awaiting settlement cycle.'
  },
];

const LedgerSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {STATS.map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={i}
          className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-jozi-forest/5 text-left group hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{stat.label}</p>
              <h3 className="text-3xl font-black mt-2 text-jozi-forest">{stat.val}</h3>
            </div>
          </div>
          <p className="text-[9px] font-medium text-gray-300 italic mt-4">{stat.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default LedgerSummary;
