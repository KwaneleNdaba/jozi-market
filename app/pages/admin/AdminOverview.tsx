import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  ChevronRight, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ThumbsUp, 
  ThumbsDown, 
  Tag, 
  Gavel,
  Store,
  Percent,
  Wallet,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

// --- MOCK DATA ---
const REVENUE_TREND = [
  { name: 'Week 1', revenue: 450000, orders: 120 },
  { name: 'Week 2', revenue: 520000, orders: 145 },
  { name: 'Week 3', revenue: 480000, orders: 132 },
  { name: 'Week 4', revenue: 610000, orders: 188 },
  { name: 'Week 5', revenue: 590000, orders: 165 },
  { name: 'Week 6', revenue: 740000, orders: 210 },
];

const RATING_DISTRIBUTION = [
  { star: '5 Star', count: 850, color: '#1B5E52' },
  { star: '4 Star', count: 320, color: '#C7A16E' },
  { star: '3 Star', count: 120, color: '#F59E0B' },
  { star: '2 Star', count: 45, color: '#F97316' },
  { star: '1 Star', count: 15, color: '#EF4444' },
];

const ORDER_STATUS_DIST = [
  { name: 'Delivered', value: 65, color: '#1B5E52' },
  { name: 'Processing', value: 20, color: '#3b82f6' },
  { name: 'Transit', value: 10, color: '#C7A16E' },
  { name: 'Cancelled', value: 5, color: '#EF4444' },
];

const TOP_RATED_VENDORS = [
  { id: 'v1', name: 'Maboneng Textiles', rating: 4.9, reviews: 245, orders: 1240, status: 'Top Tier' },
  { id: 'v2', name: 'Soweto Gold', rating: 4.8, reviews: 188, orders: 950, status: 'Top Tier' },
  { id: 'v4', name: 'Jozi Apothecary', rating: 4.7, reviews: 312, orders: 2100, status: 'Active' },
];

const LOW_RATED_VENDORS = [
  { id: 'v9', name: 'Westcliff Curios', rating: 2.1, neg: 14, lastReview: '3 hours ago', action: 'Investigate' },
  { id: 'v12', name: 'Newtown Vintage', rating: 2.8, neg: 8, lastReview: '1 day ago', action: 'Warning' },
];

const SENTIMENT_TAGS = [
  { tag: 'High Quality', sentiment: 'pos' },
  { tag: 'Fast Shipping', sentiment: 'pos' },
  { tag: 'Authentic', sentiment: 'pos' },
  { tag: 'Eco Friendly', sentiment: 'pos' },
  { tag: 'Delayed Dispatch', sentiment: 'neg' },
  { tag: 'Wrong Size', sentiment: 'neg' },
  { tag: 'Great Service', sentiment: 'pos' },
  { tag: 'Bespoke', sentiment: 'pos' },
];

const AdminOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'governance' | 'reviews'>('governance');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 text-left">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Market <br /><span className="text-jozi-gold">Overview.</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex p-1 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <button
                  onClick={() => setActiveTab('governance')}
                  className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === 'governance' ? 'bg-jozi-gold text-jozi-dark shadow-lg' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Commercials
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === 'reviews' ? 'bg-jozi-gold text-jozi-dark shadow-lg' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Sentiment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 lg:px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-lg border border-gray-100">

          <AnimatePresence mode="wait">
            {activeTab === 'governance' && (
              <motion.div 
                key="governance" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Market GMV', val: 'R2.4M', trend: '+18%', icon: DollarSign, color: 'text-emerald-500' },
                { label: 'Active Fleet', val: '142', trend: '+4%', icon: Store, color: 'text-jozi-gold' },
                { label: 'Order Velocity', val: '1.2/min', trend: 'Peak', icon: Zap, color: 'text-blue-500' },
                { label: 'Neighbor Count', val: '18.4k', trend: '+2.1k', icon: Users, color: 'text-purple-500' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100 text-left relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gray-50 rounded-2xl"><kpi.icon className="w-6 h-6 text-jozi-dark" /></div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{kpi.trend}</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{kpi.label}</p>
                    <h3 className={`text-3xl font-black text-jozi-dark mt-2 ${kpi.color}`}>{kpi.val}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {/* Revenue velocity */}
              <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Revenue Trajectory</h3>
                   <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">GMV</span>
                      </div>
                   </div>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_TREND}>
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
                      <Area type="monotone" dataKey="revenue" stroke="#C7A16E" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Mix */}
              <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-jozi-dark mb-2 uppercase tracking-tight">Cycle Health</h3>
                  <p className="text-xs text-gray-400 font-medium mb-10">Real-time status distribution.</p>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ORDER_STATUS_DIST} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                          {ORDER_STATUS_DIST.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  {ORDER_STATUS_DIST.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: s.color }} />
                        <span className="font-bold text-gray-500 uppercase tracking-widest">{s.name}</span>
                      </div>
                      <span className="font-black text-jozi-dark">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                 {/* Trust Leaders */}
                 <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100">
                    <div className="flex items-center space-x-3 mb-10">
                      <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><ThumbsUp className="w-5 h-5" /></div>
                      <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Trust Leaders</h3>
                    </div>
                    <div className="space-y-6">
                      {TOP_RATED_VENDORS.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-emerald-500/20 transition-all">
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-emerald-600 border-2 border-emerald-50 uppercase">
                                {v.name[0]}
                              </div>
                              <div>
                                <p className="font-black text-sm text-jozi-dark">{v.name}</p>
                                <div className="flex items-center text-jozi-gold mt-1">
                                   <Star className="w-3 h-3 fill-current mr-1" />
                                   <span className="text-[10px] font-black">{v.rating} ({v.reviews} Reviews)</span>
                                </div>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Governance Alerts */}
                 <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100">
                    <div className="flex items-center space-x-3 mb-10">
                      <div className="p-3 bg-red-50 rounded-2xl text-red-600"><ThumbsDown className="w-5 h-5" /></div>
                      <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Governance Alerts</h3>
                    </div>
                    <div className="space-y-6">
                      {LOW_RATED_VENDORS.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-red-50/30 rounded-[2.5rem] border border-red-100/50 group">
                           <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-red-500 border-2 border-red-50 uppercase">
                                {v.name[0]}
                              </div>
                              <div>
                                <p className="font-black text-sm text-jozi-dark">{v.name}</p>
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">{v.neg} Critical Reports</p>
                              </div>
                           </div>
                           <button className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all">
                             {v.action}
                           </button>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;