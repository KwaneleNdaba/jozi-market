
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Info,
  Trophy,
  Package,
  Heart,
  QrCode,
  TrendingUp,
  Medal,
  Smartphone,
  Backpack,
  Shirt,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const ReferralPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'rewards' | 'leaderboard'>('rewards');
  const referralCode = "JOZI-LEGEND-88";
  const referralLink = `https://jozimarket.co.za/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStats = {
    total: 12,
    verified: 7, // Counted only after first purchase
    pending: 5,
    rank: 42,
    daysLeft: 22
  };

  const campaignRewards = [
    {
      slot: 1,
      id: "reward-1",
      name: "The Platinum Slot",
      product: "Samsung Galaxy S24 Ultra",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
      requirement: "25+ Verified Referrals",
      icon: Smartphone,
      color: "from-blue-500 to-indigo-600",
      description: "The ultimate tool for the ultimate Joburg connector."
    },
    {
      slot: 2,
      id: "reward-2",
      name: "The Gold Slot",
      product: "Handcrafted Leather Travel Set",
      image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800",
      requirement: "12+ Verified Referrals",
      icon: Backpack,
      color: "from-jozi-gold to-jozi-bright",
      description: "Premium Soweto-made leather backpack and wallet."
    },
    {
      slot: 3,
      id: "reward-3",
      name: "The Silver Slot",
      product: "Jozi 'Legacy' Apparel Bundle",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      requirement: "5+ Verified Referrals",
      icon: Shirt,
      color: "from-jozi-forest to-emerald-700",
      description: "Limited edition hoodie and heavyweight tee."
    }
  ];

  const leaderboard = [
    { name: "Tshepo M.", verified: 34, avatar: "https://picsum.photos/seed/user1/100/100", rank: 1 },
    { name: "Lerato D.", verified: 28, avatar: "https://picsum.photos/seed/user2/100/100", rank: 2 },
    { name: "Kevin S.", verified: 22, avatar: "https://picsum.photos/seed/user3/100/100", rank: 3 },
    { name: "Zanele K.", verified: 19, avatar: "https://picsum.photos/seed/user4/100/100", rank: 4 },
    { name: "Michael O.", verified: 15, avatar: "https://picsum.photos/seed/user5/100/100", rank: 5 },
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      {/* Dynamic Campaign Header */}
      <section className="bg-jozi-forest py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center bg-white/10 border border-white/20 px-5 py-2.5 rounded-full text-jozi-gold shadow-xl"
              >
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-xs font-black uppercase tracking-widest text-white">Campaign ends in {referralStats.daysLeft} Days</span>
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                BECOME A <br />
                <span className="text-jozi-gold">JOZI LEGEND.</span>
              </h1>
              <p className="text-jozi-cream/70 text-xl font-medium leading-relaxed">
                Refer friends, grow our community, and claim Joburg's most exclusive rewards. 
                <span className="text-white font-bold ml-1 italic underline underline-offset-4 decoration-jozi-gold">Verified referrals only.</span>
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 w-full max-w-md shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-jozi-gold opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-forest shadow-2xl">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Global Ranking</p>
                    <p className="text-4xl font-black text-white tracking-tighter">#{referralStats.rank}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                    <p className="text-4xl font-black text-jozi-gold">{referralStats.verified}</p>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Verified</p>
                  </div>
                  <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                    <p className="text-4xl font-black text-white/40">{referralStats.pending}</p>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Pending</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest">
                    <span>Next Reward: Slot 2</span>
                    <span>{referralStats.verified}/12</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(referralStats.verified / 12) * 100}%` }}
                      className="h-full bg-gradient-to-r from-jozi-gold to-jozi-bright"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Actions Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-jozi-forest/5 space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-grow space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-black text-jozi-forest">Start Referring Today</h2>
              <p className="text-gray-500 font-medium">When friends register and make their first purchase, you move up the leaderboard.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-grow bg-jozi-cream rounded-2xl px-6 py-4 border-2 border-dashed border-jozi-forest/10 flex items-center justify-between min-w-[300px]">
                <span className="font-black text-jozi-forest text-sm truncate mr-4">{referralCode}</span>
                <button 
                  onClick={handleCopy}
                  className="shrink-0 flex items-center space-x-2 text-jozi-gold font-black uppercase text-[10px] tracking-widest hover:text-jozi-forest transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <button className="bg-jozi-forest text-white p-5 rounded-2xl hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-5 p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-jozi-forest shadow-sm shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg">1. Invite</h4>
                <p className="text-sm text-gray-400 font-medium">Share your unique code via social media or email.</p>
              </div>
            </div>
            <div className="flex items-start space-x-5 p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-jozi-forest shadow-sm shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg">2. Verify</h4>
                <p className="text-sm text-gray-400 font-medium">Referral becomes 'Verified' after their first paid order.</p>
              </div>
            </div>
            <div className="flex items-start space-x-5 p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-jozi-forest shadow-sm shrink-0">
                <Medal className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg">3. Win</h4>
                <p className="text-sm text-gray-400 font-medium">Top the leaderboard to win high-end tech & craft.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Rewards vs Leaderboard Tabs */}
      <section className="container mx-auto px-4 mt-24">
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white p-2 rounded-3xl shadow-soft border border-jozi-forest/5">
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                activeTab === 'rewards' ? 'bg-jozi-forest text-white shadow-xl' : 'text-gray-400 hover:text-jozi-forest'
              }`}
            >
              Reward Slots
            </button>
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                activeTab === 'leaderboard' ? 'bg-jozi-forest text-white shadow-xl' : 'text-gray-400 hover:text-jozi-forest'
              }`}
            >
              Global Leaderboard
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'rewards' ? (
            <motion.div 
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-12"
            >
              {campaignRewards.map((reward, idx) => (
                <div 
                  key={reward.id} 
                  className={`group relative bg-white rounded-[4rem] p-12 shadow-soft hover:shadow-2xl transition-all border border-jozi-forest/5 flex flex-col items-center text-center overflow-hidden ${
                    reward.slot === 1 ? 'lg:-translate-y-8 ring-4 ring-jozi-gold/20' : ''
                  }`}
                >
                  {reward.slot === 1 && (
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-jozi-gold via-jozi-bright to-jozi-gold" />
                  )}
                  
                  <div className={`w-24 h-24 bg-gradient-to-br ${reward.color} rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    <reward.icon className="w-12 h-12" />
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold mb-1">{reward.name}</p>
                      <h3 className="text-3xl font-black text-jozi-forest tracking-tighter leading-tight">{reward.product}</h3>
                    </div>
                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden my-6 border-4 border-jozi-cream shadow-inner">
                      <img src={reward.image} alt={reward.product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed">{reward.description}</p>
                  </div>

                  <div className="mt-10 pt-10 border-t border-jozi-forest/5 w-full space-y-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Requirement</span>
                      <span className="text-xl font-black text-jozi-forest">{reward.requirement}</span>
                    </div>
                    <button className="w-full py-5 bg-jozi-cream rounded-2xl font-black text-sm uppercase tracking-widest text-jozi-forest group-hover:bg-jozi-forest group-hover:text-white transition-all shadow-sm">
                      View Milestone
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-jozi-forest/5 overflow-hidden">
                <div className="flex items-center justify-between mb-10 px-4">
                  <h3 className="text-2xl font-black text-jozi-forest">Top Referrers</h3>
                  <div className="flex items-center space-x-2 text-jozi-gold font-bold text-sm">
                    <Trophy className="w-5 h-5" />
                    <span>Real-time Updates</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div 
                      key={user.rank}
                      className={`flex items-center justify-between p-6 rounded-[2rem] transition-all group ${
                        user.rank <= 3 ? 'bg-jozi-cream/50' : 'hover:bg-jozi-cream/30'
                      }`}
                    >
                      <div className="flex items-center space-x-8">
                        <div className={`w-12 h-12 flex items-center justify-center font-black text-xl italic ${
                          user.rank === 1 ? 'text-jozi-gold text-3xl' : 
                          user.rank === 2 ? 'text-gray-400' : 
                          user.rank === 3 ? 'text-jozi-gold/60' : 'text-gray-200'
                        }`}>
                          #{user.rank}
                        </div>
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                          <img src={user.avatar} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-jozi-forest">{user.name}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level 22 Connector</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-jozi-forest">{user.verified}</p>
                        <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">Verified</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current User Row - Sticky feel */}
                <div className="mt-12 p-8 bg-jozi-forest rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl">
                  <div className="flex items-center space-x-8">
                    <div className="w-12 h-12 flex items-center justify-center font-black text-xl italic text-jozi-gold">
                      #{referralStats.rank}
                    </div>
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white/20">
                      <img src="https://picsum.photos/seed/current/100/100" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xl font-black">You (Current Rank)</p>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Keep going to reach Slot 3!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-jozi-gold">{referralStats.verified}</p>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Verified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Rules & Transparency */}
      <section className="container mx-auto px-4 mt-40">
        <div className="bg-jozi-dark rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-none uppercase">Fair Play <br /><span className="text-jozi-gold">Guidelines.</span></h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold shrink-0">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">First Purchase Required</h4>
                    <p className="text-jozi-cream/50 font-medium">Friend must register and place an order over R100 to count as a verified referral.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">Fraud Protection</h4>
                    <p className="text-jozi-cream/50 font-medium">Multiple accounts or bot registrations result in immediate disqualification.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">Monthly Resets</h4>
                    <p className="text-jozi-cream/50 font-medium">Milestones reset every month on the 1st at midnight. Start fresh, win more.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] space-y-10">
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">Become a Partner</p>
                <h3 className="text-4xl font-black">Brand Ambassador</h3>
              </div>
              <p className="text-jozi-cream/70 text-center font-medium leading-relaxed">
                Refer more than 50 verified users in a single month to unlock 10% lifetime commission and official Jozi Market Ambassador status.
              </p>
              <div className="flex flex-col gap-4">
                <button className="w-full py-5 bg-white text-jozi-forest rounded-2xl font-black text-lg hover:bg-jozi-gold transition-all shadow-2xl">
                  Apply for Partnership
                </button>
                <button className="w-full py-5 border-2 border-white/20 rounded-2xl font-black text-lg hover:bg-white/10 transition-all">
                  Full Program Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReferralPage;
