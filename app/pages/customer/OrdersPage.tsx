'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
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
  Ban
} from 'lucide-react';
import CustomerSidebar from '../../components/CustomerSidebar';
import { getCurrentUserAction } from '@/app/actions/auth/auth';
import { getMyOrdersAction, requestCancellationAction } from '@/app/actions/order/index';
import { IUser } from '@/interfaces/auth/auth';
import { useToast } from '@/app/contexts/ToastContext';
import { IOrder } from '@/interfaces/order/order';


// Frontend transformed interface for display
interface OrderDetail {
  id: string;        // Display ID (Truncated)
  fullId: string;    // Full Order Number
  orderId: string;   // Database UUID
  date: string;
  statusLabel: string; // The pretty string to show (e.g., "Cancellation Pending")
  statusCode: string;  // For logic (e.g., 'cancellation_pending')
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  voucherCode?: string;
  pointsEarned: number;
  deliveryAddress: string;
  trackingNumber: string;
  cancellationRequestStatus?: string | null;
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
  }[];
}

const OrdersPage: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Action Modal State (cancellation only; returns handled in Profile → Returns)
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonType, setReasonType] = useState<'cancellation' | null>(null);
  const [reasonOrderId, setReasonOrderId] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');
  
  const { showSuccess, showError } = useToast();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUserAction();
        if (!response.error && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrdersAction();
        if (!response.error && response.data) {
          const transformedOrders = transformOrders(response.data);
          setOrders(transformedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper to format currency
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `R${(num || 0).toFixed(2)}`;
  };

  // Helper to capitalize
  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

  // Helper to truncate order number
  const truncateOrderNumber = (orderNumber: string) => {
    if (!orderNumber || orderNumber.length < 15) return orderNumber;
    // Keep first 8 and last 4
    return `${orderNumber.substring(0, 8)}...${orderNumber.substring(orderNumber.length - 4)}`;
  };

  // Transform backend orders to frontend format
  const transformOrders = (backendOrders: IOrder[]): OrderDetail[] => {
    return backendOrders.map((order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // --- Determine Display Status Logic ---
      let statusLabel = capitalize(order.status);
      let statusCode = order.status.toLowerCase();

      let cancellationRequestStatus: string | null = null;
      if (order.cancellationRequestedAt) {
        if (order.status === 'cancelled') {
          cancellationRequestStatus = 'approved';
        } else if (order.cancellationRejectionReason) {
          cancellationRequestStatus = 'rejected';
        } else {
          cancellationRequestStatus = 'pending';
        }
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

      const totalAmount = typeof order.totalAmount === 'string' 
        ? parseFloat(order.totalAmount) 
        : order.totalAmount || 0;

      // Logic: If total < 500, shipping is R75, else 0. 
      const shippingCost = totalAmount < 500 ? 75 : 0;
      const subtotal = totalAmount - shippingCost;
      const discount = 0; 

      const items = (order.items || []).map((item, idx) => {
        const product = item.product || {};
        
        // Handle images
        let firstImage = '/placeholder-image.jpg';
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          const imageObj = product.images[0];
          if (typeof imageObj === 'object' && imageObj.file) {
            firstImage = imageObj.file;
          } else if (typeof imageObj === 'string') {
            firstImage = imageObj;
          }
        }
        
        const vendorName = product.vendorName || product.vendor?.name || 'Unknown Vendor';
        const unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice || 0;
        
        return {
          id: item.id || `item-${idx}`,
          name: product.title || product.name || 'Unknown Product',
          vendor: vendorName,
          price: formatCurrency(unitPrice),
          quantity: item.quantity,
          image: firstImage,
          orderItemId: item.id,
          rejectionReason: item.rejectionReason || undefined, // Vendor rejection reason
          status: item.status || undefined, // Order item status
        };
      });

      const address = order.shippingAddress;
      const deliveryAddress = address 
        ? `${address.street}, ${address.city}, ${address.postal || ''}`
        : 'No address provided';

      const pointsEarned = Math.floor(totalAmount * 0.1);

      return {
        id: truncateOrderNumber(order.orderNumber),
        fullId: order.orderNumber,
        orderId: order.id || '',
        date: formattedDate,
        statusLabel: statusLabel,
        statusCode: statusCode,
        total: formatCurrency(totalAmount),
        subtotal: formatCurrency(subtotal),
        shipping: formatCurrency(shippingCost),
        discount: formatCurrency(discount),
        pointsEarned,
        deliveryAddress,
        trackingNumber: order.orderNumber,
        cancellationRequestStatus,
        items,
      };
    });
  };

  // Helper to check if order has rejected or returned items
  const getOrderItemStatus = (order: OrderDetail) => {
    const hasRejectedItems = order.items.some(item => 
      item.status === 'rejected' || 
      item.rejectionReason
    );
    if (hasRejectedItems) {
      return { hasRejected: true, hasReturned: false, message: 'Some items rejected' };
    }
    return { hasRejected: false, hasReturned: false, message: null };
  };

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search Filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        order.fullId.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower));

      // 2. Status Filter
      let matchesFilter = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'active') {
          // Active = Pending, Processing, In Transit
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

  const handleRequestCancellation = async (orderId: string, reason: string) => {
    if (!orderId) { showError('Order ID is required'); return; }
    if (!reason.trim()) { showError('Please provide a reason'); return; }

    setProcessingRequest(orderId);
    try {
      const response = await requestCancellationAction({ orderId, reason: reason.trim() });
      if (!response.error && response.data) {
        showSuccess('Cancellation request submitted successfully');
        setShowReasonModal(false);
        // Refresh
        const ordersResponse = await getMyOrdersAction();
        if (!ordersResponse.error && ordersResponse.data) {
          setOrders(transformOrders(ordersResponse.data));
        }
      } else {
        showError(response.message || 'Failed to submit cancellation request');
      }
    } catch (error: any) {
      showError(error?.message || 'Failed to submit cancellation request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleSubmitReason = () => {
    if (!reasonOrderId) return;
    if (reasonType === 'cancellation') handleRequestCancellation(reasonOrderId, reasonText);
  };

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId || o.fullId === selectedOrderId), [selectedOrderId, orders]);

  // Sidebar User Data
  const sidebarUser = user ? {
    name: user.fullName || 'User',
    email: user.email || '',
    avatar: user.profileUrl || 'https://picsum.photos/seed/user/200/200',
    level: 22,
    points: 1250,
  } : {
    name: 'Loading...',
    email: '',
    avatar: 'https://picsum.photos/seed/user/200/200',
    level: 0,
    points: 0,
  };

  // UI Components
  const renderStatusBadge = (label: string, code: string) => {
    let styles = "bg-gray-100 text-gray-600";
    
    if (code.includes('delivered')) styles = "bg-emerald-100 text-emerald-600";
    else if (code.includes('transit') || code.includes('shipped')) styles = "bg-blue-100 text-blue-600";
    else if (code.includes('processing')) styles = "bg-amber-100 text-amber-600";
    else if (code.includes('cancelled') || code.includes('cancellation_approved')) styles = "bg-red-100 text-red-600";
    else if (code === 'returned' || code.includes('return_completed')) styles = "bg-purple-100 text-purple-600"; // Return completed
    else if (code === 'return_in_progress') styles = "bg-blue-100 text-blue-600"; // Return in progress
    else if (code.includes('return_rejected')) styles = "bg-red-100 text-red-600"; // Return rejected
    else if (code.includes('cancellation') || code.includes('return')) styles = "bg-orange-100 text-orange-600"; // Pending requests

    return (
      <span className={`${styles} px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
        {label}
      </span>
    );
  };

  return (
    <div className="bg-jozi-cream min-h-screen pb-24 font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          <div className="lg:w-80 flex-shrink-0">
             <CustomerSidebar user={sidebarUser} />
          </div>

          <main className="grow min-w-0"> {/* min-w-0 prevents flex items from overflowing */}
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                // --- DETAIL VIEW ---
                <motion.div
                  key="order-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <button 
                    onClick={() => setSelectedOrderId(null)}
                    className="inline-flex items-center text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-jozi-forest transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to History
                  </button>

                  <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-jozi-forest/5 space-y-10">
                    {/* Detail Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8">
                      <div className="space-y-3 text-left">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-3xl font-black text-jozi-forest tracking-tight break-all">
                             {/* Show truncated ID on mobile, full on large screens if needed, or stick to truncated with full in title */}
                             <span title={selectedOrder.fullId}>{selectedOrder.id}</span>
                          </h2>
                          {renderStatusBadge(selectedOrder.statusLabel, selectedOrder.statusCode)}
                        </div>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                          Placed on {selectedOrder.date}
                        </p>
                      </div>
                      <div className="text-left md:text-right space-y-1 w-full md:w-auto">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking Number</p>
                        <div className="flex items-center md:justify-end text-jozi-forest font-bold text-lg break-all">
                          {selectedOrder.trackingNumber}
                          <ExternalLink className="w-4 h-4 ml-2 text-jozi-gold cursor-pointer shrink-0" />
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar (Only for non-cancelled/returned standard flows) */}
                    {!selectedOrder.statusCode.includes('cancel') && !selectedOrder.statusCode.includes('return') && (
                      <div className="space-y-6 text-left">
                         <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest">Shipment Status</h3>
                         <div className="relative py-4">
                           {/* Line */}
                           <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                             <div className={`h-full bg-jozi-gold transition-all duration-1000 ${
                               selectedOrder.statusCode.includes('delivered') ? 'w-full' : 
                               selectedOrder.statusCode.includes('transit') || selectedOrder.statusCode.includes('shipped') ? 'w-3/4' : 
                               selectedOrder.statusCode.includes('processing') ? 'w-1/2' : 
                               'w-1/4'
                             }`} />
                           </div>
                           {/* Steps */}
                           <div className="relative flex justify-between">
                              {[
                                { label: 'Ordered', icon: Clock, active: true },
                                { label: 'Processing', icon: Package, active: !selectedOrder.statusCode.includes('pending') },
                                { label: 'In Transit', icon: Truck, active: ['shipped', 'in transit', 'delivered'].some(s => selectedOrder.statusCode.includes(s)) },
                                { label: 'Delivered', icon: MapPin, active: selectedOrder.statusCode.includes('delivered') }
                              ].map((step, i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative z-10 border-4 border-white shadow-md transition-all ${step.active ? 'bg-jozi-forest text-white' : 'bg-white text-gray-200'}`}>
                                    <step.icon className="w-4 h-4" />
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:block ${step.active ? 'text-jozi-forest' : 'text-gray-300'}`}>{step.label}</span>
                                </div>
                              ))}
                           </div>
                         </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-6 text-left">
                      <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest">Ordered Items</h3>
                      <div className="grid gap-4">
                        {selectedOrder.items.map((item) => (
                            <div key={item.id} className="bg-gray-50/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-gray-100">
                              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                              </div>
                              <div className="grow text-center sm:text-left">
                                <h4 className="text-lg font-black text-jozi-forest leading-tight">{item.name}</h4>
                                <p className="text-[10px] font-bold text-jozi-gold uppercase tracking-widest mt-1">by {item.vendor}</p>
                                {item.status === 'rejected' && item.rejectionReason && (
                                  <div className="mt-2 inline-flex flex-col gap-1 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                                    <div className="flex items-center gap-1">
                                      <Ban className="w-3 h-3 text-red-500" />
                                      <span className="text-[9px] font-black uppercase tracking-wider text-red-600">Item Rejected</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-red-700 italic leading-relaxed">Reason: {item.rejectionReason}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-8 sm:gap-12 w-full sm:w-auto justify-between sm:justify-end px-4 sm:px-0">
                                <div className="text-center">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qty</p>
                                  <p className="font-bold text-jozi-forest">{item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                                  <p className="font-bold text-jozi-forest text-lg">{item.price}</p>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 pt-8 border-t border-gray-100 text-left">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-jozi-forest uppercase tracking-widest flex items-center">
                            <MapPin className="w-3 h-3 mr-2 text-jozi-gold" /> Delivery Destination
                          </h4>
                          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="font-bold text-gray-600 leading-relaxed text-sm">{selectedOrder.deliveryAddress}</p>
                          </div>
                        </div>
                        {/* Loyalty Card */}
                        <div className="bg-gradient-to-br from-jozi-forest to-[#1a3a2a] p-6 rounded-3xl text-white relative overflow-hidden group shadow-lg">
                          <Award className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform duration-700" />
                          <div className="relative z-10 flex items-center gap-5">
                            <div className="w-12 h-12 bg-jozi-gold rounded-xl flex items-center justify-center text-jozi-forest shadow-md">
                              <Zap className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-jozi-gold opacity-80">Neighbors Loyalty</p>
                              <p className="text-xl font-black">+{selectedOrder.pointsEarned} Pts</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <h4 className="text-xs font-black text-jozi-forest uppercase tracking-widest">Payment Breakdown</h4>
                        <div className="bg-gray-50/50 rounded-2xl p-6 space-y-3">
                           <div className="flex justify-between items-center text-gray-500 font-bold text-xs">
                             <span>Original Subtotal</span>
                             <span>{selectedOrder.subtotal}</span>
                           </div>
                           <div className="flex justify-between items-center text-gray-500 font-bold text-xs">
                             <span>Hub Logistics & Shipping</span>
                             <span>{selectedOrder.shipping}</span>
                           </div>
                           {selectedOrder.voucherCode && (
                             <div className="flex justify-between items-center text-emerald-600 font-bold text-xs">
                               <div className="flex items-center">
                                 <Tag className="w-3 h-3 mr-1.5" />
                                 <span>Discount</span>
                               </div>
                               <span>-{selectedOrder.discount}</span>
                             </div>
                           )}
                           <div className="h-px bg-gray-200 w-full my-2" />
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black uppercase tracking-widest text-jozi-forest">Total Paid</span>
                             <span className="text-2xl font-black text-jozi-forest tracking-tight">{selectedOrder.total}</span>
                           </div>
                        </div>
                        
                        <button className="w-full py-4 bg-white border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest text-jozi-forest hover:bg-jozi-forest hover:text-white hover:border-jozi-forest transition-all shadow-sm flex items-center justify-center gap-2">
                          <Receipt className="w-4 h-4" /> Download Invoice
                        </button>
                      </div>
                    </div>

                    {/* Actions Area */}
                    {(['pending', 'processing', 'delivered'].some(s => selectedOrder.statusCode.includes(s))) && 
                      !selectedOrder.statusCode.includes('cancel') && 
                      !selectedOrder.statusCode.includes('return') && (
                      <div className="pt-8 border-t border-gray-100 space-y-4">
                        <h4 className="text-xs font-black text-jozi-forest uppercase tracking-widest">Order Actions</h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Cancel Logic */}
                          {(selectedOrder.statusCode === 'pending' || selectedOrder.statusCode === 'processing') && (
                            <button
                              onClick={() => selectedOrder.orderId && openCancellationModal(selectedOrder.orderId)}
                              disabled={processingRequest === selectedOrder.orderId}
                              className="flex-1 flex items-center justify-center space-x-2 py-4 bg-red-50 text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                              <span>Request Cancellation</span>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <h3 className="text-3xl font-black text-jozi-forest uppercase tracking-tight">Artisan Orders</h3>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="bg-white p-2 rounded-2xl shadow-sm border border-jozi-forest/5 flex flex-col md:flex-row gap-2">
                    <div className="relative grow">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search by Order ID or Product Name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent font-medium text-jozi-forest placeholder-gray-400 outline-none focus:bg-gray-50 transition-colors text-sm"
                      />
                    </div>
                    <div className="h-px md:h-auto md:w-px bg-gray-100" />
                    <div className="relative min-w-[200px]">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-11 pr-8 py-3 rounded-xl bg-transparent font-bold text-xs uppercase tracking-widest text-gray-600 outline-none focus:bg-gray-50 appearance-none cursor-pointer"
                      >
                        <option value="all">All Orders</option>
                        <option value="active">Active Orders</option>
                        <option value="delivered">Delivered</option>
                        <option value="requests">Cancellations</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 rotate-90" />
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-jozi-forest/5 shadow-soft min-h-[400px]">
                    {loadingOrders ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="w-10 h-10 border-4 border-jozi-forest/20 border-t-jozi-forest rounded-full animate-spin" />
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading history...</p>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-jozi-forest font-black text-lg">No orders found</p>
                          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                       {filteredOrders.map((order) => {
                         const itemStatus = getOrderItemStatus(order);
                         return (
                         <div 
                          key={order.fullId} 
                          onClick={() => setSelectedOrderId(order.fullId)}
                          className="border border-gray-100 rounded-3xl p-6 hover:border-jozi-gold/30 hover:shadow-md transition-all cursor-pointer group bg-white"
                         >
                           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                             <div className="space-y-1.5">
                               <div className="flex items-center gap-3 flex-wrap">
                                  <p className="text-lg font-black text-jozi-forest group-hover:text-jozi-gold transition-colors font-mono tracking-tight">
                                    {order.id}
                                  </p>
                                  {renderStatusBadge(order.statusLabel, order.statusCode)}
                               </div>
                               <div className="flex items-center gap-3 flex-wrap">
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                   <Clock className="w-3 h-3" /> {order.date}
                                 </p>
                                 {itemStatus.message && (
                                   <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-red-100 text-red-700">
                                     {itemStatus.message}
                                   </span>
                                 )}
                               </div>
                             </div>
                             <div className="flex items-center justify-between sm:justify-end gap-6 min-w-[150px]">
                               <p className="text-xl font-black text-jozi-forest">{order.total}</p>
                               <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-jozi-forest group-hover:text-white transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                               </div>
                             </div>
                           </div>
                           
                           {/* Mini Items Preview */}
                           <div className="flex items-center gap-3 overflow-hidden pt-4 border-t border-gray-50">
                             {order.items.slice(0, 4).map((item, idx) => (
                               <div key={idx} className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 relative">
                                 <img src={item.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={item.name} />
                               </div>
                             ))}
                             {order.items.length > 4 && (
                               <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                  <span className="text-xs font-bold text-gray-400">+{order.items.length - 4}</span>
                               </div>
                             )}
                             <div className="ml-auto text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</p>
                             </div>
                           </div>
                         </div>
                         );
                       })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Reason Modal */}
      <AnimatePresence>
        {showReasonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-jozi-forest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!processingRequest) {
                setShowReasonModal(false);
                setReasonText('');
                setReasonType(null);
                setReasonOrderId(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] p-8 md:p-10 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <X className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-jozi-forest uppercase tracking-tight">Cancel Order</h3>
                </div>
                <button
                  onClick={() => !processingRequest && setShowReasonModal(false)}
                  disabled={processingRequest !== null}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">
                    Please let us know why you wish to cancel. This helps us improve our service for future orders.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-jozi-forest ml-1">
                    Reason
                  </label>
                  <textarea
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Type your reason here..."
                    rows={4}
                    className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 font-medium text-sm text-jozi-forest outline-none focus:border-jozi-gold/50 transition-all resize-none placeholder-gray-300"
                    disabled={processingRequest !== null}
                  />
                  <p className="text-[9px] text-gray-400 font-bold ml-1 text-right">
                    {reasonText.length}/10 min chars
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => !processingRequest && setShowReasonModal(false)}
                    disabled={processingRequest !== null}
                    className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleSubmitReason}
                    disabled={processingRequest !== null || !reasonText.trim() || reasonText.trim().length < 10}
                    className="flex-1 py-4 bg-jozi-forest text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-jozi-forest/20"
                  >
                    {processingRequest ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing</span>
                      </>
                    ) : (
                      <span>Confirm Request</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;