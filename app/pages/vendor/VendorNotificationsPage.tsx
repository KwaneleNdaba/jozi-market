import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import NotificationFeed from '../../components/vendor/notifications/NotificationFeed';
import NotificationSettings from '../../components/vendor/notifications/NotificationSettings';
import { Bell, Settings } from 'lucide-react';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorNotificationsPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'feed' | 'settings'>('feed');

  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Alert Command" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => {}} 
      />

      <div className="flex space-x-2 bg-white p-2 rounded-4xl shadow-soft border border-jozi-forest/5 w-fit">
        <button
          onClick={() => setActiveView('feed')}
          className={`flex items-center space-x-3 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
            activeView === 'feed' 
              ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20' 
              : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notification Feed</span>
        </button>
        <button
          onClick={() => setActiveView('settings')}
          className={`flex items-center space-x-3 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
            activeView === 'settings' 
              ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20' 
              : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Alert Preferences</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeView === 'feed' ? <NotificationFeed /> : <NotificationSettings />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorNotificationsPage;