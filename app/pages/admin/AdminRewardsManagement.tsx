
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
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
  Tag, 
  AlertCircle, 
  Save,
  Clock,
  ShieldCheck,
  Eye,
  MoreVertical,
  RotateCcw,
  LayoutGrid,
  List,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// --- MOCK DATA ---
interface Reward {
  id: string;
  name: string;
  type: 'Coupon' | 'Free Product' | 'Discount' | 'Extra Points';
  pointsRequired: number;
  status: 'Active' | 'Inactive';
  maxClaimsPerUser?: number;
  totalClaimed: number;
  expiryDays?: number;
  description: string;
  image?: string;
}

const INITIAL_REWARDS: Reward[] = [
  { id: 'rew-1', name: 'R100 Heritage Voucher', type: 'Coupon', pointsRequired: 1000, status: 'Active', maxClaimsPerUser: 1, totalClaimed: 450, expiryDays: 30, description: 'Store-wide R100 discount for any artisan workshop.', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=200' },
  { id: 'rew-2', name: 'Leather Keyring', type: 'Free Product', pointsRequired: 2500, status: 'Active', maxClaimsPerUser: 2, totalClaimed: 120, expiryDays: 0, description: 'Hand-stitched Zebu leather keyring from Maboneng Textiles.', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=200' },
  { id: 'rew-3', name: 'Priority Express Pass', type: 'Discount', pointsRequired: 500, status: 'Active', totalClaimed: 890, description: 'Upgrade any standard delivery to Express for free.', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=200' },
  { id: 'rew-4', name: 'Double XP Booster', type: 'Extra Points', pointsRequired: 2000, status: 'Inactive', maxClaimsPerUser: 1, totalClaimed: 42, expiryDays: 7, description: 'Earn double points on all purchases for 7 days.', image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=200' },
];

const ANALYTICS_DATA = [
  { name: '0-1k Pts', count: 12 },
  { name: '1k-5k Pts', count: 25 },
  { name: '5k-10k Pts', count: 8 },
  { name: '10k+ Pts', count: 5 },
];

const COLORS = ['#1B5E52', '#C7A16E', '#D4A854', '#0A1A17'];

const AdminRewardsManagement: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Form State
  const [formData, setFormData] = useState<Partial<Reward>>({
    name: '',
    type: 'Coupon',
    pointsRequired: 0,
    status: 'Active',
    maxClaimsPerUser: 1,
    expiryDays: 30,
    description: ''
  });

  const filteredRewards = useMemo(() => {
    return rewards.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'All' || r.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [rewards, searchQuery, filterType]);

  const handleOpenModal = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setFormData(reward);
    } else {
      setEditingReward(null);
      setFormData({
        name: '',
        type: 'Coupon',
        pointsRequired: 1000,
        status: 'Active',
        maxClaimsPerUser: 1,
        expiryDays: 30,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReward) {
      setRewards(prev => prev.map(r => r.id === editingReward.id ? { ...r, ...formData } as Reward : r));
    } else {
      const newReward: Reward = {
        ...formData as Reward,
        id: `rew-${Date.now()}`,
        totalClaimed: 0
      };
      setRewards(prev => [...prev, newReward]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Wipe this reward from the market? Historical claims will remain in user logs.')) {
      setRewards(prev => prev.filter(r => r.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-4 text-left">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                REWARD <br /><span className="text-jozi-gold">BOUTIQUE ENGINE.</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center">
                <Download className="w-4 h-4 mr-2 text-jozi-gold" />
                Redemption Ledger
              </button>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Craft New Reward
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { label: 'Total Active Rewards', val: rewards.filter(r => r.status === 'Active').length, icon: Gift, trend: '+2' },
              { label: 'Cumulative Claims', val: rewards.reduce((acc, r) => acc + r.totalClaimed, 0).toLocaleString(), icon: Zap, trend: '+14%' },
              { label: 'Avg Point Cost', val: Math.round(rewards.reduce((acc, r) => acc + r.pointsRequired, 0) / rewards.length), icon: Target, trend: 'Stable' },
              { label: 'Economy Burn Rate', val: '12.4k/day', icon: BarChart3, trend: '+8%' },
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

      {/* Analytics & Filters */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 lg:p-12 shadow-soft border border-jozi-forest/5 text-left">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight">Threshold Distribution</h3>
              <div className="p-3 bg-jozi-cream rounded-xl text-jozi-gold"><BarChart3 className="w-5 h-5" /></div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                    {ANALYTICS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Filters */}
          <div className="bg-jozi-forest p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6 text-left">
              <div className="flex items-center space-x-3">
                 <div className="p-3 bg-white/10 rounded-2xl"><Settings className="w-6 h-6 text-jozi-gold" /></div>
                 <h3 className="text-xl font-black uppercase tracking-tight">Market Filters</h3>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-jozi-gold tracking-widest ml-1">Search Items</label>
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                       <input 
                        type="text" 
                        placeholder="Voucher, Keyring..."
                        className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-sm font-bold outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-jozi-gold tracking-widest ml-1">Reward Class</label>
                    <select 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none cursor-pointer"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                       <option value="All" className="text-jozi-dark">All Types</option>
                       <option value="Coupon" className="text-jozi-dark">Coupons</option>
                       <option value="Free Product" className="text-jozi-dark">Products</option>
                       <option value="Discount" className="text-jozi-dark">Discounts</option>
                       <option value="Extra Points" className="text-jozi-dark">Point Boosters</option>
                    </select>
                 </div>
              </div>
              <button 
                onClick={() => {setSearchQuery(''); setFilterType('All');}}
                className="w-full py-4 bg-jozi-gold text-jozi-dark rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Reset View
              </button>
            </div>
            <Gift className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-8 px-4">
           <div>
              <p className="text-sm font-bold text-gray-400">Showing <span className="text-jozi-dark">{filteredRewards.length}</span> reward definitions</p>
           </div>
           <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-jozi-forest text-white' : 'text-gray-400 hover:bg-gray-50'}`}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-jozi-forest text-white' : 'text-gray-400 hover:bg-gray-50'}`}><List className="w-4 h-4" /></button>
           </div>
        </div>

        {/* Rewards List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
            >
              {filteredRewards.map((reward) => (
                <div key={reward.id} className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all group relative flex flex-col h-full ${reward.status === 'Active' ? 'border-jozi-forest/5 hover:border-jozi-forest/20 shadow-soft' : 'border-transparent grayscale opacity-60'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${reward.status === 'Active' ? 'bg-jozi-forest/5 text-jozi-forest' : 'bg-gray-100 text-gray-400'}`}>
                       {reward.type === 'Coupon' ? <Tag className="w-6 h-6" /> : reward.type === 'Free Product' ? <PackageIcon className="w-6 h-6" /> : reward.type === 'Discount' ? <CreditCard className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                    <button 
                      onClick={() => toggleStatus(reward.id)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${reward.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${reward.status === 'Active' ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex-grow space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">{reward.type}</p>
                      <h4 className="text-xl font-black text-jozi-dark tracking-tight leading-tight">{reward.name}</h4>
                    </div>
                    <div className="flex items-baseline space-x-1">
                       <span className="text-3xl font-black text-jozi-forest">{reward.pointsRequired}</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">{reward.description}</p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                     <div className="text-[10px] font-black uppercase text-gray-300 tracking-widest">
                       {reward.totalClaimed} Lifetime Claims
                     </div>
                     <div className="flex items-center space-x-2">
                       <button onClick={() => handleOpenModal(reward)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-jozi-forest hover:bg-white shadow-sm"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(reward.id)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500 hover:bg-white shadow-sm"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Placeholder */}
              <button 
                onClick={() => handleOpenModal()}
                className="rounded-[2.5rem] border-4 border-dashed border-gray-100 hover:border-jozi-gold/20 transition-all flex flex-col items-center justify-center p-12 text-center group min-h-[300px]"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-jozi-gold group-hover:text-white transition-all mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-gray-300 group-hover:text-jozi-forest transition-colors uppercase tracking-tight">New Reward</h4>
                <p className="text-xs text-gray-300 font-bold mt-2">Expand the redemption <br />catalog.</p>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="table-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100 overflow-hidden text-left"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest">Redemption Asset</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest">Type</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest">Cost (Pts)</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest">Status</th>
                    <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest">Usage</th>
                    <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-300 tracking-widest">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRewards.map((reward) => (
                    <tr key={reward.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-6 font-black text-jozi-forest text-sm">{reward.name}</td>
                      <td className="py-6">
                        <span className="px-3 py-1 bg-jozi-cream text-jozi-gold rounded-full text-[9px] font-black uppercase border border-jozi-gold/10">{reward.type}</span>
                      </td>
                      <td className="py-6 font-black text-jozi-dark">{reward.pointsRequired.toLocaleString()}</td>
                      <td className="py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${reward.status === 'Active' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                          {reward.status}
                        </span>
                      </td>
                      <td className="py-6 text-xs font-bold text-gray-400">{reward.totalClaimed} Claims</td>
                      <td className="py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => handleOpenModal(reward)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-jozi-forest"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(reward.id)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Action Footer */}
        <div className="mt-20 p-12 bg-white rounded-[4rem] border border-jozi-forest/5 shadow-soft flex flex-col md:flex-row items-center justify-between gap-12 text-left relative overflow-hidden group">
           <div className="flex items-start space-x-6 max-w-2xl relative z-10">
             <div className="w-16 h-16 bg-jozi-gold/10 rounded-3xl flex items-center justify-center text-jozi-gold shrink-0">
               <AlertCircle className="w-8 h-8" />
             </div>
             <div className="space-y-2">
               <h4 className="text-xl font-black text-jozi-forest uppercase tracking-tight leading-none">Market Cycle Reset</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                 You can manually trigger a claim reset for specific tiers. This will clear the "Max Claims per User" counters for all artisans and customers, typically used for seasonal campaigns.
               </p>
               <button className="text-[10px] font-black uppercase text-jozi-gold hover:text-jozi-forest transition-colors tracking-widest flex items-center">
                 Execute Global Reset Protocol <ChevronRight className="w-3 h-3 ml-1" />
               </button>
             </div>
           </div>
           <div className="flex gap-4 relative z-10">
             <button className="px-10 py-5 bg-jozi-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-forest transition-all shadow-xl">
               Audit Claim Logs
             </button>
           </div>
           <ShieldCheck className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </section>

      {/* Configuration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-10 lg:p-12 w-full max-w-3xl relative shadow-2xl overflow-hidden text-left"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                   <div className="flex items-center space-x-4 mb-2">
                      <div className="w-12 h-12 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold shadow-sm">
                         <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{editingReward ? 'Refine Asset' : 'New Asset Logic'}</h3>
                   </div>
                   <p className="text-gray-400 font-medium italic">Defining the value and thresholds for marketplace redemptions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Asset Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Free Leather Belt"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Redemption Class</label>
                      <select 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 appearance-none cursor-pointer"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      >
                         <option value="Coupon">Monetary Coupon</option>
                         <option value="Free Product">Physical Craft Product</option>
                         <option value="Discount">Percentage Discount</option>
                         <option value="Extra Points">Loyalty Multiplier</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Points Threshold</label>
                      <div className="relative">
                         <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-jozi-gold" />
                         <input 
                            type="number" 
                            className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-black text-lg text-jozi-forest outline-none"
                            value={formData.pointsRequired}
                            onChange={(e) => setFormData({...formData, pointsRequired: parseInt(e.target.value)})}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Max Claims / User</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none"
                        value={formData.maxClaimsPerUser}
                        onChange={(e) => setFormData({...formData, maxClaimsPerUser: parseInt(e.target.value)})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Validity Lifecycle (Days)</label>
                      <div className="relative">
                         <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                         <input 
                            type="number" 
                            className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none"
                            value={formData.expiryDays}
                            onChange={(e) => setFormData({...formData, expiryDays: parseInt(e.target.value)})}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Active Visibility</label>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active'})}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.status === 'Active' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-400'}`}
                      >
                         <span className="font-black text-xs uppercase tracking-widest">Currently {formData.status}</span>
                         {formData.status === 'Active' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </button>
                   </div>

                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Asset Description</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-gray-50 rounded-3xl px-6 py-4 font-bold text-jozi-forest outline-none resize-none border-2 border-transparent focus:border-jozi-gold/20"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Detailed explanation of what the user receives..."
                      />
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-5 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Abort Changes</button>
                  <button type="submit" className="flex-grow py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center">
                    <Save className="w-4 h-4 mr-2" /> Commit Redemptions
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

const PackageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);

export default AdminRewardsManagement;
