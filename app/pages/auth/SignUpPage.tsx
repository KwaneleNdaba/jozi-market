'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Chrome,
  Eye,
  EyeOff,
  Facebook,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import Link from 'next/link';
import React, { useActionState, useState } from 'react';
import { AuthResult, signUpAction } from '@/app/actions/auth/auth';
import Logo from '../../components/Logo';

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(
    signUpAction,
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-white rounded-5xl shadow-2xl overflow-hidden flex flex-col lg:flex-row-reverse min-h-[700px] border border-jozi-forest/5"
      >
        {/* Right Side: Features/Benefits */}
        <div className="lg:w-1/2 bg-jozi-gold relative overflow-hidden hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-linear-to-bl from-jozi-gold via-jozi-gold/80 to-transparent" />

          <div className="relative z-10 h-full p-16 flex flex-col justify-between text-jozi-forest">
            <Link href="/" className="inline-block -ml-10">
              <Logo className="h-40 w-auto" variant="white" />
            </Link>

            <div className="space-y-8">
              <h2 className="text-5xl font-black leading-tight tracking-tighter text-white">
                JOIN THE <br />
                MOVEMENT.
              </h2>
              <div className="space-y-4">
                {[
                  'Support local Joburg artisans',
                  'Earn points on every purchase',
                  'Fast local shipping across GP',
                  'Exclusive member-only drops',
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="font-bold text-sm tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.4em] text-jozi-forest/60">
              The Pulse of Joburg
            </p>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
          <div className="lg:hidden mb-12">
            <Link href="/" className="flex items-center space-x-2 text-jozi-forest font-bold">
              <ChevronLeft className="w-5 h-5" />
              <span>Back Home</span>
            </Link>
          </div>

          <div className="space-y-2 mb-10">
            <h2 className="text-4xl font-black text-jozi-forest tracking-tight">Create Account</h2>
            <p className="text-gray-400 font-medium">Join our community of local supporters.</p>
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
                htmlFor="fullName"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Lerato Dlamini"
                  className="w-full bg-jozi-cream border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-jozi-forest outline-none focus:ring-2 ring-jozi-gold/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
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
                  className="w-full bg-jozi-cream border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-jozi-forest outline-none focus:ring-2 ring-jozi-gold/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password"
                  className="w-full bg-jozi-cream border-none rounded-2xl py-5 pl-14 pr-14 font-bold text-jozi-forest outline-none focus:ring-2 ring-jozi-gold/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-jozi-forest"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[9px] text-gray-400 font-medium ml-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm your password"
                  className="w-full bg-jozi-cream border-none rounded-2xl py-5 pl-14 pr-14 font-bold text-jozi-forest outline-none focus:ring-2 ring-jozi-gold/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-jozi-forest"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-jozi-forest text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center group shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPending ? 'Creating Account...' : 'Start My Journey'}
              {!isPending && (
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-x-0 h-px bg-gray-100" />
              <span className="relative bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Or sign up with
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
            Already have an account?{' '}
            <Link href="/signin" className="text-jozi-gold font-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
