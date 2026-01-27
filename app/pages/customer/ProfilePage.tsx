'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Settings,
  Star,
  ShieldCheck,
  MapPin,
  Award,
  Zap,
  Flame
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { products } from '../../data/mockData';
import ProfileReturnsTab from '../../components/return/ProfileReturnsTab';
import { useProfileUser } from '@/app/contexts/ProfileUserContext';

const ProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { user } = useProfileUser();
  const wishlistItems = products.slice(0, 3);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        {activeTab === 'overview' && (
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
        )}

        {activeTab === 'returns' && (
          <ProfileReturnsTab />
        )}

        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-5xl p-10 border border-jozi-forest/5 shadow-soft text-left">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Saved Treasures</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{wishlistItems.length} Handpicked Pieces</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 bg-jozi-cream/30 rounded-3xl border border-jozi-forest/5 group hover:bg-white transition-all">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-sm shrink-0">
                    <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                  </div>
                  <div className="grow flex flex-col justify-between py-2">
                    <div>
                      <h4 className="font-black text-jozi-forest group-hover:text-jozi-gold transition-colors">{item.name}</h4>
                      <p className="text-xs font-bold text-jozi-gold uppercase tracking-widest mt-1">by {item.vendor.name}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-jozi-forest">R{item.price}</span>
                      <button className="text-[10px] font-black uppercase text-jozi-gold hover:text-jozi-forest tracking-widest">Transfer to Bag</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-10 rounded-5xl border border-jozi-forest/5 shadow-soft space-y-8">
              <h3 className="text-xl font-black text-jozi-forest flex items-center uppercase tracking-tight">
                <ShieldCheck className="w-5 h-5 mr-3 text-jozi-gold" />
                Security Protocol
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Neighbor Identifier</label>
                  <input type="text" defaultValue={user?.fullName || ''} className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Verified Email</label>
                  <input type="email" defaultValue={user?.email || ''} className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/20" />
                </div>
                <button className="w-full bg-jozi-forest text-white py-4 rounded-2xl font-black shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all">
                  Synchronize Profile
                </button>
              </div>
            </div>

            <div className="bg-white p-10 rounded-5xl border border-jozi-forest/5 shadow-soft space-y-8">
              <h3 className="text-xl font-black text-jozi-forest flex items-center uppercase tracking-tight">
                <MapPin className="w-5 h-5 mr-3 text-jozi-gold" />
                Delivery Hubs
              </h3>
              <div className="space-y-4">
                <div className="p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5 relative group">
                  <p className="font-black text-jozi-forest">Primary Residence</p>
                  <p className="text-sm text-gray-400 font-medium mt-1 leading-tight">12 Gwigwi Mrwebi St, Newtown, Johannesburg, 2001</p>
                  <button className="absolute top-6 right-6 text-jozi-gold font-bold text-xs uppercase tracking-widest hover:text-jozi-forest transition-colors">Adjust</button>
                </div>
                <button className="w-full py-4 border-2 border-dashed border-jozi-forest/10 rounded-3xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-jozi-forest hover:text-jozi-forest transition-all">
                  + Initialize New Address
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfilePage;
