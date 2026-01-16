
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  ChevronDown, 
  Plus, 
  Tag, 
  Package, 
  Info,
  ArrowUpRight,
  Target,
  Zap,
  // Fix: Added BarChart3 to imports
  BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import SectionHeader from '../../SectionHeader';
import TrendingPairsTable from './TrendingPairsTable';

// Fix: Moved FlameIcon and LayersIcon definitions above AI_RECOMMENDATIONS to avoid TDZ/hoisting errors
const FlameIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.21 1.14-3.027L8.5 14.5z" />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m2.6 11.08 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
    <path d="m2.6 16.08 8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.91" />
  </svg>
);

// --- MOCK DATA ---
const TOP_CARTED_PRODUCTS = [
  { name: 'Evening Dress', count: 142, color: '#1B5E52' },
  { name: 'Leather Wallet', count: 98, color: '#C7A16E' },
  { name: 'Silk Scarf', count: 85, color: '#1B5E52' },
  { name: 'Beaded Necklace', count: 64, color: '#C7A16E' },
  { name: 'Pottery Set', count: 42, color: '#1B5E52' },
  { name: 'Copper Braai', count: 31, color: '#C7A16E' },
];

const AI_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    title: 'Promote Now',
    product: 'Evening Dress',
    reason: 'Currently in 142 carts. High conversion probability with a 10% discount.',
    impact: '+R14,200 Est.',
    icon: Zap,
    color: 'text-jozi-gold bg-jozi-gold/10'
  },
  {
    id: 'rec-2',
    title: 'Bundle Suggestion',
    product: 'Leather Wallet + Scarf',
    reason: 'Detected in 45 overlapping carts this week.',
    impact: '15% Margin Boost',
    icon: Package,
    color: 'text-blue-500 bg-blue-50'
  },
  {
    id: 'rec-3',
    title: 'Hot This Week',
    product: 'Silk Scarf (Indigo)',
    reason: '400% uptick in "Add to Cart" actions since Monday.',
    impact: 'Viral Potential',
    icon: FlameIcon,
    color: 'text-rose-500 bg-rose-50'
  }
];

const TrendingCartInsights: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Weekly');

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <SectionHeader 
          title="Cart Pulse Intelligence" 
          sub="Aggregated platform data showing products currently favored by the neighborhood." 
          icon={ShoppingCart} 
        />
        
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-gray-100 shadow-soft mb-8">
           {['Daily', 'Weekly', 'Monthly'].map(t => (
             <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                timeRange === t ? 'bg-jozi-forest text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'
              }`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Carted Products Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight leading-none">Cart Volume Leaderboard</h3>
              <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl">
                 <TrendingUp className="w-3.5 h-3.5 mr-1" />
                 <span className="text-[10px] font-black uppercase">+12.4% Active Carts</span>
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={TOP_CARTED_PRODUCTS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f1f1" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} width={100} />
                    <Tooltip cursor={{ fill: 'rgba(27,94,82,0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={25}>
                       {TOP_CARTED_PRODUCTS.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* AI Recommendation Cards */}
        <div className="space-y-6">
           <div className="bg-jozi-dark p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden group h-full flex flex-col">
              <div className="flex items-center space-x-3 mb-2 relative z-10">
                 <Sparkles className="w-6 h-6 text-jozi-gold animate-pulse" />
                 <h3 className="text-xl font-black uppercase tracking-tight">Oracle Interventions</h3>
              </div>
              
              <div className="space-y-4 flex-grow relative z-10">
                 {AI_RECOMMENDATIONS.map((rec) => (
                   <div key={rec.id} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group/item cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${rec.color}`}><rec.icon className="w-4 h-4" /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">{rec.title}</span>
                         </div>
                         <span className="text-[10px] font-black text-emerald-400">{rec.impact}</span>
                      </div>
                      <p className="font-black text-sm mb-1">{rec.product}</p>
                      <p className="text-[10px] text-jozi-cream/50 leading-relaxed italic">{rec.reason}</p>
                      <div className="mt-4 flex gap-2">
                         <button className="flex-grow py-2 bg-white text-jozi-dark rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-jozi-gold transition-all">Execute</button>
                         <button className="p-2 bg-white/10 rounded-xl text-white/40 hover:text-white"><ArrowUpRight className="w-4 h-4" /></button>
                      </div>
                   </div>
                 ))}
              </div>
              {/* Fix: BarChart3 is now imported */}
              <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
           </div>
        </div>
      </div>

      {/* Product Overlap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-10">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tighter">Combination Matrix</h3>
                  <p className="text-xs text-gray-400 font-medium italic">Artisan assets frequently found in the same cart session.</p>
               </div>
               <div className="p-3 bg-jozi-forest/5 rounded-2xl text-jozi-forest">
                  <LayersIcon className="w-5 h-5" />
               </div>
            </div>
            <TrendingPairsTable />
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden group shadow-2xl">
               <div className="relative z-10 space-y-6 text-left">
                  <div className="inline-flex items-center bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-jozi-gold">
                     Revenue Hack
                  </div>
                  <h4 className="text-3xl font-black leading-[0.9] tracking-tighter uppercase">The Cart <br />Recovery Loop.</h4>
                  <p className="text-sm text-jozi-cream/60 font-medium leading-relaxed italic">
                    &quot;45% of your carted items aren&apos;t converting. Our AI can trigger a <span className="text-white font-bold underline decoration-jozi-gold underline-offset-4">Neighbors Discount</span> nudge for users with items in cart for &gt;24h.&quot;
                  </p>
                  <button className="w-full py-5 bg-white text-jozi-dark rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">Activate Nudge Sequence</button>
               </div>
               <ShoppingCart className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left flex flex-col justify-between">
               <div className="flex items-center space-x-3 mb-6">
                  <Info className="w-5 h-5 text-jozi-gold" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Governance Note</h4>
               </div>
               <p className="text-xs text-gray-400 font-medium leading-relaxed">
                 All cart data is anonymized and aggregated at a platform level. Individual neighbor identities are never shared through the Intelligence Hub.
               </p>
               <button className="mt-8 text-[10px] font-black text-jozi-gold uppercase hover:underline flex items-center">
                  Data Policy Audit <ArrowUpRight className="ml-1 w-3 h-3" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TrendingCartInsights;
