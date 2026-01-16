import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Wand2, ChevronRight, CheckCircle2, Zap, ArrowRight, Target, Globe, LineChart, MessageSquare } from 'lucide-react';
import SectionHeader from '../../SectionHeader';
import { OnboardingPlan } from '../../../pages/vendor/VendorOnboardingGuidedPage';

interface OnboardingAIWizardProps {
  plan: OnboardingPlan;
}

const OnboardingAIWizard: React.FC<OnboardingAIWizardProps> = ({ plan }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2500);
  };

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Market Strategy AI" 
        sub="Algorithmic intelligence defining your workshop's path to scale." 
        icon={BrainCircuit}
      />

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key="wizard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-soft border border-gray-100 text-center space-y-12"
            >
              <div className="space-y-4">
                 <div className="w-24 h-24 bg-jozi-gold/10 rounded-[2.5rem] flex items-center justify-center text-jozi-gold mx-auto shadow-inner">
                    <BrainCircuit className="w-12 h-12" />
                 </div>
                 <h3 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase">Initialize Strategy.</h3>
                 <p className="text-gray-400 font-medium max-w-md mx-auto italic">Answer 3 questions to generate your workshop's first 90-day commercial blueprint.</p>
              </div>

              <div className="space-y-10">
                 {step === 1 && (
                   <div className="space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">1. Primary Vertical</p>
                      <div className="flex flex-wrap justify-center gap-3">
                         {['Textiles', 'Leather', 'Fine Art', 'Skincare', 'Gourmet'].map(v => (
                           <button key={v} onClick={() => setStep(2)} className="px-8 py-4 rounded-2xl bg-gray-50 text-jozi-forest font-black border-2 border-transparent hover:border-jozi-gold transition-all">{v}</button>
                         ))}
                      </div>
                   </div>
                 )}
                 {step === 2 && (
                   <div className="space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">2. Production Capacity</p>
                      <div className="flex flex-wrap justify-center gap-3">
                         {['Bespoke (1/wk)', 'Small Batch (10/wk)', 'Workshop (50+/wk)'].map(v => (
                           <button key={v} onClick={() => setStep(3)} className="px-8 py-4 rounded-2xl bg-gray-50 text-jozi-forest font-black border-2 border-transparent hover:border-jozi-gold transition-all">{v}</button>
                         ))}
                      </div>
                   </div>
                 )}
                 {step === 3 && (
                   <div className="space-y-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">3. Commercial Goal</p>
                      <div className="flex flex-wrap justify-center gap-3 mb-10">
                         {['Max Margin', 'Max Volume', 'Brand Authority'].map(v => (
                           <button key={v} className="px-8 py-4 rounded-2xl bg-jozi-forest text-white font-black hover:bg-jozi-dark transition-all">{v}</button>
                         ))}
                      </div>
                      <button 
                        onClick={startAnalysis}
                        disabled={isAnalyzing}
                        className="bg-jozi-gold text-jozi-dark px-12 py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-jozi-gold/20 hover:scale-105 transition-all flex items-center mx-auto"
                      >
                         {isAnalyzing ? (
                           <span className="flex items-center">
                             <RefreshCwIcon className="w-6 h-6 mr-3 animate-spin" /> Synthesizing...
                           </span>
                         ) : (
                           <span className="flex items-center">
                             <Wand2 className="w-6 h-6 mr-3" /> Generate Strategy
                           </span>
                         )}
                      </button>
                   </div>
                 )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="bg-jozi-dark p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-8">
                       <div className="space-y-1">
                          <p className="text-jozi-gold font-black uppercase tracking-widest text-[10px]">AI Strategic Report</p>
                          <h4 className="text-4xl font-black tracking-tighter uppercase">The Niche Pioneer.</h4>
                       </div>
                       <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                       <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                          <div className="p-3 bg-white/10 rounded-xl text-jozi-gold w-fit"><Target className="w-6 h-6" /></div>
                          <h5 className="font-black text-sm uppercase">Niche Target</h5>
                          <p className="text-xs text-jozi-cream/60 leading-relaxed font-medium">Urban Professionals (Sandton/Rosebank) seeking "Heritage Luxe" textiles.</p>
                       </div>
                       <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                          <div className="p-3 bg-white/10 rounded-xl text-jozi-gold w-fit"><Globe className="w-6 h-6" /></div>
                          <h5 className="font-black text-sm uppercase">Supply Edge</h5>
                          <p className="text-xs text-jozi-cream/60 leading-relaxed font-medium">Leverage direct CIPC-verified "Gauteng Leather Co." for 15% margin boost.</p>
                       </div>
                       <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                          <div className="p-3 bg-white/10 rounded-xl text-jozi-gold w-fit"><LineChart className="w-6 h-6" /></div>
                          <h5 className="font-black text-sm uppercase">90-Day Yield</h5>
                          <p className="text-xs text-jozi-cream/60 leading-relaxed font-medium">Predicted R140,000 GMV with current batch production capacity.</p>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                       <p className="text-sm font-medium text-jozi-cream/40 italic">Strategy locked for {plan} members. Updates available weekly.</p>
                       <div className="flex gap-4">
                          <button className="bg-white text-jozi-dark px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">Download PDF</button>
                          <button className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-white/20 transition-all">
                             <MessageSquare className="w-4 h-4 mr-2" /> Talk to Advisor
                          </button>
                       </div>
                    </div>
                 </div>
                 <BrainCircuit className="absolute -bottom-10 -right-10 w-96 h-96 opacity-10 pointer-events-none" />
              </div>

              <div className="p-12 bg-white rounded-[4rem] border border-jozi-forest/5 shadow-soft flex flex-col md:flex-row items-center justify-between gap-12 text-left group transition-all hover:border-jozi-gold/20">
                 <div className="flex items-start space-x-6 max-w-xl">
                    <div className="w-16 h-16 bg-jozi-gold/10 rounded-3xl flex items-center justify-center text-jozi-gold shrink-0">
                       <Zap className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-black text-jozi-forest uppercase tracking-tight leading-none">Automate Implementation</h4>
                       <p className="text-sm text-gray-500 font-medium leading-relaxed">Let our AI initialize your initial product descriptions, SEO tags, and shipping logic based on this strategy.</p>
                    </div>
                 </div>
                 <button className="px-10 py-5 bg-jozi-forest text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center">
                    Activate Strategy <ArrowRight className="ml-2 w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
  </svg>
);

export default OnboardingAIWizard;