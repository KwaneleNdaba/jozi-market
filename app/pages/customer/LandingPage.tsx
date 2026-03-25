import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Globe, 
  TrendingUp, 
  Award, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import Logo from '../../components/Logo';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-jozi-cream overflow-x-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-jozi-dark">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-jozi-dark via-jozi-dark/60 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-5 md:px-6 text-center space-y-6 md:space-y-10 py-16 md:py-0">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <Logo className="h-24 sm:h-32 md:h-56 mx-auto mb-2 md:mb-4 scale-110" variant="white" />
          </motion.div>

          <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-4xl sm:text-5xl md:text-9xl font-black text-white leading-none tracking-tighter uppercase"
            >
              The Soul of <br />
              <span className="text-jozi-gold italic">Johannesburg.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-base md:text-2xl text-jozi-cream/70 font-medium max-w-2xl mx-auto leading-relaxed px-2"
            >
              Discover authentic treasures hand-stitched and crafted in the heart of our city. A premium marketplace for Joburg's finest artisans.
            </motion.p>
          </div>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 pt-4 md:pt-10"
          >
            <Link 
              href="/marketplace" 
              className="group bg-white text-jozi-dark px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-3xl font-black text-sm md:text-xl uppercase tracking-widest shadow-2xl hover:bg-jozi-gold transition-all flex items-center justify-center w-full sm:w-auto min-h-[48px]"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-jozi-forest" />
              Shop Treasures
              <ArrowRight className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <Link 
              href="/vendor/pricing" 
              className="group border-2 border-white/20 backdrop-blur-md text-white px-8 py-4 md:px-12 md:py-6 rounded-2xl md:rounded-3xl font-black text-sm md:text-xl uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center w-full sm:w-auto min-h-[48px]"
            >
              <Store className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-jozi-gold" />
              Become a Partner
            </Link>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/40"
        >
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>
      </section>

      {/* Market Stats Ticker */}
      <div className="bg-jozi-gold py-4 md:py-6 border-y border-white/10">
        <div className="container mx-auto px-4 grid grid-cols-2 md:flex md:flex-wrap md:justify-between items-center gap-3 md:gap-8">
           {[
             { label: 'Verified Artisans', val: '140+', icon: ShieldCheck },
             { label: 'Regional Reach', val: 'Nationwide', icon: Globe },
             { label: 'Craft Impact', val: 'R2.4M+', icon: TrendingUp },
             { label: 'Happy Neighbors', val: '18k+', icon: Award },
           ].map((stat, i) => (
             <div key={i} className="flex items-center space-x-2 md:space-x-3 text-jozi-dark text-left">
                <stat.icon className="w-4 h-4 md:w-5 md:h-5 opacity-60 shrink-0" />
                <div className="md:flex md:items-center md:space-x-2">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60 block md:inline">{stat.label}:</span>
                  <span className="text-xs md:text-sm font-black uppercase">{stat.val}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Ethos Section */}
      <section className="py-12 md:py-32 container mx-auto px-5 md:px-6 text-left">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center text-left">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-10"
          >
            <div className="inline-flex items-center bg-jozi-forest/5 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-jozi-forest/10">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-jozi-gold mr-2 md:mr-3" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-jozi-forest">Our Identity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-jozi-forest leading-[0.9] tracking-tighter uppercase">
              BEYOND A MARKET, <br />
              <span className="text-jozi-gold italic">A MOVEMENT.</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 md:border-l-8 border-jozi-gold pl-4 md:pl-8">
              "We believe the pulse of Johannesburg isn't found in mass production, but in the hands of the visionaries who define our city's modern heritage."
            </p>
            <div className="space-y-4 md:space-y-6">
              {[
                { t: 'Artisan Verification', d: 'Every shop on our platform passes a strict quality and ethics audit at our Maboneng Hub.' },
                { t: 'Logistics Integrity', d: 'Fast, secure delivery across Gauteng and South Africa, handled with care.' },
                { t: 'Loyalty Economy', d: 'Earn Market Points for supporting local, redeemable for exclusive craft experiences.' }
              ].map((point, i) => (
                <div key={i} className="flex items-start space-x-3 md:space-x-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-jozi-forest text-white rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-jozi-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-lg font-black text-jozi-forest uppercase tracking-tight">{point.t}</h4>
                    <p className="text-gray-400 font-medium mt-0.5 md:mt-1 leading-relaxed text-xs md:text-base">{point.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="aspect-4/5 rounded-3xl md:rounded-5xl overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-linear-to-t from-jozi-dark/60 to-transparent" />
                <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 text-white text-left">
                  <p className="text-[9px] md:text-[10px] font-black uppercase text-jozi-gold tracking-widest mb-0.5 md:mb-1">Featured Artifact</p>
                  <h3 className="text-xl md:text-3xl font-black uppercase">Hand-Dyed Indigo Shweshwe</h3>
                </div>
             </div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-jozi-gold/20 rounded-full blur-3xl -z-10 hidden md:block" />
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-jozi-forest/10 rounded-full blur-3xl -z-10 hidden md:block" />
          </motion.div>
        </div>
      </section>

      {/* Footer Lite */}
      <footer className="py-8 md:py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 text-center md:text-left">
          <Logo className="h-12 md:h-16" />
          <div className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2 md:space-x-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/marketplace" className="hover:text-jozi-forest transition-colors min-h-[44px] flex items-center">Marketplace</Link>
            <Link href="/vendors" className="hover:text-jozi-forest transition-colors min-h-[44px] flex items-center">Vendors</Link>
            <Link href="/vendor/pricing" className="hover:text-jozi-forest transition-colors min-h-[44px] flex items-center">Sell</Link>
            <Link href="/faq" className="hover:text-jozi-forest transition-colors min-h-[44px] flex items-center">FAQ</Link>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 text-center md:text-right">© 2024 Jozi Market • Proudly South African</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;