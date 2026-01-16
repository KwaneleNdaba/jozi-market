
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Award,
  X,
  History,
  Flame,
  Store,
  ShoppingCart,
  Sparkles,
  Smartphone,
  Tag,
  Timer,
  Percent,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import ProductCard from '../../components/ProductCard';
import { products, vendors } from '../../data/mockData';

const ads = [
  {
    id: 1,
    title: "SCALE YOUR CRAFT.",
    subtitle: "Vendor Success Plans starting from R0. Transparent pricing designed to grow with your local business.",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200",
    artist: "Business Growth",
    cta: "See Pricing",
    link: "/vendor/pricing",
    badge: "Vendor Access"
  },
  {
    id: 2,
    title: "CINEMATIC PROMOTION",
    subtitle: "Watch the heritage, own the piece. Shop our featured Zulu Beadwork Legacy pieces with spring discounts.",
    image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=1200",
    artist: "Featured Promo",
    cta: "Shop the Look",
    link: "/shop",
    badge: "Promo Active"
  },
  {
    id: 3,
    title: "REFER & WIN BIG",
    subtitle: "Invite friends and unlock the 'Legend' path. Win a Samsung S24 Ultra and exclusive leather craft.",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1200",
    artist: "Rewards Hub",
    cta: "Join Program",
    link: "/referrals",
    badge: "Limited Campaign"
  }
];

const HomePage: React.FC = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const [trendingTab, setTrendingTab] = useState<'products' | 'stores'>('products');
  const [copiedCode, setCopiedCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 55 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const nextAd = () => setCurrentAd((prev) => (prev + 1) % ads.length);
  const prevAd = () => setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);

  const handleCopy = () => {
    navigator.clipboard.writeText('JOZI20');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Logic to find products with deals
  const flashDeals = useMemo(() => 
    products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4),
  []);

  const recentlyViewed = products.slice(1, 4); 
  const popularProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const popularVendors = [...vendors].sort((a, b) => b.rating - a.rating).slice(0, 3);

  const featuredVideoProduct = products.find(p => p.id === 'p4') || products[3];

  return (
    <div className="space-y-24 pb-24 bg-jozi-cream">
      {/* Hero Banner with Pricing & Promotions Focus */}
      <section className="relative h-[85vh] min-h-[650px] overflow-hidden bg-jozi-cream flex items-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 max-w-2xl">
            <motion.div 
              key={`badge-${currentAd}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center bg-jozi-forest/5 rounded-full px-4 py-2 border border-jozi-forest/10"
            >
              <Tag className="w-4 h-4 text-jozi-gold mr-2" />
              <span className="text-[10px] font-bold text-jozi-forest tracking-[0.3em] uppercase">{ads[currentAd].badge}</span>
            </motion.div>

            <div className="relative h-48 md:h-64 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentAd}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <h1 className="text-6xl md:text-8xl font-black text-jozi-forest leading-[0.9] tracking-tighter">
                    {ads[currentAd].title.split(' ').map((word, i) => (
                      <span key={i} className={i === 1 ? 'text-jozi-gold block' : 'block'}>
                        {word}
                      </span>
                    ))}
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p 
                key={`subtitle-${currentAd}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl text-gray-500 font-medium leading-relaxed"
              >
                {ads[currentAd].subtitle}
              </motion.p>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={ads[currentAd].link} className="bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center group shadow-xl shadow-jozi-forest/20 hover:scale-105 transition-all">
                {ads[currentAd].cta}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/deals" className="bg-white text-jozi-forest border border-jozi-forest/10 px-10 py-5 rounded-2xl font-bold text-lg flex items-center hover:bg-jozi-forest/5 transition-all shadow-sm">
                View All Deals
              </Link>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-6 pt-8">
              <div className="flex space-x-2">
                {ads.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentAd(i)}
                    className={`h-2 transition-all rounded-full ${currentAd === i ? 'w-12 bg-jozi-gold' : 'w-2 bg-jozi-forest/20'}`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <button onClick={prevAd} className="p-2 border border-jozi-forest/10 rounded-full hover:bg-jozi-forest hover:text-white transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextAd} className="p-2 border border-jozi-forest/10 rounded-full hover:bg-jozi-forest hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative h-full">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-jozi-gold/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-jozi-forest/5 rounded-full blur-[100px]" />

            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAd}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={ads[currentAd].image}
                    className="w-full h-full object-cover"
                    alt={ads[currentAd].title}
                  />
                  <div className="absolute bottom-10 left-10 right-10 bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-3xl text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-jozi-cream/70">Campaign Channel</p>
                        <p className="text-xl font-black">{ads[currentAd].artist}</p>
                      </div>
                      <Sparkles className="w-6 h-6 text-jozi-gold" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white p-10 rounded-[3rem] shadow-xl border border-jozi-forest/5">
          {[
            { icon: Truck, title: "Fast Local Shipping", sub: "1-3 Days Across GP" },
            { icon: ShieldCheck, title: "Secure Checkout", sub: "PayFast & Instant EFT" },
            { icon: Zap, title: "Loyalty Rewards", sub: "Points on every spend" },
            { icon: Star, title: "Vetted Vendors", sub: "Authentic craft only" }
          ].map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                <badge.icon className="w-7 h-7" />
              </div>
              <h4 className="font-bold">{badge.title}</h4>
              <p className="text-xs text-gray-500 italic">{badge.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLASH DEALS SECTION */}
      <section className="container mx-auto px-4 overflow-hidden">
        <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-jozi-forest/5 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-jozi-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-red-50 text-red-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
                <Timer className="w-3 h-3 mr-2 animate-pulse" />
                Limited Time Flash Sale
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-jozi-forest tracking-tighter">GOLDEN DEALS</h2>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {[
                    { val: timeLeft.hours, label: 'h' },
                    { val: timeLeft.minutes, label: 'm' },
                    { val: timeLeft.seconds, label: 's' }
                  ].map((unit, i) => (
                    <div key={i} className="bg-jozi-forest text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-lg">
                      <span className="text-lg font-black leading-none">{unit.val.toString().padStart(2, '0')}</span>
                      <span className="text-[7px] font-bold uppercase tracking-widest opacity-50">{unit.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 font-bold text-sm italic">Until next collection drop.</p>
              </div>
            </div>
            
            <Link href="/deals" className="bg-jozi-gold text-jozi-forest px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-jozi-gold/20 flex items-center">
              Explore All Promotions
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {flashDeals.map((product) => (
              <ProductCard key={`flash-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* COUPON SPOTLIGHT */}
      <section className="container mx-auto px-4">
        <div className="bg-jozi-dark rounded-[3.5rem] p-10 md:p-20 text-white relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left lg:max-w-xl">
              <div className="inline-flex items-center bg-jozi-gold/20 border border-jozi-gold/30 px-4 py-1.5 rounded-full text-jozi-gold">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Neighbor Reward</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black leading-[0.9] tracking-tighter">
                YOUR FIRST <br />
                <span className="text-jozi-gold">TREASURE IS ON US.</span>
              </h2>
              <p className="text-lg text-jozi-cream/60 font-medium">
                Use our welcome code to get an immediate discount on any item in the marketplace. Valid for new accounts this week only.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative">
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-jozi-gold rounded-3xl flex items-center justify-center rotate-12 shadow-2xl">
                <Percent className="w-10 h-10 text-jozi-forest" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold mb-1">Site-wide Discount</p>
                  <h4 className="text-3xl font-black">20% OFF YOUR ORDER</h4>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-6 border-2 border-dashed border-white/20 flex items-center justify-between">
                  <span className="text-3xl font-black tracking-tighter">JOZI20</span>
                  <button 
                    onClick={handleCopy}
                    className={`p-4 rounded-xl transition-all ${copiedCode ? 'bg-emerald-500 text-white' : 'bg-jozi-gold text-jozi-forest hover:scale-105'}`}
                  >
                    {copiedCode ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/40">
                  <span>Expires in 48 Hours</span>
                  <span>New Customers Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="container mx-auto px-4 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-jozi-gold/10 rounded-lg">
                <History className="w-5 h-5 text-jozi-gold" />
              </div>
              <h2 className="text-2xl font-black text-jozi-forest tracking-tight">Pick up where you left off</h2>
            </div>
            <Link href="/shop" className="text-sm font-bold text-gray-400 hover:text-jozi-forest transition-colors uppercase tracking-widest">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recentlyViewed.map((product) => (
              <div key={`recent-${product.id}`} className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-jozi-forest/5 hover:border-jozi-gold/30 transition-all group">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-jozi-forest group-hover:text-jozi-gold transition-colors">{product.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">by {product.vendor.name}</p>
                  <p className="text-sm font-black text-jozi-forest mt-1">R{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Hub */}
      <section className="container mx-auto px-4">
        <div className="bg-white rounded-[4rem] p-8 md:p-16 border border-jozi-forest/5 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-red-50 text-red-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
                <Flame className="w-3 h-3 mr-2" />
                What's Trending
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-jozi-forest tracking-tighter">THE JOZI HUB</h2>
            </div>
            
            <div className="flex bg-jozi-cream p-2 rounded-2xl">
              <button 
                onClick={() => setTrendingTab('products')}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center ${trendingTab === 'products' ? 'bg-white text-jozi-forest shadow-md' : 'text-gray-400 hover:text-jozi-forest'}`}
              >
                <Zap className={`w-4 h-4 mr-2 ${trendingTab === 'products' ? 'text-jozi-gold' : ''}`} />
                Popular Products
              </button>
              <button 
                onClick={() => setTrendingTab('stores')}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center ${trendingTab === 'stores' ? 'bg-white text-jozi-forest shadow-md' : 'text-gray-400 hover:text-jozi-forest'}`}
              >
                <Store className={`w-4 h-4 mr-2 ${trendingTab === 'stores' ? 'text-jozi-gold' : ''}`} />
                Top Stores
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {trendingTab === 'products' ? (
              <motion.div 
                key="trending-products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {popularProducts.map((product) => (
                  <ProductCard key={`popular-${product.id}`} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="trending-stores"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {popularVendors.map((vendor) => (
                  <div key={`store-${vendor.id}`} className="relative group bg-jozi-cream rounded-3xl p-8 border border-transparent hover:border-jozi-gold/30 transition-all text-center">
                    <div className="absolute top-4 right-4 bg-jozi-gold text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Top Rated
                    </div>
                    <img src={vendor.image} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg" />
                    <h3 className="text-xl font-black text-jozi-forest">{vendor.name}</h3>
                    <div className="flex items-center justify-center space-x-1 mt-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(vendor.rating) ? 'text-jozi-gold fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-xs font-bold text-gray-500 ml-1">({vendor.rating})</span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-8 px-4">{vendor.description}</p>
                    <Link href="/vendors" className="w-full block py-4 bg-jozi-forest text-white rounded-2xl font-bold hover:bg-jozi-dark transition-all">
                      Visit Store
                    </Link>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section className="container mx-auto px-4">
        <div className="relative h-[80vh] min-h-[600px] overflow-hidden rounded-[4rem] shadow-2xl bg-jozi-dark group">
          
          <div className="absolute inset-0 pointer-events-none scale-110">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=Fv2pOSp5tI4"
              playing={true}
              muted={false}
              volume={0.5}
              loop={true}
              playsinline={true}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: { 
                    showinfo: 0, 
                    controls: 0, 
                    rel: 0, 
                    modestbranding: 1,
                    autoplay: 1,
                    mute: 0 
                  }
                }
              }}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-jozi-dark/30 group-hover:bg-jozi-dark/10 transition-colors pointer-events-none z-10" />

          {/* Product Spotlight Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 z-20 w-full max-w-sm"
          >
            <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[3.5rem] shadow-2xl border border-white/20 space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center bg-jozi-gold text-jozi-forest px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Spotlight Choice
                </div>
                <h3 className="text-3xl font-black text-jozi-forest tracking-tighter leading-tight">
                  {featuredVideoProduct.name}
                </h3>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg shrink-0 border-4 border-jozi-cream">
                  <img src={featuredVideoProduct.images[0]} className="w-full h-full object-cover" alt="Product" />
                </div>
                <div>
                  <p className="text-3xl font-black text-jozi-forest leading-none">R{featuredVideoProduct.price}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">by {featuredVideoProduct.vendor.name}</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {featuredVideoProduct.description.substring(0, 120)}...
              </p>

              <Link 
                href={`/product/${featuredVideoProduct.id}`}
                className="flex items-center justify-center w-full bg-jozi-forest text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 group/btn"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop this Look
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-12 right-12 z-20 text-right pointer-events-none hidden md:block">
            <h2 className="text-6xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">THE SOUL OF <br/><span className="text-jozi-gold">JOBURG</span></h2>
            <p className="text-xl text-jozi-cream/90 font-medium italic drop-shadow-lg">Artisan vision. Modern heritage.</p>
          </div>
        </div>
      </section>

      {/* Featured Curated Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-jozi-forest tracking-tight">Curated Treasures</h2>
            <p className="text-gray-500 mt-2 font-medium">Hand-picked from our weekly market drops.</p>
          </div>
          <Link href="/shop" className="text-jozi-gold font-black flex items-center hover:underline group">
            View All Shop <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="bg-jozi-forest py-32 relative overflow-hidden text-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
              <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl border-4 border-white/10" />
              <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl border-4 border-white/10" />
            </div>
            <div className="space-y-6">
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl border-4 border-white/10" />
              <img src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl border-4 border-white/10" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-10">
            <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter">BEYOND A MARKET, <br /><span className="text-jozi-gold">A MOVEMENT.</span></h2>
            <p className="text-jozi-cream/70 text-lg leading-relaxed font-medium">
              Jozi Market isn't just about commerce; it's about the pulse of Johannesburg. We've built a digital bridge for the visionaries of our city.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <span className="block text-5xl font-black text-jozi-gold">50+</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-jozi-cream/50 mt-2 block">Active Artisans</span>
              </div>
              <div>
                <span className="block text-5xl font-black text-jozi-gold">1.2k</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-jozi-cream/50 mt-2 block">Happy Neighbors</span>
              </div>
            </div>
            <button className="bg-jozi-gold text-jozi-forest px-12 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-jozi-dark/20 hover:scale-105 transition-all">
              Join the Collective
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4">
        <div className="bg-jozi-gold rounded-[4rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
          <div className="relative z-10 lg:w-1/2 text-center lg:text-left space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black text-jozi-forest">DON'T MISS A BEAT.</h2>
            <p className="text-jozi-forest/70 text-xl font-bold italic tracking-tight">Weekly drops and artisan spotlights straight to your inbox.</p>
          </div>
          <div className="relative z-10 mt-12 lg:mt-0 lg:w-1/3 w-full">
            <div className="flex bg-white rounded-3xl p-3 shadow-2xl ring-8 ring-white/20">
              <input type="email" placeholder="Your best email..." className="flex-grow px-6 py-4 outline-none text-jozi-forest font-bold rounded-2xl" />
              <button className="bg-jozi-forest text-white px-10 py-4 rounded-2xl font-black hover:bg-jozi-dark transition-all">
                JOIN
              </button>
            </div>
            <p className="text-[10px] text-jozi-forest/60 mt-4 text-center lg:text-left font-bold uppercase tracking-[0.3em]">No clutter, just craft.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
