'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Add missing AlertCircle and ChevronRight imports
import { 
  LayoutDashboard, Megaphone, BarChart3, Wallet, 
  Settings, LogOut, Bell, Award, Sparkles,
  AlertCircle, ChevronRight
} from 'lucide-react';

interface InfluencerSidebarProps {
  profile: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const InfluencerSidebar: React.FC<InfluencerSidebarProps> = ({ profile, activeTab, onTabChange }) => {
  const router = useRouter();
  
  const menuItems = [
    { id: 'overview', label: 'Impact Board', icon: LayoutDashboard },
    { id: 'campaigns', label: 'My Manifest', icon: Megaphone },
    { id: 'analytics', label: 'Social Velocity', icon: BarChart3 },
    { id: 'wallet', label: 'Commission Ledger', icon: Wallet },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-8">
      {/* Mini Profile Card */}
      <div className="bg-jozi-dark rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-jozi-gold shadow-xl group-hover:scale-105 transition-transform duration-500">
              <img src={profile.avatar} className="w-full h-full object-cover" alt={profile.name} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-jozi-forest text-white p-2 rounded-xl border-4 border-jozi-dark">
              <Sparkles className="w-4 h-4 text-jozi-gold fill-current" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">{profile.name}</h2>
            <p className="text-xs font-bold text-jozi-gold uppercase tracking-[0.2em]">{profile.handle}</p>
          </div>
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
            Vitality Score: {profile.score}
          </div>
        </div>
        
        <Award className="absolute -bottom-10 -left-10 w-48 h-48 opacity-5 text-white pointer-events-none" />
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-[2.5rem] shadow-soft border border-jozi-forest/5 p-6 space-y-2 text-left">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-sm transition-all group ${
              activeTab === item.id 
                ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/10' 
                : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
            }`}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-jozi-gold' : ''}`} />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div className="h-[1px] bg-gray-50 my-6 mx-4" />

        <Link href="/influencer/settings" className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-sm text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest transition-all">
          <Settings className="w-5 h-5 shrink-0" />
          <span>Config</span>
        </Link>
        <button onClick={() => router.push('/signin')} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black text-sm text-rose-400 hover:bg-rose-50 transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Exit Hub</span>
        </button>
      </div>

      {/* Support Card */}
      <div className="p-8 bg-jozi-cream rounded-[2.5rem] border border-jozi-forest/5 text-left relative overflow-hidden">
        <AlertCircle className="absolute -top-2 -right-2 w-16 h-16 text-jozi-forest opacity-5" />
        <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold mb-2">Creator Support</p>
        <p className="text-sm font-medium text-jozi-forest leading-relaxed mb-4">Need help with a campaign proof or payout?</p>
        <button className="text-[10px] font-black text-jozi-forest uppercase tracking-widest hover:text-jozi-gold transition-colors flex items-center">
          Open Support Chat <ChevronRight className="ml-1 w-3 h-3" />
        </button>
      </div>
    </aside>
  );
};

export default InfluencerSidebar;