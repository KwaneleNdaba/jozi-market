import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp,
  Package,
  Truck
} from 'lucide-react';
import OrderList from '../../components/vendor/OrderList';
import OrderAnalytics from '../../components/vendor/OrderAnalytics';
import { getCurrentUserAction } from '@/app/actions/auth/auth';
import { getOrdersByVendorIdAction } from '@/app/actions/order/index';
import { IVendorOrdersResponse, IOrder, OrderStatus } from '@/interfaces/order/order';
import { IUser } from '@/interfaces/auth/auth';
import { useToast } from '@/app/contexts/ToastContext';

const VendorOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'analytics'>('all');
  const [user, setUser] = useState<IUser | null>(null);
  const [vendorOrders, setVendorOrders] = useState<IVendorOrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { showError } = useToast();

  const tabs = [
    { id: 'all', label: 'Master Manifest', icon: ShoppingCart },
    { id: 'pending', label: 'Action Required', icon: Clock },
    { id: 'completed', label: 'Dispatched', icon: CheckCircle2 },
    { id: 'analytics', label: 'Logistics Intelligence', icon: BarChart3 },
  ];

  // Fetch user data to get vendor ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUserAction();
        if (!response.error && response.data) {
          setUser(response.data);
        } else {
          showError(response.message || 'Failed to load user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        showError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [showError]);

  // Fetch orders by vendor ID
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        setLoadingOrders(true);
        const response = await getOrdersByVendorIdAction(user.id);
        if (!response.error && response.data) {
          setVendorOrders(response.data);
        } else {
          showError(response.message || 'Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        showError('Failed to load orders');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id, showError]);

  // Flatten grouped orders into a single array for OrderList
  const allOrders = useMemo(() => {
    if (!vendorOrders?.groupedOrders) return [];
    return vendorOrders.groupedOrders.flatMap(group => group.orders);
  }, [vendorOrders]);

  // Calculate KPIs from orders
  const kpis = useMemo(() => {
    if (!vendorOrders) {
      return {
        unfulfilled: '0',
        dispatchVelocity: '0h',
        cycleRevenue: 'R0',
        customerTrust: '0/5',
      };
    }

    // Count unfulfilled orders (pending, processing)
    const unfulfilled = allOrders.filter(
      order => order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING
    ).length;

    // Calculate total revenue
    const totalRevenue = vendorOrders.totalAmount || 0;
    const revenueValue = typeof totalRevenue === 'string' 
      ? parseFloat(totalRevenue) 
      : totalRevenue;

    // Calculate average dispatch time (mock for now, can be calculated from order dates)
    const dispatchVelocity = '4.2h';

    // Customer trust rating (mock for now)
    const customerTrust = '4.9/5';

    return {
      unfulfilled: unfulfilled.toString(),
      dispatchVelocity,
      cycleRevenue: `R${revenueValue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      customerTrust,
    };
  }, [vendorOrders, allOrders]);

  // Get vendor profile name
  const vendorName = user?.fullName || 'Vendor';

  return (
    <div className="space-y-8">
      <VendorHeader 
        title="Order Manifest" 
        vendorName={vendorName} 
        onUploadClick={() => alert('Opening Piece Upload...')} 
      />

      {/* Quick KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Unfulfilled Orders', val: kpis.unfulfilled, trend: parseInt(kpis.unfulfilled) > 0 ? 'Urgent' : 'All Clear', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Dispatch Velocity', val: kpis.dispatchVelocity, trend: '-20m', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Cycle Revenue', val: kpis.cycleRevenue, trend: '+14%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Customer Trust', val: kpis.customerTrust, trend: 'Top 1%', icon: CheckCircle2, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-6 rounded-4xl shadow-soft border border-jozi-forest/5 text-left group hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">{stat.label}</p>
            <h3 className="text-3xl font-black mt-2 text-jozi-forest">{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white p-2 rounded-4xl shadow-soft border border-jozi-forest/5 overflow-x-auto scrollbar-hide w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-3 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-jozi-forest text-white shadow-xl shadow-jozi-forest/20' 
                : 'text-gray-400 hover:bg-jozi-forest/5 hover:text-jozi-forest'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* View Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'analytics' ? (
            <OrderAnalytics />
          ) : (
            <OrderList 
              filterStatus={activeTab} 
              orders={allOrders}
              loading={loadingOrders}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorOrdersPage;