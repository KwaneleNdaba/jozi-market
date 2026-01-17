
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import { 
  Mail, 
  Plus, 
  BarChart3, 
  Users, 
  History, 
  Zap
} from 'lucide-react';
import EmailAnalytics from '../../components/vendor/email/EmailAnalytics';
import EmailCampaignCreator from '../../components/vendor/email/EmailCampaignCreator';
import EmailHistoryList from '../../components/vendor/email/EmailHistoryList';
import EmailSegmentSelector from '../../components/vendor/email/EmailSegmentSelector';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorEmailMarketingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'segments' | 'history'>('overview');

  const tabs = [
    { id: 'overview', label: 'Yield Analytics', icon: BarChart3 },
    { id: 'create', label: 'Compose Campaign', icon: Plus },
    { id: 'segments', label: 'Customer Segments', icon: Users },
    { id: 'history', label: 'Audit Logs', icon: History },
  ];

  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Campaign Engine" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => setActiveTab('create')} 
      />

      {/* Monthly Allowance Bar */}
      <div className="bg-white p-8 rounded-4xl border border-jozi-forest/5 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative text-left">
         <div className="space-y-4 relative z-10">
            <div className="flex items-center space-x-3 text-jozi-gold">
              <Mail className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Monthly Broadcast Quota</span>
            </div>
            <h2 className="text-4xl font-black text-jozi-forest tracking-tighter">
              8,450 / 15,000 <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Emails Sent</span>
            </h2>
            <div className="w-full md:w-[400px] h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(8450/15000)*100}%` }}
                className="h-full bg-jozi-gold"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-medium italic">Cycle resets in 14 days (Nov 1st). Upgrade to Pro for unlimited broadcast.</p>
         </div>
         <div className="flex flex-wrap gap-4 relative z-10">
            <div className="p-5 bg-jozi-cream rounded-3xl border border-jozi-forest/5 flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Open Rate</p>
              <p className="text-2xl font-black text-jozi-forest">42.4%</p>
            </div>
            <div className="p-5 bg-jozi-cream rounded-3xl border border-jozi-forest/5 flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Conversion</p>
              <p className="text-2xl font-black text-jozi-forest">8.1%</p>
            </div>
         </div>
         <Zap className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.03] text-jozi-forest pointer-events-none" />
      </div>

      {/* Tab Navigation */}
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

      {/* View Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'overview' && <EmailAnalytics />}
          {activeTab === 'create' && <EmailCampaignCreator onLaunch={() => setActiveTab('history')} />}
          {activeTab === 'segments' && <EmailSegmentSelector />}
          {activeTab === 'history' && <EmailHistoryList />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorEmailMarketingPage;
