import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShieldCheck, AlertTriangle, RefreshCw, MoreVertical, 
  Settings, ChevronRight, Zap, Target, ArrowUpRight, Trash2, 
  Plus, Search, Filter, Box
} from 'lucide-react';
import SectionHeader from '../../SectionHeader';

const MOCK_CREDITS = [
  { id: 'v1', name: 'Maboneng Textiles', tier: 'Pro', used: 2, limit: 10, risk: 'Low', status: 'Optimal' },
  { id: 'v2', name: 'Soweto Gold', tier: 'Growth', used: 4, limit: 5, risk: 'High', status: 'Warning' },
  { id: 'v3', name: 'Rosebank Art', tier: 'Starter', used: 5, limit: 5, risk: 'Critical', status: 'Capped' },
  { id: 'v4', name: 'Jozi Apothecary', tier: 'Free', used: 0, limit: 3, risk: 'Low', status: 'Inactive' },
];

const VendorCreditMonitor: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Artisan Credit Governance" 
        sub="Control and override monthly social exposure limits for individual merchants." 
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Credit Registry */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Find artisan..." 
                  className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                />
              </div>
              <div className="flex gap-2">
                 <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-all"><Filter className="w-5 h-5" /></button>
                 <button className="bg-jozi-dark text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold hover:text-jozi-dark transition-all">Bulk Reset Credits</button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest">Artisan</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Standing</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Credit Usage</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Risk Vector</th>
                    <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-300 tracking-widest">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {MOCK_CREDITS.map((v) => (
                     <tr key={v.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 font-black text-jozi-forest text-sm">{v.name}</td>
                        <td className="py-6">
                           <span className="bg-jozi-cream text-jozi-gold px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-jozi-gold/10">{v.tier}</span>
                        </td>
                        <td className="py-6">
                           <div className="flex flex-col items-center space-y-2">
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(v.used / v.limit) * 100}%` }}
                                    className={`h-full ${v.used >= v.limit ? 'bg-rose-500' : 'bg-jozi-forest'}`} 
                                 />
                              </div>
                              <span className="text-[10px] font-black text-gray-400">{v.used} / {v.limit} Units</span>
                           </div>
                        </td>
                        <td className="py-8 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                             v.risk === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                             v.risk === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                           }`}>
                             {v.status}
                           </span>
                        </td>
                        <td className="py-6 text-right">
                           <button className="p-3 bg-white text-gray-300 rounded-xl hover:text-jozi-gold transition-all border border-transparent hover:border-jozi-gold/10">
                              <Settings className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Global Policy Control */}
        <div className="space-y-8">
           <div className="bg-jozi-dark p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold shadow-xl">
                    <RefreshCw className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-black uppercase leading-tight tracking-tight">Cycle Reset Protocol</h3>
                 <p className="text-xs text-jozi-cream/40 font-medium leading-relaxed italic">"Manually trigger a full market credit refresh. This will set all artisans back to 0/Limit. Typically used for campaign launches."</p>
                 <button className="w-full py-5 bg-white text-jozi-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">Execute Reset Cycle</button>
              </div>
              <Zap className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 space-y-6 text-left">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="p-2 bg-jozi-gold/10 rounded-xl text-jozi-gold"><AlertTriangle className="w-5 h-5" /></div>
                 <h4 className="text-sm font-black uppercase text-jozi-dark">Limit Exceptions</h4>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">Artisans assigned to the <span className="text-jozi-forest font-bold">Pro Tier</span> bypass standard monthly validation and have a soft-cap of 10 posts.</p>
              <div className="space-y-4 pt-4 border-t border-gray-50">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Universal Auto-Approval</span>
                    <div className="w-10 h-5 bg-gray-100 rounded-full relative"><div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Limit Override (Admin Only)</span>
                    <div className="w-10 h-5 bg-jozi-forest rounded-full relative"><div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCreditMonitor;