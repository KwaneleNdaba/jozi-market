
import React from 'react';
import { motion } from 'framer-motion';
// Add TrendingUp to the list of imports from lucide-react to fix the "Cannot find name" error
import { Gem, ShieldCheck, Award, Crown, CheckCircle2, TrendingUp } from 'lucide-react';

interface TierProgressProps {
  user: any;
}

const TIERS = [
  { id: 1, name: 'Bronze Neighbor', icon: ShieldCheck, points: 0, color: 'text-orange-400', bg: 'bg-orange-50' },
  { id: 2, name: 'Silver Neighbor', icon: Award, points: 1000, color: 'text-gray-400', bg: 'bg-gray-50' },
  { id: 3, name: 'Gold Neighbor', icon: Gem, points: 2500, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10' },
  { id: 4, name: 'Platinum Legend', icon: Crown, points: 5000, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const TierProgress: React.FC<TierProgressProps> = ({ user }) => {
  const currentTierData = TIERS.find(t => t.id === user.tierLevel) || TIERS[0];
  const progressPercent = Math.min(100, (user.currentPoints / TIERS[user.tierLevel]?.points) * 100);

  return (
    <div className="bg-white rounded-[4rem] p-10 lg:p-12 shadow-soft border border-jozi-forest/5 text-left">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left: Current Tier Badge */}
        <div className="flex items-center space-x-6">
          <div className={`w-24 h-24 rounded-4xl flex items-center justify-center ${currentTierData.bg} ${currentTierData.color} shadow-inner`}>
            <currentTierData.icon className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Current Standing</p>
            <h3 className="text-4xl font-black text-jozi-forest tracking-tighter">{user.currentTier}</h3>
            <div className="flex items-center space-x-2 text-xs font-bold text-jozi-gold">
              <CheckCircle2 className="w-4 h-4" />
              <span>5% Reward Cashback Active</span>
            </div>
          </div>
        </div>

        {/* Center: Ladder */}
        <div className="grow w-full max-w-2xl px-4">
          <div className="relative">
            <div className="h-2 bg-gray-50 rounded-full w-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-jozi-forest rounded-full shadow-lg"
              />
            </div>
            <div className="flex justify-between mt-6">
              {TIERS.map((tier) => (
                <div key={tier.id} className="flex flex-col items-center space-y-3 relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    user.tierLevel >= tier.id ? 'bg-jozi-forest text-white shadow-xl' : 'bg-gray-100 text-gray-300'
                  }`}>
                    <tier.icon className="w-5 h-5" />
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest text-center max-w-[60px] leading-tight ${
                    user.tierLevel >= tier.id ? 'text-jozi-forest' : 'text-gray-300'
                  }`}>
                    {tier.name.split(' ')[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Next Level Goal */}
        <div className="bg-jozi-cream rounded-4xl p-8 border border-jozi-forest/5 min-w-[280px]">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target</p>
           <h4 className="text-xl font-black text-jozi-forest leading-tight">Road to {user.nextTier}</h4>
           <p className="text-2xl font-black text-jozi-gold mt-4">{user.pointsToNext.toLocaleString()} <span className="text-xs font-bold text-gray-400 uppercase">Pts Needed</span></p>
           <div className="flex items-center space-x-2 mt-4 text-[10px] font-black text-jozi-forest/60 uppercase tracking-widest">
             <TrendingUp className="w-4 h-4 text-emerald-500" />
             <span>3 Purchases away</span>
           </div>
        </div>
      </div>

      {/* Tier Benefits Quick List */}
      <div className="mt-12 pt-10 border-t border-gray-50 flex flex-wrap gap-8">
        {[
          { label: 'Free Returns', active: true },
          { label: 'Birthday Gift', active: true },
          { label: 'Artisan Workshop Invites', active: false },
          { label: 'Priority Dispatch', active: false },
          { label: 'Early Drop Access', active: false },
        ].map((benefit, i) => (
          <div key={i} className={`flex items-center space-x-3 transition-opacity ${benefit.active ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${benefit.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-jozi-forest">{benefit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierProgress;
