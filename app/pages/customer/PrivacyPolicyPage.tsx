import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  Smartphone, 
  UserCheck, 
  Server,
  Fingerprint,
  Mail,
  // Add CheckCircle2 to fix the 'Cannot find name' error
  CheckCircle2
} from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      title: "Data Archeology",
      icon: Database,
      content: "We collect identifiers (name, address, contact) to facilitate local commerce. For our artisans, we collect FICA-compliant documentation to verify workshop authenticity and process secure payouts."
    },
    {
      title: "POPIA Protection",
      icon: ShieldCheck,
      content: "Your data is handled under the strict governance of the Protection of Personal Information Act (POPIA). We act as a responsible party, ensuring that your details are only used for specified marketplace intentions."
    },
    {
      title: "The Seeker's Rights",
      icon: UserCheck,
      content: "As a neighbor on Jozi Market, you have the right to access, rectify, or demand the deletion of your personal artifacts. Our Data Stewards are available 24/7 to process your privacy requests."
    },
    {
      title: "Platform Encryption",
      icon: Lock,
      content: "We utilize 256-bit SSL encryption for all data transmissions. Payment data is never stored locally at the Hub; all financial logic is offloaded to our PCI-DSS compliant partners."
    }
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      <section className="bg-jozi-forest py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-jozi-gold text-[10px] font-black uppercase tracking-widest">
              POPIA Compliant • 2024
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">Privacy <br /><span className="text-jozi-gold italic">Protocol.</span></h1>
            <p className="text-jozi-cream/70 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              In Joburg, trust is our most valuable currency. We protect your digital footprint with the same care our artisans give to their craft.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[4rem] p-10 lg:p-20 shadow-soft border border-jozi-forest/5 space-y-20 text-left">
            
            {/* Core Values */}
            <div className="grid md:grid-cols-2 gap-12">
              {sections.map((section, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <div className="w-16 h-16 bg-jozi-cream rounded-[1.8rem] flex items-center justify-center text-jozi-forest shrink-0 group-hover:bg-jozi-forest group-hover:text-white transition-all shadow-sm">
                    <section.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight leading-none">{section.title}</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed italic opacity-80">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Sharing Table (Visual Representation) */}
            <div className="space-y-8 pt-10 border-t border-gray-100">
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-jozi-forest uppercase tracking-tighter">Information Flow</h3>
                  <p className="text-gray-400 font-medium">To deliver a seamless market experience, we share specific artifacts with trusted participants:</p>
               </div>
               <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { target: 'Artisans', data: 'Delivery Zone, Customer Name', reason: 'Preparation of hand-crafted items.' },
                    { target: 'Riders', data: 'Mobile Number, Street Address', reason: 'Safe arrival & door-to-door delivery.' },
                    { target: 'Payment Hub', data: 'Email, Billing Logic', reason: 'Secure transaction verification.' }
                  ].map((flow, i) => (
                    <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-4">
                       <h5 className="font-black text-jozi-gold text-xs uppercase tracking-widest">{flow.target}</h5>
                       <p className="text-sm font-black text-jozi-forest leading-none">{flow.data}</p>
                       <p className="text-xs text-gray-400 font-medium italic">"{flow.reason}"</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Retention & Deletion */}
            <div className="bg-jozi-dark rounded-[3.5rem] p-10 lg:p-16 text-white relative overflow-hidden group shadow-2xl">
               <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <h3 className="text-3xl font-black uppercase tracking-tight">Retention Ethics</h3>
                     <p className="text-jozi-cream/60 font-medium leading-relaxed italic">
                       "We only retain active transaction data for 5 years to comply with SARS auditing requirements. Inactive neighbor profiles are scrubbed from our primary nodes after 24 months of dormancy."
                     </p>
                     <div className="flex gap-4">
                        <button className="bg-jozi-gold text-jozi-dark px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl">Request Full Audit</button>
                        <button className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">Privacy Dashboard</button>
                     </div>
                  </div>
                  <div className="hidden lg:block relative">
                     <Fingerprint className="w-48 h-48 text-jozi-gold opacity-10 mx-auto group-hover:scale-110 transition-transform duration-[10s]" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-jozi-gold/20 rounded-full blur-2xl animate-pulse" />
                     </div>
                  </div>
               </div>
               <Server className="absolute -bottom-10 -left-10 w-64 h-64 opacity-5 text-white group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-100">
               <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center"><Smartphone className="w-5 h-5 mr-2" /> <span>Cookie Consent Active</span></div>
                  <div className="w-[1px] h-4 bg-gray-200 hidden md:block" />
                  <div className="flex items-center"><Mail className="w-5 h-5 mr-2" /> <span>POPIA Officer: dpo@jozimarket.za</span></div>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl">
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Last Audit: Oct 2024</span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;