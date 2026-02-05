'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  PackageCheck,
  ChevronRight, 
  Clock, 
  MapPin, 
  Award,
  Zap,
  ArrowLeft,
  Truck,
  ExternalLink,
  Tag,
  X,
  AlertCircle,
  Search,
  Filter,
  Receipt,
  Ban,
  RotateCcw,
  CheckSquare,
  Square,
  ShoppingBag,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getMyOrdersAction, requestCancellationAction } from '@/app/actions/order/index';
import { createReturnAction } from '@/app/actions/return/index';
import { useToast } from '@/app/contexts/ToastContext';
import { IOrder } from '@/interfaces/order/order';
import type { ICreateReturnItemInput } from '@/interfaces/return/return';

// Frontend transformed interface for display
interface OrderDetail {
  id: string;        // Display ID (Truncated)
  fullId: string;    // Full Order Number
  orderId: string;   // Database UUID
  date: string;
  statusLabel: string; // The pretty string to show
  statusCode: string;  // For logic
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  voucherCode?: string;
  pointsEarned: number;
  deliveryAddress: string;
  trackingNumber: string;
  cancellationRequestStatus?: string | null;
  isReturnRequested?: boolean;
  isReturnApproved?: boolean;
  isReturnReviewed?: boolean;
  returnReviewedBy?: string | null;
  returnReviewedAt?: string | null;
  items: {
    id: string;
    name: string;
    vendor: string;
    price: string;
    quantity: number;
    image: string;
    orderItemId?: string;
    rejectionReason?: string | null;
    status?: string;
    isReturnRequested?: boolean;
    isReturnApproved?: boolean;
    isReturnReviewed?: boolean;
    returnReviewedBy?: string | null;
    returnReviewedAt?: string | null;
  }[];
}

export interface OrdersPageProps {
  /** When provided, use instead of fetching. Parent fetches orders + returns together. */
  initialOrders?: IOrder[];
  ordersLoading?: boolean;
  onOrdersRefetch?: () => Promise<void>;
  /** After creating a return, parent should refetch returns too. */
  onReturnsRefetch?: () => Promise<void>;
}

/** Treat API booleans that may come as true/"true"/1 or false/"false"/0. */
function isReturnRequested(item: { isReturnRequested?: boolean | string | number }): boolean {
  const v = item.isReturnRequested;
  return v === true || v === 'true' || v === 1;
}
function isReturnApproved(item: { isReturnApproved?: boolean | string | number }): boolean {
  const v = item.isReturnApproved;
  return v === true || v === 'true' || v === 1;
}

type ReviewedFields = { returnReviewedBy?: string | null; returnReviewedAt?: string | null };
/** True only when both returnReviewedBy and returnReviewedAt are non-null (admin has reviewed). */
function hasBeenReturnReviewed(item: ReviewedFields): boolean {
  const by = item.returnReviewedBy;
  const at = item.returnReviewedAt;
  if (by == null || at == null) return false;
  if (typeof by === 'string' && by.trim() === '') return false;
  return true;
}

/** Declined only when requested AND admin has reviewed (both non-null) AND not approved. Never show "declined" when not reviewed. */
function isReturnDeclined(item: {
  isReturnRequested?: boolean | string | number;
  isReturnApproved?: boolean | string | number;
} & ReviewedFields): boolean {
  if (!isReturnRequested(item)) return false;
  if (isReturnApproved(item)) return false;
  if (!hasBeenReturnReviewed(item)) return false;
  const v = item.isReturnApproved;
  return v === false || v === 'false' || v === 0;
}

function isReturnReviewed(item: { isReturnReviewed?: boolean | string | number }): boolean {
  const v = item.isReturnReviewed;
  return v === true || v === 'true' || v === 1;
}

/** Return requested but not yet reviewed (reviewedBy/reviewedAt both null). */
function isReturnInReview(item: {
  isReturnRequested?: boolean | string | number;
  isReturnApproved?: boolean | string | number;
} & ReviewedFields): boolean {
  if (!isReturnRequested(item)) return false;
  if (isReturnApproved(item)) return false;
  return !hasBeenReturnReviewed(item);
}

const OrdersPage: React.FC<OrdersPageProps> = ({
  initialOrders,
  ordersLoading = false,
  onOrdersRefetch,
  onReturnsRefetch,
}) => {
  // --- State ---
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [loadingOrders, setLoadingOrders] = useState(initialOrders === undefined ? true : !!ordersLoading);
  
  // Action Modal State
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonType, setReasonType] = useState<'cancellation' | 'return' | null>(null);
  const [reasonOrderId, setReasonOrderId] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');
  
  // Return Modal State
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [selectedReturnItems, setSelectedReturnItems] = useState<Map<string, { quantity: number; itemReason?: string }>>(new Map());
  
  // Item Return Modal State
  const [showItemReturnModal, setShowItemReturnModal] = useState(false);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<{
    orderId: string;
    orderItemId: string;
    itemName: string;
    maxQuantity: number;
  } | null>(null);
  const [itemReturnQuantity, setItemReturnQuantity] = useState(1);
  const [itemReturnReason, setItemReturnReason] = useState('');
  
  const { showSuccess, showError } = useToast();

  // --- Effects ---
  useEffect(() => {
    if (initialOrders !== undefined) {
      setOrders(transformOrders(initialOrders));
      setLoadingOrders(ordersLoading);
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await getMyOrdersAction();
        if (!response.error && response.data) {
          setOrders(transformOrders(response.data));
        }
      } catch (error) { console.error('Error fetching orders:', error); } 
      finally { setLoadingOrders(false); }
    };
    fetchOrders();
  }, [initialOrders, ordersLoading]);

  // --- Helpers ---
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `R${(num || 0).toFixed(2)}`;
  };

  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

  const truncateOrderNumber = (orderNumber: string) => {
    if (!orderNumber || orderNumber.length < 15) return orderNumber;
    return `${orderNumber.substring(0, 8)}...${orderNumber.substring(orderNumber.length - 4)}`;
  };

  const transformOrders = (backendOrders: IOrder[]): OrderDetail[] => {
    return backendOrders.map((order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      let statusLabel = capitalize(order.status);
      let statusCode = order.status.toLowerCase();

      let cancellationRequestStatus: string | null = null;
      if (order.cancellationRequestedAt) {
        if (order.status === 'cancelled') cancellationRequestStatus = 'approved';
        else if (order.cancellationRejectionReason) cancellationRequestStatus = 'rejected';
        else cancellationRequestStatus = 'pending';
      }

      if (cancellationRequestStatus) {
        statusLabel = `Cancellation ${capitalize(cancellationRequestStatus)}`;
        statusCode = `cancellation_${cancellationRequestStatus}`;
      } else {
        const statusMap: Record<string, string> = {
          'pending': 'Pending',
          'confirmed': 'Processing',
          'processing': 'Processing',
          'ready_to_ship': 'Ready to Ship',
          'shipped': 'In Transit',
          'delivered': 'Delivered',
          'cancelled': 'Cancelled',
        };
        statusLabel = statusMap[order.status.toLowerCase()] || 'Processing';
      }

      const totalAmount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount || 0;
      const shippingCost = totalAmount < 500 ? 75 : 0;
      const subtotal = totalAmount - shippingCost;
      const discount = 0; 

      const items = (order.items || []).map((item, idx) => {
        const product = item.product || {};
        let firstImage = '/placeholder-image.jpg';
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          const imageObj = product.images[0];
          if (typeof imageObj === 'object' && imageObj.file) firstImage = imageObj.file;
          else if (typeof imageObj === 'string') firstImage = imageObj;
        }
        
        const vendorName = product.vendorName || product.vendor?.name || 'Unknown Vendor';
        const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice || 0;
        
        const req = item.isReturnRequested as unknown;
        const app = item.isReturnApproved as unknown;
        const rev = item.isReturnReviewed as unknown;
        const isReq = req === true || req === 'true' || req === 1;
        let isApp: boolean | undefined = undefined;
        if (app === true || app === 'true' || app === 1) isApp = true;
        else if (app === false || app === 'false' || app === 0) isApp = false;
        const isRev = rev === true || rev === 'true' || rev === 1;
        const by = (item as any).returnReviewedBy ?? (item as any).reviewedBy ?? null;
        const at = (item as any).returnReviewedAt ?? (item as any).reviewedAt ?? null;

        return {
          id: item.id || `item-${idx}`,
          name: product.title || product.name || 'Unknown Product',
          vendor: vendorName,
          price: formatCurrency(unitPrice),
          quantity: item.quantity,
          image: firstImage,
          orderItemId: item.id,
          rejectionReason: item.rejectionReason || undefined,
          status: item.status || undefined,
          isReturnRequested: isReq,
          isReturnApproved: isApp,
          isReturnReviewed: isRev,
          returnReviewedBy: by,
          returnReviewedAt: at,
        };
      });

      const address = order.shippingAddress;
      const deliveryAddress = address ? `${address.street}, ${address.city}, ${address.postal || ''}` : 'No address provided';

      return {
        id: truncateOrderNumber(order.orderNumber),
        fullId: order.orderNumber,
        orderId: order.id || '',
        date: formattedDate,
        statusLabel,
        statusCode,
        total: formatCurrency(totalAmount),
        subtotal: formatCurrency(subtotal),
        shipping: formatCurrency(shippingCost),
        discount: formatCurrency(discount),
        pointsEarned: Math.floor(totalAmount * 0.1),
        deliveryAddress,
        trackingNumber: order.orderNumber,
        cancellationRequestStatus,
        isReturnRequested: order.isReturnRequested,
        isReturnApproved: order.isReturnApproved,
        isReturnReviewed: (() => {
          const v = order.isReturnReviewed as unknown;
          return v === true || v === 'true' || v === 1;
        })(),
        returnReviewedBy: (order as any).returnReviewedBy ?? (order as any).reviewedBy ?? null,
        returnReviewedAt: (order as any).returnReviewedAt ?? (order as any).reviewedAt ?? null,
        items,
      };
    });
  };

  const getOrderItemStatus = (order: OrderDetail) => {
    const hasRejectedItems = order.items.some(item => item.status === 'rejected' || item.rejectionReason);
    if (hasRejectedItems) return { hasRejected: true, hasReturned: false, message: 'Items Rejected' };
    return { hasRejected: false, hasReturned: false, message: null };
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = order.fullId.toLowerCase().includes(searchLower) || order.items.some(item => item.name.toLowerCase().includes(searchLower));

      let matchesFilter = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'active') {
          const activeStatuses = ['pending', 'processing', 'shipped', 'in transit'];
          matchesFilter = activeStatuses.some(s => order.statusCode.includes(s)) && !order.statusCode.includes('cancellation') && !order.statusCode.includes('return');
        } else if (statusFilter === 'requests') {
           matchesFilter = order.statusCode.includes('cancellation') || order.statusCode.includes('return');
        } else {
          matchesFilter = order.statusCode.includes(statusFilter);
        }
      }
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchQuery, statusFilter]);

  // --- Handlers ---
  const openCancellationModal = (orderId: string) => {
    setReasonType('cancellation');
    setReasonOrderId(orderId);
    setReasonText('');
    setShowReasonModal(true);
  };

  // Not strictly used directly but kept for logic consistency if needed
  const openReturnReasonModal = (orderId: string) => {
    setReasonType('return');
    setReasonOrderId(orderId);
    setReasonText('');
    setShowReasonModal(true);
  };

  const handleRequestCancellation = async (orderId: string, reason: string) => {
    if (!orderId || !reason.trim()) { showError('Please provide a reason'); return; }
    setProcessingRequest(orderId);
    try {
      const response = await requestCancellationAction({ orderId, reason: reason.trim() });
      if (!response.error && response.data) {
        showSuccess('Cancellation request submitted');
        setShowReasonModal(false);
        if (onOrdersRefetch) await onOrdersRefetch();
        else {
          const ordersResponse = await getMyOrdersAction();
          if (!ordersResponse.error && ordersResponse.data) setOrders(transformOrders(ordersResponse.data));
        }
      } else showError(response.message || 'Failed to submit request');
    } catch (error: any) { showError(error?.message || 'Failed to submit request'); } 
    finally { setProcessingRequest(null); }
  };

  const handleSubmitReason = async () => {
    if (!reasonOrderId) return;
    if (reasonType === 'cancellation') handleRequestCancellation(reasonOrderId, reasonText);
    else if (reasonType === 'return') { setShowReasonModal(false); openReturnModal(reasonOrderId); }
  };

  // Return Handlers
  const openReturnModal = (orderId: string) => {
    setReturnOrderId(orderId);
    setReturnReason('');
    setSelectedReturnItems(new Map());
    setShowReturnModal(true);
  };

  const openItemReturnModal = (orderId: string, orderItemId: string, itemName: string, maxQuantity: number) => {
    setSelectedItemForReturn({ orderId, orderItemId, itemName, maxQuantity });
    setItemReturnQuantity(1);
    setItemReturnReason('');
    setShowItemReturnModal(true);
  };

  const handleRequestReturn = async () => {
    if (!returnOrderId) { showError('Order ID required'); return; }
    if (!returnReason.trim() || returnReason.trim().length < 10) { showError('Provide a reason (min 10 chars)'); return; }
    if (selectedReturnItems.size === 0) { showError('Select at least one item'); return; }

    setProcessingRequest(returnOrderId);
    try {
      const items: ICreateReturnItemInput[] = Array.from(selectedReturnItems.entries()).map(([orderItemId, data]) => ({
        orderItemId,
        quantity: data.quantity,
        reason: data.itemReason || undefined,
      }));

      const response = await createReturnAction({ orderId: returnOrderId, reason: returnReason.trim(), items });

      if (!response.error && response.data) {
        showSuccess('Return request submitted');
        setShowReturnModal(false);
        setReturnOrderId(null);
        setReturnReason('');
        setSelectedReturnItems(new Map());
        if (onOrdersRefetch) {
          await onOrdersRefetch();
          if (onReturnsRefetch) await onReturnsRefetch();
        } else {
          const ordersResponse = await getMyOrdersAction();
          if (!ordersResponse.error && ordersResponse.data) setOrders(transformOrders(ordersResponse.data));
        }
      } else showError(response.message || 'Failed to submit request');
    } catch (error: any) { showError(error?.message || 'Failed to submit request'); } 
    finally { setProcessingRequest(null); }
  };

  const handleRequestItemReturn = async () => {
    if (!selectedItemForReturn) return;
    if (!itemReturnReason.trim() || itemReturnReason.trim().length < 10) { showError('Provide a reason (min 10 chars)'); return; }
    
    setProcessingRequest(selectedItemForReturn.orderId);
    try {
      const response = await createReturnAction({
        orderId: selectedItemForReturn.orderId,
        reason: itemReturnReason.trim(),
        items: [{
          orderItemId: selectedItemForReturn.orderItemId,
          quantity: itemReturnQuantity,
          reason: itemReturnReason.trim(),
        }],
      });

      if (!response.error && response.data) {
        showSuccess('Item return request submitted');
        setShowItemReturnModal(false);
        setSelectedItemForReturn(null);
        if (onOrdersRefetch) {
          await onOrdersRefetch();
          if (onReturnsRefetch) await onReturnsRefetch();
        } else {
          const ordersResponse = await getMyOrdersAction();
          if (!ordersResponse.error && ordersResponse.data) setOrders(transformOrders(ordersResponse.data));
        }
      } else showError(response.message || 'Failed to submit request');
    } catch (error: any) { showError(error?.message || 'Failed to submit request'); } 
    finally { setProcessingRequest(null); }
  };

  const toggleReturnItem = (orderItemId: string, maxQuantity: number) => {
    const newMap = new Map(selectedReturnItems);
    if (newMap.has(orderItemId)) newMap.delete(orderItemId);
    else newMap.set(orderItemId, { quantity: maxQuantity });
    setSelectedReturnItems(newMap);
  };

  const updateReturnItemQuantity = (orderItemId: string, quantity: number, maxQuantity: number) => {
    if (quantity < 1 || quantity > maxQuantity) return;
    const newMap = new Map(selectedReturnItems);
    const existing = newMap.get(orderItemId);
    if (existing) {
      newMap.set(orderItemId, { ...existing, quantity });
      setSelectedReturnItems(newMap);
    }
  };

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId || o.fullId === selectedOrderId), [selectedOrderId, orders]);

  // --- UI Components ---
  const renderStatusBadge = (label: string, code: string) => {
    let styles = "bg-slate-100 text-slate-600 border-slate-200";
    let dotColor = "bg-slate-400";
    
    if (code.includes('delivered')) { styles = "bg-emerald-50 text-emerald-700 border-emerald-200"; dotColor = "bg-emerald-500"; }
    else if (code.includes('transit') || code.includes('shipped')) { styles = "bg-blue-50 text-blue-700 border-blue-200"; dotColor = "bg-blue-500"; }
    else if (code.includes('processing')) { styles = "bg-amber-50 text-amber-700 border-amber-200"; dotColor = "bg-amber-500"; }
    else if (code.includes('cancelled') || code.includes('cancellation_approved')) { styles = "bg-red-50 text-red-700 border-red-200"; dotColor = "bg-red-500"; }
    else if (code === 'returned' || code.includes('return_completed')) { styles = "bg-purple-50 text-purple-700 border-purple-200"; dotColor = "bg-purple-500"; }
    else if (code.includes('return') || code.includes('cancellation')) { styles = "bg-orange-50 text-orange-700 border-orange-200"; dotColor = "bg-orange-500"; }

    return (
      <span className={`${styles} border px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {label}
      </span>
    );
  };

  return (
    <div className="font-sans text-slate-800">
      <AnimatePresence mode="wait">
              {selectedOrder ? (
                // --- DETAIL VIEW ---
                <motion.div
                  key="order-detail"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <button 
                    onClick={() => setSelectedOrderId(null)}
                    className="inline-flex items-center text-slate-500 font-semibold text-sm hover:text-jozi-forest transition-colors group px-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Order History
                  </button>

                  <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                             Order <span className="text-slate-400 font-normal">#{selectedOrder.id}</span>
                          </h2>
                          {renderStatusBadge(selectedOrder.statusLabel, selectedOrder.statusCode)}
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                          Placed on {selectedOrder.date}
                        </p>
                      </div>
                      <div className="flex flex-col items-start lg:items-end gap-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Number</p>
                        <div className="flex items-center text-jozi-forest font-bold font-mono">
                          {selectedOrder.trackingNumber}
                          <ExternalLink className="w-3.5 h-3.5 ml-2 text-jozi-gold cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracker (Only for non-cancelled/returned standard flows) */}
                    {!selectedOrder.statusCode.includes('cancel') && !selectedOrder.statusCode.includes('return') && (
                      <div className="py-2">
                         <div className="relative py-4">
                           <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{
                                 width: selectedOrder.statusCode.includes('delivered') ? '100%'
                                   : selectedOrder.statusCode.includes('transit') || selectedOrder.statusCode.includes('shipped') ? '80%'
                                   : selectedOrder.statusCode.includes('ready_to_ship') ? '60%'
                                   : selectedOrder.statusCode.includes('processing') || selectedOrder.statusCode.includes('confirmed') ? '40%'
                                   : '20%'
                               }}
                               transition={{ duration: 1, ease: "easeOut" }}
                               className="h-full bg-jozi-forest rounded-full" 
                             />
                           </div>
                           <div className="relative flex justify-between">
                              {[
                                { label: 'Placed', icon: Clock, active: true },
                                { label: 'Processing', icon: Package, active: !selectedOrder.statusCode.includes('pending') },
                                { label: 'Ready to Ship', icon: PackageCheck, active: ['ready_to_ship', 'shipped', 'in transit', 'delivered'].some(s => selectedOrder.statusCode.includes(s)) },
                                { label: 'In Transit', icon: Truck, active: ['shipped', 'in transit', 'delivered'].some(s => selectedOrder.statusCode.includes(s)) },
                                { label: 'Delivered', icon: MapPin, active: selectedOrder.statusCode.includes('delivered') }
                              ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 w-20">
                                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-md transition-all duration-500 ${step.active ? 'bg-jozi-forest text-white scale-110' : 'bg-slate-100 text-slate-300'}`}>
                                    <step.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                  </div>
                                  <span className={`text-[10px] lg:text-xs font-semibold uppercase tracking-wide text-center transition-colors ${step.active ? 'text-jozi-forest' : 'text-slate-300'}`}>{step.label}</span>
                                </div>
                              ))}
                           </div>
                         </div>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Items in Order</h3>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="bg-white p-5 flex flex-col sm:flex-row items-center gap-6 hover:bg-slate-50 transition-colors">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                            <div className="grow text-center sm:text-left space-y-1">
                              <h4 className="text-base font-bold text-slate-900 leading-tight">{item.name}</h4>
                              <p className="text-xs font-medium text-slate-500">Vendor: <span className="text-jozi-forest">{item.vendor}</span></p>
                              {item.status === 'rejected' && item.rejectionReason && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wide">
                                  <Ban className="w-3 h-3" /> Rejected: {item.rejectionReason}
                                </div>
                              )}
                              {isReturnRequested(item) && isReturnApproved(item) && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wide">
                                  <CheckCircle className="w-3 h-3 shrink-0" /> Return approved
                                </div>
                              )}
                              {isReturnRequested(item) && isReturnDeclined(item) && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wide">
                                  <XCircle className="w-3 h-3 shrink-0" /> Return declined
                                </div>
                              )}
                              {isReturnInReview(item) && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold uppercase tracking-wide">
                                  <Clock className="w-3 h-3 shrink-0" /> Return in review
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end px-4 sm:px-0">
                              <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Qty</p>
                                <p className="font-bold text-slate-800">{item.quantity}</p>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Price</p>
                                <p className="font-bold text-slate-800 text-lg">{item.price}</p>
                              </div>
                              {selectedOrder.statusCode === 'delivered' && 
                               !selectedOrder.statusCode.includes('cancel') && 
                               item.orderItemId && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openItemReturnModal(selectedOrder.orderId, item.orderItemId!, item.name, item.quantity);
                                  }}
                                  disabled={processingRequest === selectedOrder.orderId || isReturnRequested(item)}
                                  title={isReturnRequested(item) ? 'Return already requested for this item' : 'Return Item'}
                                  className="px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:text-jozi-forest hover:border-jozi-forest rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">{isReturnRequested(item) ? 'Requested' : 'Return'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 pt-6">
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center mb-3">
                            <MapPin className="w-3.5 h-3.5 mr-2 text-jozi-forest" /> Delivery Address
                          </h4>
                          <p className="font-semibold text-slate-700 leading-relaxed text-sm">{selectedOrder.deliveryAddress}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-jozi-forest to-emerald-900 p-6 rounded-2xl text-white relative overflow-hidden shadow-lg group">
                          <Award className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700 rotate-12" />
                          <div className="relative z-10 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-jozi-gold border border-white/20">
                              <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Loyalty Points Earned</p>
                              <p className="text-2xl font-bold">+{selectedOrder.pointsEarned}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Payment Summary</h4>
                           <div className="space-y-3">
                             <div className="flex justify-between text-sm text-slate-600">
                               <span>Subtotal</span>
                               <span className="font-semibold">{selectedOrder.subtotal}</span>
                             </div>
                             <div className="flex justify-between text-sm text-slate-600">
                               <span>Shipping</span>
                               <span className="font-semibold">{selectedOrder.shipping}</span>
                             </div>
                             {selectedOrder.voucherCode && (
                               <div className="flex justify-between text-sm text-emerald-600">
                                 <div className="flex items-center"><Tag className="w-3 h-3 mr-1" /> Discount</div>
                                 <span className="font-semibold">-{selectedOrder.discount}</span>
                               </div>
                             )}
                             <div className="h-px bg-slate-100 w-full my-2" />
                             <div className="flex justify-between items-center text-slate-900">
                               <span className="font-bold text-base">Total</span>
                               <span className="text-2xl font-bold">{selectedOrder.total}</span>
                             </div>
                           </div>
                        </div>
                        
                        <button className="w-full py-3 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                          <Receipt className="w-4 h-4" /> Download Invoice
                        </button>
                      </div>
                    </div>

                    {/* Order-level return in review */}
                    {selectedOrder.statusCode === 'delivered' &&
                      !selectedOrder.statusCode.includes('cancel') &&
                      !selectedOrder.statusCode.includes('return') &&
                      isReturnInReview(selectedOrder) && (
                      <div className="pt-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-semibold">Return request for this order is under review.</span>
                        </div>
                      </div>
                    )}

                    {/* Main Actions */}
                    {(['pending', 'processing', 'delivered'].some(s => selectedOrder.statusCode.includes(s))) && 
                      !selectedOrder.statusCode.includes('cancel') && 
                      !selectedOrder.statusCode.includes('return') && (
                      <div className="pt-6 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                          {(selectedOrder.statusCode === 'pending' || selectedOrder.statusCode === 'processing') && (
                            <button
                              onClick={() => selectedOrder.orderId && openCancellationModal(selectedOrder.orderId)}
                              disabled={processingRequest === selectedOrder.orderId}
                              className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm hover:bg-red-100 hover:border-red-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" /> Cancel Order
                            </button>
                          )}
                          {selectedOrder.statusCode === 'delivered' && (
                            <button
                              onClick={() => selectedOrder.orderId && openReturnModal(selectedOrder.orderId)}
                              disabled={processingRequest === selectedOrder.orderId || isReturnRequested(selectedOrder)}
                              title={isReturnRequested(selectedOrder) ? (isReturnInReview(selectedOrder) ? 'Return request is under review' : 'Return already requested for this order') : undefined}
                              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-jozi-forest hover:text-jozi-forest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                            >
                              <RotateCcw className="w-4 h-4" /> {isReturnRequested(selectedOrder) ? (isReturnInReview(selectedOrder) ? 'Return in review' : 'Return Requested') : 'Return Order'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                // --- LIST VIEW ---
                <motion.div
                  key="orders-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Orders</h1>
                      <p className="text-slate-500 mt-1">Manage and track your recent purchases.</p>
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2">
                    <div className="relative grow">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search order ID or product..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-slate-50 transition-colors"
                      />
                    </div>
                    <div className="h-px md:h-auto md:w-px bg-slate-100 mx-1" />
                    <div className="relative min-w-[220px]">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-transparent text-xs font-bold uppercase tracking-wide text-slate-600 outline-none focus:bg-slate-50 appearance-none cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active (Processing/Ship)</option>
                        <option value="delivered">Delivered</option>
                        <option value="requests">Returns & Cancels</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* List Content */}
                  <div className="space-y-4">
                    {loadingOrders ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-jozi-forest rounded-full animate-spin" />
                        <p className="text-slate-400 text-sm font-medium">Loading your history...</p>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <ShoppingBag className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg">No orders found</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                          We couldn't find any orders matching your filters. Try clearing them to see more results.
                        </p>
                      </div>
                    ) : (
                      filteredOrders.map((order) => {
                         const itemStatus = getOrderItemStatus(order);
                         return (
                         <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={order.fullId} 
                          onClick={() => setSelectedOrderId(order.fullId)}
                          className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-jozi-forest/30 transition-all duration-300 group relative overflow-hidden"
                         >
                           <div className="absolute top-0 left-0 w-1 h-full bg-jozi-forest opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                             <div className="space-y-2">
                               <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-lg font-bold text-slate-900 group-hover:text-jozi-forest transition-colors">
                                    {order.id}
                                  </span>
                                  {renderStatusBadge(order.statusLabel, order.statusCode)}
                               </div>
                               <div className="flex items-center gap-4 text-sm text-slate-500">
                                 <span className="flex items-center gap-1.5 font-medium">
                                   <Clock className="w-3.5 h-3.5" /> {order.date}
                                 </span>
                                 <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                 <span>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                               </div>
                               {itemStatus.message && (
                                 <div className="flex mt-1">
                                   <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border bg-red-50 text-red-600 border-red-100">
                                     {itemStatus.message}
                                   </span>
                                 </div>
                               )}
                             </div>
                             <div className="flex items-center justify-between md:justify-end gap-6 grow md:grow-0">
                               <div className="flex -space-x-3">
                                 {order.items.slice(0, 3).map((item, idx) => (
                                   <div key={idx} className="w-12 h-12 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-slate-100 relative z-0 hover:z-10 transition-all hover:scale-110">
                                     <img src={item.image} className="w-full h-full object-cover" alt="" />
                                   </div>
                                 ))}
                                 {order.items.length > 3 && (
                                   <div className="w-12 h-12 rounded-lg border-2 border-white shadow-sm bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500 z-0">
                                     +{order.items.length - 3}
                                   </div>
                                 )}
                               </div>
                               <div className="text-right">
                                 <p className="text-xl font-bold text-slate-900">{order.total}</p>
                               </div>
                               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-jozi-forest group-hover:text-white transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                               </div>
                             </div>
                           </div>
                         </motion.div>
                         );
                       })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

      {/* --- Modals --- */}
      
      {/* Reason Modal (Cancellation/Generic) */}
      <AnimatePresence>
        {showReasonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !processingRequest && setShowReasonModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${reasonType === 'cancellation' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {reasonType === 'cancellation' ? <AlertCircle className="w-6 h-6" /> : <RotateCcw className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {reasonType === 'cancellation' ? 'Cancel Order' : 'Return Order'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {reasonType === 'cancellation' ? 'Confirm cancellation request' : 'Initiate return process'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !processingRequest && setShowReasonModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed border border-slate-100 flex gap-3">
                  <Info className="w-5 h-5 text-slate-400 shrink-0" />
                  <p>
                    {reasonType === 'cancellation' 
                      ? 'Cancellation is only possible if the order hasn\'t shipped. Funds will be returned to your wallet.'
                      : 'Please describe why you wish to return this. This helps us serve you better.'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5 block">Reason</label>
                  <textarea
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Type your reason here..."
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-jozi-forest/20 focus:border-jozi-forest outline-none transition-all resize-none"
                    disabled={processingRequest !== null}
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-[10px] font-bold ${reasonText.length < 10 ? 'text-red-400' : 'text-emerald-500'}`}>
                      {reasonText.length} / 10 characters
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => !processingRequest && setShowReasonModal(false)}
                    disabled={processingRequest !== null}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleSubmitReason}
                    disabled={processingRequest !== null || !reasonText.trim() || reasonText.trim().length < 10}
                    className="flex-1 py-3 bg-jozi-forest text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-jozi-forest/20"
                  >
                    {processingRequest ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Request'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Return Modal - Select Items */}
      <AnimatePresence>
        {showReturnModal && returnOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !processingRequest && setShowReturnModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Request Return</h3>
                    <p className="text-sm text-slate-500">Select items to return</p>
                  </div>
                </div>
                <button
                  onClick={() => !processingRequest && setShowReturnModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100">
                  Select the items you want to return and provide a reason. You can return all or specific items from this order.
                </div>

                {/* Items Selection */}
                {(() => {
                  const order = orders.find(o => o.orderId === returnOrderId);
                  if (!order) return null;
                  
                  return (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Items</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {order.items.map((item) => {
                          const isSelected = selectedReturnItems.has(item.orderItemId || '');
                          const selectedData = selectedReturnItems.get(item.orderItemId || '');
                          const quantity = selectedData?.quantity || item.quantity;
                          
                          return (
                            <div
                              key={item.id}
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                                  : 'border-slate-200 bg-white hover:border-blue-300'
                              }`}
                              onClick={() => item.orderItemId && toggleReturnItem(item.orderItemId, item.quantity)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`flex items-center justify-center w-6 h-6 rounded shrink-0 transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-300'}`}>
                                  {isSelected ? <CheckSquare className="w-6 h-6 fill-current" /> : <Square className="w-6 h-6" />}
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    <img src={item.image} alt="" className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-bold text-sm truncate ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{item.name}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">Purchased Qty: {item.quantity}</p>
                                </div>
                                {isSelected && item.orderItemId && (
                                  <div className="flex items-center gap-2 bg-white rounded-lg border border-blue-200 p-1 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={() => updateReturnItemQuantity(item.orderItemId!, Math.max(1, quantity - 1), item.quantity)}
                                      disabled={quantity <= 1}
                                      className="w-7 h-7 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                                    >
                                      <X className="w-3 h-3 rotate-45" />
                                    </button>
                                    <span className="w-8 text-center font-bold text-sm text-slate-800">{quantity}</span>
                                    <button
                                      type="button"
                                      onClick={() => updateReturnItemQuantity(item.orderItemId!, Math.min(item.quantity, quantity + 1), item.quantity)}
                                      disabled={quantity >= item.quantity}
                                      className="w-7 h-7 flex items-center justify-center rounded bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                                    >
                                      <X className="w-3 h-3 -rotate-45" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Return Reason */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5 block">Reason for Return</label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Please explain why you are returning these items..."
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-jozi-forest/20 focus:border-jozi-forest outline-none transition-all resize-none"
                    disabled={processingRequest !== null}
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-[10px] font-bold ${returnReason.length < 10 ? 'text-red-400' : 'text-emerald-500'}`}>
                      {returnReason.length} / 10
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => !processingRequest && setShowReturnModal(false)}
                    disabled={processingRequest !== null}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestReturn}
                    disabled={processingRequest !== null || !returnReason.trim() || returnReason.trim().length < 10 || selectedReturnItems.size === 0}
                    className="flex-1 py-3 bg-jozi-forest text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-jozi-forest/20"
                  >
                    {processingRequest ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Request'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Return Modal */}
      <AnimatePresence>
        {showItemReturnModal && selectedItemForReturn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !processingRequest && setShowItemReturnModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Return Item</h3>
                    <p className="text-sm text-slate-500">{selectedItemForReturn.itemName}</p>
                  </div>
                </div>
                <button
                  onClick={() => !processingRequest && setShowItemReturnModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">Quantity to Return</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setItemReturnQuantity(Math.max(1, itemReturnQuantity - 1))}
                      disabled={processingRequest !== null || itemReturnQuantity <= 1}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      <span className="text-xl font-bold">-</span>
                    </button>
                    <div className="flex-1 text-center">
                      <input
                        type="number"
                        min="1"
                        max={selectedItemForReturn.maxQuantity}
                        value={itemReturnQuantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setItemReturnQuantity(Math.max(1, Math.min(val, selectedItemForReturn.maxQuantity)));
                        }}
                        className="w-full text-center py-2 bg-transparent font-bold text-2xl text-slate-800 outline-none"
                        disabled={processingRequest !== null}
                      />
                      <p className="text-xs text-slate-400 mt-1">Max: {selectedItemForReturn.maxQuantity}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setItemReturnQuantity(Math.min(selectedItemForReturn.maxQuantity, itemReturnQuantity + 1))}
                      disabled={processingRequest !== null || itemReturnQuantity >= selectedItemForReturn.maxQuantity}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5 block">Reason</label>
                  <textarea
                    value={itemReturnReason}
                    onChange={(e) => setItemReturnReason(e.target.value)}
                    placeholder="Why are you returning this item?"
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-jozi-forest/20 focus:border-jozi-forest outline-none transition-all resize-none"
                    disabled={processingRequest !== null}
                  />
                  <div className="flex justify-end mt-1">
                     <span className={`text-[10px] font-bold ${itemReturnReason.length < 10 ? 'text-red-400' : 'text-emerald-500'}`}>
                      {itemReturnReason.length} / 10
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => !processingRequest && setShowItemReturnModal(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestItemReturn}
                    disabled={processingRequest !== null || itemReturnReason.length < 10}
                    className="flex-1 py-3 bg-jozi-forest text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all disabled:opacity-50 shadow-lg shadow-jozi-forest/20 flex items-center justify-center gap-2"
                  >
                    {processingRequest ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;