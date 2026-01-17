import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import { 
  Share2, 
  BarChart3, 
  History, 
  Instagram, 
  Plus, 
  TrendingUp,
  Smartphone
} from 'lucide-react';
import ExposureUpload from '../../components/vendor/exposure/ExposureUpload';
import ExposureHistory from '../../components/vendor/exposure/ExposureHistory';
import ExposureAnalytics from '../../components/vendor/exposure/ExposureAnalytics';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorExposurePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'analytics'>('upload');
  const [postsUsed, setPostsUsed] = useState(2);
  const maxPosts = 5;

  const tabs = [
    { id: 'upload', label: 'Create Exposure', icon: Plus },
    { id: 'history', label: 'Submission Logs', icon: History },
    { id: 'analytics', label: 'Impact Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Social Exposure" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => setActiveTab('upload')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-4xl border border-jozi-forest/5 shadow-soft flex items-center justify-between group overflow-hidden relative text-left">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center space-x-3 text-jozi-gold">
              <Share2 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Monthly Allowance</span>
            </div>
            <h2 className="text-4xl font-black text-jozi-forest tracking-tighter">
              {postsUsed} / {maxPosts} <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Posts Used</span>
            </h2>
            <div className="w-full md:w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(postsUsed / maxPosts) * 100}%` }}
                className="h-full bg-jozi-gold"
              />
            </div>
          </div>
          <Smartphone className="absolute bottom-6 right-8 w-16 h-16 text-jozi-forest/5 group-hover:rotate-12 transition-transform duration-500" />
        </div>

        <div className="bg-jozi-dark p-8 rounded-5xl text-white flex items-center justify-between relative overflow-hidden group shadow-2xl">
          <div className="relative z-10 space-y-4 text-left">
            <div className="flex items-center space-x-3 text-jozi-gold">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Performance</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Global Reach Spike</h3>
            <p className="text-sm text-jozi-cream/60">Your last TikTok post reached <span className="text-white font-bold">12k+ viewers</span>.</p>
          </div>
          <Instagram className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>

      <div className="flex space-x-2 bg-white p-2 rounded-4xl shadow-soft border border-jozi-forest/5 overflow-x-auto scrollbar-hide w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-3 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20' 
                : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'upload' && <ExposureUpload canPost={postsUsed < maxPosts} onComplete={() => setPostsUsed(p => p + 1)} />}
          {activeTab === 'history' && <ExposureHistory />}
          {activeTab === 'analytics' && <ExposureAnalytics />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorExposurePage;