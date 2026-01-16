
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Truck, 
  Users, 
  Target, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Package,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  // Fix: Imported BarChart3 from lucide-react to satisfy LucideIcon type requirement
  BarChart3
} from 'lucide-react';
import SectionHeader from '../SectionHeader';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';

// --- MOCK DATA ---
const ORDER_TREND_DATA = [
  { name: 'Mon', count: 12, revenue: 4500 },
  { name: 'Tue', count: 18, revenue: 7200 },
  { name: 'Wed', count: 15, revenue: 6100 },
  { name: 'Thu', count: 22, revenue: 9800 },
  { name: 'Fri', count: 34, revenue: 14200 },
  { name: 'Sat', count: 42, revenue: 18500 },
  { name: 'Sun', count: 28, revenue: 12100 },
];

const CUSTOMER_MIX = [
  { name: 'Repeat Neighbors', value: 65, color: '#1B5E52' },
  { name: 'New Seekers', value: 35, color: '#C7A16E' },
];

const DELIVERY_PERFORMANCE = [
  { area: 'Pretoria East', avg: 14, target: 12 },
  { area: 'Joburg Central', avg: 4, target: 4 },
  { area: 'Sandton', avg: 8, target: 6 },
  { area: 'Soweto', avg: 6, target: 8 },
];

const OrderAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Logistics Intelligence" 
        sub="Analyzing the movement and commercial weight of your current order lifecycle." 
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Area */}
        <div className="lg:col-span-2 bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-soft border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                 <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight leading-none">Commerce Velocity</h3>
                 <p className="text-xs text-gray-400 font-medium mt-2">Daily revenue trajectory for current market cycle.</p>
              </div>
              <div className="flex space-x-6 text-[10px] font-black uppercase text-gray-400">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                    <span>Unit Count</span>
                 </div>
                 <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    <span>+12% vs LW</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={ORDER_TREND_DATA}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#C7A16E" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Behavioral Mix */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-jozi-forest/5 flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight mb-2">Customer Persona</h3>
              <p className="text-xs text-gray-400 font-medium mb-10">Loyalty mix of current cycle orders.</p>
              <div className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={CUSTOMER_MIX} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                          {CUSTOMER_MIX.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="space-y-4">
              {CUSTOMER_MIX.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-bold">
                   <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: s.color }} />
                      <span className="text-gray-400 uppercase tracking-widest">{s.name}</span>
                   </div>
                   <span className="text-jozi-forest">{s.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Regional Performance */}
         <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-soft border border-gray-100 text-left">
            <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight mb-10">Regional Efficiency (OTD)</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DELIVERY_PERFORMANCE} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="area" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} width={120} />
                     <Tooltip cursor={{ fill: 'rgba(27,94,82,0.05)' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                     <Bar dataKey="avg" fill="#1B5E52" radius={[0, 8, 8, 0]} barSize={25} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 p-6 bg-jozi-cream rounded-3xl flex items-center space-x-6">
               <div className="p-3 bg-white rounded-2xl shadow-sm text-jozi-gold"><AlertCircle className="w-5 h-5" /></div>
               <p className="text-xs font-bold text-jozi-forest leading-relaxed uppercase tracking-widest italic">
                 "Pretoria East is showing a <span className="font-black">14h delay trend</span>. AI recommends switching to Express Hub Dispatch for these routes."
               </p>
            </div>
         </div>

         {/* Logistic Status Stats */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
               { label: 'Avg Prep Time', val: '2.4 Days', trend: '-4h vs LW', icon: Clock, color: 'text-jozi-forest' },
               { label: 'Carrier OTD Rate', val: '98%', trend: 'Ideal', icon: Truck, color: 'text-emerald-500' },
               { label: 'Return Incident', val: '0.2%', trend: 'Low Risk', icon: ShieldCheck, color: 'text-blue-500' },
               { label: 'Hub Reach', val: 'Joburg +4', trend: 'Global+', icon: Globe, color: 'text-jozi-gold' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] shadow-soft border border-gray-100 group hover:shadow-xl transition-all text-left">
                 <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 bg-gray-50 rounded-2xl ${stat.color}`}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase">{stat.trend}</span>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                 <h4 className="text-3xl font-black text-jozi-dark">{stat.val}</h4>
              </div>
            ))}
         </div>
      </div>

      {/* Predictive Delivery Strategy */}
      <div className="bg-jozi-dark p-12 rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-8 text-left max-w-2xl">
            <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full">
               <Zap className="w-4 h-4 mr-2 text-jozi-gold" />
               <span className="text-[10px] font-black uppercase text-jozi-gold tracking-widest">Logistic Oracle Active</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9] uppercase">Holiday Volume <br /><span className="text-jozi-gold">Fulfillment Plan.</span></h2>
            <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">
              "We predict a <span className="text-white font-bold">45% increase</span> in order volume starting October 28th. To maintain your 98% OTD rate, we recommend increasing your daily Hub courier slots to 4 per day."
            </p>
            <div className="flex gap-4">
               <button className="bg-jozi-gold text-jozi-dark px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">Apply Holiday Schedule</button>
               <button className="bg-white/10 border border-white/20 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">Detailed Load Forecast</button>
            </div>
         </div>
         <div className="relative z-10 grid grid-cols-2 gap-6 w-full lg:w-auto shrink-0">
            <div className="bg-white p-8 rounded-[3rem] text-jozi-dark shadow-2xl flex flex-col items-center justify-center text-center">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Efficiency Target</p>
               <p className="text-4xl font-black text-jozi-forest">96%</p>
            </div>
            <div className="bg-jozi-gold p-8 rounded-[3rem] text-jozi-dark shadow-2xl flex flex-col items-center justify-center text-center">
               <p className="text-[10px] font-black uppercase text-jozi-dark/40 tracking-widest mb-1">Hub Rating</p>
               <p className="text-4xl font-black text-jozi-dark">Gold</p>
            </div>
         </div>
         <Globe className="absolute -bottom-10 -left-10 w-64 h-64 opacity-5 group-hover:rotate-180 transition-transform duration-[10000ms] pointer-events-none" />
      </div>
    </div>
  );
};

export default OrderAnalytics;
