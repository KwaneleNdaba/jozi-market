'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Gamepad2, 
  Store, 
  Heart,
  Tag,
  ChevronDown,
  ArrowRight,
  Sparkles,
  MessageSquare,
  LogOut,
  Settings
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { MARKET_CATEGORIES } from '../data/mockData';
import { getAllCategoriesAction } from '../actions/category/index';
import { ICategory, ICategoryWithSubcategories } from '@/interfaces/category/category';
import { decodeAccessToken } from '@/lib/ecryptUser';
import { IDecodedJWT } from '@/interfaces/auth/auth';
import Cookies from 'universal-cookie';

interface CategoryGroup {
  name: string;
  slug: string;
  subcategories: string[];
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryGroup[]>(MARKET_CATEGORIES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IDecodedJWT | null>(null);
  const { totalItems, setIsCartOpen } = useCart();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const decodedUser = decodeAccessToken();
        if (decodedUser) {
          setIsLoggedIn(true);
          setUser(decodedUser);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('[Header] Error checking auth:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
    // Check auth on mount and periodically (every 30 seconds)
    const interval = setInterval(checkAuth, 30000);
    
    // Also check on route changes
    const handleRouteChange = () => {
      checkAuth();
    };
    
    // Listen for storage changes (when token is set/removed in other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesAction('Active');
        
        console.log('[Header] Categories response:', response);
        
        if (!response.error && response.data && response.data.length > 0) {
          // Transform backend categories into the format expected by Header
          // Backend returns categories with nested subcategories array
          const transformedCategories: CategoryGroup[] = response.data
            .filter(cat => !cat.categoryId || cat.categoryId === null) // Only top-level categories
            .map(category => {
              // Use the subcategories array if it exists, otherwise empty array
              const categoryWithSubs = category as ICategoryWithSubcategories;
              const categorySubcategories = categoryWithSubs.subcategories 
                ? categoryWithSubs.subcategories.map((sub: ICategory) => sub.name)
                : [];
              
              console.log(`[Header] Category "${category.name}" has ${categorySubcategories.length} subcategories:`, categorySubcategories);
              
              return {
                name: category.name,
                slug: category.name.toLowerCase().replace(/\s+/g, '-'),
                subcategories: categorySubcategories,
              };
            });
          
          console.log('[Header] Transformed categories:', transformedCategories);
          
          if (transformedCategories.length > 0) {
            setCategories(transformedCategories);
          } else {
            console.warn('[Header] No categories transformed, keeping mock data');
          }
        } else {
          console.warn('[Header] No categories data received, keeping mock data');
        }
      } catch (error) {
        console.error('[Header] Error fetching categories:', error);
        // Keep using mock data on error
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    // Clear cookies
    const cookieInstance = new Cookies();
    cookieInstance.remove('userToken', { 
      path: '/',
      secure: true,
      sameSite: 'lax'
    });
    
    // Reset state
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    
    // Redirect to home
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'Shop', path: '/marketplace', type: 'dropdown' },
    { label: 'Vendors', path: '/vendors', icon: <User className="w-4 h-4 mr-1" /> },
    { label: 'Deals', path: '/deals', icon: <Tag className="w-4 h-4 mr-1" /> },
    { label: 'Discussions', path: '/discussions', icon: <MessageSquare className="w-4 h-4 mr-1" /> },
    { label: 'Play & Earn', path: '/games', icon: <Gamepad2 className="w-4 h-4 mr-1" /> },
  ];

  const handleCategoryClick = (cat: string, sub?: string) => {
    let url = `/shop?category=${encodeURIComponent(cat)}`;
    if (sub) url += `&subcategory=${encodeURIComponent(sub)}`;
    router.push(url);
    setIsShopDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-jozi-cream/80 backdrop-blur-md border-b border-jozi-forest/10">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Logo - Points to Root (Landing Page) */}
        <Link href="/" className="flex items-center -ml-4 lg:-ml-2">
          <Logo className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <div 
              key={link.label} 
              className="relative py-4 group px-1"
              onMouseEnter={() => link.type === 'dropdown' && setIsShopDropdownOpen(true)}
              onMouseLeave={() => link.type === 'dropdown' && setIsShopDropdownOpen(false)}
            >
              <Link 
                href={link.path} 
                className="text-jozi-forest font-black text-xs uppercase tracking-widest hover:text-jozi-gold transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {link.icon}
                <span>{link.label}</span>
                {link.type === 'dropdown' && <ChevronDown className={`ml-0.5 w-3.5 h-3.5 transition-transform ${isShopDropdownOpen ? 'rotate-180' : ''}`} />}
              </Link>

              {/* Mega Menu */}
              {link.type === 'dropdown' && (
                <AnimatePresence>
                  {isShopDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-white rounded-4xl shadow-2xl border border-jozi-forest/5 p-8 z-50 overflow-hidden mt-1"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-left">
                        <Store className="w-64 h-64 text-jozi-forest" />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-8 relative z-10 text-left">
                        <div className="col-span-1 space-y-4">
                          <div className="bg-jozi-cream p-6 rounded-3xl space-y-3">
                             <div className="w-8 h-8 bg-jozi-gold rounded-xl flex items-center justify-center text-jozi-forest">
                                <Sparkles className="w-4 h-4" />
                             </div>
                             <h4 className="text-lg font-black text-jozi-forest leading-tight">Artisan <br />Showcase</h4>
                             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Discover weekly drops curated by Joburg experts.</p>
                             <Link href="/marketplace" className="inline-flex items-center text-[9px] font-black uppercase text-jozi-gold hover:text-jozi-forest transition-colors">
                               Browse Feed <ArrowRight className="ml-1 w-2.5 h-2.5" />
                             </Link>
                          </div>
                        </div>

                        <div className="col-span-3 grid grid-cols-3 gap-6">
                          {categories.map((cat) => (
                            <div key={cat.name} className="space-y-3">
                              <button 
                                onClick={() => handleCategoryClick(cat.name)}
                                className="text-[9px] font-black text-jozi-gold uppercase tracking-[0.3em] hover:text-jozi-forest transition-colors block text-left"
                              >
                                {cat.name}
                              </button>
                              <div className="space-y-1.5">
                                {cat.subcategories.map(sub => (
                                  <button
                                    key={sub}
                                    onClick={() => handleCategoryClick(cat.name, sub)}
                                    className="block text-xs font-bold text-gray-400 hover:text-jozi-forest transition-colors text-left w-full"
                                  >
                                    {sub}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-1.5 md:space-x-3 lg:space-x-4">
          {!isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4 mr-1 lg:mr-2 text-left">
              <Link href="/signin" className="text-[10px] font-black uppercase tracking-widest text-jozi-forest hover:text-jozi-gold transition-colors whitespace-nowrap">
                Sign In
              </Link>
              <Link href="/signup" className="bg-jozi-gold/10 text-jozi-gold border border-jozi-gold/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all whitespace-nowrap">
                Join Jozi
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4 mr-1 lg:mr-2 text-left">
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center space-x-2 p-1.5 hover:bg-jozi-forest/5 rounded-full text-jozi-forest transition-colors">
                  <div className="w-8 h-8 bg-jozi-gold/10 rounded-full flex items-center justify-center border border-jozi-gold/20">
                    <User className="w-4 h-4 text-jozi-forest" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-jozi-forest">
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-jozi-forest/5 p-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-jozi-forest/5">
                        <p className="text-xs font-black text-jozi-forest uppercase tracking-widest">
                          {user?.fullName || 'User'}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link 
                          href="/profile" 
                          className="flex items-center space-x-3 px-4 py-2 text-sm font-bold text-jozi-forest hover:bg-jozi-cream rounded-xl transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link 
                          href="/profile?tab=settings" 
                          className="flex items-center space-x-3 px-4 py-2 text-sm font-bold text-jozi-forest hover:bg-jozi-cream rounded-xl transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        {user?.role?.toLowerCase() === 'vendor' && (
                          <Link 
                            href="/vendor/dashboard" 
                            className="flex items-center space-x-3 px-4 py-2 text-sm font-bold text-jozi-forest hover:bg-jozi-cream rounded-xl transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Store className="w-4 h-4" />
                            <span>Vendor Dashboard</span>
                          </Link>
                        )}
                        {user?.role?.toLowerCase() === 'admin' && (
                          <Link 
                            href="/admin/dashboard" 
                            className="flex items-center space-x-3 px-4 py-2 text-sm font-bold text-jozi-forest hover:bg-jozi-cream rounded-xl transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-1.5 lg:space-x-2">
            <Link href="/profile?tab=wishlist" className="p-1.5 hover:bg-jozi-forest/5 rounded-full text-jozi-forest transition-colors">
              <Heart className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:bg-jozi-forest/5 rounded-full text-jozi-forest transition-colors relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-jozi-gold text-jozi-forest text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-jozi-cream shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          
          <Link href="/vendor/pricing" className="hidden lg:flex items-center bg-jozi-forest text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-lg shadow-jozi-forest/10 ml-1 whitespace-nowrap">
            Sell
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-jozi-forest"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-jozi-forest/10 overflow-y-auto max-h-[85vh] text-left"
          >
            <div className="px-6 py-8 space-y-6">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/signin" 
                    className="flex items-center justify-center bg-jozi-cream border border-jozi-forest/10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-jozi-forest"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex items-center justify-center bg-jozi-gold text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-jozi-gold/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Jozi
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-jozi-cream p-4 rounded-2xl border border-jozi-forest/10">
                    <p className="text-sm font-black text-jozi-forest uppercase tracking-widest">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{user?.email}</p>
                  </div>
                  <Link 
                    href="/profile" 
                    className="flex items-center justify-between bg-jozi-cream border border-jozi-forest/10 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-widest text-jozi-forest"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>My Profile</span>
                    <User className="w-4 h-4" />
                  </Link>
                  {user?.role?.toLowerCase() === 'vendor' && (
                    <Link 
                      href="/vendor/dashboard" 
                      className="flex items-center justify-between bg-jozi-cream border border-jozi-forest/10 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-widest text-jozi-forest"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Vendor Dashboard</span>
                      <Store className="w-4 h-4" />
                    </Link>
                  )}
                  {user?.role?.toLowerCase() === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center justify-between bg-jozi-cream border border-jozi-forest/10 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-widest text-jozi-forest"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Admin Dashboard</span>
                      <Settings className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between bg-red-50 border border-red-200 py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-1">Main Menu</p>
                <div className="space-y-1">
                  <div className="border-b border-jozi-forest/5">
                    <button 
                      onClick={() => setMobileExpandedCat(mobileExpandedCat === 'shop' ? null : 'shop')}
                      className="w-full flex items-center justify-between py-4 text-lg font-black text-jozi-forest"
                    >
                      <span>MARKETPLACE</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileExpandedCat === 'shop' ? 'rotate-180 text-jozi-gold' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {mobileExpandedCat === 'shop' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pb-4 space-y-4"
                        >
                          {categories.map(cat => (
                            <div key={cat.name} className="pl-4 space-y-3">
                              <button 
                                onClick={() => handleCategoryClick(cat.name)}
                                className="text-sm font-black text-jozi-gold uppercase tracking-widest block"
                              >
                                {cat.name}
                              </button>
                              <div className="grid grid-cols-2 gap-2 pl-2">
                                {cat.subcategories.map(sub => (
                                  <button
                                    key={sub}
                                    onClick={() => handleCategoryClick(cat.name, sub)}
                                    className="text-xs font-bold text-gray-400 hover:text-jozi-forest text-left py-1"
                                  >
                                    {sub}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {navLinks.filter(l => l.type !== 'dropdown').map((link) => (
                    <Link 
                      key={link.label} 
                      href={link.path} 
                      className="block text-lg font-black text-jozi-forest py-4 border-b border-jozi-forest/5 uppercase tracking-tighter"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                href="/vendor/pricing" 
                className="block bg-jozi-forest text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-jozi-forest/20"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Selling
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
