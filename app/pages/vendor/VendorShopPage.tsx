'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Share2, 
  Heart, 
  Award, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  // Added ChevronRight to fix 'Cannot find name' error
  ChevronRight,
  LayoutGrid, 
  List,
  PackageSearch,
  CheckCircle2,
  MessageSquare,
  User,
  ThumbsUp,
  X,
  Send,
  Sparkles,
  Flame,
  Timer,
  Percent,
  BadgeCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getProductsByUserIdAction } from '@/app/actions/product/index';
import { getAllCategoriesAction } from '@/app/actions/category/index';
import { getUserByIdAction } from '@/app/actions/auth/auth';
import { IProduct } from '@/interfaces/product/product';
import { ICategory } from '@/interfaces/category/category';
import { IVendorWithApplication } from '@/interfaces/auth/auth';
import ProductCard from '../../components/ProductCard';
import { Review } from '../../types';
import { useToast } from '@/app/contexts/ToastContext';

// Frontend product display format (matches Product type from types.ts)
interface ProductDisplay {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  images: string[];
  vendor: {
    id: string;
    name: string;
    rating: number;
    logo?: string;
    description?: string;
  };
  variants?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    type: string;
    options: string[];
  }[];
}

const VendorShopPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { showError } = useToast();
  
  // State for data
  const [vendor, setVendor] = useState<IVendorWithApplication | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // State for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [priceRange, setPriceRange] = useState(5000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Review Submission State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vendor data by ID
  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) return;
      
      try {
        setLoading(true);
        const response = await getUserByIdAction(vendorId);
        if (!response.error && response.data) {
          setVendor(response.data as IVendorWithApplication);
        } else {
          showError(response.message || 'Failed to load vendor information');
          setVendor(null);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
        showError('Failed to load vendor information');
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId, showError]);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!vendorId) return;

      try {
        setLoadingProducts(true);
        
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProductsByUserIdAction(vendorId, 'Active'),
          getAllCategoriesAction('Active')
        ]);

        if (productsResponse.error) {
          showError(productsResponse.message || 'Failed to load products');
          setProducts([]);
        } else {
          setProducts(productsResponse.data || []);
        }

        if (categoriesResponse.error) {
          console.error('Failed to load categories:', categoriesResponse.message);
          setCategories([]);
        } else {
          setCategories(categoriesResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to load vendor data');
        setProducts([]);
        setCategories([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, [vendorId, showError]);

  // Create category map for quick lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(cat => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categories]);

  // Transform backend products to frontend format
  const transformedProducts = useMemo(() => {
    return products.map((product): ProductDisplay => {
      // Get category name from map
      const categoryName = categoryMap.get(product.technicalDetails.categoryId) || 'Uncategorized';
      
      // Get first image
      const firstImage = product.images && product.images.length > 0
        ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].file)
        : '/placeholder-product.jpg';
      
      // Get all images
      const productImages = product.images?.map(img => 
        typeof img === 'string' ? img : img.file
      ) || [firstImage];

      // Get price (use discountPrice if available, else regularPrice)
      const price = product.technicalDetails.discountPrice || product.technicalDetails.regularPrice;
      const originalPrice = product.technicalDetails.discountPrice 
        ? product.technicalDetails.regularPrice 
        : undefined;

      // Get vendor name
      const vendorName = product.vendorName || vendor?.vendorApplication?.shopName || vendor?.fullName || 'Unknown Vendor';

      // Get subcategory name if available
      const subcategoryName = product.technicalDetails.subcategoryId
        ? categoryMap.get(product.technicalDetails.subcategoryId)
        : undefined;

      // Calculate stock (from variants or initialStock)
      const stock = product.variants && product.variants.length > 0
        ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : (product.technicalDetails.initialStock || 0);

      return {
        id: product.id || '',
        name: product.title,
        description: product.description,
        price,
        originalPrice,
        category: categoryName,
        subcategory: subcategoryName,
        rating: 4.5, // Default rating (can be enhanced with review data)
        reviewCount: 0, // Default (can be enhanced with review data)
        stock,
        tags: [], // Empty tags array (can be enhanced later)
        images: productImages,
        vendor: {
          id: vendorId || '',
          name: vendorName,
          rating: 4.5, // Default vendor rating
          logo: vendor?.vendorApplication?.files?.logoUrl || vendor?.profileUrl,
          description: vendor?.vendorApplication?.description,
        },
        variants: product.variants?.map(v => ({
          id: v.id || '',
          name: v.name,
          sku: v.sku,
          price: v.price || v.discountPrice || price,
          stock: v.stock,
          type: 'standard',
          options: [],
        })),
      };
    });
  }, [products, categoryMap, vendorId, vendor]);

  // Extract unique categories from products (only show categories that have products)
  const vendorCategories = useMemo(() => {
    const categorySet = new Set<string>();
    transformedProducts.forEach(p => {
      if (p.category && p.category !== 'Uncategorized') {
        categorySet.add(p.category);
      }
    });
    return ['All', ...Array.from(categorySet).sort()];
  }, [transformedProducts]);

  // Derived Deals for this specific vendor
  const vendorDeals = useMemo(() => 
    transformedProducts.filter(p => p.originalPrice && p.originalPrice > p.price),
  [transformedProducts]);

  // Mock Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>([
    { id: 'r1', userName: 'Thandiwe M.', rating: 5, date: '2 days ago', comment: 'The quality of the craftsmanship is unmatched. I bought a shweshwe piece and it fits perfectly. Truly the soul of Jozi!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { id: 'r2', userName: 'Bongani S.', rating: 4, date: '1 week ago', comment: 'Great service and fast delivery. The items were packaged with so much care. Will definitely be supporting again.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
    { id: 'r3', userName: 'Sarah J.', rating: 5, date: '2 weeks ago', comment: 'Incredible experience. This workshop represents the best of our local talent. Highly recommended for unique gifts!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    { id: 'r4', userName: 'Lindiwe K.', rating: 5, date: '1 month ago', comment: 'I love how they combine traditional patterns with modern silhouettes. It’s exactly what Joburg fashion needs.', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100' },
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim()) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      const review: Review = {
        id: `r-${Date.now()}`,
        userName: 'You (Guest User)',
        rating: newRating,
        comment: newComment,
        date: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
      };
      setReviewsList([review, ...reviewsList]);
      setIsSubmitting(false);
      setIsReviewModalOpen(false);
      setNewRating(0);
      setNewComment('');
    }, 1500);
  };

  const filteredProducts = useMemo(() => {
    let result = transformedProducts;

    // Filter by search
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Top Rated') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [transformedProducts, searchQuery, selectedCategory, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-jozi-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mx-auto" />
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Vendor...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black text-jozi-forest">Artisan workshop not found.</h2>
        <Link href="/vendors" className="text-jozi-gold font-bold mt-4 inline-block hover:underline">Return to Artisans</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jozi-cream pb-24">
      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-5xl p-10 lg:p-12 shadow-2xl overflow-hidden"
            >
              <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black text-jozi-forest tracking-tight">Rate the Workshop</h3>
                  <p className="text-gray-400 font-medium italic">Share your experience with {vendor.vendorApplication?.shopName || vendor.fullName}</p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-8">
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quality Score</p>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none transition-transform active:scale-90"
                        >
                          <Star 
                            className={`w-10 h-10 transition-all ${
                              (hoverRating || newRating) >= star 
                                ? 'text-jozi-gold fill-current' 
                                : 'text-gray-100'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Story</label>
                    <textarea 
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Describe the craftsmanship, delivery, and overall feeling..." 
                      className="w-full bg-jozi-cream border-2 border-transparent rounded-3xl py-5 px-6 font-bold text-jozi-forest focus:border-jozi-gold/20 outline-none transition-all resize-none min-h-[150px]"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || newRating === 0 || !newComment.trim()}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center ${
                      isSubmitting ? 'bg-gray-100 text-gray-400' : 'bg-jozi-forest text-white hover:bg-jozi-dark shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish Feedback
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Hero Section */}
      <section className="relative">
        <div className="h-[300px] md:h-[450px] w-full relative overflow-hidden bg-jozi-dark">
          <img 
            src={vendor?.vendorApplication?.files?.bannerUrl || "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1600"} 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Artisan Banner"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#FDFCFB] via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-6 max-w-[1550px] -mt-40 relative z-10">
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-jozi-forest/5 flex flex-col md:flex-row items-center md:items-end gap-12">
            {/* Store Logo */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-40 h-40 md:w-56 md:h-56 rounded-5xl overflow-hidden border-8 border-white shadow-2xl -mt-24 md:-mt-48 shrink-0 bg-white"
            >
              <img 
                src={vendor.vendorApplication?.files?.logoUrl || vendor.profileUrl || '/placeholder-vendor.jpg'} 
                alt={vendor.vendorApplication?.shopName || vendor.fullName} 
                className="w-full h-full object-cover" 
              />
            </motion.div>

            {/* Info and Tagline */}
            <div className="grow text-center md:text-left space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl md:text-6xl font-black text-jozi-forest tracking-tighter uppercase leading-none">
                    {vendor.vendorApplication?.shopName || vendor.fullName}
                  </h1>
                  <BadgeCheck className="w-10 h-10 text-jozi-gold" />
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-gray-400 font-bold text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-2 bg-jozi-forest/5 px-4 py-2 rounded-full">
                    <Star className="w-4 h-4 text-jozi-gold fill-current" />
                    <span className="text-jozi-forest">4.5</span>
                    <span className="opacity-40">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full">
                    <MapPin className="w-4 h-4 text-jozi-gold" />
                    <span>{vendor.vendorApplication?.address?.city || 'Johannesburg'}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 font-medium text-xl max-w-3xl leading-relaxed italic">
                "{vendor.vendorApplication?.description || vendor.vendorApplication?.tagline || 'A local artisan bringing unique products to Jozi Market.'}"
              </p>
            </div>

            {/* Header Primary Actions */}
            <div className="flex items-center gap-4 shrink-0 pb-2">
              <button className="bg-jozi-forest text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center">
                <Heart className="w-5 h-5 mr-3" />
                Follow Workshop
              </button>
              <button className="bg-white border border-gray-100 text-jozi-forest p-5 rounded-3xl hover:bg-jozi-forest hover:text-white transition-all shadow-sm">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Shop Experience */}
      <section className="container mx-auto px-4 mt-16">
        {loadingProducts ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mx-auto" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Products...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 space-y-12 shrink-0">
              {/* Search within store */}
              <div className="bg-white p-6 rounded-3xl border border-jozi-forest/5 shadow-soft">
                <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest mb-6 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-jozi-gold" />
                  In-Store Search
                </h3>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Find a piece..." 
                    className="w-full bg-jozi-cream rounded-xl px-4 py-3 text-sm font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/30 transition-all"
                  />
                </div>
              </div>

              {/* Local Categories - Only show categories that have products */}
              {vendorCategories.length > 1 && (
                <div>
                  <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest mb-6 flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-jozi-gold" />
                    Workshop Feed
                  </h3>
                  <div className="space-y-2">
                    {vendorCategories.map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-5 py-3 rounded-xl font-bold text-sm transition-all flex justify-between items-center ${
                          selectedCategory === cat 
                            ? 'bg-jozi-forest text-white shadow-lg' 
                            : 'text-gray-500 hover:bg-jozi-forest/5'
                        }`}
                      >
                        {cat}
                        {selectedCategory === cat && <div className="w-2 h-2 bg-jozi-gold rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter */}
            <div>
              <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest mb-6 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-jozi-gold" />
                Price Limit
              </h3>
              <div className="space-y-4 px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-jozi-forest/10 rounded-lg appearance-none cursor-pointer accent-jozi-forest" 
                />
                <div className="flex items-center justify-between text-[11px] font-black text-jozi-forest">
                  <span>R0</span>
                  <span className="bg-jozi-gold/10 px-3 py-1 rounded-full text-jozi-gold">Under R{priceRange}</span>
                </div>
              </div>
            </div>

            {/* Store Loyalty Badge */}
            <div className="p-8 bg-jozi-forest rounded-4xl text-white space-y-4 relative overflow-hidden group">
              <Award className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform" />
              <h4 className="text-lg font-black leading-tight">Certified <br />Artisan Store</h4>
              <p className="text-xs text-jozi-cream/60 font-medium">All items are inspected at the Jozi Hub before being dispatched to ensure authenticity.</p>
            </div>
          </aside>

          {/* Product Feed */}
          <div className="grow space-y-12">
            
            {/* NEW: Workshop Promotions Section */}
            {vendorDeals.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-jozi-dark rounded-[3.5rem] p-10 text-white relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="relative z-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center bg-jozi-gold/20 border border-jozi-gold/30 px-4 py-1.5 rounded-full text-jozi-gold">
                        <Flame className="w-4 h-4 mr-2 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Promotions</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Workshop <br /><span className="text-jozi-gold italic">Golden Deals.</span></h2>
                      <p className="text-jozi-cream/60 text-sm font-medium">Limited-time offers direct from {vendor.vendorApplication?.shopName || vendor.fullName}'s workshop.</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <Timer className="w-5 h-5 text-jozi-gold" />
                      <div className="text-left">
                        <p className="text-[9px] font-black uppercase text-jozi-cream/40 leading-none">Ending In</p>
                        <p className="font-black text-sm tracking-widest mt-1">14:32:55</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {vendorDeals.slice(0, 2).map(deal => (
                      <div key={deal.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6 group/deal hover:bg-white/10 transition-all cursor-pointer">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-white/10">
                          <img src={deal.images[0]} className="w-full h-full object-cover group-hover/deal:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="grow text-left space-y-2">
                           <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">Flash Offer</p>
                           <h4 className="font-black text-lg leading-tight">{deal.name}</h4>
                           <div className="flex items-center space-x-3">
                              <span className="text-2xl font-black">R{deal.price}</span>
                              <span className="text-xs text-white/30 line-through font-bold italic">R{deal.originalPrice}</span>
                           </div>
                        </div>
                        <Link href={`/product/${deal.id}`} className="p-3 bg-jozi-gold text-jozi-dark rounded-xl hover:bg-white transition-all">
                           <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <Percent className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5 text-jozi-gold group-hover:rotate-12 transition-transform duration-1000" />
              </motion.div>
            )}

            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-jozi-forest/5 shadow-soft">
              <div>
                <h3 className="text-xl font-black text-jozi-forest tracking-tight">
                  {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
                </h3>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
                  {filteredProducts.length} Piece{filteredProducts.length !== 1 && 's'} Found
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* View Mode */}
                <div className="hidden sm:flex bg-jozi-cream p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-jozi-forest shadow-sm' : 'text-gray-400'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-jozi-forest shadow-sm' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort */}
                <div className="relative group/sort">
                  <button className="flex items-center space-x-3 bg-white border border-jozi-forest/10 px-5 py-3 rounded-xl font-black text-xs text-jozi-forest hover:border-jozi-forest/30 transition-all">
                    <span>Sort: {sortBy}</span>
                    <ChevronDown className="w-4 h-4 text-jozi-gold" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-jozi-forest/5 py-3 opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-20 scale-95 group-hover/sort:scale-100 origin-top-right">
                    {['Featured', 'Newest', 'Top Rated', 'Price: Low to High', 'Price: High to Low'].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setSortBy(opt)}
                        className={`w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-jozi-forest/5 transition-colors ${sortBy === opt ? 'text-jozi-gold' : 'text-jozi-forest'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Adjusted Grid - 4 Columns on Desktop */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'}`}>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {viewMode === 'grid' ? (
                      <ProductCard product={product} />
                    ) : (
                      <div className="bg-white p-6 rounded-3xl border border-jozi-forest/5 shadow-soft hover:shadow-lg transition-all flex gap-6 group">
                        <div className="w-40 h-40 rounded-2xl overflow-hidden shrink-0">
                          <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="grow flex flex-col justify-between py-1">
                          <div>
                            <span className="text-[10px] font-black text-jozi-gold uppercase tracking-[0.2em]">{product.category}</span>
                            <h4 className="text-xl font-black text-jozi-forest group-hover:text-jozi-gold transition-colors">{product.name}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-2 font-medium">{product.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-2xl font-black text-jozi-forest">R{product.price}</span>
                            <Link href={`/product/${product.id}`} className="bg-jozi-forest text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-jozi-dark transition-all">
                              View Piece
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-24 text-center space-y-6 bg-white rounded-5xl border border-dashed border-jozi-forest/20"
              >
                <div className="w-20 h-20 bg-jozi-cream rounded-full flex items-center justify-center mx-auto">
                  <PackageSearch className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-jozi-forest">No pieces found in this view.</h3>
                  <p className="text-gray-500 max-w-sm mx-auto font-medium">Try clearing your search or adjusting your filters to see more from this artisan.</p>
                </div>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setPriceRange(5000);
                  }}
                  className="text-jozi-gold font-black underline underline-offset-4 hover:text-jozi-forest transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-soft border border-jozi-forest/5">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Review Summary */}
            <div className="lg:w-1/3 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-jozi-forest tracking-tight">Customer Reviews</h2>
                <div className="flex items-center space-x-4">
                  <p className="text-6xl font-black text-jozi-forest">4.5</p>
                  <div>
                    <div className="flex items-center text-jozi-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : 'opacity-20'}`} />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Based on {reviewsList.length} Reviews</p>
                  </div>
                </div>
              </div>

              {/* Rating Bars */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percentage = star === 5 ? 85 : star === 4 ? 12 : 3;
                  return (
                    <div key={star} className="flex items-center space-x-4">
                      <span className="text-xs font-black text-jozi-forest w-8">{star} Star</span>
                      <div className="grow h-2 bg-jozi-cream rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          className="h-full bg-jozi-gold" 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 w-8">{percentage}%</span>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full bg-jozi-forest text-white py-5 rounded-2xl font-black shadow-xl shadow-jozi-forest/10 hover:bg-jozi-dark transition-all"
              >
                Write a Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="lg:w-2/3 space-y-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-jozi-forest">Featured Feedback</h3>
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Showing top verified buyers</span>
                </div>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {reviewsList.map((review, idx) => (
                    <motion.div 
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-8 bg-jozi-cream/30 rounded-4xl border border-jozi-forest/5 hover:bg-jozi-cream/50 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-sm">
                            <img src={review.avatar} alt={review.userName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-black text-jozi-forest">{review.userName}</h4>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <div className="flex items-center text-jozi-gold">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {review.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-white rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-50">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Buyer</span>
                        </div>
                      </div>
                      <p className="mt-6 text-gray-500 font-medium leading-relaxed italic">
                        "{review.comment}"
                      </p>
                      <div className="mt-6 pt-6 border-t border-jozi-forest/5 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center space-x-1 text-[10px] font-black uppercase text-gray-400 hover:text-jozi-forest">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful (12)</span>
                        </button>
                        <button className="flex items-center space-x-1 text-[10px] font-black uppercase text-gray-400 hover:text-jozi-forest">
                          <MessageSquare className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button className="w-full py-4 text-xs font-black text-jozi-gold hover:text-jozi-forest transition-colors uppercase tracking-[0.2em] border-2 border-dashed border-jozi-gold/20 rounded-2xl hover:bg-jozi-gold/5">
                Load More Reviews
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Craft Section (Fixed) */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-jozi-dark rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black leading-[0.9] tracking-tighter">
                CRAFTED WITH <br />
                <span className="text-jozi-gold italic">PURPOSE.</span>
              </h2>
              <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed">
                When you buy from <span className="text-white font-bold">{vendor.vendorApplication?.shopName || vendor.fullName}</span>, you aren't just acquiring a product; you're sustaining a livelihood. Every stitch, carve, and polish is done locally within the Johannesburg metropolitan area.
              </p>
              <div className="flex items-center space-x-12">
                <div className="space-y-1">
                  <span className="block text-4xl font-black text-jozi-gold">100%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Artisan Led</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="space-y-1">
                  <span className="block text-4xl font-black text-jozi-gold">Local</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Sourced Materials</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:grid grid-cols-2 gap-6">
              <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl rotate-3" />
              <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-2xl -rotate-3 mt-12" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorShopPage;