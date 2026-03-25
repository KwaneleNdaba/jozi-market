'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Plus } from 'lucide-react';
import { Product } from '@/app/types';
import { useCart } from '@/app/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * MobileProductCard - Optimized product card for mobile devices
 * 
 * DESIGN PRINCIPLES:
 * - Vertical layout maximizing screen width
 * - 3:4 aspect ratio for product images
 * - Minimum 44px tap targets for buttons
 * - Sticky-feel with shadow on scroll
 * - Quick actions always accessible
 * - Clear visual hierarchy
 * 
 * RESPONSIVE BEHAVIOR:
 * - Mobile: Full width with horizontal padding
 * - Tablet: 2-column grid
 * - Desktop: 4-column grid (handled by parent)
 * 
 * PERFORMANCE:
 * - Image lazy loading
 * - Optimized animations (transform only)
 * - Minimal re-renders
 */

interface MobileProductCardProps {
  product: Product;
  priority?: boolean; // For above-fold images
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ product, priority = false }) => {
  const { addItem } = useCart();
  const router = useRouter();

  const hasVariantsWithDifferentPrices = product.variantCount && product.variantCount > 1;
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) return;

    if (hasVariantsWithDifferentPrices) {
      router.push(`/product/${product.id}`);
      return;
    }

    addItem(product, 1);
  };

  const handleQuickView = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 active:shadow-2xl transition-all duration-200 h-full flex flex-col cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative aspect-square sm:aspect-3/4 overflow-hidden bg-jozi-cream/30 shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105"
          />

          {/* Badges - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-md">
                -{discountPercent}%
              </span>
            )}
            {product.stock === 0 ? (
              <span className="bg-gray-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            ) : product.stock < 10 && (
              <span className="bg-jozi-dark text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-md">
                {product.stock} Left
              </span>
            )}
          </div>

          {/* Wishlist - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Implement wishlist
            }}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 active:scale-90 transition-all shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
          </button>

          {/* Quick Add Button - Bottom Right (on image) */}
          {product.stock > 0 && (
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.85, rotate: 15 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-red-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl active:shadow-2xl transition-all ring-2 ring-white/50"
            >
              {hasVariantsWithDifferentPrices ? (
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
              )}
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-2 sm:p-3 flex-1 flex flex-col">
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 truncate">
            {product.vendor?.name || 'Local Vendor'}
          </p>

          <h3 className="text-[11px] sm:text-sm font-black text-jozi-forest leading-tight mb-1 sm:mb-2 line-clamp-2 min-h-7 sm:min-h-10">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1 mb-1 sm:mb-2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />
              <span className="text-[10px] text-gray-500 font-bold">
                {product.rating} <span className="hidden sm:inline">({product.reviewCount || 0})</span>
              </span>
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-sm sm:text-lg font-black text-jozi-forest">
                R{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-bold">
                  R{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {hasVariantsWithDifferentPrices && (
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold mt-0.5">
                Multiple options
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MobileProductCard;
