import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  MoreHorizontal, 
  Eye, 
  ArrowUpDown, 
  Calendar, 
  X,
  MapPin,
  Package,
  CreditCard,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Store,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { MarketOrder, OrderStatus } from '../../types';

const MOCK_ORDERS: MarketOrder[] = [
  { id: 'ORD-2041', vendorName: 'Maboneng Textiles', customerName: 'Lerato Dlamini', customerEmail: 'lerato@jozi.com', products: [{ name: 'Shweshwe Evening Dress', quantity: 1, price: 1250 }, { name: 'Indigo Silk Scarf', quantity: 1, price: 750 }], totalAmount: 2075, status: 'Processing', orderDate: '2024-10-15', category: 'Fashion', paymentMethod: 'Card', shippingAddress: '12 Gwigwi Mrwebi St, Newtown, Joburg' },
  { id: 'ORD-2042', vendorName: 'Soweto Gold', customerName: 'Kevin Naidoo', customerEmail: 'kevin.n@gmail.com', products: [{ name: 'Zulu Beadwork Necklace', quantity: 2, price: 320 }], totalAmount: 715, status: 'Picked', orderDate: '2024-10-14', category: 'Accessories', paymentMethod: 'EFT', shippingAddress: '44 Vilakazi St, Orlando West, Soweto' },
  { id: 'ORD-2043', vendorName: 'Rosebank Art', customerName: 'Zanele Khumalo', customerEmail: 'zanele.k@outlook.com', products: [{ name: 'Joburg Skyline Print', quantity: 1, price: 850 }], totalAmount: 925, status: 'Out for Delivery', orderDate: '2024-10-15', category: 'Art', paymentMethod: 'Points', shippingAddress: '21 Keys Ave, Rosebank, Joburg' },
  { id: 'ORD-2044', vendorName: 'Jozi Apothecary', customerName: 'Sarah Smyth', customerEmail: 'sarah.s@web.com', products: [{ name: 'Marula Glow Face Oil', quantity: 3, price: 380 }, { name: 'Baobab Soap', quantity: 2, price: 85 }], totalAmount: 1385, status: 'Delivered', orderDate: '2024-10-12', category: 'Wellness', paymentMethod: 'Card', shippingAddress: '88 4th Ave, Parkhurst, Joburg' },
  { id: 'ORD-2045', vendorName: 'Maboneng Textiles', customerName: 'Thabo Mokoena', customerEmail: 'thabo.m@gmail.com', products: [{ name: 'Veld Leather Boots', quantity: 1, price: 1850 }], totalAmount: 1925, status: 'Cancelled', orderDate: '2024-10-10', category: 'Fashion', paymentMethod: 'Card', shippingAddress: '55 Fox St, Maboneng, Joburg' },
  { id: 'ORD-2046', vendorName: 'Soweto Gold', customerName: 'Michael Botha', customerEmail: 'm.botha@corp.za', products: [{ name: 'Silver Fern Earrings', quantity: 1, price: 490 }], totalAmount: 565, status: 'Processing', orderDate: '2024-10-15', category: 'Accessories', paymentMethod: 'EFT', shippingAddress: '12 Jan Smuts Ave, Westcliff, Joburg' },
  { id: 'ORD-2047', vendorName: 'Jozi Apothecary', customerName: 'Lindiwe Sisulu', customerEmail: 'lindi.s@gmail.com', products: [{ name: 'Baobab & Honey Soap', quantity: 5, price: 85 }], totalAmount: 500, status: 'Delivered', orderDate: '2024-10-08', category: 'Wellness', paymentMethod: 'Points', shippingAddress: '101 Juta St, Braamfontein, Joburg' },
  { id: 'ORD-2048', vendorName: 'Rosebank Art', customerName: 'David Miller', customerEmail: 'david.m@global.com', products: [{ name: 'Protea Ceramic Platter', quantity: 1, price: 520 }, { name: 'Joburg Skyline Print', quantity: 1, price: 850 }], totalAmount: 1445, status: 'Picked', orderDate: '2024-10-14', category: 'Home Decor', paymentMethod: 'Card', shippingAddress: '23 Tyrwhitt Ave, Rosebank, Joburg' },
  { id: 'ORD-2049', vendorName: 'Maboneng Textiles', customerName: 'Naledi Pandor', customerEmail: 'n.pandor@gov.za', products: [{ name: 'Heritage Silk Scarf', quantity: 1, price: 750 }], totalAmount: 825, status: 'Processing', orderDate: '2024-10-15', category: 'Accessories', paymentMethod: 'Card', shippingAddress: '77 Main St, Joburg CBD' },
  { id: 'ORD-2050', vendorName: 'Soweto Gold', customerName: 'Pieter Hugo', customerEmail: 'pieter@studio.com', products: [{ name: 'Zebu Leather Wallet', quantity: 1, price: 450 }], totalAmount: 525, status: 'Out for Delivery', orderDate: '2024-10-15', category: 'Accessories', paymentMethod: 'Card', shippingAddress: '14 Vilakazi St, Soweto' },
  { id: 'ORD-2051', vendorName: 'Jozi Apothecary', customerName: 'Bongani Khumalo', customerEmail: 'bongani.k@jozi.com', products: [{ name: 'Wild Rooibos Tea', quantity: 4, price: 120 }], totalAmount: 555, status: 'Processing', orderDate: '2024-10-16', category: 'Gourmet', paymentMethod: 'Card', shippingAddress: '12 Anderson St, Marshalltown' },
];

const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<MarketOrder[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [vendorFilter, setVendorFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<keyof MarketOrder>('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<MarketOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  // Options for filters
  const vendors = ['All', ...Array.from(new Set(MOCK_ORDERS.map(o => o.vendorName)))];
  const statuses = ['All', 'Processing', 'Picked', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const categories = ['All', ...Array.from(new Set(MOCK_ORDERS.map(o => o.category)))];

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    let result = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesVendor = vendorFilter === 'All' || order.vendorName === vendorFilter;
      const matchesCategory = categoryFilter === 'All' || order.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesVendor && matchesCategory;
    });

    return result.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, searchQuery, statusFilter, vendorFilter, categoryFilter, sortBy, sortOrder]);

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleSort = (field: keyof MarketOrder) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Picked': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Out for Delivery': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Page Header */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="px-6 lg:px-12 relative z-10 text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <Link href="/admin/dashboard" className="inline-flex items-center text-jozi-gold font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Admin Hub
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Order <br /><span className="text-jozi-gold">Fulfillment.</span>
              </h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center transition-all border border-white/10">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button className="bg-jozi-gold text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-jozi-gold/20 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Batch Pickup
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Section */}
      <section className="px-6 lg:px-12 -mt-12 relative z-20">
        <div className="bg-white rounded-5xl p-8 lg:p-12 shadow-soft border border-jozi-forest/5">
          
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="ID or Customer..." 
                className="w-full bg-gray-50 border border-transparent focus:border-jozi-gold/20 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Status: All</option>
                {statuses.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            <div className="relative">
              <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none appearance-none cursor-pointer"
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
              >
                <option value="All">Artisan: All</option>
                {vendors.slice(1).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            <div className="relative">
              <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none appearance-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">Category: All</option>
                {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="date" 
                className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-6 py-4 font-bold text-sm outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-6">
                    <button onClick={() => handleSort('id')} className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-jozi-forest transition-colors">
                      Order ID <ArrowUpDown className="ml-2 w-3 h-3" />
                    </button>
                  </th>
                  <th className="pb-6">
                    <button onClick={() => handleSort('vendorName')} className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-jozi-forest transition-colors">
                      Artisan <ArrowUpDown className="ml-2 w-3 h-3" />
                    </button>
                  </th>
                  <th className="pb-6">
                    <button onClick={() => handleSort('customerName')} className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-jozi-forest transition-colors">
                      Customer <ArrowUpDown className="ml-2 w-3 h-3" />
                    </button>
                  </th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Ordered Manifest</th>
                  <th className="pb-6">
                    <button onClick={() => handleSort('totalAmount')} className="flex items-center text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-jozi-forest transition-colors">
                      Total <ArrowUpDown className="ml-2 w-3 h-3" />
                    </button>
                  </th>
                  <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                  <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="py-6">
                      <p className="font-black text-jozi-dark text-sm">{order.id}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{order.orderDate}</p>
                    </td>
                    <td className="py-6">
                      <span className="bg-jozi-cream text-jozi-forest px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-jozi-forest/5">
                        {order.vendorName}
                      </span>
                    </td>
                    <td className="py-6">
                      <p className="font-bold text-jozi-dark text-sm">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{order.customerEmail}</p>
                    </td>
                    <td className="py-6">
                      <p className="text-jozi-forest font-bold text-xs">
                        {order.products[0].name}
                      </p>
                      {order.products.length > 1 && (
                        <p className="text-[10px] text-jozi-gold font-black uppercase tracking-widest">
                          + {order.products.length - 1} more items
                        </p>
                      )}
                    </td>
                    <td className="py-6 font-black text-jozi-dark text-sm">R{order.totalAmount}</td>
                    <td className="py-6" onClick={(e) => e.stopPropagation()}>
                      <div className="relative group/status">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center cursor-pointer transition-all hover:scale-105 ${getStatusStyles(order.status)}`}>
                          {order.status}
                          <ChevronDown className="ml-2 w-3 h-3 opacity-40" />
                        </span>
                        
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 scale-95 group-hover/status:scale-100 origin-top-left">
                          {statuses.slice(1).map((s) => (
                            <button 
                              key={s}
                              onClick={() => updateOrderStatus(order.id, s as OrderStatus)}
                              className="w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-jozi-cream transition-colors text-jozi-forest flex items-center justify-between"
                            >
                              {s}
                              {order.status === s && <CheckCircle2 className="w-3 h-3 text-jozi-gold" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest hover:bg-white transition-all shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-12 pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-gray-400 text-left">
              Showing <span className="text-jozi-dark">{(currentPage - 1) * ordersPerPage + 1}</span> to <span className="text-jozi-dark">{Math.min(currentPage * ordersPerPage, filteredOrders.length)}</span> of <span className="text-jozi-dark">{filteredOrders.length}</span> orders
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:border-jozi-gold hover:text-jozi-gold transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-jozi-forest text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:border-jozi-gold'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:border-jozi-gold hover:text-jozi-gold transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 md:p-12 border-b border-gray-100 flex items-center justify-between text-left">
                <div>
                  <h2 className="text-3xl font-black text-jozi-forest tracking-tighter uppercase">{selectedOrder.id}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manifest Logged {selectedOrder.orderDate}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-4 hover:bg-gray-100 rounded-2xl transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-jozi-forest" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="grow overflow-y-auto p-8 md:p-12 space-y-12 text-left">
                
                {/* Timeline Visualization */}
                <div className="space-y-8">
                   <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-4">Fulfillment Journey</h3>
                   <div className="relative pt-4 pb-4">
                      <div className="absolute top-0 bottom-0 left-6 w-[2px] bg-gray-100" />
                      <div className="space-y-10 relative">
                        {[
                          { label: 'Order Received', time: '10:45 AM', active: true, icon: Clock },
                          { label: 'Artisan Acknowledged', time: '11:15 AM', active: true, icon: CheckCircle2 },
                          { label: 'Picked & Packed', time: 'Pending', active: !['Processing'].includes(selectedOrder.status), icon: Package },
                          { label: 'In Transit', time: 'Pending', active: ['Out for Delivery', 'Delivered'].includes(selectedOrder.status), icon: Truck },
                          { label: 'Delivered', time: 'Pending', active: selectedOrder.status === 'Delivered', icon: MapPin }
                        ].map((step, i) => (
                          <div key={i} className="flex items-center space-x-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transition-all ${step.active ? 'bg-jozi-forest text-white' : 'bg-gray-100 text-gray-300'}`}>
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

                {/* --- PRODUCTS ORDERED SECTION --- */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest flex items-center">
                      <Package className="w-4 h-4 mr-2 text-jozi-gold" />
                      Ordered Items
                    </h3>
                    <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">{selectedOrder.products.length} Units</span>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedOrder.products.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 bg-jozi-cream/30 rounded-3xl border border-jozi-forest/5 group hover:bg-jozi-cream transition-colors">
                        <div className="flex items-center space-x-5">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-jozi-forest shadow-sm group-hover:scale-105 transition-transform border border-jozi-forest/5">
                            <Package className="w-6 h-6 opacity-40" />
                          </div>
                          <div>
                            <p className="font-black text-jozi-forest text-sm leading-tight">{item.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Unit Price: R{item.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-jozi-gold uppercase tracking-widest">Qty: {item.quantity}</p>
                          <p className="font-black text-jozi-forest mt-1">R{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items & Shipping Grid */}
                <div className="grid md:grid-cols-2 gap-12 pt-4">
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest">Recipient Details</h3>
                    <div className="p-8 bg-gray-50 rounded-4xl border border-gray-100 space-y-6 relative overflow-hidden">
                      <div className="flex items-start space-x-4">
                        <User className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                        <div>
                          <p className="font-black text-jozi-forest leading-tight">{selectedOrder.customerName}</p>
                          <p className="text-xs text-gray-500 font-medium">{selectedOrder.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <MapPin className="w-5 h-5 text-jozi-gold shrink-0 mt-1" />
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{selectedOrder.shippingAddress}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-gray-400">Payment: {selectedOrder.paymentMethod}</span>
                         <CreditCard className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-jozi-forest uppercase tracking-widest">Payment Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Items Subtotal</span>
                        <span className="font-bold text-jozi-forest">R{selectedOrder.totalAmount - 75}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <span>Hub Logistics</span>
                        <span>R75</span>
                      </div>
                      <div className="h-px bg-gray-100 my-4" />
                      <div className="flex justify-between items-end pt-2">
                         <div>
                            <span className="text-[10px] font-black text-jozi-gold uppercase tracking-[0.2em]">Grand Total</span>
                            <p className="text-4xl font-black text-jozi-forest tracking-tighter">R{selectedOrder.totalAmount}</p>
                         </div>
                         <div className="text-right">
                           <span className="text-[9px] font-bold text-gray-300 uppercase block">INCL. VAT</span>
                           <span className="inline-flex items-center text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md mt-1">
                             <CheckCircle2 className="w-2 h-2 mr-1" /> Verified
                           </span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-8 rounded-4xl border border-amber-100 flex items-start space-x-6">
                   <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                   <div>
                     <h4 className="font-black text-amber-900 text-sm uppercase tracking-widest">Admin Note</h4>
                     <p className="text-xs text-amber-800 font-medium leading-relaxed mt-1 opacity-80 italic">Verified for Hub Pickup. Ensure fragile protection for {selectedOrder.category} items.</p>
                   </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-8 md:p-12 bg-gray-50 flex flex-col sm:flex-row gap-4 border-t border-gray-100">
                <div className="grow flex items-center gap-4">
                  <div className="relative grow">
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 font-bold text-sm outline-none appearance-none cursor-pointer"
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                    >
                      {statuses.slice(1).map(s => <option key={s} value={s}>State: {s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <button className="bg-jozi-forest text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark transition-all shadow-xl shadow-jozi-forest/20 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 mr-2 text-jozi-gold" />
                  Generate Invoice
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