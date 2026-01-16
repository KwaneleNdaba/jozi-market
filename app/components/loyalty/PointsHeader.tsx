import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, ArrowUpRight } from 'lucide-react';

interface PointsHeaderProps {
  user: any;
}

const PointsHeader: React.FC<PointsHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-stretch gap-4">
      {/* Main Counter */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-[3rem] shadow-soft border border-jozi-forest/5 flex items-center space-x-6 min-w-[320px]"
      >
        <div className="w-20 h-20 bg-jozi-gold rounded-[2rem] flex items-center justify-center text-jozi-dark shadow-xl shadow-jozi-gold/20">
          <Star className="w-10 h-10 fill-current" />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none mb-1">Your Balance</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-5xl font-black text-jozi-forest tracking-tighter">{user.currentPoints.toLocaleString()}</h2>
            <span className="text-xs font-bold text-jozi-gold uppercase">Pts</span>
          </div>
          {user.expiringSoon > 0 && (
            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-2">
              {user.expiringSoon} pts expiring in 30 days
            </p>
          )}
        </div>
      </motion.div>

      {/* Mini Stats Card */}
      <div className="hidden sm:flex flex-col justify-between bg-jozi-forest p-6 rounded-[2.5rem] text-white space-y-4">
        <div className="space-y-1 text-left">
          <p className="text-[9px] font-black uppercase text-jozi-gold tracking-widest opacity-60">Lifetime Earnings</p>
          <p className="text-xl font-black">{user.lifetimePoints.toLocaleString()} Pts</p>
        </div>
        <div className="h-[1px] bg-white/10 w-full" />
        <div className="space-y-1 text-left">
          <p className="text-[9px] font-black uppercase text-jozi-gold tracking-widest opacity-60">Total Redemptions</p>
          <p className="text-xl font-black">{user.spentPoints.toLocaleString()} Pts</p>
        </div>
      </div>
    </div>
  );
};

export default PointsHeader;