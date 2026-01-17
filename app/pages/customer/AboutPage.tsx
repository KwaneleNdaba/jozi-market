import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Users, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Heart, 
  Store, 
  Sparkles, 
  ArrowRight,
  Target,
  Award,
  Box,
  BadgeCheck,
  CheckCircle2,
  // Added ShoppingBag to fix the error in line 207
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  const customerBenefits = [
    { title: 'Hub-Verified Quality', desc: 'Every treasure passes through our Maboneng Hub for a physical quality and authenticity audit before dispatch.', icon: ShieldCheck },
    { title: 'Artisan Exclusives', desc: 'Access limited-edition artifacts you won\'t find on mass-production platforms.', icon: Sparkles },
    { title: 'The Neighbors Economy', desc: 'Earn points on every spend, redeemable for workshop experiences and exclusive vouchers.', icon: Award },
    { title: 'Nationwide Delivery', desc: 'Fast, secure shipping from our central hub to any doorstep in South Africa.', icon: Box },
  ];

  const vendorBenefits = [
    { title: 'Zero-Risk Entry', desc: 'Start with a 6-month free trial. We only succeed when you make sales.', icon: Zap },
    { title: 'Strategic Intelligence', desc: 'Access AI-powered insights on pricing, demand, and regional trends.', icon: TrendingUp },
    { title: 'Social Exposure', desc: 'Get your workshop featured on our high-reach social channels and vertical video reels.', icon: Globe },
    { title: 'Direct Logistics', desc: 'Focus on your craft while our integrated hub handles the complex fulfillment and returns.', icon: Users },
  ];

  return (
    <div className="bg-jozi-cream min-h-screen pb-32">
      {/* 1. Hero Section */}
      <section className="bg-jozi-forest py-24 md:py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-jozi-gold text-[10px] font-black uppercase tracking-[0.3em]">
              Established 2024 • Johannesburg
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
              Empowering <br />
              <span className="text-jozi-gold italic">The Visionaries.</span>
            </h1>
            <p className="text-jozi-cream/70 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
              Jozi Market is more than a marketplace. We are a digital bridge connecting South Africa’s finest artisans with neighbors who value craft over mass-production.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. What is Jozi Market? */}
      <section className="container mx-auto px-6 mt-24">
        <div className="bg-white rounded-[4rem] p-10 lg:p-20 shadow-soft border border-jozi-forest/5 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-jozi-forest tracking-tighter uppercase">A Stage, Not a Shop.</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                "Jozi Market does not own the products you see. We own the responsibility of making local artisans successful."
              </p>
            </div>
            <p className="text-gray-500 leading-relaxed">
              We operate as a multi-vendor ecosystem where the contract of sale exists directly between you and the artisan. We provide the high-end digital storefront, the AI-powered marketing tools, and the central logistics hub in Maboneng to ensure every transaction is safe, verified, and professional.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-jozi-gold">
                 <CheckCircle2 className="w-4 h-4" /> <span>Direct-from-Workshop</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-jozi-gold">
                 <CheckCircle2 className="w-4 h-4" /> <span>CPA Compliant</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-jozi-gold">
                 <CheckCircle2 className="w-4 h-4" /> <span>Verified Logistics</span>
               </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square rounded-5xl overflow-hidden shadow-2xl border-8 border-jozi-cream">
                <img src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Artisan Workspace" />
             </div>
             <div className="absolute -bottom-8 -left-8 bg-jozi-gold p-8 rounded-4xl shadow-xl text-jozi-dark">
                <p className="text-3xl font-black leading-none">140+</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-1">Verified Artisans</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. For Customers */}
      <section className="container mx-auto px-6 mt-32 space-y-12">
        <div className="text-center space-y-4">
           <h2 className="text-4xl font-black text-jozi-forest uppercase tracking-tighter">Seek Rare Treasures</h2>
           <p className="text-gray-400 font-medium italic">Why neighbors choose Jozi Market for their homes and lives.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {customerBenefits.map((benefit, i) => (
            <div key={i} className="bg-white p-8 rounded-5xl border border-jozi-forest/5 shadow-soft text-left hover:border-jozi-gold transition-all group">
              <div className="w-12 h-12 bg-jozi-cream rounded-2xl flex items-center justify-center text-jozi-forest mb-6 group-hover:bg-jozi-forest group-hover:text-white transition-all">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-jozi-forest mb-4 uppercase tracking-tight leading-tight">{benefit.title}</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed italic opacity-80">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. For Vendors */}
      <section className="bg-jozi-dark py-32 mt-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-[0.4em]">Scaling Local</div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">Scale Your <br /><span className="text-jozi-gold">Craftsmanship.</span></h2>
              </div>
              <p className="text-lg text-jozi-cream/60 leading-relaxed italic">
                "We built the tools so you can focus on the making. From AI-driven analytics to integrated social exposure, your workshop has never been this powerful."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vendorBenefits.map((benefit, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-jozi-gold shrink-0">
                      <benefit.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-black text-sm uppercase tracking-tight">{benefit.title}</h5>
                      <p className="text-xs text-white/40 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/vendor/pricing" className="inline-flex items-center bg-jozi-gold text-jozi-dark px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20">
                Explore Success Plans <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="hidden lg:block relative">
               <div className="aspect-4/5 rounded-[4rem] overflow-hidden border-8 border-white/10">
                  <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-50" alt="Vendor App Preview" />
               </div>
               <div className="absolute inset-0 bg-linear-to-t from-jozi-dark via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why We Are Different */}
      <section className="container mx-auto px-6 mt-32 text-left">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-jozi-forest uppercase tracking-tighter">The Jozi <br />Standard.</h3>
            <p className="text-gray-400 font-medium italic">We don't just process transactions; we curate an experience built on mutual respect and visibility.</p>
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-10">
             <div className="space-y-4 p-8 bg-white rounded-4xl shadow-soft border border-jozi-forest/5">
                <div className="w-10 h-10 bg-jozi-forest/5 rounded-xl flex items-center justify-center text-jozi-forest"><Target className="w-5 h-5" /></div>
                <h5 className="font-black text-lg uppercase tracking-tight">No House Competition</h5>
                <p className="text-sm text-gray-500 leading-relaxed">Unlike global marketplaces, we don't track your best sellers just to release our own "Platform Basics" version. Your data is your secret weapon.</p>
             </div>
             <div className="space-y-4 p-8 bg-white rounded-4xl shadow-soft border border-jozi-forest/5">
                <div className="w-10 h-10 bg-jozi-forest/5 rounded-xl flex items-center justify-center text-jozi-forest"><BadgeCheck className="w-5 h-5" /></div>
                <h5 className="font-black text-lg uppercase tracking-tight">Growth Over Listings</h5>
                <p className="text-sm text-gray-500 leading-relaxed">Simply listing products isn't enough. We provide the social exposure engine and influencer network needed to actually move inventory.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Our Vision */}
      <section className="container mx-auto px-6 mt-40">
        <div className="bg-jozi-forest rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 text-center space-y-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-jozi-gold rounded-3xl flex items-center justify-center text-jozi-dark mx-auto shadow-2xl">
                 <Heart className="w-10 h-10 fill-current" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-none">A Sustainable <br /><span className="text-jozi-gold">Neighbors Economy.</span></h2>
                 <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">
                   Our vision is to empower 1,000 Johannesburg artisans to scale their businesses nationwide, creating sustainable livelihoods and preserving South African heritage in every stitch and stroke.
                 </p>
              </div>
           </div>
           <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-jozi-gold opacity-5 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* 7. Call to Action Grid */}
      <section className="container mx-auto px-6 mt-32">
         <div className="grid md:grid-cols-3 gap-6">
            <Link href="/vendor/register" className="p-10 bg-jozi-gold rounded-5xl text-jozi-dark text-center group transition-all hover:-translate-y-2">
               <Store className="w-10 h-10 mx-auto mb-4" />
               <h4 className="text-2xl font-black uppercase tracking-tight">Start Selling</h4>
               <p className="text-xs font-bold mt-2 opacity-60">Join the collective as an artisan</p>
            </Link>
            <Link href="/marketplace" className="p-10 bg-white rounded-5xl border border-jozi-forest/5 shadow-soft text-jozi-forest text-center transition-all hover:-translate-y-2">
               <ShoppingBag className="w-10 h-10 mx-auto mb-4" />
               <h4 className="text-2xl font-black uppercase tracking-tight">Browse Gallery</h4>
               <p className="text-xs font-bold mt-2 opacity-60">Discover unique local treasures</p>
            </Link>
            <Link href="/signup" className="p-10 bg-jozi-dark rounded-5xl text-white text-center transition-all hover:-translate-y-2">
               <Users className="w-10 h-10 mx-auto mb-4 text-jozi-gold" />
               <h4 className="text-2xl font-black uppercase tracking-tight">Join Neighbors</h4>
               <p className="text-xs font-bold mt-2 opacity-40">Earn loyalty points and rewards</p>
            </Link>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;