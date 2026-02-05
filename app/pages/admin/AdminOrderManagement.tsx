'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Eye, 
  Calendar, 
  X,
  MapPin,
  Package,
  User,
  ExternalLink,
  ArrowLeft,
  Store,
  AlertCircle,
  Inbox,
  CheckCircle2,
  CreditCard,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Ban,
  RotateCcw,
  Download,
  Loader2,
  Clock,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { getAllOrdersAction, getOrderItemsGroupedByDateAndVendorAction, updateOrderItemStatusAction, updateOrderAction } from '@/app/actions/order/index';
import { IOrder, IOrderItemsGroupedResponse, IOrderItemsByVendorAndDate, OrderItemStatus, OrderStatus } from '@/interfaces/order/order';
import { useToast } from '@/app/contexts/ToastContext';
import AdminResolutionReturnsSection from '@/app/components/admin/AdminResolutionReturnsSection';

// --- Types ---

const ORDER_STATUS_LABELS: Record<string, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.READY_TO_SHIP]: 'Ready to Ship',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  'cancellation_requested': 'Cancellation Requested',
};

export interface ProductItem {
  name: string;
  variant?: string | null;
  quantity: number;
  price: number;
  vendorName: string;
  image?: string; // First product image URL
  orderItemId?: string; // Database ID for the order item
  status?: OrderItemStatus | string; // Current status of the order item
  isReturnRequested?: boolean;
  isReturnApproved?: boolean;
  isReturnReviewed?: boolean;
  returnReviewedBy?: string | null;
  returnReviewedAt?: string | null;
}

export interface MarketOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  products: ProductItem[];
  totalAmount: number;
  status: OrderStatus | string; // Use enum or string for flexibility
  orderDate: string; // ISO Date YYYY-MM-DD
  category: string;
  paymentMethod: string;
  shippingAddress: string;
  requestReason?: string;
  originalOrder?: IOrder; // Keep reference to original order for cancellation/return checks
}

// --- Mock Data (Expanded for Volume Testing) ---

const generateBulkOrders = (count: number, vendor: string, date: string, status: OrderStatus | string): MarketOrder[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `ORD-${date.replace(/-/g, '')}-${vendor.substring(0,3).toUpperCase()}-${i}`,
    customerName: `Bulk Customer ${i}`,
    customerEmail: `customer${i}@mail.com`,
    products: [{ name: 'Bulk Item', quantity: 1, price: 100, vendorName: vendor }],
    totalAmount: 100,
    status: status,
    orderDate: date,
    category: 'General',
    paymentMethod: 'Card',
    shippingAddress: '123 Bulk St, JHB'
  }));
};

const MOCK_ORDERS: MarketOrder[] = [
  // ... existing mock data ...
  { id: 'ORD-2041', customerName: 'Lerato Dlamini', customerEmail: 'lerato@jozi.com', products: [{ name: 'Shweshwe Evening Dress', quantity: 1, price: 1250, vendorName: 'Maboneng Textiles' }], totalAmount: 1250, status: OrderStatus.PROCESSING, orderDate: '2024-10-22', category: 'Fashion', paymentMethod: 'Card', shippingAddress: '12 Gwigwi Mrwebi St, Newtown' },
  { id: 'ORD-2042', customerName: 'Kevin Naidoo', customerEmail: 'kevin.n@gmail.com', products: [{ name: 'Zulu Beadwork Necklace', quantity: 2, price: 320, vendorName: 'Soweto Gold' }], totalAmount: 640, status: OrderStatus.PENDING, requestReason: 'Found a cheaper alternative', orderDate: '2024-10-22', category: 'Accessories', paymentMethod: 'EFT', shippingAddress: '44 Vilakazi St, Soweto' },
  { id: 'ORD-2046', customerName: 'Michael Botha', customerEmail: 'm.botha@corp.za', products: [{ name: 'Silver Fern Earrings', quantity: 1, price: 490, vendorName: 'Soweto Gold' }], totalAmount: 490, status: OrderStatus.DELIVERED, requestReason: 'Item arrived damaged', orderDate: '2024-10-22', category: 'Accessories', paymentMethod: 'EFT', shippingAddress: '12 Jan Smuts Ave, Westcliff' },
  
  // Generating "Volume" for Maboneng Textiles on a specific date to test scalability
  ...generateBulkOrders(12, 'Maboneng Textiles', '2024-10-22', OrderStatus.PROCESSING),
  ...generateBulkOrders(5, 'Maboneng Textiles', '2024-10-22', OrderStatus.DELIVERED),
  ...generateBulkOrders(3, 'Maboneng Textiles', '2024-10-22', OrderStatus.CANCELLED),
  
  // Another date
  ...generateBulkOrders(8, 'Jozi Apothecary', '2024-10-21', OrderStatus.DELIVERED),
];

const ITEMS_PER_PAGE = 8;

const AdminOrderManagement: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'vendor_grouped' | 'resolutions'>('all');
  const [resolutionSubTab, setResolutionSubTab] = useState<'cancellations' | 'returns'>('cancellations');
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<MarketOrder | null>(null);
  
  // State for Pagination (Master Registry)
  const [currentPage, setCurrentPage] = useState(1);

  // State for Vendor Accordion (Vendor Manifests)
  // Store a unique key: "YYYY-MM-DD_VendorName"
  const [expandedManifest, setExpandedManifest] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // State for Vendor Grouped Data
  const [vendorGroupedData, setVendorGroupedData] = useState<IOrderItemsGroupedResponse | null>(null);
  const [loadingVendorManifests, setLoadingVendorManifests] = useState(false);
  
  // State for order item status updates
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  
  // Store original orders to access item IDs
  const [originalOrdersMap, setOriginalOrdersMap] = useState<Map<string, IOrder>>(new Map());
  
  // State for pending changes (for bulk save)
  const [pendingOrderStatus, setPendingOrderStatus] = useState<OrderStatus | string | null>(null);
  const [pendingItemStatuses, setPendingItemStatuses] = useState<Map<string, OrderItemStatus>>(new Map());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Transform backend IOrder to MarketOrder format
  const transformOrder = (order: IOrder): MarketOrder => {
    // Format order date
    const orderDate = order.createdAt 
      ? new Date(order.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    // Transform order items to products
    const products: ProductItem[] = (order.items || []).map(item => {
      // Get first image from product images array
      const firstImage = item.product?.images && item.product.images.length > 0
        ? (typeof item.product.images[0] === 'string' 
            ? item.product.images[0] 
            : item.product.images[0].file)
        : undefined;

      const req = item.isReturnRequested as unknown;
      const app = item.isReturnApproved as unknown;
      const rev = item.isReturnReviewed as unknown;
      const isReq = req === true || req === 'true' || req === 1;
      let isApp: boolean | undefined;
      if (app === true || app === 'true' || app === 1) isApp = true;
      else if (app === false || app === 'false' || app === 0) isApp = false;
      else isApp = undefined;
      const isRev = rev === true || rev === 'true' || rev === 1;
      const by = (item as any).returnReviewedBy ?? (item as any).reviewedBy ?? null;
      const at = (item as any).returnReviewedAt ?? (item as any).reviewedAt ?? null;
      const variantName = item.variant?.name || null;

      return {
        name: item.product?.title || 'Unknown Product',
        variant: variantName,
        quantity: item.quantity,
        price: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
        vendorName: item.product?.vendorName || 'Unknown Vendor',
        image: firstImage,
        orderItemId: item.id,
        status: item.status || OrderItemStatus.PENDING,
        isReturnRequested: isReq,
        isReturnApproved: isApp,
        isReturnReviewed: isRev,
        returnReviewedBy: by,
        returnReviewedAt: at,
      };
    });

    // Determine status mapping - use enum values
    let status: OrderStatus | string = OrderStatus.PENDING;
    const orderStatusValue = order.status as OrderStatus | string;
    
    // Map to enum if it's a valid enum value, otherwise keep as string
    if (typeof orderStatusValue === 'string') {
      const normalizedStatus = orderStatusValue.toLowerCase();
      if (normalizedStatus === 'pending') {
        status = OrderStatus.PENDING;
      } else if (normalizedStatus === 'confirmed') {
        status = OrderStatus.CONFIRMED;
      } else if (normalizedStatus === 'processing') {
        status = OrderStatus.PROCESSING;
      } else if (normalizedStatus === 'ready_to_ship') {
        status = OrderStatus.READY_TO_SHIP;
      } else if (normalizedStatus === 'shipped') {
        status = OrderStatus.SHIPPED;
      } else if (normalizedStatus === 'delivered') {
        status = OrderStatus.DELIVERED;
      } else if (normalizedStatus === 'cancelled') {
        status = OrderStatus.CANCELLED;
      } else {
        // Keep original value if it doesn't match enum
        status = orderStatusValue;
      }
    } else {
      status = orderStatusValue;
    }

    // Format shipping address
    const shippingAddress = order.shippingAddress
      ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postal}`
      : 'Address not provided';

    // Get request reason if available
    const requestReason = order.notes?.includes('Return reason:') 
      ? order.notes.split('Return reason:')[1]?.trim()
      : order.notes?.includes('Cancellation reason:')
      ? order.notes.split('Cancellation reason:')[1]?.trim()
      : undefined;

    // Format order ID for display (extract number from orderNumber if it follows pattern ORD_timestamp_userId_number)
    const formatOrderId = (orderNumber?: string, id?: string): string => {
      if (orderNumber) {
        const parts = orderNumber.split('_');
        if (parts.length > 1) {
          return `ORD_${parts[1]}`;
        }
        return orderNumber;
      }
      return id || 'ORD-XXXX';
    };

    return {
      id: formatOrderId(order.orderNumber, order.id),
      customerName: order.user?.fullName || order.email || 'Unknown Customer',
      customerEmail: order.user?.email || order.email || '',
      products,
      totalAmount: typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount,
      status,
      orderDate,
      category: products[0]?.vendorName || 'General',
      paymentMethod: order.paymentMethod || 'Card',
      shippingAddress,
      requestReason,
      originalOrder: order // Store original order for cancellation/return checks
    };
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrdersAction();
      
      if (response.error) {
        showError(response.message || 'Failed to load orders');
        setOrders([]);
      } else {
        // Transform orders and store original orders map
        const ordersMap = new Map<string, IOrder>();
        const transformed = (response.data || []).map((order: IOrder) => {
          ordersMap.set(order.id || '', order);
          return transformOrder(order);
        });
        setOrders(transformed);
        setOriginalOrdersMap(ordersMap);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [showError]);

  // Handle order item status update (admin - full control)
  const handleItemStatusUpdate = (orderItemId: string, newStatus: OrderItemStatus) => {
    // Track pending change instead of saving immediately
    setPendingItemStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(orderItemId, newStatus);
      return newMap;
    });
    
    // Update UI immediately for better UX
    if (selectedOrder) {
      setSelectedOrder(prev => {
        if (!prev) return null;
        const updatedProducts = prev.products.map(p => 
          p.orderItemId === orderItemId ? { ...p, status: newStatus } : p
        );
        return { ...prev, products: updatedProducts };
      });
    }
  };
  
  // Bulk save function
  const handleBulkSave = async () => {
    if (!selectedOrder) return;
    
    setIsSaving(true);
    const errors: string[] = [];
    const successes: string[] = [];
    
    try {
      // Get the original order from the selectedOrder
      const originalOrder = selectedOrder.originalOrder;
      if (!originalOrder?.id) {
        showError('Order ID not found. Please refresh and try again.');
        setIsSaving(false);
        return;
      }
      
      // Update order status if changed
      const originalStatus = originalOrder.status;
      const normalizedPendingStatus = typeof pendingOrderStatus === 'string' ? pendingOrderStatus.toLowerCase() : pendingOrderStatus;
      const normalizedOriginalStatus = typeof originalStatus === 'string' ? originalStatus.toLowerCase() : originalStatus;
      
      if (pendingOrderStatus && normalizedPendingStatus !== normalizedOriginalStatus) {
        try {
          const orderResponse = await updateOrderAction({
            id: originalOrder.id,
            status: pendingOrderStatus as OrderStatus,
          });
          
          if (orderResponse.error) {
            errors.push(`Order status: ${orderResponse.message}`);
          } else {
            successes.push('Order status updated');
          }
        } catch (error: any) {
          errors.push(`Order status: ${error?.message || 'Failed to update'}`);
        }
      }
      
      // Update all pending item statuses (only if they actually changed)
      const itemUpdatePromises = Array.from(pendingItemStatuses.entries())
        .filter(([orderItemId, newStatus]) => {
          const originalItem = originalOrder.items?.find(item => item.id === orderItemId);
          if (!originalItem) return false;
          const originalStatus = originalItem.status || OrderItemStatus.PENDING;
          const normalizedNewStatus = typeof newStatus === 'string' ? newStatus.toLowerCase() : newStatus;
          const normalizedOriginalStatus = typeof originalStatus === 'string' ? originalStatus.toLowerCase() : originalStatus;
          return normalizedNewStatus !== normalizedOriginalStatus;
        })
        .map(async ([orderItemId, newStatus]) => {
          try {
            const itemResponse = await updateOrderItemStatusAction(orderItemId, {
              orderItemId,
              status: newStatus,
            });
            
            if (itemResponse.error) {
              errors.push(`Item ${orderItemId}: ${itemResponse.message}`);
            } else {
              successes.push(`Item status updated`);
            }
          } catch (error: any) {
            errors.push(`Item ${orderItemId}: ${error?.message || 'Failed to update'}`);
          }
        });
      
      await Promise.all(itemUpdatePromises);
      
      // Show results
      if (errors.length > 0 && successes.length > 0) {
        showError(`Some updates failed: ${errors.join(', ')}`);
      } else if (errors.length > 0) {
        showError(`Failed to save changes: ${errors.join(', ')}`);
      } else {
        showSuccess('All changes saved successfully');
        // Clear pending changes
        setPendingOrderStatus(null);
        setPendingItemStatuses(new Map());
        setShowConfirmModal(false);
        // Refresh orders
        await fetchOrders();
      }
    } catch (error: any) {
      showError(error?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Check if there are pending changes
  const hasPendingChanges = useMemo(() => {
    if (!selectedOrder?.originalOrder) {
      // If no original order, check if we have any pending changes
      return pendingOrderStatus !== null || pendingItemStatuses.size > 0;
    }
    
    const originalOrder = selectedOrder.originalOrder;
    
    // Check if order status changed
    const orderStatusChanged = pendingOrderStatus !== null && 
      pendingOrderStatus !== originalOrder.status &&
      pendingOrderStatus !== originalOrder.status?.toLowerCase();
    
    // Check if any item statuses changed
    const itemStatusesChanged = Array.from(pendingItemStatuses.entries()).some(([itemId, newStatus]) => {
      const originalItem = originalOrder.items?.find(item => item.id === itemId);
      if (!originalItem) return false;
      const originalStatus = originalItem.status || OrderItemStatus.PENDING;
      return newStatus !== originalStatus && newStatus !== originalStatus?.toLowerCase();
    });
    
    return orderStatusChanged || itemStatusesChanged;
  }, [pendingOrderStatus, pendingItemStatuses, selectedOrder]);
  
  // Reset pending changes when drawer closes
  const handleCloseDrawer = () => {
    // Check if there are unsaved changes
    if (hasPendingChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) {
        return;
      }
    }
    setSelectedOrder(null);
    setImageErrors(new Set());
    setPendingOrderStatus(null);
    setPendingItemStatuses(new Map());
  };
  
  // Initialize pending changes when drawer opens
  useEffect(() => {
    if (selectedOrder?.id) {
      // Reset pending changes when a new order is selected
      setPendingOrderStatus(null);
      setPendingItemStatuses(new Map());
    }
  }, [selectedOrder?.id]);

  // Admin allowed statuses (full control - all OrderItemStatus values)
  // Admin can see and update all statuses regardless of cancellation/return requests
  const adminAllowedStatuses: Array<{ value: OrderItemStatus; label: string }> = [
    { value: OrderItemStatus.PENDING, label: 'Pending' },
    { value: OrderItemStatus.ACCEPTED, label: 'Accepted' },
    { value: OrderItemStatus.REJECTED, label: 'Rejected' },
    { value: OrderItemStatus.PROCESSING, label: 'Processed' },
    { value: OrderItemStatus.PICKED, label: 'Picked' },
    { value: OrderItemStatus.PACKED, label: 'Packed' },
    { value: OrderItemStatus.SHIPPED, label: 'Shipped' },
    { value: OrderItemStatus.DELIVERED, label: 'Delivered' },
    { value: OrderItemStatus.CANCELLED, label: 'Cancelled' },
  ];

  // Fetch vendor grouped data when vendor_grouped tab is active
  useEffect(() => {
    const fetchVendorGroupedData = async () => {
      if (activeTab !== 'vendor_grouped') return;
      
      setLoadingVendorManifests(true);
      try {
        const response = await getOrderItemsGroupedByDateAndVendorAction();
        
        if (response.error) {
          showError(response.message || 'Failed to load vendor manifests');
          setVendorGroupedData(null);
        } else {
          setVendorGroupedData(response.data);
        }
      } catch (error) {
        console.error('Error fetching vendor grouped data:', error);
        showError('Failed to load vendor manifests');
        setVendorGroupedData(null);
      } finally {
        setLoadingVendorManifests(false);
      }
    };

    fetchVendorGroupedData();
  }, [activeTab, showError]);

  // --- Helpers ---

  const getStatusStyles = (status: OrderStatus | string) => {
    // Handle both enum values and string values
    const statusValue = typeof status === 'string' ? status : status;
    switch (statusValue) {
      case OrderStatus.PENDING:
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case OrderStatus.CONFIRMED:
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-300';
      case OrderStatus.PROCESSING:
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300';
      case OrderStatus.READY_TO_SHIP:
      case 'ready_to_ship': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case OrderStatus.SHIPPED:
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-300';
      case OrderStatus.DELIVERED:
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case OrderStatus.CANCELLED:
      case 'cancelled':
      case 'cancellation_requested': return 'bg-red-100 text-red-700 border-red-300 line-through';
      default: return 'bg-gray-200 text-gray-800 border-gray-400';
    }
  };

  const isOrderDelivered = (order: MarketOrder | null): boolean => {
    if (!order) return false;
    const status = order.originalOrder?.status ?? order.status;
    const s = typeof status === 'string' ? status.toLowerCase() : '';
    return s === 'delivered' || status === OrderStatus.DELIVERED;
  };

  const isOrderCancelled = (order: MarketOrder | null): boolean => {
    if (!order) return false;
    const status = order.originalOrder?.status ?? order.status;
    const s = typeof status === 'string' ? status.toLowerCase() : '';
    return s === 'cancelled' || status === OrderStatus.CANCELLED;
  };

  const isOrderViewOnly = (order: MarketOrder | null): boolean =>
    isOrderDelivered(order) || isOrderCancelled(order);

  type ProductItemReturn = Pick<ProductItem, 'isReturnRequested' | 'isReturnApproved' | 'returnReviewedBy' | 'returnReviewedAt'>;
  const isReturnRequested = (p: ProductItemReturn) => p.isReturnRequested === true;
  const isReturnApproved = (p: ProductItemReturn) => p.isReturnApproved === true;
  const hasBeenReturnReviewed = (p: ProductItemReturn) => {
    const by = p.returnReviewedBy;
    const at = p.returnReviewedAt;
    if (by == null || at == null) return false;
    if (typeof by === 'string' && by.trim() === '') return false;
    return true;
  };
  const isReturnDeclined = (p: ProductItemReturn) =>
    isReturnRequested(p) && hasBeenReturnReviewed(p) && p.isReturnApproved === false;
  const isReturnInReview = (p: ProductItemReturn) =>
    isReturnRequested(p) && !isReturnApproved(p) && !hasBeenReturnReviewed(p);

  const handleStatusUpdate = (id: string, newStatus: OrderStatus | string) => {
    // Track pending change instead of saving immediately
    if (selectedOrder?.id === id) {
      setPendingOrderStatus(newStatus);
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const toggleManifest = (date: string, vendorName: string) => {
    const key = `${date}_${vendorName}`;
    setExpandedManifest(prev => prev === key ? null : key);
  };

  // --- Filtering & Sorting ---

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(lowerQuery) || 
        order.customerName.toLowerCase().includes(lowerQuery) ||
        order.products.some(p => p.vendorName.toLowerCase().includes(lowerQuery))
      );
    });
  }, [orders, searchQuery]);

  // --- Master Registry Pagination ---
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  // --- Vendor Grouping Logic (from API) ---
  const vendorGroupedOrders = useMemo(() => {
    if (!vendorGroupedData || !vendorGroupedData.groupedItems) {
      return [];
    }

    // Group by date first
    const byDate: Record<string, IOrderItemsByVendorAndDate[]> = {};
    vendorGroupedData.groupedItems.forEach(item => {
      if (!byDate[item.date]) {
        byDate[item.date] = [];
      }
      byDate[item.date].push(item);
    });

    // Sort dates (newest first)
    const sortedDates = Object.keys(byDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return sortedDates.map(date => {
      const vendorGroups = byDate[date];
      
      return {
        date,
        vendors: vendorGroups.map(vGroup => {
          // Transform order items to MarketOrder format for display
          const ordersMap = new Map<string, MarketOrder>();
          
          vGroup.orderItems.forEach(item => {
            const orderId = item.order?.orderNumber || item.order?.id || 'ORD-XXXX';
            
            if (!ordersMap.has(orderId)) {
              // Create a new MarketOrder from the order item
              const orderDate = item.order?.createdAt 
                ? new Date(item.order.createdAt).toISOString().split('T')[0]
                : date;

              // Determine status from order (if available) or default
              let status: OrderStatus | string = OrderStatus.PROCESSING;
              if (item.order?.status) {
                const orderStatusValue = item.order.status;
                if (typeof orderStatusValue === 'string') {
                  const normalizedStatus = orderStatusValue.toLowerCase();
                  if (normalizedStatus === 'pending') status = OrderStatus.PENDING;
                  else if (normalizedStatus === 'confirmed') status = OrderStatus.CONFIRMED;
                  else if (normalizedStatus === 'processing') status = OrderStatus.PROCESSING;
                  else if (normalizedStatus === 'ready_to_ship') status = OrderStatus.READY_TO_SHIP;
                  else if (normalizedStatus === 'shipped') status = OrderStatus.SHIPPED;
                  else if (normalizedStatus === 'delivered') status = OrderStatus.DELIVERED;
                  else if (normalizedStatus === 'cancelled') status = OrderStatus.CANCELLED;
                  else status = orderStatusValue;
                } else {
                  status = orderStatusValue;
                }
              }
              
              const productImage = item.product?.images && item.product.images.length > 0
                ? (typeof item.product.images[0] === 'string' 
                    ? item.product.images[0] 
                    : item.product.images[0].file)
                : undefined;

              const req = (item as any).isReturnRequested as unknown;
              const app = (item as any).isReturnApproved as unknown;
              const rev = (item as any).isReturnReviewed as unknown;
              const isReq = req === true || req === 'true' || req === 1;
              let isApp: boolean | undefined;
              if (app === true || app === 'true' || app === 1) isApp = true;
              else if (app === false || app === 'false' || app === 0) isApp = false;
              else isApp = undefined;
              const by = (item as any).returnReviewedBy ?? (item as any).reviewedBy ?? null;
              const at = (item as any).returnReviewedAt ?? (item as any).reviewedAt ?? null;

              // Get shipping address from order if available
              const orderShippingAddress = item.order?.shippingAddress
                ? `${item.order.shippingAddress.street}, ${item.order.shippingAddress.city}, ${item.order.shippingAddress.postal || ''}`
                : `${vGroup.vendor.address.street}, ${vGroup.vendor.address.city}, ${vGroup.vendor.address.postal}`;

              // Get order total if available
              const orderTotalAmount = item.order?.totalAmount
                ? (typeof item.order.totalAmount === 'string' ? parseFloat(item.order.totalAmount) : item.order.totalAmount)
                : (typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice);

              const marketOrder: MarketOrder = {
                id: orderId,
                customerName: item.order?.customer?.fullName || 'Unknown Customer',
                customerEmail: item.order?.customer?.email || item.order?.email || '',
                products: [{
                  name: item.product?.title || 'Unknown Product',
                  quantity: item.quantity,
                  price: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
                  vendorName: vGroup.vendor.vendorName,
                  image: productImage,
                  orderItemId: item.id,
                  status: item.status || OrderItemStatus.PENDING,
                  isReturnRequested: isReq,
                  isReturnApproved: isApp,
                  isReturnReviewed: rev === true || rev === 'true' || rev === 1,
                  returnReviewedBy: by,
                  returnReviewedAt: at,
                }],
                totalAmount: orderTotalAmount,
                status,
                orderDate,
                category: vGroup.vendor.vendorName,
                paymentMethod: (item.order as any)?.paymentMethod || 'Card',
                shippingAddress: orderShippingAddress,
                requestReason: item.order?.notes?.includes('Cancellation reason:')
                  ? item.order.notes.split('Cancellation reason:')[1]?.trim()
                  : undefined,
              };
              
              ordersMap.set(orderId, marketOrder);
            } else {
              // Add product to existing order
              const existingOrder = ordersMap.get(orderId)!;
              const productImage = item.product?.images && item.product.images.length > 0
                ? (typeof item.product.images[0] === 'string' 
                    ? item.product.images[0] 
                    : item.product.images[0].file)
                : undefined;

              const req = (item as any).isReturnRequested as unknown;
              const app = (item as any).isReturnApproved as unknown;
              const rev = (item as any).isReturnReviewed as unknown;
              const isReq = req === true || req === 'true' || req === 1;
              let isApp: boolean | undefined;
              if (app === true || app === 'true' || app === 1) isApp = true;
              else if (app === false || app === 'false' || app === 0) isApp = false;
              else isApp = undefined;
              const by = (item as any).returnReviewedBy ?? (item as any).reviewedBy ?? null;
              const at = (item as any).returnReviewedAt ?? (item as any).reviewedAt ?? null;

              existingOrder.products.push({
                name: item.product?.title || 'Unknown Product',
                quantity: item.quantity,
                price: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
                vendorName: vGroup.vendor.vendorName,
                image: productImage,
                orderItemId: item.id,
                status: item.status || OrderItemStatus.PENDING,
                isReturnRequested: isReq,
                isReturnApproved: isApp,
                isReturnReviewed: rev === true || rev === 'true' || rev === 1,
                returnReviewedBy: by,
                returnReviewedAt: at,
              });
              // Use order total if available (only set once), otherwise accumulate item totals
              if (item.order?.totalAmount && !existingOrder.originalOrder) {
                existingOrder.totalAmount = typeof item.order.totalAmount === 'string' 
                  ? parseFloat(item.order.totalAmount) 
                  : item.order.totalAmount;
              }
            }
          });

          const orders = Array.from(ordersMap.values());
          
          // Calculate Stats for Summary
          const totalValue = vGroup.totalAmount;
          const pendingCount = orders.filter(o => o.status === 'Processing' || o.status === 'Picked').length;
          const issuesCount = orders.filter(o => o.status.includes('Requested') || o.status === 'Cancelled' || o.status === 'Returned').length;
          
          return { 
            name: vGroup.vendor.vendorName, 
            orders, 
            totalValue, 
            pendingCount, 
            issuesCount 
          };
        })
      };
    });
  }, [vendorGroupedData]);

  const resolutionOrders = useMemo(() => {
    return filteredOrders.filter(o => {
      const s = typeof o.status === 'string' ? o.status.toLowerCase() : '';
      return ['cancelled', 'cancellation_requested'].includes(s) ||
        ['Cancelled', 'Cancellation Requested'].includes(o.status as string);
    });
  }, [filteredOrders]);


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- HEADER --- */}
      <section className="bg-jozi-dark text-white pt-10 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="space-y-2">
              <Link href="/admin" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Order <span className="text-jozi-gold">Management</span>
              </h1>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Total Orders</p>
                 <p className="text-3xl font-black mt-1">{orders.length}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[140px]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Action Required</p>
                 <p className="text-3xl font-black mt-1">
                   {orders.filter(o => o.status.includes('Requested')).length}
                 </p>
               </div>
            </div>
          </div>

          <div className="flex space-x-1 bg-white/5 p-1 rounded-2xl inline-flex backdrop-blur-sm border border-white/10 overflow-x-auto">
            {[
              { id: 'all', label: 'Master Registry', icon: Inbox },
              { id: 'vendor_grouped', label: 'Vendor Manifests', icon: Store },
              { id: 'resolutions', label: 'Resolution Center', icon: AlertCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setCurrentPage(1); }}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-jozi-gold text-jozi-dark shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <section className="px-6 lg:px-12 -mt-20 relative z-20">
        <div className="bg-white rounded-5xl p-8 lg:p-12 shadow-soft border border-jozi-forest/5 min-h-[600px]">
          
          {/* Universal Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by Order ID, Customer Name, or Vendor..." 
                className="w-full bg-gray-50 border border-transparent focus:border-jozi-gold/20 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-gray-50 hover:bg-jozi-forest hover:text-white text-gray-600 px-6 rounded-2xl flex items-center justify-center transition-all border border-transparent">
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-bold text-xs uppercase tracking-widest">Filter</span>
            </button>
          </div>

          {/* --- VIEW 1: MASTER REGISTRY (ALL ORDERS) --- */}
          {activeTab === 'all' && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Orders...</p>
                </div>
              ) : paginatedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Package className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Orders Found</p>
                  <p className="text-gray-400 font-medium text-xs mt-2">Orders will appear here once customers place them.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          {['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'View'].map((h, i) => (
                            <th key={i} className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paginatedOrders.map((order) => (
                          <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <td className="py-5 font-black text-jozi-dark text-sm"> ORD_{order.id.split('_')[1]}</td>
                            <td className="py-5 text-xs font-bold text-gray-500">{order.orderDate}</td>
                            <td className="py-5">
                              <p className="font-bold text-jozi-dark text-sm">{order.customerName}</p>
                              <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                            </td>
                            <td className="py-5">
                              <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">
                                  {order.products.reduce((acc, p) => acc + p.quantity, 0)} Items
                                </span>
                              </div>
                            </td>
                            <td className="py-5 font-black text-jozi-dark">R{order.totalAmount}</td>
                            <td className="py-5">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(order.status)}`}>
                                {ORDER_STATUS_LABELS[String(order.status)] || order.status}
                              </span>
                            </td>
                            <td className="py-5">
                              <button className="p-2 hover:bg-white rounded-xl transition-colors">
                                <Eye className="w-4 h-4 text-gray-400 group-hover:text-jozi-forest" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                      <p className="text-xs font-bold text-gray-400">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* --- VIEW 2: VENDOR MANIFESTS (SCALABLE ACCORDION) --- */}
          {activeTab === 'vendor_grouped' && (
            <div className="space-y-12">
              {loadingVendorManifests ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Vendor Manifests...</p>
                </div>
              ) : vendorGroupedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Package className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Vendor Manifests Found</p>
                  <p className="text-gray-400 font-medium text-xs mt-2">No order items found for the last 30 days.</p>
                </div>
              ) : (
                <>
                  {vendorGroupedOrders.map((group) => (
                    <div key={group.date}>
                      {/* Date Header */}
                      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-white z-10 py-4">
                        <div className="h-px bg-gray-100 grow" />
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                          <Calendar className="w-4 h-4 text-jozi-gold" />
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500">{group.date}</span>
                        </div>
                        <div className="h-px bg-gray-100 grow" />
                      </div>

                      {/* Vendor Manifest Rows (Accordion) */}
                      <div className="space-y-4">
                        {group.vendors.map((vGroup) => {
                          const isExpanded = expandedManifest === `${group.date}_${vGroup.name}`;
                          
                          return (
                            <div key={vGroup.name} className="border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-jozi-forest/10">
                              {/* Manifest Header (Always Visible) */}
                              <div 
                                onClick={() => toggleManifest(group.date, vGroup.name)}
                                className={`p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/50'}`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-jozi-forest text-white' : 'bg-jozi-cream text-jozi-forest'}`}>
                                    <Store className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h3 className="font-black text-jozi-forest text-lg">{vGroup.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-xs text-gray-500 font-bold">{vGroup.orders.length} Orders</span>
                                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                                      <span className="text-xs text-gray-500 font-bold">R{vGroup.totalValue.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                  {/* Status Badges for Manifest Summary */}
                                  <div className="flex gap-2">
                                    {vGroup.pendingCount > 0 && (
                                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                        {vGroup.pendingCount} Pending
                                      </span>
                                    )}
                                    {vGroup.issuesCount > 0 && (
                                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                                        {vGroup.issuesCount} Action Needed
                                      </span>
                                    )}
                                  </div>
                                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </div>
                              </div>

                              {/* Expanded Data Table (Scrollable for scalability) */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden bg-white border-t border-gray-100"
                                  >
                                    <div className="max-h-[500px] overflow-y-auto">
                                      <table className="w-full text-left min-w-[800px]">
                                        <thead className="sticky top-0 bg-gray-50 shadow-sm z-10">
                                          <tr>
                                            {['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'View'].map((h, i) => (
                                              <th key={i} className="px-6 py-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                          {vGroup.orders.map(order => {
                                            const orderCancelled = order.status === OrderStatus.CANCELLED ||
                                              (typeof order.status === 'string' && order.status.toLowerCase() === 'cancelled');
                                            const orderDelivered = order.status === OrderStatus.DELIVERED ||
                                              (typeof order.status === 'string' && order.status.toLowerCase() === 'delivered');
                                            const isViewOnly = orderCancelled || orderDelivered;

                                            return (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                              <td className="px-6 py-4 font-black text-jozi-dark text-sm">ORD_{order.id.split('_')[1] || order.id}</td>
                                              <td className="px-6 py-4 text-xs font-bold text-gray-500">{order.orderDate}</td>
                                              <td className="px-6 py-4">
                                                <p className="font-bold text-jozi-dark text-sm">{order.customerName}</p>
                                                <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                                              </td>
                                              <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">
                                                    {order.products.reduce((acc, p) => acc + p.quantity, 0)} Items
                                                  </span>
                                                </div>
                                              </td>
                                              <td className="px-6 py-4 font-black text-jozi-dark">R{order.totalAmount.toLocaleString()}</td>
                                              <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(order.status)}`}>
                                                  {ORDER_STATUS_LABELS[String(order.status)] || order.status}
                                                </span>
                                                {isViewOnly && (
                                                  <span className="block mt-1 text-[8px] font-bold text-gray-400 uppercase">View Only</span>
                                                )}
                                              </td>
                                              <td className="px-6 py-4">
                                                <button className="p-2 hover:bg-white rounded-xl transition-colors">
                                                  <Eye className="w-4 h-4 text-gray-400 hover:text-jozi-forest" />
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                      <button className="text-xs font-bold text-jozi-forest flex items-center justify-center gap-2 hover:underline">
                                        <Download className="w-3 h-3" /> Download Manifest PDF
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* --- VIEW 3: RESOLUTION CENTER --- */}
          {activeTab === 'resolutions' && (
            <div className="space-y-6">
               <div className="flex items-center gap-2 mb-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-sm">
                 <AlertCircle className="w-5 h-5" />
                 <span className="font-bold">Attention Needed:</span>
                 <span>Review cancellation requests and return requests below.</span>
               </div>

               {/* Resolution sub-tabs */}
               <div className="inline-flex items-center bg-gray-100 rounded-2xl p-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                 <button
                   type="button"
                   onClick={() => setResolutionSubTab('cancellations')}
                   className={`px-4 py-2 rounded-2xl transition-all ${
                     resolutionSubTab === 'cancellations'
                       ? 'bg-white text-jozi-forest shadow-sm'
                       : 'text-gray-500 hover:text-jozi-forest'
                   }`}
                 >
                   Cancelled Orders
                 </button>
                 <button
                   type="button"
                   onClick={() => setResolutionSubTab('returns')}
                   className={`px-4 py-2 rounded-2xl transition-all ${
                     resolutionSubTab === 'returns'
                       ? 'bg-white text-jozi-forest shadow-sm'
                       : 'text-gray-500 hover:text-jozi-forest'
                   }`}
                 >
                   Returns
                 </button>
               </div>

               {/* Cancelled orders view */}
               {resolutionSubTab === 'cancellations' && (
                 <div className="space-y-6">
                   {resolutionOrders.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-32">
                       <CheckCircle2 className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
                       <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">All caught up! No pending cancellation requests.</p>
                     </div>
                   ) : (
                     <div className="overflow-x-auto">
                       <table className="w-full text-left min-w-[1000px]">
                        <thead>
                           <tr className="border-b border-gray-100">
                             {['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Action'].map((h, i) => (
                               <th key={i} className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
                             ))}
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                           {resolutionOrders.map((order) => {
                             const isFinalized = order.status === OrderStatus.CANCELLED || 
                               (typeof order.status === 'string' && order.status.toLowerCase() === 'cancelled');
                             return (
                               <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                 <td className="py-5 font-black text-jozi-dark text-sm">ORD_{order.id.split('_')[1] || order.id}</td>
                                 <td className="py-5 text-xs font-bold text-gray-500">{order.orderDate}</td>
                                 <td className="py-5">
                                   <p className="font-bold text-jozi-dark text-sm">{order.customerName}</p>
                                   <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                                 </td>
                                 <td className="py-5">
                                   <div className="flex items-center gap-2">
                                     <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">
                                       {order.products.reduce((acc, p) => acc + p.quantity, 0)} Items
                                     </span>
                                   </div>
                                 </td>
                                 <td className="py-5 font-black text-jozi-dark">R{order.totalAmount.toLocaleString()}</td>
                                 <td className="py-5">
                                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyles(order.status)}`}>
                                     {ORDER_STATUS_LABELS[String(order.status)] || order.status}
                                   </span>
                                 </td>
                                 <td className="py-5">
                                   {isFinalized ? (
                                     <button 
                                       onClick={() => setSelectedOrder(order)} 
                                       className="p-2 hover:bg-white rounded-xl transition-colors"
                                     >
                                       <Eye className="w-4 h-4 text-gray-400 group-hover:text-jozi-forest" />
                                     </button>
                                   ) : (
                                     <div className="flex items-center gap-2">
                                       <button 
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           handleStatusUpdate(order.id, OrderStatus.CANCELLED);
                                         }}
                                         className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1"
                                       >
                                         <ThumbsUp className="w-3 h-3" /> Approve
                                       </button>
                                       <button 
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           handleStatusUpdate(order.id, OrderStatus.PROCESSING);
                                         }}
                                         className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-1"
                                       >
                                         <ThumbsDown className="w-3 h-3" /> Reject
                                       </button>
                                     </div>
                                   )}
                                 </td>
                               </tr>
                             );
                           })}
                         </tbody>
                       </table>
                     </div>
                   )}
                 </div>
               )}

               {/* Returns view */}
               {resolutionSubTab === 'returns' && (
                 <div className="pt-4">
                   <AdminResolutionReturnsSection />
                 </div>
               )}
            </div>
          )}

        </div>
      </section>

      {/* --- ORDER DETAILS DRAWER --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={handleCloseDrawer}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{selectedOrder.id}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(selectedOrder.status)}`}>
                      {ORDER_STATUS_LABELS[String(selectedOrder.status)] || selectedOrder.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Placed {selectedOrder.orderDate}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCloseDrawer}
                  className="p-3 hover:bg-white rounded-xl transition-colors group shadow-sm"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-jozi-forest" />
                </button>
              </div>

              <div className="grow overflow-y-auto p-8 space-y-10">
                {/* Items Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest">Ordered Items</h3>
                    <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">{selectedOrder.products.length} Units</span>
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.products.map((item, idx) => {
                      const imageKey = `${selectedOrder.id}-${idx}`;
                      const hasImageError = imageErrors.has(imageKey);
                      const orderItemId = item.orderItemId;
                      const currentStatus = item.status || OrderItemStatus.PENDING;
                      const isUpdating = updatingItemId === orderItemId;
                      
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex items-center justify-center text-jozi-forest shadow-sm border border-gray-100 shrink-0">
                              {item.image && !hasImageError ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={() => {
                                    setImageErrors(prev => new Set(prev).add(imageKey));
                                  }}
                                />
                              ) : (
                                <Package className="w-5 h-5 opacity-40" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-jozi-forest text-sm leading-tight">{item.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-jozi-gold">Vendor: {item.vendorName}</p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="text-[9px] font-black text-gray-400 uppercase">Qty: {item.quantity}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded border font-black uppercase ${
                                  currentStatus === OrderItemStatus.DELIVERED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                  currentStatus === OrderItemStatus.SHIPPED ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  currentStatus === OrderItemStatus.PACKED ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                  currentStatus === OrderItemStatus.PICKED ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                  currentStatus === OrderItemStatus.PROCESSING ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                  currentStatus === OrderItemStatus.ACCEPTED ? 'bg-green-50 text-green-600 border-green-100' :
                                  currentStatus === OrderItemStatus.REJECTED || currentStatus === OrderItemStatus.CANCELLED ? 'bg-red-50 text-red-600 border-red-100' :
                                  'bg-gray-50 text-gray-600 border-gray-100'
                                }`}>
                                  {currentStatus.replace(/_/g, ' ')}
                                </span>
                                {isReturnRequested(item) && isReturnApproved(item) && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase tracking-wide">
                                    <CheckCircle2 className="w-3 h-3 shrink-0" /> Return approved
                                  </span>
                                )}
                                {isReturnRequested(item) && isReturnDeclined(item) && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold uppercase tracking-wide">
                                    <XCircle className="w-3 h-3 shrink-0" /> Return declined
                                  </span>
                                )}
                                {isReturnInReview(item) && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[9px] font-bold uppercase tracking-wide">
                                    <Clock className="w-3 h-3 shrink-0" /> Return in review
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right mr-4">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                              <p className="font-black text-jozi-forest mt-1">R{item.price}</p>
                            </div>
                            {orderItemId && !isOrderViewOnly(selectedOrder) && (
                              <div className="relative">
                                <select
                                  value={currentStatus}
                                  onChange={(e) => handleItemStatusUpdate(orderItemId, e.target.value as OrderItemStatus)}
                                  disabled={isUpdating}
                                  className={`appearance-none bg-white border-2 rounded-xl px-3 py-2 pr-8 font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all min-w-[140px] text-jozi-forest ${
                                    isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:border-jozi-gold border-gray-200'
                                  }`}
                                >
                                  {adminAllowedStatuses.map((status: { value: OrderItemStatus; label: string }) => (
                                    <option key={status.value} value={status.value} className="text-jozi-forest">
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                                {isUpdating && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                                    <Loader2 className="w-4 h-4 text-jozi-gold animate-spin" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-8">
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-5">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Details</h4>
                      <div className="flex items-start space-x-4">
                        <User className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-jozi-forest leading-tight">{selectedOrder.customerName}</p>
                          <p className="text-xs text-gray-500 font-medium">{selectedOrder.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{selectedOrder.shippingAddress}</p>
                      </div>
                   </div>

                   <div>
                     <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Summary</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-500">Subtotal</span>
                          <span className="font-bold text-jozi-forest">R{selectedOrder.totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-500">Method</span>
                          <span className="font-bold text-jozi-forest flex items-center gap-2">
                            <CreditCard className="w-3 h-3" /> {selectedOrder.paymentMethod}
                          </span>
                        </div>
                        <div className="h-px bg-gray-100 my-2" />
                        <div className="flex justify-between items-center bg-jozi-forest text-white p-4 rounded-xl shadow-lg">
                          <span className="text-xs font-black uppercase tracking-widest text-jozi-gold">Total Paid</span>
                          <span className="text-xl font-black">R{selectedOrder.totalAmount}</span>
                        </div>
                     </div>
                   </div>
                </div>
                
                {selectedOrder.requestReason && (
                   <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start space-x-4">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-black text-amber-900 text-xs uppercase tracking-widest">Customer Request Note</h4>
                        <p className="text-sm text-amber-800 font-medium leading-relaxed mt-1 italic">"{selectedOrder.requestReason}"</p>
                      </div>
                   </div>
                )}
              </div>

              <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-4">
                {isOrderViewOnly(selectedOrder) ? (
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                    isOrderCancelled(selectedOrder)
                      ? 'bg-red-50 border-red-100'
                      : 'bg-emerald-50 border-emerald-100'
                  }`}>
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${isOrderCancelled(selectedOrder) ? 'text-red-600' : 'text-emerald-600'}`} />
                    <p className={`text-sm font-bold ${isOrderCancelled(selectedOrder) ? 'text-red-800' : 'text-emerald-800'}`}>
                      {isOrderCancelled(selectedOrder)
                        ? 'Order cancelled — view only. Status and items are not editable.'
                        : 'Order delivered — view only. Status and items are not editable.'}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-2 ml-1">Update Status</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-50 border text-jozi-forest border-gray-200 rounded-xl px-4 py-3 font-bold text-sm outline-none appearance-none cursor-pointer hover:border-jozi-gold transition-colors"
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as OrderStatus)}
                      >
                        {Object.entries(ORDER_STATUS_LABELS)
                          .filter(([value]) => value !== 'cancellation_requested')
                          .map(([value, label]) => (
                            <option key={value} value={value} className="text-jozi-forest">
                              {label}
                            </option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}
                
                {/* Bulk Save Button */}
                {!isOrderViewOnly(selectedOrder) && hasPendingChanges && (
                  <button 
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isSaving}
                    className="w-full bg-jozi-gold text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold/90 transition-all shadow-lg shadow-jozi-gold/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save All Changes ({pendingItemStatuses.size + (pendingOrderStatus ? 1 : 0)})
                      </>
                    )}
                  </button>
                )}
                
                <button className="w-full bg-jozi-forest text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-lg shadow-jozi-forest/20 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 mr-2 text-jozi-gold" />
                  Generate Invoice PDF
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => !isSaving && setShowConfirmModal(false)}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Confirm Changes</h3>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSaving}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-600 font-medium">
                  You are about to save the following changes:
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  {pendingOrderStatus && selectedOrder && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Order Status</span>
                      <span className="text-sm font-black text-jozi-forest">
                        {ORDER_STATUS_LABELS[String(pendingOrderStatus)] || pendingOrderStatus}
                      </span>
                    </div>
                  )}
                  
                  {pendingItemStatuses.size > 0 && (
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                        Order Items ({pendingItemStatuses.size})
                      </span>
                      <div className="space-y-2">
                        {Array.from(pendingItemStatuses.entries()).map(([itemId, status]) => {
                          const item = selectedOrder?.products.find(p => p.orderItemId === itemId);
                          return (
                            <div key={itemId} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate flex-1 mr-2">
                                {item?.name || `Item ${itemId.substring(0, 8)}`}
                              </span>
                              <span className="font-black text-jozi-forest shrink-0">
                                {adminAllowedStatuses.find(s => s.value === status)?.label || status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-amber-600 font-medium italic">
                  This action will update the order and all selected items. Continue?
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkSave}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-jozi-forest text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-lg shadow-jozi-forest/20 flex items-center justify-center disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirm & Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminOrderManagement;