
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Sparkles, Zap, ArrowUpRight, Info, ChevronRight, Gem, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useFeaturePlan } from '../../contexts/FeaturePlanContext';

const VendorFeatureAccess: React.FC = () => {
  const { plans, features, matrix, vendorTier } = useFeaturePlan();
  const currentPlan = plans.find(p => p.id === vendorTier);
  const enabledFeatures = matrix[vendorTier] || [];

  return (
    <div className="min-h-screen bg-jozi-cream/30 pb-32">
      <section className="bg-jozi-forest pt-12 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jozi-dark via-transparent to-jozi-gold/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center bg-white/10 border border-white/20 px-5 py-2 rounded-full text-jozi-gold">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Power Your Workshop</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">
                Benefit <br /><span className="text-jozi-gold">Dashboard.</span>
              </h1>
              <p className="text-jozi-cream/70 text-lg font-medium max-w-xl">
                You are currently scaling on the <span className="text-white font-black">{currentPlan?.name}</span> plan. Unlock more growth tools below.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-jozi-forest text-center space-y-6 min-w-[320px] relative">
              <div className="w-20 h-20 bg-jozi-gold/10 rounded-[2rem] flex items-center justify-center text-jozi-gold mx-auto">
                <Gem className="w-10 h-10" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Standing</p>
                <h3 className="text-4xl font-black mt-1">{currentPlan?.name}</h3>
              </div>
              <Link href="/vendor/pricing" className="w-full py-4 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all flex items-center justify-center shadow-xl">
                Explore Tiers <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const isUnlocked = enabledFeatures.includes(feat.id);
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white rounded-[3rem] p-10 border transition-all flex flex-col h-full relative group ${
                  isUnlocked ? 'border-jozi-forest/10 shadow-soft' : 'border-gray-100 opacity-80'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-8 right-8 bg-jozi-gold/10 text-jozi-gold p-3 rounded-2xl group-hover:scale-110 transition-transform">
                    <Lock className="w-5 h-5" />
                  </div>
                )}
                {isUnlocked && (
                  <div className="absolute top-8 right-8 text-emerald-500 p-3 bg-emerald-50 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}

                <div className="flex-grow space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-jozi-gold">{feat.category}</p>
                  <h4 className="text-2xl font-black text-jozi-forest leading-tight pr-12">{feat.name}</h4>
                  <div className="relative group/tip inline-block">
                    <p className="text-gray-400 font-medium text-sm leading-relaxed">{feat.description}</p>
                    {/* Simplified Tooltip */}
                    {!isUnlocked && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-jozi-dark text-white text-[10px] rounded-xl opacity-0 group-hover/tip:opacity-100 transition-opacity z-50 pointer-events-none font-bold uppercase tracking-widest leading-relaxed">
                        This tool increases Artisan visibility by up to 40%. Upgrade to unlock.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                  {isUnlocked ? (
                    <div className="flex items-center text-jozi-forest font-black text-[10px] uppercase tracking-widest">
                      <Zap className="w-4 h-4 mr-2 fill-current text-jozi-gold" /> Tool Active
                    </div>
                  ) : (
                    <Link href="/vendor/pricing" className="text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center">
                      Unlock Module <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 p-12 bg-white rounded-[4rem] border border-jozi-forest/5 shadow-soft flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex items-start space-x-6 max-w-xl">
             <div className="w-16 h-16 bg-jozi-gold/10 rounded-3xl flex items-center justify-center text-jozi-gold shrink-0">
               <AlertCircle className="w-8 h-8" />
             </div>
             <div className="space-y-2">
               <h4 className="text-xl font-black text-jozi-forest">Benefit Verification</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">Capabilities are linked to your global subscription status. If you upgrade today, new tools will appear in your sidebar within 5 minutes after payment verification.</p>
             </div>
           </div>
           <button className="px-10 py-5 bg-jozi-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-jozi-forest transition-all">
             Contact Account Manager
           </button>
        </div>
      </section>
    </div>
  );
};

export default VendorFeatureAccess;
