import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  Bell, 
  Layers, 
  Database,
  Sparkles
} from 'lucide-react';
import SettingsProfile from '../../components/vendor/SettingsProfile';
import SettingsSecurity from '../../components/vendor/SettingsSecurity';
import SettingsPayments from '../../components/vendor/SettingsPayments';
import SettingsNotifications from '../../components/vendor/SettingsNotifications';
import SettingsSubscription from '../../components/vendor/SettingsSubscription';
import SettingsData from '../../components/vendor/SettingsData';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'payments' | 'notifications' | 'subscription' | 'data'>('profile');

  const tabs = [
    { id: 'profile', label: 'Workshop Profile', icon: User },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
    { id: 'payments', label: 'Payout Config', icon: CreditCard },
    { id: 'notifications', label: 'Preferences', icon: Bell },
    { id: 'subscription', label: 'Success Plan', icon: Layers },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  return (
    <div className="space-y-8 text-left">
      <VendorHeader 
        title="Workshop Config" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => alert('Opening Piece Upload...')} 
      />

      {/* AI Recommendation Banner */}
      <div className="bg-jozi-forest rounded-5xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-jozi-dark via-transparent to-jozi-gold/10" />
        <div className="relative z-10 flex items-center space-x-6">
          <div className="w-16 h-16 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-dark shadow-xl">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black uppercase tracking-tight">Configuration Tip</h3>
            <p className="text-jozi-cream/60 text-sm font-medium max-w-xl">
              Verified banners see a <span className="text-jozi-gold font-bold">25% increase</span> in trust.
            </p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('profile')}
          className="relative z-10 bg-white text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl"
        >
          Complete Profile
        </button>
      </div>

      {/* Settings Navigation */}
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
          {activeTab === 'profile' && <SettingsProfile />}
          {activeTab === 'security' && <SettingsSecurity />}
          {activeTab === 'payments' && <SettingsPayments />}
          {activeTab === 'notifications' && <SettingsNotifications />}
          {activeTab === 'subscription' && <SettingsSubscription />}
          {activeTab === 'data' && <SettingsData />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorSettingsPage;