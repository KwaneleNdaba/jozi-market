'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List, Tag, X, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import MobileProductCard from '../../components/mobile/MobileProductCard';
import { getAllCategoriesAction } from '../../actions/category/index';
import { getAllProductsAction, getProductsByCategoryIdAction, getProductsBySubcategoryIdAction } from '../../actions/product/index';
import { ICategoryWithSubcategories } from '@/interfaces/category/category';
import { IProduct } from '@/interfaces/product/product';
import { Product } from '../../types';
import { useProductsSocket } from '@/app/hooks/useSocket';

const ShopPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState('Featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<ICategoryWithSubcategories[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  
  // Infinite scroll state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  const selectedCategory = searchParams.get('category') || 'All';
  const selectedSubcategory = searchParams.get('subcategory') || null;
  const selectedCategoryId = searchParams.get('categoryId') || null;
  const selectedSubcategoryId = searchParams.get('subcategoryId') || null;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesAction('Active');
        if (!response.error && response.data) {
          // Filter only top-level categories
          const topLevelCategories = response.data.filter(cat => !cat.categoryId || cat.categoryId === null);
          setCategories(topLevelCategories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Reset and fetch first page when filters change
  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setLoadingProducts(true);
  }, [selectedCategoryId, selectedSubcategoryId, selectedCategory, selectedSubcategory]);

  // Fetch products for the current page and accumulate
  useEffect(() => {
    const fetchProducts = async () => {
      const isFirstPage = currentPage === 1;
      if (isFirstPage) {
        setLoadingProducts(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let response;
        
        if (selectedSubcategoryId) {
          response = await getProductsBySubcategoryIdAction(selectedSubcategoryId, {
            page: currentPage,
            limit: itemsPerPage
          });
        } else if (selectedCategoryId && selectedCategory !== 'All') {
          response = await getProductsByCategoryIdAction(selectedCategoryId, {
            page: currentPage,
            limit: itemsPerPage
          });
        } else {
          response = await getAllProductsAction({
            status: 'Active',
            page: currentPage,
            limit: itemsPerPage
          });
        }

        if (!response.error && response.data) {
          if (response.pagination) {
            setHasMore(response.pagination.hasNextPage);
            setProducts(prev => isFirstPage ? response.data! : [...prev, ...response.data!]);
          } else {
            const activeProducts = response.data.filter(p => p.status === 'Active');
            setProducts(prev => isFirstPage ? activeProducts : [...prev, ...activeProducts]);
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
        setLoadingMore(false);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId, selectedSubcategoryId, selectedCategory, selectedSubcategory, currentPage]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingProducts) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadingProducts]);

  // Handle real-time stock updates via WebSocket
  const handleStockUpdate = useCallback((data: any) => {
    console.log('[ShopPage] 🔄 Real-time stock update received:', data);
    
    setProducts(prevProducts => 
      prevProducts.map(product => {
        // Update product stock if it matches
        if (product.id === data.productId) {
          if (data.type === 'product') {
            // Use quantityAvailable as the primary field
            const currentStock = product.inventory?.quantityAvailable ?? 0;
            const newStock = data.quantityAvailable ?? data.stock ?? currentStock;
            
            const updatedProduct = {
              ...product,
              inventory: {
                quantityAvailable: data.quantityAvailable ?? currentStock,
                quantityReserved: data.quantityReserved ?? product.inventory?.quantityReserved ?? 0,
                reorderLevel: data.reorderLevel ?? product.inventory?.reorderLevel ?? 0,
              },
            };
            console.log('[ShopPage] ✅ Updated product stock:', { 
              productId: product.id, 
              oldStock: currentStock, 
              newStock: updatedProduct.inventory.quantityAvailable,
              quantityAvailable: data.quantityAvailable,
              quantityReserved: data.quantityReserved
            });
            return updatedProduct;
          } else if (data.type === 'variant' && product.variants) {
            // Update specific variant inventory
            return {
              ...product,
              variants: product.variants.map(variant => 
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
        }
        return product;
      })
    );
  }, []);

  // Subscribe to WebSocket updates for all visible products
  const productIds = useMemo(() => products.map(p => p.id).filter(Boolean) as string[], [products]);
  useProductsSocket(productIds, handleStockUpdate);

  // Transform IProduct to Product format for ProductCard
  const transformProduct = (product: IProduct): Product => {
    // Get first image URL
    const firstImage = product.images && product.images.length > 0 
      ? product.images[0].file 
      : 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400';
    
    // Get all image URLs
    const imageUrls = product.images && product.images.length > 0
      ? product.images.map(img => img.file)
      : [firstImage];

    // Check if product has variants with prices
    const hasVariants = product.variants && product.variants.length > 0;
    const variantsWithPrices = hasVariants 
      ? product.variants?.filter(v => v.price && v.price > 0) || []
      : [];
    
    // Determine pricing strategy
    let displayPrice: number;
    let displayOriginalPrice: number | undefined;
    let priceLabel: string | undefined;
    
    if (variantsWithPrices.length > 0) {
      // Product has variants with individual prices
      // ONLY use variant pricing, completely ignore product-level pricing
      const firstVariant = variantsWithPrices[0];
      
      // If variant has a discount price, show it with original price strikethrough
      if (firstVariant.discountPrice && firstVariant.discountPrice > 0) {
        displayPrice = firstVariant.discountPrice;
        displayOriginalPrice = firstVariant.price;
      } else {
        // Variant has no discount, just show the regular price
        displayPrice = firstVariant.price;
        displayOriginalPrice = undefined; // No strikethrough
      }
      
      // Add label to indicate multiple variant prices
      if (variantsWithPrices.length > 1) {
        priceLabel = `Starting from`;
      }
    } else {
      // Product uses single price for all variants or has no variants
      // Use product-level pricing
      if (product.technicalDetails.discountPrice && product.technicalDetails.discountPrice > 0) {
        displayPrice = product.technicalDetails.discountPrice;
        displayOriginalPrice = product.technicalDetails.regularPrice;
      } else {
        displayPrice = product.technicalDetails.regularPrice;
        displayOriginalPrice = undefined;
      }
    }
    
    // Calculate stock - from variants or inventory/initialStock
    let stock = 0;
    
    if (hasVariants && product.variants) {
      // Sum all variant stocks if product has variants
      stock = product.variants.reduce((sum, v) => {
        // Prefer inventory.quantityAvailable over stock field
        const variantStock = v.inventory?.quantityAvailable ?? v.stock ?? 0;
        return sum + variantStock;
      }, 0);
    } else {
      // Use inventory data if available, otherwise fall back to initialStock
      stock = product.inventory?.quantityAvailable ?? product.technicalDetails.initialStock ?? 0;
    }

    // Get category name - we'll need to find it from categories
    const categoryName = categories.find(cat => cat.id === product.technicalDetails.categoryId)?.name || 'Uncategorized';
    const subcategoryName = categories
      .flatMap(cat => cat.subcategories || [])
      .find(sub => sub.id === product.technicalDetails.subcategoryId)?.name;

    return {
      id: product.id || '',
      name: product.title,
      description: product.description,
      price: displayPrice,
      originalPrice: displayOriginalPrice,
      priceLabel: priceLabel,
      variantCount: variantsWithPrices.length > 1 ? variantsWithPrices.length : undefined,
      category: categoryName,
      subcategory: subcategoryName,
      vendor: {
        id: product.userId,
        name: product.vendorName || 'Unknown Vendor',
        rating: 4.5, // Hardcoded for now
      },
      images: imageUrls,
      rating: 4.5, // Hardcoded for now
      reviewCount: 12, // Hardcoded for now
      stock: stock,
      tags: [], // Can be derived from attributes or notes if needed
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

  const transformedProducts = useMemo(() => {
    return products.map(transformProduct);
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    let result = transformedProducts;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.vendor.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(query))
      );
    }

    // Apply price range filter
    result = result.filter(product => {
      const productPrice = product.price;
      return productPrice >= priceRange.min && productPrice <= priceRange.max;
    });

    // Apply sort logic
    if (sortBy === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Newest') {
      // Sort by createdAt if available, otherwise reverse
      result = [...result].sort((a, b) => {
        const aDate = products.find(p => p.id === a.id)?.createdAt;
        const bDate = products.find(p => p.id === b.id)?.createdAt;
        if (aDate && bDate) {
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        }
        return 0;
      });
    }
    
    return result;
  }, [transformedProducts, sortBy, searchQuery, priceRange, products]);

  const handleCategoryFilter = (cat: string, catId?: string) => {
    if (cat === 'All') {
      router.push('/shop');
    } else {
      const params = new URLSearchParams();
      params.set('category', cat);
      if (catId) params.set('categoryId', catId);
      router.push(`/shop?${params.toString()}`);
    }
  };

  const handleSubcategoryFilter = (sub: string, subId?: string) => {
    const params = new URLSearchParams();
    params.set('category', selectedCategory);
    if (selectedCategoryId) params.set('categoryId', selectedCategoryId);
    params.set('subcategory', sub);
    if (subId) params.set('subcategoryId', subId);
    router.push(`/shop?${params.toString()}`);
  };

  const removeSubcategory = () => {
    const params = new URLSearchParams();
    params.set('category', selectedCategory);
    if (selectedCategoryId) params.set('categoryId', selectedCategoryId);
    router.push(`/shop?${params.toString()}`);
  };

  const activeCategory = categories.find(cat => cat.name === selectedCategory);
  const activeSubcategories = activeCategory?.subcategories || [];

  const [showMobileTopbar, setShowMobileTopbar] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const SCROLL_THRESHOLD = 10;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (delta < -SCROLL_THRESHOLD) {
          setShowMobileTopbar(true);
        } else if (delta > SCROLL_THRESHOLD) {
          setShowMobileTopbar(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="container mx-auto px-3 lg:px-4 py-1 mt-15">

      {/* ===== MOBILE: Smart Sticky Category + Subcategory Topbar ===== */}
      <div
        className="lg:hidden fixed top-[60px] left-0 right-0 z-30 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: showMobileTopbar ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        {/* Categories - Horizontal Pill Scroll */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2.5 shadow-sm">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => handleCategoryFilter('All')}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
                selectedCategory === 'All'
                  ? 'bg-jozi-forest text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.name, cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
                  selectedCategory === cat.name
                    ? 'bg-jozi-forest text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories - Show under selected category */}
        {activeSubcategories.length > 0 && selectedCategory !== 'All' && (
          <div className="bg-gray-50/95 backdrop-blur-sm px-4 py-2 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={removeSubcategory}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                  !selectedSubcategory
                    ? 'bg-jozi-gold text-white'
                    : 'bg-white text-gray-500 border border-gray-200 active:bg-gray-100'
                }`}
              >
                All {selectedCategory}
              </button>
              {activeSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubcategoryFilter(sub.name, sub.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                    selectedSubcategory === sub.name
                      ? 'bg-jozi-gold text-white'
                      : 'bg-white text-gray-500 border border-gray-200 active:bg-gray-100'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Spacer to offset the fixed topbar */}
      <div className={`lg:hidden ${activeSubcategories.length > 0 && selectedCategory !== 'All' ? 'h-[88px]' : 'h-[52px]'}`} />

      {/* ===== MOBILE: Search, Sort, Filters (normal flow) ===== */}
      <div className="lg:hidden mb-3">
        {/* Mobile: Search + Sort Row */}
        <div className="pt-2 pb-2 flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium outline-none border border-transparent focus:border-jozi-gold focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shrink-0 bg-gray-100 rounded-xl px-3 py-2.5 text-[11px] font-bold text-gray-600 outline-none border border-transparent focus:border-jozi-gold appearance-none min-h-[40px]"
          >
            {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Mobile: Active Filters (compact) */}
        {(selectedCategory !== 'All' || selectedSubcategory || searchQuery.trim()) && (
          <div className="pb-2 flex gap-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0 self-center">Filters:</span>
            {selectedCategory !== 'All' && (
              <button onClick={() => handleCategoryFilter('All')} className="shrink-0 flex items-center bg-jozi-forest/10 text-jozi-forest px-2.5 py-1 rounded-lg text-[10px] font-bold">
                {selectedCategory} <X className="ml-1 w-3 h-3" />
              </button>
            )}
            {selectedSubcategory && (
              <button onClick={removeSubcategory} className="shrink-0 flex items-center bg-jozi-gold/10 text-jozi-gold px-2.5 py-1 rounded-lg text-[10px] font-bold">
                {selectedSubcategory} <X className="ml-1 w-3 h-3" />
              </button>
            )}
            {searchQuery.trim() && (
              <button onClick={() => setSearchQuery('')} className="shrink-0 flex items-center bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                &quot;{searchQuery}&quot; <X className="ml-1 w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Mobile: Results count */}
        <div className="pb-1">
          <p className="text-[11px] text-gray-400 font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      {/* ===== DESKTOP: Active Filters Bar ===== */}
      {(selectedCategory !== 'All' || selectedSubcategory || searchQuery.trim() || priceRange.min > 0 || priceRange.max < 5000) && (
        <div className="hidden lg:flex flex-wrap items-center gap-3 mb-8">
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
          {searchQuery.trim() && (
            <button 
              onClick={() => setSearchQuery('')}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
            >
              Search: &quot;{searchQuery}&quot;
              <X className="ml-2 w-3 h-3" />
            </button>
          )}
          {(priceRange.min > 0 || priceRange.max < 5000) && (
            <button 
              onClick={() => setPriceRange({ min: 0, max: 5000 })}
              className="flex items-center bg-jozi-gold/10 text-jozi-gold border border-jozi-gold/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all whitespace-nowrap"
            >
              Price: R{priceRange.min} - R{priceRange.max}
              <X className="ml-2 w-3 h-3" />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters - Sidebar (Desktop only) */}
        <aside className="hidden lg:block w-72 space-y-10 shrink-0">
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
              {categories.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-jozi-gold animate-spin" />
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <button 
                      onClick={() => handleCategoryFilter(cat.name, cat.id)}
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
                    {selectedCategory === cat.name && cat.subcategories && cat.subcategories.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pl-6 py-2 space-y-1"
                      >
                        {cat.subcategories.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubcategoryFilter(sub.name, sub.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                              selectedSubcategory === sub.name 
                                ? 'text-jozi-gold bg-jozi-gold/10' 
                                : 'text-gray-400 hover:text-jozi-forest'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-jozi-forest mb-6 flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-jozi-gold" />
              Price Range
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Min (R)</label>
                    <input
                      type="number"
                      min="0"
                      max={priceRange.max}
                      value={priceRange.min}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(priceRange.max, parseInt(e.target.value) || 0));
                        setPriceRange(prev => ({ ...prev, min: value }));
                      }}
                      className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold text-jozi-forest outline-none border-2 border-jozi-forest/10 focus:border-jozi-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Max (R)</label>
                    <input
                      type="number"
                      min={priceRange.min}
                      max="5000"
                      value={priceRange.max}
                      onChange={(e) => {
                        const value = Math.max(priceRange.min, Math.min(5000, parseInt(e.target.value) || 5000));
                        setPriceRange(prev => ({ ...prev, max: value }));
                      }}
                      className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold text-jozi-forest outline-none border-2 border-jozi-forest/10 focus:border-jozi-gold"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={priceRange.min}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin <= priceRange.max) {
                        setPriceRange(prev => ({ ...prev, min: newMin }));
                      }
                    }}
                    className="w-full accent-jozi-forest absolute"
                    style={{ zIndex: 2 }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={priceRange.max}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax >= priceRange.min) {
                        setPriceRange(prev => ({ ...prev, max: newMax }));
                      }
                    }}
                    className="w-full accent-jozi-gold"
                    style={{ zIndex: 1 }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-black text-jozi-forest uppercase tracking-widest">
                  <span>R{priceRange.min}</span>
                  <span className="bg-jozi-gold/10 px-3 py-1 rounded-md text-jozi-gold border border-jozi-gold/10">R{priceRange.max}</span>
                </div>
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
        <div className="grow space-y-4 lg:space-y-8">
          {/* Header Actions (Desktop only) */}
          <div className="hidden lg:flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-jozi-forest/5 shadow-soft">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl pl-10 pr-10 py-3 font-bold text-xs outline-none border-2 border-jozi-forest/10 focus:border-jozi-gold transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-jozi-forest transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Found <span className="text-jozi-forest">{filteredProducts.length}</span> pieces
                </p>
              </div>
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

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="flex items-center justify-center py-20 lg:py-32">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-6 h-6 lg:w-8 lg:h-8 text-jozi-gold animate-spin" />
                <p className="text-xs lg:text-sm font-bold text-gray-400">Loading products...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile: 2-column grid with MobileProductCard */}
              <div className="lg:hidden grid grid-cols-2 gap-2">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MobileProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Desktop: Original grid with ProductCard */}
              <div className={`hidden lg:grid gap-6 ${viewMode === 'grid' ? 'grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
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
            </>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && !loadingProducts && (
            <div className="py-16 lg:py-32 text-center space-y-4 lg:space-y-6 bg-white rounded-3xl lg:rounded-5xl border border-dashed border-jozi-forest/10 shadow-inner mx-1 lg:mx-0">
              <div className="w-14 h-14 lg:w-20 lg:h-20 bg-jozi-gold/10 rounded-full flex items-center justify-center mx-auto text-jozi-gold">
                <Tag className="w-7 h-7 lg:w-10 lg:h-10" />
              </div>
              <div>
                <h3 className="text-xl lg:text-3xl font-black text-jozi-forest tracking-tighter">No Treasures Found</h3>
                <p className="text-gray-400 text-xs lg:text-base max-w-sm mx-auto font-medium mt-1.5 lg:mt-2 px-4 lg:px-0">We couldn&apos;t find any pieces matching these specific filters. Try exploring other categories.</p>
              </div>
              <button 
                onClick={() => handleCategoryFilter('All')}
                className="bg-jozi-forest text-white px-6 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-sm lg:text-base shadow-xl active:scale-95 lg:hover:scale-105 transition-all"
              >
                Explore Full Market
              </button>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-jozi-gold animate-spin" />
                <p className="text-xs font-bold text-gray-400">Loading more products...</p>
              </div>
            </div>
          )}

          {/* End of results */}
          {!hasMore && filteredProducts.length > 0 && !loadingProducts && (
            <div className="text-center py-6 pb-8 lg:pb-6">
              <p className="text-[11px] lg:text-xs text-gray-400 font-bold">
                Showing all {filteredProducts.length} products
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
