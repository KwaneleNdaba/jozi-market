'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Flame, Zap, Award } from 'lucide-react';
import { useProfileUser } from '@/app/contexts/ProfileUserContext';

export default function ProfileOverviewPage() {
  const { user } = useProfileUser();

  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Market Points', value: '1,250', icon: Star, color: 'text-jozi-gold' },
          { label: 'Active Streak', value: '4 Days', icon: Flame, color: 'text-orange-500' },
          { label: 'Total Saved', value: 'R1,420', icon: Zap, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-jozi-forest/5 shadow-soft flex items-center space-x-6">
            <div className={`p-4 bg-gray-50 rounded-2xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-jozi-forest">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-5xl p-10 border border-jozi-forest/5 shadow-soft">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Recent Manifests</h3>
          <Link href="/orders" className="text-sm font-bold text-jozi-gold hover:underline">Full History</Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400 font-bold text-sm">View your order history on the <Link href="/orders" className="text-jozi-gold hover:underline">Orders page</Link></p>
        </div>
      </div>

      <div className="bg-jozi-forest rounded-5xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-md">
          <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Level 22 Connector: <br /><span className="text-jozi-gold italic">Premium Neighbor</span></h3>
          <p className="text-jozi-cream/60 font-medium">You've empowered 12 local artisans this cycle! Your contribution keeps the Joburg creative heartbeat strong.</p>
        </div>
        <Link href="/referrals" className="relative z-10 bg-jozi-gold text-jozi-dark px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
          Expand Collective
        </Link>
        <Award className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 opacity-20 pointer-events-none" />
      </div>
    </div>
  );
}

