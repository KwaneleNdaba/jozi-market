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
  Loader2,
  Gift,
  Clock,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/ProductCard';
import { getProductByIdAction } from '../../actions/product/index';
import { getAllCategoriesAction } from '../../actions/category/index';
import { getAllAttributesAction } from '../../actions/attribute/index';
import { getUserPointsBalanceAction } from '../../actions/points/index';
import { getCampaignsByProductAction } from '../../actions/freeProductCampaign/index';
import { claimCampaignAction } from '../../actions/campaign-claim/index';
import { IProduct } from '@/interfaces/product/product';
import { ICategoryWithSubcategories } from '@/interfaces/category/category';
import { IAttribute } from '@/interfaces/attribute/attribute';
import type { IUserPointsBalance } from '@/interfaces/points/points';
import type { IFreeProductCampaign } from '@/interfaces/freeProductCampaign/freeProductCampaign';
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

  // Campaign and Rewards State
  const [pointsBalance, setPointsBalance] = useState<IUserPointsBalance | null>(null);
  const [campaigns, setCampaigns] = useState<IFreeProductCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [claimingCampaign, setClaimingCampaign] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

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

  // Fetch campaigns and points balance
  useEffect(() => {
    const fetchCampaignsAndPoints = async () => {
      if (!id) return;
      
      setLoadingCampaigns(true);
      try {
        // Fetch campaigns for this product
        const campaignsResponse = await getCampaignsByProductAction(id as string);
        if (!campaignsResponse.error && campaignsResponse.data) {
          // Filter for active, visible campaigns only
          const activeCampaigns = campaignsResponse.data.filter(
            campaign => campaign.isVisible && campaign.quantity > 0
          );
          setCampaigns(activeCampaigns);
        }

        // Fetch user's points balance
        const pointsResponse = await getUserPointsBalanceAction();
        if (!pointsResponse.error && pointsResponse.data) {
          setPointsBalance(pointsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching campaigns and points:', err);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaignsAndPoints();
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

  // Campaign matching logic - find matching campaign for current variant/product
  const matchingCampaign = useMemo(() => {
    if (!campaigns || campaigns.length === 0 || !product) return null;

    // If product has variants and one is selected
    if (selectedVariant && product.variants && product.variants.length > 0) {
      // Find campaign that matches this specific variant
      const variantCampaign = campaigns.find(
        campaign => campaign.variantId === selectedVariant
      );
      return variantCampaign || null;
    }

    // No variant selected or product has no variants
    // Find campaign without specific variant (product-level campaign)
    const productCampaign = campaigns.find(
      campaign => !campaign.variantId
    );
    return productCampaign || null;
  }, [campaigns, selectedVariant, product]);

  // Check if user has enough points
  const hasEnoughPoints = useMemo(() => {
    if (!matchingCampaign || !pointsBalance) return false;
    return pointsBalance.availablePoints >= matchingCampaign.pointsRequired;
  }, [matchingCampaign, pointsBalance]);

  // Calculate points needed
  const pointsNeeded = useMemo(() => {
    if (!matchingCampaign || !pointsBalance) return 0;
    const needed = matchingCampaign.pointsRequired - pointsBalance.availablePoints;
    return needed > 0 ? needed : 0;
  }, [matchingCampaign, pointsBalance]);

  // Handle claim campaign
  const handleClaimCampaign = async () => {
    if (!matchingCampaign || !hasEnoughPoints || claimingCampaign) return;

    setClaimingCampaign(true);
    setClaimError(null);
    setClaimSuccess(false);

    try {
      const response = await claimCampaignAction(matchingCampaign.id);
      
      if (response.error) {
        setClaimError(response.message || 'Failed to claim reward');
      } else {
        setClaimSuccess(true);
        
        // Refresh points balance
        const pointsResponse = await getUserPointsBalanceAction();
        if (!pointsResponse.error && pointsResponse.data) {
          setPointsBalance(pointsResponse.data);
        }

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setClaimSuccess(false);
        }, 5000);
      }
    } catch (err: any) {
      setClaimError(err?.message || 'An error occurred while claiming the reward');
    } finally {
      setClaimingCampaign(false);
    }
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
          <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-4">
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
              className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-5xl p-6 md:p-10 lg:p-12 shadow-2xl md:overflow-hidden"
            >
              <button type="button" onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close">
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <div className="space-y-6 md:space-y-8 pr-2">
                <div className="text-center space-y-2 pt-2 md:pt-0">
                  <h3 className="text-xl md:text-3xl font-black text-jozi-forest tracking-tight">Review this Treasure</h3>
                  <p className="text-gray-400 font-medium italic text-sm md:text-base line-clamp-2">{product.title}</p>
                </div>
                <form onSubmit={handleSubmitReview} className="space-y-6 md:space-y-8">
                  <div className="flex flex-col items-center space-y-3 md:space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rate the Piece</p>
                    <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setNewRating(star)} className="focus:outline-none transition-transform active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Star className={`w-8 h-8 md:w-10 md:h-10 transition-all ${(hoverRating || newRating) >= star ? 'text-jozi-gold fill-current' : 'text-gray-100'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Feedback</label>
                    <textarea required value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="What did you love about this item? How was the quality?" className="w-full bg-jozi-cream border-2 border-transparent rounded-2xl md:rounded-3xl py-4 md:py-5 px-4 md:px-6 font-bold text-sm md:text-base text-jozi-forest focus:border-jozi-gold/20 outline-none transition-all resize-none min-h-[120px] md:min-h-[150px]" />
                  </div>
                  <button type="submit" disabled={isSubmitting || newRating === 0 || !newComment.trim()} className={`w-full py-4 md:py-5 min-h-[52px] rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center ${isSubmitting ? 'bg-gray-100 text-gray-400' : 'bg-jozi-forest text-white md:hover:bg-jozi-dark shadow-xl active:scale-[0.99]'}`}>
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> : <><Send className="w-4 h-4 mr-2" />Submit Review</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
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
          <span className="text-jozi-forest line-clamp-2 md:line-clamp-none max-w-[min(100%,14rem)] md:max-w-none">{product.title}</span>
        </div>
      </nav>

      {/* Header Section */}
      <section className="container mx-auto px-3 md:px-4">
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm border border-jozi-forest/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
            
            {/* Left: Image Gallery */}
            <div className="lg:col-span-5 space-y-3 md:space-y-4">
              <motion.div 
                layoutId={`img-${product.id}`}
                className="aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-jozi-cream relative group shadow-md md:shadow-lg w-full max-w-md mx-auto lg:max-w-full"
              >
                <img src={productImages[selectedImage]} alt={product.title} className="w-full h-full object-cover" loading="eager" />
                <button type="button" className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Share">
                  <Share2 className="w-4 h-4 text-jozi-forest" />
                </button>
              </motion.div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-2 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {productImages.map((img: string, idx: number) => (
                  <button key={idx} type="button" onClick={() => setSelectedImage(idx)} className={`w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all shrink-0 snap-start min-h-[44px] min-w-[44px] ${selectedImage === idx ? 'border-jozi-gold shadow-md ring-1 ring-jozi-gold/30' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" loading={idx === 0 ? 'eager' : 'lazy'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:col-span-7 space-y-4 md:space-y-5">
              <div className="space-y-2.5 md:space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="px-3 py-1 bg-jozi-gold/10 text-jozi-gold rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                    {categoryName}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center text-jozi-gold">
                      <Star className="w-4 h-4 fill-current shrink-0 md:hidden" />
                      <span className="font-black text-jozi-forest text-sm md:hidden">4.5</span>
                      <span className="text-[10px] font-bold text-gray-400 md:hidden">(12)</span>
                      <div className="hidden md:flex items-center">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-current' : 'opacity-20'}`} />)}
                      </div>
                    </div>
                    <span className="hidden md:inline text-[10px] font-bold text-gray-400">(12 Reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-jozi-forest tracking-tight leading-snug">
                  {product.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                  <span className="text-gray-400 font-medium">Mastercrafted by</span>
                  <Link href={`/vendors/${product.userId}`} className="text-jozi-forest font-black underline underline-offset-4 hover:text-jozi-gold transition-colors break-all max-w-full">
                    {product.vendorName || 'Unknown Vendor'}
                  </Link>
                </div>
              </div>

              {/* Campaign Reward Banner */}
              {matchingCampaign && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-linear-to-r from-jozi-gold/10 via-jozi-gold/5 to-transparent border-2 border-jozi-gold/30 rounded-xl md:rounded-2xl p-3 md:p-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-jozi-gold/5 rounded-full blur-2xl" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-jozi-gold rounded-xl">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-jozi-forest uppercase tracking-wide">
                            Free Reward Available
                          </h3>
                          <p className="text-xs text-gray-600 font-medium">
                            Claim this product with your points!
                          </p>
                        </div>
                      </div>
                      
                      {matchingCampaign.quantity <= 5 && (
                        <span className="px-2 py-1 bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
                          Only {matchingCampaign.quantity} left
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-jozi-gold/20">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-jozi-gold" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Points Required</span>
                        </div>
                        <p className="text-lg font-black text-jozi-forest mt-1">
                          {matchingCampaign.pointsRequired.toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-jozi-gold/20">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Points</span>
                        </div>
                        <p className="text-lg font-black text-jozi-forest mt-1">
                          {pointsBalance?.availablePoints.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>

                    {/* Claim Button or Message */}
                    {claimSuccess ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-black text-emerald-900">Reward Claimed Successfully!</p>
                          <p className="text-xs text-emerald-700 font-medium mt-0.5">
                            Check your profile for claim details
                          </p>
                        </div>
                      </motion.div>
                    ) : hasEnoughPoints ? (
                      <button
                        onClick={handleClaimCampaign}
                        disabled={claimingCampaign || matchingCampaign.quantity === 0}
                        className="w-full bg-linear-to-r from-jozi-forest to-jozi-forest/90 text-white py-3.5 min-h-[48px] rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-jozi-forest/20 md:hover:shadow-xl md:hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        {claimingCampaign ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Claiming...
                          </>
                        ) : matchingCampaign.quantity === 0 ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <Gift className="w-4 h-4" />
                            Claim Free Reward
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-black text-amber-900">
                            Need {pointsNeeded.toLocaleString()} more points
                          </p>
                          <p className="text-xs text-amber-700 font-medium mt-1">
                            Continue shopping and earning to unlock this reward!
                          </p>
                        </div>
                      </div>
                    )}

                    {claimError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <p className="text-xs font-bold text-rose-900">{claimError}</p>
                      </motion.div>
                    )}

                    {matchingCampaign.expiryDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Campaign expires {new Date(matchingCampaign.expiryDate).toLocaleDateString('en-ZA', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Price - Show for all products, uses variant price if available */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-xl md:text-2xl font-black text-jozi-forest">R{displayPrice}</span>
                {originalPrice && <span className="text-sm md:text-base text-gray-300 line-through font-bold">R{originalPrice}</span>}
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
                <div className="space-y-2.5 md:space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-jozi-forest/60">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const variantStock = variant.inventory?.quantityAvailable ?? variant.stock ?? 0;
                      const isOutOfStock = variantStock === 0;
                      
                      return (
                        <button 
                          type="button"
                          key={variant.id} 
                          onClick={() => !isOutOfStock && setSelectedVariant(variant.id || null)}
                          disabled={isOutOfStock}
                          className={`min-h-[44px] px-4 md:px-6 py-2.5 rounded-xl font-black text-xs transition-all border-2 relative active:scale-[0.98] ${
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
              <div className="pt-1 md:pt-2 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
                  <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-0">
                    <div className="flex items-center bg-jozi-cream rounded-2xl p-1 shrink-0 border border-jozi-forest/5 shadow-inner">
                      <button 
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        disabled={stock === 0}
                        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all ${stock === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-white text-jozi-forest active:bg-white'}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-black text-lg text-jozi-forest tabular-nums">{quantity}</span>
                      <button 
                        type="button"
                        onClick={() => setQuantity(Math.min(stock, quantity + 1))} 
                        disabled={stock === 0 || quantity >= stock}
                        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all ${stock === 0 || quantity >= stock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-white text-jozi-forest active:bg-white'}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button type="button" className="sm:hidden min-h-[44px] min-w-[44px] p-3 bg-white border border-jozi-forest/10 rounded-2xl text-jozi-forest active:bg-red-50 active:text-red-500 transition-all shadow-sm" aria-label="Save to wishlist">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddToCart} 
                    disabled={stock === 0}
                    className={`w-full sm:grow sm:w-auto py-3.5 min-h-[52px] px-6 md:px-8 rounded-2xl font-black text-sm md:text-base flex items-center justify-center shadow-xl transition-all group active:scale-[0.99] ${
                      stock === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                        : 'bg-jozi-forest text-white shadow-jozi-forest/20 md:hover:bg-jozi-dark md:hover:-translate-y-0.5'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-3 md:group-hover:scale-110 transition-transform shrink-0" />
                    {stock === 0 ? 'Out of Stock' : 'Add to Collection'}
                  </button>
                  <button type="button" className="hidden sm:flex p-4 bg-white border border-jozi-forest/10 rounded-2xl text-jozi-forest hover:bg-red-50 hover:text-red-500 transition-all shadow-md group min-h-[44px] min-w-[44px] items-center justify-center" aria-label="Save to wishlist">
                    <Heart className="w-5 h-5 group-hover:fill-current" />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-5 md:pt-6 border-t border-jozi-forest/5">
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
      <section className="container mx-auto px-3 md:px-4 mt-10 md:mt-24">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-20">
          <div className="lg:w-2/3 space-y-10 md:space-y-16">
            <div className="flex border-b border-jozi-forest/5 overflow-x-auto scrollbar-hide">
              {[{ id: 'specs', label: 'Product Information' }].map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)} className={`pb-4 md:pb-6 pr-8 md:pr-12 text-xs font-black uppercase tracking-[0.3em] transition-all relative shrink-0 min-h-[44px] ${activeTab === tab.id ? 'text-jozi-forest' : 'text-gray-400'}`}>
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-8 md:right-12 h-1 md:h-1.5 bg-jozi-gold rounded-full" />}
                </button>
              ))}
            </div>

            <div className="min-h-[200px] md:min-h-[250px] text-gray-500 leading-relaxed font-medium text-base md:text-lg">
              <AnimatePresence mode="wait">
                {activeTab === 'specs' && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
                      <span className="font-black text-jozi-forest uppercase tracking-widest text-[10px] md:text-xs">Category</span>
                      <span className="text-sm font-bold break-words">{categoryName}</span>
                    </div>
                    {subcategoryName && (
                      <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
                        <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Subcategory</span>
                        <span className="text-sm font-bold">{subcategoryName}</span>
                      </div>
                    )}
                    {/* Show pricing information */}
                    {(!product.variants || product.variants.length === 0) ? (
                      <>
                        {/* Products without variants: show regular price and discount price */}
                        <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
                          <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Regular Price</span>
                          <span className="text-sm font-bold">R{product.technicalDetails.regularPrice}</span>
                        </div>
                        {product.technicalDetails.discountPrice && (
                          <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
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
                            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
                              <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Variant Price</span>
                              <span className="text-sm font-bold">R{selectedVariantObj.price}</span>
                            </div>
                            {selectedVariantObj.discountPrice && (
                              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
                                <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Variant Discount Price</span>
                                <span className="text-sm font-bold">R{selectedVariantObj.discountPrice}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {/* Variant has no price, show product's regular price */}
                            <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
                              <span className="font-black text-jozi-forest uppercase tracking-widest text-xs">Regular Price</span>
                              <span className="text-sm font-bold">R{product.technicalDetails.regularPrice}</span>
                            </div>
                            {product.technicalDetails.discountPrice && (
                              <div className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
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
                          <div key={i} className="flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-0 py-4 md:py-5 border-b border-jozi-forest/5 group hover:bg-jozi-forest/5 px-3 md:px-4 rounded-xl transition-colors">
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
            <div className="bg-jozi-forest p-6 md:p-12 rounded-3xl md:rounded-5xl text-white flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group h-auto md:h-[320px]">
              <div className="absolute inset-0 bg-linear-to-br from-jozi-gold/20 to-transparent" />
              <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl md:rounded-4xl overflow-hidden shrink-0 border-4 md:border-8 border-white/10 shadow-2xl relative z-10 md:group-hover:scale-110 transition-transform duration-700">
                <img src={product.vendorLogo || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" alt={product.vendorName} loading="lazy" />
              </div>
              <div className="grow space-y-4 md:space-y-6 text-center md:text-left relative z-10 flex flex-col h-full justify-center">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-jozi-gold">Artisan Master</p>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight md:leading-none">{product.vendorName || 'Unknown Vendor'}</h3>
                </div>
                <p className="text-sm md:text-lg text-jozi-cream/70 font-medium leading-relaxed italic line-clamp-4 min-h-0 md:min-h-20">{product.vendorDescription || '"Our mission is to bring the soul of Johannesburg into every home."'}</p>
                <Link href={`/vendors/${product.userId}`} className="inline-flex items-center justify-center w-full sm:w-auto bg-white text-jozi-forest px-8 md:px-10 py-3.5 md:py-4 rounded-2xl font-black min-h-[48px] md:hover:bg-jozi-gold transition-all shadow-xl self-stretch sm:self-start mx-auto md:mx-0 active:scale-[0.99]">Visit Workshop <ChevronRight className="w-4 h-4 ml-2" /></Link>
              </div>
            </div>

            {/* --- THREE HORIZONTAL SECTIONS BEFORE REVIEWS --- */}

            {/* 1. You May Also Like */}
            <div className="space-y-5 md:space-y-8">
              <div className="flex items-end justify-between gap-3 px-0 md:px-2">
                <h3 className="text-lg md:text-2xl font-black text-jozi-forest tracking-tight">
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
                  type="button"
                  onClick={() => scrollLeft(alsoLikeRef)}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  ref={alsoLikeRef}
                  className="flex gap-3 md:gap-4 overflow-x-auto pb-6 md:pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth pl-0 pr-1 md:px-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '812px' }}
                >
                  {products.slice(0, 6).map((item) => (
                    <div key={`also-like-${item.id}`} className="w-[min(260px,85vw)] md:w-[260px] shrink-0 snap-start">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => scrollRight(alsoLikeRef)}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Popular Picks in this Category */}
            <div className="space-y-5 md:space-y-8">
              <div className="flex items-end justify-between gap-3 px-0 md:px-2">
                <h3 className="text-base md:text-xl font-black text-jozi-forest tracking-tight leading-snug">Popular Picks in <span className="text-jozi-gold">{categoryName}</span></h3>
                <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-jozi-forest transition-colors flex items-center">View Full Category <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => scrollLeft(popularPicksRef)}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  ref={popularPicksRef}
                  className="flex gap-3 md:gap-4 overflow-x-auto pb-6 md:pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth pl-0 pr-1 md:px-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '812px' }}
                >
                  {products.filter(p => p.category === categoryName).slice(0, 6).map((item) => (
                    <div key={`popular-${item.id}`} className="w-[min(260px,85vw)] md:w-[260px] shrink-0 snap-start">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => scrollRight(popularPicksRef)}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>


            {/* 3. Related Treasures */}
            <div className="space-y-5 md:space-y-8">
              <div className="flex items-end justify-between gap-3 px-0 md:px-2">
                <h3 className="text-base md:text-xl font-black text-jozi-forest tracking-tight">Related <span className="text-jozi-gold">Treasures</span></h3>
                <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-jozi-forest transition-colors flex items-center">View More <ChevronRight className="w-3 h-3 ml-1" /></Link>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => scrollLeft(relatedTreasuresRef)}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  ref={relatedTreasuresRef}
                  className="flex gap-3 md:gap-4 overflow-x-auto pb-6 md:pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth pl-0 pr-1 md:px-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '812px' }}
                >
                  {products.slice(6, 12).map((item) => (
                    <div key={`related-tr-${item.id}`} className="w-[min(260px,85vw)] md:w-[260px] shrink-0 snap-start">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => scrollRight(relatedTreasuresRef)}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-jozi-forest/10 items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 md:space-y-10 pt-8 md:pt-10 border-t border-jozi-forest/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-jozi-forest tracking-tight">Neighborhood Feedback</h3>
                  <p className="text-gray-400 font-medium text-sm mt-1">Real thoughts from real supporters.</p>
                </div>
                <button type="button" onClick={() => setIsReviewModalOpen(true)} className="bg-jozi-gold text-jozi-forest px-6 md:px-8 py-3 min-h-[48px] rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-jozi-gold/20 md:hover:scale-105 transition-all flex items-center justify-center w-full md:w-auto active:scale-[0.99]">
                  <MessageSquare className="w-4 h-4 mr-2 shrink-0" />Write a Review
                </button>
              </div>
              <div className="space-y-4 md:space-y-6">
                <AnimatePresence mode="popLayout">
                  {reviewsList.map((review) => (
                    <motion.div layout key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 md:p-8 bg-white rounded-2xl md:rounded-3xl border border-jozi-forest/5 shadow-sm group hover:shadow-md transition-all">
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
                      <p className="mt-4 md:mt-6 text-gray-500 font-medium text-sm md:text-base leading-relaxed italic break-words">&quot;{review.comment}&quot;</p>
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
          <aside className="lg:w-1/3 space-y-8 md:space-y-12">
            <div className="bg-white p-5 md:p-10 rounded-3xl md:rounded-5xl border border-jozi-forest/5 shadow-soft space-y-6 md:space-y-8 lg:sticky lg:top-24">
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