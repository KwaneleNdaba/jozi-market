
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import Logo from '../components/Logo';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/profile');
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
                  "Support local Joburg artisans",
                  "Earn points on every purchase",
                  "Fast local shipping across GP",
                  "Exclusive member-only drops"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="font-bold text-sm tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.4em] text-jozi-forest/60">The Pulse of Joburg</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lerato Dlamini"
                  className="w-full bg-jozi-cream border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-jozi-forest outline-none focus:ring-2 ring-jozi-gold/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-jozi-cream border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-jozi-forest outline-none focus:ring-2 ring-jozi-gold/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-jozi-cream border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-jozi-forest outline-none focus:ring-2 ring-jozi-gold/20"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-jozi-forest text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center group shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all"
            >
              Start My Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-12 text-center text-sm font-medium text-gray-500">
            Already have an account? {' '}
            <Link href="/signin" className="text-jozi-gold font-black hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
