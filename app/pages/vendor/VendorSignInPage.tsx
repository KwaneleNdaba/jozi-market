'use client';

import React, { useState, useActionState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ChevronLeft,
  AlertCircle,
  Briefcase,
  Store,
  Sparkles
} from 'lucide-react';
import Logo from '../../components/Logo';
import { AuthResult, vendorSignInAction } from '@/app/actions/auth/auth';

const VendorSignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(
    vendorSignInAction,
    null
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[750px] border border-jozi-forest/5"
      >
        <div className="lg:w-1/2 bg-jozi-forest relative overflow-hidden hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-jozi-forest via-jozi-forest/90 to-transparent" />
          
          <div className="relative z-10 h-full p-16 flex flex-col justify-between text-white text-left">
            <Link href="/" className="inline-block -ml-10">
              <Logo className="h-40 w-auto" variant="white" />
            </Link>

            <div className="space-y-6">
              <h2 className="text-5xl font-black leading-tight tracking-tighter">
                ARTISAN <br />
                <span className="text-jozi-gold">COCKPIT.</span>
              </h2>
              <p className="text-jozi-cream/70 text-lg font-medium max-w-md">
                Enter your workshop to manage inventory, track orders, and scale your craft across Johannesburg.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-jozi-gold border border-white/20">
                <Store className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 leading-none">Artisan Partner Portal</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-white">
          <div className="lg:hidden mb-12">
            <Link href="/" className="flex items-center space-x-2 text-jozi-forest font-bold">
              <ChevronLeft className="w-5 h-5" />
              <span>Back Home</span>
            </Link>
          </div>

          <div className="space-y-2 mb-8 text-left">
            <div className="inline-flex items-center space-x-2 bg-jozi-gold/10 text-jozi-gold px-3 py-1 rounded-full mb-4">
               <Sparkles className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Workshop Access</span>
            </div>
            <h2 className="text-4xl font-black text-jozi-forest tracking-tight">Artisan Sign In</h2>
            <p className="text-gray-400 font-medium">Continue your workshop growth sequence.</p>
          </div>

          <AnimatePresence>
            {state?.error && state.message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 text-sm font-bold"
              >
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                {state.message}
              </motion.div>
            )}
          </AnimatePresence>

          <form action={formAction} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="artisan@workshop.za"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 font-bold text-jozi-forest outline-none focus:border-jozi-gold/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Workshop Cipher</label>
                {/* FIX: Removed invalid strokeWidth property from Link component below */}
                <Link href="/vendor/forgot-password" className="text-[10px] font-black uppercase text-jozi-gold hover:text-jozi-forest">Recover Access</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-14 font-bold text-jozi-forest outline-none focus:border-jozi-gold/20 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-jozi-forest"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className={`w-full bg-jozi-forest text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center group shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPending ? 'Verifying...' : 'Access Dashboard'}
              {!isPending && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-12 text-left p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-3">
             <div className="flex items-center space-x-2 text-amber-600">
               <Briefcase className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Apply to Sell</span>
             </div>
             <p className="text-xs text-amber-800 font-medium leading-relaxed">
               Don't have a workshop account yet? Join the Jozi collective and reach customers nationwide.
             </p>
             <Link href="/vendor/apply" className="text-xs font-black text-amber-600 uppercase hover:underline block">Start Application &rarr;</Link>
          </div>

          <p className="mt-12 text-center text-sm font-medium text-gray-500">
            Not a Vendor? {' '}
            <Link href="/signin" className="text-jozi-gold font-black hover:underline">Member Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorSignInPage;