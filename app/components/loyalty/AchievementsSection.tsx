import React from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Package, Zap, Check } from 'lucide-react';

const BADGES = [
  { id: 1, name: 'First Find', icon: Package, description: 'Purchased your first treasure.', unlocked: true },
  { id: 2, name: 'Local Hero', icon: Heart, description: 'Bought from 5 different workshops.', unlocked: true },
  { id: 3, name: 'Word of Mouth', icon: Zap, description: 'Referred 3 friends to the Hub.', unlocked: false },
  { id: 4, name: 'Master Crafter', icon: Award, description: 'Supported Jozi for 1 full year.', unlocked: false },
];

const AchievementsSection: React.FC = () => {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-jozi-forest/5 text-left space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Artisan Badges</h3>
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase">2 / 4 Unlocked</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {BADGES.map((badge, i) => (
          <div key={badge.id} className="flex flex-col items-center text-center space-y-3 group">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center relative transition-all ${
              badge.unlocked ? 'bg-jozi-gold text-white shadow-xl shadow-jozi-gold/20' : 'bg-gray-100 text-gray-300 opacity-60'
            }`}>
              <badge.icon className="w-8 h-8" />
              {badge.unlocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-tight leading-none ${badge.unlocked ? 'text-jozi-forest' : 'text-gray-300'}`}>{badge.name}</p>
              <p className="text-[8px] font-medium text-gray-400 mt-1 leading-tight">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-50">
        <div className="flex items-center space-x-4 bg-jozi-cream rounded-2xl p-4">
           <div className="p-2 bg-white rounded-xl text-jozi-gold shadow-sm">
             <Zap className="w-4 h-4 fill-current" />
           </div>
           <div>
             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Current Streak</p>
             <p className="text-sm font-black text-jozi-forest">4 Weekly Check-ins</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;