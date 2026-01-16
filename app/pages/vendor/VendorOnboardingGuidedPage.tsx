import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'next/link';
import { 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  Package, 
  BrainCircuit, 
  Sparkles,
  Zap,
  Info,
  Truck,
  Building2,
  Lock,
  Camera,
  LineChart
} from 'lucide-react';
import OnboardingRegistration from '../../components/vendor/onboarding/OnboardingRegistration';
import OnboardingSuppliers from '../../components/vendor/onboarding/OnboardingSuppliers';
import OnboardingLaunchKit from '../../components/vendor/onboarding/OnboardingLaunchKit';
import OnboardingAIWizard from '../../components/vendor/onboarding/OnboardingAIWizard';

export type OnboardingPlan = 'Free' | 'Starter' | 'Growth' | 'Pro';

const VendorOnboardingGuidedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = (searchParams.get('plan') as OnboardingPlan) || 'Free';
  
  const [currentStep, setCurrentStep] = useState<'registration' | 'suppliers' | 'launch' | 'wizard'>('registration');
  const [progress, setProgress] = useState({
    registration: 0,
    suppliers: 0,
    launch: 0,
    wizard: 0
  });

  // Plan-aware capability mapping
  const capabilities = useMemo(() => ({
    registration: true, // Always visible
    suppliers: ['Starter', 'Growth', 'Pro'].includes(selectedPlan),
    launchKit: ['Starter', 'Growth', 'Pro'].includes(selectedPlan),
    aiWizard: ['Growth', 'Pro'].includes(selectedPlan),
    advancedSuppliers: ['Growth', 'Pro'].includes(selectedPlan)
  }), [selectedPlan]);

  const steps = [
    { id: 'registration', label: 'Compliance', icon: ShieldCheck, available: capabilities.registration },
    { id: 'suppliers', label: 'Supply Chain', icon: Users, available: capabilities.suppliers },
    { id: 'launch', label: 'Launch Prep', icon: Package, available: capabilities.launchKit },
    { id: 'wizard', label: 'Market Strategy', icon: BrainCircuit, available: capabilities.aiWizard },
  ].filter(s => s.available);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <div className="container mx-auto px-4 pt-12 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="text-left space-y-4">
             <Link href="/vendor/pricing" className="inline-flex items-center text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-jozi-forest transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Switch Plan
             </Link>
             <div className="space-y-1">
                <h1 className="text-4xl lg:text-5xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
                  Workshop <br /><span className="text-jozi-gold">Initialization.</span>
                </h1>
                <p className="text-gray-400 font-medium italic">Setting up your artisan presence on the <span className="text-jozi-forest font-black font-normal">{selectedPlan}</span> Tier.</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-jozi-forest/5 flex items-center space-x-6 min-w-[300px]">
             <div className="w-16 h-16 bg-jozi-gold/10 rounded-2xl flex items-center justify-center text-jozi-gold">
                <Zap className="w-8 h-8 fill-current" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest leading-none mb-1">Global Readiness</p>
                <p className="text-3xl font-black text-jozi-forest">42%</p>
                <div className="w-32 h-1.5 bg-gray-50 rounded-full mt-2 overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-jozi-gold" />
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Navigation Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-4">
             {steps.map((step) => (
               <button
                 key={step.id}
                 onClick={() => setCurrentStep(step.id as any)}
                 className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center space-x-5 text-left ${
                   currentStep === step.id 
                    ? 'bg-white border-jozi-forest shadow-xl scale-105 z-10' 
                    : 'bg-white/50 border-transparent text-gray-400 hover:bg-white hover:border-jozi-forest/10'
                 }`}
               >
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                   currentStep === step.id ? 'bg-jozi-forest text-white' : 'bg-gray-100 text-gray-400'
                 }`}>
                   <step.icon className="w-6 h-6" />
                 </div>
                 <div className="flex-grow">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Step</p>
                   <p className="font-black text-sm">{step.label}</p>
                 </div>
                 {progress[step.id as keyof typeof progress] === 100 && (
                   <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 )}
               </button>
             ))}

             <div className="p-8 bg-jozi-dark rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group shadow-2xl mt-8">
                <Lock className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                <h4 className="text-xl font-black relative z-10">Data Integrity</h4>
                <p className="text-xs text-jozi-cream/50 font-medium leading-relaxed relative z-10">All information is encrypted under POPIA guidelines. We only share delivery data with verified riders.</p>
             </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {currentStep === 'registration' && <OnboardingRegistration plan={selectedPlan} />}
                {currentStep === 'suppliers' && <OnboardingSuppliers plan={selectedPlan} advanced={capabilities.advancedSuppliers} />}
                {currentStep === 'launch' && <OnboardingLaunchKit plan={selectedPlan} />}
                {currentStep === 'wizard' && <OnboardingAIWizard plan={selectedPlan} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboardingGuidedPage;