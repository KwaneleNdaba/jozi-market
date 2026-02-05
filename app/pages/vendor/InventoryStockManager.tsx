import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Package, 
  AlertTriangle, 
  MoreHorizontal,
  RefreshCcw,
  Truck,
  ClipboardList,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  ArrowRight,
  Loader2,
  PackageX
} from 'lucide-react';

// --- Imports from your project ---
import { getMyProductsAction } from '@/app/actions/product';
import { IProduct } from '@/interfaces/product/product';
import { useToast } from '@/app/contexts/ToastContext';
import {
  getMovementsByVariantAction,
  getMovementsByProductAction,
  restockAction,
  adjustInventoryAction,
  getInventoryByVariantAction,
  getInventoryByProductAction,
} from '@/app/actions/inventory';
import { InventoryMovementType, AdjustmentReasonType } from '@/interfaces/inventory/inventory';

// --- Types ---

interface DisplayVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  warehouseLocation?: string; // Optional if you track loc per variant
}

interface DisplayProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  totalStock: number;
  stockReserved: number; // Added to match stats logic
  reorderLevel: number;
  img: string;
  warehouseLocation: string;
  variantCount: number;
  variants: DisplayVariant[];
  originalData: IProduct; // Keep ref to original for editing
}

interface MovementLog {
  id: string;
  date: string;
  type: InventoryMovementType;
  quantity: number;
  reason: string;
  reference: string;
  productName?: string;
}



const InventoryManagementUI: React.FC = () => {
  const { showError, showSuccess } = useToast();
  
  // --- State ---
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Modal State
  const [selectedContext, setSelectedContext] = useState<{ product: DisplayProduct, variant?: DisplayVariant } | null>(null);
  const [actionType, setActionType] = useState<'restock' | 'adjust' | null>(null);
  
  // Movement State
  const [movements, setMovements] = useState<MovementLog[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [selectedProductForMovements, setSelectedProductForMovements] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    quantity: 0,
    costPerUnit: 0,
    supplierName: '',
    reason: AdjustmentReasonType.AUDIT_CORRECTION,
  });
  const [submitting, setSubmitting] = useState(false);

  // --- Logic: Data Transformation ---
  const transformProduct = (product: IProduct): DisplayProduct => {
    const hasVariants = product.variants && product.variants.length > 0;
    
    // Calculate totals
    const totalStock = hasVariants
      ? product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0
      : (product.technicalDetails.initialStock || 0);

    const displayPrice = product.technicalDetails.regularPrice;

    // Transform variants
    const transformedVariants: DisplayVariant[] = (product.variants || []).map(v => ({
      id: v.id || Math.random().toString(),
      name: v.name,
      sku: v.sku,
      price: v.price || displayPrice,
      stock: v.stock || 0,
      warehouseLocation: 'A-01' // Placeholder or fetch from backend
    }));

    return {
      id: product.id || '',
      name: product.title,
      sku: product.sku,
      category: product.technicalDetails.categoryId, 
      price: displayPrice,
      totalStock,
      stockReserved: 0, // You'll need to fetch this from an Order/Cart service eventually
      reorderLevel: 10, // Default or fetch from backend
      warehouseLocation: 'Main Vault',
      variantCount: transformedVariants.length,
      img: product.images?.[0]?.file || 'https://via.placeholder.com/150',
      variants: transformedVariants,
      originalData: product
    };
  };

  // --- Fetching ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getMyProductsAction('Active');
      if (response.error || !response.data) throw new Error(response.message || 'Failed');
      setProducts(response.data.map(transformProduct));
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch movements for all products when tab changes
  useEffect(() => {
    if (activeTab === 'movements' && products.length > 0) {
      fetchAllMovements();
    }
  }, [activeTab, products]);

  // --- Fetch Movements ---
  const fetchAllMovements = async () => {
    setLoadingMovements(true);
    try {
      const allMovements: MovementLog[] = [];
      
      for (const product of products) {
        if (product.variants.length > 0) {
          // Fetch movements for each variant
          for (const variant of product.variants) {
            const response = await getMovementsByVariantAction(variant.id, 20);
            if (!response.error && response.data) {
              const transformedMovements = response.data.map((m) => ({
                id: m.id || Math.random().toString(),
                date: new Date(m.createdAt || new Date()).toLocaleString(),
                type: m.type as InventoryMovementType,
                quantity: m.quantity,
                reason: m.reason,
                reference: m.referenceId || 'N/A',
                productName: `${product.name} - ${variant.name}`,
              }));
              allMovements.push(...transformedMovements);
            }
          }
        } else {
          // Fetch movements for product
          const response = await getMovementsByProductAction(product.id, 20);
          if (!response.error && response.data) {
            const transformedMovements = response.data.map((m) => ({
              id: m.id || Math.random().toString(),
              date: new Date(m.createdAt || new Date()).toLocaleString(),
              type: m.type as InventoryMovementType,
              quantity: m.quantity,
              reason: m.reason,
              reference: m.referenceId || 'N/A',
              productName: product.name,
            }));
            allMovements.push(...transformedMovements);
          }
        }
      }
      
      // Sort by most recent
      allMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMovements(allMovements.slice(0, 50)); // Limit to 50 most recent
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoadingMovements(false);
    }
  };

  // --- Stats Calculation (Dynamic) ---
  const stats = useMemo(() => {
    let totalValue = 0;
    let lowStockCount = 0;
    let reservedUnits = 0;

    products.forEach(p => {
      // Calculate Value
      if (p.variants.length > 0) {
        p.variants.forEach(v => {
          totalValue += (v.stock * v.price);
          if (v.stock <= p.reorderLevel) lowStockCount++; // Count low stock variants
        });
      } else {
        totalValue += (p.totalStock * p.price);
        if (p.totalStock <= p.reorderLevel) lowStockCount++;
      }
      reservedUnits += p.stockReserved;
    });

    return { totalValue, lowStockCount, reservedUnits };
  }, [products]);

  // --- Helpers ---
  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const getStockStatus = (count: number) => {
    if (count === 0) return 'Out of Stock';
    if (count < 10) return 'Low Stock'; // Hardcoded 10 for demo, use p.reorderLevel in real app
    return 'In Stock';
  };

  const StockIndicator = ({ count }: { count: number }) => {
    const status = getStockStatus(count);
    const color = status === 'Out of Stock' ? 'text-rose-600 bg-rose-50 border-rose-100' 
                : status === 'Low Stock' ? 'text-amber-600 bg-amber-50 border-amber-100'
                : 'text-emerald-600 bg-emerald-50 border-emerald-100';
    
    return (
      <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg border ${color}`}>
        <span className="text-xs font-black uppercase tracking-wide">{count} Units</span>
      </div>
    );
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handle Modal Open ---
  const openModal = (context: { product: DisplayProduct, variant?: DisplayVariant }, type: 'restock' | 'adjust') => {
    setSelectedContext(context);
    setActionType(type);
    // Reset form
    setFormData({
      quantity: 0,
      costPerUnit: context.variant?.price || context.product.price,
      supplierName: '',
      reason: AdjustmentReasonType.AUDIT_CORRECTION,
    });
  };

  // --- Handle Form Submission ---
  const handleSubmit = async () => {
    if (!selectedContext || !actionType) return;
    
    if (formData.quantity === 0) {
      showError('Quantity cannot be zero');
      return;
    }

    setSubmitting(true);
    try {
      const isVariant = !!selectedContext.variant;
      const productVariantId = isVariant ? selectedContext.variant!.id : null;
      const productId = !isVariant ? selectedContext.product.id : null;

      if (actionType === 'restock') {
        const response = await restockAction({
          productVariantId,
          productId,
          quantityAdded: formData.quantity,
          costPerUnit: formData.costPerUnit,
          supplierName: formData.supplierName || 'Manual',
        });

        if (response.error) {
          showError(response.message);
        } else {
          showSuccess('Stock restocked successfully');
          setSelectedContext(null);
          setActionType(null);
          fetchProducts(); // Refresh products
        }
      } else {
        // Adjust
        const response = await adjustInventoryAction({
          productVariantId,
          productId,
          quantityDelta: formData.quantity,
          reason: formData.reason,
        });

        if (response.error) {
          showError(response.message);
        } else {
          showSuccess('Inventory adjusted successfully');
          setSelectedContext(null);
          setActionType(null);
          fetchProducts(); // Refresh products
        }
      }
    } catch (err: any) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Command</h1>
            <p className="text-slate-500 mt-1">Manage stock levels, locations, and movements.</p>
          </div>
          <div className="flex gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter inventory..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all w-64" 
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                <Truck className="w-4 h-4" />
                <span>Purchase Order</span>
             </button>
          </div>
        </div>

        {/* --- High Level Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Asset Value</p>
              <p className="text-2xl font-bold mt-1 text-slate-900">R{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Reserved Units</p>
              <p className="text-2xl font-bold mt-1 text-slate-900">{stats.reservedUnits}</p>
              <p className="text-[10px] text-gray-400 mt-1">Pending in Active Carts</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between ring-1 ring-amber-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600/70">Reorder Alert</p>
              <p className="text-2xl font-bold mt-1 text-amber-600">{stats.lowStockCount} Items</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          
          {/* Tabs */}
          <div className="border-b border-gray-100 px-8 flex gap-8">
            <button 
              onClick={() => setActiveTab('stock')}
              className={`py-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'stock' ? 'text-slate-900 border-slate-900' : 'text-gray-400 border-transparent hover:text-slate-600'}`}
            >
              Current Stock
            </button>
            <button 
              onClick={() => setActiveTab('movements')}
              className={`py-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'movements' ? 'text-slate-900 border-slate-900' : 'text-gray-400 border-transparent hover:text-slate-600'}`}
            >
              Movement History
            </button>
          </div>

          <div className="p-0">
            {activeTab === 'stock' ? (
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="py-5 pl-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Entity</th>
                      <th className="py-5 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</th>
                      <th className="py-5 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Unit Price</th>
                      <th className="py-5 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Global Stock</th>
                      <th className="py-5 px-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right pr-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300"/></td></tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-bold">No products found.</td></tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const isExpanded = expandedRows.includes(product.id);
                        const hasVariants = product.variantCount > 0;

                        return (
                          <React.Fragment key={product.id}>
                            {/* Parent Row */}
                            <tr className={`group transition-all ${isExpanded ? 'bg-amber-50/30' : 'hover:bg-gray-50'}`}>
                              <td className="py-5 pl-8">
                                <div className="flex items-center space-x-4">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-white">
                                    <img src={product.img} className="w-full h-full object-cover" alt={product.name} />
                                    {hasVariants && <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-400" />}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900 text-sm leading-tight">{product.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold font-mono mt-1">{product.sku}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-4">
                                <div className="flex items-center gap-2 text-gray-500">
                                   <MapPin className="w-3.5 h-3.5" />
                                   <span className="text-xs font-bold">{product.warehouseLocation}</span>
                                </div>
                              </td>
                              <td className="py-5 px-4 text-center">
                                <span className="font-bold text-slate-900">R{product.price}</span>
                              </td>
                              <td className="py-5 px-4">
                                 <div className="flex items-center gap-2">
                                   <StockIndicator count={product.totalStock} />
                                   {hasVariants && (
                                     <span className="text-[10px] font-bold text-gray-400 px-2 py-1 bg-gray-100 rounded-md">
                                       {product.variantCount} VAR
                                     </span>
                                   )}
                                 </div>
                              </td>
                              <td className="py-5 px-4 pr-8">
                                <div className="flex items-center justify-end gap-2">
                                  {hasVariants ? (
                                    <button 
                                      onClick={() => toggleRow(product.id)}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                                        isExpanded 
                                        ? 'bg-slate-900 text-white border-slate-900' 
                                        : 'bg-white text-slate-600 border-gray-200 hover:border-slate-400'
                                      }`}
                                    >
                                      <Layers className="w-3.5 h-3.5" />
                                      <span>{isExpanded ? 'Close' : 'Variants'}</span>
                                      {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                                    </button>
                                  ) : (
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => { setSelectedContext({ product }); setActionType('adjust'); }}
                                        className="p-2 text-gray-400 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-colors"
                                      >
                                        <RefreshCcw className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => { setSelectedContext({ product }); setActionType('restock'); }}
                                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                                      >
                                        Restock
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Expanded Variant Row */}
                            <AnimatePresence>
                              {isExpanded && hasVariants && (
                                <tr>
                                  <td colSpan={5} className="p-0 border-none">
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="bg-gray-50/50 border-b border-gray-100 shadow-inner"
                                    >
                                      <div className="py-6 px-8 pl-24">
                                        <div className="flex items-center gap-3 mb-4 opacity-50">
                                           <ArrowRight className="w-4 h-4 text-slate-400" />
                                           <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Variant Breakdown</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-3">
                                           {product.variants.map((variant) => (
                                             <div key={variant.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-amber-200 transition-colors">
                                                <div className="flex items-center gap-6 w-1/3">
                                                   <div className="w-2 h-2 rounded-full bg-amber-400" />
                                                   <div>
                                                      <p className="text-sm font-black text-slate-800">{variant.name}</p>
                                                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">{variant.sku}</p>
                                                   </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-12">
                                                   <div>
                                                      <p className="text-[9px] font-bold text-gray-400 uppercase">Override Price</p>
                                                      <p className="text-sm font-bold text-slate-700">R{variant.price}</p>
                                                   </div>
                                                   <div className="w-32">
                                                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Stock Level</p>
                                                      <StockIndicator count={variant.stock} />
                                                   </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                   <button 
                                                      onClick={() => { setSelectedContext({ product, variant }); setActionType('adjust'); }}
                                                      className="p-2 text-gray-300 hover:text-slate-600 hover:bg-gray-50 rounded-lg transition-all"
                                                      title="Adjust"
                                                   >
                                                      <Edit3 className="w-3.5 h-3.5" />
                                                   </button>
                                                   <button 
                                                      onClick={() => { setSelectedContext({ product, variant }); setActionType('restock'); }}
                                                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-slate-900/10"
                                                   >
                                                      Restock
                                                   </button>
                                                </div>
                                             </div>
                                           ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              // Movements Tab Content
              <div className="space-y-4 p-8">
                {loadingMovements ? (
                  <div className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300"/>
                    <p className="text-sm text-gray-400 mt-4">Loading movements...</p>
                  </div>
                ) : movements.length === 0 ? (
                  <div className="py-20 text-center text-gray-400">
                    <PackageX className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="font-bold">No movements recorded yet.</p>
                  </div>
                ) : (
                  <>
                    {movements.map((move) => (
                      <div key={move.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                         <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                             move.type === 'IN' ? 'bg-emerald-100 text-emerald-600' :
                             move.type === 'OUT' ? 'bg-rose-100 text-rose-600' :
                             'bg-amber-100 text-amber-600'
                           }`}>
                              {move.type === 'IN' && <ArrowDownLeft className="w-5 h-5" />}
                              {move.type === 'OUT' && <ArrowUpRight className="w-5 h-5" />}
                              {move.type === 'ADJUSTMENT' && <RefreshCcw className="w-4 h-4" />}
                              {move.type === 'RETURN' && <History className="w-4 h-4" />}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900">{move.reason}</p>
                              {move.productName && (
                                <p className="text-xs text-gray-500 mt-0.5">{move.productName}</p>
                              )}
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className="text-[10px] bg-white border border-gray-200 px-1.5 rounded text-gray-500 font-mono">{move.reference}</span>
                                 <span className="text-[10px] text-gray-400">• {move.date}</span>
                              </div>
                           </div>
                         </div>
                         <div className="text-right">
                            <span className={`text-sm font-black ${
                               move.quantity > 0 ? 'text-emerald-600' : 'text-slate-900'
                            }`}>
                               {move.quantity > 0 ? '+' : ''}{move.quantity}
                            </span>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Units</p>
                         </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Smart Action Drawer/Modal --- */}
      <AnimatePresence>
        {selectedContext && actionType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { setSelectedContext(null); setActionType(null); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 10 }} 
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <button onClick={() => { setSelectedContext(null); setActionType(null); }} className="absolute top-6 right-6 text-gray-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 ${
                   actionType === 'restock' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                 }`}>
                    {actionType === 'restock' ? <ArrowDownLeft className="w-3 h-3" /> : <RefreshCcw className="w-3 h-3" />}
                    {actionType === 'restock' ? 'Incoming Stock' : 'Manual Adjustment'}
                 </span>
                 <h2 className="text-xl font-bold text-slate-900">
                   {selectedContext.product.name}
                 </h2>
                 {selectedContext.variant && (
                   <p className="text-sm font-semibold text-slate-600">{selectedContext.variant.name} ({selectedContext.variant.sku})</p>
                 )}
                 <p className="text-xs text-gray-400 font-medium mt-1">
                   Current Stock: <span className="text-slate-900 font-bold">
                     {selectedContext.variant ? selectedContext.variant.stock : selectedContext.product.totalStock}
                   </span>
                 </p>
              </div>

              <div className="space-y-5">
                {/* Dynamic Fields based on Action Type */}
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">
                      {actionType === 'restock' ? 'Quantity to Add' : 'Quantity Change (+/-)'}
                   </label>
                   <input 
                    type="number" 
                    placeholder="0"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full text-2xl font-black p-4 bg-gray-50 border-2 border-transparent focus:border-slate-200 rounded-xl outline-none transition-all" 
                   />
                </div>

                {actionType === 'restock' ? (
                   <>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase">Unit Cost (R)</label>
                           <input 
                            type="number"
                            value={formData.costPerUnit || ''}
                            onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase">Supplier Ref</label>
                           <input 
                             type="text" 
                             placeholder="PO-..."
                             value={formData.supplierName}
                             onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                             className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                           />
                        </div>
                     </div>
                     <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="text-xs text-emerald-800 leading-relaxed">This will create an <strong>IN</strong> movement and update the average cost if price differs.</p>
                     </div>
                   </>
                ) : (
                  <>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase">Reason Code</label>
                       <select 
                         className="w-full p-3 bg-white border border-gray-200 rounded-xl font-medium text-sm outline-none focus:border-amber-500"
                         value={formData.reason}
                         onChange={(e) => setFormData({ ...formData, reason: e.target.value as AdjustmentReasonType })}
                       >
                          <option value={AdjustmentReasonType.AUDIT_CORRECTION}>{AdjustmentReasonType.AUDIT_CORRECTION}</option>
                          <option value={AdjustmentReasonType.DAMAGED_STOCK}>{AdjustmentReasonType.DAMAGED_STOCK}</option>
                          <option value={AdjustmentReasonType.FOUND_INVENTORY}>{AdjustmentReasonType.FOUND_INVENTORY}</option>
                          <option value={AdjustmentReasonType.INTERNAL_USE}>{AdjustmentReasonType.INTERNAL_USE}</option>
                          <option value={AdjustmentReasonType.THEFT_LOSS}>{AdjustmentReasonType.THEFT_LOSS}</option>
                          <option value={AdjustmentReasonType.EXPIRED_STOCK}>{AdjustmentReasonType.EXPIRED_STOCK}</option>
                          <option value={AdjustmentReasonType.QUALITY_CONTROL}>{AdjustmentReasonType.QUALITY_CONTROL}</option>
                          <option value={AdjustmentReasonType.OTHER}>{AdjustmentReasonType.OTHER}</option>
                       </select>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                       <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                       <p className="text-xs text-amber-800 leading-relaxed">Manual adjustments affect financial reporting. Please ensure a valid reference ID is provided.</p>
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                   <button 
                     onClick={() => { setSelectedContext(null); setActionType(null); }}
                     disabled={submitting}
                     className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleSubmit}
                     disabled={submitting}
                     className={`flex-1 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      actionType === 'restock' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                     }`}
                   >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting ? 'Processing...' : `Confirm ${actionType === 'restock' ? 'Restock' : 'Adjustment'}`}
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

export default InventoryManagementUI;