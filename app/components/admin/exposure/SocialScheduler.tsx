import React from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram, Smartphone, Facebook, Youtube, 
  Settings, Clock, ChevronRight, Zap, Target,
  RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { DAILY_SLOT_CONFIG, EQUITY_METRICS } from '../../../utilities/adminSocialMockData';

const SocialScheduler: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Platform Capacity Controls */}
      <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
           <div className="space-y-1">
              <h3 className="text-2xl font-black text-jozi-dark uppercase tracking-tight">Capacity Logic</h3>
              <p className="text-gray-400 text-sm font-medium italic">Configure broadcast density per platform node.</p>
           </div>
           <button className="bg-jozi-cream text-jozi-forest px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all">
              Edit Daily Limits
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {DAILY_SLOT_CONFIG.map((config, i) => (
             <div key={i} className="p-8 rounded-[2.5rem] border-2 border-gray-50 bg-gray-50/30 group hover:border-jozi-forest/10 hover:bg-white transition-all flex flex-col justify-between h-[220px]">
                <div className="flex justify-between items-start">
                   <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                         {config.platform === 'Instagram' && <Instagram className="w-6 h-6 text-pink-500" />}
                         {config.platform === 'TikTok' && <Smartphone className="w-6 h-6 text-black" />}
                         {config.platform === 'YouTube' && <Youtube className="w-6 h-6 text-red-600" />}
                         {config.platform === 'Facebook' && <Facebook className="w-6 h-6 text-blue-600" />}
                      </div>
                      <h4 className="font-black text-jozi-forest text-lg uppercase tracking-tight">{config.platform}</h4>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-gray-300 uppercase">Used Today</p>
                      <p className="text-2xl font-black text-jozi-dark">{config.used} / {config.max}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(config.used / config.max) * 100}%` }}
                        className="h-full bg-jozi-forest"
                      />
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                      <div className="flex items-center">
                         <Clock className="w-3 h-3 mr-1.5" />
                         Next Opening: 19:30
                      </div>
                      <span className={config.used >= config.max ? 'text-rose-500' : 'text-emerald-500'}>
                         {config.used >= config.max ? 'Capped' : 'Capacity Available'}
                      </span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="mt-12 p-8 bg-jozi-forest rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-4 max-w-xl">
              <div className="inline-flex items-center bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase text-jozi-gold tracking-widest">
                 System Suggestion
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Auto-Scheduling Engine</h3>
              <p className="text-sm text-jozi-cream/60 font-medium leading-relaxed">Let the Oracle auto-populate available slots with the highest-scoring pending content (85+ AI Score).</p>
           </div>
           <button className="relative z-10 bg-white text-jozi-dark px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">
              Initialize Auto-Run
           </button>
           <Zap className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5" />
        </div>
      </div>

      {/* Exposure Equity Panel */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-10 relative overflow-hidden shadow-2xl group">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-white/10 rounded-2xl text-jozi-gold shadow-sm"><Target className="w-6 h-6" /></div>
                 <h3 className="text-xl font-black uppercase tracking-tight">Equity Pulse</h3>
              </div>
              
              <div className="space-y-8">
                 {EQUITY_METRICS.map((m, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{m.label}</span>
                         <span className="text-xs font-black text-white">{m.share}% Actual</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${m.share}%` }}
                          className="h-full bg-jozi-gold" 
                         />
                         {/* Marker for plan guarantee */}
                         <div 
                          className="absolute top-0 bottom-0 w-[2px] bg-white opacity-40"
                          style={{ left: `${m.guarantee}%` }}
                          title={`Plan Guarantee: ${m.guarantee}%`}
                         />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-jozi-gold">Rotation State</p>
                    <p className="font-black text-emerald-400 flex items-center text-xs">
                       <CheckCircle2 className="w-3 h-3 mr-1.5" /> Fair (Optimal)
                    </p>
                 </div>
                 <button className="text-[9px] font-black uppercase tracking-widest border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Audit Ethics</button>
              </div>
           </div>
           <RefreshCw className="absolute -bottom-10 -left-10 w-64 h-64 opacity-5 group-hover:rotate-180 transition-transform duration-[20s] pointer-events-none" />
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 text-left flex flex-col justify-between min-h-[350px]">
           <div className="space-y-6">
              <div className="flex items-center space-x-3 text-jozi-forest">
                 <AlertCircle className="w-6 h-6 text-jozi-gold" />
                 <h4 className="font-black text-sm uppercase tracking-widest leading-none">Spam Detection</h4>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                "We flagged 3 submissions from 'Joburg Gems' this morning. All feature the same creative asset but different captions. Intent: Bot-simulated volume."
              </p>
           </div>
           <div className="space-y-4">
              <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/10">
                 Purge Spam Submissions
              </button>
              <button className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-jozi-forest transition-all">
                 Configure Sensitivity
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SocialScheduler;