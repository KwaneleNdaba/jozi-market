
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Package, 
  Truck, 
  ChevronDown, 
  ExternalLink,
  Users,
  CreditCard,
  Tag,
  RefreshCw,
  X,
  RotateCcw,
  ShoppingCart,
  MapPin,
  User,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { IOrder, OrderStatus, OrderItemStatus } from '@/interfaces/order/order';
import { updateOrderItemStatusAction } from '@/app/actions/order/index';
import { useToast } from '@/app/contexts/ToastContext';

interface OrderListProps {
  filterStatus: 'all' | 'pending' | 'completed';
  orders?: IOrder[];
  loading?: boolean;
  onOrdersRefresh?: () => void; // Callback to refresh orders after update
}

interface TransformedOrder {
  id: string;
  customer: string;
  email: string;
  items: Array<{ name: string; variant: string; qty: number; price: number }>;
  total: number;
  status: string;
  payment: string;
  method: string;
  date: string;
  address: string;
  cancellationRequestStatus?: string | null; // Derived from status field
  returnRequestStatus?: string | null; // Derived from status field
  originalOrder?: IOrder; // Keep reference to original order
}

const OrderList: React.FC<OrderListProps> = ({ filterStatus, orders = [], loading = false, onOrdersRefresh }) => {
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<TransformedOrder | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [rejectingItemId, setRejectingItemId] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<Map<string, string>>(new Map());
  
  // Rejection reasons dropdown options
  const rejectionReasonOptions = [
    'Out of Stock',
    'Product Discontinued',
    'Quality Issue',
    'Manufacturing Delay',
    'Supplier Issue',
    'Other'
  ];

  // Get allowed next statuses based on current status (vendor flow)
  const getAllowedNextStatuses = (currentStatus: OrderItemStatus | string): Array<{ value: OrderItemStatus; label: string }> => {
    const status = typeof currentStatus === 'string' ? currentStatus : currentStatus;
    
    // Vendor status transition flow:
    // pending > rejected (can reject)
    // pending > accepted (can accept)
    // accepted > Processing (can move to processing)
    // processing > picked (can move to picked)
    
    switch (status) {
      case OrderItemStatus.PENDING:
      case 'pending':
        // From pending: can reject or accept
        return [
          { value: OrderItemStatus.PENDING, label: 'Pending' },
          { value: OrderItemStatus.REJECTED, label: 'Rejected' },
          { value: OrderItemStatus.ACCEPTED, label: 'Accepted' },
        ];
      case OrderItemStatus.ACCEPTED:
      case 'accepted':
        // From accepted: can move to processing
        return [
          { value: OrderItemStatus.ACCEPTED, label: 'Accepted' },
          { value: OrderItemStatus.PROCESSING, label: 'Processed' },
        ];
      case OrderItemStatus.PROCESSING:
      case 'processing':
        // From processing: can move to picked
        return [
          { value: OrderItemStatus.PROCESSING, label: 'Processed' },
          { value: OrderItemStatus.PICKED, label: 'Picked' },
        ];
      case OrderItemStatus.PICKED:
      case 'picked':
        // From picked: no further vendor transitions (vendor workflow ends here)
        return [
          { value: OrderItemStatus.PICKED, label: 'Picked' },
        ];
      case OrderItemStatus.REJECTED:
      case 'rejected':
        // From rejected: cannot change (rejection is final)
        return [
          { value: OrderItemStatus.REJECTED, label: 'Rejected' },
        ];
      default:
        // Default: show current status only
        return [
          { value: currentStatus as OrderItemStatus, label: String(currentStatus).replace(/_/g, ' ') },
        ];
    }
  };

  const handleItemStatusUpdate = async (orderItemId: string, newStatus: OrderItemStatus) => {
    if (!orderItemId || !selectedOrder?.originalOrder) {
      showError('Order item ID is required');
      return;
    }

    // Find the current item to get its current status
    const currentItem = selectedOrder.originalOrder.items?.find((item: any) => item.id === orderItemId);
    const currentStatus = currentItem?.status || OrderItemStatus.PENDING;

    // Validate status transition rules
    // Rejection is only allowed from pending status
    if (newStatus === OrderItemStatus.REJECTED) {
      if (currentStatus !== OrderItemStatus.PENDING && currentStatus !== 'pending') {
        showError('Items can only be rejected when they are in pending status');
        return;
      }
      const reason = rejectionReasons.get(orderItemId);
      if (!reason || reason.trim() === '') {
        // Show rejection reason dropdown for this item
        setRejectingItemId(orderItemId);
        return;
      }
    } else {
      // Validate other transitions
      const allowedStatuses = getAllowedNextStatuses(currentStatus).map(s => s.value);
      if (!allowedStatuses.includes(newStatus)) {
        showError(`Invalid status transition. Current status: ${currentStatus}, cannot transition to: ${newStatus}`);
        return;
      }
      // Clear rejection state if changing to non-rejected status
      setRejectingItemId(null);
      rejectionReasons.delete(orderItemId);
    }

    setUpdatingItemId(orderItemId);
    try {
      const reason = newStatus === OrderItemStatus.REJECTED ? rejectionReasons.get(orderItemId) : undefined;
      const response = await updateOrderItemStatusAction(orderItemId, {
        orderItemId,
        status: newStatus,
        rejectionReason: reason,
      });

      if (response.error) {
        showError(response.message || 'Failed to update order item status');
      } else {
        showSuccess('Order item status updated successfully');
        if (onOrdersRefresh) {
          onOrdersRefresh();
        }
        // Clear rejection state after successful update
        setRejectingItemId(null);
        rejectionReasons.delete(orderItemId);
      }
    } catch (error: any) {
      showError(error?.message || 'Failed to update order item status');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRejectionReasonChange = (orderItemId: string, reason: string) => {
    setRejectionReasons(prev => {
      const newMap = new Map(prev);
      if (reason) {
        newMap.set(orderItemId, reason);
      } else {
        newMap.delete(orderItemId);
      }
      return newMap;
    });
  };

  const handleConfirmRejection = async (orderItemId: string) => {
    const reason = rejectionReasons.get(orderItemId);
    if (!reason || reason.trim() === '') {
      showError('Please select a rejection reason');
      return;
    }

    await handleItemStatusUpdate(orderItemId, OrderItemStatus.REJECTED);
  };

  // Transform backend orders to frontend format
  const transformedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    return orders.map((order): TransformedOrder => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      const formattedDate = orderDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }) + ' ' + orderDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      // Transform order items
      const items = (order.items || []).map(item => {
        const product = item.product || {};
        const productName = product.title || product.name || 'Unknown Product';
        
        // Get variant name if available
        let variantName = 'Standard';
        if (item.productVariantId && product.variants) {
          const variant = product.variants.find((v: any) => v.id === item.productVariantId);
          if (variant) {
            variantName = variant.name || variant.size || 'Standard';
          }
        }

        const unitPrice = typeof item.unitPrice === 'string' 
          ? parseFloat(item.unitPrice) 
          : item.unitPrice || 0;

        return {
          name: productName,
          variant: variantName,
          qty: item.quantity,
          price: unitPrice,
        };
      });

      // Calculate total
      const totalAmount = typeof order.totalAmount === 'string' 
        ? parseFloat(order.totalAmount) 
        : order.totalAmount || 0;

      // Map status
      const statusMap: Record<string, string> = {
        'pending': 'Processing',
        'confirmed': 'Processing',
        'processing': 'Processing',
        'ready_to_ship': 'Ready to Ship',
        'shipped': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
        'return_in_progress': 'Return in Progress',
        'returned': 'Returned',
        'refund_pending': 'Refund Pending',
        'refunded': 'Refunded',
      };
      const frontendStatus = statusMap[order.status.toLowerCase()] || order.status;

      // Derive cancellation request status from status and metadata
      let cancellationRequestStatus: string | null = null;
      if (order.cancellationRequestedAt) {
        if (order.status === OrderStatus.CANCELLED) {
          cancellationRequestStatus = 'approved';
        } else if (order.cancellationRejectionReason) {
          cancellationRequestStatus = 'rejected';
        } else {
          cancellationRequestStatus = 'pending';
        }
      }

      // Derive return request status from status and metadata
      let returnRequestStatus: string | null = null;
      if (order.returnRequestedAt) {
        if (order.status === OrderStatus.RETURNED || order.status === OrderStatus.REFUNDED) {
          returnRequestStatus = 'approved';
        } else if (order.returnRejectionReason) {
          returnRequestStatus = 'rejected';
        } else if (order.status === OrderStatus.RETURN_IN_PROGRESS) {
          returnRequestStatus = 'approved';
        } else {
          returnRequestStatus = 'pending';
        }
      }

      // Format address
      const address = order.shippingAddress 
        ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postal || ''}, ${order.shippingAddress.country}`
        : 'No address provided';

      // Get customer name
      const customerName = order.user?.fullName || order.email || 'Unknown Customer';

      return {
        id: `#${order.orderNumber}`,
        customer: customerName,
        email: order.user?.email || order.email || '',
        items,
        total: totalAmount,
        status: frontendStatus,
        payment: order.paymentStatus === 'paid' ? 'Paid' : 'Pending',
        method: order.paymentMethod || 'Card',
        date: formattedDate,
        address,
        cancellationRequestStatus,
        returnRequestStatus,
        originalOrder: order,
      };
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return transformedOrders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = filterStatus === 'all' || 
                        (filterStatus === 'pending' && ['Processing', 'Ready'].includes(order.status)) ||
                        (filterStatus === 'completed' && ['Delivered', 'In Transit'].includes(order.status));
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, filterStatus, transformedOrders]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8 text-left">
      <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Customer Name..." 
              className="w-full bg-gray-50 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none border-2 border-transparent focus:border-jozi-gold/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
             <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-all">
                <Filter className="w-5 h-5" />
             </button>
             <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-all">
                <Download className="w-5 h-5" />
             </button>
             <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-all">
                <RefreshCw className="w-5 h-5" />
             </button>
             <button 
              disabled={selectedIds.length === 0}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center ${
                selectedIds.length > 0 ? 'bg-jozi-forest text-white shadow-jozi-forest/10 hover:bg-jozi-dark' : 'bg-gray-50 text-gray-300'
              }`}
             >
                Bulk Updates ({selectedIds.length})
             </button>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="py-32 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Package className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-jozi-forest uppercase">Loading Orders...</h3>
              <p className="text-gray-400 font-medium italic">Fetching your order manifest...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-6 w-12">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-md border-gray-300 accent-jozi-forest"
                      onChange={(e) => setSelectedIds(e.target.checked ? filteredOrders.map(o => o.id) : [])}
                    />
                  </th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Manifest ID / Date</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer Logic</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Ordered Asset(s)</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Fulfillment State</th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Value (ZAR)</th>
                  <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="py-6" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="w-5 h-5 rounded-md border-gray-300 accent-jozi-forest" 
                    />
                  </td>
                  <td className="py-6">
                    <div className="space-y-1">
                      <p className="font-black text-jozi-forest text-sm leading-tight">
                        ORD_{order.id.split('_')[1]}
                      </p>
                      <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                         <Clock className="w-3 h-3 mr-1" /> {order.date.split(' ')[0]}
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-jozi-gold/10 flex items-center justify-center text-jozi-gold font-black uppercase text-xs">
                        {order.customer[0]}
                      </div>
                      <div>
                        <p className="font-black text-jozi-dark text-sm leading-tight">{order.customer}</p>
                        <p className="text-[10px] text-gray-400 font-bold lowercase">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="space-y-1">
                      <p className="font-bold text-jozi-forest text-xs truncate max-w-[150px]">
                        {order.items[0].name}
                      </p>
                      {order.items.length > 1 && (
                        <p className="text-[9px] font-black text-jozi-gold uppercase tracking-widest">
                          + {order.items.length - 1} more treasures
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <div className="space-y-2">
                      <StatusBadge status={order.status} />
                      {/* Cancellation Request Status */}
                      {order.cancellationRequestStatus && (
                        <div className="flex items-center justify-center gap-1">
                          <X className={`w-3 h-3 ${
                            order.cancellationRequestStatus === 'approved' ? 'text-emerald-500' :
                            order.cancellationRequestStatus === 'rejected' ? 'text-red-500' :
                            'text-orange-500'
                          }`} />
                          <span className={`text-[9px] font-black uppercase tracking-wider ${
                            order.cancellationRequestStatus === 'approved' ? 'text-emerald-600' :
                            order.cancellationRequestStatus === 'rejected' ? 'text-red-600' :
                            'text-orange-600'
                          }`}>
                            Cancel {order.cancellationRequestStatus === 'approved' ? 'Approved' :
                                    order.cancellationRequestStatus === 'rejected' ? 'Rejected' :
                                    'Pending'}
                          </span>
                        </div>
                      )}
                      {/* Return Request Status */}
                      {order.returnRequestStatus && (
                        <div className="flex items-center justify-center gap-1">
                          <RotateCcw className={`w-3 h-3 ${
                            order.returnRequestStatus === 'approved' ? 'text-emerald-500' :
                            order.returnRequestStatus === 'rejected' ? 'text-red-500' :
                            'text-orange-500'
                          }`} />
                          <span className={`text-[9px] font-black uppercase tracking-wider ${
                            order.returnRequestStatus === 'approved' ? 'text-emerald-600' :
                            order.returnRequestStatus === 'rejected' ? 'text-red-600' :
                            'text-orange-600'
                          }`}>
                            Return {order.returnRequestStatus === 'approved' ? 'Approved' :
                                    order.returnRequestStatus === 'rejected' ? 'Rejected' :
                                    'Pending'}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <p className="font-black text-jozi-dark text-lg leading-none">R{order.total.toFixed(2)}</p>
                    <p className={`text-[8px] font-black uppercase mt-1 ${order.payment === 'Paid' ? 'text-emerald-500' : 'text-orange-500'}`}>{order.payment} via {order.method}</p>
                  </td>
                  <td className="py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-2">
                       <button onClick={() => setSelectedOrder(order)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest shadow-sm"><Eye className="w-4 h-4" /></button>
                       <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest shadow-sm"><RefreshCw className="w-4 h-4" /></button>
                       <button className="p-3 text-gray-300"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="py-32 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
               <ShoppingCart className="w-10 h-10" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-jozi-forest uppercase">No Records Found</h3>
               <p className="text-gray-400 font-medium italic">Adjust filters or search query to find specific manifests.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- ORDER DETAILS DRAWER --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => {
                setSelectedOrder(null);
                setImageErrors(new Set());
              }}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{selectedOrder.id}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <StatusBadge status={selectedOrder.status} />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Placed {selectedOrder.date.split(' ')[0]}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedOrder(null);
                    setImageErrors(new Set());
                  }}
                  className="p-3 hover:bg-white rounded-xl transition-colors group shadow-sm"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-jozi-forest" />
                </button>
              </div>

              <div className="grow overflow-y-auto p-8 space-y-10">
                
                {/* Timeline */}
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-3">Fulfillment Journey</h3>
                   <div className="relative pt-2">
                      <div className="absolute top-2 bottom-4 left-6 w-[2px] bg-gray-100" />
                      <div className="space-y-6 relative">
                        {[
                          { label: 'Order Received', time: selectedOrder.date.split(' ')[1] || '10:45 AM', active: true, icon: Clock },
                          { label: 'Payments Verified', time: selectedOrder.payment === 'Paid' ? 'Verified' : 'Pending', active: selectedOrder.payment === 'Paid', icon: CheckCircle2 },
                          { label: 'Processing', time: 'Pending', active: !['Processing'].includes(selectedOrder.status), icon: Package },
                          { label: 'Out for Delivery', time: 'Pending', active: ['In Transit', 'Out for Delivery', 'Delivered'].includes(selectedOrder.status), icon: Truck },
                          { label: 'Delivered', time: 'Pending', active: selectedOrder.status === 'Delivered', icon: MapPin }
                        ].map((step, i) => (
                          <div key={i} className="flex items-center space-x-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg z-10 transition-all ${step.active ? 'bg-jozi-forest text-white' : 'bg-gray-100 text-gray-300'}`}>
                              <step.icon className="w-5 h-5" />
                            </div>
                            <div className="grow">
                              <p className={`font-black text-sm ${step.active ? 'text-jozi-forest' : 'text-gray-300'}`}>{step.label}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{step.active ? step.time : 'Awaiting Stage'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Items Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest">Ordered Items</h3>
                    <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">{selectedOrder.items.length} Units</span>
                  </div>
                  <div className="space-y-3">
                    {(selectedOrder.originalOrder?.items || []).map((item: any, idx: number) => {
                      const imageKey = `${selectedOrder.id}-${idx}`;
                      const hasImageError = imageErrors.has(imageKey);
                      const orderItemId = item.id;
                      const currentStatus = item.status || OrderItemStatus.PENDING;
                      const isUpdating = updatingItemId === orderItemId;
                      const product = item.product || {};
                      const productName = product.title || product.name || item.name || 'Unknown Product';
                      const productImage = product.images?.[0]?.file || product.images?.[0] || undefined;
                      
                      // Check if order has cancellation or return request (vendor cannot edit status if ANY request exists)
                      const order = selectedOrder.originalOrder;
                      // Check order-level cancellation request (any request, regardless of review status)
                      const hasOrderCancellationRequest = !!order?.cancellationRequestedAt;
                      // Check order-level return request (any request, regardless of review status)
                      const hasOrderReturnRequest = !!order?.returnRequestedAt;
                      // Check item-level return request (any request, regardless of review status)
                      const hasItemReturnRequest = !!item?.returnRequestedAt;
                      // Vendor cannot edit if there's ANY cancellation or return request (order or item level)
                      const isStatusEditable = !hasOrderCancellationRequest && !hasOrderReturnRequest && !hasItemReturnRequest;
                      
                      return (
                        <div key={orderItemId || idx} className={`p-4 bg-gray-50 rounded-2xl border border-gray-100 ${rejectingItemId === orderItemId ? 'pb-6' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex items-center justify-center text-jozi-forest shadow-sm border border-gray-100 shrink-0">
                                {productImage && !hasImageError ? (
                                  <img 
                                    src={productImage} 
                                    alt={productName}
                                    className="w-full h-full object-cover"
                                    onError={() => {
                                      setImageErrors(prev => new Set(prev).add(imageKey));
                                    }}
                                  />
                                ) : (
                                  <Package className="w-5 h-5 opacity-40" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-jozi-forest text-sm leading-tight truncate">{productName}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-jozi-gold">Variant: {item.variant || 'Standard'}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <span className="text-[9px] font-black text-gray-400 uppercase">Qty: {item.quantity || item.qty}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded border font-black uppercase ${
                                    currentStatus === OrderItemStatus.SHIPPED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    currentStatus === OrderItemStatus.PACKED ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    currentStatus === OrderItemStatus.PICKED ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                    currentStatus === OrderItemStatus.PROCESSING ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                    currentStatus === OrderItemStatus.ACCEPTED ? 'bg-green-50 text-green-600 border-green-100' :
                                    currentStatus === OrderItemStatus.REJECTED ? 'bg-red-50 text-red-600 border-red-100' :
                                    'bg-gray-50 text-gray-600 border-gray-100'
                                  }`}>
                                    {currentStatus.replace(/_/g, ' ').toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 shrink-0 ml-4">
                              <div className="text-right mr-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                                <p className="font-black text-jozi-forest mt-1">R{typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice || item.price || 0}</p>
                              </div>
                              {orderItemId && (
                                <div className="relative shrink-0">
                                  {!isStatusEditable && (
                                    <div className="mb-2 text-[9px] font-black text-amber-600 uppercase tracking-widest text-center">
                                      {hasOrderCancellationRequest ? 'Cancellation Requested' : 
                                       hasItemReturnRequest ? 'Item Return Requested' : 
                                       'Return Requested'}
                                    </div>
                                  )}
                                  <select
                                    value={currentStatus}
                                    onChange={(e) => {
                                      const newStatus = e.target.value as OrderItemStatus;
                                      // Only allow rejection from pending status
                                      if (newStatus === OrderItemStatus.REJECTED) {
                                        if (currentStatus !== OrderItemStatus.PENDING && currentStatus !== 'pending') {
                                          showError('Items can only be rejected when they are in pending status');
                                          return;
                                        }
                                        setRejectingItemId(orderItemId);
                                        if (!rejectionReasons.has(orderItemId)) {
                                          handleRejectionReasonChange(orderItemId, '');
                                        }
                                      } else {
                                        setRejectingItemId(null);
                                        const newMap = new Map(rejectionReasons);
                                        newMap.delete(orderItemId);
                                        setRejectionReasons(newMap);
                                        handleItemStatusUpdate(orderItemId, newStatus);
                                      }
                                    }}
                                    disabled={isUpdating || !isStatusEditable}
                                    title={!isStatusEditable ? (
                                      hasOrderCancellationRequest ? 'Cannot edit: Cancellation request exists' : 
                                      hasItemReturnRequest ? 'Cannot edit: Item return request exists' :
                                      'Cannot edit: Return request exists'
                                    ) : ''}
                                    className={`appearance-none bg-white border-2 rounded-xl px-3 py-2 pr-8 font-black text-[10px] uppercase tracking-widest transition-all min-w-[140px] text-jozi-forest ${
                                      isUpdating || !isStatusEditable 
                                        ? 'opacity-50 cursor-not-allowed border-gray-200' 
                                        : 'cursor-pointer hover:border-jozi-gold border-gray-200'
                                    }`}
                                  >
                                    {getAllowedNextStatuses(currentStatus).map((status) => (
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
                          
                          {/* Rejection Reason Dropdown - appears when Rejected is selected */}
                          {rejectingItemId === orderItemId && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-gray-200"
                            >
                              <div className="flex items-center gap-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest shrink-0">
                                  Rejection Reason:
                                </label>
                                <select
                                  value={rejectionReasons.get(orderItemId) || ''}
                                  onChange={(e) => handleRejectionReasonChange(orderItemId, e.target.value)}
                                  className="appearance-none bg-white border-2 border-red-200 rounded-xl px-3 py-2 pr-8 font-bold text-[10px] uppercase tracking-widest cursor-pointer transition-all text-jozi-forest hover:border-red-300 flex-1 min-w-0"
                                >
                                  <option value="">Select reason...</option>
                                  {rejectionReasonOptions.map((reason) => (
                                    <option key={reason} value={reason} className="text-jozi-forest">
                                      {reason}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleConfirmRejection(orderItemId)}
                                  disabled={!rejectionReasons.get(orderItemId) || rejectionReasons.get(orderItemId)?.trim() === ''}
                                  className={`px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                                    rejectionReasons.get(orderItemId) && rejectionReasons.get(orderItemId)?.trim() !== ''
                                      ? 'bg-red-500 text-white hover:bg-red-600'
                                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectingItemId(null);
                                    const newMap = new Map(rejectionReasons);
                                    newMap.delete(orderItemId);
                                    setRejectionReasons(newMap);
                                  }}
                                  className="px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all whitespace-nowrap shrink-0"
                                  title="Cancel rejection"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 gap-8">
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-5">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Customer Details</h4>
                      <div className="flex items-start space-x-4">
                        <User className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-jozi-forest leading-tight">{selectedOrder.customer}</p>
                          <p className="text-xs text-gray-500 font-medium">{selectedOrder.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{selectedOrder.address}</p>
                      </div>
                   </div>

                   <div>
                     <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Summary</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-500">Subtotal</span>
                          <span className="font-bold text-jozi-forest">R{selectedOrder.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-500">Method</span>
                          <span className="font-bold text-jozi-forest flex items-center gap-2">
                            <CreditCard className="w-3 h-3" /> {selectedOrder.method}
                          </span>
                        </div>
                        <div className="h-px bg-gray-100 my-2" />
                        <div className="flex justify-between items-center bg-jozi-forest text-white p-4 rounded-xl shadow-lg">
                          <span className="text-xs font-black uppercase tracking-widest text-jozi-gold">Total Paid</span>
                          <span className="text-xl font-black">R{selectedOrder.total.toFixed(2)}</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-4">
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-jozi-forest text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all">
                    Print Manifest
                  </button>
                  <button className="flex-1 py-3 bg-gray-50 text-jozi-forest rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200">
                    Generate Invoice
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

export default OrderList;
