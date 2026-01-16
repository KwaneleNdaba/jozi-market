import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Zap, CheckCircle2, Star } from 'lucide-react';

interface InfluencerCardProps {
  influencer: any;
  onBook: () => void;
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({ influencer, onBook }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-jozi-forest/5 shadow-soft hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="p-8 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 shrink-0">
            <img src={influencer.avatar} className="w-full h-full object-cover rounded-[1.5rem] border-4 border-jozi-cream shadow-xl" alt={influencer.name} />
            <div className="absolute -top-2 -right-2 bg-jozi-gold text-white p-1 rounded-lg border-2 border-white">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-jozi-forest text-sm truncate uppercase tracking-tight">{influencer.name}</h4>
            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              <MapPin className="w-3 h-3 mr-1 text-jozi-gold" /> {influencer.region}
            </div>
          </div>
        </div>

        {/* Niche Badge */}
        <div className="bg-jozi-cream px-4 py-2 rounded-xl text-center">
          <span className="text-[10px] font-black text-jozi-forest uppercase tracking-widest">{influencer.niche}</span>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Audience</span>
            </div>
            <p className="text-xl font-black text-jozi-dark leading-none">{influencer.audience}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Engage</span>
            </div>
            <p className="text-xl font-black text-jozi-dark leading-none">{influencer.engagement}</p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="space-y-3 pt-2 border-t border-gray-50">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
            <span className="text-gray-400">Success Rate</span>
            <span className="text-emerald-500">{influencer.success}</span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
            <span className="text-gray-400">Est. Cost</span>
            <span className="text-jozi-forest">{influencer.price}</span>
          </div>
        </div>

        <button 
          onClick={onBook}
          className="w-full py-4 bg-jozi-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-jozi-forest/20 group-hover:bg-jozi-dark transition-all"
        >
          Book Campaign
        </button>
      </div>
    </motion.div>
  );
};

export default InfluencerCard;