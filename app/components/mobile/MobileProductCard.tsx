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
        whileTap={{ scale: 0.98 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-lg border border-jozi-forest/5 transition-all duration-200 h-full flex flex-col"
      >
        {/* Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden bg-jozi-cream/30 shrink-0">
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
            className="absolute top-2 right-2 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 active:scale-90 transition-all shadow-sm min-h-[44px] min-w-[44px]"
            style={{ marginTop: '-2.5px', marginRight: '-2.5px' }} // Extend tap area
          >
            <Heart className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Quick Add Button - Bottom Right (on image) */}
          {product.stock > 0 && (
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-2 right-2 z-10 w-10 h-10 bg-jozi-forest text-white rounded-full flex items-center justify-center shadow-lg active:shadow-xl transition-all min-h-[44px] min-w-[44px]"
              style={{ marginBottom: '-2px', marginRight: '-2px' }}
            >
              {hasVariantsWithDifferentPrices ? (
                <Plus className="w-5 h-5" strokeWidth={3} />
              ) : (
                <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
              )}
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Vendor Name */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {product.vendor?.name || 'Local Vendor'}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-black text-jozi-forest leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-bold">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-jozi-forest">
                R{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through font-bold">
                  R{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {hasVariantsWithDifferentPrices && (
              <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                Multiple options available
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MobileProductCard;
