import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Image as ImageIcon, 
  Tag, 
  Video, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Save, 
  Download, 
  BarChart3, 
  Clock, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  MoreHorizontal, 
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Layers,
  Sparkles,
  RefreshCw,
  Play,
  Check,
  AlertTriangle,
  Link as LinkIcon,
  // Added Store to fix "Cannot find name 'Store'" error
  Store
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

// --- MOCK DATA ---
interface Banner {
  id: string;
  image: string;
  title: string;
  url: string;
  position: 'Homepage Hero' | 'Category Sidebar' | 'Vendor Highlight' | 'Checkout Footer';
  status: 'Active' | 'Inactive';
  startDate: string;
  endDate: string;
}

interface Promotion {
  id: string;
  name: string;
  code: string;
  type: 'Discount' | 'BOGO' | 'Flash Sale';
  target: 'All Products' | 'Category' | 'Vendor';
  targetValue: string;
  value: string;
  expiry: string;
  status: 'Active' | 'Scheduled' | 'Expired';
}

interface VideoContent {
  id: string;
  thumbnail: string;
  title: string;
  association: string;
  status: 'Active' | 'Inactive';
  views: number;
  url: string;
}

const INITIAL_BANNERS: Banner[] = [
  { id: 'b1', title: 'Spring Heritage Collection', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800', url: '/shop?cat=spring', position: 'Homepage Hero', status: 'Active', startDate: '2024-10-01', endDate: '2024-11-01' },
  { id: 'b2', title: 'Artisan Workshop Spotlight', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800', url: '/vendors/v1', position: 'Vendor Highlight', status: 'Active', startDate: '2024-10-10', endDate: '2024-12-10' },
  { id: 'b3', title: 'Free Delivery Over R1000', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800', url: '/shipping', position: 'Checkout Footer', status: 'Inactive', startDate: '2024-09-01', endDate: '2024-09-30' },
];

const INITIAL_PROMOTIONS: Promotion[] = [
  { id: 'p1', name: 'New Neighbor Welcome', code: 'JOZI20', type: 'Discount', target: 'All Products', targetValue: 'Universal', value: '20%', expiry: '2024-12-31', status: 'Active' },
  { id: 'p2', name: 'Midweek Flash Sale', code: 'FLASH50', type: 'Flash Sale', target: 'Category', targetValue: 'Accessories', value: 'R50 OFF', expiry: '2024-10-25', status: 'Scheduled' },
  { id: 'p3', name: 'Textile BOGO Week', code: 'MABO-BOGO', type: 'BOGO', target: 'Vendor', targetValue: 'Maboneng Textiles', value: '2-for-1', expiry: '2024-09-15', status: 'Expired' },
];

const INITIAL_VIDEOS: VideoContent[] = [
  { id: 'v1', title: 'The Soul of Maboneng', thumbnail: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400', association: 'Maboneng Textiles', status: 'Active', views: 4250, url: '#' },
  { id: 'v2', title: 'Hand-Stitched Legacy', thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400', association: 'Veld Boots', status: 'Active', views: 1840, url: '#' },
  { id: 'v3', title: 'Joburg Urban Beats', thumbnail: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400', association: 'Platform Promo', status: 'Inactive', views: 890, url: '#' },
];

const ENGAGEMENT_DATA = [
  { name: 'Mon', views: 1200, clicks: 450 },
  { name: 'Tue', views: 1800, clicks: 620 },
  { name: 'Wed', views: 1500, clicks: 510 },
  { name: 'Thu', views: 2200, clicks: 840 },
  { name: 'Fri', views: 3500, clicks: 1200 },
  { name: 'Sat', views: 4100, clicks: 1500 },
  { name: 'Sun', views: 2800, clicks: 950 },
];

const AdminContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'banners' | 'promotions' | 'videos'>('banners');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoContent | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Data States
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [videos, setVideos] = useState<VideoContent[]>(INITIAL_VIDEOS);

  const filteredContent = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (activeTab === 'banners') return banners.filter(b => b.title.toLowerCase().includes(q));
    if (activeTab === 'promotions') return promotions.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
    return videos.filter(v => v.title.toLowerCase().includes(q));
  }, [activeTab, searchQuery, banners, promotions, videos]);

  const handleToggleStatus = (id: string) => {
    if (activeTab === 'banners') {
      setBanners(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b));
    } else if (activeTab === 'promotions') {
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Scheduled' : 'Active' } : p));
    } else {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, status: v.status === 'Active' ? 'Inactive' : 'Active' } : v));
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to decommission this asset?')) {
      if (activeTab === 'banners') setBanners(prev => prev.filter(b => b.id !== id));
      if (activeTab === 'promotions') setPromotions(prev => prev.filter(p => p.id !== id));
      if (activeTab === 'videos') setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = (action: 'Activate' | 'Deactivate' | 'Delete') => {
    if (action === 'Delete') {
      if (activeTab === 'promotions') setPromotions(prev => prev.filter(p => !selectedIds.includes(p.id)));
      // Other tabs similarly...
    } else {
      const newStatus = action === 'Activate' ? 'Active' : 'Inactive';
      if (activeTab === 'promotions') setPromotions(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus as any } : p));
    }
    setSelectedIds([]);
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
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                CONTENT <br /><span className="text-jozi-gold">ORCHESTRATOR.</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center">
                <Download className="w-4 h-4 mr-2 text-jozi-gold" />
                Media Audit
              </button>
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Content
              </button>
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Live Banners', val: banners.filter(b => b.status === 'Active').length, icon: ImageIcon, trend: 'Stable' },
              { label: 'Active Promos', val: promotions.filter(p => p.status === 'Active').length, icon: Tag, trend: '+2' },
              { label: 'Video Reach', val: '24.2k', icon: Play, trend: '+14%' },
              { label: 'Avg CTR', val: '4.8%', icon: Zap, trend: '+0.5%' },
            ].map((kpi, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-jozi-gold" />
                  <span className="text-[8px] font-black uppercase text-emerald-400">{kpi.trend}</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-none">{kpi.label}</p>
                <h4 className="text-lg font-black text-white mt-1">{kpi.val}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Switcher Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-2 shadow-xl border border-jozi-forest/5 flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex bg-gray-50 p-1 rounded-2xl w-full md:w-auto">
            {[
              { id: 'banners', label: 'Banners', icon: ImageIcon },
              { id: 'promotions', label: 'Promotions', icon: Tag },
              { id: 'videos', label: 'Videos', icon: Video },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSelectedIds([]); }}
                className={`flex-grow md:flex-none px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-3 transition-all ${
                  activeTab === tab.id ? 'bg-jozi-forest text-white shadow-lg' : 'text-gray-400 hover:bg-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto px-2">
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={`Filter ${activeTab}...`} 
                className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-jozi-forest transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-jozi-forest text-white p-4 rounded-2xl mb-8 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                  {selectedIds.length} Selected
                </div>
                <p className="text-xs font-bold text-jozi-cream/80 hidden sm:block italic">Apply bulk modification to selected assets</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleBulkAction('Activate')} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Activate</button>
                <button onClick={() => handleBulkAction('Deactivate')} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Deactivate</button>
                <button onClick={() => handleBulkAction('Delete')} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
                <button onClick={() => setSelectedIds([])} className="p-2 text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'banners' && (
            <motion.div 
              key="banners"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(filteredContent as Banner[]).map((banner: Banner) => (
                <div key={banner.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-soft group hover:shadow-xl transition-all flex flex-col text-left">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={banner.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={banner.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-jozi-dark/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border-2 shadow-lg ${banner.status === 'Active' ? 'bg-emerald-50 border-white text-white' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                        {banner.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                       <p className="text-[10px] font-black text-jozi-gold uppercase tracking-[0.2em]">{banner.position}</p>
                       <h3 className="text-lg font-black text-white leading-tight mt-1">{banner.title}</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6 flex-grow">
                     <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                        <div className="flex items-center"><Calendar className="w-3 h-3 mr-2" /> {banner.startDate}</div>
                        <ChevronRight className="w-3 h-3" />
                        <div className="flex items-center">{banner.endDate}</div>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                        <p className="text-[10px] font-black text-jozi-forest truncate max-w-[150px]">{banner.url}</p>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                     </div>
                     <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => handleToggleStatus(banner.id)}
                          className={`flex-grow py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${banner.status === 'Active' ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' : 'bg-jozi-forest text-white'}`}
                        >
                          {banner.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleEdit(banner)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest shadow-sm"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(banner.id)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                </div>
              ))}
              
              <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="rounded-[2.5rem] border-4 border-dashed border-gray-100 p-12 flex flex-col items-center justify-center text-center group hover:border-jozi-gold/20 transition-all min-h-[350px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-jozi-gold group-hover:text-white transition-all mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-gray-300 group-hover:text-jozi-forest transition-colors">New Banner</h4>
                <p className="text-xs text-gray-300 font-bold mt-2">Create visual campaign <br />real-estate.</p>
              </button>
            </motion.div>
          )}

          {activeTab === 'promotions' && (
            <motion.div 
              key="promotions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden text-left">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="pb-6 w-10">
                        <button 
                          onClick={() => selectedIds.length === filteredContent.length ? setSelectedIds([]) : setSelectedIds(filteredContent.map(p => p.id))}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.length === filteredContent.length ? 'bg-jozi-forest border-jozi-forest text-white' : 'bg-white border-gray-200'}`}
                        >
                          {selectedIds.length === filteredContent.length && <Check className="w-3 h-3" />}
                        </button>
                      </th>
                      <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Promotion Name / Code</th>
                      <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Incentive</th>
                      <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Target Asset</th>
                      <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                      <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(filteredContent as Promotion[]).map((promo: Promotion) => (
                      <tr key={promo.id} className={`group hover:bg-gray-50/50 transition-colors ${selectedIds.includes(promo.id) ? 'bg-jozi-cream/20' : ''}`}>
                        <td className="py-8">
                          <button 
                            onClick={() => toggleSelect(promo.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.includes(promo.id) ? 'bg-jozi-gold border-jozi-gold text-white' : 'bg-white border-gray-200 hover:border-jozi-gold'}`}
                          >
                            {selectedIds.includes(promo.id) && <Check className="w-3 h-3" />}
                          </button>
                        </td>
                        <td className="py-8">
                          <div className="space-y-1">
                            <p className="font-black text-jozi-dark text-sm leading-tight">{promo.name}</p>
                            <span className="text-[10px] font-black text-jozi-gold border border-jozi-gold/20 px-2 py-0.5 rounded uppercase tracking-widest">{promo.code}</span>
                          </div>
                        </td>
                        <td className="py-8 text-center">
                          <div className="space-y-1">
                             <p className="text-lg font-black text-jozi-forest leading-none">{promo.value}</p>
                             <p className="text-[8px] font-bold text-gray-300 uppercase">{promo.type}</p>
                          </div>
                        </td>
                        <td className="py-8">
                          <div className="space-y-1">
                             <p className="text-xs font-bold text-gray-400">{promo.target}</p>
                             <p className="text-[10px] font-black text-jozi-dark uppercase tracking-widest">{promo.targetValue}</p>
                          </div>
                        </td>
                        <td className="py-8 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                            promo.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            promo.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                            'bg-gray-100 text-gray-400 border-gray-100'
                          }`}>
                            {promo.status}
                          </span>
                        </td>
                        <td className="py-8 text-right">
                          <div className="flex items-center justify-end space-x-2">
                             <button onClick={() => handleEdit(promo)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest shadow-sm transition-all"><Edit3 className="w-4 h-4" /></button>
                             <button onClick={() => handleDelete(promo.id)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div 
              key="videos"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {(filteredContent as VideoContent[]).map((video: VideoContent) => (
                  <div key={video.id} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-soft group hover:shadow-xl transition-all text-left flex flex-col">
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-jozi-dark">
                      <img src={video.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={video.title} />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <button 
                          onClick={() => setPreviewVideo(video)}
                          className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform"
                         >
                            <Play className="w-8 h-8 fill-current ml-1" />
                         </button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                         <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
                            <Eye className="w-3 h-3 text-jozi-gold" />
                            <span>{video.views.toLocaleString()}</span>
                         </div>
                         <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${video.status === 'Active' ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-gray-500/20 border-gray-500/30'}`}>
                           {video.status}
                         </span>
                      </div>
                    </div>
                    <div className="space-y-4 flex-grow">
                       <div>
                          <h4 className="font-black text-jozi-dark text-sm truncate">{video.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ref: {video.association}</p>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setPreviewVideo(video)} className="flex-grow py-3 bg-jozi-cream rounded-xl text-[10px] font-black uppercase tracking-widest text-jozi-forest hover:bg-jozi-gold transition-all">Preview</button>
                          <button onClick={() => handleEdit(video)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest transition-all shadow-sm"><Settings className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(video.id)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 text-center group hover:border-jozi-gold/20 transition-all min-h-[400px]">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-jozi-gold group-hover:text-white transition-all mb-4">
                     <Video className="w-8 h-8" />
                   </div>
                   <h4 className="text-xl font-black text-gray-300 group-hover:text-jozi-forest transition-colors uppercase tracking-tight">Upload Reels</h4>
                   <p className="text-xs text-gray-300 font-bold mt-2">Vertical storytelling for <br />mobile shoppers.</p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Analytics Section (Simplified) */}
        <div className="mt-20 p-12 bg-white rounded-[4rem] border border-jozi-forest/5 shadow-soft">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 text-left">
                 <div className="inline-flex items-center bg-jozi-gold/10 text-jozi-gold px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                   Performance Metrics
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-black text-jozi-dark tracking-tighter leading-none uppercase">Content <br /><span className="text-jozi-gold">Yield Analysis.</span></h2>
                 <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                   "Homepage banners are currently seeing a <span className="text-jozi-forest font-bold">12.4% click-through rate</span>, the highest in 3 quarters. Video engagement peaks at 19:00 SAST daily. Recommend shifting Flash Sale start times to match."
                 </p>
                 <div className="flex gap-4">
                    <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20">Audit Full History</button>
                    <button className="bg-gray-100 text-gray-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center">
                      <Download className="w-4 h-4 mr-2" /> PDF Export
                    </button>
                 </div>
              </div>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ENGAGEMENT_DATA}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                       <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" dataKey="views" stroke="#1B5E52" strokeWidth={4} fill="#1B5E52" fillOpacity={0.05} />
                       <Area type="monotone" dataKey="clicks" stroke="#C7A16E" strokeWidth={4} fill="#C7A16E" fillOpacity={0} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      </section>

      {/* --- MODAL FOR CONTENT CREATION / EDITING --- */}
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
              
              <div className="space-y-8">
                <div className="space-y-2">
                   <div className="flex items-center space-x-4 mb-2">
                      <div className="w-12 h-12 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold shadow-sm">
                         {activeTab === 'banners' ? <ImageIcon className="w-6 h-6" /> : activeTab === 'promotions' ? <Tag className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                      </div>
                      <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{editingItem ? 'Refine Asset' : `New ${activeTab.slice(0, -1)} Genesis`}</h3>
                   </div>
                   <p className="text-gray-400 font-medium italic">Configuring high-visibility marketplace content for the next cycle.</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contextual Header</label>
                        <input type="text" required defaultValue={editingItem?.title || editingItem?.name} placeholder={`Enter ${activeTab.slice(0, -1)} title...`} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                      </div>

                      {activeTab === 'banners' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Landing Endpoint (URL)</label>
                            <div className="relative">
                               <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                               <input type="text" required defaultValue={editingItem?.url} placeholder="e.g. /shop/textiles" className="w-full bg-gray-50 rounded-2xl px-6 pl-12 py-4 font-bold text-jozi-forest outline-none" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Display Slot</label>
                            <select defaultValue={editingItem?.position} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none appearance-none cursor-pointer">
                               <option>Homepage Hero</option>
                               <option>Category Sidebar</option>
                               <option>Vendor Highlight</option>
                               <option>Checkout Footer</option>
                            </select>
                          </div>
                        </>
                      )}

                      {activeTab === 'promotions' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Unique Promo Code</label>
                            <input type="text" required defaultValue={editingItem?.code} placeholder="JOZI-FEST-24" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-gold outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Promotion Class</label>
                            <select defaultValue={editingItem?.type} className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-jozi-forest outline-none appearance-none cursor-pointer">
                               <option>Percentage Discount</option>
                               <option>Fixed Amount Off</option>
                               <option>Buy One Get One (BOGO)</option>
                               <option>Free Shipping</option>
                            </select>
                          </div>
                        </>
                      )}

                      {activeTab === 'videos' && (
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Associated Merchant / Asset</label>
                           <input type="text" defaultValue={editingItem?.association} placeholder="Search for merchant name..." className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cycle Activation</label>
                        <div className="relative">
                           <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                           <input type="date" required defaultValue={editingItem?.startDate || editingItem?.expiry} className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cycle Termination</label>
                        <div className="relative">
                           <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                           <input type="date" required defaultValue={editingItem?.endDate} className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-jozi-forest outline-none" />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Media Payload (Drag & Drop)</label>
                        <div className="w-full aspect-[21/9] bg-jozi-cream rounded-[2rem] border-2 border-dashed border-jozi-gold/20 flex flex-col items-center justify-center group hover:bg-jozi-gold/5 transition-all cursor-pointer relative overflow-hidden">
                           {editingItem?.image || editingItem?.thumbnail ? (
                             <>
                               <img src={editingItem.image || editingItem.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                               <div className="relative z-10 text-center">
                                  <ImageIcon className="w-8 h-8 text-jozi-forest mx-auto mb-2" />
                                  <p className="text-[9px] font-black uppercase text-jozi-forest">Replace current asset</p>
                               </div>
                             </>
                           ) : (
                             <>
                               <ImageIcon className="w-10 h-10 text-jozi-gold opacity-20 mb-4 group-hover:scale-110 transition-transform" />
                               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Select Image or 4K MP4 Asset</p>
                             </>
                           )}
                        </div>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-5 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">Abort Deployment</button>
                      <button type="submit" className="flex-grow py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center">
                        <Save className="w-4 h-4 mr-2" /> Synchronize CMS
                      </button>
                   </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO PREVIEW MODAL */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewVideo(null)} className="absolute inset-0 bg-jozi-dark/90 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg aspect-[9/16] rounded-[3rem] overflow-hidden shadow-2xl bg-black flex items-center justify-center"
            >
              <button onClick={() => setPreviewVideo(null)} className="absolute top-8 right-8 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute inset-0 z-0">
                 <img src={previewVideo.thumbnail} className="w-full h-full object-cover blur-xl opacity-40 scale-125" />
              </div>

              <div className="relative z-10 w-full h-full flex flex-col p-8">
                 <div className="mt-auto space-y-4">
                    <div className="inline-flex items-center bg-jozi-gold text-jozi-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                       Previewing 4K Vertical Asset
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{previewVideo.title}</h2>
                    <div className="flex items-center gap-4 text-white/60">
                       <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-jozi-gold" />
                          <span className="text-xs font-bold">{previewVideo.association}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-jozi-gold" />
                          <span className="text-xs font-bold">{previewVideo.views.toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-8">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                      className="h-full bg-jozi-gold" 
                    />
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal Settings icon for consistency
const Settings = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default AdminContentManagement;