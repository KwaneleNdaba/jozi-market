import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Filter, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  Search,
  Zap,
  Info,
  Smartphone,
  Plus
} from 'lucide-react';
import SectionHeader from '../../SectionHeader';

const MOCK_SEGMENTS = [
  { id: 's1', name: 'Loyal Neighbors', count: 852, criteria: '3+ Orders All-time', level: 'High ROI', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 's2', name: 'Recent Seekers', count: 1240, criteria: 'Registered < 30 days', level: 'Growth', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 's3', name: 'Dormant Vaults', count: 442, criteria: 'No orders in 6 months', level: 'Win-back', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 's4', name: 'Sandton Spenders', count: 312, criteria: 'Region: Sandton / North', level: 'Premium', color: 'text-purple-500', bg: 'bg-purple-50' },
];

const EmailSegmentSelector: React.FC = () => {
  return (
    <div className="space-y-10 text-left">
      <SectionHeader 
        title="Neighbor Segments" 
        sub="Define high-probability audience groups based on behavioral platform logic." 
        icon={Users}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Segment Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           {MOCK_SEGMENTS.map((seg, i) => (
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               key={seg.id}
               className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-soft group hover:shadow-xl transition-all flex flex-col justify-between"
             >
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className={`p-4 rounded-2xl ${seg.bg} ${seg.color}`}>
                         <Users className="w-6 h-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${seg.bg} ${seg.color} border-current/20`}>
                        {seg.level}
                      </span>
                   </div>
                   <div>
                      <h4 className="text-2xl font-black text-jozi-forest tracking-tighter leading-none">{seg.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{seg.criteria}</p>
                   </div>
                   <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest leading-none">Live Audience</p>
                         <p className="text-xl font-black text-jozi-dark">{seg.count} <span className="text-[10px] text-gray-400">Neighbors</span></p>
                      </div>
                      <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
                <button className="w-full mt-8 py-4 bg-jozi-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl">
                   Target this Segment
                </button>
             </motion.div>
           ))}

           {/* Create New Callout */}
           <button className="rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center p-10 text-center group hover:border-jozi-gold/20 transition-all min-h-[300px]">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-jozi-gold group-hover:text-white transition-all mb-4">
                 <Plus className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-gray-300 group-hover:text-jozi-forest transition-colors uppercase tracking-tight">Define Segment</h4>
              <p className="text-xs text-gray-300 font-bold mt-2 leading-relaxed">Filter neighbors by custom <br />behavioral filters.</p>
           </button>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
           <div className="bg-jozi-dark p-10 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden group shadow-2xl">
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center space-x-3 text-jozi-gold">
                    <Zap className="w-6 h-6 fill-current" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Strategic Alert</h3>
                 </div>
                 <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">
                   "We've detected that <span className="text-white font-bold">245 Neighbors</span> have added your 'Veld Boots' to their wishlist but haven't converted. Recommend creating a <span className="text-jozi-gold font-bold">Specialized Intent</span> segment for them."
                 </p>
                 <button className="w-full py-4 bg-white text-jozi-dark rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">
                    Generate Intent Segment
                 </button>
              </div>
              <Users className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-soft space-y-8 text-left">
              <div className="flex items-center space-x-3 text-jozi-forest">
                 <Info className="w-5 h-5" />
                 <h4 className="font-black text-xs uppercase tracking-widest">Global Audience</h4>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Market Reach</span>
                    <span className="text-xl font-black text-jozi-forest">18,420</span>
                 </div>
                 <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-jozi-gold" />
                 </div>
                 <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">You are currently visible to 42% of the total Jozi Market subscriber base.</p>
                 <button className="text-[10px] font-black text-jozi-gold uppercase hover:underline flex items-center">
                    Increase Market Penetration <ChevronRight className="w-3 h-3 ml-1" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSegmentSelector;