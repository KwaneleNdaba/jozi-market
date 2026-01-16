import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { TrendingUp, Users, MousePointer2, Target, Download, Calendar, Filter } from 'lucide-react';

const DATA_ENGAGEMENT = [
  { name: 'Day 1', reach: 4200, clicks: 120 },
  { name: 'Day 2', reach: 8500, clicks: 340 },
  { name: 'Day 3', reach: 12100, clicks: 580 },
  { name: 'Day 4', reach: 15400, clicks: 820 },
  { name: 'Day 5', reach: 18900, clicks: 1240 },
  { name: 'Day 6', reach: 24500, clicks: 1850 },
  { name: 'Day 7', reach: 32000, clicks: 2450 },
];

const DATA_PRODUCT_SALES = [
  { name: 'Dress', sales: 42, revenue: 52500 },
  { name: 'Wallet', sales: 128, revenue: 57600 },
  { name: 'Scarf', sales: 56, revenue: 42000 },
  { name: 'Beads', sales: 31, revenue: 9920 },
];

const PerformanceChart: React.FC = () => {
  return (
    <div className="space-y-10 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-3xl font-black text-jozi-forest uppercase tracking-tight leading-none">Social Velocity</h2>
           <p className="text-gray-400 font-medium text-sm mt-1">Aggregated performance across all active platform-managed campaigns.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="bg-white border border-gray-100 rounded-xl p-2 flex shadow-soft">
              <button className="px-4 py-2 bg-jozi-forest text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">Weekly</button>
              <button className="px-4 py-2 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-jozi-forest">Monthly</button>
           </div>
           <button className="p-3 bg-white border border-gray-100 rounded-xl shadow-soft text-gray-400 hover:text-jozi-forest transition-all">
              <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Engagement Area */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100">
           <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Reach Momentum</h3>
              <div className="flex items-center space-x-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                    <span>Total Reach</span>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                    <span>Interaction</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={DATA_ENGAGEMENT}>
                    <defs>
                       <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B5E52" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1B5E52" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="reach" stroke="#C7A16E" strokeWidth={4} fillOpacity={1} fill="url(#colorReach)" />
                    <Area type="monotone" dataKey="clicks" stroke="#1B5E52" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Product Mix Bar Chart */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-gray-100 text-center flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-2">Artifact Yield</h3>
              <p className="text-xs text-gray-400 font-medium mb-10">Sales generated per product class.</p>
              <div className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA_PRODUCT_SALES} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} width={80} />
                       <Tooltip cursor={{ fill: 'rgba(27,94,82,0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                       <Bar dataKey="sales" radius={[0, 8, 8, 0]} barSize={25}>
                          {DATA_PRODUCT_SALES.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1B5E52' : '#C7A16E'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase text-gray-300">Top Conversion</p>
                 <p className="text-lg font-black text-jozi-forest">Leather Wallets</p>
              </div>
              <div className="w-12 h-12 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold shadow-sm">
                 <Target className="w-6 h-6" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;