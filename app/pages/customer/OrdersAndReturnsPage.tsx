'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ChevronRight, Clock, MapPin, Award, Zap, ArrowLeft, Truck, 
  ExternalLink, Tag, X, AlertCircle, Search, Filter, Receipt, Ban, 
  RotateCcw, CheckSquare, Square, ShoppingBag, Info, User, Layers 
} from 'lucide-react';

// --- Imports (Assumed based on your context) ---
import CustomerSidebar from '../../components/CustomerSidebar';
import { getCurrentUserAction } from '@/app/actions/auth/auth';
import { getMyOrdersAction, requestCancellationAction } from '@/app/actions/order/index';
import { createReturnAction } from '@/app/actions/return/index';
import { getMyReturnsAction, cancelReturnAction } from '@/app/actions/return/index';
import { useToast } from '@/app/contexts/ToastContext';
import { IUser } from '@/interfaces/auth/auth';
import { IOrder } from '@/interfaces/order/order';
import type { ICreateReturnItemInput } from '@/interfaces/return/return';
import type { IReturn } from '@/interfaces/return/return';
import ReturnsTable from '@/app/components/return/ReturnsTable';
import ReturnDetailDrawer from '@/app/components/return/ReturnDetailDrawer';
import OrdersPage from '@/app/pages/customer/OrdersPage';

// ----------------------------------------------------------------------
// TYPES & INTERFACES
// ----------------------------------------------------------------------

interface OrderDetail {
  id: string; fullId: string; orderId: string; date: string;
  statusLabel: string; statusCode: string; total: string; subtotal: string;
  shipping: string; discount: string; voucherCode?: string; pointsEarned: number;
  deliveryAddress: string; trackingNumber: string; cancellationRequestStatus?: string | null;
  isReturnRequested?: boolean; isReturnApproved?: boolean;
  items: {
    id: string; name: string; vendor: string; price: string; quantity: number;
    image: string; orderItemId?: string; rejectionReason?: string | null;
    status?: string; isReturnRequested?: boolean; isReturnApproved?: boolean;
  }[];
}

// ----------------------------------------------------------------------
// SUB-COMPONENT: ORDERS VIEW
// ----------------------------------------------------------------------

const OrdersView: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Modal States
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
    orderId: string; orderItemId: string; itemName: string; maxQuantity: number;
  } | null>(null);
  const [itemReturnQuantity, setItemReturnQuantity] = useState(1);
  const [itemReturnReason, setItemReturnReason] = useState('');
  
  const { showSuccess, showError } = useToast();

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
          'pending': 'Pending', 'confirmed': 'Processing', 'processing': 'Processing',
          'ready_to_ship': 'Ready to Ship', 'shipped': 'In Transit', 'delivered': 'Delivered', 'cancelled': 'Cancelled',
        };
        statusLabel = statusMap[order.status.toLowerCase()] || 'Processing';
      }

      const totalAmount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount || 0;
      const shippingCost = totalAmount < 500 ? 75 : 0;
      const subtotal = totalAmount - shippingCost;
      const items = (order.items || []).map((item, idx) => {
        const product = item.product || {};
        let firstImage = '/placeholder-image.jpg';
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          const imageObj = product.images[0];
          firstImage = typeof imageObj === 'object' && imageObj.file ? imageObj.file : imageObj;
        }
        return {
          id: item.id || `item-${idx}`, name: product.title || product.name || 'Unknown Product',
          vendor: product.vendorName || product.vendor?.name || 'Unknown Vendor',
          price: formatCurrency(typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice || 0),
          quantity: item.quantity, image: firstImage, orderItemId: item.id,
          rejectionReason: item.rejectionReason || undefined, status: item.status || undefined,
          isReturnRequested: item.isReturnRequested, isReturnApproved: item.isReturnApproved,
        };
      });

      const address = order.shippingAddress;
      return {
        id: truncateOrderNumber(order.orderNumber), fullId: order.orderNumber, orderId: order.id || '',
        date: formattedDate, statusLabel, statusCode, total: formatCurrency(totalAmount),
        subtotal: formatCurrency(subtotal), shipping: formatCurrency(shippingCost), discount: formatCurrency(0),
        pointsEarned: Math.floor(totalAmount * 0.1),
        deliveryAddress: address ? `${address.street}, ${address.city}, ${address.postal || ''}` : 'No address provided',
        trackingNumber: order.orderNumber, cancellationRequestStatus,
        isReturnRequested: order.isReturnRequested, isReturnApproved: order.isReturnApproved, items,
      };
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrdersAction();
        if (!response.error && response.data) setOrders(transformOrders(response.data));
      } catch (error) { console.error('Error fetching orders:', error); } 
      finally { setLoadingOrders(false); }
    };
    fetchOrders();
  }, []);

  const getOrderItemStatus = (order: OrderDetail) => {
    const hasRejectedItems = order.items.some(item => item.status === 'rejected' || item.rejectionReason);
    if (hasRejectedItems) return { hasRejected: true, message: 'Items Rejected' };
    return { message: null };
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
        } else matchesFilter = order.statusCode.includes(statusFilter);
      }
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchQuery, statusFilter]);

  // --- Handlers (Truncated for brevity - logic identical to original) ---
  const handleRequestCancellation = async (orderId: string, reason: string) => {
    if (!orderId || !reason.trim()) { showError('Please provide a reason'); return; }
    setProcessingRequest(orderId);
    try {
      const response = await requestCancellationAction({ orderId, reason: reason.trim() });
      if (!response.error) {
        showSuccess('Cancellation request submitted');
        setShowReasonModal(false);
        const refetch = await getMyOrdersAction();
        if (refetch.data) setOrders(transformOrders(refetch.data));
      } else showError(response.message || 'Failed');
    } catch (e:any) { showError(e?.message); } finally { setProcessingRequest(null); }
  };

  const handleRequestReturn = async () => {
    if (!returnOrderId || !returnReason.trim()) return;
    setProcessingRequest(returnOrderId);
    try {
      const items: ICreateReturnItemInput[] = Array.from(selectedReturnItems.entries()).map(([id, data]) => ({ orderItemId: id, quantity: data.quantity, reason: data.itemReason }));
      const response = await createReturnAction({ orderId: returnOrderId, reason: returnReason.trim(), items });
      if (!response.error) {
        showSuccess('Return submitted'); setShowReturnModal(false);
        const refetch = await getMyOrdersAction(); if(refetch.data) setOrders(transformOrders(refetch.data));
      } else showError(response.message);
    } catch (e) { showError('Failed'); } finally { setProcessingRequest(null); }
  };

  const handleRequestItemReturn = async () => {
      if(!selectedItemForReturn) return;
      setProcessingRequest(selectedItemForReturn.orderId);
      try {
        const response = await createReturnAction({ orderId: selectedItemForReturn.orderId, reason: itemReturnReason, items: [{ orderItemId: selectedItemForReturn.orderItemId, quantity: itemReturnQuantity, reason: itemReturnReason }]});
        if(!response.error) { 
            showSuccess('Item return submitted'); setShowItemReturnModal(false); 
            const refetch = await getMyOrdersAction(); if(refetch.data) setOrders(transformOrders(refetch.data));
        } else showError(response.message);
      } catch(e) { showError('Failed'); } finally { setProcessingRequest(null); }
  }

  // Helper Wrappers for Modals
  const openCancellationModal = (id: string) => { setReasonType('cancellation'); setReasonOrderId(id); setShowReasonModal(true); };
  const openReturnModal = (id: string) => { setReturnOrderId(id); setSelectedReturnItems(new Map()); setShowReturnModal(true); };
  const toggleReturnItem = (id: string, max: number) => {
      const m = new Map(selectedReturnItems); m.has(id) ? m.delete(id) : m.set(id, { quantity: max }); setSelectedReturnItems(m);
  }
  const updateReturnItemQty = (id: string, qty: number) => {
      const m = new Map(selectedReturnItems); const ex = m.get(id); if(ex) { m.set(id, {...ex, quantity: qty}); setSelectedReturnItems(m); }
  }

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId || o.fullId === selectedOrderId), [selectedOrderId, orders]);
  
  const renderStatusBadge = (label: string, code: string) => {
    let styles = "bg-slate-100 text-slate-600 border-slate-200";
    let dotColor = "bg-slate-400";
    if (code.includes('delivered')) { styles = "bg-emerald-50 text-emerald-700 border-emerald-200"; dotColor = "bg-emerald-500"; }
    else if (code.includes('transit') || code.includes('shipped')) { styles = "bg-blue-50 text-blue-700 border-blue-200"; dotColor = "bg-blue-500"; }
    else if (code.includes('processing')) { styles = "bg-amber-50 text-amber-700 border-amber-200"; dotColor = "bg-amber-500"; }
    else if (code.includes('cancelled')) { styles = "bg-red-50 text-red-700 border-red-200"; dotColor = "bg-red-500"; }
    
    return (
      <span className={`${styles} border px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />{label}
      </span>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {selectedOrder ? (
          /* --- ORDER DETAIL VIEW --- */
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <button onClick={() => setSelectedOrderId(null)} className="inline-flex items-center text-slate-500 font-semibold text-sm hover:text-jozi-forest transition-colors group px-1">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to List
            </button>
            <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200 space-y-8">
               {/* Header */}
               <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                       <h2 className="text-2xl font-bold text-slate-900">Order <span className="text-slate-400 font-normal">#{selectedOrder.id}</span></h2>
                       {renderStatusBadge(selectedOrder.statusLabel, selectedOrder.statusCode)}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Placed on {selectedOrder.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Tracking Number</p>
                    <div className="flex items-center text-jozi-forest font-bold font-mono">{selectedOrder.trackingNumber} <ExternalLink className="w-3 ml-2" /></div>
                  </div>
               </div>
               
               {/* Items List */}
               <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="bg-white p-5 flex flex-col sm:flex-row items-center gap-6">
                      <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-slate-100 border border-slate-200" alt={item.name} />
                      <div className="grow space-y-1 text-center sm:text-left">
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500">Vendor: {item.vendor}</p>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-center"><p className="text-xs text-slate-400 uppercase font-bold">Qty</p><p className="font-bold">{item.quantity}</p></div>
                         <div className="text-right"><p className="text-xs text-slate-400 uppercase font-bold">Price</p><p className="font-bold text-lg">{item.price}</p></div>
                         {selectedOrder.statusCode === 'delivered' && !selectedOrder.statusCode.includes('cancel') && item.orderItemId && (
                            <button onClick={(e) => { e.stopPropagation(); setShowItemReturnModal(true); setSelectedItemForReturn({ orderId: selectedOrder.orderId, orderItemId: item.orderItemId!, itemName: item.name, maxQuantity: item.quantity }); }} 
                              disabled={selectedOrder.isReturnRequested || item.isReturnRequested}
                              className="p-2 border rounded-lg hover:border-jozi-forest hover:text-jozi-forest transition-colors disabled:opacity-50">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                         )}
                      </div>
                    </div>
                  ))}
               </div>

               {/* Actions */}
               {(['pending', 'processing', 'delivered'].some(s => selectedOrder.statusCode.includes(s))) && !selectedOrder.statusCode.includes('cancel') && (
                  <div className="flex justify-end pt-6 border-t border-slate-100">
                     {selectedOrder.statusCode === 'delivered' ? (
                       <button onClick={() => openReturnModal(selectedOrder.orderId)} disabled={selectedOrder.isReturnRequested} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-jozi-forest hover:text-jozi-forest transition-all flex items-center gap-2 shadow-sm disabled:opacity-50">
                         <RotateCcw className="w-4 h-4" /> Return Order
                       </button>
                     ) : (
                       <button onClick={() => openCancellationModal(selectedOrder.orderId)} className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center gap-2">
                         <X className="w-4 h-4" /> Cancel Order
                       </button>
                     )}
                  </div>
               )}
            </div>
          </motion.div>
        ) : (
          /* --- ORDERS LIST VIEW --- */
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2">
               <div className="relative grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-transparent text-sm font-medium outline-none focus:bg-slate-50 transition-colors" />
               </div>
               <div className="h-px md:h-auto md:w-px bg-slate-100 mx-1" />
               <div className="relative min-w-[200px]">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-transparent text-xs font-bold uppercase text-slate-600 outline-none cursor-pointer appearance-none">
                     <option value="all">All Statuses</option>
                     <option value="active">Active</option>
                     <option value="delivered">Delivered</option>
                     <option value="requests">Returns & Cancels</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
               </div>
            </div>

            {/* List */}
            <div className="space-y-4">
               {loadingOrders ? (
                  <div className="flex flex-col items-center py-20"><div className="w-8 h-8 border-2 border-slate-200 border-t-jozi-forest rounded-full animate-spin" /><p className="text-slate-400 text-sm mt-4 font-medium">Loading orders...</p></div>
               ) : filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed"><ShoppingBag className="w-12 h-12 text-slate-300 mb-4" /><h3 className="font-bold text-slate-900">No orders found</h3></div>
               ) : (
                  filteredOrders.map(order => (
                    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={order.fullId} onClick={() => setSelectedOrderId(order.fullId)} 
                      className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-jozi-forest/30 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-jozi-forest opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                          <div className="space-y-2">
                             <div className="flex items-center gap-3"><span className="text-lg font-bold text-slate-900 group-hover:text-jozi-forest">{order.id}</span>{renderStatusBadge(order.statusLabel, order.statusCode)}</div>
                             <div className="flex items-center gap-4 text-sm text-slate-500"><span className="flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5" /> {order.date}</span><span>{order.items.length} Items</span></div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-6 grow md:grow-0">
                             <div className="flex -space-x-3">{order.items.slice(0, 3).map((item, i) => <div key={i} className="w-10 h-10 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-slate-100"><img src={item.image} className="w-full h-full object-cover" alt=""/></div>)}</div>
                             <p className="text-xl font-bold text-slate-900">{order.total}</p>
                             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-jozi-forest group-hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></div>
                          </div>
                       </div>
                    </motion.div>
                  ))
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS (Simplified rendering for brevity, fully functional) --- */}
      {showReasonModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
               <h3 className="text-lg font-bold mb-4">Confirm {reasonType === 'cancellation' ? 'Cancellation' : 'Return'}</h3>
               <textarea value={reasonText} onChange={e => setReasonText(e.target.value)} className="w-full border rounded-xl p-3 mb-4" placeholder="Reason..." rows={3} />
               <div className="flex gap-3">
                  <button onClick={() => setShowReasonModal(false)} className="flex-1 py-3 border rounded-xl font-bold">Close</button>
                  <button onClick={() => reasonType === 'cancellation' ? handleRequestCancellation(reasonOrderId!, reasonText) : handleRequestReturn()} className="flex-1 py-3 bg-jozi-forest text-white rounded-xl font-bold">{processingRequest ? '...' : 'Confirm'}</button>
               </div>
            </div>
         </div>
      )}
      
      {showReturnModal && returnOrderId && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between mb-4"><h3 className="text-lg font-bold">Return Items</h3><button onClick={() => setShowReturnModal(false)}><X className="w-5" /></button></div>
               <div className="space-y-3 mb-6">
                 {orders.find(o => o.orderId === returnOrderId)?.items.map(item => {
                    const selected = selectedReturnItems.has(item.orderItemId || '');
                    const qty = selectedReturnItems.get(item.orderItemId || '')?.quantity || item.quantity;
                    return (
                       <div key={item.id} onClick={() => item.orderItemId && toggleReturnItem(item.orderItemId, item.quantity)} className={`p-4 border rounded-xl flex gap-4 cursor-pointer ${selected ? 'border-blue-500 bg-blue-50' : ''}`}>
                          <div className={`w-5 h-5 border rounded flex items-center justify-center ${selected ? 'bg-blue-500 border-blue-500 text-white' : ''}`}>{selected && <CheckSquare className="w-3 h-3" />}</div>
                          <div className="flex-1 font-bold text-sm">{item.name}</div>
                          {selected && <div onClick={e => e.stopPropagation()} className="flex items-center gap-2 bg-white px-2 rounded border"><button onClick={() => updateReturnItemQty(item.orderItemId!, qty-1)}>-</button><span>{qty}</span><button onClick={() => updateReturnItemQty(item.orderItemId!, Math.min(item.quantity, qty+1))}>+</button></div>}
                       </div>
                    )
                 })}
               </div>
               <textarea value={returnReason} onChange={e => setReturnReason(e.target.value)} className="w-full border rounded-xl p-3 mb-4" placeholder="Why are you returning these?" />
               <button onClick={handleRequestReturn} disabled={!returnReason || selectedReturnItems.size === 0} className="w-full py-3 bg-jozi-forest text-white rounded-xl font-bold disabled:opacity-50">Submit Return Request</button>
            </div>
         </div>
      )}

      {showItemReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                 <h3 className="text-lg font-bold mb-4">Return {selectedItemForReturn?.itemName}</h3>
                 <div className="flex items-center justify-center gap-4 mb-6">
                    <button onClick={() => setItemReturnQuantity(Math.max(1, itemReturnQuantity-1))} className="w-10 h-10 bg-slate-100 rounded-lg">-</button>
                    <span className="text-2xl font-bold">{itemReturnQuantity}</span>
                    <button onClick={() => setItemReturnQuantity(Math.min(selectedItemForReturn!.maxQuantity, itemReturnQuantity+1))} className="w-10 h-10 bg-slate-100 rounded-lg">+</button>
                 </div>
                 <textarea value={itemReturnReason} onChange={e => setItemReturnReason(e.target.value)} className="w-full border rounded-xl p-3 mb-4" placeholder="Reason..." />
                 <div className="flex gap-3">
                     <button onClick={() => setShowItemReturnModal(false)} className="flex-1 py-3 border rounded-xl font-bold">Cancel</button>
                     <button onClick={handleRequestItemReturn} disabled={itemReturnReason.length < 10} className="flex-1 py-3 bg-jozi-forest text-white rounded-xl font-bold disabled:opacity-50">Submit</button>
                 </div>
             </div>
          </div>
      )}
    </>
  );
};

// ----------------------------------------------------------------------
// SUB-COMPONENT: RETURNS VIEW
// ----------------------------------------------------------------------

export interface ReturnsViewProps {
  /** When provided, use instead of fetching. Parent fetches orders + returns together. */
  initialReturns?: IReturn[];
  returnsLoading?: boolean;
  onReturnsRefetch?: () => Promise<void>;
}

const ReturnsView: React.FC<ReturnsViewProps> = ({
  initialReturns,
  returnsLoading = false,
  onReturnsRefetch,
}) => {
  const { showSuccess, showError } = useToast();
  const [returns, setReturns] = useState<IReturn[]>(initialReturns ?? []);
  const [loading, setLoading] = useState(initialReturns === undefined ? true : !!returnsLoading);
  const [selected, setSelected] = useState<IReturn | null>(null);

  const fetchReturns = async () => {
    if (onReturnsRefetch) {
      await onReturnsRefetch();
      return;
    }
    setLoading(true);
    try {
      const res = await getMyReturnsAction();
      if (!res.error && res.data) setReturns(res.data);
      else if (res.error && res.message) showError(res.message);
    } catch (e) { showError('Failed to load returns'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (initialReturns !== undefined) {
      setReturns(initialReturns);
      setLoading(returnsLoading);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getMyReturnsAction();
        if (cancelled) return;
        if (!res.error && res.data) setReturns(res.data);
        else if (res.error && res.message) showError(res.message);
      } catch (e) { if (!cancelled) showError('Failed to load returns'); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [initialReturns, returnsLoading]);

  const handleCancel = async (returnId: string) => {
    const res = await cancelReturnAction(returnId);
    if (res.error) showError(res.message ?? 'Failed to cancel return');
    else {
      showSuccess('Return cancelled');
      if (onReturnsRefetch) await onReturnsRefetch();
      else await fetchReturns();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 lg:p-10 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
           <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Return History</h3>
           <p className="text-slate-500 mt-1">Track status of your returned items.</p>
        </div>
        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wide">
          {returns.length} Record{returns.length !== 1 ? 's' : ''}
        </div>
      </div>
      <ReturnsTable returns={returns} loading={loading} onView={setSelected} showCustomer={false} />
      <ReturnDetailDrawer returnRecord={selected} onClose={() => setSelected(null)} mode="customer" onCancel={handleCancel} onActionSuccess={onReturnsRefetch ?? fetchReturns} />
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// ORDERS + RETURNS CONTENT (tab switcher + views; no sidebar/wrapper)
// Fetches orders and returns together, passes to OrdersPage and ReturnsView.
// Use in (profile)/orders — layout provides sidebar.
// ----------------------------------------------------------------------

export const OrdersAndReturnsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'orders' | 'returns'>(() =>
    tabParam === 'returns' ? 'returns' : 'orders'
  );

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [returns, setReturns] = useState<IReturn[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingReturns, setLoadingReturns] = useState(true);

  const fetchOrdersAndReturns = useCallback(async () => {
    setLoadingOrders(true);
    setLoadingReturns(true);
    try {
      const [ordersRes, returnsRes] = await Promise.all([
        getMyOrdersAction(),
        getMyReturnsAction(),
      ]);
      if (!ordersRes.error && ordersRes.data) setOrders(ordersRes.data);
      if (!returnsRes.error && returnsRes.data) setReturns(returnsRes.data);
    } catch (e) {
      console.error('Error fetching orders/returns:', e);
    } finally {
      setLoadingOrders(false);
      setLoadingReturns(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersAndReturns();
  }, [fetchOrdersAndReturns]);

  const refetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await getMyOrdersAction();
      if (!res.error && res.data) setOrders(res.data);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const refetchReturns = useCallback(async () => {
    setLoadingReturns(true);
    try {
      const res = await getMyReturnsAction();
      if (!res.error && res.data) setReturns(res.data);
    } finally {
      setLoadingReturns(false);
    }
  }, []);

  useEffect(() => {
    if (tabParam === 'returns') setActiveTab('returns');
    else setActiveTab('orders');
  }, [tabParam]);

  const handleTabChange = (tab: 'orders' | 'returns') => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'returns') params.set('tab', 'returns');
    else params.delete('tab');
    const qs = params.toString();
    router.replace(qs ? `/orders?${qs}` : '/orders', { scroll: false });
  };

  return (
    <div className="font-sans text-slate-800">
      {/* Tab Switcher */}
      <div className="mb-8">
        <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm relative z-0">
          {(['orders', 'returns'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300 z-10 flex items-center gap-2 ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {isActive && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-slate-100 rounded-xl -z-10" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                )}
                {tab === 'orders' ? <Package className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[500px]">
        {activeTab === 'orders' ? (
          <OrdersPage
            initialOrders={orders}
            ordersLoading={loadingOrders}
            onOrdersRefetch={refetchOrders}
            onReturnsRefetch={refetchReturns}
          />
        ) : (
          <ReturnsView
            initialReturns={returns}
            returnsLoading={loadingReturns}
            onReturnsRefetch={refetchReturns}
          />
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN PAGE COMPONENT (standalone: sidebar + wrapper + content)
// ----------------------------------------------------------------------

const OrdersAndReturnsPage: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUserAction();
        if (!response.error && response.data) setUser(response.data);
      } catch (error) { console.error('Error fetching user:', error); }
      finally { setLoadingUser(false); }
    };
    fetchUser();
  }, []);

  const sidebarUser = user
    ? {
        name: user.fullName || 'User',
        email: user.email || '',
        avatar: user.profileUrl || 'https://picsum.photos/seed/user/200/200',
        level: 22,
        points: 1250,
      }
    : { name: 'Loading...', email: '', avatar: '', level: 0, points: 0 };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans text-slate-800">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 shrink-0">
            <CustomerSidebar user={sidebarUser} />
          </div>
          <main className="grow min-w-0">
            <OrdersAndReturnsContent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrdersAndReturnsPage;