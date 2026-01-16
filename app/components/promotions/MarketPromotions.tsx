import React from 'react';
import CarouselBanner from './CarouselBanner';
import PromotionSlot from './PromotionSlot';
import { Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
// Added missing Link import
import Link from 'next/link';

const MOCK_PROMOS = [
  {
    id: 'p1',
    name: 'Heritage Silk Wrap',
    tagline: 'Authentic dyes, eternal comfort.',
    image: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?auto=format&fit=crop&q=80&w=600',
    discount: '15% OFF',
    price: 635,
    originalPrice: 750,
    badge: 'Limited Time' as const
  },
  {
    id: 'p6',
    name: 'Veld Leather Boots',
    tagline: 'Built for Jozi, made by Soweto.',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=600',
    discount: 'R350 OFF',
    price: 1500,
    originalPrice: 1850,
    badge: 'Hot Deal' as const
  },
  {
    id: 'p4',
    name: 'Zulu Bead Necklace',
    tagline: 'Geometry of the ancestors.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
    discount: '25% OFF',
    price: 240,
    originalPrice: 320,
    badge: 'New' as const
  },
  {
    id: 'p2',
    name: 'Baobab Carved Bowl',
    tagline: 'Sustainable wood, master finish.',
    image: 'https://images.unsplash.com/photo-1611486212330-9199b0c0bc3f?auto=format&fit=crop&q=80&w=600',
    discount: 'SAVE R150',
    price: 300,
    originalPrice: 450,
    badge: 'Limited Time' as const
  }
];

const MarketPromotions: React.FC = () => {
  return (
    <section className="space-y-16">
      {/* Top Level Hero Carousel */}
      <CarouselBanner />

      {/* Featured Deals Grid */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-[0.3em]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Neighborhood Pulse
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
              Golden <br /><span className="text-jozi-gold">Opportunities.</span>
            </h2>
            <p className="text-gray-400 font-medium max-w-xl italic">
              Exclusive market-rate deals from our certified workshops. Claimed daily by local supporters.
            </p>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-3xl border border-jozi-forest/5 shadow-soft flex items-center space-x-6"
          >
            <div className="w-12 h-12 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold">
               <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Discounts</p>
              <p className="text-xl font-black text-jozi-forest">42 Artisans Active</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {MOCK_PROMOS.map((promo, idx) => (
            <PromotionSlot 
              key={promo.id}
              {...promo}
            />
          ))}
        </div>
      </div>

      {/* Site-wide Banner Callout */}
      <div className="px-4">
        <div className="bg-jozi-dark rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left space-y-6">
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                REFER A NEIGHBOR, <br />
                <span className="text-jozi-gold italic">BOTH SAVE R200.</span>
              </h3>
              <p className="text-lg text-jozi-cream/60 font-medium max-w-2xl">
                The community grows when we support our makers. Invite your network to Jozi Market and unlock exclusive credit on your next treasure.
              </p>
            </div>
            <Link 
              href="/referrals"
              className="bg-jozi-gold text-jozi-dark px-12 py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-white hover:scale-105 transition-all"
            >
              Get Invite Link
            </Link>
          </div>
          <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:rotate-45 transition-transform duration-1000" />
        </div>
      </div>
    </section>
  );
};

export default MarketPromotions;