'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Zap,
  Users,
  Star,
  MapPin,
  Instagram,
  Facebook,
  Loader2,
  X,
  Package,
  Sparkles,
  Truck,
  TrendingUp,
} from 'lucide-react';
import { registerWaitlistAction, getWaitlistCountAction } from '../actions/waitlist/index';

type UserType = 'buyer' | 'vendor';

interface FormData {
  name: string;
  email: string;
  phone: string;
  type: UserType;
}

const PROBLEMS = [
  { problem: 'Long taxi rides and traffic', solution: 'Shop directly from your phone' },
  { problem: 'Crowded shopping spaces', solution: 'Browse products online safely' },
  { problem: 'Difficulty finding trendy products', solution: 'AI-powered fashion inspiration' },
  { problem: 'Time-consuming shopping trips', solution: 'Fast delivery and easy browsing' },
];

const FEATURES = [
  { icon: Package, label: 'Affordable fashion & lifestyle' },
  { icon: Sparkles, label: 'AI-powered outfit inspiration' },
  { icon: Smartphone, label: 'Fast mobile browsing' },
  { icon: Truck, label: 'Same-day delivery (select areas)' },
  { icon: Star, label: 'Exclusive launch deals' },
  { icon: Users, label: 'Community-driven shopping' },
];

export default function WaitlistPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', type: 'buyer' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    getWaitlistCountAction().then(({ count }) => {
      if (count > 0) setWaitlistCount(count);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTypeChange = (type: UserType) => {
    setError(null);
    setForm(prev => ({ ...prev, type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await registerWaitlistAction(form);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setWaitlistCount(prev => (prev !== null ? prev + 1 : 1));
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1A17] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1A17]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#C7A16E] rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white text-sm uppercase tracking-widest">Jozi Market</span>
          </div>
          <a
            href="#signup"
            className="bg-[#C7A16E] text-[#0A1A17] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#D4B485] transition-colors"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1B5E52]/30 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#C7A16E]/10 rounded-full blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1B5E52]/40 border border-[#1B5E52] text-[#C7A16E] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
            <Zap className="w-3 h-3" />
            Coming Soon — Join the Waitlist
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter text-white">
            The Future of<br />
            <span className="text-[#C7A16E]">Affordable Urban</span><br />
            Shopping in Joburg
          </h1>

          <p className="text-base sm:text-lg text-white/60 font-medium leading-relaxed max-w-xl mx-auto">
            Jozi Market brings Johannesburg&apos;s vibrant street markets directly to your phone.
            Shop smarter, discover fashion faster, and be part of building something made for you.
          </p>

          {waitlistCount !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 text-sm text-white/50 font-bold"
            >
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-[#1B5E52] border-2 border-[#0A1A17]" />
                ))}
              </div>
              <span><span className="text-[#C7A16E] font-black">{waitlistCount.toLocaleString()}+</span> people already joined</span>
            </motion.div>
          )}

          <motion.a
            href="#signup"
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-[#1B5E52] hover:bg-[#247A6A] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-colors shadow-xl shadow-[#1B5E52]/30 min-h-[52px]"
          >
            Secure My Spot <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 text-[10px] uppercase tracking-widest"
        >
          <span>Scroll</span>
          <div className="w-px h-8 bg-white/20" />
        </motion.div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="py-20 md:py-28 px-4 bg-[#0d1f1b]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 space-y-3"
          >
            <p className="text-[#C7A16E] text-[10px] font-black uppercase tracking-[0.3em]">Why We Exist</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
              Shopping in Joburg should not feel<br className="hidden sm:block" />
              <span className="text-[#C7A16E]"> stressful.</span>
            </h2>
            <p className="text-white/50 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Many people love the affordability and culture of places like Dragon City and inner-city markets
              — but these spaces can be overcrowded, time-consuming, and difficult to navigate.
            </p>
          </motion.div>

          <div className="space-y-3">
            {/* Header row — desktop */}
            <div className="hidden md:grid grid-cols-2 gap-4 mb-2 px-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">The Problem</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C7A16E]">Our Solution</p>
            </div>
            {PROBLEMS.map(({ problem, solution }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
              >
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-4">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-sm font-bold text-white/60">{problem}</span>
                </div>
                <div className="flex items-center gap-3 bg-[#1B5E52]/20 border border-[#1B5E52]/30 rounded-2xl px-4 py-4">
                  <CheckCircle2 className="w-4 h-4 text-[#C7A16E] shrink-0" />
                  <span className="text-sm font-bold text-white">{solution}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-3"
          >
            <p className="text-[#C7A16E] text-[10px] font-black uppercase tracking-[0.3em]">What&apos;s Coming</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
              Everything you need,<br className="hidden sm:block" /> <span className="text-[#C7A16E]">in one app.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/8 rounded-2xl p-5 flex flex-col items-start gap-3 hover:bg-white/8 transition-colors"
              >
                <div className="w-10 h-10 bg-[#1B5E52]/40 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#C7A16E]" />
                </div>
                <p className="text-sm font-bold text-white/80 leading-snug">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-20 md:py-28 px-4 bg-[#0d1f1b]">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-center"
          >
            <p className="text-[#C7A16E] text-[10px] font-black uppercase tracking-[0.3em]">The Story Behind Jozi Market</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
              Built from a real problem,<br className="hidden sm:block" /> <span className="text-[#C7A16E]">for real people.</span>
            </h2>
            <p className="text-white/60 font-medium leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
              Jozi Market was born from a real problem faced by thousands of shoppers in Johannesburg every day.
              We love the culture, energy, and affordability of urban markets — but shopping there is not always
              safe, accessible, or efficient.
            </p>
            <div className="bg-[#1B5E52]/15 border border-[#1B5E52]/30 rounded-3xl p-6 md:p-8 text-left space-y-4 max-w-xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1B5E52]/40 border border-[#1B5E52]/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#C7A16E]" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Nokuthula Mchunu</p>
                  <p className="text-[11px] text-white/40 font-medium">Founder · Precision Impact Solution</p>
                </div>
              </div>
              <p className="text-white/60 text-sm font-medium leading-relaxed italic">
                &quot;The platform is being developed under Precision Impact Solution by a woman in STEM and
                aspiring tech entrepreneur passionate about using technology to uplift communities and
                modernize informal commerce.&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SIGNUP FORM ── */}
      <section id="signup" className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <p className="text-[#C7A16E] text-[10px] font-black uppercase tracking-[0.3em]">Be Part of the Journey</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
                Join the waitlist.<br /> <span className="text-[#C7A16E]">Get early access.</span>
              </h2>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
                Receive launch updates, early access invitations, beta testing opportunities, and special launch offers.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#1B5E52]/20 border-2 border-[#1B5E52]/50 rounded-3xl p-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-[#1B5E52]/40 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#C7A16E]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">You&apos;re on the list!</h3>
                    <p className="text-white/60 text-sm font-medium mt-2 leading-relaxed">
                      We&apos;ll notify you as soon as Jozi Market launches. Stay connected on social media for updates.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                      <Instagram className="w-4 h-4 text-white/60" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                      <Facebook className="w-4 h-4 text-white/60" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="TikTok">
                      <svg className="w-4 h-4 text-white/60 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.17 8.17 0 0 0 4.78 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z"/></svg>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Type selector */}
                  <div className="grid grid-cols-2 gap-3">
                    {(['buyer', 'vendor'] as UserType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTypeChange(t)}
                        className={`py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all min-h-[48px] border-2 ${
                          form.type === t
                            ? 'bg-[#1B5E52] border-[#1B5E52] text-white shadow-lg shadow-[#1B5E52]/30'
                            : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {t === 'buyer' ? '🛍 Buyer Sign Up' : '🏪 Vendor Sign Up'}
                      </button>
                    ))}
                  </div>

                  {/* Fields */}
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Nokuthula Mchunu', autoComplete: 'name' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+27 71 234 5678', autoComplete: 'tel' },
                  ].map(({ name, label, type, placeholder, autoComplete }) => (
                    <div key={name} className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                        {label}
                      </label>
                      <input
                        name={name}
                        type={type}
                        required
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        value={form[name as keyof FormData] as string}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#C7A16E]/60 rounded-2xl px-4 py-3.5 text-sm font-medium text-white placeholder:text-white/20 outline-none transition-all min-h-[52px]"
                      />
                    </div>
                  ))}

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                      >
                        <X className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-xs font-bold text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C7A16E] hover:bg-[#D4B485] disabled:opacity-60 text-[#0A1A17] py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all min-h-[56px] flex items-center justify-center gap-2 active:scale-[0.99] shadow-xl shadow-[#C7A16E]/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join the Waitlist <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-white/20 text-[11px] font-medium">
                    No spam. Unsubscribe anytime.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: ShieldCheck, label: 'Private & Secure' },
                { icon: Zap, label: 'Early Access' },
                { icon: Star, label: 'Launch Deals' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="w-4 h-4 text-[#C7A16E]" />
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-white/15 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Jozi Market · Precision Impact Solution · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
