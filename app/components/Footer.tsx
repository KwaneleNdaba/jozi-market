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
    <footer className="bg-jozi-dark text-jozi-cream pt-24 pb-12 relative overflow-hidden border-t border-white/5">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-jozi-forest opacity-[0.03] -skew-x-12 transform translate-x-20 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 space-y-8 text-left">
            <Link href="/" className="inline-block -ml-8">
              <Logo className="h-32 w-auto" variant="white" />
            </Link>
            <p className="text-lg text-jozi-cream/60 font-medium leading-relaxed italic max-w-sm">
              &quot;Providing a digital home for Johannesburg&apos;s visionaries. Authentically crafted, hub-verified, and locally delivered.&quot;
            </p>
            <div className="flex space-x-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-jozi-gold hover:text-jozi-dark hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 text-left">
            
            {/* Market Hub */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.3em] border-b border-white/5 pb-4">Market Hub</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Who We Are</Link></li>
                <li><Link href="/shop" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Our Gallery</Link></li>
                <li><Link href="/vendors" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Artisan Collective</Link></li>
                <li><Link href="/deals" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Active Promotions</Link></li>
                <li><Link href="/games" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Play & Earn</Link></li>
              </ul>
            </div>

            {/* Seeker Care */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.3em] border-b border-white/5 pb-4">Seeker Care</h4>
              <ul className="space-y-4">
                <li><Link href="/profile" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/shipping" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Logistics Policy</Link></li>
                <li><Link href="/returns" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Return Manifest</Link></li>
                <li><Link href="/faq" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Hub Support (FAQ)</Link></li>
              </ul>
            </div>

            {/* Governance */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.3em] border-b border-white/5 pb-4">Governance</h4>
              <ul className="space-y-4">
                <li><Link href="/terms" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Privacy Protocol</Link></li>
                <li><Link href="/vendor/pricing" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Apply to Sell</Link></li>
                <li><Link href="/contact" className="text-sm font-bold text-jozi-cream/50 hover:text-white transition-colors">Platform Stewards</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Global Hub Footer Bar */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
            <div className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-jozi-gold" /> <span>Maboneng Precinct, JHB</span></div>
            <div className="flex items-center space-x-2"><Globe className="w-3.5 h-3.5 text-jozi-gold" /> <span>Proudly South African</span></div>
            <div className="flex items-center space-x-2"><ShieldCheck className="w-3.5 h-3.5 text-jozi-gold" /> <span>Hub Verified Payments</span></div>
          </div>

          <div className="text-center lg:text-right">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-jozi-cream/40">© 2024 Jozi Market colectivo. All Rights Reserved.</p>
             <div className="flex items-center justify-center lg:justify-end space-x-4 mt-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-2.5 opacity-20 grayscale" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-5 opacity-20 grayscale" alt="Mastercard" />
                <img src="https://seeklogo.com/images/P/payfast-logo-5E6B658C0A-seeklogo.com.png" className="h-3 opacity-20 grayscale" alt="PayFast" />
             </div>
          </div>
        </div>
      </div>

      {/* Floating Level Progress (Visual only) */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-jozi-gold opacity-5 rounded-full blur-[100px]" />
    </footer>
  );
};

export default Footer;
