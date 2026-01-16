import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import ArtisanIntelligence from '../../components/vendor/ArtisanIntelligence';
import ShopAnalytics from '../../components/vendor/intelligence/ShopAnalytics';
import TrendingCartInsights from '../../components/vendor/intelligence/TrendingCartInsights';
import { 
  BrainCircuit, 
  BarChart3, 
  ShoppingCart, 
  ChevronRight,
  Download,
  Sparkles
} from 'lucide-react';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'analytics' | 'cart'>('ai');
  const [timeRange, setTimeRange] = useState('Weekly');

  const tabs = [
    { id: 'ai', label: 'AI Intelligence', icon: BrainCircuit },
    { id: 'analytics', label: 'Shop Analytics', icon: BarChart3 },
    { id: 'cart', label: 'Cart Insights', icon: ShoppingCart },
  ];

  return (
    <div className="space-y-8">
      {/* Contextual Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <VendorHeader 
          title="Intelligence Hub" 
          vendorName={VENDOR_PROFILE.name} 
        />
        
        <div className="flex items-center space-x-3 w-full xl:w-auto">
          <div className="flex bg-white p-1 rounded-2xl shadow-soft border border-gray-100">
            {['Daily', 'Weekly', 'Monthly'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  timeRange === r ? 'bg-jozi-forest text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft text-gray-400 hover:text-jozi-forest transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white p-2 rounded-4xl shadow-soft border border-jozi-forest/5 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'ai' | 'analytics' | 'cart')}
            className={`flex items-center space-x-3 px-10 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
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

      {/* Global AI Status Alert */}
      <div className="bg-jozi-dark rounded-4xl p-6 text-white flex items-center justify-between overflow-hidden relative group">
         <div className="flex items-center space-x-4 relative z-10">
            <div className="w-12 h-12 bg-jozi-gold/20 rounded-xl flex items-center justify-center text-jozi-gold border border-jozi-gold/30">
               <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm font-medium text-left">
               <span className="text-jozi-gold font-black uppercase tracking-widest mr-2">Oracle Online:</span>
               Current cycle data processed. Found <span className="font-black text-white underline decoration-jozi-gold decoration-2">4 actionable growth opportunities</span>.
            </p>
         </div>
         <ChevronRight className="w-5 h-5 text-jozi-gold relative z-10 group-hover:translate-x-2 transition-transform" />
         <BrainCircuit className="absolute -right-6 -bottom-6 w-32 h-32 opacity-5 text-jozi-gold group-hover:rotate-12 transition-transform duration-1000" />
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
          {activeTab === 'ai' && <ArtisanIntelligence />}
          {activeTab === 'analytics' && <ShopAnalytics />}
          {activeTab === 'cart' && <TrendingCartInsights />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorIntelligencePage;