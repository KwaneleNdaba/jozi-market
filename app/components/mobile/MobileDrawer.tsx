'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * MobileDrawer - Reusable slide-in drawer component
 * 
 * DESIGN PRINCIPLES:
 * - Slides from right (default) or left/bottom
 * - Backdrop blur with tap-to-close
 * - Spring animation for smooth feel
 * - Full height with rounded top corners
 * - Safe area support for iOS notch
 * 
 * PROPS:
 * - isOpen: boolean - Controls visibility
 * - onClose: () => void - Close handler
 * - title?: string - Optional drawer title
 * - from?: 'right' | 'left' | 'bottom' - Slide direction
 * - children: ReactNode - Drawer content
 * 
 * USAGE:
 * <MobileDrawer isOpen={open} onClose={() => setOpen(false)} title="Filters">
 *   <FilterContent />
 * </MobileDrawer>
 */

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  from?: 'right' | 'left' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  from = 'right',
  children,
  className = ''
}) => {
  
  const getInitialPosition = () => {
    switch(from) {
      case 'left': return { x: '-100%' };
      case 'right': return { x: '100%' };
      case 'bottom': return { y: '100%' };
      default: return { x: '100%' };
    }
  };

  const getPosition = () => {
    switch(from) {
      case 'left': return 'left-0 top-0 bottom-0';
      case 'right': return 'right-0 top-0 bottom-0';
      case 'bottom': return 'left-0 right-0 bottom-0';
      default: return 'right-0 top-0 bottom-0';
    }
  };

  const getSize = () => {
    switch(from) {
      case 'bottom': return 'max-h-[85vh] rounded-t-3xl';
      default: return 'w-full max-w-md';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-jozi-dark/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={getInitialPosition()}
            animate={{ x: 0, y: 0 }}
            exit={getInitialPosition()}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed ${getPosition()} ${getSize()} bg-white shadow-2xl z-[61] flex flex-col ${className}`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                <h2 className="text-lg font-black text-jozi-forest uppercase tracking-wide">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
