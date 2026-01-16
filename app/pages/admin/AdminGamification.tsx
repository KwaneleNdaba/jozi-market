
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Zap, 
  Gift, 
  Settings2, 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Save, 
  Download, 
  BarChart3, 
  LineChart as LineIcon, 
  Users, 
  Flame, 
  Clock, 
  Edit3, 
  ShieldCheck, 
  RefreshCw,
  ShoppingBag,
  Star,
  Gamepad2,
  Trash2,
  Lock,
  ArrowUpRight,
  TrendingUp,
  // Added missing imports for lucide-react icons
  RotateCcw,
  MoreHorizontal,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie,
  // Added missing imports for recharts components
  AreaChart, Area
} from 'recharts';

// --- MOCK DATA ---
const ENGAGEMENT_DATA = [
  { name: 'Mon', points: 4200, claims: 12 },
  { name: 'Tue', points: 3800, claims: 15 },
  { name: 'Wed', points: 5100, claims: 22 },
  { name: 'Thu', points: 4900, claims: 18 },
  { name: 'Fri', points: 7200, claims: 34 },
  { name: 'Sat', points: 8500, claims: 45 },
  { name: 'Sun', points: 6100, claims: 28 },
];

const POINTS_PER_ACTIVITY = [
  { activity: 'Purchases', points: 25000, color: '#1B5E52' },
  { activity: 'Referrals', points: 18000, color: '#C7A16E' },
  { activity: 'Reviews', points: 12000, color: '#3b82f6' },
  { activity: 'Daily Login', points: 8000, color: '#f59e0b' },
  { activity: 'Quizzes', points: 5000, color: '#ef4444' },
];

interface GamificationActivity {
  id: string;
  name: string;
  description: string;
  pointsPerAction: number;
  rewardType: 'Coupon' | 'Points' | 'Free Product' | 'Discount';
  status: 'Active' | 'Inactive';
  dailyCap: number;
  expiryDays: number;
  icon: any;
}

const INITIAL_ACTIVITIES: GamificationActivity[] = [
  { id: 'act-1', name: 'Order Completion', description: 'Earn 1 point for every R1 spent on the marketplace.', pointsPerAction: 1, rewardType: 'Points', status: 'Active', dailyCap: 10000, expiryDays: 365, icon: ShoppingBag },
  { id: 'act-2', name: 'Artisan Referral', description: 'Verified friend registration and first purchase.', pointsPerAction: 500, rewardType: 'Coupon', status: 'Active', dailyCap: 2500, expiryDays: 90, icon: Users },
  { id: 'act-3', name: 'Masterpiece Review', description: 'Leave a 5-star review with a photo for any product.', pointsPerAction: 150, rewardType: 'Points', status: 'Active', dailyCap: 450, expiryDays: 180, icon: Star },
  { id: 'act-4', name: 'Daily Market Visit', description: 'Consistent daily login streak bonus.', pointsPerAction: 20, rewardType: 'Points', status: 'Active', dailyCap: 20, expiryDays: 30, icon: Clock },
  { id: 'act-5', name: 'Heritage Quiz', description: 'Complete the weekly Jozi trivia challenge.', pointsPerAction: 300, rewardType: 'Discount', status: 'Active', dailyCap: 300, expiryDays: 60, icon: Gamepad2 },
  { id: 'act-6', name: 'Social Shoutout', description: 'Tag us in your unboxing video on IG/TikTok.', pointsPerAction: 450, rewardType: 'Free Product', status: 'Inactive', dailyCap: 450, expiryDays: 45, icon: Flame },
];

const TOP_EARNERS = [
  { name: 'Lerato D.', points: 12450, rank: 1, avatar: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Kevin N.', points: 10200, rank: 2, avatar: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Zanele K.', points: 9850, rank: 3, avatar: 'https://i.pravatar.cc/150?u=3' },
  { name: 'Michael O.', points: 8400, rank: 4, avatar: 'https://i.pravatar.cc/150?u=4' },
  { name: 'Sarah S.', points: 7900, rank: 5, avatar: 'https://i.pravatar.cc/150?u=5' },
];

const AdminGamification: React.FC = () => {
  const [activities, setActivities] = useState<GamificationActivity[]>(INITIAL_ACTIVITIES);
  const [activeTab, setActiveTab] = useState<'config' | 'analytics' | 'rewards'>('config');
  const [selectedActivity, setSelectedActivity] = useState<GamificationActivity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a));
  };

  const handleEdit = (activity: GamificationActivity) => {
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    setActivities(prev => prev.map(a => a.id === selectedActivity.id ? selectedActivity : a));
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-4 text-left">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Dashboard
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                LOYALTY <br /><span className="text-jozi-gold">ENGINE.</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center">
                <Download className="w-4 h-4 mr-2 text-jozi-gold" />
                Audit Logs
              </button>
              <button className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Challenge
              </button>
            </div>
          </div>

          {/* KPI Mini Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { label: 'Total Points Issued', val: '1.2M', icon: Star, trend: '+12%' },
              { label: 'Rewards Claimed', val: '4,850', icon: Gift, trend: '+8%' },
              { label: 'Active Players', val: '12.4k', icon: Users, trend: '+22%' },
              { label: 'Avg Session', val: '12m', icon: Clock, trend: '+5%' },
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

      {/* Main Switcher Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-2 shadow-xl border border-jozi-forest/5 flex items-center justify-between mb-12">
          <div className="flex space-x-1">
            {[
              { id: 'config', label: 'Activity Center', icon: Settings2 },
              { id: 'analytics', label: 'Behavioral Insights', icon: BarChart3 },
              { id: 'rewards', label: 'Rewards Matrix', icon: Gift },
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
            <span>Gamification Live</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'config' && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Activity List & Filters */}
              <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 text-left">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Activity Governance</h3>
                    <p className="text-gray-400 text-sm font-medium">Control point distribution and reward logic across the ecosystem.</p>
                  </div>
                  <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Filter activities..." 
                      className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredActivities.map((activity) => (
                    <motion.div 
                      layout
                      key={activity.id}
                      className={`p-8 rounded-[2.5rem] border-2 transition-all group ${activity.status === 'Active' ? 'bg-white border-jozi-forest/5 hover:border-jozi-forest/20 shadow-soft hover:shadow-xl' : 'bg-gray-50 border-transparent grayscale opacity-60'}`}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${activity.status === 'Active' ? 'bg-jozi-forest/5 text-jozi-forest' : 'bg-gray-200 text-gray-400'}`}>
                          <activity.icon className="w-7 h-7" />
                        </div>
                        <button 
                          onClick={() => toggleStatus(activity.id)}
                          className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${activity.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${activity.status === 'Active' ? 'translate-x-7' : 'translate-x-1'} shadow-md`} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2">
                             <h4 className="text-xl font-black text-jozi-dark">{activity.name}</h4>
                             {activity.status === 'Inactive' && <span className="text-[8px] font-black uppercase text-gray-400 bg-gray-200 px-2 py-0.5 rounded">Paused</span>}
                          </div>
                          <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">{activity.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                           <div>
                              <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest mb-1">Base Reward</p>
                              <p className="font-black text-jozi-forest">{activity.pointsPerAction} Pts</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest mb-1">Reward Class</p>
                              <p className="font-black text-jozi-gold">{activity.rewardType}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                           <div className="flex items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                             <ShieldCheck className="w-3 h-3 mr-1" /> Verified Logic
                           </div>
                           <button 
                            onClick={() => handleEdit(activity)}
                            className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-jozi-forest hover:bg-white transition-all shadow-sm group-hover:scale-110"
                           >
                             <Edit3 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Add Placeholder Card */}
                  <button className="rounded-[2.5rem] border-4 border-dashed border-gray-100 p-12 flex flex-col items-center justify-center text-center group hover:border-jozi-gold/20 transition-all min-h-[350px]">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-jozi-gold group-hover:text-white transition-all mb-4">
                      <Plus className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black text-gray-300 group-hover:text-jozi-forest transition-colors">New Challenge</h4>
                    <p className="text-xs text-gray-300 font-bold mt-2">Expand the Jozi gaming <br />ecosystem.</p>
                  </button>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-jozi-forest p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10 space-y-6">
                       <h4 className="text-2xl font-black tracking-tight leading-none uppercase">Global Point <br /><span className="text-jozi-gold">Reset Protocol.</span></h4>
                       <p className="text-jozi-cream/60 text-sm font-medium leading-relaxed">Wipes current balances for all users. Intended for seasonal resets or critical economy adjustments. Requires level 4 admin auth.</p>
                       <button className="bg-white text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all flex items-center">
                          <Lock className="w-4 h-4 mr-2" /> Initialize Reset
                       </button>
                    </div>
                    <RotateCcw className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-180 transition-transform duration-1000" />
                 </div>
                 
                 <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold">
                       <RefreshCw className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-jozi-dark">System Sync</h3>
                    <p className="text-sm text-gray-400 font-medium max-w-xs">Manually trigger a sync across all hubs to ensure loyalty points are consistent with logistics data.</p>
                    <button className="text-jozi-gold font-black uppercase text-xs tracking-[0.2em] hover:text-jozi-forest transition-colors">Synchronize Now</button>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Engagement Line Chart */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-jozi-dark">Economy Velocity</h3>
                      <p className="text-xs text-gray-400 font-medium">Points issued vs Rewards claimed this week.</p>
                    </div>
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Points</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-jozi-gold" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Claims</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ENGAGEMENT_DATA}>
                        <defs>
                          <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1B5E52" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1B5E52" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="points" stroke="#1B5E52" strokeWidth={4} fillOpacity={1} fill="url(#colorPoints)" />
                        <Area type="monotone" dataKey="claims" stroke="#C7A16E" strokeWidth={4} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Activity Breakdown */}
                <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left flex flex-col">
                  <h3 className="text-2xl font-black text-jozi-dark mb-10">Revenue Verticals</h3>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={POINTS_PER_ACTIVITY} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="activity" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} width={80} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                        <Bar dataKey="points" radius={[0, 8, 8, 0]} barSize={25}>
                          {POINTS_PER_ACTIVITY.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 space-y-4">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b pb-2">Top Redemptions</p>
                     <div className="space-y-2">
                        {['R50 Off Voucher', 'Free Eco-Shipping', 'Artisan Keyring'].map((item, i) => (
                           <div key={i} className="flex justify-between items-center">
                              <span className="text-xs font-bold text-jozi-dark">{item}</span>
                              <span className="text-[10px] font-black text-emerald-500">+{24 + i*8}% Growth</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard & Redemptions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Top Earners */}
                 <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left">
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex items-center space-x-3">
                          <Trophy className="w-6 h-6 text-jozi-gold" />
                          <h3 className="text-2xl font-black text-jozi-dark">Neighbor Legends</h3>
                       </div>
                       <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-jozi-forest"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                       {TOP_EARNERS.map((user) => (
                         <div key={user.rank} className={`flex items-center justify-between p-4 rounded-2xl group transition-all ${user.rank === 1 ? 'bg-jozi-gold/5 border border-jozi-gold/20' : 'hover:bg-gray-50'}`}>
                            <div className="flex items-center space-x-4">
                               <div className="relative">
                                  <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover" />
                                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] border-2 border-white ${user.rank === 1 ? 'bg-jozi-gold text-white' : 'bg-gray-100 text-gray-400'}`}>
                                     {user.rank}
                                  </div>
                               </div>
                               <div>
                                  <p className="font-black text-jozi-forest">{user.name}</p>
                                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Master Connector</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xl font-black text-jozi-forest">{user.points.toLocaleString()}</p>
                               <p className="text-[9px] font-bold text-jozi-gold uppercase tracking-widest">Lifetime Pts</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Recent Behavior Feed */}
                 <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                       <h3 className="text-2xl font-black text-jozi-dark">Reward Pulse</h3>
                       <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Live Redemptions</span>
                    </div>
                    <div className="space-y-6 overflow-y-auto max-h-[450px] pr-4 scrollbar-hide">
                       {[
                         { user: 'Thabo M.', action: 'Redeemed R100 Voucher', time: '2 mins ago', icon: Gift, color: 'text-jozi-gold' },
                         { user: 'Sarah J.', action: 'Earned 500 Pts (Referral)', time: '14 mins ago', icon: Users, color: 'text-blue-500' },
                         { user: 'Bongani S.', action: 'Won Spin-the-Wheel Bonus', time: '1h ago', icon: Gamepad2, color: 'text-emerald-500' },
                         { user: 'Michael B.', action: 'Points Expired (365d inactivity)', time: '4h ago', icon: Clock, color: 'text-red-400' },
                         { user: 'Lerato D.', action: 'Unlocked Master Crafter Badge', time: '6h ago', icon: Award, color: 'text-purple-500' },
                       ].map((item, i) => (
                         <div key={i} className="flex items-start space-x-5 group">
                            <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 ${item.color}`}>
                               <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-grow pb-6 border-b border-gray-50">
                               <p className="text-sm font-black text-jozi-dark leading-none">{item.user}</p>
                               <p className="text-sm text-gray-500 font-medium mt-1">{item.action}</p>
                               <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-2">{item.time}</p>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-300 hover:text-jozi-forest">
                               <ArrowUpRight className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedActivity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-10 lg:p-12 w-full max-w-2xl relative shadow-2xl overflow-hidden"
            >
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
              
              <form onSubmit={handleSaveActivity} className="space-y-8 text-left">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4 mb-2">
                     <div className="w-12 h-12 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold">
                        <selectedActivity.icon className="w-6 h-6" />
                     </div>
                     <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">Tune Logic</h3>
                  </div>
                  <p className="text-gray-400 font-medium italic">Adjusting parameters for <span className="text-jozi-dark font-black">{selectedActivity.name}</span>.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Points Per Event</label>
                      <div className="relative">
                         <Zap className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-jozi-gold" />
                         <input 
                            type="number" 
                            className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-black text-lg text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                            value={selectedActivity.pointsPerAction}
                            onChange={(e) => setSelectedActivity({...selectedActivity, pointsPerAction: parseInt(e.target.value)})}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Reward Classification</label>
                      <select 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 appearance-none cursor-pointer"
                        value={selectedActivity.rewardType}
                        onChange={(e) => setSelectedActivity({...selectedActivity, rewardType: e.target.value as any})}
                      >
                         <option>Points</option>
                         <option>Coupon</option>
                         <option>Discount</option>
                         <option>Free Product</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Velocity Limit (Daily Cap)</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none"
                        value={selectedActivity.dailyCap}
                        onChange={(e) => setSelectedActivity({...selectedActivity, dailyCap: parseInt(e.target.value)})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Point Lifetime (Days)</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none"
                        value={selectedActivity.expiryDays}
                        onChange={(e) => setSelectedActivity({...selectedActivity, expiryDays: parseInt(e.target.value)})}
                      />
                   </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start space-x-4">
                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                   <p className="text-xs text-amber-800 font-medium leading-relaxed italic">Changing these rules will immediately impact the <span className="font-black">Neighborhood Loyalty Tiers</span>. Historical points earned under old rules will not be retroactively modified.</p>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-grow py-5 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Cancel Changes</button>
                  <button type="submit" className="flex-grow py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center">
                    <Save className="w-4 h-4 mr-2" /> Commit New Rules
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

// Helper SVG Icon component
const Award = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export default AdminGamification;
