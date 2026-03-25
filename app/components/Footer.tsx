'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  Globe,
  Award
} from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-jozi-dark text-jozi-cream pt-12 md:pt-24 pb-24 md:pb-12 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-jozi-forest opacity-[0.03] -skew-x-12 transform translate-x-20 pointer-events-none" />
      
      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-16 lg:gap-24">
          
          <div className="lg:col-span-4 space-y-5 md:space-y-8 text-left">
            <Link href="/" className="inline-block -ml-4 md:-ml-8">
              <Logo className="h-20 md:h-32 w-auto" variant="white" />
            </Link>
            <p className="text-sm md:text-lg text-jozi-cream/60 font-medium leading-relaxed italic max-w-sm">
              &quot;Providing a digital home for Johannesburg&apos;s visionaries. Authentically crafted, hub-verified, and locally delivered.&quot;
            </p>
            <div className="flex space-x-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 md:w-12 md:h-12 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-jozi-gold hover:text-jozi-dark hover:-translate-y-1 transition-all duration-300 min-h-[44px] min-w-[44px]">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 text-left">
            
            <div className="space-y-4 md:space-y-6">
              <h4 className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.3em] border-b border-white/5 pb-3 md:pb-4">Market Hub</h4>
              <ul className="space-y-2.5 md:space-y-4">
                <li><Link href="/about" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Who We Are</Link></li>
                <li><Link href="/shop" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Our Gallery</Link></li>
                <li><Link href="/vendors" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Artisan Collective</Link></li>
                <li><Link href="/deals" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Active Promotions</Link></li>
                <li><Link href="/games" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Play & Earn</Link></li>
              </ul>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h4 className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.3em] border-b border-white/5 pb-3 md:pb-4">Seeker Care</h4>
              <ul className="space-y-2.5 md:space-y-4">
                <li><Link href="/profile" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Dashboard</Link></li>
                <li><Link href="/shipping" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Logistics Policy</Link></li>
                <li><Link href="/returns" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Return Manifest</Link></li>
                <li><Link href="/faq" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Hub Support (FAQ)</Link></li>
              </ul>
            </div>

            <div className="space-y-4 md:space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.3em] border-b border-white/5 pb-3 md:pb-4">Governance</h4>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2.5 md:space-y-4 md:gap-0">
                <li><Link href="/terms" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Privacy Protocol</Link></li>
                <li><Link href="/vendor/pricing" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Apply to Sell</Link></li>
                <li><Link href="/contact" className="text-xs md:text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors inline-flex items-center min-h-[36px]">Platform Stewards</Link></li>
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-10 md:mt-24 pt-8 md:pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/30">
            <div className="flex items-center space-x-1.5 md:space-x-2"><MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-jozi-gold" /> <span>Maboneng Precinct, JHB</span></div>
            <div className="flex items-center space-x-1.5 md:space-x-2"><Globe className="w-3 h-3 md:w-3.5 md:h-3.5 text-jozi-gold" /> <span>Proudly South African</span></div>
            <div className="flex items-center space-x-1.5 md:space-x-2"><ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-jozi-gold" /> <span>Hub Verified Payments</span></div>
          </div>

          <div className="text-center lg:text-right">
             <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-jozi-cream/40">© 2024 Jozi Market colectivo. All Rights Reserved.</p>
             <div className="flex items-center justify-center lg:justify-end space-x-4 mt-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-2.5 opacity-20 grayscale" alt="Visa" loading="lazy" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-5 opacity-20 grayscale" alt="Mastercard" loading="lazy" />
                <img src="https://seeklogo.com/images/P/payfast-logo-5E6B658C0A-seeklogo.com.png" className="h-3 opacity-20 grayscale" alt="PayFast" loading="lazy" />
             </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-jozi-gold opacity-5 rounded-full blur-[100px]" />
    </footer>
  );
};

export default Footer;
