'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * StickyBottomBar - Fixed bottom CTA bar for mobile
 * 
 * DESIGN PRINCIPLES:
 * - Fixed to bottom with safe area support
 * - Blur backdrop for content visibility
 * - Minimum 48px button height
 * - Clear visual hierarchy
 * - Shadow for elevation feel
 * 
 * USE CASES:
 * - Product detail "Add to Cart"
 * - Checkout "Place Order"
 * - Filter "Apply Filters"
 * - Form submissions
 * 
 * PROPS:
 * - primaryLabel: Main CTA text
 * - onPrimaryClick: Main action handler
 * - primaryDisabled?: Disable state
 * - secondaryLabel?: Optional secondary action
 * - onSecondaryClick?: Secondary handler
 * - price?: Show price (e.g., cart total)
 * - className?: Additional styles
 */

interface StickyBottomBarProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  price?: string | number;
  priceLabel?: string;
  className?: string;
  showBorder?: boolean;
}

const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  primaryLabel,
  onPrimaryClick,
  primaryDisabled = false,
  primaryLoading = false,
  secondaryLabel,
  onSecondaryClick,
  price,
  priceLabel = 'Total',
  className = '',
  showBorder = true,
}) => {
  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-20 lg:h-0" />

      {/* Sticky Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-40 lg:hidden pb-safe ${
          showBorder ? 'border-t border-gray-200' : ''
        } shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${className}`}
      >
        <div className="px-4 py-3">
          {/* Price Display (if provided) */}
          {price !== undefined && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                {priceLabel}
              </span>
              <span className="text-2xl font-black text-jozi-forest">
                {typeof price === 'number' ? `R${price.toFixed(2)}` : price}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`flex gap-3 ${secondaryLabel ? '' : ''}`}>
            {/* Secondary Button (if provided) */}
            {secondaryLabel && onSecondaryClick && (
              <button
                onClick={onSecondaryClick}
                className="flex-1 min-h-[48px] px-6 py-3 bg-gray-100 text-jozi-forest font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
              >
                {secondaryLabel}
              </button>
            )}

            {/* Primary Button */}
            <button
              onClick={onPrimaryClick}
              disabled={primaryDisabled || primaryLoading}
              className={`${
                secondaryLabel ? 'flex-[2]' : 'w-full'
              } min-h-[48px] px-6 py-3 bg-jozi-forest text-white font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-jozi-forest/20 text-sm uppercase tracking-wide flex items-center justify-center gap-2`}
            >
              {primaryLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                primaryLabel
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default StickyBottomBar;
