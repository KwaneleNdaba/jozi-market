'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  ShoppingBag,
  Tag,
  Heart,
  RefreshCw,
  Trophy,
  Users,
  MapPin,
  Crown,
  Smartphone,
  Store,
  BadgeCheck,
  Clock,
  Gift,
  Coins,
  Ticket,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { products, vendors } from '../../data/mockData';

// --- MOCK DATA ---

const HERO_SLIDES = [
  {
    id: 1,
    pretitle: "The Great Jozi Sale",
    title: "Support Local.\nWin Global.",
    subtitle: "Shop from over 500+ independent JHB vendors. Every purchase earns you entries into our Monthly Car Giveaway.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1600",
    cta: "Start Shopping",
    link: "/shop",
    align: "left"
  },
  {
    id: 2,
    pretitle: "Referral Season",
    title: "Invite Friends.\nGet R5000.",
    subtitle: "Top referrer this week wins a Samsung Galaxy S24. Start climbing the leaderboard today.",
    image: "https://images.unsplash.com/photo-1531303435785-3853fb435c7d?auto=format&fit=crop&q=80&w=1600",
    cta: "Join The Program",
    link: "/referrals",
    align: "center"
  }
];

const CATEGORIES = [
  { name: "Tech", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { name: "Fashion", icon: Tag, color: "bg-purple-100 text-purple-600" },
  { name: "Home", icon: ShoppingBag, color: "bg-orange-100 text-orange-600" },
  { name: "Beauty", icon: Heart, color: "bg-rose-100 text-rose-600" },
  { name: "Art", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  { name: "Kitchen", icon: RefreshCw, color: "bg-emerald-100 text-emerald-600" },
];

const REGIONS = [
  { name: "Maboneng", vendors: 120, image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&q=80&w=400" },
  { name: "Soweto", vendors: 85, image: "https://images.unsplash.com/photo-1547922137-f0c2394e3573?auto=format&fit=crop&q=80&w=400" },
  { name: "Sandton", vendors: 200, image: "https://images.unsplash.com/photo-1580913428706-c311ab527eb3?auto=format&fit=crop&q=80&w=400" },
  { name: "Braamfontein", vendors: 94, image: "https://images.unsplash.com/photo-1534239691318-7d377b24eb62?auto=format&fit=crop&q=80&w=400" },
];

const LEADERBOARD = [
  { name: "Kwanele N.", points: 15400, rank: 1, avatar: "https://i.pravatar.cc/150?u=1" },
  { name: "Sarah J.", points: 12200, rank: 2, avatar: "https://i.pravatar.cc/150?u=2" },
  { name: "Mike T.", points: 9850, rank: 3, avatar: "https://i.pravatar.cc/150?u=3" },
];

const FEATURED_VENDORS = [
  {
    id: 101,
    name: "Zulu Beadwork Legacy",
    location: "Maboneng Precinct",
    rating: 4.9,
    reviews: 124,
    banner: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
    badges: ["Top Rated", "Verified"],
    previewProducts: [
      "https://images.unsplash.com/photo-1606166325683-e6deb697d301?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=200"
    ]
  },
  {
    id: 102,
    name: "Urban Ceramics JHB",
    location: "Rosebank",
    rating: 4.8,
    reviews: 89,
    banner: "https://images.unsplash.com/photo-1459416417751-936c5e691823?auto=format&fit=crop&q=80&w=800",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    badges: ["Fast Shipper"],
    previewProducts: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1578749556935-ef38ab58e585?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=200"
    ]
  },
  {
    id: 103,
    name: "Ubuntu Leather Works",
    location: "Soweto",
    rating: 5.0,
    reviews: 210,
    banner: "https://images.unsplash.com/photo-1473187983305-f615310e7daa?auto=format&fit=crop&q=80&w=800",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    badges: ["Handmade", "Verified"],
    previewProducts: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=200"
    ]
  }
];

const NEW_VENDORS = [
  { id: 201, name: "AfroChic Decor", cat: "Home", date: "2 days ago", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200" },
  { id: 202, name: "Jozi Prints", cat: "Art", date: "5 days ago", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200" },
  { id: 203, name: "Pure Skincare", cat: "Beauty", date: "1 week ago", img: "https://images.unsplash.com/photo-1556228720-19de77d60e6f?auto=format&fit=crop&q=80&w=200" },
  { id: 204, name: "TechHub SA", cat: "Gadgets", date: "1 week ago", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=200" },
];

const REWARDS = [
  { points: 500, title: "Free Delivery", icon: Truck, color: "text-blue-400" },
  { points: 1000, title: "R100 Voucher", icon: Ticket, color: "text-jozi-gold" },
  { points: 5000, title: "Mystery Box", icon: Gift, color: "text-purple-400" },
];

// --- HELPER COMPONENTS ---

const ProductSwimlane = ({ title, subtitle, items, link }: { title: string, subtitle?: string, items: any[], link?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 border-b border-gray-100 last:border-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-jozi-forest tracking-tight">{title}</h3>
            {subtitle && <p className="text-gray-500 text-sm font-medium mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4">
            {link && (
              <Link href={link} className="hidden md:flex items-center text-sm font-bold text-jozi-gold hover:text-jozi-forest transition-colors">
                See All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            )}
            <div className="flex gap-1">
              <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[250px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
          <Link href={link || '/shop'} className="min-w-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-jozi-gold hover:bg-white transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-jozi-forest" />
            </div>
            <span className="font-bold text-jozi-forest text-sm">View All</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 55 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = useMemo(() => products.slice(0, 6), []);
  const techDeals = useMemo(() => products.slice(2, 7), []);
  const under500 = useMemo(() => products.filter(p => p.price < 500).concat(products.slice(0, 3)), []);
  const flashDeals = useMemo(() => products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4), []);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[65vh] md:h-[80vh] min-h-[500px] w-full overflow-hidden bg-jozi-forest group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10" />
            <img 
              src={HERO_SLIDES[currentSlide].image} 
              alt="Hero" 
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[10s]" 
            />
            
            <div className="absolute inset-0 z-20 container mx-auto px-4 h-full flex flex-col justify-center">
              <div className={`max-w-2xl ${
                HERO_SLIDES[currentSlide].align === 'center' ? 'mx-auto text-center' : 'text-left'
              }`}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-flex items-center space-x-2 bg-jozi-gold text-jozi-forest px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                >
                  <Crown className="w-3 h-3" />
                  <span>{HERO_SLIDES[currentSlide].pretitle}</span>
                </motion.div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6 whitespace-pre-line">
                  {HERO_SLIDES[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed mb-8">
                  {HERO_SLIDES[currentSlide].subtitle}
                </p>
                <div className={`flex gap-4 ${HERO_SLIDES[currentSlide].align === 'center' ? 'justify-center' : 'justify-start'}`}>
                  <Link href={HERO_SLIDES[currentSlide].link} className="bg-white text-jozi-forest px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all shadow-xl">
                    {HERO_SLIDES[currentSlide].cta}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-jozi-gold' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-white border-b border-gray-100 shadow-sm relative z-20 -mt-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-between gap-6 md:gap-0 divide-x-0 md:divide-x divide-gray-100">
            {[
              { icon: Truck, title: "Fast Delivery", sub: "Free over R1000" },
              { icon: ShieldCheck, title: "Buyer Protection", sub: "Verified Vendors" },
              { icon: Trophy, title: "Win Prizes", sub: "Weekly Draws" },
              { icon: RefreshCw, title: "Easy Returns", sub: "7 Day Exchange" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 flex-1 justify-center md:justify-start">
                <item.icon className="w-6 h-6 text-jozi-gold" />
                <div>
                  <p className="font-bold text-jozi-forest text-sm leading-tight">{item.title}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat, i) => (
            <Link href={`/shop/category/${cat.name.toLowerCase()}`} key={i} className="flex flex-col items-center min-w-[80px] gap-3 group">
              <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-gray-600 group-hover:text-jozi-forest">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. THE JOZI JACKPOT (REFERRAL) */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-soft border border-jozi-forest/5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-jozi-gold/5 rounded-full blur-[120px] -mr-20 -mt-20" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center bg-red-50 border border-red-100 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-500">
                  <Trophy className="w-3 h-3 mr-2" />
                  Weekly Referral Challenge
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-jozi-forest">
                  REFER FRIENDS.<br />
                  <span className="text-jozi-gold">WIN R5,000.</span>
                </h2>
                <p className="text-lg text-gray-500 font-medium max-w-md">
                  Every friend you invite earns you 500 points. The top referrer this week walks away with cash prizes.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/referral" className="bg-jozi-forest text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-lg flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Get Invite Code
                  </Link>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="bg-white/50 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h3 className="font-black text-xl uppercase tracking-tight text-jozi-forest">Live Leaderboard</h3>
                    <div className="flex items-center text-xs font-bold text-jozi-gold">
                      <Clock className="w-3 h-3 mr-1" /> Ends Sunday
                    </div>
                  </div>
                  <div className="space-y-4">
                    {LEADERBOARD.map((user, i) => (
                      <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${i === 0 ? 'bg-jozi-gold text-jozi-forest shadow-md' : 'bg-white border border-gray-100'}`}>
                        <div className="flex items-center gap-4">
                          <span className={`font-black text-lg w-6 ${i === 0 ? 'text-jozi-forest' : 'text-gray-400'}`}>#{user.rank}</span>
                          <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt={user.name} />
                          <span className={`font-bold ${i === 0 ? 'text-jozi-forest' : 'text-gray-600'}`}>{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-black">
                          <Zap className="w-4 h-4 fill-current" />
                          {user.points.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLASH DEALS */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-jozi-forest tracking-tight flex items-center gap-2">
                <Zap className="w-6 h-6 text-jozi-gold fill-current" />
                Flash Deals
              </h2>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                <span>Ends in:</span>
                <div className="flex gap-1 text-white text-xs">
                  <span className="bg-red-500 px-2 py-0.5 rounded">{timeLeft.hours}h</span>
                  <span className="bg-red-500 px-2 py-0.5 rounded">{timeLeft.minutes}m</span>
                  <span className="bg-red-500 px-2 py-0.5 rounded">{timeLeft.seconds}s</span>
                </div>
              </div>
            </div>
            <Link href="/deals" className="text-jozi-forest font-black uppercase text-xs tracking-widest hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashDeals.map((product) => (
               <ProductCard key={`flash-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED VENDORS */}
      <section className="py-16 bg-jozi-cream relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-jozi-gold font-bold uppercase tracking-[0.2em] text-xs">Marketplace Spotlight</span>
              <h2 className="text-4xl font-black text-jozi-forest tracking-tight mt-1">Featured Artisans</h2>
            </div>
            <Link href="/vendors" className="hidden md:flex items-center text-sm font-bold text-jozi-forest hover:text-jozi-gold transition-colors">
              Browse All Stores <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_VENDORS.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-3xl shadow-soft overflow-hidden group border border-gray-100 hover:border-jozi-gold/30 transition-all">
                <div className="h-32 bg-gray-200 relative">
                  <img src={vendor.banner} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {vendor.badges.map((badge, idx) => (
                      <span key={idx} className="bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full text-jozi-forest shadow-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="px-6 pb-6 relative">
                  <div className="flex justify-between items-end -mt-10 mb-4">
                    <img src={vendor.avatar} alt={vendor.name} className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover" />
                    <button className="bg-jozi-forest text-white p-2.5 rounded-xl hover:bg-jozi-gold transition-colors shadow-lg">
                      <Store className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-jozi-forest leading-tight mb-1">{vendor.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <MapPin className="w-3 h-3 mr-1" /> {vendor.location}
                    <span className="mx-2">•</span>
                    <Star className="w-3 h-3 text-jozi-gold fill-current mr-1" /> {vendor.rating} ({vendor.reviews})
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {vendor.previewProducts.map((prod, idx) => (
                      <div key={idx} className="aspect-square rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                        <img src={prod} alt="Product" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BEST SELLERS */}
      <ProductSwimlane 
        title="Best Sellers in Jozi" 
        subtitle="The most loved items this week based on local trends."
        items={bestSellers}
        link="/shop/best-sellers"
      />

      {/* 8. NEW ARRIVALS & VENDORS */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <BadgeCheck className="w-5 h-5 text-jozi-gold" />
                <h3 className="font-black text-lg text-jozi-forest uppercase tracking-tight">Fresh on the Block</h3>
              </div>
              <div className="space-y-4">
                {NEW_VENDORS.map((vendor) => (
                  <div key={vendor.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:border-jozi-gold/50 cursor-pointer transition-all">
                    <img src={vendor.img} className="w-10 h-10 rounded-lg object-cover" alt={vendor.name} />
                    <div className="grow">
                      <p className="font-bold text-jozi-forest text-sm leading-none">{vendor.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">{vendor.cat} • {vendor.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 border border-jozi-forest/10 text-jozi-forest font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-jozi-forest hover:text-white transition-colors">
                View All New Makers
              </button>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Just Landed</h3>
                 <Link href="/shop/new" className="text-xs font-bold text-gray-400 hover:text-jozi-forest uppercase tracking-widest">View All</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                 {products.slice(0, 5).map(p => (
                   <div key={p.id} className="min-w-[220px] snap-start">
                     <ProductCard product={p} />
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LOYALTY REWARDS SECTION (NEW) */}
      <section className="py-20 bg-jozi-forest text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-jozi-gold/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-jozi-gold/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest text-jozi-gold">
                <Crown className="w-3 h-3 mr-2" />
                The Neighbors Club
              </div>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9]">
                SHOP LOCAL.<br />
                <span className="text-jozi-gold">GET REWARDED.</span>
              </h2>
              <p className="text-lg text-gray-300 font-medium leading-relaxed">
                Turn your passion for artisan craft into exclusive perks. Earn 1 point for every R10 you spend and redeem them for free products, delivery vouchers, and more.
              </p>
              
              {/* Steps */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { title: "Shop", icon: ShoppingBag, desc: "Earn Points" },
                  { title: "Level Up", icon: TrendingUp, desc: "Unlock Tiers" },
                  { title: "Redeem", icon: Gift, desc: "Free Goods" },
                ].map((step, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                    <div className="w-10 h-10 mx-auto bg-jozi-gold rounded-full flex items-center justify-center text-jozi-forest mb-3 shadow-lg">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className="font-black text-sm uppercase tracking-wide">{step.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">{step.desc}</p>
                  </div>
                ))}
              </div>

              <button className="bg-white text-jozi-forest px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all shadow-xl mt-4">
                Start Earning Today
              </button>
            </div>

            {/* Right: Reward Cards Visualization */}
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                <div className="absolute inset-0 bg-jozi-gold/20 blur-3xl rounded-full" />
                <div className="relative grid gap-4">
                  {REWARDS.map((reward, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer group"
                    >
                      <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <reward.icon className={`w-8 h-8 ${reward.color}`} />
                      </div>
                      <div className="grow">
                        <h4 className="font-black text-xl">{reward.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="w-3 h-3 text-jozi-gold" />
                          <span className="text-xs font-bold text-jozi-gold uppercase tracking-widest">{reward.points} Points required</span>
                        </div>
                      </div>
                      <div className="bg-white text-jozi-forest w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Floating Card Decor */}
                  <div className="absolute -top-10 -right-10 bg-jozi-gold text-jozi-forest p-4 rounded-2xl rotate-12 shadow-2xl hidden md:block">
                    <p className="font-black text-xs uppercase tracking-widest">Bonus</p>
                    <p className="font-black text-2xl">+500 pts</p>
                    <p className="text-[10px] font-bold">On Sign Up</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. TECH DEALS */}
      <ProductSwimlane 
        title="Tech & Accessories" 
        subtitle="Locally sourced tech gear and handcrafted cases."
        items={techDeals}
        link="/shop/tech"
      />

      {/* 11. REGION EXPLORER */}
      <section className="py-16 bg-jozi-cream relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-jozi-gold font-bold uppercase tracking-[0.2em] text-xs">Discover The City</span>
            <h2 className="text-4xl font-black text-jozi-forest tracking-tight mt-2">Shop By Neighborhood</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGIONS.map((region, i) => (
              <div key={i} className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all">
                <img src={region.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={region.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-black">{region.name}</h3>
                  <div className="flex items-center text-xs font-bold text-jozi-gold mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {region.vendors} Active Vendors
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. BUDGET FINDS */}
      <ProductSwimlane 
        title="Pocket Friendly Finds" 
        subtitle="Curated treasures under R500."
        items={under500}
        link="/shop/budget"
      />

      {/* 13. JUST FOR YOU */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <h2 className="text-3xl font-black text-jozi-forest tracking-tight">Just For You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.slice(0, 10).map((product) => (
              <ProductCard key={`rec-${product.id}`} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <button className="px-12 py-4 border-2 border-jozi-forest text-jozi-forest rounded-full font-black text-sm uppercase tracking-widest hover:bg-jozi-forest hover:text-white transition-all">
              Load More
            </button>
          </div>
        </div>
      </section>

      {/* 14. FOOTER CTA */}
      <section className="bg-jozi-forest py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-4xl font-black text-white mb-6">Are you a Maker?</h2>
           <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">Join 500+ artisans selling on Jozi Market. Low fees, massive reach, and weekly payouts.</p>
           <Link href="/sell" className="inline-block bg-jozi-gold text-jozi-forest px-10 py-5 rounded-xl font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform">
             Open Your Shop
           </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;