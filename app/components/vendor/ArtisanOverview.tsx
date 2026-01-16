import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, DollarSign, Clock, Wallet, Star, AlertTriangle, 
  Truck, TrendingUp, ShoppingCart, Award, MessageCircle, Package, Activity, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../StatusBadge';
import SectionHeader from '../SectionHeader';
import Logo from '../Logo';

const PERFORMANCE_STATS = [
  { id: 'orders-today', label: "Today's Orders", val: '14', trend: '+2', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'revenue-mtd', label: 'Monthly Revenue', val: 'R42,850', trend: '+12%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'pending-orders', label: 'Pending Prep', val: '8', trend: 'Urgent', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'payout-pool', label: 'Pending Payout', val: 'R12,400', trend: 'Fri', icon: Wallet, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10' },
  { id: 'avg-rating', label: 'Artisan Rating', val: '4.8/5', trend: 'Top 5%', icon: Star, color: 'text-jozi-forest', bg: 'bg-jozi-forest/10' },
];

const SALES_HISTORY = [
  { name: 'Mon', revenue: 4200, orders: 12 },
  { name: 'Tue', revenue: 3800, orders: 10 },
  { name: 'Wed', revenue: 5100, orders: 15 },
  { name: 'Thu', revenue: 4900, orders: 14 },
  { name: 'Fri', revenue: 7200, orders: 22 },
  { name: 'Sat', revenue: 8500, orders: 28 },
  { name: 'Sun', revenue: 6100, orders: 19 },
];

const RECENT_ORDERS = [
  { id: '#ORD-2041', status: 'Processing', total: 1250, eta: '2h remaining', customer: 'Thandiwe M.' },
  { id: '#ORD-2040', status: 'Ready', total: 450, eta: '1h remaining', customer: 'Bongani S.' },
  { id: '#ORD-2039', status: 'Delivered', total: 2100, eta: 'Yesterday', customer: 'Lerato K.' },
];

interface ArtisanOverviewProps {
  vendor: {
    name: string;
    logo: string;
    tier: string;
    status: string;
    deliveryMode: string;
    stockHealth: string;
  }
}

const ArtisanOverview: React.FC<ArtisanOverviewProps> = ({ vendor }) => {
  const [storeOpen, setStoreOpen] = useState(vendor.status === 'Open');

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {PERFORMANCE_STATS.map((stat) => (
          <motion.div
            whileHover={{ y: -5 }}
            key={stat.id}
            className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-jozi-forest/5 text-left group transition-all cursor-pointer overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-2 py-1 rounded uppercase">
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{stat.label}</p>
              <h3 className={`text-3xl font-black mt-2 text-jozi-forest`}>{stat.val}</h3>
            </div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-jozi-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-jozi-forest/5 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
              <Logo className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center space-x-5">
                <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-jozi-cream shadow-xl">
                  <img src={vendor.logo} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-jozi-dark tracking-tight leading-none uppercase">{vendor.name}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <StatusBadge status="Verified" />
                    <StatusBadge status={vendor.tier} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-gray-50 pt-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Inventory State</p>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-black text-jozi-forest">{vendor.stockHealth}</span>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Store Status</p>
                  <button
                    onClick={() => setStoreOpen(!storeOpen)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOpen ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}
                  >
                    {storeOpen ? 'Shop Open' : 'Shop Closed'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-jozi-cream rounded-2xl">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-jozi-forest" />
                  <span className="text-xs font-bold text-jozi-forest">{vendor.deliveryMode}</span>
                </div>
                <button className="text-[10px] font-black text-jozi-gold uppercase hover:underline">Settings</button>
              </div>
            </div>
          </div>

          <div className="bg-jozi-dark p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
            <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
            <h3 className="text-2xl font-black tracking-tight uppercase leading-none relative z-10">Critical Operations</h3>
            <div className="space-y-4 relative z-10">
              {[
                { label: 'Unconfirmed Manifests', count: 4, icon: ShoppingBag, btn: 'Confirm' },
                { label: 'Critically Low SKUs', count: 2, icon: Package, btn: 'Restock' },
                { label: 'New Customer Chat', count: 1, icon: MessageCircle, btn: 'Reply' },
                { label: 'New Feedback Logs', count: 3, icon: Star, btn: 'Review' },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group/action">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-xl text-jozi-gold"><alert.icon className="w-5 h-5" /></div>
                    <div>
                      <p className="text-sm font-bold">{alert.label}</p>
                      <p className="text-[10px] font-black uppercase text-jozi-gold">{alert.count} Pending</p>
                    </div>
                  </div>
                  <button className="bg-white text-jozi-dark px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-gold transition-all">
                    {alert.btn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-jozi-forest/5 text-left">
            <SectionHeader title="Commercial Velocity" sub="Revenue and order trajectory for the current cycle." icon={TrendingUp} />
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_HISTORY}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E52" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1B5E52" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1B5E52" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-jozi-forest/5 text-left">
            <SectionHeader title="Hero Products" sub="Top performing pieces in your workshop." icon={Award} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 'p1', name: 'Shweshwe Evening Dress', price: 1250, sales: 42, img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=100' },
                { id: 'p2', name: 'Zebu Leather Wallet', price: 450, sales: 128, img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=100' },
                { id: 'p3', name: 'Hand-Carved Bowl', price: 450, sales: 56, img: 'https://images.unsplash.com/photo-1611486212330-9199b0c0bc3f?auto=format&fit=crop&q=80&w=100' },
              ].map((p) => (
                <div key={p.id} className="flex items-center space-x-5 p-4 bg-jozi-cream rounded-3xl border border-jozi-forest/5 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-jozi-dark text-xs truncate leading-tight">{p.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{p.sales} Sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanOverview;