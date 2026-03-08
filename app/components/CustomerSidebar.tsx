'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  Star, 
  Zap, 
  LogOut,
  Award,
  Gamepad2,
  Bell
} from 'lucide-react';

interface CustomerSidebarProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    level: number;
    points: number;
  };
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ user }) => {
  const pathname = usePathname();

  const menuItems = [
    { id: 'overview', label: 'My Dashboard', icon: User, path: '/profile' },
    { id: 'orders', label: 'Order History', icon: Package, path: '/orders' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    { id: 'rewards', label: 'My Rewards', icon: Star, path: '/claimed-rewards' },
    { id: 'games', label: 'Play & Earn', icon: Gamepad2, path: '/games' },
    { id: 'referrals', label: 'Refer a Neighbor', icon: Zap, path: '/referrals' },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, path: '/wishlist' },
    { id: 'settings', label: 'Account Settings', icon: Settings, path: '/settings' },
  ];

  const checkActive = (item: any) => {
    return pathname === item.path;
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4 lg:space-y-6 lg:sticky lg:top-28">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-8 border border-jozi-forest/5 shadow-soft text-left">
        <div className="flex flex-col items-center text-center space-y-3 lg:space-y-4 mb-4 lg:mb-8">
          <div className="relative">
            <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-2xl lg:rounded-[2rem] overflow-hidden border-4 border-jozi-gold/20 shadow-xl">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1.5 lg:-bottom-2 -right-1.5 lg:-right-2 bg-jozi-forest text-white p-1.5 lg:p-2 rounded-lg lg:rounded-xl border-2 lg:border-4 border-white">
              <Award className="w-3 lg:w-4 h-3 lg:h-4 text-jozi-gold" />
            </div>
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-black text-jozi-forest">{user.name}</h2>
            <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">{user.email}</p>
          </div>
          <div className="inline-flex items-center bg-jozi-forest text-white px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
            Level {user.level} Connector
          </div>
        </div>

        <nav className="space-y-0.5 lg:space-y-1">
          {menuItems.map((item) => {
            const isActive = checkActive(item);
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center space-x-3 lg:space-x-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/10' 
                    : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest active:scale-98'
                }`}
              >
                <item.icon className="w-4 lg:w-5 h-4 lg:h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button className="w-full flex items-center space-x-3 lg:space-x-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm text-red-400 hover:bg-red-50 transition-all mt-2 lg:mt-4 min-h-[44px]">
            <LogOut className="w-4 lg:w-5 h-4 lg:h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Points Status */}
      <div className="bg-jozi-dark p-4 lg:p-8 rounded-2xl lg:rounded-[2.5rem] text-white space-y-3 lg:space-y-4 shadow-2xl relative overflow-hidden group text-left">
        <Zap className="absolute -bottom-4 -right-4 w-20 lg:w-24 h-20 lg:h-24 text-jozi-gold opacity-10 group-hover:scale-125 transition-transform duration-1000" />
        <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Neighbors Points</p>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-3xl lg:text-4xl font-black">{user.points.toLocaleString()}</h3>
          <span className="text-xs font-bold text-jozi-gold">PTS</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-jozi-gold w-[75%]" />
        </div>
        <p className="text-[10px] text-white/40 font-medium">R850 total lifetime savings</p>
        <Link href="/rewards" className="text-xs font-black text-jozi-gold hover:underline block pt-2 min-h-[44px] flex items-center">Rewards Boutique &rarr;</Link>
      </div>
    </aside>
  );
};

export default CustomerSidebar;