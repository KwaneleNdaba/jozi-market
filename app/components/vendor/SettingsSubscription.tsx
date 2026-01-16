import React from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, TrendingUp, Zap, ArrowRight, ShieldCheck, Gem } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import StatusBadge from '../StatusBadge';

const SettingsSubscription: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Success Trajectory" 
        sub="Review and upgrade your marketplace standing." 
        icon={Layers}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 flex flex-col md:flex-row gap-12 relative overflow-hidden">
             <div className="flex-grow space-y-8 relative z-10">
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-jozi-gold uppercase tracking-[0.4em]">Current Status</p>
                   <h3 className="text-5xl font-black text-jozi-forest tracking-tighter leading-none uppercase">Growth Tier</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50">
                   <div>
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Commission Rate</p>
                      <p className="text-2xl font-black text-jozi-dark">5.0% <span className="text-[10px] font-bold text-emerald-500 uppercase ml-1">+0% Initial</span></p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Next Renewal</p>
                      <p className="text-2xl font-black text-jozi-dark">Nov 12, 2024</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase text-jozi-dark tracking-widest">Active Plan Benefits</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Unlimited Product Vault',
                        'Artisan Intelligence Suite',
                        'AI Content Engine',
                        'Referral Program Access',
                        'Priority Hub Dispatch',
                        'Vertical Video Support'
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center space-x-3 text-xs font-bold text-gray-500">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                           <span>{feat}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             
             <div className="md:w-72 shrink-0 space-y-6 relative z-10">
                <div className="p-8 bg-jozi-cream rounded-[2.5rem] border border-jozi-forest/5 text-center space-y-6 shadow-soft">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-jozi-forest mx-auto shadow-sm">
                      <Zap className="w-8 h-8" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Fee</p>
                      <p className="text-3xl font-black text-jozi-forest">R699<span className="text-sm">/mo</span></p>
                   </div>
                   <button className="w-full py-4 bg-jozi-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all">Update Billing</button>
                </div>
             </div>
             <Layers className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.03] text-jozi-forest pointer-events-none" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 text-left group">
             <div className="flex items-center space-x-6">
                <div className="p-4 bg-jozi-gold/10 rounded-2xl text-jozi-gold group-hover:scale-110 transition-transform"><TrendingUp className="w-8 h-8" /></div>
                <div>
                   <h4 className="text-xl font-black text-jozi-forest">Ready to scale further?</h4>
                   <p className="text-xs text-gray-400 font-medium">Join the <span className="font-bold text-jozi-dark">Pro / Brand</span> tier to unlock homepage spotlight slots and 3.0% commission.</p>
                </div>
             </div>
             <button className="px-10 py-5 bg-jozi-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl shadow-jozi-dark/10 flex items-center">
                Upgrade Plan <ArrowRight className="ml-2 w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-soft space-y-8 text-left">
              <h3 className="text-lg font-black text-jozi-dark uppercase tracking-tight flex items-center">
                 <ShieldCheck className="w-5 h-5 mr-3 text-jozi-gold" /> Success Path
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'Platform Visibility', val: 'High', status: 'Optimal' },
                   { label: 'Dispatch Speed', val: 'Top 10%', status: 'Excellent' },
                   { label: 'Customer Trust', val: 'Gold', status: 'Certified' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                         <span>{stat.label}</span>
                         <span className="text-jozi-gold">{stat.status}</span>
                      </div>
                      <p className="text-xl font-black text-jozi-forest">{stat.val}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-jozi-forest p-10 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl text-left">
              <div className="relative z-10 space-y-4">
                 <h4 className="text-xl font-black leading-tight uppercase tracking-tight">VIP Artisan <br />Access</h4>
                 <p className="text-xs text-jozi-cream/60 font-medium leading-relaxed">Early access to monthly market festivals and artisan workshops at the Hub.</p>
                 <div className="flex items-center space-x-2 text-jozi-gold">
                    <Gem className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Growth Exclusive</span>
                 </div>
              </div>
              <ArrowRight className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:translate-x-4 transition-transform duration-700" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSubscription;