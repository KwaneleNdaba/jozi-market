
import React, { useState } from 'react';
import { IProduct } from '@/interfaces/product/product';
import { motion, AnimatePresence } from 'framer-motion';
import VendorHeader from '../../components/VendorHeader';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  BarChart3, 
  Sparkles,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Box,
  TrendingDown,
  ShoppingBag,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';
import InventoryList from '../../components/vendor/InventoryList';
import InventoryAddProduct from '../../components/vendor/InventoryAddProduct';
import InventoryStockAlerts from '../../components/vendor/InventoryStockAlerts';
import InventoryAnalytics from '../../components/vendor/InventoryAnalytics';
import InventoryStockManager from './InventoryStockManager';

const VENDOR_PROFILE = {
  name: "Maboneng Textiles",
  logo: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100",
  tier: 'Growth'
};

const VendorInventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'stock' | 'add' | 'alerts' | 'analytics'>('all');
  const [editingProduct, setEditingProduct] = useState<IProduct | undefined>(undefined);

  const tabs = [
    { id: 'all', label: 'Product Vault', icon: Package },
    { id: 'stock', label: 'Stock Manager', icon: ClipboardList },
    { id: 'add', label: 'Add New Piece', icon: Plus },
    { id: 'alerts', label: 'Stock Alarms', icon: AlertTriangle },
    { id: 'analytics', label: 'Inventory ROI', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-8 pb-32">
      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          <main className="grow space-y-8">
            <VendorHeader 
              title="Product Vault" 
              vendorName={VENDOR_PROFILE.name} 
              onUploadClick={() => setActiveTab('add')} 
            />

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Treasures', val: '124', trend: '+12 this month', icon: Box, color: 'text-jozi-forest', bg: 'bg-jozi-forest/5' },
                { label: 'Active Listings', val: '118', trend: '95% Active', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Critical Stock', val: '5', trend: 'Needs Restock', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Vault Valuation', val: 'R425k', trend: 'Est. GMV', icon: ShoppingBag, color: 'text-jozi-gold', bg: 'bg-jozi-gold/10' },
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

            {/* AI Assistant Overlay Card */}
            <div className="bg-jozi-forest rounded-5xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-r from-jozi-dark via-transparent to-jozi-gold/10" />
              <div className="relative z-10 flex items-center space-x-6">
                <div className="w-16 h-16 bg-jozi-gold rounded-2xl flex items-center justify-center text-jozi-dark shadow-xl">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black uppercase tracking-tight">Vault Optimization</h3>
                  <p className="text-jozi-cream/60 text-sm font-medium max-w-xl">
                    Our AI suggests <span className="text-white font-bold">bundling</span> your "Indigo Silk Scarf" with "Shweshwe Dresses" for a predicted <span className="text-jozi-gold font-bold">12% uptick</span> in average order value.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => alert('Opening Bundle Creator...')}
                className="relative z-10 bg-white text-jozi-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-gold transition-all shadow-xl"
              >
                Execute Strategy
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-white p-2 rounded-4xl shadow-soft border border-jozi-forest/5 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'all' | 'stock' | 'add' | 'alerts' | 'analytics')}
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

            {/* Content Rendering */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {activeTab === 'all' && (
                  <InventoryList 
                    onEdit={(product) => {
                      setActiveTab('add');
                      // Store product in state or pass directly
                      setEditingProduct(product);
                    }} 
                  />
                )}
                {activeTab === 'stock' && <InventoryStockManager />}
                {activeTab === 'add' && (
                  <InventoryAddProduct 
                    onCancel={() => {
                      setActiveTab('all');
                      setEditingProduct(undefined);
                    }} 
                    product={editingProduct}
                  />
                )}
                {activeTab === 'alerts' && <InventoryStockAlerts />}
                {activeTab === 'analytics' && <InventoryAnalytics />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorInventoryPage;
