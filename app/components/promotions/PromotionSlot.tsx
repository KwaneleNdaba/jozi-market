import React from 'react';
import { motion } from 'framer-motion';
import { Tag, ArrowUpRight, Timer, Heart } from 'lucide-react';
import Link from 'next/link';

interface PromotionSlotProps {
  id: string;
  name: string;
  image: string;
  discount: string;
  price: number;
  originalPrice: number;
  badge: 'Hot Deal' | 'Limited Time' | 'New';
  tagline: string;
}

const PromotionSlot: React.FC<PromotionSlotProps> = ({ 
  id, name, image, discount, price, originalPrice, badge, tagline 
}) => {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-jozi-forest/5 shadow-soft hover:shadow-2xl transition-all duration-500 flex flex-col h-full group"
    >
      {/* Visual Header */}
      <div className="relative aspect-[4/3] overflow-hidden bg-jozi-cream">
        <motion.img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Dynamic Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center ${
            badge === 'Hot Deal' ? 'bg-red-500 text-white' : 
            badge === 'Limited Time' ? 'bg-jozi-dark text-white' : 
            'bg-jozi-gold text-jozi-dark'
          }`}>
            {badge === 'Limited Time' && <Timer className="w-3 h-3 mr-2 animate-pulse" />}
            {badge}
          </span>
          <span className="bg-white text-jozi-forest border border-jozi-forest/10 px-4 py-2 rounded-full text-[10px] font-black shadow-lg">
            {discount}
          </span>
        </div>

        <button className="absolute top-5 right-5 z-10 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-jozi-forest hover:bg-white hover:text-red-500 transition-all shadow-sm">
          <Heart className="w-5 h-5" />
        </button>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-jozi-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link 
            to={`/product/${id}`}
            className="bg-white text-jozi-dark px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
          >
            Claim Deal
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex-grow flex flex-col text-left">
        <div className="flex items-center space-x-2 text-jozi-gold mb-3">
          <Tag className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Offer</span>
        </div>
        
        <h3 className="text-2xl font-black text-jozi-forest tracking-tighter leading-tight mb-2 group-hover:text-jozi-gold transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-gray-400 font-medium italic mb-6">
          "{tagline}"
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-jozi-forest/5 pt-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Neighbor Price</p>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-jozi-forest">R{price}</span>
              <span className="text-sm text-gray-300 line-through font-bold">R{originalPrice}</span>
            </div>
          </div>
          <Link 
            to={`/product/${id}`}
            className="w-12 h-12 bg-jozi-forest rounded-2xl flex items-center justify-center text-white hover:bg-jozi-gold hover:scale-105 transition-all shadow-lg shadow-jozi-forest/20"
          >
            <ArrowUpRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionSlot;