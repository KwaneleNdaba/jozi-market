import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Landmark, DollarSign, ArrowUpRight, History, Zap, ExternalLink } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import StatusBadge from '../StatusBadge';

const PAST_PAYOUTS = [
  { id: 'PAY-1044', date: 'Oct 11, 2024', amount: 'R14,250', status: 'Delivered', method: 'Standard Bank' },
  { id: 'PAY-1021', date: 'Oct 04, 2024', amount: 'R18,400', status: 'Delivered', method: 'Standard Bank' },
  { id: 'PAY-0988', date: 'Sep 27, 2024', amount: 'R12,100', status: 'Delivered', method: 'Standard Bank' },
];

const SettingsPayments: React.FC = () => {
  const [payoutFreq, setPayoutFreq] = useState('Weekly');

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Capital Management" 
        sub="Configure your financial endpoints and payout preferences." 
        icon={CreditCard}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Bank Configuration */}
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Settlement Endpoint</h3>
               <button className="bg-jozi-cream text-jozi-forest px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all">
                 Update Bank Detail
               </button>
            </div>
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 group">
               <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-jozi-forest shadow-sm group-hover:scale-110 transition-transform">
                    <Landmark className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-jozi-forest">Standard Bank SA</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Current Account •••• 9901</p>
                  </div>
               </div>
               <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">Verified for Payout</span>
               </div>
            </div>

            <div className="mt-12 space-y-6 pt-10 border-t border-gray-50">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold ml-1">Payout Cadence</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Daily', 'Weekly', 'Instant'].map(freq => (
                    <button 
                      key={freq}
                      onClick={() => setPayoutFreq(freq)}
                      className={`p-6 rounded-[2rem] border-2 transition-all text-center ${
                        payoutFreq === freq ? 'bg-jozi-forest border-jozi-forest text-white shadow-xl' : 'bg-white border-gray-50 text-gray-400 hover:border-jozi-gold/20'
                      }`}
                    >
                       <p className="font-black text-sm">{freq}</p>
                       <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${payoutFreq === freq ? 'opacity-60' : 'text-gray-300'}`}>
                         {freq === 'Instant' ? '5% Surcharge' : freq === 'Daily' ? '1% Surcharge' : 'Zero Fee'}
                       </p>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Past Payouts */}
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Redemption History</h3>
               <button className="text-[10px] font-black text-jozi-gold uppercase tracking-widest hover:underline flex items-center">
                 Export Ledger <Download className="ml-1 w-3 h-3" />
               </button>
            </div>
            <div className="space-y-4">
               {PAST_PAYOUTS.map((pay, i) => (
                 <div key={i} className="p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-jozi-forest/5 hover:bg-white transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
                    <div className="flex items-center space-x-5">
                       <div className="p-3 bg-white rounded-xl text-gray-400 shadow-sm"><History className="w-5 h-5" /></div>
                       <div>
                          <p className="font-black text-jozi-forest text-sm">{pay.id}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{pay.date} • {pay.method}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-8">
                       <div className="text-right">
                          <p className="font-black text-lg text-jozi-forest">{pay.amount}</p>
                          <p className="text-[9px] font-bold text-emerald-500 uppercase">Successful</p>
                       </div>
                       <button className="p-2 text-gray-300 hover:text-jozi-gold opacity-0 group-hover:opacity-100 transition-all"><ExternalLink className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Wallet Balance Card */}
          <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3 text-jozi-gold">
                   <Wallet className="w-6 h-6" />
                   <h3 className="text-xl font-black uppercase tracking-tight">Capital Balance</h3>
                </div>
                <div>
                   <p className="text-5xl font-black tracking-tighter">R12,450</p>
                   <p className="text-xs text-jozi-cream/40 font-medium mt-2 italic">Current week pending settlement.</p>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>Threshold for Payout</span>
                    <span>R15,000</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-jozi-gold" />
                  </div>
                </div>
                <button className="w-full py-4 bg-white text-jozi-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">
                  Test Payout Sequence
                </button>
             </div>
             <DollarSign className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="p-8 bg-jozi-cream/50 rounded-[2.5rem] border border-jozi-forest/5 space-y-4">
             <h4 className="text-[10px] font-black text-jozi-gold uppercase tracking-[0.2em]">Platform Comm.</h4>
             <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-jozi-forest">Growth Tier Rate</span>
                <span className="text-2xl font-black text-jozi-forest">5.0%</span>
             </div>
             <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Upgrade to the <span className="text-jozi-forest font-bold">Pro Tier</span> to unlock a 3.0% flat commission rate.</p>
             <button className="text-[10px] font-black text-jozi-gold uppercase tracking-widest hover:underline flex items-center">
                Compare Plan Economics <ArrowUpRight className="ml-1 w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Download = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default SettingsPayments;