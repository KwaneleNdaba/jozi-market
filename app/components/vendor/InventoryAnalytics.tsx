import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  MousePointer2, 
  Zap, 
  ArrowUpRight, 
  Sparkles,
  RefreshCw,
  Box,
  Layout,
  Layers,
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import SectionHeader from '../SectionHeader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

const TURNOVER_DATA = [
  { name: 'Fashion', rate: 12.4 },
  { name: 'Accessories', rate: 8.2 },
  { name: 'Wellness', rate: 4.5 },
  { name: 'Art', rate: 2.1 },
];

const STOCK_VALUE_DATA = [
  { name: 'In Stock', value: 342000, color: '#1B5E52' },
  { name: 'In Transit', value: 54000, color: '#C7A16E' },
  { name: 'At Hub', value: 29000, color: '#0A1A17' },
];

const InventoryAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Inventory Intelligence" 
        sub="Analyzing the velocity and fiscal weight of your current vault holdings." 
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Turnover Velocity */}
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Turnover Velocity</h3>
                <p className="text-xs text-gray-400 font-medium">Average days to sell entire category stock.</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center">
                 <TrendingUp className="w-4 h-4 mr-2" /> +14% Efficiency
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={TURNOVER_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: 'rgba(27,94,82,0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="rate" fill="#1B5E52" radius={[12, 12, 0, 0]} barSize={50} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Fiscal Allocation Pie */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-soft border border-gray-100 flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-2">Vault Allocation</h3>
              <p className="text-xs text-gray-400 font-medium mb-10">Distribution of stock capital.</p>
              <div className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={STOCK_VALUE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                          {STOCK_VALUE_DATA.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="space-y-4">
              {STOCK_VALUE_DATA.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                   <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: s.color }} />
                      <span className="text-gray-400 uppercase tracking-widest">{s.name}</span>
                   </div>
                   <span className="text-jozi-forest">R{(s.value/1000).toFixed(0)}k</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Strategic Efficiency Card */}
      <div className="bg-jozi-dark p-12 rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-8 text-left max-w-2xl">
            <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full">
               <Sparkles className="w-4 h-4 mr-2 text-jozi-gold" />
               <span className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.2em]">Inventory Intelligence Active</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] uppercase">Dead Stock <br /><span className="text-jozi-gold">Liquidation Cycle.</span></h2>
            <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">
              "We've identified <span className="text-white font-bold">12 units</span> of 'Rosebank Prints' that haven't seen a click in 45 days. Recommend a <span className="text-jozi-gold font-bold">15% Flash Sale</span> to free up vault capacity for the new Heritage Collection."
            </p>
            <div className="flex gap-4">
               <button className="bg-jozi-gold text-jozi-dark px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">Apply Liquidation Voucher</button>
               <button className="bg-white/10 border border-white/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">Detailed Aging Report</button>
            </div>
         </div>
         <div className="relative z-10 grid grid-cols-2 gap-6 w-full lg:w-auto shrink-0">
            <div className="bg-white p-8 rounded-[3rem] text-jozi-dark shadow-2xl flex flex-col items-center justify-center text-center">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Turnover Goal</p>
               <p className="text-4xl font-black text-jozi-forest">98%</p>
               <p className="text-[9px] font-bold text-emerald-500 mt-2">Ahead of Target</p>
            </div>
            <div className="bg-jozi-gold p-8 rounded-[3rem] text-jozi-dark shadow-2xl flex flex-col items-center justify-center text-center">
               <p className="text-[10px] font-black uppercase text-jozi-dark/40 tracking-widest mb-1">Waste Factor</p>
               <p className="text-4xl font-black text-jozi-dark">0.2%</p>
               <p className="text-[9px] font-bold text-jozi-dark/60 mt-2">Market Low</p>
            </div>
         </div>
         <RefreshCw className="absolute -bottom-10 -left-10 w-64 h-64 opacity-5 group-hover:rotate-180 transition-transform duration-[10000ms] pointer-events-none" />
      </div>
    </div>
  );
};

export default InventoryAnalytics;
