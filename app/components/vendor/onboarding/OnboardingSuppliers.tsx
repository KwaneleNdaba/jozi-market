import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Truck, Tag, DollarSign, ArrowUpRight, BadgeCheck, MapPin } from 'lucide-react';
import SectionHeader from '../../SectionHeader';
import { OnboardingPlan } from '../../../pages/vendor/VendorOnboardingGuidedPage';

interface Supplier {
  id: string;
  name: string;
  category: string;
  moq: string;
  margin: string;
  region: string;
  rating: string;
  verified: boolean;
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Gauteng Leather Co.', category: 'Raw Materials', moq: '10 hides', margin: '65%', region: 'Joburg South', rating: '4.9', verified: true },
  { id: 's2', name: 'Maboneng Thread House', category: 'Raw Materials', moq: '50 units', margin: '72%', region: 'Joburg CBD', rating: '4.8', verified: true },
  { id: 's3', name: 'Pretoria Print Lab', category: 'Packaging', moq: '100 boxes', margin: '40%', region: 'Pretoria East', rating: '4.7', verified: true },
  { id: 's4', name: 'Soweto Bead Emporium', category: 'Components', moq: '5kg', margin: '80%', region: 'Soweto', rating: '4.9', verified: true },
];

interface OnboardingSuppliersProps {
  plan: OnboardingPlan;
  advanced: boolean;
}

const OnboardingSuppliers: React.FC<OnboardingSuppliersProps> = ({ plan, advanced }) => {
  const [filter, setFilter] = useState('All');

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Supply Chain Network" 
        sub="Vetted regional suppliers offering artisan-friendly terms and direct logistics." 
        icon={Users}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
        <div className="relative w-full md:max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Search suppliers..." className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none" />
        </div>
        <div className="flex items-center space-x-2">
           {['All', 'Raw Materials', 'Packaging', 'Components'].map((cat) => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 filter === cat ? 'bg-jozi-forest text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SUPPLIERS.map((s) => (
          <motion.div
            layout
            key={s.id}
            className="bg-white p-8 rounded-[3rem] shadow-soft border border-gray-100 group hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-6">
               <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                     <div className="w-14 h-14 bg-jozi-cream rounded-2xl flex items-center justify-center text-jozi-forest font-black uppercase shadow-inner italic">
                       {s.name[0]}
                     </div>
                     <div>
                        <div className="flex items-center space-x-2">
                           <h4 className="text-xl font-black text-jozi-forest">{s.name}</h4>
                           {s.verified && <BadgeCheck className="w-5 h-5 text-emerald-500" />}
                        </div>
                        <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">{s.category}</p>
                     </div>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                     <MapPin className="w-3.5 h-3.5 text-gray-400 mr-2" />
                     <span className="text-[10px] font-black text-gray-500 uppercase">{s.region}</span>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 py-6 border-y border-gray-50">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Min. Order</p>
                     <p className="font-black text-sm text-jozi-forest">{s.moq}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Est. Margin</p>
                     <p className="font-black text-sm text-emerald-500">{s.margin}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Trust Score</p>
                     <p className="font-black text-sm text-jozi-dark">{s.rating}/5</p>
                  </div>
               </div>

               {advanced && (
                  <div className="p-4 bg-jozi-cream/50 rounded-2xl border border-jozi-gold/10">
                     <p className="text-[9px] font-black uppercase text-jozi-gold mb-2">Advanced Intelligence</p>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed italic">"Currently has surplus inventory of dark leather. Negotiate for extra 10% off bulk orders this week."</p>
                  </div>
               )}
            </div>

            <button className="w-full mt-8 py-4 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all flex items-center justify-center shadow-xl">
               Contact Representative <ArrowUpRight className="ml-2 w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-jozi-dark rounded-[3.5rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-6 text-left max-w-xl">
            <h3 className="text-3xl font-black tracking-tighter leading-none uppercase">Consolidated <br /><span className="text-jozi-gold italic">Supply Logistics.</span></h3>
            <p className="text-sm text-jozi-cream/60 leading-relaxed font-medium">Orders from these suppliers can be dispatched directly to the Jozi Hub for pre-fulfillment artisan production, saving you 25% in courier fees.</p>
            <button className="bg-white text-jozi-dark px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all">Enable Direct-to-Hub</button>
         </div>
         <Truck className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:translate-x-12 transition-transform duration-[2000ms] pointer-events-none" />
      </div>
    </div>
  );
};

export default OnboardingSuppliers;