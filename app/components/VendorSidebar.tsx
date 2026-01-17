'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/interfaces/auth/auth';
import {
  LayoutDashboard, Package, ShoppingCart, Truck, 
  BarChart3, Tag, Users, Wallet, Settings, 
  BrainCircuit, Lock, AlertTriangle, ChevronRight, Bell,
  Share2, Mail, Megaphone, ShieldAlert, LogOut
} from 'lucide-react';

interface VendorSidebarProps {
  vendor: {
    name: string;
    logo: string;
    tier: string;
    role?: Role | string;
  };
}

const TIER_WEIGHT: Record<string, number> = { 'Free': 0, 'Starter': 1, 'Growth': 2, 'Pro': 3 };

const VendorSidebar: React.FC<VendorSidebarProps> = ({ vendor }) => {
  const pathname = usePathname();

  const menuItems = [
    { id: 'overview', label: 'Artisan Cockpit', icon: LayoutDashboard, minTier: 'Free', path: '/vendor/dashboard' },
    { id: 'inventory', label: 'Product Vault', icon: Package, minTier: 'Free', path: '/vendor/inventory' },
    { id: 'orders', label: 'Order Manifest', icon: ShoppingCart, minTier: 'Free', path: '/vendor/orders' },
    { id: 'notifications', label: 'Notifications', icon: Bell, minTier: 'Free', path: '/vendor/notifications' },
    { id: 'exposure', label: 'Social Exposure', icon: Share2, minTier: 'Starter', path: '/vendor/exposure' },
    { id: 'influencers', label: 'Influencer Hub', icon: Megaphone, minTier: 'Starter', path: '/vendor/influencers' },
    { id: 'email-marketing', label: 'Email Campaigns', icon: Mail, minTier: 'Growth', path: '/vendor/email-marketing' },
    { id: 'analytics', label: 'Intelligence', icon: BrainCircuit, minTier: 'Starter', path: '/vendor/intelligence' },
    { id: 'marketing', label: 'Marketing Hub', icon: Tag, minTier: 'Growth', path: '/vendor/marketing' },
    { id: 'wallet', label: 'Capital Ledger', icon: Wallet, minTier: 'Free', path: '/vendor/wallet' },
    { id: 'settings', label: 'Workshop Config', icon: Settings, minTier: 'Free', path: '/vendor/settings' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-white rounded-4xl shadow-sm border border-jozi-forest/5 p-6 grow space-y-8 text-left">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-jozi-forest/5 shadow-sm shrink-0">
            <img src={vendor.logo} className="w-full h-full object-cover" alt={vendor.name} />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-jozi-forest text-sm leading-tight truncate">{vendor.name}</h3>
            <p className="text-[9px] font-black text-jozi-gold uppercase tracking-widest mt-1">{vendor.role === Role.ADMIN ? 'Platform Steward' : 'Certified Artisan'}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isLocked = TIER_WEIGHT[vendor.tier] < TIER_WEIGHT[item.minTier];
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={isLocked ? '#' : item.path}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all group ${
                  isActive
                    ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/10'
                    : isLocked
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-jozi-gold' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {isLocked && <Lock className="w-3 h-3 opacity-40" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-8 bg-[#FFF9E5] rounded-4xl border border-[#FFECB3] space-y-4 text-left relative overflow-hidden shrink-0">
        <AlertTriangle className="absolute -top-2 -right-2 w-16 h-16 text-[#B38F00] opacity-5" />
        <div className="flex items-center space-x-3 text-[#B38F00]">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Stock Alert</span>
        </div>
        <p className="text-xs font-medium text-[#7A6100]">
          You have <span className="font-black">2 items</span> with critical stock levels.
        </p>
        <button className="text-[10px] font-black text-jozi-gold uppercase tracking-widest hover:text-jozi-forest transition-colors flex items-center">
          Audit Vault <ChevronRight className="ml-1 w-3 h-3" />
        </button>
      </div>

      <button className="w-full flex items-center space-x-4 px-8 py-4 rounded-2xl font-black text-sm text-rose-400 hover:bg-rose-50 transition-all shrink-0">
        <LogOut className="w-5 h-5" />
        <span>Exit Hub</span>
      </button>
    </div>
  );
};

export default VendorSidebar;
