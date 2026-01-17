
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronRight, Info, BrainCircuit, Sparkles, Megaphone, BarChart3, Wallet
} from 'lucide-react';
import VendorHeader from '../../components/VendorHeader';
import InfluencerCard from '../../components/vendor/influencers/InfluencerCard';
import RecommendationCard from '../../components/vendor/influencers/RecommendationCard';
import CampaignTable from '../../components/vendor/influencers/CampaignTable';
import AnalyticsDashboard from '../../components/vendor/influencers/AnalyticsDashboard';
import BookingModal from '../../components/vendor/influencers/BookingModal';
import { MOCK_INFLUENCERS, MOCK_CAMPAIGNS, AI_PICKS } from '../../utilities/influencerMockData';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorInfluencerHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discovery' | 'campaigns' | 'analytics' | 'payouts'>('discovery');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'discovery', label: 'Discovery & AI', icon: Search },
    { id: 'campaigns', label: 'Campaign Manager', icon: Megaphone },
    { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
    { id: 'payouts', label: 'Payout Ledger', icon: Wallet },
  ];

  const handleBookInitiation = (influencer: any) => {
    setSelectedInfluencer(influencer);
    setIsBookingOpen(true);
  };

  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Social Accelerator" 
        vendorName={VENDOR_PROFILE.name} 
        onUploadClick={() => setActiveTab('discovery')} 
      />

      {/* Global AI Status Alert */}
      <div className="bg-jozi-dark rounded-4xl p-6 text-white flex items-center justify-between overflow-hidden relative group">
         <div className="flex items-center space-x-4 relative z-10 text-left">
            <div className="w-12 h-12 bg-jozi-gold/20 rounded-xl flex items-center justify-center text-jozi-gold border border-jozi-gold/30">
               <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm font-medium">
               <span className="text-jozi-gold font-black uppercase tracking-widest mr-2">Oracle Suggestion:</span>
               Based on your recent <span className="font-bold">Textile</span> sales, we found 3 creators with high audience affinity for your brand.
            </p>
         </div>
         <ChevronRight className="w-5 h-5 text-jozi-gold relative z-10 group-hover:translate-x-2 transition-transform" />
         <BrainCircuit className="absolute -right-6 -bottom-6 w-32 h-32 opacity-5 text-jozi-gold group-hover:rotate-12 transition-transform duration-1000" />
      </div>
      
      {/* Local Navigation Tabs */}
      <div className="flex bg-white p-1 rounded-2xl shadow-soft border border-jozi-forest/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-jozi-forest text-white shadow-lg' 
                : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden lg:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'discovery' && (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* AI Recommendations Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <div className="p-2 bg-jozi-gold/20 rounded-xl text-jozi-gold">
                    <Sparkles className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="text-xl font-black text-jozi-forest uppercase tracking-tight">Oracle's Top Picks</h3>
                </div>
                <div className="hidden sm:flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                  <Info className="w-3 h-3 mr-1" /> Matches your category velocity
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {AI_PICKS.map((pick) => (
                  <RecommendationCard 
                    key={pick.id} 
                    influencer={pick} 
                    onBook={() => handleBookInitiation(pick)}
                  />
                ))}
              </div>
            </section>

            {/* General Discovery Section */}
            <section className="space-y-6">
              <div className="bg-white p-6 rounded-4xl shadow-soft border border-gray-100 flex flex-col lg:flex-row items-center gap-6">
                <div className="relative grow w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search niche, region, or creator name..."
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-jozi-gold/20 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm text-jozi-forest outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_INFLUENCERS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((inf) => (
                  <InfluencerCard 
                    key={inf.id} 
                    influencer={inf} 
                    onBook={() => handleBookInitiation(inf)}
                  />
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'campaigns' && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CampaignTable campaigns={MOCK_CAMPAIGNS} />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalyticsDashboard />
          </motion.div>
        )}

        {activeTab === 'payouts' && (
          <motion.div
            key="payouts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-5xl p-12 shadow-soft border border-gray-100 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-jozi-cream rounded-full flex items-center justify-center mx-auto text-jozi-forest">
              <Wallet className="w-10 h-10 opacity-30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-jozi-forest uppercase">Commission Ledger</h3>
              <p className="text-gray-400 max-w-sm mx-auto font-medium italic">All influencer commissions are automatically calculated from verified referral sales.</p>
            </div>
            <div className="pt-8 border-t border-gray-50 flex justify-center gap-4">
              <button className="bg-jozi-forest text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all">
                Export Statement
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        influencer={selectedInfluencer}
      />
    </div>
  );
};

export default VendorInfluencerHub;
