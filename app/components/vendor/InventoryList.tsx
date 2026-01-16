
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  MoreVertical,
  Search,
  Filter,
  Download,
  Tag,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon,
  RefreshCw,
  Loader2
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { getMyProductsAction } from '@/app/actions/product';
import { IProduct } from '@/interfaces/product/product';
import { useToast } from '@/app/contexts/ToastContext';

interface InventoryListProps {
  onEdit: (product: any) => void;
}

// Transform IProduct to component format
interface DisplayProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  img: string;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    discountPrice?: number;
    stock: number;
    img: string;
  }>;
}

const InventoryList: React.FC<InventoryListProps> = ({ onEdit }) => {
  const { showError, showSuccess } = useToast();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [originalProducts, setOriginalProducts] = useState<IProduct[]>([]); // Store original IProduct data
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  // Transform IProduct to DisplayProduct format
  const transformProduct = (product: IProduct): DisplayProduct => {
    // Calculate total stock from variants
    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
    
    // Get first image URL
    const firstImage = product.images && product.images.length > 0 
      ? product.images[0].file 
      : 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=100';
    
    // Transform variants
    const transformedVariants = (product.variants || []).map(v => ({
      id: v.id || '',
      name: v.name,
      sku: v.sku,
      price: v.price || product.technicalDetails.regularPrice,
      discountPrice: v.discountPrice,
      stock: v.stock || 0,
      img: ''
    }));

    return {
      id: product.id || '',
      name: product.title,
      sku: product.sku,
      category: product.technicalDetails.categoryId, // Will display categoryId for now
      price: product.technicalDetails.regularPrice,
      stock: totalStock || 0,
      status: product.status,
      img: firstImage,
      variants: transformedVariants
    };
  };

  // Fetch products (current user's products only)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getMyProductsAction('Active'); // Fetch current user's active products
      if (response.error || !response.data) {
        throw new Error(response.message || 'Failed to fetch products');
      }
      
      // Store original IProduct data for editing
      setOriginalProducts(response.data);
      
      const transformedProducts = response.data.map(transformProduct);
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      showError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    fetchProducts();
    showSuccess('Products refreshed');
  };

  // Filter products by search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const getStockBadge = (count: number) => {
    if (count === 0) return <StatusBadge status="Out of Stock" className="bg-rose-50 text-rose-600 border-rose-100" />;
    if (count < 5) return <StatusBadge status="Low Stock" className="bg-orange-50 text-orange-600 border-orange-100" />;
    return <StatusBadge status="Healthy" className="bg-emerald-50 text-emerald-600 border-emerald-100" />;
  };

  return (
    <div className="space-y-8 text-left">
      <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100 overflow-hidden">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by SKU, name or category..." 
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
             <button 
               onClick={handleRefresh}
               disabled={loading}
               className={`p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-jozi-forest transition-all ${
                 loading ? 'opacity-50 cursor-not-allowed' : ''
               }`}
             >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
             </button>
             <button className="bg-jozi-forest text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-jozi-forest/10 hover:bg-jozi-dark transition-all">
                Bulk Actions ({selectedIds.length})
             </button>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 w-12">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-md border-gray-300 accent-jozi-forest"
                    onChange={(e) => setSelectedIds(e.target.checked ? filteredProducts.map(p => p.id) : [])}
                  />
                </th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Treasure Detail</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Identifier (SKU)</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Incentive Class</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Vault Status</th>
                <th className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Inventory Level</th>
                <th className="pb-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-widest">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="w-8 h-8 text-jozi-gold animate-spin" />
                      <p className="text-sm font-bold text-gray-400">Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Package className="w-12 h-12 text-gray-300" />
                      <p className="text-sm font-bold text-gray-400">
                        {searchQuery ? 'No products found matching your search' : 'No products found'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                const isExpanded = expandedRows.includes(product.id);
                return (
                  <React.Fragment key={product.id}>
                    <tr className={`group transition-colors ${isExpanded ? 'bg-jozi-cream/20' : 'hover:bg-gray-50/50'}`}>
                      <td className="py-6">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-5 h-5 rounded-md border-gray-300 accent-jozi-forest" 
                        />
                      </td>
                      <td className="py-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                            <img src={product.img} className="w-full h-full object-cover" alt={product.name} />
                          </div>
                          <div>
                            <p className="font-black text-jozi-forest text-sm leading-tight">{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 font-bold text-xs text-gray-400 font-mono">{product.sku}</td>
                      <td className="py-6 text-center">
                        <p className="font-black text-jozi-dark text-lg leading-none">R{product.price}</p>
                        <p className="text-[8px] font-bold text-gray-300 uppercase mt-1">Starting Price</p>
                      </td>
                      <td className="py-6">
                        <StatusBadge status={product.status} className={product.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'} />
                      </td>
                      <td className="py-6">
                         <div className="flex items-center space-x-3">
                           {getStockBadge(product.stock)}
                           <span className="text-xs font-black text-jozi-forest">{product.stock} Units</span>
                         </div>
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           {product.variants.length > 0 && (
                             <button 
                              onClick={() => toggleRow(product.id)}
                              className={`p-3 rounded-xl transition-all ${isExpanded ? 'bg-jozi-forest text-white' : 'bg-gray-100 text-gray-400 hover:text-jozi-forest'}`}
                             >
                               {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                             </button>
                           )}
                           <button 
                             onClick={() => {
                               // Find the original IProduct data
                               const originalProduct = originalProducts.find(p => p.id === product.id);
                               if (originalProduct) {
                                 onEdit(originalProduct);
                               } else {
                                 showError('Product data not found');
                               }
                             }} 
                             className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-jozi-forest shadow-sm"
                           >
                             <Edit3 className="w-4 h-4" />
                           </button>
                           <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                           <button className="p-3 text-gray-300"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Variant Rows */}
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-0 py-0 border-none">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-gray-50/50"
                            >
                              <div className="p-8 space-y-4">
                                <div className="flex items-center space-x-4 mb-4">
                                   <div className="w-8 h-8 bg-jozi-gold/10 rounded-lg flex items-center justify-center text-jozi-gold">
                                      <Layers className="w-4 h-4" />
                                   </div>
                                   <h4 className="text-xs font-black text-jozi-forest uppercase tracking-widest">Active Variations ({product.variants.length})</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                  {product.variants.map((variant) => (
                                    <div key={variant.id} className="bg-white p-5 rounded-[1.8rem] border border-gray-100 flex items-center justify-between shadow-sm group/v hover:shadow-md transition-all">
                                      <div className="flex items-center space-x-6">
                                         <div className="w-10 h-10 rounded-xl bg-jozi-cream flex items-center justify-center text-jozi-gold border border-jozi-gold/10">
                                            <ImageIcon className="w-4 h-4" />
                                         </div>
                                         <div className="min-w-[150px]">
                                            <p className="font-black text-sm text-jozi-dark">{variant.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">SKU: {variant.sku}</p>
                                         </div>
                                      </div>

                                      <div className="grid grid-cols-4 gap-8 grow max-w-2xl">
                                         <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Price Override</p>
                                            <p className="font-black text-sm text-jozi-forest">R{variant.price}</p>
                                         </div>
                                         <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Discount Price</p>
                                            {variant.discountPrice ? (
                                              <p className="font-black text-sm text-jozi-gold">R{variant.discountPrice}</p>
                                            ) : (
                                              <p className="text-xs text-gray-300 font-bold">—</p>
                                            )}
                                         </div>
                                         <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Unit Balance</p>
                                            <p className={`font-black text-sm ${variant.stock < 5 ? 'text-rose-500' : 'text-jozi-forest'}`}>{variant.stock}</p>
                                         </div>
                                         <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Variant Status</p>
                                            <div className="mt-1">{getStockBadge(variant.stock)}</div>
                                         </div>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                         <button className="p-2 bg-gray-50 text-gray-300 rounded-lg hover:text-jozi-forest hover:bg-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                                         <button className="px-4 py-2 bg-jozi-forest text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-jozi-dark transition-all">Restock</button>
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
      </div>
    </div>
  );
};

export default InventoryList;
