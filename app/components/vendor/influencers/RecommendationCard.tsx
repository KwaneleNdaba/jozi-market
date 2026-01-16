import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';

interface RecommendationCardProps {
  influencer: any;
  onBook: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ influencer, onBook }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-jozi-dark rounded-[3rem] p-1 overflow-hidden group shadow-2xl"
    >
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-jozi-gold via-jozi-bright to-jozi-gold opacity-30 animate-pulse" />
      
      <div className="relative bg-jozi-dark rounded-[2.8rem] p-8 h-full flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20">
                <img src={influencer.avatar} className="w-full h-full object-cover" alt={influencer.name} />
              </div>
              <div>
                <h4 className="font-black text-white text-sm uppercase tracking-tight">{influencer.name}</h4>
                <p className="text-jozi-gold text-[9px] font-black uppercase tracking-widest">{influencer.niche}</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-jozi-gold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
             <div className="flex items-center space-x-2 text-jozi-gold mb-1">
               <Sparkles className="w-3 h-3 fill-current" />
               <span className="text-[8px] font-black uppercase tracking-widest">Why This Choice?</span>
             </div>
             <p className="text-xs text-jozi-cream/70 font-medium italic leading-relaxed">
               "{influencer.reason}"
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Predicted ROI</p>
              <p className="text-2xl font-black text-jozi-gold">{influencer.roi}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Success Prob.</p>
              <p className="text-2xl font-black text-white">{influencer.success}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onBook}
          className="w-full py-4 bg-white text-jozi-dark rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center group/btn hover:bg-jozi-gold transition-all"
        >
          Initialize Collab <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;