import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Tag, Truck, Heart, Lock, Check } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  type: 'Voucher' | 'Shipping' | 'Merch' | 'Experience';
  cost: number;
  description: string;
  icon: any;
  color: string;
}

const REWARDS: Reward[] = [
  { id: 'r1', name: 'R50 Jozi Credit', type: 'Voucher', cost: 500, description: 'Direct discount on any market order.', icon: Tag, color: 'text-blue-500' },
  { id: 'r2', name: 'R100 Heritage Voucher', type: 'Voucher', cost: 950, description: 'Bigger savings for loyal neighbors.', icon: Tag, color: 'text-jozi-gold' },
  { id: 'r3', name: 'Free Local Express', type: 'Shipping', cost: 400, description: 'Skip the delivery fee on your next find.', icon: Truck, color: 'text-emerald-500' },
  { id: 'r4', name: 'Artisan Cotton Tote', type: 'Merch', cost: 2000, description: 'Limited edition Maboneng print bag.', icon: Gift, color: 'text-jozi-forest' },
  { id: 'r5', name: 'Hub Workshop Pass', type: 'Experience', cost: 4500, description: 'Spend a morning with a master crafter.', icon: Heart, color: 'text-rose-500' },
  { id: 'r6', name: 'Jozi Market Cap', type: 'Merch', cost: 1500, description: 'Heavyweight embroidered denim cap.', icon: Gift, color: 'text-jozi-dark' },
];

const RewardsStore: React.FC<{ points: number }> = ({ points }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {REWARDS.map((reward, i) => {
        const isLocked = points < reward.cost;
        const progress = Math.min(100, (points / reward.cost) * 100);

        return (
          <motion.div 
            key={reward.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all relative flex flex-col justify-between group overflow-hidden ${
              isLocked ? 'border-gray-50 grayscale' : 'border-jozi-forest/5 hover:border-jozi-gold shadow-soft hover:shadow-xl'
            }`}
          >
            {isLocked && (
              <div className="absolute top-6 right-6">
                <Lock className="w-5 h-5 text-gray-300" />
              </div>
            )}
            
            <div className="space-y-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${reward.color} bg-current/10`}>
                <reward.icon className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{reward.type}</p>
                <h4 className="text-xl font-black text-jozi-forest leading-tight">{reward.name}</h4>
                <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed italic">"{reward.description}"</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-end justify-between">
                <div className="flex items-baseline space-x-1">
                  <span className={`text-2xl font-black ${isLocked ? 'text-gray-300' : 'text-jozi-forest'}`}>{reward.cost.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pts</span>
                </div>
                {isLocked && (
                  <span className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">
                    {reward.cost - points} more needed
                  </span>
                )}
              </div>
              
              <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full ${isLocked ? 'bg-gray-200' : 'bg-jozi-gold'}`}
                />
              </div>

              <button 
                disabled={isLocked}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  isLocked 
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                    : 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark'
                }`}
              >
                {isLocked ? 'Locked' : 'Claim Reward'}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RewardsStore;