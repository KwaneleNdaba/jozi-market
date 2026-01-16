import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Tag, Video, Users, Star, Calendar, Zap, DollarSign, Target, ChevronRight } from 'lucide-react';
import SectionHeader from '../SectionHeader';

const CAMPAIGN_TYPES = [
  { id: 'voucher', label: 'Voucher / Coupon', icon: Tag, desc: 'Generate discount codes to drive immediate sales.' },
  { id: 'video', label: 'Sponsored Video', icon: Video, desc: 'Boost vertical video reels to broader market segments.' },
  { id: 'referral', label: 'Referral Push', icon: Users, desc: 'Incentivize existing customers to bring new neighbors.' },
  { id: 'featured', label: 'Product Spotlight', icon: Star, desc: 'Prioritize specific pieces in platform search results.' },
];

const MarketingCreate: React.FC = () => {
  const [selectedType, setSelectedType] = useState('voucher');

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Forge New Strategy" 
        sub="Select your objective and define the parameters of your next commercial surge." 
        icon={Plus}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100 space-y-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">1. Choose Objective</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAMPAIGN_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                      selectedType === type.id 
                        ? 'border-jozi-forest bg-jozi-forest/5' 
                        : 'border-gray-50 hover:border-jozi-gold/20 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-xl ${selectedType === type.id ? 'bg-jozi-forest text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <h5 className="font-black text-jozi-forest">{type.label}</h5>
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">2. Campaign Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Campaign Title</label>
                  <input type="text" placeholder="e.g. Summer Silk Launch" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Target Segment</label>
                  <select className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 appearance-none">
                     <option>Loyal Neighbors (Repeat)</option>
                     <option>New Seekers (Leads)</option>
                     <option>All Johannesburg Users</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="date" className="w-full bg-gray-50 rounded-2xl px-6 pl-12 py-4 font-bold text-jozi-forest outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="date" className="w-full bg-gray-50 rounded-2xl px-6 pl-12 py-4 font-bold text-jozi-forest outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-50">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">3. Budget Allocation</h4>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Estimated ROI: 3.4x</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-jozi-cream rounded-3xl border border-jozi-forest/5">
                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Daily Burn</p>
                     <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-jozi-forest" />
                        <input type="number" defaultValue="150" className="bg-transparent font-black text-2xl text-jozi-forest w-full outline-none" />
                     </div>
                  </div>
                  <div className="md:col-span-2 p-6 bg-jozi-forest text-white rounded-3xl flex items-center justify-between relative overflow-hidden group">
                     <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-jozi-gold mb-1">Max Lifetime Spend</p>
                        <p className="text-2xl font-black italic">R4,500 Total</p>
                     </div>
                     <Zap className="w-10 h-10 text-jozi-gold opacity-20 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Preview & Launch */}
        <div className="space-y-8">
           <div className="bg-white rounded-[3rem] p-8 shadow-soft border border-gray-100 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-8">Asset Preview</h4>
              <div className="bg-jozi-cream aspect-[4/5] rounded-[2.5rem] relative overflow-hidden border border-jozi-forest/5 shadow-inner">
                 <div className="absolute inset-0 bg-gradient-to-t from-jozi-dark/60 via-transparent to-transparent" />
                 <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                 <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <span className="bg-jozi-gold px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Sponsored Choice</span>
                    <h5 className="text-xl font-black">Limited Edition Shweshwe</h5>
                    <p className="text-[10px] opacity-70">Starting at R850 • Free Local Delivery</p>
                 </div>
              </div>
              <div className="mt-8 space-y-4">
                 <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>Est. Impressions</span>
                    <span className="text-jozi-dark">15,000+</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>Target Radius</span>
                    <span className="text-jozi-dark">Joburg Central</span>
                 </div>
              </div>
           </div>

           <button className="w-full py-6 bg-jozi-forest text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-2xl shadow-jozi-forest/30 hover:bg-jozi-dark hover:-translate-y-1 transition-all flex items-center justify-center group">
              Launch Campaign <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
           
           <p className="text-[10px] text-gray-400 font-medium text-center italic">Requires R250 balance in Capital Ledger for immediate activation.</p>
        </div>
      </div>
    </div>
  );
};

export default MarketingCreate;