import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { TrendingUp, Users, Target, MousePointer2 } from 'lucide-react';
import { ANALYTICS_TRENDS, PRODUCT_PERFORMANCE } from '../../../utilities/influencerMockData';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reach', val: '142k', trend: '+24%', icon: Users, color: 'text-blue-500' },
          { label: 'Avg CTR', val: '8.4%', trend: '+1.2%', icon: MousePointer2, color: 'text-jozi-gold' },
          { label: 'Direct Conversion', val: 'R42,120', trend: '+18%', icon: Target, color: 'text-emerald-500' },
          { label: 'Algorithmic ROI', val: '4.8x', trend: 'Optimal', icon: TrendingUp, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest">{stat.trend}</span>
             </div>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
             <h3 className="text-3xl font-black text-jozi-dark mt-2">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Campaign Yield</h3>
                <p className="text-xs text-gray-400 font-medium italic">Referral sales generated over campaign lifecycle.</p>
              </div>
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                 <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Revenue (ZAR)</span>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_TRENDS}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="sales" stroke="#C7A16E" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Product Engagement Bar Chart */}
        <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-2">Item Traction</h3>
              <p className="text-xs text-gray-400 font-medium mb-10 italic">Engagement split per promoted piece.</p>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PRODUCT_PERFORMANCE} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="product" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} width={100} />
                    <Tooltip cursor={{ fill: 'rgba(27,94,82,0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                    <Bar dataKey="engagement" fill="#1B5E52" radius={[0, 8, 8, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
           <div className="pt-8 border-t border-gray-50">
              <div className="flex items-center justify-between text-xs font-bold">
                 <span className="text-gray-400 uppercase tracking-widest">Top Artifact</span>
                 <span className="text-jozi-forest">Heritage Dress</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;