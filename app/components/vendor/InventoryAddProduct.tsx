
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ArrowLeft, 
  Plus, 
  Image as ImageIcon, 
  Sparkles, 
  Zap, 
  Tag, 
  Package, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Wand2,
  Trash2,
  ArrowUpRight,
  Upload,
  Box,
  Ruler,
  Hammer,
  Truck,
  Quote,
  Video,
  Loader2,
  Info
} from 'lucide-react';
import SectionHeader from '../SectionHeader';
import { getAllCategoriesAction, getSubcategoriesByCategoryIdAction } from '@/app/actions/category';
import { getCategoryAttributesByCategoryIdAction } from '@/app/actions/category-attribute';
import { ICategory } from '@/interfaces/category/category';
import { ICategoryAttribute } from '@/interfaces/attribute/attribute';
import { createBulkProductAttributeValuesAction } from '@/app/actions/product-attribute-value';
import { ICreateBulkProductAttributeValue } from '@/interfaces/product-attribute-value/productAttributeValue';
import { createProductAction, updateProductAction } from '@/app/actions/product';
import { uploadFilesAction } from '@/app/actions/file';
import { useToast } from '@/app/contexts/ToastContext';
import { ICreateProduct, IProduct, IUpdateProduct } from '@/interfaces/product/product';

interface InventoryAddProductProps {
  onCancel: () => void;
  product?: IProduct; // Optional product for editing
}

interface ProductFormData {
  title: string;
  description: string;
  sku: string;
  status: string;
  technicalDetails: {
    categoryId: string;
    subcategoryId: string;
    attributes: Record<string, string>; // attributeId -> value
    regularPrice: number;
    discountPrice?: number;
    initialStock?: number;
  };
  images: (File | null)[];
  video: File | null;
  variants: Array<{
    id?: number | string; // Local numeric ID for React key, or DB ID when editing
    variantId?: string; // Database ID for existing variants
    name: string;
    sku: string;
    price?: string;
    discountPrice?: string;
    stock: string;
    status: string;
  }>;
}

const InventoryAddProduct: React.FC<InventoryAddProductProps> = ({ onCancel, product }) => {
  const isEditMode = !!product;
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState(1);
  const [variants, setVariants] = useState<Array<{
    id: number | string;
    variantId?: string;
    name: string;
    sku: string;
    price: string;
    discountPrice: string;
    stock: string;
    status: string;
  }>>([{ id: 1, name: '', sku: '', price: '', discountPrice: '', stock: '', status: 'Active' }]);
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Store existing image URLs when editing
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Store existing video URL when editing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Categories & Subcategories
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');

  // Attributes
  const [categoryAttributes, setCategoryAttributes] = useState<ICategoryAttribute[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [attributeValues, setAttributeValues] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    sku: '',
    status: 'Active',
    technicalDetails: {
      categoryId: '',
      subcategoryId: '',
      attributes: {},
      regularPrice: 0,
      discountPrice: undefined,
      initialStock: undefined
    },
    images: [null, null, null, null],
    video: null,
    variants: []
  });
  
  // Artisan Notes State - REMOVED (no longer needed)

  // Populate form when editing
  useEffect(() => {
    if (product) {
      // Populate basic fields
      setFormData({
        title: product.title,
        description: product.description,
        sku: product.sku,
        status: product.status,
        technicalDetails: {
          categoryId: product.technicalDetails.categoryId,
          subcategoryId: product.technicalDetails.subcategoryId || '',
          attributes: {},
          regularPrice: product.technicalDetails.regularPrice,
          discountPrice: product.technicalDetails.discountPrice
        },
        images: [null, null, null, null],
        video: null,
        variants: []
      });

      // Set category first - this will trigger subcategory fetch
      setSelectedCategoryId(product.technicalDetails.categoryId);

      // Populate variants
      if (product.variants && product.variants.length > 0) {
        const transformedVariants = product.variants.map((v, idx) => ({
          id: idx + 1, // Local ID for React key
          variantId: v.id, // Preserve database ID
          name: v.name,
          sku: v.sku,
          price: v.price?.toString() || '',
          discountPrice: v.discountPrice?.toString() || '',
          stock: v.stock.toString(),
          status: v.status
        }));
        setVariants(transformedVariants);
      }

      // Store existing image URLs
      if (product.images && product.images.length > 0) {
        const urls: string[] = [];
        // Sort images by index and fill array
        const sortedImages = [...product.images].sort((a, b) => a.index - b.index);
        sortedImages.forEach(img => {
          urls[img.index] = img.file;
        });
        // Fill remaining slots with empty strings
        while (urls.length < 4) {
          urls.push('');
        }
        setImageUrls(urls);
        // Fill images array with nulls (user can replace them)
        setImages([null, null, null, null]);
      } else {
        setImageUrls(['', '', '', '']);
      }

      // Store existing video URL
      if (product.video?.file) {
        setVideoUrl(product.video.file);
      }

      // Populate attribute values from technicalDetails.attributes
      if (product.technicalDetails.attributes) {
        const attrValues: Record<string, string> = {};
        product.technicalDetails.attributes.forEach(attr => {
          attrValues[attr.attributeId] = attr.value;
        });
        setAttributeValues(attrValues);
      }
    }
  }, [product]);

  // Fetch categories on mount - using category actions
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await getAllCategoriesAction('Active');
        if (!response.error && response.data) {
          // Filter only top-level categories (categoryId === null)
          const topLevelCategories = response.data.filter(cat => cat.categoryId === null);
          setCategories(topLevelCategories);
        } else if (response.error) {
          console.error('Error fetching categories:', response.message);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category is selected - using category actions
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await getSubcategoriesByCategoryIdAction(selectedCategoryId);
          if (!response.error && response.data) {
            setSubcategories(response.data);
            
            // If editing and product has a subcategory, set it (but only if it's the first time loading)
            if (product && product.technicalDetails.subcategoryId && !selectedSubcategoryId) {
              const subcategoryExists = response.data.some(sub => sub.id === product.technicalDetails.subcategoryId);
              if (subcategoryExists) {
                setSelectedSubcategoryId(product.technicalDetails.subcategoryId);
              }
            } else if (!product) {
              // Only reset if not editing
              setSelectedSubcategoryId('');
              setCategoryAttributes([]);
              setAttributeValues({});
              setFormData(prev => ({
                ...prev,
                technicalDetails: {
                  ...prev.technicalDetails,
                  subcategoryId: '',
                  attributes: {}
                }
              }));
            }
          } else if (response.error) {
            console.error('Error fetching subcategories:', response.message);
          }
        } catch (err) {
          console.error('Error fetching subcategories:', err);
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
      setSelectedSubcategoryId('');
      setCategoryAttributes([]);
      setAttributeValues({});
      // Clear subcategoryId in formData
      setFormData(prev => ({
        ...prev,
        technicalDetails: {
          ...prev.technicalDetails,
          categoryId: '',
          subcategoryId: '',
          attributes: {}
        }
      }));
    }
  }, [selectedCategoryId, product]);

  // Fetch attributes when subcategory is selected - using category-attribute actions
  // Attributes are linked to subcategoryId (not top-level category)
  useEffect(() => {
    if (selectedSubcategoryId) {
      const fetchAttributes = async () => {
        setLoadingAttributes(true);
        try {
          // Fetch attributes linked to the selected subcategory
          const response = await getCategoryAttributesByCategoryIdAction(selectedSubcategoryId);
          if (!response.error && response.data) {
            setCategoryAttributes(response.data);
            
            // If editing and product has attribute values, preserve them
            if (product && product.technicalDetails.attributes && product.technicalDetails.attributes.length > 0) {
              const existingValues: Record<string, string> = {};
              // First, initialize all attributes with empty strings
              response.data.forEach(catAttr => {
                existingValues[catAttr.attributeId] = '';
              });
              // Then, populate with existing values from product
              product.technicalDetails.attributes.forEach(attr => {
                if (existingValues.hasOwnProperty(attr.attributeId)) {
                  existingValues[attr.attributeId] = attr.value;
                }
              });
              setAttributeValues(existingValues);
            } else {
              // Initialize attribute values with empty strings
              const initialValues: Record<string, string> = {};
              response.data.forEach(catAttr => {
                initialValues[catAttr.attributeId] = '';
              });
              setAttributeValues(initialValues);
            }
            
            // Update formData with subcategoryId
            setFormData(prev => ({
              ...prev,
              technicalDetails: {
                ...prev.technicalDetails,
                subcategoryId: selectedSubcategoryId
              }
            }));
          } else if (response.error) {
            console.error('Error fetching attributes:', response.message);
            setCategoryAttributes([]);
            setAttributeValues({});
          }
        } catch (err) {
          console.error('Error fetching attributes:', err);
          setCategoryAttributes([]);
          setAttributeValues({});
        } finally {
          setLoadingAttributes(false);
        }
      };
      fetchAttributes();
    } else {
      setCategoryAttributes([]);
      setAttributeValues({});
      // Clear attributes in formData
      setFormData(prev => ({
        ...prev,
        technicalDetails: {
          ...prev.technicalDetails,
          subcategoryId: '',
          attributes: {}
        }
      }));
    }
  }, [selectedSubcategoryId, product]);

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: '', sku: '', price: '', discountPrice: '', stock: '', status: 'Active' }]);
  };

  const removeVariant = (id: number | string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleVideoChange = (file: File | null) => {
    setVideo(file);
    setFormData(prev => ({
      ...prev,
      video: file
    }));
  };

  const handleAttributeChange = (attributeId: string, value: string) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: value
    }));
    setFormData(prev => ({
      ...prev,
      technicalDetails: {
        ...prev.technicalDetails,
        attributes: {
          ...prev.technicalDetails.attributes,
          [attributeId]: value
        }
      }
    }));
  };


  const handleSubmit = async () => {
    console.log('[Submit] Current variants state:', JSON.stringify(variants, null, 2));
    console.log('[Submit] Variants count:', variants.length);

    // Validate required fields
    if (!formData.title || !formData.sku || !selectedCategoryId || !selectedSubcategoryId) {
      showError('Please fill in all required fields (Title, SKU, Category, and Subcategory)');
      return;
    }

    if (!formData.description) {
      showError('Please provide a product description');
      return;
    }

    // Validate pricing: Either product has a regular price OR variants have prices
    const validVariants = variants.filter(v => v.name.trim() !== '' && v.sku.trim() !== '');
    const hasVariantPricing = validVariants.length > 0 && validVariants.some(v => v.price && parseFloat(v.price.toString()) > 0);
    const hasProductPricing = formData.technicalDetails.regularPrice > 0;

    if (!hasProductPricing && !hasVariantPricing) {
      showError('Please set either a product regular price or variant prices');
      return;
    }

    // Clear variant prices if product has a regular price set
    // (variants will use the product price instead)
    if (formData.technicalDetails.regularPrice > 0) {
      const clearedVariants = variants.map(v => ({
        ...v,
        price: '', // Clear variant-specific prices
        discountPrice: '' // Clear variant-specific discounts
      }));
      setVariants(clearedVariants);
    }

    // Validate initialStock if no variants
    if (validVariants.length === 0) {
      if (!formData.technicalDetails.initialStock || formData.technicalDetails.initialStock < 0) {
        showError('Please set initial stock for products without variants');
        return;
      }
    }

    // Check if at least one image is uploaded or exists (for editing)
    const uploadedImages = images.filter(img => img !== null && img instanceof File);
    const hasExistingImages = isEditMode && imageUrls.some(url => url && url.trim() !== '');
    if (uploadedImages.length === 0 && !hasExistingImages) {
      showError('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);
    
    // Check if we need to upload files
    const newImageFiles: File[] = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img && img instanceof File) {
        newImageFiles.push(img);
      }
    }
    const hasNewVideo = video && video instanceof File;
    const needsUpload = newImageFiles.length > 0 || hasNewVideo;
    
    if (needsUpload) {
      setIsUploading(true);
    }

    try {
      // Step 1: Upload only NEW images (File objects), not existing URLs
      const uploadedImageUrls: string[] = [];
      
      // Upload only the new image files
      for (let i = 0; i < newImageFiles.length; i++) {
        const imageFile = newImageFiles[i];
        const imageFormData = new FormData();
        imageFormData.append('files', imageFile);
        const imageResponse = await uploadFilesAction(imageFormData);
        
        if (imageResponse.error || !imageResponse.data || imageResponse.data.length === 0) {
          throw new Error(`Failed to upload image ${i + 1}: ${imageResponse.message || 'Unknown error'}`);
        }
        
        uploadedImageUrls.push(imageResponse.data[0].url);
      }

      // Step 2: Upload new video if provided (only if it's a new File)
      let finalVideoUrl: string | undefined;
      if (hasNewVideo && video && video instanceof File) {
        const videoFormData = new FormData();
        videoFormData.append('files', video);
        const videoResponse = await uploadFilesAction(videoFormData);
        
        if (videoResponse.error || !videoResponse.data || videoResponse.data.length === 0) {
          throw new Error(`Failed to upload video: ${videoResponse.message || 'Unknown error'}`);
        }
        
        finalVideoUrl = videoResponse.data[0].url;
      } else if (isEditMode && videoUrl) {
        // Keep existing video if no new one uploaded
        finalVideoUrl = videoUrl;
      }

      if (needsUpload) {
        setIsUploading(false);
      }

      // Step 3: Combine new and existing images
      // Build final image URLs array - preserve existing URLs, use new ones where files were uploaded
      const finalImageUrls: string[] = [];
      let newImageIndex = 0;
      
      for (let i = 0; i < 4; i++) {
        if (images[i] && images[i] instanceof File) {
          // New image file uploaded at this position - use uploaded URL
          if (uploadedImageUrls[newImageIndex]) {
            finalImageUrls.push(uploadedImageUrls[newImageIndex]);
            newImageIndex++;
          }
        } else if (isEditMode && imageUrls[i] && imageUrls[i].trim() !== '') {
          // Keep existing image URL at this position (no re-upload needed)
          finalImageUrls.push(imageUrls[i]);
        } else if (!isEditMode && uploadedImageUrls[newImageIndex]) {
          // For new products, use uploaded images
          finalImageUrls.push(uploadedImageUrls[newImageIndex]);
          newImageIndex++;
        }
      }

      if (isEditMode && product) {
        // Step 4: Update existing product
        const updateData: IUpdateProduct = {
          id: product.id!,
          title: formData.title,
          description: formData.description,
          sku: formData.sku,
          status: formData.status,
          technicalDetails: {
            categoryId: selectedCategoryId,
            subcategoryId: selectedSubcategoryId,
            regularPrice: formData.technicalDetails.regularPrice,
            discountPrice: formData.technicalDetails.discountPrice,
            initialStock: validVariants.length === 0 ? formData.technicalDetails.initialStock : undefined,
            attributes: Object.entries(attributeValues)
              .filter(([_, value]) => value.trim() !== '')
              .map(([attributeId, value]) => ({
                attributeId,
                value: value.trim()
              }))
          },
          images: finalImageUrls.map((url, idx) => ({
            index: idx,
            file: url
          })),
          video: finalVideoUrl ? { file: finalVideoUrl } : undefined,
          variants: variants
            .filter(v => v.name.trim() !== '' && v.sku.trim() !== '')
            .map(v => {
              const variantData = {
                ...(v.variantId && { id: v.variantId }), // Include DB ID if editing existing variant
                name: v.name,
                sku: v.sku,
                price: v.price ? parseFloat(v.price) : formData.technicalDetails.regularPrice || 0,
                discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : undefined,
                stock: parseInt(v.stock) || 0,
                status: v.status
              };
              console.log('[Variant Mapping]', {
                hasVariantId: !!v.variantId,
                variantId: v.variantId,
                name: v.name,
                mappedData: variantData
              });
              return variantData;
            })
        };

        console.log('[Update Payload] Variants count:', updateData.variants?.length);
        console.log('[Update Payload] Full variants:', JSON.stringify(updateData.variants, null, 2));

        const productResponse = await updateProductAction(updateData);

        if (productResponse.error || !productResponse.data) {
          throw new Error(productResponse.message || 'Failed to update product');
        }

        setIsSubmitting(false);
        showSuccess('Product updated successfully!');
        
        // Close modal after a short delay
        setTimeout(() => {
          onCancel();
        }, 1500);
        return;
      }

      // Step 4: Create new product
      const productData: ICreateProduct = {
        userId: '', // Will be populated by server action from token
        title: formData.title,
        description: formData.description,
        sku: formData.sku,
        status: formData.status,
        technicalDetails: {
          categoryId: selectedCategoryId,
          subcategoryId: selectedSubcategoryId,
          regularPrice: formData.technicalDetails.regularPrice,
          discountPrice: formData.technicalDetails.discountPrice,
          initialStock: validVariants.length === 0 ? formData.technicalDetails.initialStock : undefined,
          attributes: Object.entries(attributeValues)
            .filter(([_, value]) => value.trim() !== '')
            .map(([attributeId, value]) => ({
              attributeId,
              value: value.trim()
            }))
        },
        images: uploadedImageUrls.map((url, idx) => ({
          index: idx,
          file: url
        })),
        video: finalVideoUrl ? { file: finalVideoUrl } : undefined,
        variants: variants
          .filter(v => v.name.trim() !== '' && v.sku.trim() !== '')
          .map(v => ({
            name: v.name,
            sku: v.sku,
            price: v.price ? parseFloat(v.price) : formData.technicalDetails.regularPrice || 0,
            discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : undefined,
            stock: parseInt(v.stock) || 0,
            status: v.status
          }))
      };

      // Step 4: Create product
      const productResponse = await createProductAction(productData);

      if (productResponse.error || !productResponse.data) {
        throw new Error(productResponse.message || 'Failed to create product');
      }

      // Step 5: Create product attribute values (if any)
      const productAttributeValues: ICreateBulkProductAttributeValue = {
        productId: productResponse.data.id!,
        attributes: Object.entries(attributeValues)
          .filter(([_, value]) => value.trim() !== '')
          .map(([attributeId, value]) => ({
            attributeId,
            value: value.trim()
          }))
      };

      if (productAttributeValues.attributes.length > 0) {
        const attrResponse = await createBulkProductAttributeValuesAction(productAttributeValues);
        if (attrResponse.error) {
          console.warn('Warning: Product created but failed to save some attributes:', attrResponse.message);
        }
      }

      setIsSubmitting(false);
      showSuccess('Product created successfully!');
      
      // Close modal after a short delay
      setTimeout(() => {
        onCancel();
      }, 1500);

    } catch (err: any) {
      console.error('Error creating product:', err);
      setIsSubmitting(false);
      setIsUploading(false);
      showError(err.message || 'Failed to create product. Please try again.');
    }
  };

  return (
    <div className="space-y-8 text-left">
      <SectionHeader 
        title={isEditMode ? "Refine Treasure" : "Forge New Treasure"} 
        sub={isEditMode ? "Update your product details and parameters." : "Describe your creation and set the parameters for its entry into the market."} 
        icon={Plus}
        action={
          <button onClick={onCancel} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">
            {isEditMode ? "Cancel Edit" : "Cancel Launch"}
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Stepper Sidebar */}
        <div className="xl:col-span-1 space-y-4">
           {[
             { id: 1, label: 'Identity & Technical Details', icon: Tag, desc: 'Category, Attributes' },
             { id: 2, label: 'Pricing & Variants', icon: Zap, desc: 'Price & Variations' },
             { id: 3, label: 'Exhibition', icon: ImageIcon, desc: 'Media Payload' },
           ].map((s) => (
             <div 
              key={s.id}
              className={`p-6 rounded-3xl border-2 transition-all flex items-center space-x-5 ${
                step === s.id ? 'bg-white border-jozi-gold shadow-lg' : 
                step > s.id ? 'bg-emerald-50 border-emerald-100 opacity-60' : 'bg-white border-gray-50 opacity-40'
              }`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  step === s.id ? 'bg-jozi-gold text-jozi-dark' : 
                  step > s.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                   {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <div>
                   <p className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-jozi-gold' : 'text-gray-400'}`}>Step {s.id}</p>
                   <p className="font-black text-jozi-forest text-sm leading-tight">{s.label}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Main Form Area */}
        <div className="xl:col-span-3 space-y-8">
          <div className="bg-white rounded-[3.5rem] p-10 lg:p-12 shadow-soft border border-gray-100">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">Identity & Technical Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-50 pb-10">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Title *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Hand-Stitched Shweshwe Dress" 
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Master SKU *</label>
                          <input 
                            type="text" 
                            placeholder="MAB-XXX-000" 
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none"
                            value={formData.sku}
                            onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Status *</label>
                          <select 
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all appearance-none cursor-pointer"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description *</label>
                          <textarea 
                            rows={4}
                            placeholder="Describe your product in detail..." 
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          />
                       </div>
                    </div>

                    {/* Technical Details Section */}
                    <div className="space-y-8">
                      <h4 className="text-xl font-black text-jozi-forest uppercase tracking-tight flex items-center">
                        <Ruler className="w-6 h-6 text-jozi-gold mr-3" />
                        Technical Details
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {/* Category Hub */}
                         <div className="bg-jozi-cream rounded-4xl p-10 space-y-6 border border-jozi-forest/5">
                            <div className="flex items-center space-x-3 text-jozi-forest">
                               <Layers className="w-6 h-6 text-jozi-gold" />
                               <span className="text-xs font-black uppercase tracking-widest">Category Hub</span>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Category *</label>
                                 <select 
                                   className="w-full bg-white rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none appearance-none cursor-pointer border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                                   value={selectedCategoryId}
                                   onChange={(e) => {
                                     setSelectedCategoryId(e.target.value);
                                     setFormData(prev => ({
                                       ...prev,
                                       technicalDetails: { ...prev.technicalDetails, categoryId: e.target.value }
                                     }));
                                   }}
                                 >
                                   <option value="">Select Category</option>
                                   {loadingCategories ? (
                                     <option disabled>Loading...</option>
                                   ) : (
                                     categories.map(cat => (
                                       <option key={cat.id} value={cat.id}>{cat.name}</option>
                                     ))
                                   )}
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Subcategory *</label>
                                 <select 
                                   className="w-full bg-white rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none appearance-none cursor-pointer border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                                   value={selectedSubcategoryId}
                                   onChange={(e) => {
                                     setSelectedSubcategoryId(e.target.value);
                                     setFormData(prev => ({
                                       ...prev,
                                       technicalDetails: { ...prev.technicalDetails, subcategoryId: e.target.value }
                                     }));
                                   }}
                                   disabled={!selectedCategoryId}
                                 >
                                   <option value="">Select Subcategory</option>
                                   {subcategories.map(sub => (
                                     <option key={sub.id} value={sub.id}>{sub.name}</option>
                                   ))}
                                 </select>
                              </div>
                              {/* Initial Stock - Only show when no valid variants exist */}
                              {(() => {
                                const hasValidVariants = variants.some(v => v.name.trim() !== '' && v.sku.trim() !== '');
                                return !hasValidVariants ? (
                                  <div className="space-y-2 pt-4 border-t border-jozi-forest/10">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Initial Stock *</label>
                                    <input 
                                      type="number" 
                                      min="0"
                                      placeholder="0" 
                                      className="w-full bg-white rounded-2xl px-6 py-4 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                                      value={formData.technicalDetails.initialStock || ''}
                                      onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        technicalDetails: {
                                          ...prev.technicalDetails,
                                          initialStock: e.target.value ? parseInt(e.target.value) : undefined
                                        }
                                      }))}
                                    />
                                    <p className="text-[8px] text-gray-400 font-medium italic">Required for products without variants</p>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                         </div>

                         {/* Attributes Section */}
                         {selectedSubcategoryId ? (
                           <div className="bg-white rounded-3xl p-8 space-y-4 border border-gray-100 shadow-soft">
                              <div className="flex items-center space-x-3 text-jozi-forest">
                                 <Tag className="w-6 h-6 text-jozi-gold" />
                                 <span className="text-xs font-black uppercase tracking-widest">Product Attributes</span>
                              </div>
                              {loadingAttributes ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="w-6 h-6 text-jozi-gold animate-spin" />
                                </div>
                              ) : categoryAttributes.length > 0 ? (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                  {categoryAttributes.map((catAttr) => {
                                    const attribute = catAttr.attribute;
                                    if (!attribute) return null;
                                    
                                    return (
                                      <div key={catAttr.id} className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                          {attribute.name}
                                          {catAttr.isRequired && <span className="text-red-500 ml-1">*</span>}
                                          {attribute.unit && <span className="text-gray-400 ml-1">({attribute.unit})</span>}
                                        </label>
                                        {attribute.type === 'select' && catAttr.options && catAttr.options.length > 0 ? (
                                          <select
                                            className="w-full bg-gray-50 rounded-xl px-6 py-3 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                                            value={attributeValues[catAttr.attributeId] || ''}
                                            onChange={(e) => handleAttributeChange(catAttr.attributeId, e.target.value)}
                                          >
                                            <option value="">Select {attribute.name}</option>
                                            {catAttr.options.map((option, idx) => (
                                              <option key={idx} value={option}>{option}</option>
                                            ))}
                                          </select>
                                        ) : attribute.type === 'boolean' ? (
                                          <select
                                            className="w-full bg-gray-50 rounded-xl px-6 py-3 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                                            value={attributeValues[catAttr.attributeId] || ''}
                                            onChange={(e) => handleAttributeChange(catAttr.attributeId, e.target.value)}
                                          >
                                            <option value="">Select</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                          </select>
                                        ) : attribute.type === 'textarea' ? (
                                          <textarea
                                            rows={3}
                                            className="w-full bg-gray-50 rounded-xl px-6 py-3 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all resize-none"
                                            value={attributeValues[catAttr.attributeId] || ''}
                                            onChange={(e) => handleAttributeChange(catAttr.attributeId, e.target.value)}
                                            placeholder={`Enter ${attribute.name.toLowerCase()}`}
                                          />
                                        ) : (
                                          <input
                                            type={attribute.type === 'number' ? 'number' : 'text'}
                                            className="w-full bg-gray-50 rounded-xl px-6 py-3 font-bold text-sm text-jozi-forest outline-none border-2 border-transparent focus:border-jozi-gold/20 transition-all"
                                            value={attributeValues[catAttr.attributeId] || ''}
                                            onChange={(e) => handleAttributeChange(catAttr.attributeId, e.target.value)}
                                            placeholder={`Enter ${attribute.name.toLowerCase()}`}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400 text-center py-4">No attributes configured for this subcategory</p>
                              )}
                           </div>
                         ) : (
                           <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center border border-gray-100">
                              <p className="text-xs text-gray-400 text-center">Select a subcategory to view attributes</p>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">Pricing & Variants</h3>
                    
                    {/* Pricing Strategy */}
                    <div className="bg-jozi-cream rounded-4xl p-10 space-y-6 border border-jozi-forest/5">
                       <div className="flex items-center space-x-3 text-jozi-forest">
                          <Zap className="w-6 h-6 text-jozi-gold" />
                          <span className="text-xs font-black uppercase tracking-widest">Pricing Strategy</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Regular Price (R) *</label>
                             <input 
                               type="number" 
                               placeholder="0.00" 
                               className="w-full bg-white rounded-2xl px-6 py-4 font-black text-2xl text-jozi-forest outline-none shadow-sm"
                               value={formData.technicalDetails.regularPrice || ''}
                               onChange={(e) => setFormData(prev => ({
                                 ...prev,
                                 technicalDetails: {
                                   ...prev.technicalDetails,
                                   regularPrice: parseFloat(e.target.value) || 0
                                 }
                               }))}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Discounted Price (Optional)</label>
                             <input 
                               type="number" 
                               placeholder="0.00" 
                               className="w-full bg-white/50 rounded-2xl px-6 py-4 font-black text-lg text-gray-400 outline-none border-2 border-dashed border-gray-100"
                               value={formData.technicalDetails.discountPrice || ''}
                               onChange={(e) => setFormData(prev => ({
                                 ...prev,
                                 technicalDetails: {
                                   ...prev.technicalDetails,
                                   discountPrice: e.target.value ? parseFloat(e.target.value) : undefined
                                 }
                               }))}
                             />
                          </div>
                       </div>
                    </div>

                    {/* Variants Section */}
                    <div className="pt-8 border-t border-gray-50 space-y-6">
                      <div className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                         <div className="space-y-2">
                           <h4 className="text-xl font-black text-jozi-forest uppercase tracking-tight flex items-center">
                             <Layers className="w-6 h-6 text-jozi-gold mr-3" />
                             Variants
                           </h4>
                           {formData.technicalDetails.regularPrice > 0 ? (
                             <p className="text-[9px] text-gray-500 font-medium flex items-start gap-2 max-w-xl">
                               <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-jozi-gold" />
                               <span>
                                 All variants will use the product price (R{formData.technicalDetails.regularPrice}). 
                                 To set individual variant prices, clear the product's regular price first.
                               </span>
                             </p>
                           ) : (
                             <p className="text-[9px] text-gray-500 font-medium flex items-start gap-2 max-w-xl">
                               <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-jozi-gold" />
                               <span>
                                 Set individual prices for each variant, or leave empty to use the product's regular price.
                               </span>
                             </p>
                           )}
                         </div>
                         <button onClick={addVariant} className="bg-jozi-forest text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-jozi-dark transition-all whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" /> Add Variation
                         </button>
                      </div>
                      
                      <div className="space-y-4">
                         {variants.map((v, i) => (
                            <div key={v.id} className="relative p-8 bg-gray-50/50 rounded-4xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-end group hover:bg-white hover:shadow-lg transition-all">
                              {/* Delete button in top right corner */}
                              <button 
                                onClick={() => removeVariant(v.id)} 
                                className="absolute top-4 right-4 p-2 bg-white text-gray-300 rounded-xl hover:text-red-500 hover:bg-red-50 shadow-sm transition-all z-10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black uppercase text-gray-400">Variant Name (e.g. Red / XL)</label>
                                 <input 
                                   type="text" 
                                   className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/30"
                                   value={v.name}
                                   onChange={(e) => {
                                     const newVariants = [...variants];
                                     newVariants[i].name = e.target.value;
                                     setVariants(newVariants);
                                   }}
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black uppercase text-gray-400">Unique SKU</label>
                                 <input 
                                   type="text" 
                                   className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/30"
                                   value={v.sku}
                                   onChange={(e) => {
                                     const newVariants = [...variants];
                                     newVariants[i].sku = e.target.value;
                                     setVariants(newVariants);
                                   }}
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black uppercase text-gray-400 flex items-center gap-2">
                                   Variant Price (Optional)
                                   {formData.technicalDetails.regularPrice > 0 && (
                                     <span className="text-[8px] normal-case font-medium text-gray-400 italic">
                                       (Uses product price: R{formData.technicalDetails.regularPrice})
                                     </span>
                                   )}
                                 </label>
                                 <input 
                                   type="number" 
                                   step="0.01"
                                   disabled={formData.technicalDetails.regularPrice > 0}
                                   className={`w-full rounded-xl px-4 py-3 text-sm font-bold outline-none border transition-all ${
                                     formData.technicalDetails.regularPrice > 0
                                       ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                       : 'bg-white text-jozi-forest border-transparent focus:border-jozi-gold/30'
                                   }`}
                                   value={v.price}
                                   placeholder={formData.technicalDetails.regularPrice > 0 ? `R${formData.technicalDetails.regularPrice}` : '0.00'}
                                   onChange={(e) => {
                                     const newVariants = [...variants];
                                     newVariants[i].price = e.target.value;
                                     setVariants(newVariants);
                                   }}
                                 />
                                 {formData.technicalDetails.regularPrice > 0 && (
                                   <p className="text-[8px] text-gray-400 italic flex items-start gap-1 mt-1">
                                     <Info className="w-3 h-3 shrink-0 mt-0.5" />
                                     <span>This variant will use the product's regular price. Clear the product price to set variant-specific pricing.</span>
                                   </p>
                                 )}
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black uppercase text-gray-400">Variant Discount (Optional)</label>
                                 <input 
                                   type="number" 
                                   step="0.01"
                                   disabled={formData.technicalDetails.regularPrice > 0}
                                   className={`w-full rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all ${
                                     formData.technicalDetails.regularPrice > 0
                                       ? 'bg-gray-50 text-gray-400 border-2 border-dashed border-gray-200 cursor-not-allowed'
                                       : 'bg-white/50 text-gray-400 border-2 border-dashed border-gray-100 focus:border-jozi-gold/30'
                                   }`}
                                   value={v.discountPrice}
                                   placeholder="0.00"
                                   onChange={(e) => {
                                     const newVariants = [...variants];
                                     newVariants[i].discountPrice = e.target.value;
                                     setVariants(newVariants);
                                   }}
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black uppercase text-gray-400">Initial Stock</label>
                                 <input 
                                   type="number" 
                                   min="0"
                                   className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/30"
                                   value={v.stock}
                                   onChange={(e) => {
                                     const newVariants = [...variants];
                                     newVariants[i].stock = e.target.value;
                                     setVariants(newVariants);
                                   }}
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[9px] font-black uppercase text-gray-400">Status</label>
                                 <select 
                                   className="w-full bg-white rounded-xl px-4 py-3 text-xs font-bold text-jozi-forest outline-none border border-transparent focus:border-jozi-gold/30"
                                   value={v.status}
                                   onChange={(e) => {
                                     const newVariants = [...variants];
                                     newVariants[i].status = e.target.value;
                                     setVariants(newVariants);
                                   }}
                                 >
                                   <option value="Active">Active</option>
                                   <option value="Inactive">Inactive</option>
                                 </select>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step4" className="space-y-10">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-jozi-dark tracking-tighter uppercase">Visual Exhibition</h3>
                      <p className="text-gray-400 font-medium italic">Upload exactly 4 images. The 4th image is optional but encouraged. Video is optional.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {images.map((file, idx) => {
                        const existingImageUrl = isEditMode && imageUrls[idx] ? imageUrls[idx] : null;
                        const hasImage = file || existingImageUrl;
                        
                        return (
                        <div key={idx} className="space-y-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            {idx === 0 ? 'Master Shot' : idx === 3 ? 'Optional View' : `Detail 0${idx + 1}`}
                          </p>
                          <div 
                            className={`relative aspect-4/5 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-4 group cursor-pointer ${
                                hasImage ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-200 bg-gray-50 hover:border-jozi-gold/20'
                            }`}
                          >
                            <input 
                              type="file" 
                              accept="image/*"
                                onChange={(e) => {
                                  handleImageChange(idx, e.target.files?.[0] || null);
                                  // Clear existing URL when new file is selected
                                  if (e.target.files?.[0] && existingImageUrl) {
                                    const newUrls = [...imageUrls];
                                    newUrls[idx] = '';
                                    setImageUrls(newUrls);
                                  }
                                }}
                              className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />
                            {file ? (
                              <div className="relative w-full h-full z-10">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  className="w-full h-full object-cover rounded-2xl" 
                                  alt={`Upload ${idx}`} 
                                />
                                <button 
                                    onClick={(e) => { 
                                      e.preventDefault(); 
                                      handleImageChange(idx, null); 
                                    }}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform z-30"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : existingImageUrl ? (
                                <div className="relative w-full h-full z-10">
                                  <img 
                                    src={existingImageUrl} 
                                    className="w-full h-full object-cover rounded-2xl" 
                                    alt={`Existing ${idx}`} 
                                  />
                                  <button 
                                    onClick={(e) => { 
                                      e.preventDefault(); 
                                      const newUrls = [...imageUrls];
                                      newUrls[idx] = '';
                                      setImageUrls(newUrls);
                                    }}
                                  className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform z-30"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-6 h-6 text-gray-300 mx-auto group-hover:text-jozi-gold transition-colors" />
                                <p className="text-[10px] font-black text-jozi-forest uppercase tracking-widest">Select Image</p>
                              </div>
                            )}
                          </div>
                        </div>
                        );
                      })}
                   </div>

                   {/* Video Upload */}
                   <div className="space-y-3">
                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Video (Optional)</p>
                     <div 
                       className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-4 group cursor-pointer ${
                         video ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-200 bg-gray-50 hover:border-jozi-gold/20'
                       }`}
                     >
                       <input 
                         type="file" 
                         accept="video/*"
                         onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
                         className="absolute inset-0 opacity-0 cursor-pointer z-20"
                       />
                       {video ? (
                         <div className="relative w-full h-full z-10">
                           <video 
                             src={URL.createObjectURL(video)} 
                             className="w-full h-full object-cover rounded-2xl" 
                             controls
                           />
                           <button 
                             onClick={(e) => { 
                               e.preventDefault(); 
                               handleVideoChange(null);
                               setVideoUrl(null);
                             }}
                             className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform z-30"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       ) : videoUrl ? (
                         <div className="relative w-full h-full z-10">
                           <video 
                             src={videoUrl} 
                             className="w-full h-full object-cover rounded-2xl" 
                             controls
                           />
                           <button 
                             onClick={(e) => { 
                               e.preventDefault(); 
                               setVideoUrl(null);
                             }}
                             className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform z-30"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       ) : (
                         <div className="space-y-2">
                           <Video className="w-6 h-6 text-gray-300 mx-auto group-hover:text-jozi-gold transition-colors" />
                           <p className="text-[10px] font-black text-jozi-forest uppercase tracking-widest">Select Video</p>
                         </div>
                       )}
                     </div>
                   </div>

                    <div className="bg-jozi-dark p-10 rounded-5xl text-white shadow-2xl relative overflow-hidden group">
                      <div className="relative z-10 space-y-4">
                          <div className="flex items-center space-x-3 text-jozi-gold">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase">Exhibition Logic</span>
                          </div>
                          <h4 className="text-xl font-black leading-tight">Professional Visual Standards</h4>
                          <p className="text-[10px] text-jozi-cream/40 font-medium leading-relaxed uppercase tracking-widest">
                            We recommend high-contrast natural lighting. Listings with 4 images see a <span className="text-white font-bold">18% uplift</span> in conversion versus single-image listings.
                          </p>
                      </div>
                      <Box className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Footer Navigation */}
            <div className="mt-12 pt-10 border-t border-gray-100 flex items-center justify-between">
               <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                className={`flex items-center space-x-2 font-black text-sm uppercase tracking-widest transition-all ${
                  step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-jozi-forest'
                }`}
               >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Reverse Step</span>
               </button>

               <div className="flex items-center space-x-4">
                 <button className="px-10 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Save Vault Draft</button>
                 <button 
                  onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                  disabled={isSubmitting || isUploading}
                  className={`bg-jozi-forest text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center shadow-2xl shadow-jozi-forest/20 transition-all group ${
                    isSubmitting || isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                 >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Uploading Files...
                      </>
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {isEditMode ? 'Updating Product...' : 'Creating Product...'}
                      </>
                    ) : (
                      <>
                        {step === 3 ? (isEditMode ? 'Update Treasure' : 'Publish Treasure') : 'Continue Forward'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAddProduct;
