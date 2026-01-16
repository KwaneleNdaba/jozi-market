
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
  // Fix: Added missing ShoppingCart import
  ShoppingCart
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import OrderDetailModal from './OrderDetailModal';

// --- MOCK DATA ---
const MOCK_ORDERS = [
  { 
    id: '#ORD-2041', 
    customer: 'Lerato Dlamini', 
    email: 'lerato@jozi.com',
    items: [
      { name: 'Shweshwe Evening Dress', variant: 'Indigo / Medium', qty: 1, price: 1250 },
      { name: 'Beaded Necklace', variant: 'Gold', qty: 2, price: 320 }
    ], 
    total: 1890, 
    status: 'Processing', 
    payment: 'Paid',
    method: 'Card',
    date: '2024-10-15 14:30',
    address: '12 Gwigwi Mrwebi St, Newtown, Joburg'
  },
  { 
    id: '#ORD-2040', 
    customer: 'Kevin Naidoo', 
    email: 'kevin.n@gmail.com',
    items: [
      { name: 'Zebu Leather Wallet', variant: 'Midnight Black', qty: 1, price: 450 }
    ], 
    total: 450, 
    status: 'Ready', 
    payment: 'Paid',
    method: 'EFT',
    date: '2024-10-15 12:15',
    address: '44 Vilakazi St, Orlando West, Soweto'
  },
  { 
    id: '#ORD-2039', 
    customer: 'Thandiwe Mokoena', 
    email: 'thandi@alex.co.za',
    items: [
      { name: 'Shweshwe Evening Dress', variant: 'Red / Small', qty: 1, price: 1250 }
    ], 
    total: 1250, 
    status: 'Delivered', 
    payment: 'Paid',
    method: 'Points',
    date: '2024-10-14 09:00',
    address: '88 Alexandra Rd, Sandton'
  },
  { 
    id: '#ORD-2038', 
    customer: 'Bongani Sithole', 
    email: 'bsithole@web.com',
    items: [
      { name: 'Hand-Carved Baobab Bowl', variant: 'Large', qty: 1, price: 450 }
    ], 
    total: 450, 
    status: 'In Transit', 
    payment: 'Paid',
    method: 'Card',
    date: '2024-10-13 16:45',
    address: '101 Juta St, Braamfontein'
  },
];

interface OrderListProps {
  filterStatus: 'all' | 'pending' | 'completed';
}

const OrderList: React.FC<OrderListProps> = ({ filterStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = filterStatus === 'all' || 
                        (filterStatus === 'pending' && ['Processing', 'Ready'].includes(order.status)) ||
                        (filterStatus === 'completed' && ['Delivered', 'In Transit'].includes(order.status));
      
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, filterStatus]);

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
                      <p className="font-black text-jozi-forest text-sm leading-tight">{order.id}</p>
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
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-6 text-right">
                    <p className="font-black text-jozi-dark text-lg leading-none">R{order.total}</p>
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

        {filteredOrders.length === 0 && (
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
