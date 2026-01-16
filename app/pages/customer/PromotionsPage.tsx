import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Zap, 
  Clock, 
  Percent, 
  Sparkles, 
  Flame, 
  Copy, 
  Check, 
  ArrowRight, 
  Gift, 
  ChevronRight,
  Timer
} from 'lucide-react';
import { products } from '../../data/mockData';
import ProductCard from '../../components/ProductCard';
import MarketPromotions from '../../components/promotions/MarketPromotions';
import Link from 'next/link';

const PromotionsPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter products with originalPrice (deals)
  const deals = useMemo(() => 
    products.filter(p => p.originalPrice && p.originalPrice > p.price),
  []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const coupons = [
    { code: 'JOZI20', desc: '20% OFF Site-wide', expiry: 'Ends in 2 days', vendor: 'All Stores' },
    { code: 'ARTISAN15', desc: '15% OFF Home Decor', expiry: 'Valid this week', vendor: 'Home & Art Only' },
    { code: 'HERITAGE50', desc: 'R50 OFF Orders > R500', expiry: 'Permanent', vendor: 'New Customers' },
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      <div className="container mx-auto px-4 py-12">
        <MarketPromotions />
        
        {/* Marketplace Coupons Grid */}
        <section className="mt-32 space-y-12">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center bg-jozi-forest/5 px-4 py-1.5 rounded-full border border-jozi-forest/10">
                <Tag className="w-4 h-4 text-jozi-gold mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-jozi-forest">Redemption Center</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-jozi-forest tracking-tighter uppercase">Market Vouchers</h2>
             <p className="text-gray-400 font-medium italic">Apply these codes at checkout to support local while saving.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coupons.map((coupon, idx) => (
              <motion.div 
                key={coupon.code}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-jozi-forest/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Tag className="w-20 h-20 text-jozi-forest" />
                </div>
                <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest mb-1">{coupon.vendor}</p>
                <h3 className="text-2xl font-black text-jozi-forest mb-4 leading-tight">{coupon.desc}</h3>
                
                <div className="flex items-center justify-between bg-jozi-cream rounded-2xl p-4 border-2 border-dashed border-jozi-forest/10">
                  <span className="font-black text-jozi-forest tracking-tighter text-lg">{coupon.code}</span>
                  <button 
                    onClick={() => handleCopy(coupon.code)}
                    className="bg-jozi-forest text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase transition-all flex items-center"
                  >
                    {copiedCode === coupon.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-4">{coupon.expiry}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Regular Deals Grid */}
        <section className="mt-32 space-y-12">
          <div className="flex items-end justify-between">
            <div className="text-left">
              <h2 className="text-4xl font-black text-jozi-forest tracking-tight uppercase">Full Discount Catalog</h2>
              <p className="text-gray-500 mt-2 font-medium italic">Every piece here carries an active workshop markdown.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PromotionsPage;