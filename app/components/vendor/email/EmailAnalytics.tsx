import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  Target, 
  Users, 
  MousePointer2, 
  Sparkles,
  RefreshCw,
  Clock,
  Eye,
  DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import SectionHeader from '../../SectionHeader';

const DATA_WEEKLY_ENGAGEMENT = [
  { name: 'Mon', sends: 1200, opens: 450, clicks: 120 },
  { name: 'Tue', sends: 800, opens: 320, clicks: 85 },
  { name: 'Wed', sends: 2400, opens: 1100, clicks: 340 },
  { name: 'Thu', sends: 1500, opens: 680, clicks: 190 },
  { name: 'Fri', sends: 4200, opens: 2100, clicks: 740 },
  { name: 'Sat', sends: 3100, opens: 1450, clicks: 420 },
  { name: 'Sun', sends: 1200, opens: 510, clicks: 110 },
];

const EmailAnalytics: React.FC = () => {
  return (
    <div className="space-y-10 text-left">
      <SectionHeader 
        title="Yield Insights" 
        sub="Analyzing the behavioral impact and commercial yield of your broadcast campaigns." 
        icon={TrendingUp}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement velocity */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Broadcast Velocity</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">Cross-channel engagement rates for the current week.</p>
              </div>
              <div className="flex space-x-6 text-[10px] font-black uppercase text-gray-400">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                    <span>Opens</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                    <span>Clicks</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={DATA_WEEKLY_ENGAGEMENT}>
                    <defs>
                       <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B5E52" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1B5E52" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="opens" stroke="#1B5E52" strokeWidth={5} fillOpacity={1} fill="url(#colorOpens)" />
                    <Area type="monotone" dataKey="clicks" stroke="#C7A16E" strokeWidth={5} fillOpacity={1} fill="url(#colorClicks)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-jozi-dark p-10 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
           <div className="relative z-10 space-y-8">
              <div className="flex items-center space-x-3">
                 <div className="p-3 bg-white/10 rounded-2xl"><Sparkles className="w-6 h-6 text-jozi-gold" /></div>
                 <h3 className="text-xl font-black uppercase tracking-tight">Campaign Oracle</h3>
              </div>
              <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">
                "Your 'Midnight Heritage' campaign yielded a <span className="text-white font-bold">5.2x ROI</span> benchmark. Customers in <span className="text-jozi-gold font-bold">Pretoria East</span> showed 30% higher engagement. Replicate this segment for your next drop."
              </p>
              <div className="pt-8 flex items-center justify-between border-t border-white/10">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-jozi-gold tracking-widest">Est. Revenue Yield</p>
                    <p className="text-3xl font-black">R18,420</p>
                 </div>
                 <button className="bg-white text-jozi-dark px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">
                    Apply Strategy
                 </button>
              </div>
           </div>
           <Zap className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
            { label: 'Avg Order Value', val: 'R1,240', trend: '+R150', icon: DollarSign, color: 'text-emerald-500' },
            { label: 'Unsubscribe Rate', val: '0.2%', trend: 'Low Risk', icon: Users, color: 'text-blue-500' },
            { label: 'Link Click Velocity', val: '12/min', trend: 'Peak', icon: MousePointer2, color: 'text-jozi-gold' },
            { label: 'Last Cycle Sales', val: '42', trend: '+12', icon: Target, color: 'text-purple-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-50 group hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                 <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{stat.trend}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-jozi-dark">{stat.val}</h4>
           </div>
         ))}
      </div>
    </div>
  );
};

export default EmailAnalytics;