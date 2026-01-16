import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gavel, 
  ShieldCheck, 
  Scale, 
  Globe, 
  Store, 
  Users, 
  CreditCard, 
  FileText, 
  Lock, 
  AlertCircle,
  ChevronRight,
  Handshake,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'introduction', label: '1. Introduction', icon: Globe },
  { id: 'eligibility', label: '2. Eligibility', icon: Users },
  { id: 'user-conduct', label: '3. User Conduct', icon: Gavel },
  { id: 'vendor-obligations', label: '4. Vendor Obligations', icon: Store },
  { id: 'payments', label: '5. Orders & Payments', icon: CreditCard },
  { id: 'content-ip', label: '6. Content & IP', icon: FileText },
  { id: 'liability', label: '7. Liability & Indemnity', icon: Scale },
  { id: 'privacy', label: '8. Privacy & Data', icon: Lock },
  { id: 'termination', label: '9. Termination', icon: AlertCircle },
  { id: 'governing-law', label: '10. Governing Law', icon: ShieldCheck },
];

const LegalSection: React.FC<{ id: string; title: string; icon: any; children: React.ReactNode }> = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="pt-24 first:pt-0 scroll-mt-24 text-left">
    <div className="flex items-center space-x-4 mb-8">
      <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{title}</h2>
    </div>
    <div className="space-y-6 text-gray-500 font-medium leading-relaxed italic border-l-2 border-jozi-gold/20 pl-8">
      {children}
    </div>
  </section>
);

const TermsOfServicePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('introduction');

  const scrollTo = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      {/* Header */}
      <section className="bg-jozi-dark py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center bg-white/10 border border-white/20 px-5 py-2 rounded-full text-jozi-gold text-[10px] font-black uppercase tracking-[0.3em]">
              Governance Framework
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Terms of <br /><span className="text-jozi-gold italic">Service.</span>
            </h1>
            <p className="text-jozi-cream/60 text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
              Last Updated: October 2024. These terms govern the relationship between Jozi Market, our artisans, and our neighbors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-20">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Sticky Navigation sidebar */}
          <aside className="lg:w-80 shrink-0 sticky top-24 hidden lg:block text-left">
            <div className="bg-white rounded-[3rem] p-8 border border-jozi-forest/5 shadow-soft space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Table of Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all ${
                      activeTab === s.id 
                        ? 'bg-jozi-forest text-white shadow-lg' 
                        : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
                    }`}
                  >
                    <span>{s.label}</span>
                    {activeTab === s.id && <ChevronRight className="w-3 h-3" />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Content Area */}
          <main className="flex-grow max-w-4xl space-y-10">
            
            <LegalSection id="introduction" title="Agreement to Terms" icon={Globe}>
              <p>
                Welcome to Jozi Market. By accessing or using our digital marketplace, you agree to be bound by these Terms of Service. Jozi Market acts as an intermediary platform connecting independent Artisans ("Vendors") with Neighbors ("Customers").
              </p>
              <p>
                Please read these terms carefully. If you do not agree with any part of these terms, you must immediately cease use of our services.
              </p>
            </LegalSection>

            <LegalSection id="eligibility" title="Eligibility" icon={Users}>
              <p>
                You must be at least 18 years of age and possess the legal capacity to enter into binding contracts under South African law to use this platform.
              </p>
              <p>
                <span className="text-jozi-forest font-black uppercase tracking-widest text-[10px] block mb-2">For Vendors:</span>
                Artisans must undergo our verification process, which includes FICA compliance, bank account verification, and a quality audit of physical artifacts.
              </p>
            </LegalSection>

            <LegalSection id="user-conduct" title="User Responsibilities" icon={Gavel}>
              <p>
                Neighbors are responsible for providing accurate registration information. Prohibited activities include, but are not limited to: 
              </p>
              <ul className="list-disc pl-5 space-y-3">
                <li>Manipulating the market price of items through fraudulent reviews.</li>
                <li>Attempting to bypass Jozi Market's Hub logistics to avoid platform fees.</li>
                <li>Engaging in any conduct that violates South African cyber-security laws.</li>
              </ul>
            </LegalSection>

            <LegalSection id="vendor-obligations" title="Vendor Obligations" icon={Store}>
              <p>
                Vendors represent that all products listed are authentic, accurately described, and produced in accordance with local labor laws. 
              </p>
              <p>
                Vendors are exclusively responsible for the preparation and packaging of treasures. Failure to dispatch items to the Jozi Hub within the agreed timeline may result in account penalties or termination of the artisan's slot.
              </p>
            </LegalSection>

            <LegalSection id="payments" title="Orders & Payments" icon={CreditCard}>
              <p>
                Transactions are processed via our PCI-DSS compliant partners (PayFast). Funds are held in an escrow-style protocol until the treasure has been verified at our Hub and successfully dispatched.
              </p>
              <p>
                Jozi Market retains a platform commission (determined by your tier) and a Hub Logistics fee from each successful sale. All prices displayed to Neighbors are inclusive of VAT where applicable.
              </p>
            </LegalSection>

            <LegalSection id="content-ip" title="Content & IP" icon={FileText}>
              <p>
                Artisans retain full intellectual property rights to their designs. However, by listing on the platform, you grant Jozi Market a perpetual license to use product imagery and vertical videos for platform-wide promotion and social exposure.
              </p>
              <p>
                Neighbors retain ownership of their reviews but grant the platform a right to use such feedback for marketing and AI-driven quality scores.
              </p>
            </LegalSection>

            <LegalSection id="liability" title="Liability" icon={Scale}>
              <p>
                Jozi Market is an intermediary. We are not liable for the underlying contract of sale between the Vendor and the Neighbor, nor for any indirect or consequential loss arising from defective artifacts.
              </p>
              <p>
                Our total liability is limited to the commission earned on the specific transaction in dispute.
              </p>
            </LegalSection>

            <LegalSection id="privacy" title="Privacy & Data" icon={Lock}>
              <p>
                Your personal data is handled under our <Link href="/privacy" className="text-jozi-gold font-bold underline">Privacy Protocol</Link> in accordance with the Protection of Personal Information Act (POPIA). 
              </p>
            </LegalSection>

            <LegalSection id="termination" title="Termination" icon={AlertCircle}>
              <p>
                We reserve the right to suspend or terminate accounts that breach these terms, fail quality audits, or engage in deceptive market behavior. 
              </p>
              <p>
                Upon termination, any pending capital in the ledger will be settled only after a 30-day "Dispute Window" to ensure all neighbor returns are cleared.
              </p>
            </LegalSection>

            <LegalSection id="governing-law" title="Governing Law" icon={ShieldCheck}>
               <div className="bg-jozi-dark p-10 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl mt-12">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-black tracking-tight uppercase leading-none">South African Jurisdiction</h3>
                    <p className="text-sm text-jozi-cream/60 leading-relaxed italic">
                      "These terms are governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes shall be subject to the exclusive jurisdiction of the High Court of South Africa."
                    </p>
                    <div className="flex items-center space-x-6 pt-4 text-[10px] font-black uppercase tracking-widest text-jozi-gold">
                      <div className="flex items-center"><Handshake className="w-4 h-4 mr-2" /> CPA Compliant</div>
                      <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Hub Verified</div>
                    </div>
                  </div>
                  <Gavel className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-white group-hover:rotate-12 transition-transform duration-1000" />
               </div>
            </LegalSection>

          </main>
        </div>
      </section>

      {/* Quick Action Footer */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-soft border border-jozi-forest/5 flex flex-col md:flex-row items-center justify-between gap-12 text-left">
           <div className="max-w-xl space-y-4">
              <h3 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">Need Clarity?</h3>
              <p className="text-gray-400 font-medium leading-relaxed italic text-lg">If you have specific questions about our governance framework or artisan agreements, our Platform Stewards are here to help.</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl">Contact Stewards</Link>
              <Link href="/faq" className="bg-jozi-cream text-jozi-forest border border-jozi-forest/10 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all">Common Questions</Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;