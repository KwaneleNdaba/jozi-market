import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  Share, 
  MessageCircle, 
  ArrowUpRight, 
  Instagram, 
  Smartphone, 
  Zap,
  Target,
  Users,
  ExternalLink
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import SectionHeader from '../../SectionHeader';

const ANALYTICS_DATA = [
  { name: 'Mon', views: 2400, engage: 120 },
  { name: 'Tue', views: 3200, engage: 180 },
  { name: 'Wed', views: 2800, engage: 150 },
  { name: 'Thu', views: 4500, engage: 320 },
  { name: 'Fri', views: 6800, engage: 540 },
  { name: 'Sat', views: 8200, engage: 720 },
  { name: 'Sun', views: 5100, engage: 410 },
];

const PLATFORM_MIX = [
  { name: 'TikTok', value: 45, color: '#1B5E52' },
  { name: 'Instagram', value: 35, color: '#C7A16E' },
  { name: 'Facebook', value: 15, color: '#D4A854' },
  { name: 'YouTube', value: 5, color: '#0A1A17' },
];

const TOP_POSTS = [
  { title: 'Indigo Reel', views: '12.4k', engage: '1.2k', roi: '3.4x', icon: Smartphone, color: 'text-jozi-forest' },
  { title: 'Bespoke Fittings', views: '8.1k', engage: '840', roi: '2.8x', icon: Instagram, color: 'text-pink-500' },
  { title: 'Meet the Makers', views: '4.2k', engage: '310', roi: '1.5x', icon: Target, color: 'text-jozi-gold' },
];

const ExposureAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Impact Intelligence" 
        sub="Deep-dive into how our social audiences are discovering your artisanal creations." 
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Area */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Broadcast Velocity</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">Total views generated across all platform accounts.</p>
              </div>
              <div className="flex bg-emerald-50 text-emerald-600 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest items-center">
                 <TrendingUp className="w-4 h-4 mr-2" /> +42% Reach vs LW
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="views" stroke="#C7A16E" strokeWidth={5} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Audience Mix */}
        <div className="bg-jozi-dark p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight border-b border-white/10 pb-6">Traffic Sources</h3>
              <div className="space-y-6">
                {PLATFORM_MIX.map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>{p.name}</span>
                      <span>{p.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${p.value}%` }}
                        className="h-full bg-jozi-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 flex items-center justify-between border-t border-white/10">
                 <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-jozi-gold" />
                    <span className="text-sm font-black italic">Active Seekers</span>
                 </div>
                 <p className="text-2xl font-black">24.2k</p>
              </div>
           </div>
           <Zap className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Performing Submission Details */}
         <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left">
            <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight mb-10">Hero Assets</h3>
            <div className="space-y-6">
               {TOP_POSTS.map((post, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[2.5rem] border border-transparent hover:border-jozi-gold/20 hover:bg-white transition-all group">
                    <div className="flex items-center space-x-5">
                       <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${post.color}`}>
                          <post.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-black text-jozi-forest text-sm">{post.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ROI Score: {post.roi}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-8">
                       <div className="text-right">
                          <p className="font-black text-lg text-jozi-dark">{post.views}</p>
                          <p className="text-[9px] font-bold text-emerald-500 uppercase">Broadcasted</p>
                       </div>
                       <button className="p-3 bg-gray-50 text-gray-300 rounded-xl hover:text-jozi-forest opacity-0 group-hover:opacity-100 transition-all">
                          <ExternalLink className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Detailed Engagement Card */}
         <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left flex flex-col justify-between">
            <div className="space-y-10">
               <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Reaction Breakdown</h3>
               <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: 'Likes', val: '4.2k', icon: ThumbsUp, color: 'text-emerald-500' },
                    { label: 'Shares', val: '1.8k', icon: Share, color: 'text-blue-500' },
                    { label: 'Comments', val: '840', icon: MessageCircle, color: 'text-orange-500' },
                    { label: 'Bookmarks', val: '2.4k', icon: Zap, color: 'text-jozi-gold' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex items-center space-x-3 text-gray-400">
                          <stat.icon className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                       </div>
                       <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>
            <div className="mt-12 p-8 bg-jozi-cream/50 rounded-[2.5rem] border border-jozi-forest/5 flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Market Sentiment</p>
                  <p className="text-xl font-black text-jozi-forest">Exceptionally High</p>
               </div>
               <button className="px-6 py-3 bg-jozi-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all">
                  Full Report
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ExposureAnalytics;