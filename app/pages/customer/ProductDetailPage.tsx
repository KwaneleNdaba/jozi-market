
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Check,
  Info,
  ArrowLeft,
  Store,
  Sparkles,
  Gamepad2,
  X,
  Send,
  MessageSquare,
  ThumbsUp,
  // Added CheckCircle2 to fix the 'Cannot find name' error
  CheckCircle2
} from 'lucide-react';
import { products, vendors } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  
  const product = useMemo(() => products.find(p => p.id === id), [id]);
  
  const fullVendor = useMemo(() => 
    product ? vendors.find(v => v.id === product.vendor.id) : undefined, 
  [product]);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');

  // Review Submission State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Reviews state
  const [reviewsList, setReviewsList] = useState([
    { id: 1, user: 'Zanele M.', rating: 5, comment: 'Absolutely stunning quality. You can tell it was made with love and precision. The colors are even better in person!', date: '2 days ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
    { id: 2, user: 'Thabo K.', rating: 4, comment: 'Great piece of local art. Shipping was fast and the packaging was very secure.', date: '1 week ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  ]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const review = {
        id: Date.now(),
        user: 'You (Guest User)',
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

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      const initialVariants: Record<string, string> = {};
      product.variants?.forEach((v: { type: string; options: string[] }) => {
        initialVariants[v.type] = v.options[0];
      });
      setSelectedVariants(initialVariants);
      window.scrollTo(0, 0);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black text-jozi-forest">Product not found.</h2>
        <Link href="/shop" className="text-jozi-gold font-bold mt-4 inline-block hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariants);
  };

  return (
    <div className="bg-jozi-cream min-h-screen pb-24">
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
                  <h3 className="text-3xl font-black text-jozi-forest tracking-tight">Review this Treasure</h3>
                  <p className="text-gray-400 font-medium italic">{product.name}</p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-8">
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rate the Piece</p>
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Feedback</label>
                    <textarea 
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="What did you love about this item? How was the quality?" 
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
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link href="/shop" className="hover:text-jozi-forest transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-jozi-forest transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-jozi-forest">{product.name}</span>
        </div>
      </nav>

      <section className="container mx-auto px-4">
        <div className="bg-white rounded-5xl p-8 md:p-12 shadow-soft border border-jozi-forest/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <motion.div 
                layoutId={`img-${product.id}`}
                className="aspect-4/5 rounded-4xl overflow-hidden bg-jozi-cream relative group shadow-2xl"
              >
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-6 right-6 bg-white/80 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 className="w-5 h-5 text-jozi-forest" />
                </button>
              </motion.div>
              
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx ? 'border-jozi-gold shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1.5 bg-jozi-gold/10 text-jozi-gold rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center text-jozi-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">({product.reviewCount} Reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-4xl lg:text-7xl font-black text-jozi-forest tracking-tighter leading-none">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-400 font-medium">Mastercrafted by</span>
                  <Link href={`/vendors/${product.vendor.id}`} className="text-jozi-forest font-black underline underline-offset-4 hover:text-jozi-gold transition-colors">
                    {product.vendor.name}
                  </Link>
                </div>
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-5xl font-black text-jozi-forest">R{product.price}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-300 line-through font-bold">R{product.originalPrice}</span>
                )}
              </div>

              <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants?.map((variant: { type: string; options: string[] }) => (
                <div key={variant.type} className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-jozi-forest/60">Select {variant.type}</p>
                  <div className="flex flex-wrap gap-3">
                    {variant.options.map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.type]: opt }))}
                        className={`px-8 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                          selectedVariants[variant.type] === opt 
                            ? 'bg-jozi-forest text-white border-jozi-forest shadow-xl scale-105' 
                            : 'bg-white text-gray-400 border-gray-50 hover:border-jozi-forest/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="pt-8 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center bg-jozi-cream rounded-3xl p-2 shrink-0 border border-jozi-forest/5 shadow-inner">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl transition-all text-jozi-forest"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-14 text-center font-black text-xl text-jozi-forest">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl transition-all text-jozi-forest"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="grow bg-jozi-forest text-white py-5 px-8 rounded-3xl font-black text-xl flex items-center justify-center shadow-2xl shadow-jozi-forest/30 hover:bg-jozi-dark hover:-translate-y-1 transition-all group"
                  >
                    <ShoppingCart className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
                    Add to Collection
                  </button>
                  
                  <button className="p-6 bg-white border border-jozi-forest/10 rounded-3xl text-jozi-forest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-lg group">
                    <Heart className="w-6 h-6 group-hover:fill-current" />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-jozi-forest/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-jozi-forest tracking-widest leading-tight">Priority Delivery</p>
                      <p className="text-[11px] font-bold text-gray-400">1-3 Work Days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-jozi-forest tracking-widest leading-tight">Authentic Item</p>
                      <p className="text-[11px] font-bold text-gray-400">Verified Origin</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-jozi-forest/5 rounded-2xl flex items-center justify-center text-jozi-forest">
                      <RotateCcw className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-jozi-forest tracking-widest leading-tight">Hassle Free</p>
                      <p className="text-[11px] font-bold text-gray-400">30 Day Returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs / Detailed Content */}
      <section className="container mx-auto px-4 mt-24">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-2/3 space-y-16">
            <div className="flex border-b border-jozi-forest/5 space-x-12">
              {[
                { id: 'description', label: 'Artisan Notes' },
                { id: 'specs', label: 'Technical Details' },
                { id: 'shipping', label: 'Craft & Care' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-6 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${
                    activeTab === tab.id ? 'text-jozi-forest' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1.5 bg-jozi-gold rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[250px] text-gray-500 leading-relaxed font-medium text-lg">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div 
                    key="desc" 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <p className="italic text-jozi-forest/70 font-bold border-l-4 border-jozi-gold pl-6 py-2">
                      "Inspired by the vibrant streets of Joburg, this piece bridges the gap between traditional craftsmanship and modern urban life."
                    </p>
                    <p>This premium piece is a testament to the artisan's dedication to quality and South African heritage. Each unit is uniquely crafted, meaning no two items are exactly alike, providing you with a truly one-of-a-kind possession.</p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {[
                        'Ethically sourced local materials.',
                        'Traditional techniques mixed with modern aesthetics.',
                        'Highly durable and designed to last generations.',
                        'Supports local community initiatives.'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-jozi-forest/5">
                          <Check className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-bold text-jozi-forest/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'specs' && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {[
                      { l: 'Material', v: 'Premium Grade A Textile / Natural Wood' },
                      { l: 'Origin', v: 'Johannesburg, South Africa' },
                      { l: 'Dimensions', v: 'Standard Adult / Universal Decor' },
                      { l: 'Weight', v: 'Approx. 0.85kg' },
                      { l: 'Process', v: 'Hand-finished, 12-hour curing cycle' }
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                        <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">{row.l}</span>
                        <span className="text-sm font-bold">{row.v}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'shipping' && (
                  <motion.div key="ship" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <p>We treat every order like a precious cargo. All items are packed in eco-friendly, locally manufactured materials designed for maximum protection and minimal waste.</p>
                    <div className="bg-jozi-forest p-10 rounded-4xl flex items-start space-x-6 text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="text-xl font-black mb-4">Care Guidelines</h4>
                        <ul className="space-y-3 opacity-90 text-sm">
                          <li>• Hand wash only with cold water and mild detergent.</li>
                          <li>• Avoid direct sunlight during drying to preserve colors.</li>
                          <li>• For wood: Apply organic beeswax once every 6 months.</li>
                        </ul>
                      </div>
                      <Info className="w-12 h-12 text-jozi-gold absolute top-10 right-10 opacity-20" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Artisan Spotlight */}
            <div className="bg-jozi-forest p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-jozi-gold/20 to-transparent" />
              <div className="w-40 h-40 rounded-4xl overflow-hidden shrink-0 border-8 border-white/10 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-700">
                <img src={fullVendor?.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" />
              </div>
              <div className="grow space-y-6 text-center md:text-left relative z-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">Artisan Master</p>
                  <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">{product.vendor.name}</h3>
                </div>
                <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic">"Our mission is to bring the soul of Johannesburg into every home. We pride ourselves on preserving legacy while looking forward."</p>
                <Link href={`/vendors/${product.vendor.id}`} className="inline-flex items-center bg-white text-jozi-forest px-10 py-4 rounded-2xl font-black hover:bg-jozi-gold transition-all shadow-xl">
                  Visit Workshop <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Product Reviews Section */}
            <div className="space-y-10 pt-10 border-t border-jozi-forest/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Neighborhood Feedback</h3>
                  <p className="text-gray-400 font-medium text-sm">Real thoughts from real supporters.</p>
                </div>
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-jozi-gold text-jozi-forest px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-jozi-gold/20 hover:scale-105 transition-all flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Write a Review
                </button>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {reviewsList.map((review) => (
                    <motion.div 
                      layout
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-white rounded-3xl border border-jozi-forest/5 shadow-sm group hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-jozi-cream">
                            <img src={review.avatar} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-black text-jozi-forest">{review.user}</h4>
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
                        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-emerald-50 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </div>
                      </div>
                      <p className="mt-6 text-gray-500 font-medium leading-relaxed italic">
                        "{review.comment}"
                      </p>
                      <div className="mt-6 pt-4 border-t border-jozi-forest/5 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center space-x-1 text-[10px] font-black uppercase text-gray-400 hover:text-jozi-forest">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-12">
            <div className="bg-white p-10 rounded-5xl border border-jozi-forest/5 shadow-soft space-y-8">
              <h3 className="text-xl font-black text-jozi-forest flex items-center">
                <Sparkles className="w-5 h-5 text-jozi-gold mr-3" />
                Artisan Pick
              </h3>
              <div className="space-y-10">
                {relatedProducts.slice(0, 2).map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
              <Link href="/shop" className="w-full block text-center py-5 bg-jozi-cream rounded-2xl font-black text-jozi-forest hover:bg-jozi-forest/5 transition-all text-sm uppercase tracking-widest">
                Explore Shop
              </Link>
            </div>
            
            <div className="bg-jozi-gold p-12 rounded-[3.5rem] text-jozi-forest space-y-6 relative overflow-hidden shadow-2xl shadow-jozi-gold/20 group">
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl">
                  <Gamepad2 className="w-8 h-8 text-jozi-gold" />
                </div>
                <h4 className="text-3xl font-black leading-tight tracking-tight">Play <br />& Earn</h4>
                <p className="text-jozi-forest/80 text-lg font-bold italic">Win daily rewards, points, and exclusive vouchers as you explore Jozi.</p>
                <Link href="/games" className="inline-flex items-center bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl">
                  Start Playing
                </Link>
              </div>
              <Sparkles className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-45 transition-transform duration-1000" />
            </div>
          </aside>
        </div>
      </section>

      {/* Enhanced Related Treasures Section */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 mt-40">
          <div className="bg-white rounded-[4rem] p-12 lg:p-24 shadow-soft border border-jozi-forest/5">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="space-y-4">
                <div className="inline-flex items-center bg-jozi-forest/5 px-4 py-2 rounded-full border border-jozi-forest/10">
                  <Sparkles className="w-4 h-4 text-jozi-gold mr-3" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-jozi-forest">Handpicked Curations</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-jozi-forest tracking-tighter leading-none">RELATED <br /><span className="text-jozi-gold">TREASURES</span></h2>
                <p className="text-gray-400 font-bold text-xl italic mt-2">Pieces you might find equally captivating.</p>
              </div>
              <Link href="/shop" className="bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-jozi-dark transition-all flex items-center group">
                Browse Full Market
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map((rel, idx) => (
                <motion.div
                  key={`related-${rel.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={rel} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
