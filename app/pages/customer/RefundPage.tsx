import React from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  HelpCircle,
  Scale,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const RefundPage: React.FC = () => {
  const sections = [
    {
      title: "Marketplace Facilitation",
      icon: Scale,
      content: "Jozi Market operates as a multi-vendor marketplace. While we provide the platform and logistics hub, the primary contract of sale exists between the Customer and the individual Artisan. We facilitate returns and quality audits at our Joburg Hub to protect both parties."
    },
    {
      title: "CPA Return Eligibility",
      icon: CheckCircle2,
      content: "In accordance with the South African Consumer Protection Act (CPA), you are entitled to return items within 30 days if they are defective, not as described, or unfit for their intended purpose. Items must be returned in their original workshop condition with all tags and packaging intact."
    },
    {
      title: "Non-Returnable Items",
      icon: AlertCircle,
      content: "Certain artifacts are excluded from standard returns for hygiene or customization reasons. This includes: Bespoke commissions (custom sizes/engravings), intimate jewelry (earrings), and perishable gourmet goods once opened."
    }
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      {/* Cinematic Header */}
      <section className="bg-jozi-forest py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center bg-jozi-gold/20 text-jozi-gold px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-jozi-gold/30">
              Consumer Protection Logic
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">RETURNS <br /><span className="text-jozi-gold italic">& REFUNDS.</span></h1>
            <p className="text-jozi-cream/70 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Supporting local means we protect your purchase. Our Hub-verified returns process ensures artisan quality and neighbor satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-24">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Core Policies Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[3rem] shadow-soft border border-jozi-forest/5 text-left flex flex-col"
              >
                <div className="w-12 h-12 bg-jozi-cream rounded-2xl flex items-center justify-center text-jozi-forest mb-6">
                  <section.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-jozi-forest uppercase tracking-tight mb-4">{section.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic opacity-80">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Process Card */}
          <div className="bg-white rounded-[4rem] p-10 lg:p-20 border border-jozi-forest/5 shadow-soft space-y-16 text-left">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-jozi-forest uppercase tracking-tighter">The Return Sequence</h2>
              <p className="text-gray-400 font-medium max-w-2xl">Follow these steps to initiate a verification and refund cycle through our central Joburg Hub.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
               <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-100 hidden lg:block -translate-y-12" />
               {[
                 { step: '01', title: 'Log Request', desc: 'Initiate the return via your Profile Dashboard within 30 days.' },
                 { step: '02', title: 'Hub Pickup', desc: 'Our courier partners will collect the item from your doorstep.' },
                 { step: '03', title: 'Quality Audit', desc: 'Artifact is inspected at our Maboneng Hub for original condition.' },
                 { step: '04', title: 'Refund Issue', desc: 'Funds are reversed to your original payment method in 3-5 days.' }
               ].map((item, i) => (
                 <div key={i} className="relative z-10 space-y-4">
                    <div className="w-10 h-10 bg-jozi-forest text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                      {item.step}
                    </div>
                    <h4 className="font-black text-jozi-forest uppercase text-sm tracking-widest">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Escalation Card */}
          <div className="bg-jozi-dark rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 text-jozi-gold">
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dispute Mediation</span>
                </div>
                <h2 className="text-4xl font-black leading-tight tracking-tighter">Stewardship <br />& Support.</h2>
                <p className="text-jozi-cream/60 font-medium text-lg">
                  If an artisan disputes a return or you are unsatisfied with the quality audit, our Platform Stewards will step in to mediate fairly under CPA guidelines.
                </p>
                <div className="flex items-center space-x-6 pt-4">
                  <Link href="/contact" className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl">Contact Stewards</Link>
                  <button className="text-white font-bold text-xs uppercase tracking-widest underline underline-offset-8">Policy FAQ</button>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-8">
                <h4 className="font-black text-xl text-jozi-gold uppercase tracking-tight">Cycle Timelines</h4>
                <div className="space-y-6">
                  {[
                    { label: 'Return Approval', val: '24 Business Hours' },
                    { label: 'Courier Collection', val: '48 Business Hours' },
                    { label: 'Refund Processing', val: '3 - 5 Working Days' }
                  ].map((step, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span className="opacity-60 font-medium">{step.label}</span>
                      <span className="font-black text-white">{step.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <RotateCcw className="absolute -bottom-10 -right-10 w-64 h-64 opacity-5 text-jozi-gold group-hover:rotate-45 transition-transform duration-[20s] pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPage;