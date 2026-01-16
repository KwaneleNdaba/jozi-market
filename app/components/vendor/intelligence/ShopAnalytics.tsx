import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MousePointer2, 
  Target, 
  Star, 
  ArrowUpRight, 
  RefreshCw, 
  Eye, 
  ShoppingBag,
  TrendingUp,
  Zap,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, LineChart, Line 
} from 'recharts';
import SectionHeader from '../../SectionHeader';

const VISITOR_DATA = [
  { name: 'Mon', new: 450, returning: 120 },
  { name: 'Tue', new: 520, returning: 150 },
  { name: 'Wed', new: 480, returning: 180 },
  { name: 'Thu', new: 610, returning: 240 },
  { name: 'Fri', new: 850, returning: 410 },
  { name: 'Sat', new: 1200, returning: 680 },
  { name: 'Sun', new: 940, returning: 520 },
];

const FUNNEL_DATA = [
  { stage: 'Shop Views', value: 8400, color: '#1B5E52' },
  { stage: 'Product Clicks', value: 3200, color: '#2B7A6C' },
  { stage: 'Add to Cart', value: 1200, color: '#C7A16E' },
  { stage: 'Purchased', value: 450, color: '#D4A854' },
];

const RECENT_REVIEWS = [
  { id: 1, user: 'Thandiwe M.', product: 'Evening Dress', rating: 5, comment: 'Incredible quality, stitches are perfect.', sentiment: 'Positive' },
  { id: 2, user: 'Bongani S.', product: 'Zebu Wallet', rating: 4, comment: 'Great leather, but delivery was a day late.', sentiment: 'Neutral' },
  { id: 3, user: 'Lerato K.', product: 'Silk Scarf', rating: 5, comment: 'The colors are even better in person!', sentiment: 'Positive' },
];

const ShopAnalytics: React.FC = () => {
  return (
    <div className="space-y-10 text-left">
      <SectionHeader 
        title="Engagement Dashboard" 
        sub="Tracking neighborhood traffic and behavioral conversion through your digital storefront." 
        icon={Users}
      />

      {/* Traffic Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Visitor Velocity</h3>
                <p className="text-xs text-gray-400 font-medium">Daily traffic breakdown by seeker type.</p>
              </div>
              <div className="flex space-x-6 text-[10px] font-black uppercase text-gray-400">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                    <span>New Neighbors</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                    <span>Returning</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={VISITOR_DATA}>
                    <defs>
                       <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B5E52" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1B5E52" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="new" stroke="#1B5E52" strokeWidth={5} fillOpacity={1} fill="url(#colorNew)" />
                    <Area type="monotone" dataKey="returning" stroke="#C7A16E" strokeWidth={5} fillOpacity={1} fill="url(#colorRet)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Funnel Metrics */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100 flex flex-col">
           <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-8">Conversion Funnel</h3>
           <div className="space-y-6 flex-grow flex flex-col justify-center">
              {FUNNEL_DATA.map((step, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{step.stage}</span>
                      <span className="text-lg font-black text-jozi-forest">{step.value.toLocaleString()}</span>
                   </div>
                   <div className="h-4 bg-gray-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(step.value / FUNNEL_DATA[0].value) * 100}%` }}
                        className="h-full rounded-full shadow-inner"
                        style={{ backgroundColor: step.color }}
                      />
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-10 p-6 bg-jozi-cream rounded-3xl border border-jozi-gold/10 text-center">
              <p className="text-[10px] font-black uppercase text-jozi-gold mb-1">Conversion Efficiency</p>
              <p className="text-3xl font-black text-jozi-forest">5.3%</p>
              <div className="flex items-center justify-center space-x-1 text-emerald-500 font-black text-[10px] mt-1">
                 <TrendingUp className="w-3 h-3" />
                 <span>+1.2% this week</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Review Trends */}
         <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100 text-left">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">Neighborhood Voices</h3>
               <div className="flex items-center space-x-1 text-jozi-gold">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-black text-xl">4.8</span>
               </div>
            </div>
            <div className="space-y-6">
               {RECENT_REVIEWS.map((review) => (
                 <div key={review.id} className="p-6 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-jozi-gold/20 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-jozi-forest border border-gray-100 shadow-sm">
                             {review.user[0]}
                          </div>
                          <div>
                             <p className="font-black text-sm text-jozi-dark">{review.user}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.product}</p>
                          </div>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                         review.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                       }`}>
                         {review.sentiment}
                       </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium italic leading-relaxed">"{review.comment}"</p>
                 </div>
               ))}
            </div>
            <button className="w-full mt-8 py-4 bg-jozi-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all">
               Analyze All Feedback
            </button>
         </div>

         {/* AI Action Card */}
         <div className="bg-jozi-forest p-12 rounded-[4rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
               <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <Zap className="w-4 h-4 mr-2 text-jozi-gold" />
                  <span className="text-[10px] font-black uppercase text-jozi-gold tracking-widest">Growth Intervention</span>
               </div>
               <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight uppercase">High Exit <br />Rate Alert.</h2>
               <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">
                 "Your 'Zebu Leather Wallet' has high view velocity but <span className="text-white font-bold underline decoration-jozi-gold underline-offset-4">65% exit rate</span> at the cart stage. Recommend applying a limited-time 'Neighbor Free Shipping' voucher to close the gap."
               </p>
               <div className="flex gap-4 pt-4">
                  <button className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">Deploy Voucher</button>
                  <button className="bg-white/10 border border-white/20 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center">
                    Full Diagnostic <ChevronRight className="ml-2 w-4 h-4" />
                  </button>
               </div>
            </div>
            <Target className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
         </div>
      </div>
    </div>
  );
};

export default ShopAnalytics;