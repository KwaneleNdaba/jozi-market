import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  DollarSign, Store, Users, TrendingUp, LayoutDashboard, 
  ArrowUpRight, Zap 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { name: 'Week 1', gmv: 450000 },
  { name: 'Week 2', gmv: 520000 },
  { name: 'Week 3', gmv: 480000 },
  { name: 'Week 4', gmv: 610000 },
];

const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="px-6 lg:px-12 py-10 space-y-12 text-left">
      <header>
        <h2 className="text-4xl font-black text-jozi-dark uppercase tracking-tighter">Command Dashboard</h2>
        <p className="text-gray-400 font-medium italic">Platform Management & Performance Summary</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Platform GMV', value: 'R2.4M', trend: '+18.2%', icon: DollarSign },
          { label: 'Active Vendors', value: '142', trend: '+12%', icon: Store },
          { label: 'Total Users', value: '18,450', trend: '+2.4k', icon: Users },
          { label: 'Platform Rev', value: 'R184k', trend: '+14%', icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-4xl shadow-soft border border-gray-100 relative group overflow-hidden">
             <div className="flex items-center justify-between mb-4">
               <div className="p-3 bg-gray-50 rounded-2xl"><stat.icon className="w-6 h-6 text-jozi-dark" /></div>
               <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{stat.trend}</span>
             </div>
             <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
             <h3 className="text-3xl font-black text-jozi-dark mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="bg-jozi-forest p-10 rounded-5xl text-white space-y-6 relative overflow-hidden group shadow-2xl">
           <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-jozi-gold rounded-3xl flex items-center justify-center text-jozi-dark shadow-xl">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tight">Governance HUB</h4>
                <p className="text-jozi-cream/60 text-sm font-medium leading-relaxed mt-2">Access the enhanced Admin Overview for deep-dive sentiment analysis and commercial trajectory tracking.</p>
              </div>
              <Link href="/admin/overview" className="inline-flex items-center space-x-2 bg-white text-jozi-dark px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all">
                <span>Open Overview</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
           </div>
           <Zap className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
         </div>

        <div className="lg:col-span-2 bg-white p-10 rounded-5xl shadow-soft border border-jozi-forest/5">
          <h3 className="text-xl font-black text-jozi-dark mb-8 uppercase tracking-tight">Monthly Revenue Performance</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="gmv" stroke="#C7A16E" strokeWidth={4} fillOpacity={0.1} fill="#C7A16E" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;