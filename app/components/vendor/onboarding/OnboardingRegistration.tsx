import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertCircle, FileText, Landmark, Globe } from 'lucide-react';
import SectionHeader from '../../SectionHeader';
import { OnboardingPlan } from '../../../pages/vendor/VendorOnboardingGuidedPage';

interface OnboardingRegistrationProps {
  plan: OnboardingPlan;
}

const OnboardingRegistration: React.FC<OnboardingRegistrationProps> = ({ plan }) => {
  const steps = [
    { title: 'CIPC Registration', desc: 'Ensure your business is registered with the CIPC (Optional for Individuals).', icon: FileText },
    { title: 'SARS Tax Clearance', desc: 'Maintain valid tax status to qualify for local export incentives.', icon: Globe },
    { title: 'Bank Account Verification', desc: 'A verified SA business account is required for payouts.', icon: Landmark },
    { title: 'Physical Hub Visit', desc: 'Book your 10-minute workshop inspection at Maboneng Hub.', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title="Compliance Framework" 
        sub="The essential foundation for your digital workshop presence." 
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           {steps.map((step, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100 flex items-start space-x-6 group hover:border-jozi-forest/20 transition-all">
                <div className="w-14 h-14 bg-jozi-cream rounded-2xl flex items-center justify-center text-jozi-forest group-hover:bg-jozi-forest group-hover:text-white transition-colors shrink-0">
                   <step.icon className="w-6 h-6" />
                </div>
                <div className="flex-grow space-y-1">
                   <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black text-jozi-forest">{step.title}</h4>
                      <input type="checkbox" className="w-6 h-6 accent-jozi-forest rounded-lg" />
                   </div>
                   <p className="text-sm text-gray-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
             </div>
           ))}

           <div className="p-8 bg-amber-50 rounded-[3rem] border border-amber-100 flex items-start space-x-5">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div className="space-y-2">
                 <p className="text-sm font-black text-amber-900 uppercase">Guidance Disclosure</p>
                 <p className="text-xs text-amber-800 font-medium leading-relaxed opacity-80 italic">
                   "This checklist is provided for general guidance only and does not constitute legal or tax advice. Please consult with a certified professional for specific South African compliance requirements."
                 </p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-gray-100 space-y-8">
              <h3 className="text-lg font-black text-jozi-dark uppercase tracking-tight">Compliance Tips</h3>
              <div className="space-y-6">
                {[
                  { t: 'VAT Threshold', d: 'Registration is mandatory if turnover exceeds R1M/year.' },
                  { t: 'POPIA Rule', d: 'Do not store customer data on personal devices.' },
                  { t: 'Hub Inspect', d: 'Inspections focus on quality and fair labor practices.' }
                ].map((tip, i) => (
                  <div key={i} className="flex items-start space-x-4">
                     <div className="w-2 h-2 rounded-full bg-jozi-gold mt-1.5 shrink-0" />
                     <div>
                        <p className="text-xs font-black text-jozi-forest uppercase">{tip.t}</p>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">{tip.d}</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden group shadow-2xl">
              <h4 className="text-xl font-black relative z-10">Need a Consultant?</h4>
              <p className="text-xs text-jozi-cream/60 leading-relaxed font-medium relative z-10">Artisans on {plan} plans get access to our network of vetted local accountants and legal experts.</p>
              <button className="relative z-10 bg-white text-jozi-dark px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">
                Open Expert Directory
              </button>
              <Landmark className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingRegistration;