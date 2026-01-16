import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, Sparkles, Megaphone, BarChart3, Wallet, 
  Search, Filter, ChevronRight, Info, Plus, 
  TrendingUp, Target, MousePointer2, Star, 
  Bell, CheckCircle2, AlertCircle, Upload, 
  MessageSquare, ExternalLink, Calendar, Package
} from 'lucide-react';
import InfluencerSidebar from '../../components/influencer/InfluencerSidebar';
import InfluencerHeader from '../../components/influencer/InfluencerHeader';
import CampaignCard from '../../components/influencer/CampaignCard';
import PerformanceChart from '../../components/influencer/PerformanceChart';
import PayoutTable from '../../components/influencer/PayoutTable';
import RecommendationCard from '../../components/influencer/RecommendationCard';
import StatCard from '../../components/influencer/StatCard';
import { 
  INFLUENCER_CAMPAIGNS, 
  INFLUENCER_STATS, 
  INFLUENCER_RECS, 
  INFLUENCER_PAYOUTS 
} from '../../utilities/influencerDashboardMockData';

interface InfluencerDashboardProps {
  tab?: 'overview' | 'campaigns' | 'analytics' | 'wallet';
}

const INFLUENCER_PROFILE = {
  name: "Zanele M.",
  handle: "@zan_style_jhb",
  avatar: "https://i.pravatar.cc/150?u=zan",
  niche: "Heritage Fashion",
  score: "94.8",
  balance: "R12,450"
};

const InfluencerDashboard: React.FC<InfluencerDashboardProps> = ({ tab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(tab);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = useMemo(() => {
    return INFLUENCER_CAMPAIGNS.filter(c => 
      c.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.products.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-8 pb-32">
      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <InfluencerSidebar 
            profile={INFLUENCER_PROFILE} 
            activeTab={activeTab} 
            onTabChange={(t: any) => setActiveTab(t)} 
          />

          <main className="flex-grow space-y-10 text-left">
            <InfluencerHeader 
              title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
              profile={INFLUENCER_PROFILE} 
            />

            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* AI Oracle Banner */}
                <div className="bg-jozi-dark rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-r from-jozi-dark via-transparent to-jozi-gold/5" />
                  <div className="relative z-10 flex items-center space-x-6">
                    <div className="w-16 h-16 bg-jozi-gold rounded-[1.5rem] flex items-center justify-center text-jozi-dark shadow-xl">
                      <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Oracle Content Tip</h3>
                      <p className="text-jozi-cream/60 text-sm font-medium max-w-xl">
                        Heritage Month is peaking in <span className="text-white font-bold underline decoration-jozi-gold decoration-2">Sandton</span>. Your "Maboneng Thread" reel is predicted to generate <span className="text-jozi-gold font-bold">4.2x higher conversion</span> if posted before 18:00 tonight.
                      </p>
                    </div>
                  </div>
                  <button className="relative z-10 bg-white text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">
                    Post Proof
                  </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {INFLUENCER_STATS.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                  ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                   {/* Left: Active Campaigns */}
                   <div className="xl:col-span-2 space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Current Manifest</h3>
                         <Link href="/influencer/campaigns" className="text-xs font-black text-jozi-gold uppercase tracking-widest hover:underline flex items-center">
                            All Campaigns <ChevronRight className="w-4 h-4 ml-1" />
                         </Link>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                         {INFLUENCER_CAMPAIGNS.filter(c => c.status === 'Active').map((campaign) => (
                           <CampaignCard key={campaign.id} campaign={campaign} />
                         ))}
                      </div>
                   </div>

                   {/* Right: AI Recommendations */}
                   <div className="space-y-8">
                      <div className="flex items-center space-x-3 text-jozi-gold">
                        <Sparkles className="w-5 h-5 fill-current" />
                        <h3 className="text-xl font-black uppercase tracking-tight text-jozi-forest">High Yield Picks</h3>
                      </div>
                      <div className="space-y-6">
                         {INFLUENCER_RECS.map((rec) => (
                           <RecommendationCard key={rec.id} recommendation={rec} />
                         ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'campaigns' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                   <div className="relative flex-grow w-full">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search stores or artifacts..." 
                        className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none border-2 border-transparent focus:border-jozi-gold/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                   <div className="flex items-center space-x-2">
                      <button className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-jozi-forest transition-all border border-transparent">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="px-6 py-4 bg-jozi-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/10">
                        History
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredCampaigns.map((c) => (
                    <CampaignCard key={c.id} campaign={c} detailed />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                 <PerformanceChart />
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2">
                      <PayoutTable payouts={INFLUENCER_PAYOUTS} />
                   </div>
                   <div className="space-y-8 text-left">
                      <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl group">
                         <div className="relative z-10 space-y-6">
                            <div className="flex items-center space-x-3 text-jozi-gold">
                               <Wallet className="w-8 h-8" />
                               <h3 className="text-xl font-black uppercase tracking-tight">Liquid Capital</h3>
                            </div>
                            <div>
                               <p className="text-5xl font-black tracking-tighter">R12,450</p>
                               <p className="text-xs text-jozi-cream/40 font-medium mt-2">Available for immediate withdrawal.</p>
                            </div>
                            <button className="w-full py-5 bg-white text-jozi-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">
                               Request Settlement
                            </button>
                         </div>
                         <TrendingUp className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                      </div>

                      <div className="p-8 bg-jozi-cream/50 rounded-[2.5rem] border border-jozi-forest/5 space-y-4">
                         <h4 className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">Payout Protocol</h4>
                         <div className="flex items-center space-x-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-bold text-jozi-forest">Instant Payouts Enabled</span>
                         </div>
                         <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">Verification complete. Settlement window: 4-8 business hours.</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;