'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Store, UserPlus, Share2, Megaphone, 
  Globe, Gamepad2, Gift, Tag, Monitor, Bell, BarChart3, 
  ShoppingCart, Layers, Grid, CreditCard, ShieldAlert, 
  LogOut, X, Menu, ChevronRight, ListTree, Trophy
} from 'lucide-react';
import Logo from '../Logo';

interface AdminSidebarProps {
  onClose?: () => void;
}

const NAV_ITEMS = [
  // { group: 'Intelligence', items: [
  //   { id: 'overview', label: 'Market Overview', icon: LayoutDashboard, path: '/admin/overview' },
  //   { id: 'stats', label: 'Platform Analytics', icon: Globe, path: '/admin/platform-analytics' },
  //   { id: 'vendor-stats', label: 'Artisan Insights', icon: BarChart3, path: '/admin/analytics' },
  // ]},
  { group: 'Governance', items: [
    { id: 'onboarding', label: 'Vendor Onboarding', icon: UserPlus, path: '/admin/onboarding' },
    // { id: 'influencers', label: 'Collab Approvals', icon: Megaphone, path: '/admin/influencer-approvals' },
    { id: 'orders', label: 'Order Manifests', icon: ShoppingCart, path: '/admin/orders' },
    // { id: 'payouts', label: 'Payout Ledger', icon: CreditCard, path: '/admin/vendors/payouts' },
  ]},
  { group: 'Growth', items: [
    { id: 'points-tiers', label: 'Points & Tiers', icon: Trophy, path: '/admin/points-config' },
    // { id: 'exposure', label: 'Social Exposure', icon: Share2, path: '/admin/social-exposure' },
    // { id: 'gamification', label: 'Economy Logic', icon: Gamepad2, path: '/admin/gamification' },
    // { id: 'rewards', label: 'Rewards Catalog', icon: Gift, path: '/admin/rewards' },
    // { id: 'vouchers', label: 'Voucher Hub', icon: Tag, path: '/admin/vouchers' },
  ]},
  // { group: 'Infrastructure', items: [
  //   { id: 'categories', label: 'Category Orchestrator', icon: ListTree, path: '/admin/categories' },
  //   { id: 'features', label: 'Capability Config', icon: Layers, path: '/admin/features' },
  //   { id: 'matrix', label: 'Plan Matrix', icon: Grid, path: '/admin/plan-matrix' },
  //   { id: 'plans', label: 'Tiers & Pricing', icon: CreditCard, path: '/admin/plans' },
  //   { id: 'notifications', label: 'Global Alerts', icon: Bell, path: '/admin/notifications' },
  //   { id: 'content', label: 'CMS Orchestrator', icon: Monitor, path: '/admin/content' },
  // ]}
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const pathname = usePathname();

  return (
    <aside className="w-full h-full flex flex-col bg-jozi-dark text-white overflow-y-auto custom-scrollbar">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/10 shrink-0 flex items-center justify-between">
        <Link href="/admin/overview" className="block">
          <Logo className="h-16 w-auto" variant="white" />
        </Link>
        <button 
          onClick={onClose} 
          className="lg:hidden p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="grow p-5 space-y-8 pt-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="space-y-2.5">
            <p className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-wider">{group.group}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={onClose}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-semibold text-sm transition-all group ${
                      isActive
                        ? 'bg-jozi-gold text-jozi-dark shadow-md'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 transition-transform ${isActive ? 'text-jozi-dark' : 'text-jozi-gold/70 group-hover:text-jozi-gold'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-jozi-dark/60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-5 border-t border-white/10 mt-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 mb-4 border border-white/10">
          <div className="w-10 h-10 rounded-lg bg-jozi-gold flex items-center justify-center text-jozi-dark font-bold text-sm shadow-sm">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-white truncate">Platform Steward</p>
            <p className="text-[10px] font-semibold text-jozi-gold uppercase tracking-wide leading-none mt-1">Super Admin</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
