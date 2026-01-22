
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
  // Fix: Added missing ShoppingCart import
  ShoppingCart
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import OrderDetailModal from './OrderDetailModal';

import { IOrder, OrderStatus, ReturnRequestStatus, CancellationRequestStatus } from '@/interfaces/order/order';

interface OrderListProps {
  filterStatus: 'all' | 'pending' | 'completed';
  orders?: IOrder[];
  loading?: boolean;
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
  cancellationRequestStatus?: CancellationRequestStatus | string | null;
  returnRequestStatus?: ReturnRequestStatus | string | null;
  originalOrder?: IOrder; // Keep reference to original order
}

const OrderList: React.FC<OrderListProps> = ({ filterStatus, orders = [], loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<TransformedOrder | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
        'processing': 'Processing',
        'shipped': 'In Transit',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled',
        'returned': 'Returned',
      };
      const frontendStatus = statusMap[order.status.toLowerCase()] || order.status;

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
        cancellationRequestStatus: order.cancellationRequestStatus,
        returnRequestStatus: order.returnRequestStatus,
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

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderList;
