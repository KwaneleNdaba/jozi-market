import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Star, Gamepad2, Megaphone, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const ACTIONS = [
  { label: 'Market Shopping', points: '1 Pt per R1', icon: ShoppingBag, color: 'text-blue-500' },
  { label: 'Invite a Neighbor', points: '500 Bonus Pts', icon: Users, color: 'text-jozi-gold', badge: 'Popular' },
  { label: 'Review a Treasure', points: '150 Pts', icon: Star, color: 'text-emerald-500' },
  { label: 'Heritage Quiz', points: '300 Pts', icon: Gamepad2, color: 'text-rose-500', badge: 'Weekly' },
];

const WaysToEarn: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-jozi-forest tracking-tight uppercase">Gather Points</h3>
        <Link href="/games" className="text-xs font-black text-jozi-gold uppercase tracking-widest hover:underline flex items-center">
          Go to Challenges <ChevronRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ACTIONS.map((action, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-4xl shadow-soft border border-jozi-forest/5 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center space-x-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.color} bg-current/10`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-black text-jozi-forest">{action.label}</h4>
                  {action.badge && (
                    <span className="bg-jozi-forest/5 text-jozi-forest text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-jozi-forest/10">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-xl font-black text-jozi-gold">{action.points}</p>
              </div>
            </div>
            <button className="p-3 bg-gray-50 text-gray-300 rounded-xl group-hover:bg-jozi-forest group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Featured Social Promo */}
      <div className="p-8 bg-jozi-gold/5 rounded-5xl border border-jozi-gold/20 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-6">
           <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-jozi-gold shadow-sm">
             <Megaphone className="w-8 h-8" />
           </div>
           <div>
             <h4 className="text-xl font-black text-jozi-forest leading-tight uppercase">Share your unboxing</h4>
             <p className="text-sm text-gray-400 font-medium leading-relaxed italic max-w-sm">Tag us in your TikTok or Instagram reels and get a <span className="text-jozi-gold font-bold">R25 voucher</span> + 250 Pts.</p>
           </div>
        </div>
        <button className="px-10 py-4 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl">
           Get Posting
        </button>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

export default WaysToEarn;