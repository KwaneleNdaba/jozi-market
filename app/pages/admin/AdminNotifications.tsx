import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Send, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Users, 
  Store, 
  ArrowLeft, 
  Download, 
  BarChart3, 
  PieChart as PieIcon, 
  ChevronDown, 
  FileText,
  Zap,
  Tag,
  ShieldCheck,
  History,
  Settings
} from 'lucide-react';
import Link from 'next/link';
// Added missing AreaChart and Area imports from recharts to fix build errors on lines 379, 390, and 391
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

// --- MOCK DATA ---
interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  recipientType: 'All Users' | 'All Vendors' | 'Specific Vendor' | 'Specific User';
  method: 'Push' | 'Email' | 'SMS';
  status: 'Sent' | 'Scheduled' | 'Draft' | 'Failed';
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  openRate?: string;
}

const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  { id: 'not-1', title: 'Spring Market Launch 2024', body: 'Exciting news! The Spring collection is now live. Check out the new artisan drops.', recipientType: 'All Users', method: 'Push', status: 'Sent', date: '2024-10-14 09:00', priority: 'High', openRate: '68%' },
  { id: 'not-2', title: 'Payout Cycle Reminder', body: 'Friendly reminder to all vendors: Payouts will be processed this Friday.', recipientType: 'All Vendors', method: 'Email', status: 'Scheduled', date: '2024-10-18 10:00', priority: 'Medium' },
  { id: 'not-3', title: 'New Feature: AI Descriptions', body: 'Vendors can now generate product descriptions using Gemini AI.', recipientType: 'All Vendors', method: 'Push', status: 'Sent', date: '2024-10-12 14:30', priority: 'Medium', openRate: '42%' },
  { id: 'not-4', title: 'Maintenance Window', body: 'The platform will be down for 2 hours tonight for system upgrades.', recipientType: 'All Users', method: 'SMS', status: 'Draft', date: '2024-10-16 22:00', priority: 'High' },
  { id: 'not-5', title: 'Welcome to Jozi Legend', body: 'You have been promoted to Jozi Legend status!', recipientType: 'Specific User', method: 'Email', status: 'Sent', date: '2024-10-15 11:15', priority: 'Low', openRate: '92%' },
];

const ANALYTICS_SENT_BY_TYPE = [
  { name: 'Push', value: 450, color: '#1B5E52' },
  { name: 'Email', value: 300, color: '#C7A16E' },
  { name: 'SMS', value: 120, color: '#0A1A17' },
];

const ANALYTICS_SENT_OVER_TIME = [
  { name: 'Mon', sent: 42 },
  { name: 'Tue', sent: 38 },
  { name: 'Wed', sent: 55 },
  { name: 'Thu', sent: 48 },
  { name: 'Fri', sent: 72 },
  { name: 'Sat', sent: 85 },
  { name: 'Sun', sent: 61 },
];

const MOCK_RECIPIENTS = [
  { id: 'u1', name: 'Lerato Dlamini', type: 'User' },
  { id: 'u2', name: 'Tshepo Modise', type: 'User' },
  { id: 'v1', name: 'Maboneng Textiles', type: 'Vendor' },
  { id: 'v2', name: 'Soweto Gold', type: 'Vendor' },
];

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(INITIAL_NOTIFICATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRecipient, setFilterRecipient] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');

  // New Notification Form State
  const [formData, setFormData] = useState<Partial<NotificationRecord>>({
    title: '',
    body: '',
    recipientType: 'All Users',
    method: 'Push',
    status: 'Sent',
    priority: 'Medium'
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRecipient = filterRecipient === 'All' || n.recipientType === filterRecipient;
      const matchesStatus = filterStatus === 'All' || n.status === filterStatus;
      return matchesSearch && matchesRecipient && matchesStatus;
    });
  }, [notifications, searchQuery, filterRecipient, filterStatus]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotif: NotificationRecord = {
      ...formData as NotificationRecord,
      id: `not-${Date.now()}`,
      date: new Date().toLocaleString(),
    };
    setNotifications([newNotif, ...notifications]);
    setIsModalOpen(false);
    setFormData({ title: '', body: '', recipientType: 'All Users', method: 'Push', status: 'Sent', priority: 'Medium' });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Draft': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Push': return <Smartphone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'SMS': return <MessageSquare className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Admin Header Section */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-4 text-left">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Communications <br /><span className="text-jozi-gold">Governance.</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center">
                <Download className="w-4 h-4 mr-2 text-jozi-gold" />
                Export Ledger
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Notification
              </button>
            </div>
          </div>

          {/* Master Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { label: 'Cumulative Sent', val: '8.4k', icon: Send, trend: '+12%' },
              { label: 'Pending Delivery', val: '124', icon: Clock, trend: 'Queued' },
              { label: 'Avg Open Rate', val: '54%', icon: Eye, trend: '+4%' },
              { label: 'Failed Reports', val: '12', icon: AlertCircle, trend: '-2%' },
            ].map((kpi, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 min-w-[150px] text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-jozi-gold" />
                  <span className={`text-[8px] font-black uppercase ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-white/40'}`}>{kpi.trend}</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-none">{kpi.label}</p>
                <h4 className="text-lg font-black text-white mt-1">{kpi.val}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Switcher & Content */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-2 shadow-xl border border-jozi-forest/5 flex items-center justify-between mb-12">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Market Pulse', icon: Bell },
              { id: 'analytics', label: 'Engagement Insights', icon: BarChart3 },
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
            <span>Node: GP-Central-01</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Filter Bar */}
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-soft border border-gray-100 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Keyword search..." 
                      className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-jozi-dark outline-none border-2 border-transparent focus:border-jozi-gold/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-jozi-dark outline-none border-2 border-transparent appearance-none cursor-pointer"
                      value={filterRecipient}
                      onChange={(e) => setFilterRecipient(e.target.value)}
                    >
                      <option value="All">All Recipient Types</option>
                      <option value="All Users">All Users</option>
                      <option value="All Vendors">All Vendors</option>
                      <option value="Specific User">Specific Users</option>
                      <option value="Specific Vendor">Specific Vendors</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-jozi-dark outline-none border-2 border-transparent appearance-none cursor-pointer"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Sent">Sent</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {setSearchQuery(''); setFilterRecipient('All'); setFilterStatus('All');}}
                    className="py-3 bg-jozi-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all"
                  >
                    Clear Market Filters
                  </button>
                </div>

                {/* Notifications Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Target Asset / Subject</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Channel</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Execution Date</th>
                        <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Metrics</th>
                        <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredNotifications.map((notif) => (
                        <tr key={notif.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-6">
                            <div className="space-y-1">
                              <p className="font-black text-jozi-dark text-sm leading-tight">{notif.title}</p>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                  notif.recipientType.includes('Vendor') ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {notif.recipientType}
                                </span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                  notif.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'
                                }`}>
                                  {notif.priority} Priority
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 text-center">
                            <div className="flex justify-center text-gray-400 group-hover:text-jozi-forest transition-colors">
                              {getMethodIcon(notif.method)}
                            </div>
                          </td>
                          <td className="py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(notif.status)}`}>
                              {notif.status}
                            </span>
                          </td>
                          <td className="py-6 text-xs font-bold text-gray-400">
                            {notif.date}
                          </td>
                          <td className="py-6 text-right">
                            {notif.openRate ? (
                              <div className="space-y-1">
                                <p className="text-sm font-black text-jozi-forest">{notif.openRate}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Interaction</p>
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-jozi-forest hover:bg-white shadow-sm transition-all"><Eye className="w-4 h-4" /></button>
                              <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500 hover:bg-white shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
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
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Delivery Over Time */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-jozi-dark">Dispatch Velocity</h3>
                      <p className="text-xs text-gray-400 font-medium">Notification volume across the current week.</p>
                    </div>
                    <div className="flex space-x-6">
                       <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-jozi-forest" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sent</span>
                       </div>
                    </div>
                  </div>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ANALYTICS_SENT_OVER_TIME}>
                        <defs>
                          <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1B5E52" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1B5E52" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                        <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="sent" stroke="#1B5E52" strokeWidth={4} fillOpacity={1} fill="url(#colorSent)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Channel Mix */}
                <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left">
                   <h3 className="text-2xl font-black text-jozi-dark mb-2">Channel Mix</h3>
                   <p className="text-xs text-gray-400 font-medium mb-10">Distribution by medium.</p>
                   <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ANALYTICS_SENT_BY_TYPE}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {ANALYTICS_SENT_BY_TYPE.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                   </div>
                   <div className="space-y-4 mt-8">
                      {ANALYTICS_SENT_BY_TYPE.map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: s.color }} />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.name}</span>
                          </div>
                          <span className="font-black text-jozi-dark">{s.value}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Engagement Insights Card */}
              <div className="bg-white p-12 rounded-[4rem] text-jozi-dark flex flex-col md:flex-row items-center justify-between gap-12 border border-jozi-forest/5 shadow-soft relative overflow-hidden group">
                 <div className="relative z-10 space-y-6 text-left max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-jozi-forest rounded-2xl shadow-xl"><History className="w-8 h-8 text-jozi-gold" /></div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Channel Strategy <br /><span className="text-jozi-gold">Feedback Loop.</span></h2>
                    </div>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                      "Email open rates for vendors are at an all-time high <span className="text-jozi-forest font-bold">(82%)</span>. However, SMS conversion for end-users has dropped by <span className="text-jozi-gold font-bold">12%</span>. Recommend switching low-priority maintenance updates to Push notifications only."
                    </p>
                    <div className="flex gap-4">
                       <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20">Analyze User Decay</button>
                       <button className="bg-gray-100 text-gray-500 border border-gray-200 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Audit PDR Log</button>
                    </div>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                    <PieIcon className="w-full h-full text-jozi-forest" />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CREATE NOTIFICATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              className="bg-white rounded-[3rem] p-10 lg:p-12 w-full max-w-3xl relative shadow-2xl overflow-hidden text-left"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
              
              <form onSubmit={handleSend} className="space-y-8">
                <div className="space-y-2">
                   <div className="flex items-center space-x-4 mb-2">
                      <div className="w-12 h-12 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold shadow-sm">
                         <Bell className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">Initialize Message</h3>
                   </div>
                   <p className="text-gray-400 font-medium italic">Crafting a broadcast or targeted communication for the marketplace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject / Header</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20"
                        placeholder="e.g. New Artisan Features are Live!"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                   </div>

                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message Body</label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full bg-gray-50 rounded-[2rem] px-6 py-5 font-bold text-jozi-forest outline-none resize-none border-2 border-transparent focus:border-jozi-gold/20"
                        placeholder="Detail the message context..."
                        value={formData.body}
                        onChange={(e) => setFormData({...formData, body: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Recipient Asset Type</label>
                      <select 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 appearance-none cursor-pointer"
                        value={formData.recipientType}
                        onChange={(e) => setFormData({...formData, recipientType: e.target.value as any})}
                      >
                         <option value="All Users">All Market Users</option>
                         <option value="All Vendors">All Artisan Workshops</option>
                         <option value="Specific User">Target Specific Customer</option>
                         <option value="Specific Vendor">Target Specific Artisan</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Delivery Channel</label>
                      <select 
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 appearance-none cursor-pointer"
                        value={formData.method}
                        onChange={(e) => setFormData({...formData, method: e.target.value as any})}
                      >
                         <option value="Push">Mobile Push Alert</option>
                         <option value="Email">Secure Email</option>
                         <option value="SMS">Priority SMS</option>
                      </select>
                   </div>

                   {(formData.recipientType === 'Specific User' || formData.recipientType === 'Specific Vendor') && (
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Individuals</label>
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-wrap gap-2">
                          {MOCK_RECIPIENTS.filter(r => (formData.recipientType === 'Specific User' ? r.type === 'User' : r.type === 'Vendor')).map(rec => (
                            <button key={rec.id} type="button" className="px-4 py-2 bg-white rounded-xl border border-jozi-forest/10 text-[10px] font-black uppercase tracking-widest text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all">
                              {rec.name}
                            </button>
                          ))}
                          <button type="button" className="px-4 py-2 bg-jozi-forest/5 rounded-xl border border-dashed border-jozi-forest/20 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-jozi-forest transition-all">
                            + Add Target
                          </button>
                        </div>
                      </div>
                   )}

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Dispatch Priority</label>
                      <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map(p => (
                          <button 
                            key={p} 
                            type="button" 
                            onClick={() => setFormData({...formData, priority: p as any})}
                            className={`flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                              formData.priority === p ? 'bg-jozi-forest border-jozi-forest text-white' : 'bg-white border-gray-100 text-gray-400'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Execution Schedule</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="datetime-local" 
                          className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 appearance-none"
                        />
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start space-x-4">
                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                   <p className="text-xs text-amber-800 font-medium leading-relaxed italic">Broadcasts to <span className="font-black">All Users/Vendors</span> immediately trigger high-volume worker queues. Please verify subject and body accuracy before sending.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-5 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Discard Draft</button>
                  <button type="submit" className="flex-grow py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" /> Execute Dispatch
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

export default AdminNotifications;
