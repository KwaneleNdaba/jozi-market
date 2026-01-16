import React from 'react';
import { motion } from 'framer-motion';
// Added missing Share2 to imports
import { Users, TrendingUp, Award, UserPlus, ArrowUpRight, ShieldCheck, Heart, Share2 } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DATA = [
  { name: 'Aug', referrals: 45, conversions: 12 },
  { name: 'Sep', referrals: 82, conversions: 28 },
  { name: 'Oct', referrals: 124, conversions: 42 },
];

const LEADERBOARD = [
  { name: 'Thandiwe M.', score: 24, status: 'Ambassador', img: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Bongani S.', score: 18, status: 'Elite', img: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Lerato K.', score: 12, status: 'Active', img: 'https://i.pravatar.cc/150?u=3' },
];

const MarketingReferrals: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Neighbor Referral Hub" 
        sub="Track the growth of your community as your loyal customers recruit new seekers." 
        icon={Users}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Referral Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight leading-none">Referral Trajectory</h3>
              <div className="flex space-x-6 text-[10px] font-black uppercase text-gray-400">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                    <span>Invitations</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                    <span>Verified Sales</span>
                 </div>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="referrals" fill="#C7A16E" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="conversions" fill="#1B5E52" radius={[4, 4, 0, 0]} barSize={20} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Right: Ambassador Leaderboard */}
        <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100 flex flex-col">
           <div className="flex items-center space-x-3 mb-10">
              <Award className="w-6 h-6 text-jozi-gold" />
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Top Recorders</h3>
           </div>
           <div className="space-y-6 flex-grow">
              {LEADERBOARD.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl group hover:bg-jozi-cream transition-all">
                   <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img src={user.img} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-jozi-gold text-jozi-dark rounded-full flex items-center justify-center font-black text-[9px] border-2 border-white">{i+1}</div>
                      </div>
                      <div>
                        <p className="font-black text-sm text-jozi-dark">{user.name}</p>
                        <p className="text-[9px] font-black uppercase text-jozi-gold">{user.status}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-lg text-jozi-forest">{user.score}</p>
                      <p className="text-[8px] font-bold text-gray-300 uppercase">Sales</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-8 py-4 bg-jozi-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all">
              Reward Ambassadors
           </button>
        </div>
      </div>

      {/* Campaign Details Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden group shadow-2xl text-left">
            <div className="relative z-10 space-y-6">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold">
                  <UserPlus className="w-7 h-7" />
               </div>
               <h4 className="text-2xl font-black tracking-tight leading-none uppercase">Neighbor <br /><span className="text-jozi-gold">Welcome Program.</span></h4>
               <p className="text-jozi-cream/60 text-sm font-medium leading-relaxed">Referrers earn 100 Pts and their neighbors get R50 off their first order from your workshop.</p>
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-jozi-gold">
                     <ShieldCheck className="w-4 h-4" />
                     <span>Fraud Protected</span>
                  </div>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-jozi-gold">
                     <Heart className="w-4 h-4" />
                     <span>Local First</span>
                  </div>
               </div>
            </div>
            <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
         </div>

         <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-16 h-16 bg-jozi-gold/10 rounded-full flex items-center justify-center text-jozi-gold">
               <Share2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Active Referral Link</h3>
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl p-5 w-full flex items-center justify-between">
               <p className="text-xs font-bold text-gray-400 truncate pr-4">jozi.market/join?artisan=maboneng</p>
               <button className="text-[10px] font-black uppercase text-jozi-gold hover:text-jozi-forest transition-colors">Copy Link</button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Embed this link in your social bios to track specific traffic sources.</p>
         </div>
      </div>
    </div>
  );
};

export default MarketingReferrals;