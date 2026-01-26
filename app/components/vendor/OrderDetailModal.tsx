import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Package, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  User,
  Heart,
  Tag,
  Loader2
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { updateOrderItemStatusAction } from '@/app/actions/order/index';
import { OrderItemStatus } from '@/interfaces/order/order';
import { useToast } from '@/app/contexts/ToastContext';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
  onOrderUpdated?: () => void; // Callback to refresh orders after update
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onOrderUpdated }) => {
  const { showSuccess, showError } = useToast();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Vendor allowed statuses: accepted, rejected, processing, picked, packed, shipped
  const vendorAllowedStatuses: Array<{ value: OrderItemStatus; label: string }> = [
    { value: OrderItemStatus.ACCEPTED, label: 'Accepted' },
    { value: OrderItemStatus.REJECTED, label: 'Rejected' },
    { value: OrderItemStatus.PROCESSING, label: 'Processing' },
    { value: OrderItemStatus.PICKED, label: 'Picked' },
    { value: OrderItemStatus.PACKED, label: 'Packed' },
    { value: OrderItemStatus.SHIPPED, label: 'Shipped' },
  ];

  const handleStatusUpdate = async (orderItemId: string, newStatus: OrderItemStatus) => {
    if (!orderItemId || !order.originalOrder) {
      showError('Order item ID is required');
      return;
    }

    setUpdatingItemId(orderItemId);
    try {
      const response = await updateOrderItemStatusAction(orderItemId, {
        orderItemId,
        status: newStatus,
      });

      if (response.error) {
        showError(response.message || 'Failed to update order item status');
      } else {
        showSuccess('Order item status updated successfully');
        if (onOrderUpdated) {
          onOrderUpdated();
        }
      }
    } catch (error: any) {
      showError(error?.message || 'Failed to update order item status');
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Get order items from originalOrder if available
  const orderItems = order.originalOrder?.items || order.items || [];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, x: 50 }} 
        animate={{ scale: 1, opacity: 1, x: 0 }} 
        exit={{ scale: 0.9, opacity: 0, x: 50 }}
        className="relative bg-white w-full max-w-5xl h-full lg:h-auto lg:max-h-[90vh] rounded-[3rem] lg:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Header Banner */}
        <div className="bg-jozi-forest p-10 lg:p-12 text-white relative shrink-0">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Package className="w-48 h-48" />
           </div>
           <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
             <X className="w-6 h-6" />
           </button>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center space-x-3">
                    <StatusBadge status={order.status} className="bg-jozi-gold text-jozi-forest border-none" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Fulfillment Ledger</span>
                 </div>
                 <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-none">{order.id}</h2>
                 <div className="flex items-center space-x-4 text-jozi-cream/60 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-2" /> Placed {order.date}</div>
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    <div className="flex items-center text-jozi-gold"><ShieldCheck className="w-3.5 h-3.5 mr-2" /> Verified Artisan Sale</div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button className="bg-white text-jozi-forest px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl">
                    Print Manifest
                 </button>
                 <button className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                    Generate Invoice
                 </button>
              </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-10 lg:p-16 space-y-16">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Left Column: Line Items & Fulfillment */}
              <div className="lg:col-span-7 space-y-12">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight flex items-center">
                          <Package className="w-5 h-5 mr-3 text-jozi-gold" /> Pieces to Prep
                       </h3>
                       <span className="text-xs font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">{order.items.length} Items</span>
                    </div>
                    <div className="space-y-4">
                       {orderItems.map((item: any, idx: number) => {
                         const orderItemId = item.id;
                         const currentStatus = item.status || OrderItemStatus.PENDING;
                         const isUpdating = updatingItemId === orderItemId;
                         const product = item.product || {};
                         const productName = product.title || product.name || item.name || 'Unknown Product';
                         const productImage = product.images?.[0]?.file || product.images?.[0] || 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=100';
                         
                         return (
                           <div key={orderItemId || idx} className="p-6 bg-jozi-cream/30 rounded-[2.5rem] border border-jozi-forest/5 flex items-center justify-between group hover:bg-jozi-cream transition-colors">
                              <div className="flex items-center space-x-6 flex-1">
                                 <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-jozi-forest/5 shadow-sm shrink-0 overflow-hidden">
                                    <img src={productImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={productName} />
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="text-lg font-black text-jozi-forest leading-tight">{productName}</h4>
                                    <p className="text-[10px] font-black uppercase text-jozi-gold tracking-widest mt-1">{item.variant || 'Standard'}</p>
                                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase mt-3 gap-2">
                                       <span className="bg-white px-2 py-0.5 rounded border border-gray-100">Qty: {item.quantity || item.qty}</span>
                                       <span className={`px-2 py-0.5 rounded border ${
                                         currentStatus === OrderItemStatus.SHIPPED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                         currentStatus === OrderItemStatus.PACKED ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                         currentStatus === OrderItemStatus.PICKED ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                         currentStatus === OrderItemStatus.PROCESSING ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                         currentStatus === OrderItemStatus.ACCEPTED ? 'bg-green-50 text-green-600 border-green-100' :
                                         currentStatus === OrderItemStatus.REJECTED ? 'bg-red-50 text-red-600 border-red-100' :
                                         'bg-gray-50 text-gray-600 border-gray-100'
                                       }`}>
                                         {currentStatus.replace('_', ' ').toUpperCase()}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                 <div className="text-right mr-4">
                                    <p className="font-black text-xl text-jozi-forest leading-none">R{typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice || item.price || 0}</p>
                                    <p className="text-[9px] font-bold text-gray-300 uppercase mt-2">Unit Value</p>
                                 </div>
                                 <div className="relative">
                                    <select
                                      value={currentStatus}
                                      onChange={(e) => handleStatusUpdate(orderItemId, e.target.value as OrderItemStatus)}
                                      disabled={isUpdating}
                                      className={`appearance-none bg-white border-2 rounded-xl px-4 py-2 pr-8 font-black text-xs uppercase tracking-widest cursor-pointer transition-all text-jozi-forest ${
                                        isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:border-jozi-gold border-gray-200'
                                      }`}
                                    >
                                      {vendorAllowedStatuses.map((status) => (
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
                              </div>
                           </div>
                         );
                       })}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-jozi-dark uppercase tracking-tight flex items-center">
                       <Truck className="w-5 h-5 mr-3 text-jozi-gold" /> Fulfillment Protocol
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { id: 'Processing', label: 'Artisan Prep', icon: Clock, desc: 'Workshop is currently finishing the pieces.' },
                         { id: 'Ready', label: 'Mark Ready', icon: Package, desc: 'Ready for hub pickup or dispatch.' },
                         { id: 'In Transit', label: 'Hand to Rider', icon: Truck, desc: 'Package is on the way to the customer.' },
                         { id: 'Delivered', label: 'Verify Arrival', icon: CheckCircle2, desc: 'Package safely delivered to doorstep.' },
                       ].map((step) => (
                         <button 
                          key={step.id}
                          className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                            order.status === step.id 
                              ? 'bg-jozi-forest border-jozi-forest text-white shadow-xl' 
                              : 'bg-white border-gray-50 hover:border-jozi-gold/20'
                          }`}
                         >
                            <div className="flex items-center space-x-4 mb-3">
                               <div className={`p-2 rounded-xl ${order.status === step.id ? 'bg-white/10' : 'bg-gray-100 text-gray-400'}`}>
                                  <step.icon className="w-5 h-5" />
                               </div>
                               <h5 className="font-black text-sm uppercase tracking-widest">{step.label}</h5>
                            </div>
                            <p className={`text-[10px] font-medium leading-relaxed ${order.status === step.id ? 'opacity-70' : 'text-gray-400'}`}>{step.desc}</p>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Right Column: Customer & Economics */}
              <div className="lg:col-span-5 space-y-12">
                 {/* Customer Card */}
                 <div className="bg-white rounded-[3rem] border border-gray-100 p-10 space-y-8 shadow-soft">
                    <div className="flex items-center space-x-5">
                       <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-jozi-cream shadow-xl">
                          <img src="https://i.pravatar.cc/150?u=1" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <div className="flex items-center space-x-2">
                             <h3 className="text-2xl font-black text-jozi-dark tracking-tight uppercase leading-none">{order.customer}</h3>
                             <Heart className="w-5 h-5 text-jozi-gold fill-current" />
                          </div>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Loyal Neighbor (4 Orders)</p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-gray-50">
                       <div className="flex items-start space-x-4">
                          <MapPin className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                          <p className="text-sm font-bold text-jozi-forest leading-relaxed italic">"{order.address}"</p>
                       </div>
                       <div className="flex items-center space-x-4">
                          <Mail className="w-5 h-5 text-jozi-gold" />
                          <span className="text-sm font-bold text-gray-500">{order.email}</span>
                       </div>
                       <div className="flex items-center space-x-4">
                          <Phone className="w-5 h-5 text-jozi-gold" />
                          <span className="text-sm font-bold text-gray-500">+27 82 445 9901</span>
                       </div>
                    </div>

                    <button className="w-full py-4 bg-jozi-cream text-jozi-forest rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold hover:text-white transition-all">
                       Contact Neighborhood Support
                    </button>
                 </div>

                 {/* Financials Card */}
                 <div className="bg-jozi-dark rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <CreditCard className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
                    <div className="relative z-10 space-y-8 text-left">
                       <h3 className="text-xl font-black uppercase tracking-tight border-b border-white/10 pb-6 flex items-center">
                          Economic Yield
                          <span className="ml-auto text-[10px] font-black text-jozi-gold tracking-widest uppercase">Verified PayFast</span>
                       </h3>
                       
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm font-medium opacity-60">
                             <span>Gross Order Total</span>
                             <span className="text-white font-bold">R{order.total}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-medium opacity-60">
                             <span>Jozi Platform Comm. (5%)</span>
                             <span className="text-white font-bold">-R{(order.total * 0.05).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-medium opacity-60">
                             <span>Hub Logistics Fee</span>
                             <span className="text-white font-bold">-R75</span>
                          </div>
                          <div className="h-[1px] bg-white/10 my-4" />
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-[10px] font-black uppercase text-jozi-gold tracking-[0.2em] mb-1">Projected Net Payout</p>
                                <p className="text-4xl lg:text-5xl font-black text-white tracking-tighter">R{(order.total * 0.95 - 75).toFixed(0)}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] font-bold text-white/30 uppercase">Settlement Period</p>
                                <span className="inline-flex items-center text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md mt-1">
                                  Next Friday
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start space-x-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                    <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-widest">
                       Note: Artisan pieces are fragile. Ensure double-wall corrugated packaging with Joburg Hub logo for transit.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailModal;