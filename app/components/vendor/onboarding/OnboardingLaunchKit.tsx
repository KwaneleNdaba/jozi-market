import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Calculator, Camera, Sparkles, DollarSign, TrendingUp, Wand2, Info } from 'lucide-react';
import SectionHeader from '../../SectionHeader';
import { OnboardingPlan } from '../../../pages/vendor/VendorOnboardingGuidedPage';
// Added StatusBadge import to fix the "Cannot find name 'StatusBadge'" error
import StatusBadge from '../../StatusBadge';

interface OnboardingLaunchKitProps {
  plan: OnboardingPlan;
}

const OnboardingLaunchKit: React.FC<OnboardingLaunchKitProps> = ({ plan }) => {
  const [cost, setCost] = useState<number>(450);
  const [markup, setMarkup] = useState<number>(100);
  
  const commissionRate = plan === 'Pro' ? 0.03 : plan === 'Growth' ? 0.05 : 0.07;
  const targetPrice = cost * (1 + markup / 100);
  const platformFee = targetPrice * commissionRate;
  const netProfit = targetPrice - cost - platformFee;

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Artisan Launch Kit" 
        sub="Tools to optimize your product entry and maximize day-one yield." 
        icon={Package}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profit Estimator */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-soft border border-gray-100 flex flex-col">
          <div className="flex items-center space-x-3 mb-10">
             <div className="p-3 bg-jozi-gold/10 rounded-2xl text-jozi-gold"><Calculator className="w-6 h-6" /></div>
             <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Yield Estimator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-grow">
             <div className="space-y-10">
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-gray-400">Production Cost (R)</label>
                      <span className="font-black text-jozi-forest text-sm">R{cost}</span>
                   </div>
                   <input 
                    type="range" min="50" max="5000" step="10" 
                    value={cost} onChange={(e) => setCost(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-jozi-forest"
                   />
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-gray-400">Desired Markup (%)</label>
                      <span className="font-black text-jozi-forest text-sm">{markup}%</span>
                   </div>
                   <input 
                    type="range" min="0" max="500" step="5" 
                    value={markup} onChange={(e) => setMarkup(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-jozi-gold"
                   />
                </div>
             </div>

             <div className="bg-jozi-dark rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-jozi-gold uppercase tracking-[0.2em]">Listing Price</p>
                      <p className="text-4xl font-black tracking-tighter">R{targetPrice.toFixed(0)}</p>
                   </div>
                   <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-xs opacity-60">
                         <span>Hub Comm. ({(commissionRate * 100).toFixed(0)}%)</span>
                         <span className="text-rose-400">-R{platformFee.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-black text-emerald-400">
                         <span>Net Profit</span>
                         <span>R{netProfit.toFixed(0)}</span>
                      </div>
                   </div>
                </div>
                <div className="pt-6 relative z-10">
                   <div className="flex items-center space-x-2 text-[9px] font-black text-jozi-gold uppercase tracking-widest bg-white/5 p-2 rounded-lg">
                      <TrendingUp className="w-3 h-3" />
                      <span>Artisan Scarcity Uplift: High</span>
                   </div>
                </div>
                <DollarSign className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Content & Creative Side */}
        <div className="space-y-8 text-left">
           <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 space-y-6">
              <div className="flex items-center space-x-3 text-jozi-forest">
                 <Camera className="w-6 h-6" />
                 <h4 className="font-black text-lg uppercase tracking-tight leading-none">Exhibition Guide</h4>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Artisan pieces see <span className="text-jozi-forest font-black">400% higher conversion</span> with natural lighting and "craft-in-motion" vertical videos.</p>
              <div className="space-y-4">
                 <button className="w-full py-4 bg-jozi-cream text-jozi-forest rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-forest hover:text-white transition-all">Download Preset Pack</button>
                 <button className="w-full py-4 bg-jozi-cream text-jozi-forest rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-forest hover:text-white transition-all">Lighting Directory</button>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3 text-jozi-forest">
                    <Sparkles className="w-6 h-6 text-jozi-gold" />
                    <h4 className="font-black text-lg uppercase tracking-tight leading-none">AI Narratives</h4>
                 </div>
                 {/* StatusBadge used here, requiring import above */}
                 <StatusBadge status="Ready" />
              </div>
              <p className="text-xs text-gray-400 font-medium italic">"Experience the soul of Gauteng with our hand-stitched shweshwe designs. Built for durability, styled for legacy."</p>
              <button className="w-full py-4 bg-jozi-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-forest transition-all flex items-center justify-center shadow-xl">
                 <Wand2 className="w-4 h-4 mr-2" /> Generate Narrative
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLaunchKit;