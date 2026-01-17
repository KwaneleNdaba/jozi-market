'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import { products, MARKET_CATEGORIES } from '../../data/mockData';

const ShopPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState('Featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const selectedCategory = searchParams.get('category') || 'All';
  const selectedSubcategory = searchParams.get('subcategory') || null;

  const activeCategoryData = useMemo(() => 
    MARKET_CATEGORIES.find(c => c.name === selectedCategory),
  [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    // Simple sort logic
    if (sortBy === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Newest') {
      result = [...result].reverse(); // Simple mock reversal
    }
    
    return result;
  }, [selectedCategory, selectedSubcategory, sortBy]);

  const handleCategoryFilter = (cat: string) => {
    if (cat === 'All') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${encodeURIComponent(cat)}`);
    }
  };

  const handleSubcategoryFilter = (sub: string) => {
    router.push(`/shop?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(sub)}`);
  };

  const removeSubcategory = () => {
    router.push(`/shop?category=${encodeURIComponent(selectedCategory)}`);
  };

  return (
    <div className="container mx-auto px-4 py-1 mt-15">
      {/* Active Filters Bar */}
      {(selectedCategory !== 'All' || selectedSubcategory) && (
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Filters:</span>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => handleCategoryFilter('All')}
              className="flex items-center bg-jozi-forest text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-jozi-dark transition-all"
            >
              Category: {selectedCategory}
              <X className="ml-2 w-3 h-3" />
            </button>
          )}
          {selectedSubcategory && (
            <button 
              onClick={removeSubcategory}
              className="flex items-center bg-jozi-gold text-jozi-forest px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white border border-jozi-gold transition-all"
            >
              Sub: {selectedSubcategory}
              <X className="ml-2 w-3 h-3" />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters - Sidebar */}
        <aside className="w-full lg:w-72 space-y-10 shrink-0">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-jozi-forest mb-6 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-jozi-gold" />
              Categories
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleCategoryFilter('All')}
                className={`w-full text-left px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedCategory === 'All' 
                    ? 'bg-jozi-forest text-white shadow-xl' 
                    : 'text-gray-400 hover:bg-jozi-forest/5'
                }`}
              >
                All Treasures
              </button>
              {MARKET_CATEGORIES.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <button 
                    onClick={() => handleCategoryFilter(cat.name)}
                    className={`w-full text-left px-5 py-3 rounded-xl font-bold text-sm transition-all flex justify-between items-center ${
                      selectedCategory === cat.name 
                        ? 'bg-jozi-forest text-white shadow-xl' 
                        : 'text-gray-400 hover:bg-jozi-forest/5'
                    }`}
                  >
                    {cat.name}
                    {selectedCategory === cat.name && <ChevronDown className="w-4 h-4 opacity-50" />}
                  </button>
                  
                  {/* Nested Subcategories in Sidebar */}
                  {selectedCategory === cat.name && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pl-6 py-2 space-y-1"
                    >
                      {cat.subcategories.map(sub => (
                        <button
                          key={sub}
                          onClick={() => handleSubcategoryFilter(sub)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedSubcategory === sub 
                              ? 'text-jozi-gold bg-jozi-gold/10' 
                              : 'text-gray-400 hover:text-jozi-forest'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-jozi-forest mb-6 flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-jozi-gold" />
              Price Range
            </h3>
            <div className="space-y-6">
              <input type="range" className="w-full accent-jozi-forest" min="0" max="5000" />
              <div className="flex items-center justify-between text-[11px] font-black text-jozi-forest uppercase tracking-widest">
                <span>R0</span>
                <span className="bg-jozi-gold/10 px-3 py-1 rounded-md text-jozi-gold border border-jozi-gold/10">R5000+</span>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-jozi-dark rounded-4xl text-white relative overflow-hidden group">
            <Tag className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform duration-700" />
            <h4 className="text-lg font-black leading-tight mb-4">Want Free <br />Delivery?</h4>
            <p className="text-[11px] text-white/50 leading-relaxed font-medium mb-6">Spend over R1000 and we&apos;ll courier your treasures anywhere in GP for free.</p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-jozi-gold w-1/3" />
            </div>
          </div>
        </aside>

        {/* Product Listing */}
        <div className="grow space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-jozi-forest/5 shadow-soft">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Found <span className="text-jozi-forest">{filteredProducts.length}</span> pieces in <span className="text-jozi-gold">{selectedCategory}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-jozi-cream p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-jozi-forest' : 'text-gray-400'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-jozi-forest' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative group/sort">
                <button className="flex items-center space-x-3 bg-white border border-jozi-forest/10 px-5 py-3 rounded-xl font-black text-xs text-jozi-forest hover:border-jozi-forest/30 transition-all">
                  <span>Sort: {sortBy}</span>
                  <ChevronDown className="w-4 h-4 text-jozi-gold" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-jozi-forest/5 py-3 opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-20 scale-95 group-hover/sort:scale-100 origin-top-right">
                  {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((opt) => (
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
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-32 text-center space-y-6 bg-white rounded-5xl border border-dashed border-jozi-forest/10 shadow-inner">
              <div className="w-20 h-20 bg-jozi-gold/10 rounded-full flex items-center justify-center mx-auto text-jozi-gold">
                <Tag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-jozi-forest tracking-tighter">No Treasures Found</h3>
                <p className="text-gray-400 max-sm mx-auto font-medium mt-2">We couldn&apos;t find any pieces matching these specific filters. Try exploring other categories.</p>
              </div>
              <button 
                onClick={() => handleCategoryFilter('All')}
                className="bg-jozi-forest text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all"
              >
                Explore Full Market
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
