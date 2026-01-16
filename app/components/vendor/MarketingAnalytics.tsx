import React from 'react';
import { motion } from 'framer-motion';
// Added missing Users and MessageCircle to imports
import { BarChart3, TrendingUp, DollarSign, Target, MousePointer2, Zap, ArrowUpRight, Sparkles, Filter, Download, Info, Users, MessageCircle } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const ROI_DATA = [
  { name: 'W1', cost: 1200, revenue: 3500 },
  { name: 'W2', cost: 1500, revenue: 4200 },
  { name: 'W3', cost: 1800, revenue: 5800 },
  { name: 'W4', cost: 2400, revenue: 10400 },
];

const ENGAGEMENT_BY_TYPE = [
  { type: 'Videos', rate: 42, color: '#1B5E52' },
  { type: 'Vouchers', rate: 35, color: '#C7A16E' },
  { type: 'Spotlight', rate: 18, color: '#D4A854' },
  { type: 'Referral', rate: 12, color: '#0A1A17' },
];

const MarketingAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Intelligence & ROI" 
        sub="Deep dive into your commercial yield and algorithmic visibility scoring." 
        icon={BarChart3}
      />

      {/* Main ROI Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight leading-none">Fiscal Velocity</h3>
                <p className="text-xs text-gray-400 font-medium">Monthly marketing spend vs gross yield.</p>
              </div>
              <div className="flex space-x-6 text-[10px] font-black uppercase text-gray-400">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <span>Investment</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                    <span>Return</span>
                 </div>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={ROI_DATA}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="cost" stroke="#E5E7EB" strokeWidth={3} fillOpacity={0} />
                    <Area type="monotone" dataKey="revenue" stroke="#C7A16E" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-10 relative overflow-hidden group shadow-2xl">
           <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full">
                 <Sparkles className="w-4 h-4 mr-2 text-jozi-gold" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Smart Optimizer</span>
              </div>
              <h3 className="text-3xl font-black tracking-tighter leading-tight uppercase">High Yield <br />Alert.</h3>
              <p className="text-sm font-medium text-jozi-cream/60 leading-relaxed italic">
                "We noticed that users in <span className="text-white font-bold underline underline-offset-4">Rosebank</span> are 3x more likely to use your shweshwe vouchers. Increase your targeted spend by R50/day in this zone for a predicted +R2.4k yield."
              </p>
              <button className="w-full py-5 bg-jozi-gold text-jozi-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">Activate Boost</button>
           </div>
           <Target className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Secondary Metrics */}
         <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100 text-left">
            <h3 className="text-xl font-black text-jozi-dark mb-10 uppercase tracking-tight">Strategy Effectiveness</h3>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ENGAGEMENT_BY_TYPE} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} width={80} />
                     <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                     <Bar dataKey="rate" radius={[0, 8, 8, 0]} barSize={25}>
                        {ENGAGEMENT_BY_TYPE.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6">
               <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Top Performer</p>
                  <p className="text-sm font-black text-jozi-forest">Video Content</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Growth Opp.</p>
                  <p className="text-sm font-black text-jozi-gold">Referral Tiers</p>
               </div>
            </div>
         </div>

         {/* Detailed Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
               { label: 'Customer LTV', val: 'R4,820', trend: '+R850', icon: Users, color: 'text-jozi-forest' },
               { label: 'Acquisition Cost', val: 'R42 / user', trend: '-12%', icon: Target, color: 'text-jozi-gold' },
               { label: 'Market Visibility', val: 'High', trend: 'Top 5%', icon: TrendingUp, color: 'text-emerald-500' },
               { label: 'Feedback Sentiment', val: '4.9 / 5', trend: '+0.2', icon: MessageCircle, color: 'text-blue-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-50 group hover:shadow-xl transition-all">
                 <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{stat.trend}</span>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                 <h4 className="text-2xl font-black text-jozi-dark">{stat.val}</h4>
              </div>
            ))}
         </div>
      </div>

      <div className="p-12 bg-white rounded-[4rem] border border-jozi-forest/5 shadow-soft flex flex-col md:flex-row items-center justify-between gap-12 text-left relative overflow-hidden group">
         <div className="flex items-start space-x-6 max-w-2xl relative z-10">
            <div className="w-16 h-16 bg-jozi-gold/10 rounded-3xl flex items-center justify-center text-jozi-gold shrink-0">
               <Info className="w-8 h-8" />
            </div>
            <div className="space-y-2">
               <h4 className="text-xl font-black text-jozi-forest uppercase tracking-tight leading-none">Export Strategic Roadmap</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">Generate a full 30-day marketing schedule with AI-selected high-probability launch dates based on historical Johannesburg market behavior.</p>
            </div>
         </div>
         <div className="flex gap-4 relative z-10">
            <button className="px-10 py-5 bg-jozi-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-forest transition-all shadow-xl flex items-center">
               <Download className="w-4 h-4 mr-2" /> PDF Roadmap
            </button>
         </div>
         <BarChart3 className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000" />
      </div>
    </div>
  );
};

export default MarketingAnalytics;