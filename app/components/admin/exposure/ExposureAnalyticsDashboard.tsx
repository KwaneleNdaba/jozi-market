import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Zap, Target, Users, Share2, 
  Smartphone, Instagram, Eye, ThumbsUp, ArrowUpRight,
  Filter, Download, RefreshCw, Layers
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import SectionHeader from '../../SectionHeader';

const DATA_WEEKLY_REACH = [
  { name: 'Mon', organic: 12000, promoted: 4500 },
  { name: 'Tue', organic: 14500, promoted: 6200 },
  { name: 'Wed', organic: 11000, promoted: 8400 },
  { name: 'Thu', organic: 18000, promoted: 12000 },
  { name: 'Fri', organic: 24000, promoted: 35000 },
  { name: 'Sat', organic: 28000, promoted: 42000 },
  { name: 'Sun', organic: 21000, promoted: 28000 },
];

const PLATFORM_BREAKDOWN = [
  { name: 'TikTok', value: 48, color: '#1B5E52' },
  { name: 'Instagram', value: 32, color: '#C7A16E' },
  { name: 'Facebook', value: 15, color: '#0A1A17' },
  { name: 'YouTube', value: 5, color: '#D4A854' },
];

const TOP_PERFORMERS = [
  { vendor: 'Maboneng Textiles', post: 'Indigo Reel', reach: '42.4k', engage: '12.4%', uplift: '+18%' },
  { vendor: 'Soweto Gold', post: 'Crafting Heritage', reach: '31.2k', engage: '10.8%', uplift: '+14%' },
  { vendor: 'Jozi Apothecary', post: 'Organic Roots', reach: '28.1k', engage: '9.2%', uplift: '+8%' },
];

const ExposureAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Network Reach', val: '412k', trend: '+14%', icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Avg Engagement', val: '9.4%', trend: '+0.8%', icon: Zap, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10' },
          { label: 'Conversion Uplift', val: 'R184k', trend: '+12%', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Active Campaigns', val: '24', trend: '+4', icon: Share2, color: 'text-jozi-forest', bg: 'bg-jozi-forest/10' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100 group transition-all hover:shadow-xl"
          >
             <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest">{stat.trend}</span>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
             <h3 className="text-3xl font-black text-jozi-dark mt-2">{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Engagement Trend */}
        <div className="lg:col-span-2 bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-soft border border-gray-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                 <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight leading-none">Broadcast Momentum</h3>
                 <p className="text-xs text-gray-400 font-medium mt-2">Aggregated reach across all platform-managed vendor content.</p>
              </div>
              <div className="flex space-x-6 text-[10px] font-black uppercase text-gray-400">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                    <span>Organic</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                    <span>Promoted</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={DATA_WEEKLY_REACH}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="promoted" stroke="#C7A16E" strokeWidth={4} fill="#C7A16E" fillOpacity={0.05} />
                    <Area type="monotone" dataKey="organic" stroke="#1B5E52" strokeWidth={4} fill="#1B5E52" fillOpacity={0.05} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Platform Mix */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100 text-center flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-2">Attention Mix</h3>
              <p className="text-xs text-gray-400 font-medium mb-10">Cross-platform viewership distribution.</p>
              <div className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={PLATFORM_BREAKDOWN} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                          {PLATFORM_BREAKDOWN.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="space-y-4">
              {PLATFORM_BREAKDOWN.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                   <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: p.color }} />
                      <span className="text-gray-400 uppercase tracking-widest">{p.name}</span>
                   </div>
                   <span className="text-jozi-forest">{p.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Performing Campaigns */}
         <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-soft border border-gray-100 text-left">
            <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight mb-10">Hero Submissions</h3>
            <div className="space-y-6">
               {TOP_PERFORMERS.map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[2rem] group hover:bg-white hover:border-jozi-forest/5 transition-all border border-transparent">
                    <div className="flex items-center space-x-5">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-jozi-gold font-black italic shadow-sm group-hover:scale-110 transition-transform">
                          {p.vendor[0]}
                       </div>
                       <div>
                          <p className="font-black text-jozi-dark text-sm">{p.vendor}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Post: {p.post}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-jozi-forest text-lg">{p.reach}</p>
                       <div className="flex items-center justify-end space-x-2 text-[9px] font-black uppercase text-emerald-500">
                          <TrendingUp className="w-3 h-3" />
                          <span>{p.uplift} GMV</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-10 py-4 bg-jozi-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-forest transition-all">
               View Full Strategy Logs
            </button>
         </div>

         {/* Algorithmic Efficiency Insight */}
         <div className="bg-jozi-forest p-12 rounded-[4.5rem] text-white relative overflow-hidden group shadow-2xl flex flex-col justify-between">
            <div className="relative z-10 space-y-6 text-left max-w-lg">
               <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-2 text-jozi-gold" />
                  <span className="text-[10px] font-black uppercase text-jozi-gold tracking-widest">Market Sentiment</span>
               </div>
               <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none uppercase">Global Viral <br /><span className="text-jozi-gold italic">Multiplier.</span></h2>
               <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed">
                 Organic content from <span className="text-white font-bold">Maboneng Workshops</span> is currently triggering a <span className="text-white font-bold">4.2x ROI</span> benchmark. Recommend shifting budget from static banners to Vertical Reel boosts for this segment.
               </p>
               <div className="flex gap-4">
                  <button className="bg-white text-jozi-dark px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">Apply Strategy Shift</button>
               </div>
            </div>
            <Smartphone className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
         </div>
      </div>
    </div>
  );
};

export default ExposureAnalyticsDashboard;