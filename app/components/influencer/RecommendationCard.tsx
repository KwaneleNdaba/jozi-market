import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ArrowUpRight, DollarSign, Target } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: any;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="relative bg-white rounded-[2.5rem] p-1 border-2 border-transparent hover:border-jozi-gold transition-all duration-500 shadow-soft group"
    >
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                <img src={recommendation.img} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-jozi-forest text-sm uppercase tracking-tight">{recommendation.vendor}</h4>
                <p className="text-[9px] font-black text-jozi-gold uppercase tracking-widest leading-none mt-1">Niche Fit: 98%</p>
              </div>
           </div>
           <div className="w-10 h-10 bg-jozi-gold/10 rounded-xl flex items-center justify-center text-jozi-gold animate-pulse">
              <Sparkles className="w-5 h-5 fill-current" />
           </div>
        </div>

        <div className="space-y-4">
           <p className="text-sm font-bold text-jozi-dark leading-relaxed italic line-clamp-2">
             "{recommendation.reason}"
           </p>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                 <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Predicted Reach</p>
                 <div className="flex items-center space-x-2">
                    <TrendingUp className="w-3.5 h-3.5 text-jozi-gold" />
                    <span className="font-black text-jozi-forest text-lg leading-none">{recommendation.reach}</span>
                 </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                 <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Est. Commission</p>
                 <div className="flex items-center space-x-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-black text-jozi-forest text-lg leading-none">{recommendation.fee}</span>
                 </div>
              </div>
           </div>
        </div>

        <button className="w-full py-4 bg-jozi-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center group/btn hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20">
           Review Proposal <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;