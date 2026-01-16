import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Zap, 
  Info, 
  TrendingUp
} from 'lucide-react';
import PointsHeader from '../../components/loyalty/PointsHeader';
import TierProgress from '../../components/loyalty/TierProgress';
import RewardsStore from '../../components/loyalty/RewardsStore';
import WaysToEarn from '../../components/loyalty/WaysToEarn';
import LoyaltyHistory from '../../components/loyalty/LoyaltyHistory';
import AchievementsSection from '../../components/loyalty/AchievementsSection';
import CustomerSidebar from '../../components/CustomerSidebar';

const MOCK_USER = {
  name: "Lerato Dlamini",
  email: "lerato.d@jozimail.com",
  avatar: "https://picsum.photos/seed/lerato/200/200",
  currentPoints: 1250,
  lifetimePoints: 4500,
  spentPoints: 3250,
  expiringSoon: 150,
  currentTier: "Silver Neighbor",
  tierLevel: 2, 
  nextTier: "Gold Neighbor",
  pointsToNext: 750,
  ordersCount: 12,
  referralsCount: 4,
  level: 22,
  points: 1250
};

const CustomerLoyaltyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <div className="container mx-auto px-4 pt-12 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <CustomerSidebar user={MOCK_USER} />

          <main className="flex-grow space-y-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="text-left space-y-2">
                <div className="inline-flex items-center space-x-2 bg-jozi-gold/10 text-jozi-gold px-3 py-1 rounded-full border border-jozi-gold/20">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Neighborhood Rewards</span>
                </div>
                <h1 className="text-5xl font-black text-jozi-forest tracking-tighter leading-none uppercase">
                  Loyalty <br /><span className="text-jozi-gold">Boutique.</span>
                </h1>
                <p className="text-gray-400 font-medium italic">Supporting Jozi artisans pays back in gold.</p>
              </div>
              <PointsHeader user={MOCK_USER} />
            </header>

            {/* Tier Status Section */}
            <TierProgress user={MOCK_USER} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-12">
                {/* View Switcher */}
                <div className="flex p-1.5 bg-white rounded-2xl shadow-soft border border-jozi-forest/5 w-fit">
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                      activeTab === 'rewards' ? 'bg-jozi-forest text-white shadow-xl' : 'text-gray-400 hover:text-jozi-forest'
                    }`}
                  >
                    Available Rewards
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                      activeTab === 'history' ? 'bg-jozi-forest text-white shadow-xl' : 'text-gray-400 hover:text-jozi-forest'
                    }`}
                  >
                    Points Activity
                  </button>
                </div>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'rewards' ? <RewardsStore points={MOCK_USER.currentPoints} /> : <LoyaltyHistory />}
                </motion.div>

                <WaysToEarn />
              </div>

              {/* Sidebar / Gamification Widgets */}
              <aside className="lg:col-span-4 space-y-8">
                <AchievementsSection />
                
                {/* Limited Time Challenge */}
                <div className="bg-jozi-dark p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl group">
                  <Zap className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-700 text-jozi-gold" />
                  <div className="relative z-10 space-y-6 text-left">
                    <div className="flex items-center space-x-3">
                       <div className="p-3 bg-white/10 rounded-2xl text-jozi-gold">
                        <TrendingUp className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-black uppercase tracking-tight">Flash Quest</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-black text-jozi-gold uppercase">HERITAGE WEEKEND</p>
                      <p className="text-sm text-jozi-cream/60 leading-relaxed">Make any purchase from 3 different artisan categories by Sunday to earn <span className="text-white font-bold">500 Bonus Pts</span>.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase text-jozi-gold tracking-widest">
                        <span>Progress</span>
                        <span>1/3 Categories</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-jozi-gold w-1/3" />
                      </div>
                    </div>
                    <button className="w-full py-4 bg-white text-jozi-dark rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all">
                      Browse Categories
                    </button>
                  </div>
                </div>

                {/* Loyalty Info Tooltip Card */}
                <div className="p-8 bg-jozi-cream rounded-[2.5rem] border border-jozi-forest/5 text-left space-y-4">
                  <div className="flex items-center space-x-3 text-jozi-forest">
                    <Info className="w-5 h-5" />
                    <h4 className="font-black text-xs uppercase tracking-widest">How it works</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="text-xs text-gray-500 font-medium leading-relaxed">• Earn <span className="font-black text-jozi-forest">1 Point</span> for every <span className="font-black text-jozi-forest">R1</span> spent.</li>
                    <li className="text-xs text-gray-500 font-medium leading-relaxed">• Tiers are calculated based on rolling 12-month activity.</li>
                    <li className="text-xs text-gray-500 font-medium leading-relaxed">• Points expire 12 months after the earn date.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoyaltyPage;