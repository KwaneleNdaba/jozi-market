'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Eye, Heart, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-jozi-forest/5 transition-all duration-500 h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-4/5 overflow-hidden bg-jozi-cream shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Discount/Stock Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.originalPrice && (
            <span className="bg-red-500 text-white text-[8px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          {product.stock === 0 ? (
            <span className="bg-gray-500 text-white text-[8px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Out of Stock
            </span>
          ) : product.stock < 10 ? (
            <span className="bg-jozi-dark text-white text-[8px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="bg-green-500 text-white text-[8px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              {product.stock} In Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-jozi-forest hover:bg-white hover:text-red-500 transition-all shadow-sm">
          <Heart className="w-4 h-4" />
        </button>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-jozi-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Link 
            href={`/product/${product.id}`}
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-jozi-forest hover:bg-jozi-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl"
          >
            <Eye className="w-5 h-5" />
          </Link>
          {product.stock > 0 && (
            <button 
              className="w-11 h-11 bg-jozi-forest rounded-full flex items-center justify-center text-white hover:bg-jozi-gold transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 shadow-xl"
              onClick={(e) => {
                e.preventDefault();
                addItem(product, 1);
              }}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-jozi-gold uppercase tracking-[0.2em]">{product.category}</span>
          <div className="flex items-center bg-jozi-forest/5 px-2 py-0.5 rounded-lg">
            <Star className="w-2.5 h-2.5 text-jozi-gold fill-current" />
            <span className="text-[9px] font-black ml-1 text-jozi-forest">{product.rating}</span>
          </div>
        </div>
        
        <Link href={`/product/${product.id}`} className="block grow">
          <h3 className="font-black text-jozi-forest text-base line-clamp-1 group-hover:text-jozi-gold transition-colors tracking-tight leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] text-gray-400 mt-0.5 font-medium italic">
          by <span className="font-black text-jozi-forest/60 group-hover:text-jozi-gold transition-colors">{product.vendor.name}</span>
        </p>
        
        <div className="mt-4 flex items-center justify-between border-t border-jozi-forest/5 pt-4">
          <div className="flex flex-col">
            {product.priceLabel && (
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                {product.priceLabel}
              </span>
            )}
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-jozi-forest">R{product.price}</span>
              {product.originalPrice && (
                <span className="text-[10px] text-gray-300 line-through font-bold italic">R{product.originalPrice}</span>
              )}
            </div>
            {product.variantCount && product.variantCount > 1 && (
              <span className="text-[8px] text-jozi-gold font-bold mt-0.5 uppercase tracking-wide">
                {product.variantCount} Options Available
              </span>
            )}
            <span className="text-[9px] text-gray-400 font-bold mt-0.5">
              {product.stock === 0 ? (
                <span className="text-red-500">Out of Stock</span>
              ) : product.stock < 10 ? (
                <span className="text-orange-500">{product.stock} left</span>
              ) : (
                <span className="text-green-600">{product.stock} available</span>
              )}
            </span>
          </div>
          <button 
            className={`p-2.5 rounded-xl transition-all group/btn shadow-sm ${
              product.stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-jozi-forest/5 hover:bg-jozi-forest hover:text-white text-jozi-forest'
            }`}
            onClick={() => product.stock > 0 && addItem(product, 1)}
            disabled={product.stock === 0}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
