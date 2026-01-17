import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Truck, 
  DollarSign, 
  PieChart as PieIcon, 
  ArrowLeft, 
  Download, 
  Calendar, 
  ChevronRight, 
  Search, 
  Filter, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Target,
  ArrowUpRight,
  RefreshCw,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShoppingBag,
  CreditCard,
  UserPlus,
  Percent,
  Wallet,
  Globe,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

// --- MOCK DATA ---
const GLOBAL_REVENUE_TREND = [
  { name: 'Week 1', revenue: 450000, commission: 45000 },
  { name: 'Week 2', revenue: 520000, commission: 52000 },
  { name: 'Week 3', revenue: 480000, commission: 48000 },
  { name: 'Week 4', revenue: 610000, commission: 61000 },
  { name: 'Week 5', revenue: 590000, commission: 59000 },
  { name: 'Week 6', revenue: 740000, commission: 74000 },
];

const AdminPlatformAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'customers' | 'logistics'>('overview');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Platform Header */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-4 text-left">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Platform <br /><span className="text-jozi-gold">Command Center.</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <select 
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-11 pr-10 py-3 text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer shadow-soft hover:bg-white/15 transition-all text-white"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option className="text-jozi-dark">Last 7 Days</option>
                  <option className="text-jozi-dark">Last 30 Days</option>
                  <option className="text-jozi-dark">Quarter to Date</option>
                  <option className="text-jozi-dark">All Time</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
              <button className="bg-jozi-gold text-jozi-dark p-3 rounded-xl shadow-xl shadow-jozi-gold/20 hover:scale-105 transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Master KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { label: 'Total GMV', val: 'R2.4M', icon: Globe, trend: '+18%' },
              { label: 'Platform Yield', val: 'R184k', icon: Percent, trend: '+12%' },
              { label: 'Active Vendors', val: '142', icon: Layers, trend: '+4' },
              { label: 'Total Orders', val: '4.2k', icon: ShoppingBag, trend: '+22%' },
              { label: 'Repeat Rate', val: '42%', icon: RefreshCw, trend: '+5%' },
              { label: 'Avg Order Value', val: 'R590', icon: Target, trend: '-2%' },
              { label: 'Pending Payouts', val: 'R124k', icon: Wallet, trend: 'Normal' },
              { label: 'System Health', val: '99.9%', icon: Zap, trend: 'Stable' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 min-w-[140px] text-left group hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-jozi-gold" />
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${kpi.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>{kpi.trend}</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-none">{kpi.label}</p>
                <h4 className="text-lg font-black text-white mt-1">{kpi.val}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-6 lg:px-12 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-2 shadow-xl border border-jozi-forest/5 flex items-center justify-between mb-12">
          <div className="flex space-x-1">
            {['overview', 'revenue', 'customers', 'logistics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-jozi-forest text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
               <div className="bg-white p-10 rounded-5xl shadow-soft border border-gray-100 text-left">
                  <h3 className="text-2xl font-black text-jozi-dark mb-10">Revenue Velocity</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={GLOBAL_REVENUE_TREND}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#C7A16E" strokeWidth={4} fillOpacity={0.1} fill="#C7A16E" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default AdminPlatformAnalytics;