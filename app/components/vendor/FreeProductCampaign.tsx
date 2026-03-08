'use client';

import React, { useState, useEffect } from 'react';
import { Search, Package, AlertCircle, Loader2, CheckCircle, X } from 'lucide-react';
import { IProduct, IProductVariant } from '@/interfaces/product/product';
import { CustomResponse } from '@/interfaces/response';

// Types
interface ProductItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  imageUrl?: string;
  availableStock: number;
  price: number;
  variantId?: string | null;
  isVariant: boolean;
}

interface ProductTableProps {
  products: ProductItem[];
  loading: boolean;
  onSelectProduct: (product: ProductItem) => void;
  selectedProductId: string | null;
}

interface SelectionPanelProps {
  product: ProductItem | null;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onClear: () => void;
  error: string | null;
}

interface CampaignFormData {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

// Product Table Component
const ProductTable: React.FC<ProductTableProps> = ({ 
  products, 
  loading, 
  onSelectProduct, 
  selectedProductId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ProductItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof ProductItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Package className="w-12 h-12 text-gray-300" />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">No Products Found</p>
            <p className="text-xs text-gray-500 mt-1">Add products to your inventory to create campaigns.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('sku')}
              >
                SKU {sortField === 'sku' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('availableStock')}
              >
                Available Stock {sortField === 'availableStock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No products match your search.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedProductId === product.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900 font-mono">{product.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.isVariant 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {product.isVariant ? 'Variant' : 'Product'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      product.availableStock < 10 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {product.availableStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">
                      R {product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectProduct(product)}
                      disabled={selectedProductId === product.id}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        selectedProductId === product.id
                          ? 'bg-blue-600 text-white cursor-default'
                          : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {selectedProductId === product.id ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Selection Panel Component
const SelectionPanel: React.FC<SelectionPanelProps> = ({
  product,
  quantity,
  onQuantityChange,
  onClear,
  error
}) => {
  if (!product) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No product selected</p>
          <p className="text-xs text-gray-400 mt-1">Select a product from the table above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Selected Product
        </h3>
        <button
          onClick={onClear}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-gray-200">
        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-gray-900 mb-1">{product.name}</h4>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">SKU:</span> <span className="font-mono">{product.sku}</span>
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>{' '}
              <span className={`font-semibold ${product.isVariant ? 'text-purple-600' : 'text-blue-600'}`}>
                {product.isVariant ? 'Variant' : 'Product'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Available Stock:</span>{' '}
              <span className="font-semibold text-gray-900">{product.availableStock}</span>
            </div>
            <div>
              <span className="text-gray-500">Price:</span>{' '}
              <span className="font-semibold text-gray-900">R {product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-semibold text-gray-900 mb-2">
          Campaign Quantity *
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          max={product.availableStock}
          value={quantity || ''}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
          placeholder="Enter quantity to allocate"
          className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        <p className="text-xs text-gray-500 mt-2">
          Must be between 1 and {product.availableStock}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Note: Points required will be set by admin during approval
        </p>
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

// Main Component
interface FreeProductCampaignProps {
  onSubmit: (data: CampaignFormData) => Promise<void>;
  onCancel?: () => void;
  fetchProducts: (status?: string) => Promise<CustomResponse<IProduct[]>>;
}

export const FreeProductCampaign: React.FC<FreeProductCampaignProps> = ({ 
  onSubmit,
  onCancel,
  fetchProducts
}) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Convert API products to ProductItems (including variants)
  const convertToProductItems = (apiProducts: IProduct[]): ProductItem[] => {
    const items: ProductItem[] = [];
    
    apiProducts.forEach(product => {
      // Only include active products
      if (product.status !== 'Active') return;
      
      // If product has variants, add each variant
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          if (variant.status === 'Active' && variant.stock > 0) {
            items.push({
              id: variant.id || `${product.id}-${variant.sku}`,
              productId: product.id || '',
              variantId: variant.id,
              name: `${product.title} - ${variant.name}`,
              sku: variant.sku,
              imageUrl: product.images?.[0]?.file,
              availableStock: variant.inventory?.quantityAvailable || variant.stock,
              price: variant.discountPrice || variant.price,
              isVariant: true,
            });
          }
        });
      } else {
        // Product without variants
        const stock = product.inventory?.quantityAvailable || product.technicalDetails.initialStock || 0;
        if (stock > 0) {
          items.push({
            id: product.id || '',
            productId: product.id || '',
            variantId: null,
            name: product.title,
            sku: product.sku,
            imageUrl: product.images?.[0]?.file,
            availableStock: stock,
            price: product.technicalDetails.discountPrice || product.technicalDetails.regularPrice,
            isVariant: false,
          });
        }
      }
    });
    
    return items;
  };

  // Fetch vendor products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts('Active');
        
        if (response.error || !response.data) {
          setError(response.message || 'Failed to fetch products');
          setProducts([]);
        } else {
          const productItems = convertToProductItems(response.data);
          setProducts(productItems);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err?.message || 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProducts]);

  // Handle product selection
  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setQuantity(0);
    setError(null);
    setSuccess(false);
  };

  // Handle quantity change with validation
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    setError(null);
    
    if (selectedProduct) {
      if (newQuantity <= 0) {
        setError('Quantity must be greater than 0');
      } else if (newQuantity > selectedProduct.availableStock) {
        setError(`Quantity cannot exceed available stock (${selectedProduct.availableStock})`);
      }
    }
  };

  // Clear selection
  const handleClear = () => {
    setSelectedProduct(null);
    setQuantity(0);
    setError(null);
    setSuccess(false);
  };

  // Validate form
  const isFormValid = () => {
    return (
      selectedProduct !== null &&
      quantity > 0 &&
      quantity <= selectedProduct.availableStock &&
      !error
    );
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedProduct || !isFormValid()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        productId: selectedProduct.productId,
        variantId: selectedProduct.variantId,
        quantity
      });
      
      setSuccess(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        handleClear();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting campaign:', err);
      setError('Failed to submit campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Products Table */}
      <ProductTable
        products={products}
        loading={loading}
        onSelectProduct={handleSelectProduct}
        selectedProductId={selectedProduct?.id || null}
      />

      {/* Selection Panel */}
      <SelectionPanel
        product={selectedProduct}
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        onClear={handleClear}
        error={error}
      />

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedProduct ? (
              <span>
                Ready to allocate <strong>{quantity}</strong> unit{quantity !== 1 ? 's' : ''} of <strong>{selectedProduct.name}</strong>
              </span>
            ) : (
              <span>Select a product and enter quantity to continue</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {onCancel && (
              <button
                onClick={onCancel}
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || submitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Success!</span>
                </>
              ) : (
                <span>Enroll in Campaign</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeProductCampaign;
