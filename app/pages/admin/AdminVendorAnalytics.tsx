import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Truck, 
  DollarSign, 
  Star, 
  ArrowLeft, 
  Download, 
  Calendar, 
  ChevronRight, 
  ChevronDown,
  Search, 
  Filter, 
  Zap, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  PieChart as PieIcon, 
  LineChart as LineIcon,
  ShoppingBag,
  Target,
  ArrowUpRight,
  RefreshCw,
  Share2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { vendors as MOCK_VENDORS } from '../../data/mockData';

// --- MOCK DATA FOR ANALYTICS ---
const REVENUE_DATA = [
  { name: 'Mon', revenue: 4200, orders: 12 },
  { name: 'Tue', revenue: 3800, orders: 10 },
  { name: 'Wed', revenue: 5100, orders: 15 },
  { name: 'Thu', revenue: 4900, orders: 14 },
  { name: 'Fri', revenue: 7200, orders: 22 },
  { name: 'Sat', revenue: 8500, orders: 28 },
  { name: 'Sun', revenue: 6100, orders: 19 },
];

const ORDER_STATUS_DATA = [
  { name: 'Delivered', value: 45, color: '#1B5E52' },
  { name: 'In Transit', value: 25, color: '#C7A16E' },
  { name: 'Processing', value: 20, color: '#3b82f6' },
  { name: 'Cancelled', value: 10, color: '#ef4444' },
];

const CATEGORY_PERFORMANCE = [
  { category: 'Dresses', sales: 120, revenue: 150000 },
  { category: 'Accessories', sales: 85, revenue: 27200 },
  { category: 'Footwear', sales: 45, revenue: 83250 },
  { category: 'Textiles', sales: 30, revenue: 22500 },
];

const TOP_PRODUCTS = [
  { id: 'p1', name: 'Shweshwe Evening Dress', sales: 42, growth: '+12%', stock: 15 },
  { id: 'p6', name: 'Veld Leather Boots', sales: 28, growth: '+5%', stock: 8 },
  { id: 'p10', name: 'Heritage Silk Scarf', sales: 19, growth: '-2%', stock: 14 },
  { id: 'p1', name: 'Indigo Silk Wrap', sales: 15, growth: '+18%', stock: 3 },
];

const AdminVendorAnalytics: React.FC = () => {
  const [selectedVendorId, setSelectedVendorId] = useState(MOCK_VENDORS[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'logistics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const selectedVendor = useMemo(() => 
    MOCK_VENDORS.find(v => v.id === selectedVendorId) || MOCK_VENDORS[0]
  , [selectedVendorId]);

  const filteredVendors = MOCK_VENDORS.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    gmv: "R84,250",
    orders: "142",
    aov: "R593",
    conversion: "3.2%",
    payout: "R76,120",
    commission: "R8,130"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Vendor Selection Sidebar */}
      <aside className="w-full lg:w-80 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-30">
        <div className="p-8 border-b border-gray-50 space-y-6">
          <Link href="/admin/dashboard" className="inline-flex items-center text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-jozi-forest transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
          </Link>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-jozi-forest tracking-tight uppercase">Artisan Directory</h2>
            <p className="text-gray-400 text-xs font-medium italic">Select workshop to analyze.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-jozi-gold/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grow overflow-y-auto p-4 space-y-2">
          {filteredVendors.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVendorId(v.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center space-x-4 border-2 ${
                selectedVendorId === v.id 
                  ? 'bg-jozi-forest border-jozi-forest shadow-xl text-white' 
                  : 'bg-white border-transparent hover:bg-gray-50 text-jozi-dark'
              }`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0">
                <img src={v.image} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-sm truncate">{v.name}</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedVendorId === v.id ? 'text-jozi-gold' : 'text-gray-400'}`}>
                  {v.location}
                </p>
              </div>
              <ChevronDown className={`ml-auto w-4 h-4 opacity-40 ${selectedVendorId === v.id ? 'text-white' : ''}`} />
            </button>
          ))}
        </div>
        
        <div className="p-8 border-t border-gray-50">
           <button className="w-full py-4 bg-jozi-gold text-jozi-dark rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-jozi-gold/20 hover:scale-105 transition-all">
             Initialize Payout Cycle
           </button>
        </div>
      </aside>

      {/* Main Dashboard Canvas */}
      <main className="grow p-6 lg:p-12 space-y-10 overflow-x-hidden">
        {/* Header Summary */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
               <img src={selectedVendor.image} className="w-full h-full object-cover" />
               <div className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center space-x-3">
                 <h1 className="text-4xl font-black text-jozi-dark tracking-tighter uppercase">{selectedVendor.name}</h1>
                 <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Active Partner</span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Joined {selectedVendor.planTier} Tier • {selectedVendor.location} Hub</p>
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center text-jozi-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(selectedVendor.rating) ? 'fill-current' : 'opacity-20'}`} />
                  ))}
                  <span className="text-xs font-black text-jozi-dark ml-2">{selectedVendor.rating} Rating</span>
                </div>
                <div className="h-3 w-px bg-gray-200" />
                <button className="text-[10px] font-black text-jozi-forest uppercase hover:underline">View Public Storefront</button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="bg-white border border-gray-100 rounded-xl pl-11 pr-10 py-3 text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer shadow-soft text-left"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Quarter to Date</option>
                <option>All Time</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>
            <button className="bg-white p-3 rounded-xl border border-gray-100 shadow-soft hover:text-jozi-gold transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 space-x-10">
          {[
            { id: 'overview', label: 'Command Center', icon: BarChart3 },
            { id: 'sales', label: 'Financials & Payouts', icon: DollarSign },
            { id: 'inventory', label: 'Inventory & Stock', icon: Package },
            { id: 'logistics', label: 'Shipping & Logistics', icon: Truck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-2 transition-all relative ${
                activeTab === tab.id ? 'text-jozi-forest' : 'text-gray-400 hover:text-jozi-forest'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1.5 bg-jozi-gold rounded-full" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="tab-overview" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Gross Revenue', val: stats.gmv, trend: '+18.4%', icon: DollarSign, color: 'text-emerald-500' },
                  { label: 'Order Volume', val: stats.orders, trend: '+5.2%', icon: ShoppingBag, color: 'text-blue-500' },
                  { label: 'Avg Order Value', val: stats.aov, trend: '-2.1%', icon: Target, color: 'text-orange-500' },
                  { label: 'Net Payout', val: stats.payout, trend: '+15%', icon: Wallet, color: 'text-jozi-gold' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white p-8 rounded-4xl shadow-soft border border-gray-100 relative group overflow-hidden text-left">
                     <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gray-50 rounded-2xl"><kpi.icon className="w-6 h-6 text-jozi-dark" /></div>
                        <span className={`text-[9px] font-black ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-md`}>{kpi.trend}</span>
                     </div>
                     <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{kpi.label}</p>
                     <h3 className={`text-3xl font-black text-jozi-dark mt-2 ${kpi.color}`}>{kpi.val}</h3>
                  </div>
                ))}
              </div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Timeline */}
                <div className="lg:col-span-2 bg-white p-10 rounded-5xl shadow-soft border border-gray-100 text-left">xl
                  <div className="flex items-center justify-between mb-10">
                     <div>
                       <h3 className="text-xl font-black text-jozi-dark">Revenue Velocity</h3>
                       <p className="text-xs text-gray-400 font-medium">Daily performance analysis for current cycle.</p>
                     </div>
                     <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                           <span className="text-[9px] font-black uppercase text-gray-400">Projected</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                           <span className="text-[9px] font-black uppercase text-gray-400">Actual</span>
                        </div>
                     </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1B5E52" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1B5E52" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                          cursor={{ stroke: '#C7A16E', strokeWidth: 2 }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#1B5E52" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white p-10 rounded-5xl shadow-soft border border-gray-100 text-left">
                  <h3 className="text-xl font-black text-jozi-dark mb-2">Cycle Health</h3>
                  <p className="text-xs text-gray-400 font-medium mb-8">Fulfillment distribution.</p>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ORDER_STATUS_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {ORDER_STATUS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 mt-4">
                    {ORDER_STATUS_DATA.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: s.color }} />
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
          {/* other activeTab renders follow similar layout... */}
        </AnimatePresence>
      </main>
    </div>
  );
};

const Wallet = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15" />
  </svg>
);

export default AdminVendorAnalytics;