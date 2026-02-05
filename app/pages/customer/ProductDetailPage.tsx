'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Check,
  Info,
  Sparkles,
  Gamepad2,
  X,
  Send,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/ProductCard';
import { getProductByIdAction } from '../../actions/product/index';
import { getAllCategoriesAction } from '../../actions/category/index';
import { getAllAttributesAction } from '../../actions/attribute/index';
import { IProduct } from '@/interfaces/product/product';
import { ICategoryWithSubcategories } from '@/interfaces/category/category';
import { IAttribute } from '@/interfaces/attribute/attribute';
import { Product } from '../../types';
import { products } from '../../data/mockData';
import { useProductSocket } from '@/app/hooks/useSocket';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ICategoryWithSubcategories[]>([]);
  const [attributes, setAttributes] = useState<IAttribute[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'specs'>('specs');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Refs for scrollable containers
  const alsoLikeRef = React.useRef<HTMLDivElement>(null);
  const popularPicksRef = React.useRef<HTMLDivElement>(null);
  const relatedTreasuresRef = React.useRef<HTMLDivElement>(null);
  
  // Scroll functions
  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const cardWidth = 260 + 16; // card width + gap
      ref.current.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
    }
  };
  
  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const cardWidth = 260 + 16; // card width + gap
      ref.current.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });
    }
  };

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

  // Fetch product, categories, and attributes
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productResponse = await getProductByIdAction(id as string);
        if (!productResponse.error && productResponse.data) {
          setProduct(productResponse.data);
          if (productResponse.data.variants && productResponse.data.variants.length > 0) {
            setSelectedVariant(productResponse.data.variants[0].id || null);
          }
        }
        const categoriesResponse = await getAllCategoriesAction('Active');
        if (!categoriesResponse.error && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        const attributesResponse = await getAllAttributesAction();
        if (!attributesResponse.error && attributesResponse.data) {
          setAttributes(attributesResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle real-time stock updates via WebSocket
  const handleStockUpdate = useCallback((data: any) => {
    console.log('[ProductDetailPage] 🔄 Real-time stock update:', data);
    
    setProduct(prevProduct => {
      if (!prevProduct) return prevProduct;

      if (data.type === 'product' && data.productId === prevProduct.id) {
        // Update product-level inventory
        const updatedProduct = {
          ...prevProduct,
          inventory: {
            quantityAvailable: data.quantityAvailable ?? prevProduct.inventory?.quantityAvailable ?? 0,
            quantityReserved: data.quantityReserved ?? prevProduct.inventory?.quantityReserved ?? 0,
            reorderLevel: data.reorderLevel ?? prevProduct.inventory?.reorderLevel ?? 0,
          },
        };
        console.log('[ProductDetailPage] ✅ Updated product inventory:', {
          productId: prevProduct.id,
          oldStock: prevProduct.inventory?.quantityAvailable,
          newStock: updatedProduct.inventory.quantityAvailable,
        });
        return updatedProduct;
      } else if (data.type === 'variant' && prevProduct.variants) {
        // Update specific variant inventory
        return {
          ...prevProduct,
          variants: prevProduct.variants.map(variant =>
            variant.id === data.variantId
              ? {
                  ...variant,
                  stock: data.quantityAvailable ?? data.stock ?? variant.stock,
                  inventory: {
                    quantityAvailable: data.quantityAvailable ?? variant.inventory?.quantityAvailable ?? 0,
                    quantityReserved: data.quantityReserved ?? variant.inventory?.quantityReserved ?? 0,
                    reorderLevel: data.reorderLevel ?? variant.inventory?.reorderLevel ?? 0,
                  },
                }
              : variant
          ),
        };
      }

      return prevProduct;
    });
  }, []);

  // Subscribe to WebSocket updates for this product
  useProductSocket(product?.id, handleStockUpdate);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

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

  const categoryName = useMemo(() => {
    if (!product) return 'Uncategorized';
    const category = categories.find(cat => cat.id === product.technicalDetails.categoryId);
    return category?.name || 'Uncategorized';
  }, [product, categories]);

  const subcategoryName = useMemo(() => {
    if (!product || !product.technicalDetails.subcategoryId) return null;
    const category = categories.find(cat => cat.id === product.technicalDetails.categoryId);
    if (category?.subcategories) {
      const subcategory = category.subcategories.find(sub => sub.id === product.technicalDetails.subcategoryId);
      return subcategory?.name || null;
    }
    return null;
  }, [product, categories]);

  const getAttributeName = (attributeId: string): string => {
    const attribute = attributes.find(attr => attr.id === attributeId);
    return attribute?.name || attributeId;
  };

  const displayPrice = useMemo(() => {
    if (!product) return 0;
    if (selectedVariant && product.variants) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      if (variant) {
        // If variant has its own price, use variant's discount (if exists) or variant's price
        if (variant.price) {
          return variant.discountPrice || variant.price;
        }
        // If variant has no price, fall back to product's pricing
        return product.technicalDetails.discountPrice || product.technicalDetails.regularPrice;
      }
    }
    return product.technicalDetails.discountPrice || product.technicalDetails.regularPrice;
  }, [product, selectedVariant]);

  const originalPrice = useMemo(() => {
    if (!product) return null;
    if (selectedVariant && product.variants) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      if (variant) {
        // If variant has its own price AND discount, show original price
        if (variant.price && variant.discountPrice) {
          return variant.price;
        }
        // If variant has price but no discount, no strikethrough
        if (variant.price) {
          return null;
        }
        // If variant has no price, use product's discount logic
        if (product.technicalDetails.discountPrice) {
          return product.technicalDetails.regularPrice;
        }
      }
    }
    // No variant selected: use product's discount logic
    if (product.technicalDetails.discountPrice) return product.technicalDetails.regularPrice;
    return null;
  }, [product, selectedVariant]);

  const selectedVariantObj = useMemo(() => {
    if (!product || !selectedVariant) return null;
    return product.variants?.find(v => v.id === selectedVariant) || null;
  }, [product, selectedVariant]);

  const stock = useMemo(() => {
    if (!product) return 0;
    
    // If a specific variant is selected, use its inventory data
    if (selectedVariantObj) {
      // Prefer inventory.quantityAvailable over stock field
      return selectedVariantObj.inventory?.quantityAvailable ?? selectedVariantObj.stock ?? 0;
    }
    
    // No variant selected or product has no variants
    // Use product-level inventory or initialStock
    return product.inventory?.quantityAvailable ?? product.technicalDetails.initialStock ?? 0;
  }, [product, selectedVariantObj]);

  const productImages = useMemo(() => {
    if (!product || !product.images || product.images.length === 0) {
      return ['https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400'];
    }
    return product.images.map(img => img.file);
  }, [product]);

  const transformProductForCart = (): Product | null => {
    if (!product) return null;
    return {
      id: product.id || '',
      name: product.title,
      description: product.description,
      price: displayPrice,
      originalPrice: originalPrice || undefined,
      category: categoryName,
      subcategory: subcategoryName || undefined,
      vendor: { id: product.userId, name: product.vendorName || 'Unknown Vendor', rating: 4.5 },
      images: productImages,
      rating: 4.5,
      reviewCount: 12,
      stock: stock,
      tags: [],
      variants: product.variants && product.variants.length > 0
        ? product.variants.map(v => ({
          id: v.id || '',
          name: v.name,
          sku: v.sku,
          price: v.price || product.technicalDetails.regularPrice,
          stock: v.inventory?.quantityAvailable ?? v.stock ?? 0,
          type: v.name,
          options: [],
        }))
        : undefined,
    };
  };

  const handleAddToCart = async () => {
    const cartProduct = transformProductForCart();
    if (cartProduct) {
      // Pass variant ID if available, otherwise pass variant name for backward compatibility
      const variants: Record<string, string> | undefined = selectedVariant && selectedVariantObj
        ? { 'variant': selectedVariant, 'variantName': selectedVariantObj.name }
        : undefined;
      await addItem(cartProduct, quantity, variants);
    }
  };

  if (loading) {
    return (
      <div className="bg-jozi-cream min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-jozi-gold animate-spin" />
          <p className="text-sm font-bold text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black text-jozi-forest">Product not found.</h2>
        <Link href="/shop" className="text-jozi-gold font-bold mt-4 inline-block hover:underline">Return to Shop</Link>
      </div>
    );
  }

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
                  <p className="text-gray-400 font-medium italic">{product.title}</p>
                </div>
                <form onSubmit={handleSubmitReview} className="space-y-8">
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rate the Piece</p>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setNewRating(star)} className="focus:outline-none transition-transform active:scale-90">
                          <Star className={`w-10 h-10 transition-all ${(hoverRating || newRating) >= star ? 'text-jozi-gold fill-current' : 'text-gray-100'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Feedback</label>
                    <textarea required value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="What did you love about this item? How was the quality?" className="w-full bg-jozi-cream border-2 border-transparent rounded-3xl py-5 px-6 font-bold text-jozi-forest focus:border-jozi-gold/20 outline-none transition-all resize-none min-h-[150px]" />
                  </div>
                  <button type="submit" disabled={isSubmitting || newRating === 0 || !newComment.trim()} className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center ${isSubmitting ? 'bg-gray-100 text-gray-400' : 'bg-jozi-forest text-white hover:bg-jozi-dark shadow-xl'}`}>
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> : <><Send className="w-4 h-4 mr-2" />Submit Review</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Link href="/shop" className="hover:text-jozi-forest transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?categoryId=${product.technicalDetails.categoryId}`} className="hover:text-jozi-forest transition-colors">{categoryName}</Link>
          {subcategoryName && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/shop?subcategoryId=${product.technicalDetails.subcategoryId}`} className="hover:text-jozi-forest transition-colors">{subcategoryName}</Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-jozi-forest">{product.title}</span>
        </div>
      </nav>

      {/* Header Section */}
      <section className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-jozi-forest/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <motion.div 
                layoutId={`img-${product.id}`}
                className="aspect-square rounded-2xl overflow-hidden bg-jozi-cream relative group shadow-lg max-w-sm mx-auto lg:max-w-full"
              >
                <img src={productImages[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
                <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 className="w-4 h-4 text-jozi-forest" />
                </button>
              </motion.div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img: string, idx: number) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? 'border-jozi-gold shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-jozi-gold/10 text-jozi-gold rounded-full text-[9px] font-black uppercase tracking-widest">
                    {categoryName}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center text-jozi-gold">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-current' : 'opacity-20'}`} />)}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">(12 Reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-black text-jozi-forest tracking-tight leading-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-400 font-medium">Mastercrafted by</span>
                  <Link href={`/vendors/${product.userId}`} className="text-jozi-forest font-black underline underline-offset-4 hover:text-jozi-gold transition-colors">
                    {product.vendorName || 'Unknown Vendor'}
                  </Link>
                </div>
              </div>

              {/* Price - Show for all products, uses variant price if available */}
              <div className="flex items-baseline space-x-4">
                <span className="text-2xl font-black text-jozi-forest">R{displayPrice}</span>
                {originalPrice && <span className="text-base text-gray-300 line-through font-bold">R{originalPrice}</span>}
              </div>

              {/* Stock Availability */}
              <div className="flex items-center gap-3">
                {stock === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                      Out of Stock
                    </span>
                  </div>
                ) : stock < 10 ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                      Only {stock} Left
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-green-600">
                      {stock} In Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className={`text-gray-500 font-medium text-sm leading-relaxed max-w-xl ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                  {product.description}
                </p>
                {product.description && product.description.length > 150 && (
                  <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-jozi-forest transition-colors flex items-center gap-1">
                    {isDescriptionExpanded ? <>See Less <ChevronDown className="w-3 h-3 rotate-180" /></> : <>See More <ChevronDown className="w-3 h-3" /></>}
                  </button>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-jozi-forest/60">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const variantStock = variant.inventory?.quantityAvailable ?? variant.stock ?? 0;
                      const isOutOfStock = variantStock === 0;
                      
                      return (
                        <button 
                          key={variant.id} 
                          onClick={() => !isOutOfStock && setSelectedVariant(variant.id || null)}
                          disabled={isOutOfStock}
                          className={`px-6 py-2 rounded-xl font-black text-xs transition-all border-2 relative ${
                            isOutOfStock 
                              ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-50' 
                              : selectedVariant === variant.id 
                                ? 'bg-jozi-forest text-white border-jozi-forest shadow-md' 
                                : 'bg-white text-gray-400 border-gray-50 hover:border-jozi-forest/20'
                          }`}
                        >
                          {variant.name}
                          {isOutOfStock && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <X className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center bg-jozi-cream rounded-2xl p-1 shrink-0 border border-jozi-forest/5 shadow-inner">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      disabled={stock === 0}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${stock === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-white text-jozi-forest'}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-lg text-jozi-forest">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))} 
                      disabled={stock === 0 || quantity >= stock}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${stock === 0 || quantity >= stock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-white text-jozi-forest'}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart} 
                    disabled={stock === 0}
                    className={`grow py-3 px-8 rounded-2xl font-black text-base flex items-center justify-center shadow-xl transition-all group ${
                      stock === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                        : 'bg-jozi-forest text-white shadow-jozi-forest/20 hover:bg-jozi-dark hover:-translate-y-0.5'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    {stock === 0 ? 'Out of Stock' : 'Add to Collection'}
                  </button>
                  <button className="p-4 bg-white border border-jozi-forest/10 rounded-2xl text-jozi-forest hover:bg-red-50 hover:text-red-500 transition-all shadow-md group">
                    <Heart className="w-5 h-5 group-hover:fill-current" />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-jozi-forest/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-jozi-forest/5 rounded-xl flex items-center justify-center text-jozi-forest"><Truck className="w-5 h-5" /></div>
                    <div><p className="text-[9px] font-black uppercase text-jozi-forest tracking-widest leading-tight">Priority Delivery</p><p className="text-[10px] font-bold text-gray-400">1-3 Days</p></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-jozi-forest/5 rounded-xl flex items-center justify-center text-jozi-forest"><ShieldCheck className="w-5 h-5" /></div>
                    <div><p className="text-[9px] font-black uppercase text-jozi-forest tracking-widest leading-tight">Authentic Item</p><p className="text-[10px] font-bold text-gray-400">Verified</p></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-jozi-forest/5 rounded-xl flex items-center justify-center text-jozi-forest"><RotateCcw className="w-5 h-5" /></div>
                    <div><p className="text-[9px] font-black uppercase text-jozi-forest tracking-widest leading-tight">Hassle Free</p><p className="text-[10px] font-bold text-gray-400">30 Day Returns</p></div>
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
              {[{ id: 'specs', label: 'Product Information' }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-6 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-jozi-forest' : 'text-gray-400'}`}>
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1.5 bg-jozi-gold rounded-full" />}
                </button>
              ))}
            </div>

            <div className="min-h-[250px] text-gray-500 leading-relaxed font-medium text-lg">
              <AnimatePresence mode="wait">
                {activeTab === 'specs' && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                      <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Category</span>
                      <span className="text-sm font-bold">{categoryName}</span>
                    </div>
                    {subcategoryName && (
                      <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                        <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Subcategory</span>
                        <span className="text-sm font-bold">{subcategoryName}</span>
                      </div>
                    )}
                    {/* Show pricing information */}
                    {(!product.variants || product.variants.length === 0) ? (
                      <>
                        {/* Products without variants: show regular price and discount price */}
                        <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                          <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Regular Price</span>
                          <span className="text-sm font-bold">R{product.technicalDetails.regularPrice}</span>
                        </div>
                        {product.technicalDetails.discountPrice && (
                          <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                            <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Discount Price</span>
                            <span className="text-sm font-bold">R{product.technicalDetails.discountPrice}</span>
                          </div>
                        )}
                      </>
                    ) : selectedVariantObj ? (
                      <>
                        {/* Products with variants: show selected variant price or fallback to regular price */}
                        {selectedVariantObj.price ? (
                          <>
                            <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                              <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Variant Price</span>
                              <span className="text-sm font-bold">R{selectedVariantObj.price}</span>
                            </div>
                            {selectedVariantObj.discountPrice && (
                              <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                                <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Variant Discount Price</span>
                                <span className="text-sm font-bold">R{selectedVariantObj.discountPrice}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Variant has no price, show product's regular price */}
                            <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                              <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Regular Price</span>
                              <span className="text-sm font-bold">R{product.technicalDetails.regularPrice}</span>
                            </div>
                            {product.technicalDetails.discountPrice && (
                              <div className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                                <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Discount Price</span>
                                <span className="text-sm font-bold">R{product.technicalDetails.discountPrice}</span>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : null}
                    {product.technicalDetails.attributes && product.technicalDetails.attributes.length > 0 && (
                      <>
                        <div className="pt-4"><h4 className="text-sm font-black text-jozi-forest uppercase tracking-widest mb-4">Attributes</h4></div>
                        {product.technicalDetails.attributes.map((attr, i) => (
                          <div key={i} className="grid grid-cols-2 py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-4 rounded-xl transition-colors">
                            <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">{getAttributeName(attr.attributeId)}</span>
                            <span className="text-sm font-bold">{attr.value}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Artisan Spotlight */}
            <div className="bg-jozi-forest p-12 rounded-5xl text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group h-auto md:h-[320px]">
              <div className="absolute inset-0 bg-linear-to-br from-jozi-gold/20 to-transparent" />
              <div className="w-40 h-40 rounded-4xl overflow-hidden shrink-0 border-8 border-white/10 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-700">
                <img src={product.vendorLogo || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" alt={product.vendorName} />
              </div>
              <div className="grow space-y-6 text-center md:text-left relative z-10 flex flex-col h-full justify-center">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">Artisan Master</p>
                  <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">{product.vendorName || 'Unknown Vendor'}</h3>
                </div>
                <p className="text-lg text-jozi-cream/70 font-medium leading-relaxed italic line-clamp-4 min-h-20">{product.vendorDescription || '"Our mission is to bring the soul of Johannesburg into every home."'}</p>
                <Link href={`/vendors/${product.userId}`} className="inline-flex items-center bg-white text-jozi-forest px-10 py-4 rounded-2xl font-black hover:bg-jozi-gold transition-all shadow-xl self-start mx-auto md:mx-0">Visit Workshop <ChevronRight className="w-4 h-4 ml-2" /></Link>
              </div>
            </div>

            {/* --- THREE HORIZONTAL SECTIONS BEFORE REVIEWS --- */}

            {/* 1. You May Also Like */}
            <div className="space-y-8">
              <div className="flex items-end justify-between px-2">
                <h3 className="text-2xl font-black text-jozi-forest tracking-tight">
                  You May <span className="text-jozi-gold">Also Like</span>
                </h3>
                <Link
                  href="/shop"
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-jozi-forest transition-colors flex items-center"
                >
                  Explore All <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <div className="relative">
                <button
                  onClick={() => scrollLeft(alsoLikeRef)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 flex items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  ref={alsoLikeRef}
                  className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth px-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '812px' }}
                >
                  {products.slice(0, 6).map((item) => (
                    <div key={`also-like-${item.id}`} className="w-[260px] shrink-0 snap-start">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollRight(alsoLikeRef)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 flex items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Popular Picks in this Category */}
            <div className="space-y-8">
              <div className="flex items-end justify-between px-2">
                <h3 className="text-xl font-black text-jozi-forest tracking-tight">Popular Picks in <span className="text-jozi-gold">{categoryName}</span></h3>
                <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-jozi-forest transition-colors flex items-center">View Full Category <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
              <div className="relative">
                <button
                  onClick={() => scrollLeft(popularPicksRef)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 flex items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  ref={popularPicksRef}
                  className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth px-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '812px' }}
                >
                  {products.filter(p => p.category === categoryName).slice(0, 6).map((item) => (
                    <div key={`popular-${item.id}`} className="w-[260px] shrink-0 snap-start">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollRight(popularPicksRef)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 flex items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>


            {/* 3. Related Treasures */}
            <div className="space-y-8">
              <div className="flex items-end justify-between px-2">
                <h3 className="text-xl font-black text-jozi-forest tracking-tight">Related <span className="text-jozi-gold">Treasures</span></h3>
                <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-jozi-forest transition-colors flex items-center">View More <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
              <div className="relative">
                <button
                  onClick={() => scrollLeft(relatedTreasuresRef)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 flex items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  ref={relatedTreasuresRef}
                  className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth px-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '812px' }}
                >
                  {products.slice(6, 12).map((item) => (
                    <div key={`related-tr-${item.id}`} className="w-[260px] shrink-0 snap-start">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollRight(relatedTreasuresRef)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 flex items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-10 pt-10 border-t border-jozi-forest/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-jozi-forest tracking-tight">Neighborhood Feedback</h3>
                  <p className="text-gray-400 font-medium text-sm">Real thoughts from real supporters.</p>
                </div>
                <button onClick={() => setIsReviewModalOpen(true)} className="bg-jozi-gold text-jozi-forest px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-jozi-gold/20 hover:scale-105 transition-all flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />Write a Review
                </button>
              </div>
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {reviewsList.map((review) => (
                    <motion.div layout key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white rounded-3xl border border-jozi-forest/5 shadow-sm group hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-jozi-cream">
                            <img src={review.avatar} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-black text-jozi-forest">{review.user}</h4>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <div className="flex items-center text-jozi-gold">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />)}
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {review.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-emerald-50 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /><span>Verified Purchase</span>
                        </div>
                      </div>
                      <p className="mt-6 text-gray-500 font-medium leading-relaxed italic">"{review.comment}"</p>
                      <div className="mt-6 pt-4 border-t border-jozi-forest/5 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center space-x-1 text-[10px] font-black uppercase text-gray-400 hover:text-jozi-forest">
                          <ThumbsUp className="w-3 h-3" /><span>Helpful</span>
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
            <div className="bg-white p-10 rounded-5xl border border-jozi-forest/5 shadow-soft space-y-8 sticky top-24">
              <h3 className="text-xl font-black text-jozi-forest flex items-center">
                <Sparkles className="w-5 h-5 text-jozi-gold mr-3" />Artisan Pick
              </h3>
              <div className="space-y-10">
                {products.slice(0, 2).map((rel) => <ProductCard key={rel.id} product={rel} />)}
              </div>
              
              <div className="bg-jozi-gold p-12 rounded-3xl text-jozi-forest space-y-6 relative overflow-hidden shadow-2xl shadow-jozi-gold/20 group">
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl">
                    <Gamepad2 className="w-8 h-8 text-jozi-gold" />
                  </div>
                  <h4 className="text-3xl font-black leading-tight tracking-tight">Play <br />& Earn</h4>
                  <p className="text-jozi-forest/80 text-lg font-bold italic">Win daily rewards, points, and exclusive vouchers as you explore Jozi.</p>
                  <Link href="/games" className="inline-flex items-center bg-jozi-forest text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl">Start Playing</Link>
                </div>
                <Sparkles className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:rotate-45 transition-transform duration-1000" />
              </div>

              <Link href="/shop" className="w-full block text-center py-5 bg-jozi-cream rounded-2xl font-black text-jozi-forest hover:bg-jozi-forest/5 transition-all text-sm uppercase tracking-widest">Explore Shop</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;