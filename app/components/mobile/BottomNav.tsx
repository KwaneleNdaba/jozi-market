'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/app/contexts/CartContext';

/**
 * BottomNav - Mobile-only bottom navigation bar
 * 
 * DESIGN PRINCIPLES:
 * - Fixed bottom positioning with safe area padding
 * - Touch-friendly 44px minimum tap targets
 * - Active state with color + icon animation
 * - Badge indicator for cart items
 * - Blur backdrop for premium feel
 * 
 * TAILWIND CLASSES:
 * - fixed bottom-0: Stick to bottom of viewport
 * - safe-area-inset-bottom: iOS safe area support
 * - backdrop-blur-xl: Glass morphism effect
 * - border-t: Subtle top border separator
 * - z-50: Above most content, below modals
 */

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { 
      label: 'Home', 
      icon: Home, 
      href: '/',
      activePattern: /^\/$/
    },
    { 
      label: 'Shop', 
      icon: ShoppingBag, 
      href: '/shop',
      activePattern: /^\/shop/
    },
    { 
      label: 'Deals', 
      icon: Sparkles, 
      href: '/deals',
      activePattern: /^\/deals/
    },
    { 
      label: 'Cart', 
      icon: ShoppingCart, 
      href: '#',
      activePattern: null, // Cart is handled by drawer
      isCart: true
    },
    { 
      label: 'Profile', 
      icon: User, 
      href: '/profile',
      activePattern: /^\/(profile|orders|rewards|wishlist|settings|notifications)/
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (!item.activePattern) return false;
    return item.activePattern.test(pathname);
  };

  return (
    <>
      {/* Bottom spacing to prevent content from being hidden behind nav */}
      <div className="h-20 lg:hidden" />
      
      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-jozi-forest/10 z-50 lg:hidden pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.isCart) {
                    e.preventDefault();
                    // Dispatch cart drawer open event
                    window.dispatchEvent(new CustomEvent('openCart'));
                  }
                }}
                className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-3 group"
              >
                {/* Icon Container */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 ${
                    active 
                      ? 'bg-jozi-forest text-white shadow-lg shadow-jozi-forest/20' 
                      : 'text-gray-400 group-hover:text-jozi-forest'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                  
                  {/* Cart Badge */}
                  {item.isCart && totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white"
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </motion.div>

                {/* Label */}
                <span className={`text-[10px] font-bold mt-0.5 transition-colors ${
                  active ? 'text-jozi-forest' : 'text-gray-400 group-hover:text-jozi-forest'
                }`}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-jozi-forest rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
