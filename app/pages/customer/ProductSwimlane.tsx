'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '@/app/components/ProductCard';

interface ProductSwimlaneProps {
  title: string;
  subtitle?: string;
  items: any[]; // Ideally, replace 'any' with your 'IProduct' interface
  link?: string;
}

const ProductSwimlane: React.FC<ProductSwimlaneProps> = ({ title, subtitle, items, link }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 border-b border-gray-100 last:border-0">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-jozi-forest tracking-tight">{title}</h3>
            {subtitle && <p className="text-gray-500 text-sm font-medium mt-1">{subtitle}</p>}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            {link && (
              <Link href={link} className="hidden md:flex items-center text-sm font-bold text-jozi-gold hover:text-jozi-forest transition-colors">
                See All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            )}
            <div className="flex gap-1">
              <button 
                onClick={() => scroll('left')} 
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Scrolling Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[250px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}

          {/* "View All" Card at the end */}
          <Link 
            href={link || '/shop'} 
            className="min-w-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-jozi-gold hover:bg-white transition-all cursor-pointer group snap-start"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-jozi-forest" />
            </div>
            <span className="font-bold text-jozi-forest text-sm">View All</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductSwimlane;