
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Gift, 
  ArrowRight, 
  Zap, 
  Target, 
  Star, 
  Map, 
  RotateCcw, 
  Flame, 
  Clock, 
  Lock,
  ChevronRight,
  Award,
  Sparkles,
  Ticket,
  Users
} from 'lucide-react';
import Link from 'next/link';

const GamificationPage: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [points, setPoints] = useState(1250);
  const [activeTab, setActiveTab] = useState<'games' | 'challenges' | 'rewards'>('rewards');

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    
    // Simulate spin
    setTimeout(() => {
      setIsSpinning(false);
      const winnings = [50, 100, 200, 'Free Shipping', 'Mystery Box'];
      const result = winnings[Math.floor(Math.random() * winnings.length)];
      setSpinResult(result.toString());
      if (typeof result === 'number') setPoints(p => p + result);
    }, 3000);
  };

  const dailyStreak = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true },
    { day: 'Fri', active: false },
    { day: 'Sat', active: false },
    { day: 'Sun', active: false },
  ];

  return (
    <div className="pb-20">
      {/* Dynamic Header / Stats Bar */}
      <section className="bg-white border-b border-jozi-forest/5 sticky top-20 z-30 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-jozi-gold rounded-xl flex items-center justify-center text-jozi-forest shadow-lg shadow-jozi-gold/20">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Your Balance</p>
                <p className="text-xl font-black text-jozi-forest">{points.toLocaleString()} <span className="text-sm font-bold text-jozi-gold">PTS</span></p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100 hidden sm:block" />
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Daily Streak</p>
                <p className="text-xl font-black text-jozi-forest">4 Days</p>
              </div>
            </div>
          </div>

          {/* <div className="flex bg-jozi-cream p-1 rounded-xl border border-jozi-forest/5">
            {['games', 'challenges', 'rewards'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-sm font-black capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-jozi-forest shadow-md' : 'text-gray-400 hover:text-jozi-forest'
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}
        </div>
      </section>

      <div className="container mx-auto px-4 pt-12">
        {/* New Referral Program Entry Banner */}
        <section className="mb-12">
          <div className="bg-linear-to-r from-jozi-dark to-jozi-forest p-10 rounded-5xl text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10 flex items-center space-x-6">
              <div className="w-20 h-20 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-forest group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight">Invite Friends, Claim Treasures</h3>
                <p className="text-jozi-cream/60 font-medium max-w-lg">Unlock the Treasure Path by sharing Jozi Market. Earn free keyrings, prints, and exclusive apparel.</p>
              </div>
            </div>
            <Link href="/referrals" className="relative z-10 bg-jozi-gold text-jozi-forest px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
              Go to Referrals
            </Link>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {/* {activeTab === 'games' && (
            <motion.div
              key="games-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              Featured Game: Spin the Wheel
              <div className="bg-jozi-forest rounded-5xl p-12 lg:p-20 overflow-hidden relative text-white">
                <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="space-y-8">
                    <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full">
                      <Zap className="w-4 h-4 text-jozi-gold mr-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">Daily Spin Available</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black leading-[0.85] tracking-tighter">
                      SPIN FOR <br />
                      <span className="text-jozi-gold">GOLDEN</span> <br />
                      REWARDS.
                    </h2>
                    <p className="text-jozi-cream/60 text-lg max-w-md font-medium">
                      Test your luck at the Jozi Wheel. Win anything from bonus points to exclusive free delivery vouchers.
                    </p>
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className={`bg-jozi-gold text-jozi-forest px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-black/20 hover:scale-105 transition-all flex items-center ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSpinning ? 'Spinning...' : 'Spin for 50 Pts'}
                        <RotateCcw className={`ml-2 w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    {spinResult && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl inline-block"
                      >
                        <p className="text-sm font-bold uppercase tracking-widest text-jozi-gold">You Won!</p>
                        <p className="text-3xl font-black">{spinResult}</p>
                      </motion.div>
                    )}
                  </div>

                  Wheel Visualization
                  <div className="relative flex justify-center">
                    <motion.div 
                      animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 0 }}
                      transition={isSpinning ? { duration: 3, ease: "easeOut" } : { duration: 0 }}
                      className="w-80 h-80 lg:w-[450px] lg:h-[450px] rounded-full border-12 border-white/10 relative shadow-2xl overflow-hidden"
                      style={{ background: 'conic-gradient(#C7A16E 0deg 45deg, #1B5E52 45deg 90deg, #C7A16E 90deg 135deg, #1B5E52 135deg 180deg, #C7A16E 180deg 225deg, #1B5E52 225deg 270deg, #C7A16E 270deg 315deg, #1B5E52 315deg 360deg)' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center text-jozi-forest font-black text-xl">
                          JOZI
                        </div>
                      </div>
                    </motion.div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-white filter drop-shadow-lg">
                      <div className="w-8 h-10 bg-white clip-path-triangle rotate-180" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
                    </div>
                  </div>
                </div>
                
                Abstract background blobs
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-jozi-gold/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-jozi-bright/10 rounded-full blur-[100px]" />
              </div>

              Other Mini Games Grid
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Scratch & Win', icon: Award, desc: 'Find 3 matching Jozi icons to win the jackpot.', points: 'Cost: 20 Pts', level: 'Novice' },
                  { title: 'Market Trivia', icon: Target, desc: 'Test your knowledge of South African heritage.', points: 'Win: 150 Pts', level: 'Expert' },
                  { title: 'Vendor Hunt', icon: Map, desc: 'Explore 5 stores to find hidden voucher codes.', points: 'Win: 500 Pts', level: 'Master', locked: true },
                ].map((game, i) => (
                  <div key={i} className="group bg-white p-8 rounded-4xl border border-jozi-forest/5 shadow-soft hover:shadow-xl transition-all relative overflow-hidden">
                    {game.locked && (
                      <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-jozi-forest text-white rounded-full flex items-center justify-center mb-2 shadow-lg">
                          <Lock className="w-6 h-6" />
                        </div>
                        <p className="font-black text-jozi-forest text-sm">Unlocks at Level 10</p>
                      </div>
                    )}
                    <div className="w-16 h-16 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest mb-6 group-hover:scale-110 transition-transform">
                      <game.icon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">{game.level}</span>
                    <h3 className="text-xl font-black text-jozi-forest mt-1">{game.title}</h3>
                    <p className="text-gray-500 text-sm font-medium mt-4 leading-relaxed">{game.desc}</p>
                    <div className="mt-8 pt-6 border-t border-jozi-forest/5 flex items-center justify-between">
                      <span className="text-xs font-black text-jozi-forest uppercase tracking-widest">{game.points}</span>
                      <button className="text-jozi-gold font-black flex items-center hover:translate-x-1 transition-transform">
                        Play <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )} */}

          {/* {activeTab === 'challenges' && (
            <motion.div
              key="challenges-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-12"
            >
              Daily Streak Section
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-8 rounded-4xl border border-jozi-forest/5 shadow-soft">
                  <h3 className="text-xl font-black text-jozi-forest mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-jozi-gold" />
                    Daily Streak
                  </h3>
                  <div className="flex justify-between items-center px-2">
                    {dailyStreak.map((s, i) => (
                      <div key={i} className="flex flex-col items-center space-y-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase">{s.day}</span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          s.active ? 'bg-jozi-gold text-white shadow-lg shadow-jozi-gold/40 scale-110' : 'bg-gray-50 text-gray-200'
                        }`}>
                          <Flame className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-jozi-forest/5 rounded-2xl">
                    <p className="text-xs font-bold text-jozi-forest text-center">Maintain your streak for 7 days to earn a <span className="text-jozi-gold">Mystery Treasure Box</span>!</p>
                  </div>
                </div>

                <div className="bg-jozi-gold p-8 rounded-4xl text-jozi-forest relative overflow-hidden group">
                  <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-20 group-hover:rotate-12 transition-transform" />
                  <h3 className="text-xl font-black mb-2">Double XP Weekend</h3>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">Every purchase this weekend earns 2x points for your level progression.</p>
                  <div className="mt-6 flex items-center font-black uppercase text-xs tracking-widest">
                    Ends in 14:22:05
                  </div>
                </div>
              </div>

              Active Challenges List
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-black text-jozi-forest flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-jozi-gold" />
                  Your Active Quests
                </h3>
                {[
                  { title: 'The Fashionista', desc: 'Buy 2 items from Maboneng Textiles.', points: 1200, progress: 50, category: 'Shopping' },
                  { title: 'Support Local', desc: 'Visit 10 different vendor profiles this week.', points: 450, progress: 80, category: 'Explore' },
                  { title: 'Gift Giver', desc: 'Leave a 5-star review for any 3 products.', points: 300, progress: 33, category: 'Community' },
                  { title: 'High Spender', desc: 'Complete an order over R2500.', points: 2500, progress: 0, category: 'Achievement' },
                ].map((q, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-jozi-forest/5 shadow-soft hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-14 h-14 bg-jozi-forest/5 rounded-2xl flex items-center justify-center shrink-0">
                      <Ticket className="w-6 h-6 text-jozi-forest" />
                    </div>
                    <div className="grow space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">{q.category}</span>
                          <h4 className="font-bold text-jozi-forest text-lg">{q.title}</h4>
                          <p className="text-xs text-gray-400 font-medium">{q.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-jozi-forest">+{q.points}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Points</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                          <span>Progress</span>
                          <span>{q.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${q.progress}%` }}
                            className="h-full bg-jozi-forest"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )} */}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl font-black text-jozi-forest">Jozi Rewards Boutique</h2>
                <p className="text-gray-500 font-medium leading-relaxed">Redeem your hard-earned points for exclusive vouchers, limited edition merch, and Joburg's finest experiences.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: 'R100 Off Voucher', points: 1000, type: 'Savings', rarity: 'Common' },
                  { title: 'Free Express Shipping', points: 2500, type: 'Service', rarity: 'Rare' },
                  { title: 'Jozi Market Tote', points: 4500, type: 'Merch', rarity: 'Epic' },
                  { title: 'Artisanal Coffee Box', points: 8000, type: 'Food', rarity: 'Legendary' },
                  { title: 'R500 Mega Voucher', points: 15000, type: 'Savings', rarity: 'Mythic' },
                  { title: 'VIP Market Pass', points: 25000, type: 'Event', rarity: 'Limited' },
                ].map((reward, i) => (
                  <div key={i} className="group bg-white rounded-4xl border border-jozi-forest/5 shadow-soft hover:shadow-xl transition-all flex flex-col items-center p-8 text-center relative">
                    <div className="absolute top-6 right-6">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        reward.rarity === 'Legendary' ? 'bg-jozi-gold text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {reward.rarity}
                      </span>
                    </div>
                    <div className="w-20 h-20 bg-jozi-gold/5 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-jozi-gold/10 transition-colors">
                      <Gift className="w-10 h-10 text-jozi-gold" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{reward.type}</span>
                    <h4 className="text-xl font-black text-jozi-forest mt-1">{reward.title}</h4>
                    
                    <div className="mt-8 flex flex-col items-center space-y-4 w-full">
                      <div className="flex items-center space-x-1">
                        <span className="text-3xl font-black text-jozi-forest">{reward.points.toLocaleString()}</span>
                        <span className="text-xs font-bold text-jozi-gold uppercase">Pts</span>
                      </div>
                      <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                        points >= reward.points 
                          ? 'bg-jozi-forest text-white hover:bg-jozi-dark shadow-lg shadow-jozi-forest/10' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}>
                        {points >= reward.points ? 'Redeem Item' : `Need ${reward.points - points} More`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Level Progress */}
      <div className="fixed bottom-8 right-8 z-40 hidden md:block">
        <div className="bg-jozi-dark text-white p-6 rounded-3xl shadow-2xl border border-white/10 flex items-center space-x-6 w-80">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-white/10 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-jozi-gold stroke-current" strokeWidth="3" strokeDasharray="65, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-lg">7</div>
          </div>
          <div className="grow">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Level Progression</p>
            <p className="font-bold text-sm">Jozi Explorer</p>
            <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-jozi-gold w-[65%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
