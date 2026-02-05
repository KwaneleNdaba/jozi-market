'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '../types';
import { decodeAccessToken } from '@/lib/ecryptUser';
import { 
  getCartAction, 
  addToCartAction, 
  updateCartItemAction, 
  removeFromCartAction, 
  clearCartAction 
} from '../actions/cart/index';
import { ICartItem } from '@/interfaces/cart/cart';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variants?: Record<string, string>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to convert ICartItem to CartItem
const convertBackendItemToCartItem = (backendItem: ICartItem): CartItem | null => {
  if (!backendItem.product) return null;
  
  const product = backendItem.product;
  
  // Helper function to construct full S3 URL if needed
  const constructImageUrl = (filePath: string): string => {
    // If it's already a full URL (starts with http:// or https://), return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    // If it's a relative path, construct full S3 URL
    // Remove leading slash if present
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return `https://jozi-makert-s3-bucket.s3.af-south-1.amazonaws.com/${cleanPath}`;
  };

  // Handle images - extract from product.images array
  // Structure: [{ file: string, index: number }, ...]
  const imageUrls: string[] = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img: any) => {
      let imageUrl: string | null = null;
      
      // If image is a string, use it directly
      if (typeof img === 'string') {
        imageUrl = img;
      }
      // If image is an object with a file property (standard structure)
      else if (img && typeof img === 'object' && img.file) {
        imageUrl = img.file;
      }
      // If image is an object with a url property
      else if (img && typeof img === 'object' && img.url) {
        imageUrl = img.url;
      }
      
      // Construct full URL if needed and add to array
      if (imageUrl) {
        imageUrls.push(constructImageUrl(imageUrl));
      }
    });
  }

  // Determine price - check variant first if available, then product
  let basePrice = 0;
  let discountPrice: number | undefined = undefined;
  let variantStock = 0;

  if (backendItem.productVariantId && backendItem.variant) {
    // Use variant price from enriched variant data
    const variant = backendItem.variant;
    basePrice = typeof variant.price === 'string' ? parseFloat(variant.price) : (variant.price || 0);
    discountPrice = variant.discountPrice 
      ? (typeof variant.discountPrice === 'string' ? parseFloat(variant.discountPrice) : variant.discountPrice)
      : undefined;
    variantStock = variant.stock || 0;
  } else if (backendItem.productVariantId && product.variants && product.variants.length > 0) {
    // Fallback: Find the variant in product.variants array
    const variant = product.variants.find((v: any) => v.id === backendItem.productVariantId);
    if (variant) {
      basePrice = typeof variant.price === 'string' ? parseFloat(variant.price) : (variant.price || 0);
      discountPrice = variant.discountPrice 
        ? (typeof variant.discountPrice === 'string' ? parseFloat(variant.discountPrice) : variant.discountPrice)
        : undefined;
      variantStock = variant.stock || 0;
    }
  }

  // Fallback to product price if variant not found or no variant
  if (basePrice === 0) {
    // Check both locations for price (backend may send in either place)
    const productRegularPrice = product.regularPrice || product.technicalDetails?.regularPrice;
    const productDiscountPrice = product.discountPrice || product.technicalDetails?.discountPrice;
    
    basePrice = productRegularPrice 
      ? (typeof productRegularPrice === 'string' 
        ? parseFloat(productRegularPrice) 
        : productRegularPrice)
      : 0;
    discountPrice = productDiscountPrice && productDiscountPrice > 0
      ? (typeof productDiscountPrice === 'string'
        ? parseFloat(productDiscountPrice)
        : productDiscountPrice)
      : undefined;
  }

  // Final price calculation - ensure we have a valid price
  const finalPrice = discountPrice || basePrice;
  
  // Final check - if still 0, log warning
  const finalPriceValue = discountPrice || basePrice;
  if (finalPriceValue === 0) {
    console.warn('[CartContext] Product price is 0 for item:', {
      productId: product.id,
      productTitle: product.title,
      variantId: backendItem.productVariantId,
      hasRegularPrice: !!product.regularPrice,
      hasVariants: !!(product.variants && product.variants.length > 0),
    });
  }
  
  const cartItem: CartItem = {
    id: product.id || backendItem.productId,
    name: product.title,
    description: product.description || '',
    price: finalPriceValue,
    originalPrice: discountPrice && basePrice > 0 ? basePrice : undefined,
    category: '', // Will be populated from category lookup if needed
    vendor: {
      id: '', // Backend doesn't provide userId in ICartProduct
      name: product.vendorName || 'Local Vendor', // Use vendor info from product
      rating: 4.5,
    },
    images: imageUrls,
    rating: 4.5,
    reviewCount: 12,
    stock: variantStock > 0 ? variantStock : 0,
    tags: [],
    quantity: backendItem.quantity,
    selectedVariants: backendItem.productVariantId ? { 'variant': backendItem.productVariantId } : undefined,
  };

  return cartItem;
};

// Helper function to convert CartItem to IAddToCart format
const convertCartItemToBackendFormat = (
  product: Product, 
  quantity: number, 
  variants?: Record<string, string>
): { productId: string; productVariantId: string | null; quantity: number } => {
  // Extract variant ID from selectedVariants if available
  let productVariantId: string | null = null;
  if (variants && product.variants) {
    // First, check if variant ID is directly provided
    if (variants['variant']) {
      productVariantId = variants['variant'];
    } else {
      // Try to find variant by name
      const variantName = variants['variantName'] || Object.values(variants)[0];
      if (variantName) {
        const variant = product.variants.find(v => v.name === variantName || v.id === variantName);
        if (variant) {
          productVariantId = variant.id;
        }
      }
    }
  }

  return {
    productId: product.id,
    productVariantId,
    quantity,
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status
  const checkAuth = useCallback(() => {
    try {
      const decodedUser = decodeAccessToken();
      setIsLoggedIn(!!decodedUser);
      return !!decodedUser;
    } catch (error) {
      setIsLoggedIn(false);
      return false;
    }
  }, []);

  // Load cart from backend or localStorage
  const loadCart = useCallback(async () => {
    const loggedIn = checkAuth();
    
    if (loggedIn) {
      // Load from backend
      setIsLoading(true);
      try {
        const response = await getCartAction();
        if (!response.error && response.data && response.data.items) {
          const cartItems = response.data.items
            .map(convertBackendItemToCartItem)
            .filter((item): item is CartItem => item !== null);
          
          // Debug logging
          console.log('[CartContext] Loaded cart items from backend:', {
            itemCount: cartItems.length,
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              total: item.price * item.quantity,
            })),
          });
          
          setItems(cartItems);
        } else {
          console.log('[CartContext] No items in backend cart or error:', response);
          setItems([]);
        }
      } catch (error) {
        console.error('[CartContext] Error loading cart from backend:', error);
        // Fallback to localStorage on error
        const savedCart = localStorage.getItem('jozi_cart');
        if (savedCart) {
          const localItems = JSON.parse(savedCart);
          console.log('[CartContext] Fallback to localStorage items:', localItems);
          setItems(localItems);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Load from localStorage
      const savedCart = localStorage.getItem('jozi_cart');
      if (savedCart) {
        const localItems = JSON.parse(savedCart);
        console.log('[CartContext] Loaded cart items from localStorage:', {
          itemCount: localItems.length,
          items: localItems.map((item: CartItem) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        });
        setItems(localItems);
      }
    }
  }, [checkAuth]);

  // Sync localStorage cart to backend when user logs in
  const syncLocalStorageToBackend = useCallback(async () => {
    const savedCart = localStorage.getItem('jozi_cart');
    if (!savedCart) return;

    try {
      const localItems: CartItem[] = JSON.parse(savedCart);
      
      // Add each item from localStorage to backend cart
      for (const item of localItems) {
        const backendFormat = convertCartItemToBackendFormat(
          item,
          item.quantity,
          item.selectedVariants
        );
        await addToCartAction(backendFormat);
      }

      // Clear localStorage after syncing
      localStorage.removeItem('jozi_cart');
      
      // Reload cart from backend
      await loadCart();
    } catch (error) {
      console.error('[CartContext] Error syncing localStorage to backend:', error);
    }
  }, [loadCart]);

  // Initial load and auth check
  useEffect(() => {
    checkAuth();
    loadCart();
  }, [checkAuth, loadCart]);

  // Watch for auth changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const wasLoggedIn = isLoggedIn;
      const nowLoggedIn = checkAuth();
      
      if (!wasLoggedIn && nowLoggedIn) {
        // User just logged in - sync localStorage to backend
        syncLocalStorageToBackend();
      } else if (wasLoggedIn && !nowLoggedIn) {
        // User just logged out - save current cart to localStorage
        if (items.length > 0) {
          localStorage.setItem('jozi_cart', JSON.stringify(items));
        }
        setItems([]);
      }
    };

    // Check auth periodically
    const interval = setInterval(() => {
      handleStorageChange();
    }, 2000);

    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, checkAuth, items, syncLocalStorageToBackend]);

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!isLoggedIn && items.length > 0) {
      localStorage.setItem('jozi_cart', JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  const addItem = async (product: Product, quantity: number, variants?: Record<string, string>) => {
    const loggedIn = checkAuth();
    
    if (loggedIn) {
      // Use backend API
      setIsLoading(true);
      try {
        const backendFormat = convertCartItemToBackendFormat(product, quantity, variants);
        const response = await addToCartAction(backendFormat);
        
        if (!response.error) {
          // Reload cart from backend
          await loadCart();
          setIsCartOpen(true);
        } else {
          console.error('[CartContext] Error adding item to cart:', response.message);
          // Fallback to localStorage
          setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
              return prev.map(item => 
                item.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            }
            return [...prev, { ...product, quantity, selectedVariants: variants }];
          });
          setIsCartOpen(true);
        }
      } catch (error) {
        console.error('[CartContext] Error adding item:', error);
        // Fallback to localStorage
        setItems(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
            return prev.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, { ...product, quantity, selectedVariants: variants }];
        });
        setIsCartOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use localStorage
      setItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity, selectedVariants: variants }];
      });
      setIsCartOpen(true);
    }
  };

  const removeItem = async (productId: string) => {
    const loggedIn = checkAuth();
    
    if (loggedIn) {
      // Find the cart item ID from backend
      setIsLoading(true);
      try {
        const cartResponse = await getCartAction();
        if (!cartResponse.error && cartResponse.data && cartResponse.data.items) {
          const itemToRemove = cartResponse.data.items.find(
            (item: ICartItem) => item.productId === productId
          );
          
          if (itemToRemove && itemToRemove.id) {
            const response = await removeFromCartAction(itemToRemove.id);
            if (!response.error) {
              await loadCart();
            }
          }
        }
      } catch (error) {
        console.error('[CartContext] Error removing item:', error);
        // Fallback to localStorage
        setItems(prev => prev.filter(item => item.id !== productId));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use localStorage
      setItems(prev => prev.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    const loggedIn = checkAuth();
    
    if (loggedIn) {
      // Find the cart item ID from backend
      setIsLoading(true);
      try {
        const cartResponse = await getCartAction();
        if (!cartResponse.error && cartResponse.data && cartResponse.data.items) {
          const itemToUpdate = cartResponse.data.items.find(
            (item: ICartItem) => item.productId === productId
          );
          
          if (itemToUpdate && itemToUpdate.id) {
            const response = await updateCartItemAction({
              id: itemToUpdate.id,
              quantity,
            });
            if (!response.error) {
              await loadCart();
            }
          }
        }
      } catch (error) {
        console.error('[CartContext] Error updating quantity:', error);
        // Fallback to localStorage
        setItems(prev => prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        ));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use localStorage
      setItems(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = async () => {
    const loggedIn = checkAuth();
    
    if (loggedIn) {
      setIsLoading(true);
      try {
        const response = await clearCartAction();
        if (!response.error) {
          setItems([]);
        }
      } catch (error) {
        console.error('[CartContext] Error clearing cart:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems([]);
      localStorage.removeItem('jozi_cart');
    }
  };

  const syncCart = async () => {
    await loadCart();
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 0;
    const itemTotal = itemPrice * itemQuantity;
    return acc + itemTotal;
  }, 0);

  // Debug: Log totalPrice when items change
  useEffect(() => {
    if (items.length > 0) {
      console.log('[CartContext] Total price calculation:', {
        itemCount: items.length,
        totalPrice,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
      });
    }
  }, [items, totalPrice]);

  return (
    <CartContext.Provider value={{
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      totalItems, 
      totalPrice, 
      isCartOpen, 
      setIsCartOpen,
      isLoading,
      syncCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
