
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Save,
  Zap,
  Info,
  DollarSign,
  Package,
  History,
  CheckCircle2,
  Trash2,
  Settings2,
  Sparkles,
  X
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import SectionHeader from '../../components/SectionHeader';
import { products } from '../../data/vendor-stock';

// Transform products from vendor-stock.ts to stock manager format
const transformProductsToStockData = () => {
  const getLastRestockDate = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return products.map((product, index) => {
    // Calculate production cost as 35% of price (default margin)
    const productionCost = Math.round(product.price * 0.35);
    
    // Generate SKU from product ID
    const sku = `MAB-${product.id.toUpperCase()}`;
    
    // Use first image or default
    const img = product.images?.[0] || 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=100';
    
    // Generate last restock date (varied dates)
    const lastRestock = getLastRestockDate(5 + (index * 3));
    
    // Transform variants if they exist
    const transformedVariants = product.variants?.map((variant, vIndex) => ({
      id: variant.id || `v${index}-${vIndex}`,
      name: variant.name || `${variant.type} Option`,
      sku: variant.sku || `${sku}-${variant.type}`,
      price: variant.price || product.price,
      productionCost: Math.round((variant.price || product.price) * 0.35),
      stock: variant.stock || Math.floor(product.stock / (product.variants?.length || 1)),
      supplierRef: `${product.vendor.name}`,
      lastRestock: getLastRestockDate(3 + (vIndex * 2))
    })) || [];

    return {
      id: product.id,
      name: product.name,
      sku,
      category: product.category,
      price: product.price,
      productionCost,
      stock: product.stock,
      status: 'Active' as const,
      img,
      lastRestock,
      variants: transformedVariants
    };
  });
};

const INITIAL_STOCK_DATA = transformProductsToStockData();

const InventoryStockManager: React.FC = () => {
  const [data, setData] = useState(INITIAL_STOCK_DATA);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const handleUpdateStock = (productId: string, variantId: string | null, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;

    setData(prev => prev.map(p => {
      if (p.id === productId) {
        if (variantId === null) {
          return { ...p, stock: numValue };
        } else {
          const newVariants = p.variants.map(v => v.id === variantId ? { ...v, stock: numValue } : v);
          const totalStock = newVariants.reduce((acc, curr) => acc + curr.stock, 0);
          return { ...p, variants: newVariants, stock: totalStock };
        }
      }
      return p;
    }));
  };

  const handleUpdateCost = (productId: string, variantId: string | null, value: string) => {
    const numValue = parseFloat(value) || 0;
    setData(prev => prev.map(p => {
      if (p.id === productId) {
        if (variantId === null) {
          return { ...p, productionCost: numValue };
        } else {
          const newVariants = p.variants.map(v => v.id === variantId ? { ...v, productionCost: numValue } : v);
          return { ...p, variants: newVariants };
        }
      }
      return p;
    }));
  };

  const saveLedger = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Vault Ledger Synchronized Successfully.');
    }, 1200);
  };

  const getStockStatus = (count: number) => {
    if (count === 0) return { label: 'Out of Stock', color: 'text-rose-600 bg-rose-50' };
    if (count < 5) return { label: 'Low Stock', color: 'text-orange-600 bg-orange-50' };
    return { label: 'In Stock', color: 'text-emerald-600 bg-emerald-50' };
  };

  return (
    <div className="space-y-8 text-left">
      <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <SectionHeader 
            title="Stock Ledger" 
            sub="High-density management of production costs and unit availability." 
            icon={Package}
          />
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
             <div className="relative grow lg:flex-none lg:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Filter vault..." className="w-full bg-gray-50 border border-transparent rounded-2xl pl-11 pr-4 py-3 text-xs font-bold outline-none" />
             </div>
             <button onClick={() => setShowBulkModal(true)} className="px-6 py-3 bg-white border border-jozi-forest/10 text-jozi-forest rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-cream transition-all shadow-sm">
                Bulk Adjust
             </button>
             <button 
              onClick={saveLedger}
              disabled={isSaving}
              className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center shadow-xl ${
                isSaving ? 'bg-gray-100 text-gray-400' : 'bg-jozi-forest text-white hover:bg-jozi-dark shadow-jozi-forest/20'
              }`}
             >
                {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Commit Ledger
             </button>
          </div>
        </div>

        {/* Dense Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 w-12 text-center text-[10px] font-black uppercase text-gray-300">Tiers</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest min-w-[250px]">Artifact Identity</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest text-center">Unit Stock</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest text-center">Prod. Cost (ZAR)</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-300 tracking-widest text-center">Gross Margin</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Total Value</th>
                <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-300 tracking-widest">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((product) => {
                const isExpanded = expandedRows.includes(product.id);
                const hasVariants = product.variants.length > 0;
                const status = getStockStatus(product.stock);
                const margin = ((product.price - (product.productionCost || 0)) / product.price * 100).toFixed(1);
                const totalValue = (product.stock * (product.productionCost || 0)).toLocaleString();

                return (
                  <React.Fragment key={product.id}>
                    <tr className={`group transition-all ${isExpanded ? 'bg-jozi-cream/20' : 'hover:bg-gray-50/50'}`}>
                      <td className="py-6 text-center">
                        {hasVariants && (
                          <button 
                            onClick={() => toggleRow(product.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-jozi-forest text-white rotate-90' : 'bg-gray-50 text-gray-300 group-hover:text-jozi-forest'}`}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                      </td>
                      <td className="py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                            <img src={product.img} className="w-full h-full object-cover" alt={product.name} />
                          </div>
                          <div>
                            <p className="font-black text-jozi-forest text-sm leading-tight">{product.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex justify-center">
                          <input 
                            type="number" 
                            value={product.stock}
                            onChange={(e) => handleUpdateStock(product.id, null, e.target.value)}
                            disabled={hasVariants}
                            className={`w-20 text-center py-2 rounded-xl font-black text-sm outline-none border-2 transition-all ${
                              hasVariants ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed' : 'bg-white border-gray-100 focus:border-jozi-gold/40 text-jozi-dark'
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex justify-center">
                          <div className="relative group/cost">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">R</span>
                            <input 
                              type="number" 
                              value={product.productionCost}
                              onChange={(e) => handleUpdateCost(product.id, null, e.target.value)}
                              className="w-24 pl-7 pr-3 text-center py-2 rounded-xl bg-white border-2 border-gray-100 focus:border-jozi-gold/40 font-black text-sm text-jozi-dark outline-none transition-all"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-6 text-center">
                         <div className="inline-block px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                           <span className="text-xs font-black text-emerald-600">{margin}%</span>
                         </div>
                      </td>
                      <td className="py-6 text-center">
                         <p className="text-sm font-black text-jozi-dark">R{totalValue}</p>
                         <p className="text-[8px] font-bold text-gray-300 uppercase mt-1">Stock Capital</p>
                      </td>
                      <td className="py-6 text-right">
                         <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.color}`}>
                              {status.label}
                            </span>
                            <p className="text-[8px] font-bold text-gray-300 uppercase mt-2">Last: {product.lastRestock}</p>
                         </div>
                      </td>
                    </tr>

                    {/* Variant Sub-Table */}
                    <AnimatePresence>
                      {isExpanded && hasVariants && (
                        <tr>
                          <td colSpan={7} className="px-0 py-0 border-none bg-gray-50/50">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="p-6 lg:px-12 lg:pb-10 space-y-4"
                            >
                               <div className="flex items-center space-x-3 mb-4">
                                  <div className="w-8 h-8 bg-jozi-gold/10 rounded-lg flex items-center justify-center text-jozi-gold">
                                     <Layers className="w-4 h-4" />
                                  </div>
                                  <h4 className="text-[10px] font-black text-jozi-forest uppercase tracking-widest">Manage Variations ({product.variants.length})</h4>
                               </div>
                               
                               <div className="space-y-2">
                                  {product.variants.map((v) => {
                                    // Fix: Handle cases where price or productionCost might be optional/missing
                                    const vPrice = v.price || 0;
                                    const vProdCost = v.productionCost || 0;
                                    const vMargin = vPrice > 0 ? (((vPrice - vProdCost) / vPrice) * 100).toFixed(1) : "0";
                                    const vStatus = getStockStatus(v.stock || 0);
                                    return (
                                      <div key={v.id} className="bg-white p-5 rounded-3xl border border-gray-100 grid grid-cols-12 gap-4 items-center group/v shadow-sm hover:shadow-md transition-all">
                                         <div className="col-span-3 flex items-center space-x-4">
                                            <div className="w-1.5 h-8 rounded-full bg-jozi-gold" />
                                            <div>
                                               <p className="font-black text-xs text-jozi-forest">{v.name}</p>
                                               <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{v.sku}</p>
                                            </div>
                                         </div>
                                         <div className="col-span-2 flex justify-center">
                                            <div className="space-y-1">
                                               <p className="text-[8px] font-black uppercase text-gray-300 text-center">Restock</p>
                                               <input 
                                                type="number" 
                                                value={v.stock}
                                                onChange={(e) => handleUpdateStock(product.id, v.id, e.target.value)}
                                                className="w-full max-w-[80px] text-center py-1.5 rounded-lg border-2 border-gray-100 focus:border-jozi-gold/40 font-black text-xs outline-none"
                                               />
                                            </div>
                                         </div>
                                         <div className="col-span-2 flex justify-center">
                                            <div className="space-y-1">
                                               <p className="text-[8px] font-black uppercase text-gray-300 text-center">New Cost (R)</p>
                                               <input 
                                                type="number" 
                                                value={v.productionCost}
                                                onChange={(e) => handleUpdateCost(product.id, v.id, e.target.value)}
                                                className="w-full max-w-[80px] text-center py-1.5 rounded-lg border-2 border-gray-100 focus:border-jozi-gold/40 font-black text-xs outline-none"
                                               />
                                            </div>
                                         </div>
                                         <div className="col-span-2 text-center">
                                            <p className="text-[8px] font-black uppercase text-gray-300 mb-1">Margin</p>
                                            <span className="text-xs font-black text-emerald-500">{vMargin}%</span>
                                         </div>
                                         <div className="col-span-2 text-center">
                                            <p className="text-[8px] font-black uppercase text-gray-300 mb-1">Supplier Ref</p>
                                            <p className="text-[10px] font-bold text-jozi-forest truncate">{v.supplierRef || 'N/A'}</p>
                                         </div>
                                         <div className="col-span-1 text-right">
                                            <div className={`w-3 h-3 rounded-full ml-auto ${vStatus.color.split(' ')[0].replace('text', 'bg')}`} />
                                         </div>
                                      </div>
                                    );
                                  })}
                               </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Insights Row */}
        <div className="mt-12 pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex gap-10">
              <div className="text-left">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Portfolio Valuation</p>
                 <p className="text-4xl font-black text-jozi-forest tracking-tighter">R342,150 <span className="text-xs text-emerald-500 ml-1">+R12k today</span></p>
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Overall Gross Margin</p>
                 <p className="text-4xl font-black text-jozi-gold tracking-tighter">62.4% <span className="text-xs text-gray-300 ml-1">Ideal Range</span></p>
              </div>
           </div>

           <div className="flex items-center space-x-6 bg-jozi-dark p-6 rounded-4xl text-white shadow-2xl relative overflow-hidden group">
              <Zap className="absolute -bottom-6 -right-6 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform" />
              <div className="relative z-10 text-left">
                 <div className="flex items-center space-x-3 text-jozi-gold mb-1">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-[9px] font-black uppercase">Optimization Pulse</span>
                 </div>
                 <p className="text-xs font-medium text-jozi-cream/60 leading-relaxed italic max-w-xs">
                   "You have <span className="text-white font-bold">2 variants</span> with margins below 40%. Recommend reviewing supplier costs."
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* --- BULK MODAL --- */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBulkModal(false)} className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-xl rounded-5xl p-10 lg:p-12 shadow-2xl overflow-hidden text-left">
                <button onClick={() => setShowBulkModal(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-50 rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
                
                <div className="space-y-10">
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black text-jozi-forest uppercase tracking-tighter">Bulk Restock Sequence</h3>
                      <p className="text-gray-400 font-medium">Apply standard unit adjustments across multiple pieces in the vault.</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Selection Logic</label>
                         <select className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20">
                            <option>All Product Vault</option>
                            <option>Fashion Category Only</option>
                            <option>Critical Stock (Low) Items</option>
                         </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Quantity Increment</label>
                            <input type="number" defaultValue="10" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-2xl text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cost Adjustment (+/- %)</label>
                            <input type="number" placeholder="0" className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-black text-2xl text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20" />
                         </div>
                      </div>

                      <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start space-x-4">
                         <Info className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                         <p className="text-xs text-blue-800 font-medium leading-relaxed italic">
                           "This sequence will update <span className="font-bold">14 active items</span> and <span className="font-bold">22 variants</span>. Total valuation impact: +R24,500."
                         </p>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button onClick={() => setShowBulkModal(false)} className="grow py-5 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100">Cancel</button>
                      <button onClick={() => setShowBulkModal(false)} className="grow py-5 bg-jozi-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jozi-dark shadow-xl shadow-jozi-forest/20">Execute Batch</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryStockManager;
