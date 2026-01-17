import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  Star, 
  ChevronRight,
  Package,
  Layout,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

const VendorPricingPage: React.FC = () => {
  const plans = [
    {
      id: 'Free',
      name: "Free Trial",
      subtitle: "First 6 Months",
      price: "0",
      commission: "0% First 30 Days",
      commissionNote: "5% from Month 2-6",
      description: "Perfect for new artisans testing the digital waters with zero risk.",
      features: [
        "Unlimited product listings",
        "Vendor dashboard & analytics",
        "Order management tools",
        "Customer chat integration",
        "Basic community support",
        "No subscription fees"
      ],
      recommended: false,
      dark: false
    },
    {
      id: 'Starter',
      name: "Starter",
      subtitle: "Essential Growth",
      price: "299",
      commission: "7% Commission",
      commissionNote: "Per successful order",
      description: "Ideal for established local shops ready for consistent sales.",
      features: [
        "Unlimited products",
        "Detailed sales & revenue reports",
        "Basic promotions (vouchers)",
        "Customer review management",
        "Standard support (24h)",
        "Custom discount engine"
      ],
      recommended: false,
      dark: false
    },
    {
      id: 'Growth',
      name: "Growth",
      subtitle: "Market Leader",
      price: "699",
      commission: "5% Commission",
      commissionNote: "Per successful order",
      description: "Advanced tools for high-volume vendors scaling their brand.",
      features: [
        "Everything in Starter",
        "AI product recommendations",
        "Featured store placement",
        "Referral campaign access",
        "Video product uploads",
        "Priority support (4h)"
      ],
      recommended: true,
      dark: false
    },
    {
      id: 'Pro',
      name: "Pro / Brand",
      subtitle: "The Masterpiece",
      price: "1,499",
      commission: "3% Commission",
      commissionNote: "Our lowest rate",
      description: "For established brands requiring custom presence and VIP service.",
      features: [
        "Everything in Growth",
        "Homepage feature slots",
        "Sponsored video ads",
        "Custom store branding",
        "Early payout cycles",
        "Dedicated account manager"
      ],
      recommended: false,
      dark: true
    }
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      {/* Hero Header */}
      <section className="bg-jozi-forest py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center bg-white/10 border border-white/20 px-5 py-2 rounded-full text-jozi-gold"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified Artisan Marketplace</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
            Start Your <br />
            <span className="text-jozi-gold italic">Journey.</span>
          </h1>
          <p className="text-jozi-cream/70 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Jozi Market is a curated community. Apply now to showcase your craft. Subscription plans are selected after your shop is approved.
          </p>

          {/* Primary Apply CTA */}
          <div className="pt-8">
            <Link 
              href="/vendor/apply" 
              className="inline-flex items-center bg-jozi-gold text-jozi-forest px-12 py-6 rounded-3xl font-black text-2xl uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-white hover:scale-105 transition-all group"
            >
              <UserPlus className="w-8 h-8 mr-3" />
              Apply to Sell
              <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-6">
              Review process typically takes 24-48 business hours
            </p>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-5xl p-10 shadow-xl border border-jozi-forest/5 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { step: '01', title: 'Submit Application', desc: 'Provide your business details and verification docs for our team to review.', icon: ClipboardCheck },
            { step: '02', title: 'Quality Audit', desc: 'We verify your artisan status and product quality to maintain hub standards.', icon: ShieldCheck },
            { step: '03', title: 'Choose Your Tier', desc: 'Once approved, select the growth plan that fits your commercial needs.', icon: Layout }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-jozi-gold font-black text-[10px] uppercase tracking-widest mb-1">Step {item.step}</p>
                <h4 className="font-black text-lg text-jozi-forest uppercase">{item.title}</h4>
                <p className="text-xs text-gray-400 font-medium leading-relaxed mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Informational Pricing Grid */}
      <section className="container mx-auto px-4 mt-32">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase">Preview Subscription Tiers</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto italic">Explore the features available to you once your application is successful.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-5xl p-10 flex flex-col h-full transition-all shadow-lg ${
                plan.dark ? 'bg-jozi-dark text-white' : 'bg-white text-jozi-forest'
              } ${plan.recommended ? 'ring-4 ring-jozi-gold scale-105 z-10' : 'border border-jozi-forest/5'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-jozi-gold text-jozi-forest text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  Growth Choice
                </div>
              )}

              <div className="mb-8 space-y-1 text-left">
                <p className={`text-[10px] font-black uppercase tracking-widest ${plan.dark ? 'text-jozi-gold' : 'text-gray-400'}`}>
                  {plan.subtitle}
                </p>
                <h3 className="text-3xl font-black tracking-tight">{plan.name}</h3>
              </div>

              <div className="mb-8 text-left">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black">R{plan.price}</span>
                  <span className={`text-sm font-bold ${plan.dark ? 'text-white/50' : 'text-gray-400'}`}>/month</span>
                </div>
                <div className={`mt-4 p-4 rounded-2xl ${plan.dark ? 'bg-white/10' : 'bg-jozi-cream'} border ${plan.dark ? 'border-white/10' : 'border-jozi-forest/5'}`}>
                  <p className="font-black text-lg">{plan.commission}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${plan.dark ? 'text-white/50' : 'text-gray-400'}`}>
                    {plan.commissionNote}
                  </p>
                </div>
              </div>

              <p className={`text-sm font-medium mb-10 leading-relaxed text-left ${plan.dark ? 'text-white/70' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              <div className="space-y-4 mb-12 grow text-left">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.dark ? 'text-jozi-gold' : 'text-jozi-forest'}`} />
                    <span className="text-xs font-bold leading-tight opacity-90">{feat}</span>
                  </div>
                ))}
              </div>

              <div className={`w-full py-5 rounded-2xl font-black text-[10px] text-center uppercase tracking-widest border-2 ${
                plan.dark ? 'border-white/10 text-white/40' : 'border-gray-100 text-gray-300'
              }`}>
                Select After Approval
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* logistics & Comparison sections remain informational... */}
      <section className="container mx-auto px-4 mt-40">
        <div className="bg-jozi-dark rounded-[4rem] p-16 lg:p-32 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-12">
            <h2 className="text-5xl lg:text-7xl font-black leading-none tracking-tighter text-center uppercase">
              Ready to <br />
              <span className="text-jozi-gold italic">Claim Your Slot?</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link href="/vendor/apply" className="bg-jozi-gold text-jozi-forest px-12 py-6 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-2xl">
                Apply to Sell
              </Link>
            </div>
          </div>
          <Sparkles className="absolute -bottom-10 -right-10 w-96 h-96 opacity-10 pointer-events-none" />
        </div>
      </section>
    </div>
  );
};

export default VendorPricingPage;