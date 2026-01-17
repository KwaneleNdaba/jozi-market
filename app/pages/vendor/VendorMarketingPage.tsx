import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import { 
  Target, 
  BarChart3, 
  Video, 
  Users, 
  Tag, 
  Plus, 
  Flame, 
  Sparkles,
  TrendingUp,
  Award,
  Eye
} from 'lucide-react';
import MarketingActive from '../../components/vendor/MarketingActive';
import MarketingCreate from '../../components/vendor/MarketingCreate';
import MarketingCoupons from '../../components/vendor/MarketingCoupons';
import MarketingVideos from '../../components/vendor/MarketingVideos';
import MarketingReferrals from '../../components/vendor/MarketingReferrals';
import MarketingAnalytics from '../../components/vendor/MarketingAnalytics';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorMarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');

  const tabs = [
    { id: 'active', label: 'Active Campaigns', icon: Flame },
    { id: 'create', label: 'Launch New', icon: Plus },
    { id: 'coupons', label: 'Vouchers', icon: Tag },
    { id: 'videos', label: 'Social Content', icon: Video },
    { id: 'referrals', label: 'Referral Program', icon: Users },
    { id: 'analytics', label: 'ROI Insights', icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Marketing Hub" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => setActiveTab('create')} 
      />

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Marketing ROI', val: '4.2x', trend: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Active Reach', val: '12.4k', trend: '+8.4k', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Conversion Yield', val: 'R14,200', trend: 'R120 / lead', icon: Target, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10' },
          { label: 'Artisan Points', val: '850', trend: 'Lvl 4', icon: Award, color: 'text-jozi-forest', bg: 'bg-jozi-forest/10' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-6 rounded-4xl shadow-soft border border-jozi-forest/5 text-left group hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{stat.label}</p>
            <h3 className="text-3xl font-black mt-2 text-jozi-forest">{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      {/* AI Notification Card */}
      <div className="bg-jozi-dark rounded-5xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-jozi-dark via-transparent to-jozi-gold/5" />
        <div className="relative z-10 flex items-center space-x-6">
          <div className="w-16 h-16 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-dark">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black uppercase tracking-tight">AI Strategy Insight</h3>
            <p className="text-jozi-cream/60 text-sm font-medium max-w-xl">
              Launch a "Weekend Flash" campaign targeting the "Loyal Neighbors" segment.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('create')}
          className="relative z-10 bg-white text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all"
        >
          Apply Recommendation
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white p-2 rounded-4xl shadow-soft border border-jozi-forest/5 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Content Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'active' && <MarketingActive />}
          {activeTab === 'create' && <MarketingCreate />}
          {activeTab === 'coupons' && <MarketingCoupons />}
          {activeTab === 'videos' && <MarketingVideos />}
          {activeTab === 'referrals' && <MarketingReferrals />}
          {activeTab === 'analytics' && <MarketingAnalytics />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorMarketingPage;