'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  Star, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  CreditCard,
  Award,
  Zap,
  ArrowLeft,
  Truck,
  CheckCircle2,
  ExternalLink,
  Tag,
  Flame
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { products } from '../../data/mockData';
import CustomerSidebar from '../../components/CustomerSidebar';

interface OrderDetail {
  id: string;
  date: string;
  status: 'In Transit' | 'Delivered' | 'Processing';
  total: string;
  subtotal: string;
  shipping: string;
  discount: string;
  voucherCode?: string;
  pointsEarned: number;
  deliveryAddress: string;
  trackingNumber: string;
  items: {
    id: string;
    name: string;
    vendor: string;
    price: string;
    quantity: number;
    image: string;
  }[];
}

const ProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const user = {
    name: "Lerato Dlamini",
    email: "lerato.d@jozimail.com",
    avatar: "https://picsum.photos/seed/lerato/200/200",
    level: 22,
    points: 1250,
    joinDate: "March 2024",
    streak: 4
  };

  const orders: OrderDetail[] = [
    { 
      id: '#ORD-7721', 
      date: 'Oct 12, 2024', 
      status: 'In Transit', 
      total: 'R1,250',
      subtotal: 'R1,325',
      shipping: 'R75',
      discount: 'R150',
      voucherCode: 'JOZI-WELCOME',
      pointsEarned: 125,
      deliveryAddress: '12 Gwigwi Mrwebi St, Newtown, Johannesburg, 2001',
      trackingNumber: 'JZ-882-991-ZA',
      items: [
        { id: 'p1', name: 'Shweshwe Evening Dress', vendor: 'Maboneng Textiles', price: 'R1,250', quantity: 1, image: products[0].images[0] }
      ]
    },
    { 
      id: '#ORD-6510', 
      date: 'Sep 28, 2024', 
      status: 'Delivered', 
      total: 'R450',
      subtotal: 'R375',
      shipping: 'R75',
      discount: 'R0',
      pointsEarned: 45,
      deliveryAddress: '12 Gwigwi Mrwebi St, Newtown, Johannesburg, 2001',
      trackingNumber: 'JZ-441-002-ZA',
      items: [
        { id: 'p2', name: 'Hand-Carved Baobab Bowl', vendor: 'Rosebank Art Gallery', price: 'R450', quantity: 1, image: products[1].images[0] }
      ]
    },
    { 
      id: '#ORD-5901', 
      date: 'Aug 15, 2024', 
      status: 'Delivered', 
      total: 'R850',
      subtotal: 'R775',
      shipping: 'R75',
      discount: 'R0',
      pointsEarned: 85,
      deliveryAddress: '12 Gwigwi Mrwebi St, Newtown, Johannesburg, 2001',
      trackingNumber: 'JZ-119-224-ZA',
      items: [
        { id: 'p3', name: 'Joburg Skyline Print', vendor: 'Rosebank Art Gallery', price: 'R850', quantity: 1, image: products[2].images[0] }
      ]
    },
  ];

  const selectedOrder = useMemo(() => orders.find(o => o.id === selectedOrderId), [selectedOrderId, orders]);
  const wishlistItems = products.slice(0, 3);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'Delivered': return <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Delivered</span>;
      case 'In Transit': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">In Transit</span>;
      default: return <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Processing</span>;
    }
  };

  return (
    <div className="bg-jozi-cream min-h-screen pb-24">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <CustomerSidebar user={user} />

          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <motion.div
                  key="order-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <button 
                    onClick={() => setSelectedOrderId(null)}
                    className="inline-flex items-center text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-jozi-forest transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to History
                  </button>

                  <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-soft border border-jozi-forest/5 space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-jozi-forest/5 pb-10">
                      <div className="space-y-2 text-left">
                        <div className="flex items-center space-x-3">
                          <h2 className="text-4xl font-black text-jozi-forest tracking-tighter">{selectedOrder.id}</h2>
                          {renderStatus(selectedOrder.status)}
                        </div>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Placed on {selectedOrder.date}</p>
                      </div>
                      <div className="text-left md:text-right space-y-1">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tracking Number</p>
                        <div className="flex items-center md:justify-end text-jozi-forest font-black text-xl">
                          {selectedOrder.trackingNumber}
                          <ExternalLink className="w-4 h-4 ml-2 text-jozi-gold cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 text-left">
                       <h3 className="text-lg font-black text-jozi-forest uppercase tracking-widest">Shipment Status</h3>
                       <div className="relative pt-4 pb-8">
                         <div className="absolute top-1/2 left-0 right-0 h-1 bg-jozi-cream -translate-y-1/2 rounded-full overflow-hidden">
                           <div className={`h-full bg-jozi-gold transition-all duration-1000 ${selectedOrder.status === 'Delivered' ? 'w-full' : 'w-2/3'}`} />
                         </div>
                         <div className="relative flex justify-between">
                            {[
                              { label: 'Ordered', icon: Clock, done: true },
                              { label: 'Processing', icon: Package, done: true },
                              { label: 'In Transit', icon: Truck, done: true },
                              { label: 'Delivered', icon: MapPin, done: selectedOrder.status === 'Delivered' }
                            ].map((step, i) => (
                              <div key={i} className="flex flex-col items-center space-y-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 border-4 border-white shadow-lg transition-all ${step.done ? 'bg-jozi-forest text-white' : 'bg-white text-gray-200'}`}>
                                  <step.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${step.done ? 'text-jozi-forest' : 'text-gray-300'}`}>{step.label}</span>
                              </div>
                            ))}
                         </div>
                       </div>
                    </div>

                    <div className="space-y-6 text-left">
                      <h3 className="text-lg font-black text-jozi-forest uppercase tracking-widest">Ordered Items</h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="bg-jozi-cream/30 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-8 group hover:bg-jozi-cream/50 transition-all">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-sm shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow text-center sm:text-left">
                              <h4 className="text-xl font-black text-jozi-forest">{item.name}</h4>
                              <p className="text-xs font-bold text-jozi-gold uppercase tracking-widest mt-1">by {item.vendor}</p>
                            </div>
                            <div className="flex items-center space-x-12">
                              <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</p>
                                <p className="font-black text-jozi-forest">{item.quantity}</p>
                              </div>
                              <div className="text-right min-w-[100px]">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                                <p className="font-black text-jozi-forest text-xl">{item.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 pt-10 border-t border-jozi-forest/5 text-left">
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h4 className="text-sm font-black text-jozi-forest uppercase tracking-widest flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-jozi-gold" /> Delivery Destination
                          </h4>
                          <div className="p-6 bg-jozi-cream/30 rounded-[2rem] border border-jozi-forest/5">
                            <p className="font-bold text-jozi-forest leading-relaxed">{selectedOrder.deliveryAddress}</p>
                          </div>
                        </div>
                        <div className="bg-jozi-forest p-8 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                          <Award className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                          <div className="relative z-10 flex items-center space-x-6">
                            <div className="w-16 h-16 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-forest shadow-xl">
                              <Zap className="w-8 h-8 fill-current" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Neighbors Loyalty</p>
                              <p className="text-2xl font-black">+{selectedOrder.pointsEarned} Pts Earned</p>
                              <p className="text-xs text-jozi-cream/60 font-medium">Added on {selectedOrder.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-sm font-black text-jozi-forest uppercase tracking-widest">Payment Breakdown</h4>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-gray-400 font-bold text-sm">
                             <span>Original Subtotal</span>
                             <span>{selectedOrder.subtotal}</span>
                           </div>
                           <div className="flex justify-between items-center text-gray-400 font-bold text-sm">
                             <span>Hub Logistics & Shipping</span>
                             <span>{selectedOrder.shipping}</span>
                           </div>
                           {selectedOrder.voucherCode && (
                             <div className="flex justify-between items-center text-emerald-500 font-black text-sm">
                               <div className="flex items-center">
                                 <Tag className="w-4 h-4 mr-2" />
                                 <span>Discount ({selectedOrder.voucherCode})</span>
                               </div>
                               <span>-{selectedOrder.discount}</span>
                             </div>
                           )}
                           <div className="h-[1px] bg-jozi-forest/5 w-full my-4" />
                           <div className="flex justify-between items-end">
                             <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-jozi-gold">Final Paid Amount</p>
                               <p className="text-5xl font-black text-jozi-forest tracking-tighter">{selectedOrder.total}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-[9px] font-bold text-gray-300 uppercase">Incl. VAT @ 15%</p>
                               <div className="flex items-center space-x-2 text-emerald-500 mt-2">
                                 <ShieldCheck className="w-4 h-4" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Paid via Card</span>
                               </div>
                             </div>
                           </div>
                        </div>
                        <button className="w-full mt-6 py-5 bg-jozi-cream rounded-2xl font-black text-sm uppercase tracking-widest text-jozi-forest hover:bg-jozi-forest hover:text-white transition-all shadow-sm">
                          Download Tax Invoice (PDF)
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-8 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: 'Market Points', value: user.points, icon: Star, color: 'text-jozi-gold' },
                          { label: 'Active Streak', value: `${user.streak} Days`, icon: Flame, color: 'text-orange-500' },
                          { label: 'Total Saved', value: 'R1,420', icon: Zap, color: 'text-emerald-500' },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white p-8 rounded-[2rem] border border-jozi-forest/5 shadow-soft flex items-center space-x-6">
                            <div className={`p-4 bg-gray-50 rounded-2xl ${stat.color}`}>
                              <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                              <p className="text-2xl font-black text-jozi-forest">{stat.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white rounded-[3rem] p-10 border border-jozi-forest/5 shadow-soft">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Recent Manifests</h3>
                          <Link href="/profile?tab=orders" className="text-sm font-bold text-jozi-gold hover:underline">Full History</Link>
                        </div>
                        <div className="space-y-4">
                          {orders.slice(0, 3).map((order) => (
                            <div 
                              key={order.id} 
                              onClick={() => setSelectedOrderId(order.id)}
                              className="flex items-center justify-between p-6 bg-jozi-cream/30 rounded-3xl hover:bg-jozi-cream/50 transition-all group cursor-pointer"
                            >
                              <div className="flex items-center space-x-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                  <Package className="w-6 h-6 text-jozi-forest" />
                                </div>
                                <div>
                                  <p className="font-black text-jozi-forest">{order.id}</p>
                                  <p className="text-xs text-gray-400 font-bold">{order.date} • {order.items.length} Units</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-8">
                                <div className="text-right">
                                  <p className="font-black text-jozi-forest">{order.total}</p>
                                  {renderStatus(order.status)}
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-jozi-forest transition-colors" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-jozi-forest rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 space-y-4 max-w-md">
                          <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Level 22 Connector: <br /><span className="text-jozi-gold italic">Premium Neighbor</span></h3>
                          <p className="text-jozi-cream/60 font-medium">You've empowered 12 local artisans this cycle! Your contribution keeps the Joburg creative heartbeat strong.</p>
                        </div>
                        <Link href="/referrals" className="relative z-10 bg-jozi-gold text-jozi-dark px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                          Expand Collective
                        </Link>
                        <Award className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 opacity-20 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="space-y-6 text-left">
                      <div className="bg-white rounded-[3rem] p-10 border border-jozi-forest/5 shadow-soft">
                        <h3 className="text-2xl font-black text-jozi-forest mb-10 uppercase tracking-tight">Artisan Order Registry</h3>
                        <div className="space-y-6">
                           {orders.map((order) => (
                             <div 
                              key={order.id} 
                              onClick={() => setSelectedOrderId(order.id)}
                              className="border-b border-jozi-forest/5 pb-8 last:border-0 last:pb-0 group cursor-pointer"
                             >
                               <div className="flex justify-between items-start mb-6">
                                 <div>
                                   <div className="flex items-center space-x-3">
                                      <p className="text-xl font-black text-jozi-forest group-hover:text-jozi-gold transition-colors">{order.id}</p>
                                      {renderStatus(order.status)}
                                   </div>
                                   <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-widest">{order.date}</p>
                                 </div>
                                 <div className="text-right">
                                   <p className="text-xl font-black text-jozi-forest">{order.total}</p>
                                   <div className="flex items-center text-xs font-bold text-jozi-gold mt-1 justify-end">
                                      Manifest Detail <ChevronRight className="w-3 h-3 ml-1" />
                                   </div>
                                 </div>
                               </div>
                               <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                                 {order.items.map((item, idx) => (
                                   <div key={idx} className="w-20 h-20 rounded-2xl bg-jozi-cream border border-jozi-forest/5 overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                     <img src={item.image} className="w-full h-full object-cover" />
                                   </div>
                                 ))}
                                 <div className="h-20 flex flex-col justify-center px-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 flex-grow">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipment Logic</p>
                                    <p className="text-xs font-bold text-jozi-forest">{order.trackingNumber}</p>
                                 </div>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'wishlist' && (
                    <div className="bg-white rounded-[3rem] p-10 border border-jozi-forest/5 shadow-soft text-left">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">Saved Treasures</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{wishlistItems.length} Handpicked Pieces</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="flex gap-6 p-4 bg-jozi-cream/30 rounded-3xl border border-jozi-forest/5 group hover:bg-white transition-all">
                             <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-sm shrink-0">
                                <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             </div>
                             <div className="flex-grow flex flex-col justify-between py-2">
                               <div>
                                 <h4 className="font-black text-jozi-forest group-hover:text-jozi-gold transition-colors">{item.name}</h4>
                                 <p className="text-xs font-bold text-jozi-gold uppercase tracking-widest mt-1">by {item.vendor.name}</p>
                               </div>
                               <div className="flex items-center justify-between">
                                  <span className="font-black text-jozi-forest">R{item.price}</span>
                                  <button className="text-[10px] font-black uppercase text-jozi-gold hover:text-jozi-forest tracking-widest">Transfer to Bag</button>
                               </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                      <div className="bg-white p-10 rounded-[3rem] border border-jozi-forest/5 shadow-soft space-y-8">
                        <h3 className="text-xl font-black text-jozi-forest flex items-center uppercase tracking-tight">
                          <ShieldCheck className="w-5 h-5 mr-3 text-jozi-gold" />
                          Security Protocol
                        </h3>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Neighbor Identifier</label>
                            <input type="text" defaultValue={user.name} className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/20" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Verified Email</label>
                            <input type="email" defaultValue={user.email} className="w-full bg-jozi-cream rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/20" />
                          </div>
                          <button className="w-full bg-jozi-forest text-white py-4 rounded-2xl font-black shadow-xl shadow-jozi-forest/20 hover:bg-jozi-dark transition-all">
                            Synchronize Profile
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-10 rounded-[3rem] border border-jozi-forest/5 shadow-soft space-y-8">
                        <h3 className="text-xl font-black text-jozi-forest flex items-center uppercase tracking-tight">
                          <MapPin className="w-5 h-5 mr-3 text-jozi-gold" />
                          Delivery Hubs
                        </h3>
                        <div className="space-y-4">
                          <div className="p-6 bg-jozi-cream/50 rounded-3xl border border-jozi-forest/5 relative group">
                            <p className="font-black text-jozi-forest">Primary Residence</p>
                            <p className="text-sm text-gray-400 font-medium mt-1 leading-tight">12 Gwigwi Mrwebi St, Newtown, Johannesburg, 2001</p>
                            <button className="absolute top-6 right-6 text-jozi-gold font-bold text-xs uppercase tracking-widest hover:text-jozi-forest transition-colors">Adjust</button>
                          </div>
                          <button className="w-full py-4 border-2 border-dashed border-jozi-forest/10 rounded-3xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-jozi-forest hover:text-jozi-forest transition-all">
                            + Initialize New Address
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;