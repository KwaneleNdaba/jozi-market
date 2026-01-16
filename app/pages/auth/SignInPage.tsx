'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Chrome,
  Eye,
  EyeOff,
  Facebook,
  Info,
  Lock,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import React, { useActionState, useState } from 'react';
import { AuthResult, customerSignInAction } from '@/app/actions/auth/auth';
import Logo from '../../components/Logo';

const SignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(
    customerSignInAction,
    null
  );

  const handleGoogleSignIn = () => {
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:8000'}/api/auth/google`;
    window.location.href = googleAuthUrl;
  };

  const handleFacebookSignIn = () => {
    const facebookAuthUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:8000'}/api/auth/facebook`;
    window.location.href = facebookAuthUrl;
  };

  return (
    <div className="min-h-screen bg-jozi-cream flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[750px] border border-jozi-forest/5"
      >
        {/* Left Side: Brand Visual */}
        <div className="lg:w-1/2 bg-jozi-forest relative overflow-hidden hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-jozi-forest via-jozi-forest/80 to-transparent" />

          <div className="relative z-10 h-full p-16 flex flex-col justify-between text-white">
            <Link href="/" className="inline-block -ml-10">
              <Logo className="h-40 w-auto" variant="white" />
            </Link>

            <div className="space-y-6">
              <h2 className="text-5xl font-black leading-tight tracking-tighter">
                WELCOME BACK TO <br />
                <span className="text-jozi-gold">THE COLLECTIVE.</span>
              </h2>
              <p className="text-jozi-cream/70 text-lg font-medium max-w-md">
                Sign in to access your local treasures, saved wishlist, and earned reward points.
              </p>
            </div>

            <p className="text-xs font-bold text-jozi-cream/60 uppercase tracking-widest">
              Proudly South African 🇿🇦
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-white">
          <div className="lg:hidden mb-12">
            <Link href="/" className="flex items-center space-x-2 text-jozi-forest font-bold">
              <ChevronLeft className="w-5 h-5" />
              <span>Back Home</span>
            </Link>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-4xl font-black text-jozi-forest tracking-tight">Sign In</h2>
            <p className="text-gray-400 font-medium">Continue your supporting-local journey.</p>
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
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-jozi-cream border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 font-bold text-jozi-forest outline-none focus:border-jozi-gold/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-black uppercase text-jozi-gold hover:text-jozi-forest"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-jozi-cream border-2 border-transparent rounded-2xl py-5 pl-14 pr-14 font-bold text-jozi-forest outline-none focus:border-jozi-gold/20 transition-all"
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
              {isPending ? 'Verifying...' : 'Sign In'}
              {!isPending && (
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-8 p-6 bg-jozi-gold/5 rounded-[2rem] border border-jozi-gold/10">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="w-4 h-4 text-jozi-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-jozi-gold">
                Demo Customer Access
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const emailInput = document.getElementById('email') as HTMLInputElement;
                const passwordInput = document.getElementById('password') as HTMLInputElement;
                if (emailInput) emailInput.value = 'customer@gmail.com';
                if (passwordInput) passwordInput.value = '12345678';
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-jozi-gold/5 hover:border-jozi-gold/30 transition-all group"
            >
              <span className="text-[9px] font-black text-jozi-forest">Customer Account</span>
              <span className="text-[8px] font-bold text-gray-400 group-hover:text-jozi-gold">
                customer@gmail.com
              </span>
            </button>
            <p className="text-[9px] text-gray-400 text-center mt-4 font-bold uppercase italic">
              Password: 12345678 • Customer accounts only
            </p>
          </div>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-x-0 h-[1px] bg-gray-100" />
              <span className="relative bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Or login with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isPending}
                className="flex items-center justify-center space-x-3 bg-white border border-gray-100 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-jozi-forest shadow-sm disabled:opacity-50"
              >
                <Chrome className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                disabled={isPending}
                className="flex items-center justify-center space-x-3 bg-white border border-gray-100 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm text-jozi-forest shadow-sm disabled:opacity-50"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-sm font-medium text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-jozi-gold font-black hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;
