'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, Filter, Eye, ChevronLeft, ChevronRight,
  Loader2, Calendar, MapPin, Mail, Phone, User, 
  CheckCircle2, XCircle, Clock, AlertCircle, Truck,
  X, Save, RotateCcw, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getCampaignClaimOrdersAction, updateOrderAction, updateOrderItemStatusAction } from '@/app/actions/order';
import { useToast } from '@/app/contexts/ToastContext';
import { OrderStatus, OrderItemStatus, type IOrder, type IOrderItem } from '@/interfaces/order/order';

// --- Types ---

const ORDER_STATUS_LABELS: Record<string, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.READY_TO_SHIP]: 'Ready to Ship',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
};

export interface ProductItem {
  name: string;
  variant?: string | null;
  quantity: number;
  price: number;
  vendorName: string;
  image?: string;
  orderItemId?: string;
  status?: OrderItemStatus | string;
  isCampaignClaimItem?: boolean;
  campaignClaimId?: string | null;
}

export interface CampaignOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  products: ProductItem[];
  totalAmount: number;
  status: OrderStatus | string;
  orderDate: string;
  category: string;
  paymentMethod: string;
  shippingAddress: string;
  originalOrder?: IOrder;
  campaignClaimIds?: string[];
}

const ITEMS_PER_PAGE = 10;

const AdminCampaignOrdersPage: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const [orders, setOrders] = useState<CampaignOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CampaignOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // State for pending changes (for order status only - no item status updates for campaign claims)
  const [pendingOrderStatus, setPendingOrderStatus] = useState<OrderStatus | string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Transform backend IOrder to CampaignOrder format
  const transformOrder = (order: IOrder): CampaignOrder => {
    const orderDate = order.createdAt 
      ? new Date(order.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const products: ProductItem[] = (order.items || []).map(item => {
      const product = item.product;
      const variant = item.variant;
      const productName = product?.title || 'Unknown Product';
      const variantName = variant?.name;
      const displayName = variantName ? `${productName} - ${variantName}` : productName;
      
      const price = item.unitPrice || 0;
      const quantity = item.quantity || 1;
      
      const vendorName = product?.vendorName || 'Unknown Vendor';
      const productImage = product?.images?.[0]?.file;

      return {
        name: displayName,
        variant: variantName || null,
        quantity,
        price,
        vendorName,
        image: productImage,
        orderItemId: item.id,
        status: item.status || OrderItemStatus.PENDING,
        isCampaignClaimItem: item.isCampaignClaimItem,
        campaignClaimId: item.campaignClaimId,
      };
    });

    let status: OrderStatus | string = OrderStatus.PENDING;
    const orderStatusValue = order.status as OrderStatus | string;
    
    if (typeof orderStatusValue === 'string') {
      const enumValue = Object.values(OrderStatus).find(
        v => v.toLowerCase() === orderStatusValue.toLowerCase()
      );
      status = enumValue || orderStatusValue;
    } else {
      status = orderStatusValue;
    }

    const shippingAddress = order.shippingAddress
      ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postal}`
      : 'Address not provided';

    const formatOrderId = (orderNumber?: string, id?: string): string => {
      if (orderNumber && orderNumber.includes('_')) {
        const parts = orderNumber.split('_');
        return parts.length >= 3 ? parts[2] : orderNumber;
      }
      return id || 'N/A';
    };

    return {
      id: formatOrderId(order.orderNumber, order.id),
      customerName: order.user?.fullName || order.email || 'Unknown Customer',
      customerEmail: order.user?.email || order.email || '',
      products,
      totalAmount: typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount,
      status,
      orderDate,
      category: 'Campaign Claim',
      paymentMethod: order.paymentMethod || 'Card',
      shippingAddress,
      originalOrder: order,
      campaignClaimIds: order.campaignClaimIds,
    };
  };

  // Fetch campaign claim orders
  const fetchOrders = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const response = await getCampaignClaimOrdersAction(page, ITEMS_PER_PAGE, search);
      
      if (response.error || !response.data) {
        showError(response.message || 'Failed to fetch campaign claim orders');
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
        return;
      }

      const transformedOrders = response.data.orders.map(transformOrder);
      setOrders(transformedOrders);
      setTotalPages(response.data.pagination.totalPages);
      setTotalOrders(response.data.pagination.totalOrders);
    } catch (error) {
      console.error('Error fetching campaign claim orders:', error);
      showError('Failed to fetch campaign claim orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchQuery);
  }, [currentPage]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders(1, searchQuery);
  };
  
  // Save order status change
  const handleBulkSave = async () => {
    if (!selectedOrder) return;
    
    setIsSaving(true);
    const errors: string[] = [];
    const successes: string[] = [];
    
    try {
      // Update order status if changed
      if (pendingOrderStatus !== null && selectedOrder.originalOrder) {
        const updateResponse = await updateOrderAction({
          id: selectedOrder.originalOrder.id!,
          status: pendingOrderStatus,
        });
        
        if (updateResponse.error) {
          errors.push(`Order status: ${updateResponse.message}`);
        } else {
          successes.push('Order status updated');
        }
      }
      
      if (successes.length > 0) {
        showSuccess('Order status updated successfully');
      }
      
      if (errors.length > 0) {
        showError('Failed to update order status');
      }
      
      // Refresh orders
      await fetchOrders(currentPage, searchQuery);
      
      // Reset pending changes
      setPendingOrderStatus(null);
      setShowConfirmModal(false);
      setSelectedOrder(null);
    } catch (error: any) {
      showError(error?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Check if there are pending changes
  const hasPendingChanges = useMemo(() => {
    if (!selectedOrder?.originalOrder) return false;
    
    const originalOrder = selectedOrder.originalOrder;
    
    const orderStatusChanged = pendingOrderStatus !== null && 
      pendingOrderStatus !== originalOrder.status &&
      pendingOrderStatus !== originalOrder.status?.toLowerCase();
    
    return orderStatusChanged;
  }, [pendingOrderStatus, selectedOrder]);
  
  // Reset pending changes when drawer closes
  const handleCloseDrawer = () => {
    if (hasPendingChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    setSelectedOrder(null);
    setImageErrors(new Set());
    setPendingOrderStatus(null);
  };
  
  // Initialize pending changes when drawer opens
  useEffect(() => {
    if (selectedOrder?.id) {
      setPendingOrderStatus(null);
    }
  }, [selectedOrder?.id]);

  const getStatusStyles = (status: OrderStatus | string) => {
    const statusValue = typeof status === 'string' ? status : status;
    switch (statusValue) {
      case OrderStatus.PENDING:
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case OrderStatus.CONFIRMED:
      case 'confirmed':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case OrderStatus.PROCESSING:
      case 'processing':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case OrderStatus.READY_TO_SHIP:
      case 'ready_to_ship':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case OrderStatus.SHIPPED:
      case 'shipped':
        return 'bg-cyan-50 border-cyan-200 text-cyan-700';
      case OrderStatus.DELIVERED:
      case 'delivered':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case OrderStatus.CANCELLED:
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-jozi-dark via-jozi-forest to-jozi-dark pt-32 pb-40 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-jozi-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-jozi-cream rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-jozi-gold/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-jozi-gold/30">
              <Gift className="w-7 h-7 text-jozi-gold" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Campaign Claim Orders</h1>
              <p className="text-jozi-cream/80 font-medium mt-2">Manage free product campaign deliveries</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
              <p className="text-jozi-cream/60 text-[10px] font-black uppercase tracking-widest mb-1">Total Orders</p>
              <p className="text-3xl font-black text-white">{totalOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
              <p className="text-jozi-cream/60 text-[10px] font-black uppercase tracking-widest mb-1">Current Page</p>
              <p className="text-3xl font-black text-white">{currentPage} / {totalPages}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 lg:px-12 -mt-20 relative z-20">
        <div className="bg-white rounded-5xl p-8 lg:p-12 shadow-soft border border-jozi-forest/5 min-h-[600px]">
          
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by Order ID, Customer Name, or Email..." 
                className="w-full bg-gray-50 border border-transparent focus:border-jozi-gold/20 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-jozi-forest hover:bg-jozi-dark text-white px-8 rounded-2xl flex items-center justify-center transition-all font-bold text-xs uppercase tracking-widest"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>

          {/* Orders Table */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Campaign Orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Gift className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Campaign Orders Found</p>
                <p className="text-gray-400 font-medium text-xs mt-2">Campaign claim orders will appear here once customers pay for delivery.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Order ID', 'Date', 'Customer', 'Items', 'Delivery Fee', 'Status', 'View'].map((h, i) => (
                          <th key={i} className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                          <td className="py-5 font-black text-jozi-dark text-sm">
                            <div className="flex items-center gap-2">
                              <Gift className="w-4 h-4 text-jozi-gold" />
                              ORD_{order.id.split('_')[1] || order.id}
                            </div>
                          </td>
                          <td className="py-5 text-xs font-bold text-gray-500">{order.orderDate}</td>
                          <td className="py-5">
                            <p className="font-bold text-jozi-dark text-sm">{order.customerName}</p>
                            <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                          </td>
                          <td className="py-5">
                            <div className="flex items-center gap-2">
                              <span className="bg-jozi-gold/10 text-jozi-gold px-2 py-1 rounded-md text-xs font-bold">
                                {order.products.length} Free {order.products.length === 1 ? 'Item' : 'Items'}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 font-black text-jozi-dark">R{order.totalAmount.toFixed(2)}</td>
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
                      Page {currentPage} of {totalPages} • {totalOrders} total orders
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

        </div>
      </section>

      {/* Order Details Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={handleCloseDrawer}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-[101] overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-5 h-5 text-jozi-gold" />
                      <h2 className="text-2xl font-black text-jozi-dark">Campaign Order Details</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Order ID: ORD_{selectedOrder.id.split('_')[1] || selectedOrder.id}</p>
                  </div>
                  <button
                    onClick={handleCloseDrawer}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Save/Reset Actions */}
                {hasPendingChanges && (
                  <div className="flex items-center gap-3 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-amber-900">Unsaved Changes</p>
                      <p className="text-xs text-amber-700 mt-0.5">You have pending changes that need to be saved</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setPendingOrderStatus(null);
                          if (selectedOrder.originalOrder) {
                            setSelectedOrder({ ...selectedOrder, status: selectedOrder.originalOrder.status });
                          }
                        }}
                        className="p-2 hover:bg-white rounded-lg transition-colors group"
                        title="Reset changes"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-600 group-hover:text-amber-700" />
                      </button>
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        disabled={isSaving}
                        className="px-4 py-2 bg-jozi-forest text-white rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-jozi-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Content */}
              <div className="px-8 py-6 space-y-8">
                
                {/* Campaign Info Banner */}
                <div className="bg-gradient-to-r from-jozi-gold/10 to-jozi-forest/10 rounded-2xl p-6 border border-jozi-gold/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-jozi-gold rounded-xl flex items-center justify-center shrink-0">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-jozi-dark mb-1">Free Product Campaign Order</h3>
                      <p className="text-sm text-gray-600 font-medium">
                        Products are FREE • Customer only pays delivery fee (R{selectedOrder.totalAmount.toFixed(2)})
                      </p>
                      {selectedOrder.campaignClaimIds && selectedOrder.campaignClaimIds.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Campaign Claims: {selectedOrder.campaignClaimIds.length}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Customer Information</h3>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Name</p>
                        <p className="font-bold text-jozi-dark">{selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="font-bold text-jozi-dark">{selectedOrder.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Shipping Address</p>
                        <p className="font-bold text-jozi-dark">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-6 space-y-4">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200 relative">
                            {product.image && !imageErrors.has(`${selectedOrder.id}-${index}`) ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={() => {
                                  setImageErrors(prev => new Set([...prev, `${selectedOrder.id}-${index}`]));
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-bold text-jozi-dark">{product.name}</p>
                                {product.variant && (
                                  <p className="text-xs text-gray-500 mt-0.5">Variant: {product.variant}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Vendor: {product.vendorName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                                <p className="font-black text-emerald-600 text-sm mt-1">FREE</p>
                              </div>
                            </div>

                            {/* Campaign Claim Badge */}
                            <div className="mt-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-jozi-gold/10 text-jozi-gold border border-jozi-gold/20">
                                <Gift className="w-4 h-4" />
                                Campaign Claim - Free Product
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Order Summary</h3>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Products</span>
                      <span className="font-black text-emerald-600">FREE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Delivery Fee</span>
                      <span className="font-bold text-jozi-dark">R{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-jozi-dark uppercase tracking-wide">Total Paid</span>
                        <span className="text-2xl font-black text-jozi-forest">R{selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Update */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Update Order Status</h3>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 block">
                      Order Status
                    </label>
                    <select
                      value={pendingOrderStatus || selectedOrder.status}
                      onChange={(e) => setPendingOrderStatus(e.target.value as OrderStatus)}
                      className="w-full text-gray-500 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-jozi-gold/50 transition-all"
                    >
                      <option value={OrderStatus.PENDING}>Pending</option>
                      <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                      <option value={OrderStatus.PROCESSING}>Processing</option>
                      <option value={OrderStatus.READY_TO_SHIP}>Ready to Ship</option>
                      <option value={OrderStatus.SHIPPED}>Shipped</option>
                      <option value={OrderStatus.DELIVERED}>Delivered</option>
                      <option value={OrderStatus.CANCELLED}>Cancelled</option>
                    </select>
                    <div className="mt-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wide border ${getStatusStyles(pendingOrderStatus || selectedOrder.status)}`}>
                        {(pendingOrderStatus || selectedOrder.status) === OrderStatus.PENDING && <Clock className="w-3.5 h-3.5" />}
                        {(pendingOrderStatus || selectedOrder.status) === OrderStatus.CONFIRMED && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {(pendingOrderStatus || selectedOrder.status) === OrderStatus.PROCESSING && <Clock className="w-3.5 h-3.5" />}
                        {(pendingOrderStatus || selectedOrder.status) === OrderStatus.SHIPPED && <Truck className="w-3.5 h-3.5" />}
                        {(pendingOrderStatus || selectedOrder.status) === OrderStatus.DELIVERED && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {(pendingOrderStatus || selectedOrder.status) === OrderStatus.CANCELLED && <XCircle className="w-3.5 h-3.5" />}
                        {ORDER_STATUS_LABELS[String(pendingOrderStatus || selectedOrder.status)] || (pendingOrderStatus || selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Save Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
              onClick={() => setShowConfirmModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl z-[111]"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-jozi-gold/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Save className="w-8 h-8 text-jozi-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-jozi-dark mb-2">Confirm Changes</h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to save these changes? This will update the order and item statuses.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkSave}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-jozi-forest text-white rounded-xl font-bold text-sm hover:bg-jozi-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Confirm Save'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminCampaignOrdersPage;
