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
  ShieldAlert, 
  ChevronLeft,
  AlertCircle,
  Database,
  Terminal,
  Activity
} from 'lucide-react';
import Logo from '../../components/Logo';
import { AuthResult, adminSignInAction } from '@/app/actions/auth/auth';

const AdminSignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<AuthResult | null, FormData>(
    adminSignInAction,
    null
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8 relative border border-gray-200"
      >
        <div className="flex flex-col items-center text-center space-y-5">
          <Link href="/" className="inline-block mb-2">
            <Logo className="h-16 w-auto" />
          </Link>

          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1 rounded-full mb-1">
               <ShieldAlert className="w-3.5 h-3.5" />
               <span className="text-[9px] font-black uppercase tracking-widest">Governance Node</span>
            </div>
            <h2 className="text-2xl font-black text-jozi-dark tracking-tight uppercase leading-tight">
              Platform <span className="text-jozi-gold">Control</span>
            </h2>
            <p className="text-gray-500 font-medium text-xs">Enter administrator credentials to access the dashboard.</p>
          </div>

          <AnimatePresence>
            {state?.error && state.message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full p-3 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-600 text-xs font-bold text-left"
              >
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                {state.message}
              </motion.div>
            )}
          </AnimatePresence>

          <form action={formAction} className="w-full space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Admin Identifier</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="admin@jozimarket.za"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 font-medium text-sm text-jozi-dark outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
                <Link href="/admin/forgot-password" className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-11 font-medium text-sm text-jozi-dark outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-jozi-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className={`w-full bg-jozi-dark text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center group shadow-md hover:bg-black transition-all mt-2 ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPending ? 'Authenticating...' : 'Sign In'}
              {!isPending && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-3 w-full pt-2">
             <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Terminal className="w-3.5 h-3.5 text-gray-400 mb-1.5" />
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Secure</p>
             </div>
             <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Activity className="w-3.5 h-3.5 text-emerald-500 mb-1.5" />
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Online</p>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignInPage;