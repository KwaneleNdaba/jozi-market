
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  BarChart3, 
  Zap, 
  Settings, 
  CreditCard, 
  AlertCircle, 
  Save,
  Clock,
  ShieldCheck,
  Eye,
  MoreVertical,
  RotateCcw,
  LayoutGrid,
  List,
  Target,
  Percent,
  DollarSign,
  Users,
  Store,
  Package,
  Calendar,
  TrendingUp,
  Ticket
} from 'lucide-react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';

// --- MOCK DATA ---
interface Voucher {
  id: string;
  code: string;
  name: string;
  type: 'Percentage' | 'Fixed Amount';
  value: number;
  applicableTo: 'All Users' | 'Specific Users' | 'Specific Vendor' | 'Specific Product';
  targetName?: string; // e.g. "Maboneng Textiles" or "Lerato D."
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Scheduled';
  maxUsage: number;
  usageCount: number;
  description: string;
}

const INITIAL_VOUCHERS: Voucher[] = [
  { id: 'v-1', code: 'JOZI-WELCOME', name: 'New Neighbor Discount', type: 'Percentage', value: 20, applicableTo: 'All Users', expiryDate: '2024-12-31', status: 'Active', maxUsage: 1000, usageCount: 452, description: '20% off for first-time shoppers on the platform.' },
  { id: 'v-2', code: 'MABONENG-15', name: 'Maboneng Flash Sale', type: 'Percentage', value: 15, applicableTo: 'Specific Vendor', targetName: 'Maboneng Textiles', expiryDate: '2024-10-30', status: 'Active', maxUsage: 100, usageCount: 88, description: 'Limited time offer for textile workshop items.' },
  { id: 'v-3', code: 'GOLD-SHIP', name: 'Free Shipping (Gold Tier)', type: 'Fixed Amount', value: 75, applicableTo: 'Specific Users', targetName: 'Gold Loyalty Members', expiryDate: '2024-11-15', status: 'Scheduled', maxUsage: 500, usageCount: 0, description: 'Exclusive delivery voucher for loyalty tier 3+.' },
  { id: 'v-4', code: 'LUV-LOCAL', name: 'Local Artisan Support', type: 'Fixed Amount', value: 50, applicableTo: 'All Users', expiryDate: '2024-09-01', status: 'Expired', maxUsage: 2000, usageCount: 1980, description: 'Seasonal R50 voucher for supporting local crafters.' },
];

const REDEMPTION_TREND = [
  { name: 'Week 1', claims: 120 },
  { name: 'Week 2', claims: 245 },
  { name: 'Week 3', claims: 190 },
  { name: 'Week 4', claims: 320 },
  { name: 'Week 5', claims: 280 },
  { name: 'Week 6', claims: 410 },
];

const STATUS_DIST = [
  { name: 'Active', value: 12, color: '#1B5E52' },
  { name: 'Expired', value: 8, color: '#C7A16E' },
  { name: 'Scheduled', value: 4, color: '#3b82f6' },
];

const AdminVoucherManagement: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [activeTab, setActiveTab] = useState<'registry' | 'analytics'>('registry');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Form State
  const [formData, setFormData] = useState<Partial<Voucher>>({
    code: '',
    name: '',
    type: 'Percentage',
    value: 0,
    applicableTo: 'All Users',
    expiryDate: '',
    status: 'Active',
    maxUsage: 100,
    description: ''
  });

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || v.applicableTo === filterType;
      return matchesSearch && matchesType;
    });
  }, [vouchers, searchQuery, filterType]);

  const handleOpenModal = (voucher?: Voucher) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setFormData(voucher);
    } else {
      setEditingVoucher(null);
      setFormData({
        code: '',
        name: '',
        type: 'Percentage',
        value: 10,
        applicableTo: 'All Users',
        expiryDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        maxUsage: 500,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVoucher) {
      setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? { ...v, ...formData } as Voucher : v));
    } else {
      const newVoucher: Voucher = {
        ...formData as Voucher,
        id: `v-${Date.now()}`,
        usageCount: 0
      };
      setVouchers([newVoucher, ...vouchers]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Decommission this voucher code? It will no longer be valid for future transactions.')) {
      setVouchers(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Admin Header */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-4 text-left">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                DISCOUNT <br /><span className="text-jozi-gold">ORCHESTRATOR.</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center">
                <Download className="w-4 h-4 mr-2 text-jozi-gold" />
                Voucher Audit
              </button>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Forge New Voucher
              </button>
            </div>
          </div>

          {/* Core Analytics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { label: 'Total Issued', val: vouchers.length, icon: Ticket, trend: '+2' },
              { label: 'Market Redemptions', val: vouchers.reduce((acc, v) => acc + v.usageCount, 0).toLocaleString(), icon: Zap, trend: '+22%' },
              { label: 'Active Promotions', val: vouchers.filter(v => v.status === 'Active').length, icon: Tag, trend: 'Stable' },
              { label: 'Economy Impact', val: 'R42,150', icon: DollarSign, trend: '+8%' },
            ].map((kpi, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 min-w-[150px] text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-jozi-gold" />
                  <span className="text-[8px] font-black uppercase text-emerald-400">{kpi.trend}</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{kpi.label}</p>
                <h4 className="text-lg font-black text-white mt-1">{kpi.val}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Switcher & Dashboard */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-2 shadow-xl border border-jozi-forest/5 flex items-center justify-between mb-12">
          <div className="flex space-x-1">
            {[
              { id: 'registry', label: 'Voucher Registry', icon: Ticket },
              { id: 'analytics', label: 'Campaign Yield', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 transition-all ${
                  activeTab === tab.id ? 'bg-jozi-forest text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center pr-6 space-x-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Economic Engine Active</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'registry' ? (
            <motion.div 
              key="registry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Filter Section */}
              <div className="bg-white rounded-5xl p-8 lg:p-12 shadow-soft border border-gray-100 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search code or name..." 
                      className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-jozi-dark outline-none border-2 border-transparent focus:border-jozi-gold/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-jozi-dark outline-none appearance-none cursor-pointer"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="All">All Targets</option>
                      <option value="All Users">All Users</option>
                      <option value="Specific Vendor">Specific Vendors</option>
                      <option value="Specific Product">Specific Products</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="date" 
                      className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-jozi-dark outline-none appearance-none"
                    />
                  </div>
                  <button 
                    onClick={() => {setSearchQuery(''); setFilterType('All');}}
                    className="py-3 bg-jozi-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all"
                  >
                    Clear Market Filters
                  </button>
                </div>

                {/* Vouchers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Logic / Code</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Applicable To</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usage</th>
                        <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredVouchers.map((v) => (
                        <tr key={v.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-6">
                            <div className="space-y-1">
                              <p className="font-black text-jozi-dark text-sm leading-tight">{v.name}</p>
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black text-jozi-gold tracking-widest border border-jozi-gold/20 px-2 py-0.5 rounded uppercase">{v.code}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center space-x-2 text-jozi-forest">
                              {v.type === 'Percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                              <span className="font-black text-sm">{v.value}{v.type === 'Percentage' ? '%' : ' OFF'}</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <div className="space-y-1">
                               <p className="text-xs font-bold text-gray-500">{v.applicableTo}</p>
                               {v.targetName && <p className="text-[9px] font-black uppercase text-jozi-gold tracking-widest leading-none">{v.targetName}</p>}
                            </div>
                          </td>
                          <td className="py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              v.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              v.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                              'bg-gray-100 text-gray-400 border-gray-200'
                            }`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="py-6">
                            <div className="space-y-1">
                               <p className="text-sm font-black text-jozi-dark">{v.usageCount} / {v.maxUsage}</p>
                               <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-jozi-gold" style={{ width: `${(v.usageCount/v.maxUsage)*100}%` }} />
                               </div>
                            </div>
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button onClick={() => handleOpenModal(v)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-jozi-forest hover:bg-white shadow-sm transition-all"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(v.id)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500 hover:bg-white shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Redemption Over Time */}
                <div className="lg:col-span-2 bg-white p-10 rounded-5xl shadow-soft border border-gray-100 text-left">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-jozi-dark">Redemption Velocity</h3>
                      <p className="text-xs text-gray-400 font-medium">Claims processed across the last 6 weeks.</p>
                    </div>
                    <div className="flex space-x-6">
                       <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Claims</span>
                       </div>
                    </div>
                  </div>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REDEMPTION_TREND}>
                        <defs>
                          <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C7A16E" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#C7A16E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="claims" stroke="#C7A16E" strokeWidth={4} fillOpacity={1} fill="url(#colorClaims)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Mix */}
                <div className="bg-white p-10 rounded-5xl shadow-soft border border-gray-100 text-left">
                   <h3 className="text-2xl font-black text-jozi-dark mb-2">Campaign Distribution</h3>
                   <p className="text-xs text-gray-400 font-medium mb-10">Voucher breakdown by state.</p>
                   <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={STATUS_DIST}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {STATUS_DIST.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                   </div>
                   <div className="space-y-4 mt-8">
                      {STATUS_DIST.map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: s.color }} />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.name}</span>
                          </div>
                          <span className="font-black text-jozi-dark">{s.value} Definitive</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Strategic Insights Card */}
              <div className="bg-jozi-forest p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 border border-jozi-forest/5 shadow-soft relative overflow-hidden group">
                 <div className="relative z-10 space-y-6 text-left max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/10 rounded-2xl shadow-xl"><ShieldCheck className="w-8 h-8 text-jozi-gold" /></div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Promotion Strategy <br /><span className="text-jozi-gold">Yield Loop.</span></h2>
                    </div>
                    <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">
                      "Market data indicates <span className="text-white font-bold">20% Percentage Discounts</span> yield 14% higher conversion than fixed amount vouchers for new users. Recommend pivoting upcoming 'Black Friday' campaigns towards percentage tiers."
                    </p>
                    <div className="flex gap-4">
                       <button className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">Apply Strategic Pivot</button>
                       <button className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">Audit Fiscal Impact</button>
                    </div>
                 </div>
                 <Ticket className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CREATE/EDIT VOUCHER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-5xl p-10 lg:p-12 w-full max-w-3xl relative shadow-2xl overflow-hidden text-left"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                   <div className="flex items-center space-x-4 mb-2">
                      <div className="w-12 h-12 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold shadow-sm">
                         <Tag className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{editingVoucher ? 'Refine Logic' : 'New Voucher Genesis'}</h3>
                   </div>
                   <p className="text-gray-400 font-medium italic">Defining a specific commercial incentive for the Jozi Market ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Asset Code</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 placeholder:text-gray-300"
                        placeholder="e.g. JOZI-GOLD-24"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Descriptive Title</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                        placeholder="e.g. Spring Flash Discount"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Incentive Class</label>
                      <div className="flex gap-2">
                        {['Percentage', 'Fixed Amount'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, type: type as any})}
                            className={`grow py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                              formData.type === type ? 'bg-jozi-forest border-jozi-forest text-white shadow-md' : 'bg-white border-gray-100 text-gray-400'
                            }`}
                          >
                            {type === 'Percentage' ? <Percent className="w-3 h-3 mr-2 inline" /> : <DollarSign className="w-3 h-3 mr-2 inline" />}
                            {type}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Incentive Value</label>
                      <div className="relative">
                        <Zap className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-jozi-gold" />
                        <input 
                          type="number" 
                          required
                          className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-black text-lg text-jozi-forest outline-none"
                          value={formData.value}
                          onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Dimension</label>
                      <select 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none appearance-none cursor-pointer"
                        value={formData.applicableTo}
                        onChange={(e) => setFormData({...formData, applicableTo: e.target.value as any})}
                      >
                         <option value="All Users">Universal (All Users)</option>
                         <option value="Specific Users">Specific Loyalty Segment</option>
                         <option value="Specific Vendor">Artisan Specific</option>
                         <option value="Specific Product">Product Targeted</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Lifecycle Expiry</label>
                      <input 
                        type="date" 
                        required
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Max Fleet Usage</label>
                      <input 
                        type="number" 
                        required
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none"
                        value={formData.maxUsage}
                        onChange={(e) => setFormData({...formData, maxUsage: Number(e.target.value)})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Execution Status</label>
                      <select 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none appearance-none cursor-pointer"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      >
                         <option value="Active">Live (Active)</option>
                         <option value="Scheduled">Scheduled (Staging)</option>
                         <option value="Expired">Decommissioned (Expired)</option>
                      </select>
                   </div>

                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Asset Description</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-gray-50 rounded-3xl px-6 py-4 font-bold text-jozi-forest outline-none resize-none border-2 border-transparent focus:border-jozi-gold/20"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Internal notes or public description of the incentive..."
                      />
                   </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start space-x-4">
                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                   <p className="text-xs text-amber-800 font-medium leading-relaxed italic">Changes to <span className="font-black">Universal Asset Codes</span> immediately propagate to all neighbor checkouts. Ensure logic accuracy before deployment.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="grow py-5 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Discard Draft</button>
                  <button type="submit" className="grow py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center">
                    <Save className="w-4 h-4 mr-2" /> Commit Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVoucherManagement;
