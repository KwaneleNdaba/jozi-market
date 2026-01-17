import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft, 
  Download,
  LayoutGrid,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  ChevronDown,
  Tag,
  Box,
  Layers,
  Settings2,
  ListTree,
  /* Added missing imports for UI components and icons used in the form/modals */
  ChevronLeft,
  Image as ImageIcon,
  XCircle,
  AlertCircle,
  Save,
  Loader2,
  AlertTriangle,
  Hash,
  Type,
  Palette,
  List
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import StatusBadge from '../../components/StatusBadge';
import { useToast } from '../../contexts/ToastContext';
import { 
  getAllCategoriesAction, 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction,
  getSubcategoriesByCategoryIdAction,
  createSubcategoryAction,
  updateSubcategoryAction
} from '../../actions/category';
import { 
  getAllAttributesAction,
  createAttributeAction,
  updateAttributeAction,
  deleteAttributeAction
} from '../../actions/attribute';
import { 
  getCategoryAttributesByCategoryIdAction,
  createCategoryAttributeAction,
  deleteCategoryAttributeAction,
  updateCategoryAttributeAction
} from '../../actions/category-attribute';
import { FILE_API } from '@/endpoints/rest-api/file/file';
import { ICategory, ICreateCategory, IUpdateCategory, ICreateSubcategory } from '@/interfaces/category/category';
import { IAttribute, ICategoryAttribute, AttributeType, ICreateAttribute, ICreateCategoryAttribute, IUpdateAttribute, IUpdateCategoryAttribute } from '@/interfaces/attribute/attribute';

// --- Types ---

interface SubCategory {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  productCount?: number;
}

interface Category extends ICategory {
  subcategories?: SubCategory[];
}

// Selected attribute with options for linking to category
interface SelectedCategoryAttribute {
  attributeId: string;
  isRequired: boolean;
  options?: string[];
  displayOrder: number;
}

// --- Components ---

/**
 * Category Management Component
 * 
 * Workflow for creating categories with attributes:
 * 1. Create global attributes first (POST /api/attribute) - reusable across categories
 * 2. Create categories (POST /api/category) - without attributes
 * 3. Link attributes to categories (POST /api/category-attribute) - after category creation
 * 
 * Note: Attributes are NOT included in category creation/update payloads.
 * They are managed separately via the category-attribute endpoint.
 */
const AdminCategoryManagement: React.FC = () => {
  const { showError, showSuccess, showWarning } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'category' | 'subcategory', data: any, parentId?: string } | null>(null);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'category' | 'subcategory';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'category',
    onConfirm: () => {}
  });
  
  // State for inline subcategory creation
  const [newSubcategories, setNewSubcategories] = useState<ICreateSubcategory[]>([]);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [subcategoryForm, setSubcategoryForm] = useState<ICreateSubcategory>({
    name: '',
    description: '',
    status: 'Active'
  });

  // Form state for category
  const [categoryForm, setCategoryForm] = useState<{
    name: string;
    description: string;
    status: 'Active' | 'Inactive';
    icon: string;
    iconFile: File | null;
  }>({
    name: '',
    description: '',
    status: 'Active',
    icon: '',
    iconFile: null
  });

  // Attribute selection state
  const [isSelectingAttribute, setIsSelectingAttribute] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>('');
  const [attributeOptions, setAttributeOptions] = useState<string[]>([]);
  const [newAttributeOption, setNewAttributeOption] = useState<string>('');
  const [isAttributeRequired, setIsAttributeRequired] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState<Record<string, boolean>>({});
  
  // Global attributes state
  const [globalAttributes, setGlobalAttributes] = useState<IAttribute[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  
  // Selected attributes for linking to category (stores attributeId, isRequired, options, displayOrder)
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedCategoryAttribute[]>([]);
  
  // Linked category attributes (when editing existing category)
  const [linkedCategoryAttributes, setLinkedCategoryAttributes] = useState<ICategoryAttribute[]>([]);
  const [loadingLinkedAttributes, setLoadingLinkedAttributes] = useState(false);
  
  // State for managing attributes per subcategory in the modal
  const [expandedSubcategoryForAttributes, setExpandedSubcategoryForAttributes] = useState<string | null>(null);
  const [subcategoryLinkedAttributes, setSubcategoryLinkedAttributes] = useState<Record<string, ICategoryAttribute[]>>({});
  const [subcategoryLoadingAttributes, setSubcategoryLoadingAttributes] = useState<Record<string, boolean>>({});
  const [subcategorySelectedAttributes, setSubcategorySelectedAttributes] = useState<Record<string, SelectedCategoryAttribute[]>>({});
  
  // Per-subcategory attribute form state
  const [subcategoryAttributeForms, setSubcategoryAttributeForms] = useState<Record<string, {
    selectedAttributeId: string;
    isRequired: boolean;
    options: string[];
    newOption: string;
  }>>({});
  
  // Modal for creating new attribute
  const [isCreateAttributeModalOpen, setIsCreateAttributeModalOpen] = useState(false);
  const [newAttributeForm, setNewAttributeForm] = useState<ICreateAttribute>({
    name: '',
    slug: '',
    type: AttributeType.TEXT,
    unit: undefined
  });

  // Fetch categories and global attributes on mount
  useEffect(() => {
    fetchCategories();
    fetchGlobalAttributes();
  }, []);

  // Fetch subcategories when category is expanded
  useEffect(() => {
    expandedCats.forEach(categoryId => {
      if (!categories.find(c => c.id === categoryId)?.subcategories) {
        fetchSubcategories(categoryId);
      }
    });
  }, [expandedCats]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategoriesAction(statusFilter === 'All' ? undefined : statusFilter);
      
      if (response.error) {
        showError(response.message || 'Failed to fetch categories');
        setCategories([]);
      } else {
        setCategories(response.data || []);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      setSubcategoriesLoading(prev => ({ ...prev, [categoryId]: true }));
      const response = await getSubcategoriesByCategoryIdAction(categoryId);
      
      if (!response.error && response.data) {
        const subcategories: SubCategory[] = (response.data || []).map(sub => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          status: sub.status as 'Active' | 'Inactive',
          productCount: 0
        }));
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, subcategories }
            : cat
        ));
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch subcategories');
    } finally {
      setSubcategoriesLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  const fetchGlobalAttributes = async () => {
    try {
      setLoadingAttributes(true);
      const response = await getAllAttributesAction();
      
      if (response.error) {
        showError(response.message || 'Failed to fetch attributes');
        setGlobalAttributes([]);
      } else {
        setGlobalAttributes(response.data || []);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch attributes');
      setGlobalAttributes([]);
    } finally {
      setLoadingAttributes(false);
    }
  };

  const fetchLinkedCategoryAttributes = async (categoryId: string) => {
    try {
      setLoadingLinkedAttributes(true);
      const response = await getCategoryAttributesByCategoryIdAction(categoryId);
      
      if (!response.error && response.data) {
        setLinkedCategoryAttributes(response.data || []);
      } else {
        setLinkedCategoryAttributes([]);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch linked attributes');
      setLinkedCategoryAttributes([]);
    } finally {
      setLoadingLinkedAttributes(false);
    }
  };

  // Fetch linked attributes for a specific subcategory
  const fetchSubcategoryLinkedAttributes = async (subcategoryId: string) => {
    try {
      setSubcategoryLoadingAttributes(prev => ({ ...prev, [subcategoryId]: true }));
      const response = await getCategoryAttributesByCategoryIdAction(subcategoryId);
      
      if (!response.error && response.data) {
        setSubcategoryLinkedAttributes(prev => ({ ...prev, [subcategoryId]: response.data || [] }));
      } else {
        setSubcategoryLinkedAttributes(prev => ({ ...prev, [subcategoryId]: [] }));
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch linked attributes');
      setSubcategoryLinkedAttributes(prev => ({ ...prev, [subcategoryId]: [] }));
    } finally {
      setSubcategoryLoadingAttributes(prev => ({ ...prev, [subcategoryId]: false }));
    }
  };

  // Toggle attribute management for a subcategory
  const toggleSubcategoryAttributeManagement = async (subcategoryId: string) => {
    if (expandedSubcategoryForAttributes === subcategoryId) {
      setExpandedSubcategoryForAttributes(null);
    } else {
      setExpandedSubcategoryForAttributes(subcategoryId);
      // Initialize form state if not exists
      if (!subcategoryAttributeForms[subcategoryId]) {
        setSubcategoryAttributeForms(prev => ({
          ...prev,
          [subcategoryId]: {
            selectedAttributeId: '',
            isRequired: false,
            options: [],
            newOption: ''
          }
        }));
      }
      // Fetch linked attributes if not already loaded
      if (!subcategoryLinkedAttributes[subcategoryId]) {
        await fetchSubcategoryLinkedAttributes(subcategoryId);
      }
    }
  };

  // Add selected attribute to subcategory
  const handleAddSubcategoryAttribute = (subcategoryId: string) => {
    const form = subcategoryAttributeForms[subcategoryId];
    if (!form?.selectedAttributeId) {
      showWarning('Please select an attribute');
      return;
    }

    const selectedAttribute = globalAttributes.find(attr => attr.id === form.selectedAttributeId);
    if (!selectedAttribute) {
      showWarning('Selected attribute not found');
      return;
    }

    const currentSelected = subcategorySelectedAttributes[subcategoryId] || [];
    if (currentSelected.some(sa => sa.attributeId === form.selectedAttributeId)) {
      showWarning('This attribute is already selected');
      return;
    }

    const newSelected: SelectedCategoryAttribute = {
      attributeId: form.selectedAttributeId,
      isRequired: form.isRequired,
      options: selectedAttribute.type === AttributeType.SELECT && form.options.length > 0 ? form.options : undefined,
      displayOrder: currentSelected.length + 1
    };

    setSubcategorySelectedAttributes(prev => ({
      ...prev,
      [subcategoryId]: [...currentSelected, newSelected]
    }));

    // Reset form
    setSubcategoryAttributeForms(prev => ({
      ...prev,
      [subcategoryId]: {
        selectedAttributeId: '',
        isRequired: false,
        options: [],
        newOption: ''
      }
    }));
  };

  // Remove selected attribute from subcategory
  const handleRemoveSubcategorySelectedAttribute = (subcategoryId: string, attributeId: string) => {
    setSubcategorySelectedAttributes(prev => ({
      ...prev,
      [subcategoryId]: (prev[subcategoryId] || []).filter(sa => sa.attributeId !== attributeId)
    }));
  };

  // Link attributes to subcategory
  const handleLinkAttributesToSubcategory = async (subcategoryId: string) => {
    const selected = subcategorySelectedAttributes[subcategoryId] || [];
    if (selected.length === 0) {
      showWarning('No attributes selected');
      return;
    }

    try {
      const linkPromises = selected.map(selectedAttr => 
        createCategoryAttributeAction({
          categoryId: subcategoryId,
          attributeId: selectedAttr.attributeId,
          isRequired: selectedAttr.isRequired,
          options: selectedAttr.options,
          displayOrder: selectedAttr.displayOrder
        })
      );

      await Promise.all(linkPromises);
      showSuccess(`Successfully linked ${selected.length} attribute(s) to subcategory`);
      
      // Refresh linked attributes
      await fetchSubcategoryLinkedAttributes(subcategoryId);
      
      // Clear selected attributes
      setSubcategorySelectedAttributes(prev => ({ ...prev, [subcategoryId]: [] }));
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to link attributes to subcategory');
    }
  };

  // Unlink attribute from subcategory
  const handleUnlinkSubcategoryAttribute = async (subcategoryId: string, categoryAttributeId: string) => {
    try {
      const response = await deleteCategoryAttributeAction(categoryAttributeId);
      if (!response.error) {
        showSuccess('Attribute unlinked successfully');
        await fetchSubcategoryLinkedAttributes(subcategoryId);
      } else {
        showError(response.message || 'Failed to unlink attribute');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to unlink attribute');
    }
  };

  // Add option to subcategory attribute form
  const handleAddSubcategoryAttributeOption = (subcategoryId: string) => {
    const form = subcategoryAttributeForms[subcategoryId];
    if (!form?.newOption?.trim()) {
      showWarning('Please enter an option value');
      return;
    }
    if (form.options.includes(form.newOption.trim())) {
      showWarning('This option already exists');
      return;
    }
    setSubcategoryAttributeForms(prev => ({
      ...prev,
      [subcategoryId]: {
        ...prev[subcategoryId],
        options: [...prev[subcategoryId].options, prev[subcategoryId].newOption.trim()],
        newOption: ''
      }
    }));
  };

  // Remove option from subcategory attribute form
  const handleRemoveSubcategoryAttributeOption = (subcategoryId: string, option: string) => {
    setSubcategoryAttributeForms(prev => ({
      ...prev,
      [subcategoryId]: {
        ...prev[subcategoryId],
        options: prev[subcategoryId].options.filter(opt => opt !== option)
      }
    }));
  };

  const handleCreateAttribute = async () => {
    if (!newAttributeForm.name.trim() || !newAttributeForm.slug.trim()) {
      showWarning('Please fill in attribute name and slug');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createAttributeAction(newAttributeForm);
      
      if (response.error) {
        showError(response.message || 'Failed to create attribute');
      } else {
        showSuccess('Attribute created successfully');
        setIsCreateAttributeModalOpen(false);
        setNewAttributeForm({ name: '', slug: '', type: AttributeType.TEXT, unit: undefined });
        await fetchGlobalAttributes();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSelectedAttribute = () => {
    if (!selectedAttributeId) {
      showWarning('Please select an attribute');
      return;
    }

    const selectedAttribute = globalAttributes.find(attr => attr.id === selectedAttributeId);
    if (!selectedAttribute) {
      showWarning('Selected attribute not found');
      return;
    }

    // Check if already selected
    if (selectedAttributes.some(sa => sa.attributeId === selectedAttributeId)) {
      showWarning('This attribute is already selected');
      return;
    }

    const newSelected: SelectedCategoryAttribute = {
      attributeId: selectedAttributeId,
      isRequired: isAttributeRequired,
      options: selectedAttribute.type === AttributeType.SELECT ? (attributeOptions.length > 0 ? attributeOptions : undefined) : undefined,
      displayOrder: selectedAttributes.length + 1
    };

    setSelectedAttributes(prev => [...prev, newSelected]);
    
    // Reset form
    setSelectedAttributeId('');
    setIsAttributeRequired(false);
    setAttributeOptions([]);
    setNewAttributeOption('');
    setIsSelectingAttribute(false);
  };

  const handleRemoveSelectedAttribute = (attributeId: string) => {
    setSelectedAttributes(prev => prev.filter(sa => sa.attributeId !== attributeId));
  };

  const handleLinkAttributesToCategory = async (categoryId: string) => {
    if (selectedAttributes.length === 0) {
      return; // No attributes to link
    }

    try {
      const linkPromises = selectedAttributes.map(selected => 
        createCategoryAttributeAction({
          categoryId,
          attributeId: selected.attributeId,
          isRequired: selected.isRequired,
          options: selected.options,
          displayOrder: selected.displayOrder
        })
      );

      await Promise.all(linkPromises);
      showSuccess(`Successfully linked ${selectedAttributes.length} attribute(s) to category`);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to link attributes to category');
    }
  };

  // Attribute management handlers
  const [editingAttribute, setEditingAttribute] = useState<IAttribute | null>(null);
  const [attributeSearchQuery, setAttributeSearchQuery] = useState('');
  const [isLinkAttributeModalOpen, setIsLinkAttributeModalOpen] = useState(false);
  const [selectedCategoryForLinking, setSelectedCategoryForLinking] = useState<Category | SubCategory | null>(null);

  const handleEditAttribute = (attribute: IAttribute) => {
    setEditingAttribute(attribute);
    setNewAttributeForm({
      name: attribute.name,
      slug: attribute.slug,
      type: attribute.type as AttributeType,
      unit: attribute.unit
    });
    setIsCreateAttributeModalOpen(true);
  };

  const handleUpdateAttribute = async () => {
    if (!editingAttribute?.id) return;
    
    if (!newAttributeForm.name.trim() || !newAttributeForm.slug.trim()) {
      showWarning('Please fill in attribute name and slug');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await updateAttributeAction({
        id: editingAttribute.id,
        ...newAttributeForm
      });
      
      if (response.error) {
        showError(response.message || 'Failed to update attribute');
      } else {
        showSuccess('Attribute updated successfully');
        setIsCreateAttributeModalOpen(false);
        setEditingAttribute(null);
        setNewAttributeForm({ name: '', slug: '', type: AttributeType.TEXT, unit: undefined });
        await fetchGlobalAttributes();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAttribute = (id: string) => {
    const attribute = globalAttributes.find(a => a.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Attribute',
      message: `Are you sure you want to delete "${attribute?.name || 'this attribute'}"? This will also unlink it from all categories.`,
      type: 'category',
      onConfirm: async () => {
        try {
          const response = await deleteAttributeAction(id);
          
          if (response.error) {
            showError(response.message || 'Failed to delete attribute');
          } else {
            showSuccess('Attribute deleted successfully');
            await fetchGlobalAttributes();
          }
        } catch (err) {
          showError(err instanceof Error ? err.message : 'Failed to delete attribute');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleOpenLinkAttributeModal = async (category: Category | SubCategory) => {
    // Allow linking attributes to both categories and subcategories
    setSelectedCategoryForLinking(category);
    await fetchLinkedCategoryAttributes(category.id);
    setIsLinkAttributeModalOpen(true);
  };

  const filteredAttributes = useMemo(() => {
    return globalAttributes.filter(attr => 
      attr.name.toLowerCase().includes(attributeSearchQuery.toLowerCase()) ||
      attr.slug.toLowerCase().includes(attributeSearchQuery.toLowerCase())
    );
  }, [globalAttributes, attributeSearchQuery]);

  const filteredCategories = useMemo(() => {
    // Only show top-level categories (categoryId === null)
    return categories
      .filter(c => c.categoryId === null) // Only top-level categories
      .filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [categories, searchQuery]);

  // Refetch when status filter changes
  useEffect(() => {
    fetchCategories();
  }, [statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleOpenModal = async (type: 'category' | 'subcategory', data: any = null, parentId?: string) => {
    setEditingItem({ type, data, parentId });
    setIsModalOpen(true);
    // Reset form state when opening modal
    if (type === 'category') {
      setNewSubcategories([]);
      setIsAddingSubcategory(false);
      setSubcategoryForm({ name: '', description: '', status: 'Active' });
      setCategoryForm({
        name: data?.name || '',
        description: data?.description || '',
        status: data?.status || 'Active',
        icon: data?.icon || '',
        iconFile: null
      });
      // Reset attribute selection
      setSelectedAttributes([]);
      setIsSelectingAttribute(false);
      setSelectedAttributeId('');
      setIsAttributeRequired(false);
      setAttributeOptions([]);
      setNewAttributeOption('');
      
      // If editing existing category, fetch linked attributes
      if (data?.id) {
        await fetchLinkedCategoryAttributes(data.id);
      } else {
        setLinkedCategoryAttributes([]);
      }
    } else {
      setSubcategoryForm({
        name: data?.name || '',
        description: data?.description || '',
        status: data?.status || 'Active'
      });
    }
  };

  const handleAddSubcategoryInline = () => {
    if (!subcategoryForm.name?.trim() || !subcategoryForm.description?.trim()) {
      showWarning('Please fill in all required fields');
      return;
    }

    const newSub: ICreateSubcategory = {
      name: subcategoryForm.name.trim(),
      description: subcategoryForm.description.trim(),
      status: subcategoryForm.status || 'Active'
    };

    setNewSubcategories(prev => [...prev, newSub]);
    setSubcategoryForm({ name: '', description: '', status: 'Active' });
    setIsAddingSubcategory(false);
  };

  const handleRemoveNewSubcategory = (index: number) => {
    setNewSubcategories(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditNewSubcategory = (index: number) => {
    const sub = newSubcategories[index];
    if (sub) {
      setSubcategoryForm({
        name: sub.name || '',
        description: sub.description || '',
        status: sub.status || 'Active'
      });
      handleRemoveNewSubcategory(index);
      setIsAddingSubcategory(true);
    }
  };

  // Helper to generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAddAttributeOption = () => {
    if (!newAttributeOption?.trim()) {
      showWarning('Please enter an option value');
      return;
    }
    if (attributeOptions.includes(newAttributeOption.trim())) {
      showWarning('This option already exists');
      return;
    }
    setAttributeOptions(prev => [...prev, newAttributeOption.trim()]);
    setNewAttributeOption('');
  };

  const handleRemoveAttributeOption = (option: string) => {
    setAttributeOptions(prev => prev.filter(opt => opt !== option));
  };

  // Get all subcategories (existing + new) for display
  const getAllSubcategories = (): (SubCategory | ICreateSubcategory & { isNew?: boolean })[] => {
    const existing = editingItem?.data?.subcategories || [];
    const newOnes = newSubcategories.map(sub => ({ ...sub, isNew: true }));
    return [...existing, ...newOnes];
  };

  const handleIconUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await FILE_API.UPLOAD_FILE(formData);
      
      if (response.error || !response.data || response.data.length === 0) {
        showError('Failed to upload icon');
        return;
      }

      setCategoryForm(prev => ({ ...prev, icon: response.data[0].url, iconFile: file }));
      showSuccess('Icon uploaded successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to upload icon');
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name.trim() || !categoryForm.description.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload icon if file is selected
      let iconUrl = categoryForm.icon;
      if (categoryForm.iconFile) {
        const formData = new FormData();
        formData.append('files', categoryForm.iconFile);
        const uploadResponse = await FILE_API.UPLOAD_FILE(formData);
        
        if (uploadResponse.error || !uploadResponse.data || uploadResponse.data.length === 0) {
          showError('Failed to upload icon');
          setIsSubmitting(false);
          return;
        }
        iconUrl = uploadResponse.data[0].url;
      }

      const categoryData: ICreateCategory = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        status: categoryForm.status,
        icon: iconUrl || undefined,
        subcategories: newSubcategories.length > 0 ? newSubcategories : undefined,
        // Attributes are NOT sent in category creation
        // They will be linked separately via POST /api/category-attribute after category is created
      };

      if (editingItem?.data?.id) {
        // Update existing category
        const updateData: IUpdateCategory = {
          id: editingItem.data.id,
          name: categoryData.name,
          description: categoryData.description,
          status: categoryData.status,
          icon: categoryData.icon,
          // Attributes are NOT sent in category update
          // They are managed separately via POST /api/category-attribute
        };

        const response = await updateCategoryAction(updateData);
        
        if (response.error) {
          showError(response.message || 'Failed to update category');
        } else {
          showSuccess('Category updated successfully');
          setIsModalOpen(false);
          await fetchCategories();
          
          // Create new subcategories if any
          if (newSubcategories.length > 0 && response.data?.id) {
            await Promise.all(
              newSubcategories.map(sub => 
                createSubcategoryAction(response.data.id, sub)
              )
            );
            await fetchSubcategories(response.data.id);
          }
        }
      } else {
        // Create new category
        const response = await createCategoryAction(categoryData);
        
        if (response.error) {
          showError(response.message || 'Failed to create category');
        } else {
          showSuccess('Category created successfully');
          
          // Link attributes to category after creation
          if (selectedAttributes.length > 0 && response.data?.id) {
            await handleLinkAttributesToCategory(response.data.id);
          }
          
          setIsModalOpen(false);
          await fetchCategories();
        }
      }

      // Reset form
      setCategoryForm({ name: '', description: '', status: 'Active', icon: '', iconFile: null });
      setNewSubcategories([]);
      setIsAddingSubcategory(false);
      setSelectedAttributes([]);
      setIsSelectingAttribute(false);
      setSelectedAttributeId('');
      setIsAttributeRequired(false);
      setAttributeOptions([]);
      setNewAttributeOption('');
      setLinkedCategoryAttributes([]);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(c => c.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category?.name || 'this category'}"? This action cannot be undone and will also delete all associated subcategories.`,
      type: 'category',
      onConfirm: async () => {
        try {
          const response = await deleteCategoryAction(id);
          
          if (response.error) {
            showError(response.message || 'Failed to delete category');
          } else {
            showSuccess('Category deleted successfully');
            await fetchCategories();
          }
        } catch (err) {
          showError(err instanceof Error ? err.message : 'Failed to delete category');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleSubmitSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subcategoryForm.name?.trim() || !subcategoryForm.description?.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    if (!editingItem?.parentId) {
      showError('Parent category ID is missing');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingItem.data?.id) {
        // Update existing subcategory
        const response = await updateSubcategoryAction(editingItem.data.id, {
          name: subcategoryForm.name.trim(),
          description: subcategoryForm.description.trim(),
          status: subcategoryForm.status
        });
        
        if (response.error) {
          showError(response.message || 'Failed to update subcategory');
        } else {
          showSuccess('Subcategory updated successfully');
          setIsModalOpen(false);
          await fetchSubcategories(editingItem.parentId);
        }
      } else {
        // Create new subcategory
        const response = await createSubcategoryAction(editingItem.parentId, {
          name: subcategoryForm.name.trim(),
          description: subcategoryForm.description.trim(),
          status: subcategoryForm.status
        });
        
        if (response.error) {
          showError(response.message || 'Failed to create subcategory');
        } else {
          showSuccess('Subcategory created successfully');
          setIsModalOpen(false);
          await fetchSubcategories(editingItem.parentId);
          // Refresh categories to update subcategory count
          await fetchCategories();
        }
      }

      // Reset form
      setSubcategoryForm({ name: '', description: '', status: 'Active' });
    } catch (err) {
      showError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubcategory = (subcategoryId: string, categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const subcategory = category?.subcategories?.find(s => s.id === subcategoryId);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Subcategory',
      message: `Are you sure you want to delete "${subcategory?.name || 'this subcategory'}"? This action cannot be undone.`,
      type: 'subcategory',
      onConfirm: async () => {
        try {
          const response = await deleteCategoryAction(subcategoryId);
          
          if (response.error) {
            showError(response.message || 'Failed to delete subcategory');
          } else {
            showSuccess('Subcategory deleted successfully');
            await fetchSubcategories(categoryId);
            // Refresh categories to update subcategory count
            await fetchCategories();
          }
        } catch (err) {
          showError(err instanceof Error ? err.message : 'Failed to delete subcategory');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <section className="bg-jozi-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 text-left">
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                Category & Attribute <br /><span className="text-jozi-gold">Orchestrator.</span>
              </h1>
              <p className="text-jozi-cream/80 text-sm">Manage global attributes and categories in one place</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  setEditingAttribute(null);
                  setNewAttributeForm({ name: '', slug: '', type: AttributeType.TEXT, unit: undefined });
                  setIsCreateAttributeModalOpen(true);
                }}
                className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Attribute
              </button>
              <button 
                onClick={() => handleOpenModal('category')}
                className="bg-jozi-gold text-jozi-dark px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg shadow-jozi-gold/30 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Category
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Split View: Attributes & Categories */}
      <section className="container mx-auto px-4 lg:px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Attributes Table */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings2 className="w-6 h-6 text-jozi-forest" />
                  Global Attributes
                </h2>
                <p className="text-sm text-gray-500 mt-1">Reusable across categories</p>
              </div>
            </div>

            {/* Attributes Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search attributes..." 
                className="w-full bg-gray-50 border border-gray-200 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl pl-12 pr-4 py-3 font-semibold text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                value={attributeSearchQuery}
                onChange={(e) => setAttributeSearchQuery(e.target.value)}
              />
            </div>

            {/* Attributes Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left table-fixed">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="pb-3 px-2 text-xs font-bold uppercase text-gray-500 tracking-wider w-[50%]">Attribute</th>
                    <th className="pb-3 px-2 text-xs font-bold uppercase text-gray-500 tracking-wider w-[30%]">Type</th>
                    <th className="pb-3 px-2 text-right text-xs font-bold uppercase text-gray-500 tracking-wider w-[20%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingAttributes ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center">
                        <Loader2 className="w-6 h-6 text-jozi-gold animate-spin mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Loading attributes...</p>
                      </td>
                    </tr>
                  ) : filteredAttributes.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Settings2 className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-gray-500 font-semibold mb-1">No attributes found</p>
                          <p className="text-xs text-gray-400 mb-4">Create your first global attribute</p>
                          <button
                            onClick={() => {
                              setEditingAttribute(null);
                              setNewAttributeForm({ name: '', slug: '', type: AttributeType.TEXT, unit: undefined });
                              setIsCreateAttributeModalOpen(true);
                            }}
                            className="px-4 py-2 bg-jozi-forest text-white rounded-lg text-xs font-semibold hover:bg-jozi-dark transition-all"
                          >
                            <Plus className="w-3 h-3 inline mr-1" />
                            Create Attribute
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAttributes.map((attr) => {
                      const typeIcons = {
                        [AttributeType.TEXT]: Type,
                        [AttributeType.NUMBER]: Hash,
                        [AttributeType.SELECT]: List,
                        [AttributeType.BOOLEAN]: CheckCircle2,
                        [AttributeType.TEXTAREA]: Type,
                      };
                      const Icon = typeIcons[attr.type as AttributeType] || Type;
                      
                      return (
                        <tr key={attr.id} className="group hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1 overflow-hidden">
                                <p className="font-semibold text-gray-900 text-sm truncate" title={attr.name}>{attr.name}</p>
                                <p className="text-xs text-gray-500 truncate" title={attr.slug}>{attr.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold truncate block">
                              {attr.type}
                              {attr.unit && ` (${attr.unit})`}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditAttribute(attr)}
                                className="p-1.5 text-gray-400 hover:text-jozi-forest hover:bg-jozi-cream rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Edit attribute"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAttribute(attr.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Delete attribute"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {filteredAttributes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 text-center">
                  {filteredAttributes.length} {filteredAttributes.length === 1 ? 'attribute' : 'attributes'}
                </p>
              </div>
            )}
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ListTree className="w-6 h-6 text-jozi-forest" />
                  Categories
                </h2>
                <p className="text-sm text-gray-500 mt-1">Product categories & subcategories</p>
              </div>
            </div>

            {/* Categories Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  className="w-full bg-gray-50 border border-gray-200 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl pl-12 pr-4 py-3 font-semibold text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  className="bg-transparent font-semibold text-sm text-gray-700 outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left table-fixed">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="pb-3 px-2 text-xs font-bold uppercase text-gray-500 tracking-wider w-[45%]">Category</th>
                    <th className="pb-3 px-2 text-xs font-bold uppercase text-gray-500 tracking-wider w-[15%]">Subcategories</th>
                    <th className="pb-3 px-2 text-xs font-bold uppercase text-gray-500 tracking-wider w-[15%]">Status</th>
                    <th className="pb-3 px-2 text-right text-xs font-bold uppercase text-gray-500 tracking-wider w-[25%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <Loader2 className="w-6 h-6 text-jozi-gold animate-spin mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Loading categories...</p>
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Box className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-gray-500 font-semibold mb-1">No categories found</p>
                          <p className="text-xs text-gray-400 mb-4">Create your first category</p>
                          <button
                            onClick={() => handleOpenModal('category')}
                            className="px-4 py-2 bg-jozi-forest text-white rounded-lg text-xs font-semibold hover:bg-jozi-dark transition-all"
                          >
                            <Plus className="w-3 h-3 inline mr-1" />
                            Create Category
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((cat) => (
                      <tr key={cat.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-jozi-cream to-white border border-gray-200 overflow-hidden relative shrink-0">
                              {cat.icon ? (
                                <Image
                                  src={cat.icon}
                                  alt={cat.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Tag className="w-5 h-5 text-jozi-forest opacity-50" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <p className="font-semibold text-gray-900 text-sm truncate" title={cat.name}>{cat.name}</p>
                              <p className="text-xs text-gray-500 truncate" title={cat.description}>
                                {cat.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold whitespace-nowrap">
                            {cat.subcategories?.length || 0} {cat.subcategories?.length === 1 ? 'sub' : 'subs'}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <StatusBadge status={cat.status} />
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenModal('category', cat)}
                              className="p-1.5 text-gray-400 hover:text-jozi-forest hover:bg-jozi-cream rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Edit category"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredCategories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 text-center">
                  {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- Modals --- */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl text-left"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem.data ? 'Edit' : 'Create'} {editingItem.type === 'category' ? 'Category' : 'Subcategory'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 lg:p-8">
              
                <form className="space-y-8" onSubmit={editingItem.type === 'category' ? handleSubmitCategory : handleSubmitSubcategory}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          {editingItem.type === 'category' ? 'Category' : 'Subcategory'} Name *
                        </label>
                        <input 
                          type="text" 
                          value={editingItem.type === 'category' ? categoryForm.name : subcategoryForm.name || ''}
                          onChange={(e) => editingItem.type === 'category' 
                            ? setCategoryForm(prev => ({ ...prev, name: e.target.value }))
                            : setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))
                          }
                          required 
                          placeholder={editingItem.type === 'category' ? "e.g. Handmade Textiles" : "e.g. Shweshwe Dresses"} 
                          className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 font-medium text-sm text-gray-900 placeholder-gray-400 outline-none transition-all" 
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Description *</label>
                        <textarea 
                          rows={4} 
                          value={editingItem.type === 'category' ? categoryForm.description : subcategoryForm.description || ''}
                          onChange={(e) => editingItem.type === 'category'
                            ? setCategoryForm(prev => ({ ...prev, description: e.target.value }))
                            : setSubcategoryForm(prev => ({ ...prev, description: e.target.value }))
                          }
                          required 
                          placeholder={editingItem.type === 'category' ? "Describe this category..." : "Describe this subcategory..."} 
                          className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 font-medium text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none" 
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Status</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            type="button"
                            onClick={() => editingItem.type === 'category'
                              ? setCategoryForm(prev => ({ ...prev, status: 'Active' }))
                              : setSubcategoryForm(prev => ({ ...prev, status: 'Active' }))
                            }
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              (editingItem.type === 'category' ? categoryForm.status : subcategoryForm.status) === 'Active'
                                ? 'border-jozi-forest bg-jozi-forest text-white shadow-md hover:bg-jozi-dark'
                                : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <CheckCircle2 className={`w-5 h-5 mb-2 ${(editingItem.type === 'category' ? categoryForm.status : subcategoryForm.status) === 'Active' ? 'text-jozi-gold' : ''}`} />
                            <p className="text-xs font-bold uppercase tracking-wide">Active</p>
                          </button>
                          <button 
                            type="button"
                            onClick={() => editingItem.type === 'category'
                              ? setCategoryForm(prev => ({ ...prev, status: 'Inactive' }))
                              : setSubcategoryForm(prev => ({ ...prev, status: 'Inactive' }))
                            }
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              (editingItem.type === 'category' ? categoryForm.status : subcategoryForm.status) === 'Inactive'
                                ? 'border-jozi-forest bg-jozi-forest text-white shadow-md hover:bg-jozi-dark'
                                : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <XCircle className={`w-5 h-5 mb-2 ${(editingItem.type === 'category' ? categoryForm.status : subcategoryForm.status) === 'Inactive' ? 'text-jozi-gold' : ''}`} />
                            <p className="text-xs font-bold uppercase tracking-wide">Inactive</p>
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Category Icon - Only show for categories */}
                      {editingItem.type === 'category' && (
                        <div className="space-y-4">
                          <label className="block text-sm font-semibold text-gray-700">Category Icon</label>
                          <div className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center group hover:border-jozi-gold hover:bg-jozi-cream/30 cursor-pointer transition-all relative overflow-hidden">
                            {categoryForm.icon || categoryForm.iconFile ? (
                              <div className="w-full h-full relative">
                                {categoryForm.iconFile ? (
                                  <img 
                                    src={URL.createObjectURL(categoryForm.iconFile)} 
                                    alt="Category icon preview" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : categoryForm.icon ? (
                                  <Image
                                    src={categoryForm.icon}
                                    alt="Category icon"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    onError={(e) => {
                                      // Hide image on error and show placeholder
                                      const target = e.currentTarget as HTMLImageElement;
                                      target.style.display = 'none';
                                      const placeholder = target.parentElement?.querySelector('.modal-icon-placeholder') as HTMLElement;
                                      if (placeholder) placeholder.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="modal-icon-placeholder absolute inset-0 items-center justify-center bg-gray-100"
                                  style={{ display: (categoryForm.icon || categoryForm.iconFile) ? 'none' : 'flex' }}
                                >
                                  <Tag className="w-12 h-12 text-jozi-forest opacity-50" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCategoryForm(prev => ({ ...prev, icon: '', iconFile: null }))}
                                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all z-10"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        showError('File size must be less than 2MB');
                                        return;
                                      }
                                      handleIconUpload(file);
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-jozi-gold shadow-sm group-hover:scale-110 transition-transform mb-3">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-semibold text-gray-500">Upload Icon</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Subcategories Section - Only show when editing a category */}
                      {editingItem.type === 'category' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-semibold text-gray-700">
                              Subcategories
                              {newSubcategories.length > 0 && (
                                <span className="ml-2 text-xs font-normal text-jozi-gold">
                                  ({newSubcategories.length} new)
                                </span>
                              )}
                            </label>
                            <button 
                              type="button"
                              onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}
                              className="text-xs font-semibold text-jozi-forest hover:text-jozi-gold transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              {isAddingSubcategory ? 'Cancel' : 'Add Subcategory'}
                            </button>
                          </div>

                          {/* Inline Add Subcategory Form */}
                          {isAddingSubcategory && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-4 bg-jozi-cream/30 rounded-xl border-2 border-jozi-gold/20 space-y-3"
                            >
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder="Subcategory name *"
                                  value={subcategoryForm.name || ''}
                                  onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full bg-white border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleAddSubcategoryInline();
                                    }
                                  }}
                                />
                                <textarea
                                  rows={2}
                                  placeholder="Description *"
                                  value={subcategoryForm.description || ''}
                                  onChange={(e) => setSubcategoryForm(prev => ({ ...prev, description: e.target.value }))}
                                  className="w-full bg-white border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all resize-none"
                                />
                                <div className="flex items-center gap-2">
                                  <select
                                    value={subcategoryForm.status || 'Active'}
                                    onChange={(e) => setSubcategoryForm(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                                    className="flex-1 bg-white border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 outline-none transition-all"
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={handleAddSubcategoryInline}
                                    disabled={!subcategoryForm.name?.trim() || !subcategoryForm.description?.trim()}
                                    className="px-4 py-2 bg-jozi-forest text-white rounded-lg font-semibold text-sm hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Add
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Subcategories List */}
                          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {getAllSubcategories().length > 0 ? (
                              getAllSubcategories().map((sub, index) => {
                                const isNew = 'isNew' in sub && sub.isNew;
                                const subId = 'id' in sub ? sub.id : `new-${index}`;
                                const isExpanded = expandedSubcategoryForAttributes === subId;
                                const linkedAttrs = subcategoryLinkedAttributes[subId] || [];
                                const selectedAttrs = subcategorySelectedAttributes[subId] || [];
                                const isLoading = subcategoryLoadingAttributes[subId] || false;
                                const form = subcategoryAttributeForms[subId] || {
                                  selectedAttributeId: '',
                                  isRequired: false,
                                  options: [],
                                  newOption: ''
                                };
                                
                                return (
                                  <div key={subId} className="space-y-2">
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all group ${
                                      isNew 
                                        ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <ListTree className={`w-4 h-4 shrink-0 ${isNew ? 'text-emerald-600' : 'text-jozi-gold'}`} />
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm font-semibold text-gray-900 truncate">{sub.name}</p>
                                          {isNew && (
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100 px-1.5 py-0.5 rounded">
                                              New
                                            </span>
                                          )}
                                            {!isNew && (linkedAttrs.length > 0 || selectedAttrs.length > 0) && (
                                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-100 px-1.5 py-0.5 rounded">
                                                {linkedAttrs.length + selectedAttrs.length} {linkedAttrs.length + selectedAttrs.length === 1 ? 'attr' : 'attrs'}
                                              </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{sub.description}</p>
                                      </div>
                                      <StatusBadge status={sub.status} />
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                      {isNew ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleEditNewSubcategory(index)}
                                            className="p-1.5 text-gray-400 hover:text-jozi-forest transition-all"
                                            title="Edit subcategory"
                                          >
                                            <Edit3 className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveNewSubcategory(index)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 transition-all"
                                            title="Remove subcategory"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                            <button
                                              type="button"
                                              onClick={() => 'id' in sub && toggleSubcategoryAttributeManagement(sub.id)}
                                              className={`p-1.5 transition-all ${
                                                isExpanded 
                                                  ? 'text-blue-600 bg-blue-50' 
                                                  : 'text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100'
                                              }`}
                                              title="Manage attributes"
                                            >
                                              <Layers className="w-4 h-4" />
                                            </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsModalOpen(false);
                                              handleOpenModal('subcategory', sub, editingItem.data?.id);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-jozi-forest opacity-0 group-hover:opacity-100 transition-all"
                                            title="Edit subcategory"
                                          >
                                            <Edit3 className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => 'id' in sub && handleDeleteSubcategory(sub.id, editingItem.data?.id || '')}
                                            className="p-1.5 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                            title="Delete subcategory"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </motion.div>
                                    
                                    {/* Inline Attribute Management */}
                                    {!isNew && 'id' in sub && isExpanded && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="ml-4 pl-4 border-l-2 border-blue-200 space-y-4 bg-blue-50/30 rounded-lg p-4"
                                      >
                          <div className="flex items-center justify-between">
                                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Manage Attributes
                                          </h4>
                              <button 
                                type="button"
                                onClick={() => setIsCreateAttributeModalOpen(true)}
                                className="text-xs font-semibold text-gray-600 hover:text-jozi-forest transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                New Attribute
                              </button>
                          </div>
                          
                                        {/* Add Attribute Form */}
                                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold text-gray-700">Select Global Attribute *</label>
                                  <select
                                              value={form.selectedAttributeId}
                                    onChange={(e) => {
                                      const attr = globalAttributes.find(a => a.id === e.target.value);
                                                setSubcategoryAttributeForms(prev => ({
                                                  ...prev,
                                                  [subId]: {
                                                    ...prev[subId],
                                                    selectedAttributeId: e.target.value,
                                                    options: attr?.type === AttributeType.SELECT ? [] : prev[subId]?.options || []
                                      }
                                                }));
                                    }}
                                              className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 outline-none transition-all"
                                  >
                                    <option value="">Choose an attribute...</option>
                                    {globalAttributes
                                                .filter(attr => {
                                                  const linked = linkedAttrs.some(la => la.attributeId === attr.id);
                                                  const selected = selectedAttrs.some(sa => sa.attributeId === attr.id);
                                                  return !linked && !selected;
                                                })
                                      .map(attr => (
                                        <option key={attr.id} value={attr.id}>
                                          {attr.name} ({attr.type}{attr.unit ? `, ${attr.unit}` : ''})
                                        </option>
                                      ))}
                                  </select>
                                </div>

                                          {form.selectedAttributeId && (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                                  checked={form.isRequired}
                                                  onChange={(e) => {
                                                    setSubcategoryAttributeForms(prev => ({
                                                      ...prev,
                                                      [subId]: { ...prev[subId], isRequired: e.target.checked }
                                                    }));
                                                  }}
                                        className="w-4 h-4 text-jozi-forest border-gray-300 rounded focus:ring-jozi-gold"
                                      />
                                                <label className="text-xs font-semibold text-gray-700">
                                        Required field
                                      </label>
                                    </div>

                                              {/* Options for Select type */}
                                              {globalAttributes.find(a => a.id === form.selectedAttributeId)?.type === AttributeType.SELECT && (
                                      <div className="space-y-2">
                                                  <label className="text-xs font-semibold text-gray-700">Options</label>
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            placeholder="Add option value"
                                                      value={form.newOption}
                                                      onChange={(e) => {
                                                        setSubcategoryAttributeForms(prev => ({
                                                          ...prev,
                                                          [subId]: { ...prev[subId], newOption: e.target.value }
                                                        }));
                                                      }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                          handleAddSubcategoryAttributeOption(subId);
                                              }
                                            }}
                                                      className="flex-1 bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all"
                                          />
                                          <button
                                            type="button"
                                                      onClick={() => handleAddSubcategoryAttributeOption(subId)}
                                                      disabled={!form.newOption?.trim()}
                                                      className="px-3 py-2 bg-jozi-forest text-white rounded-lg font-semibold text-xs hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                                      <Plus className="w-3 h-3" />
                                          </button>
                                        </div>
                                                  {form.options.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                      {form.options.map((option, idx) => (
                                              <span
                                                key={idx}
                                                          className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                                              >
                                                {option}
                                                <button
                                                  type="button"
                                                            onClick={() => handleRemoveSubcategoryAttributeOption(subId, option)}
                                                  className="text-red-500 hover:text-red-700"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                                onClick={() => handleAddSubcategoryAttribute(subId)}
                                                className="w-full px-3 py-2 bg-jozi-forest text-white rounded-lg font-semibold text-xs hover:bg-jozi-dark transition-all flex items-center justify-center gap-2"
                                    >
                                                <Plus className="w-3 h-3" />
                                                Add to Selection
                                    </button>
                                  </>
                                )}
                              </div>

                                        {/* Selected Attributes (to be linked) */}
                                        {selectedAttrs.length > 0 && (
                                          <div className="space-y-2">
                                            <p className="text-xs font-semibold text-gray-700">Selected Attributes ({selectedAttrs.length})</p>
                                            <div className="space-y-1">
                                              {selectedAttrs.map((selected) => {
                                  const attr = globalAttributes.find(a => a.id === selected.attributeId);
                                  if (!attr) return null;
                                  return (
                                                  <div
                                      key={selected.attributeId}
                                                    className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg"
                                    >
                                          <div className="flex items-center gap-2">
                                                      <span className="text-xs font-semibold text-gray-900">{attr.name}</span>
                                            {selected.isRequired && (
                                              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                                                Required
                                              </span>
                                            )}
                                          {selected.options && selected.options.length > 0 && (
                                                        <span className="text-[10px] text-gray-500">
                                                          ({selected.options.length} options)
                                                        </span>
                                          )}
                                      </div>
                                      <button
                                        type="button"
                                                      onClick={() => handleRemoveSubcategorySelectedAttribute(subId, selected.attributeId)}
                                                      className="p-1 text-gray-400 hover:text-red-600 transition-all"
                                      >
                                                      <X className="w-3 h-3" />
                                      </button>
                                                  </div>
                                  );
                                })}
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleLinkAttributesToSubcategory(subId)}
                                              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                            >
                                              <Save className="w-3 h-3" />
                                              Link {selectedAttrs.length} Attribute{selectedAttrs.length !== 1 ? 's' : ''}
                                            </button>
                                          </div>
                                        )}

                                        {/* Linked Attributes */}
                                        {isLoading ? (
                                          <div className="py-4 text-center">
                                            <Loader2 className="w-4 h-4 text-jozi-gold animate-spin mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">Loading attributes...</p>
                                          </div>
                                        ) : linkedAttrs.length > 0 ? (
                                          <div className="space-y-2">
                                            <p className="text-xs font-semibold text-gray-700">Linked Attributes ({linkedAttrs.length})</p>
                                            <div className="space-y-1">
                                              {linkedAttrs.map((linked) => {
                                  const attr = linked.attribute || globalAttributes.find(a => a.id === linked.attributeId);
                                  if (!attr) return null;
                                  return (
                                                  <div
                                      key={linked.id}
                                                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg"
                                    >
                                          <div className="flex items-center gap-2">
                                                      <span className="text-xs font-semibold text-gray-900">{attr.name}</span>
                                            {linked.isRequired && (
                                              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                                                Required
                                              </span>
                                            )}
                                          {linked.options && linked.options.length > 0 && (
                                                        <span className="text-[10px] text-gray-500">
                                                          ({linked.options.length} options)
                                                        </span>
                                          )}
                                      </div>
                                      <button
                                        type="button"
                                                      onClick={() => handleUnlinkSubcategoryAttribute(subId, linked.id)}
                                                      className="p-1 text-gray-400 hover:text-red-600 transition-all"
                                        title="Unlink attribute"
                                      >
                                                      <Trash2 className="w-3 h-3" />
                                      </button>
                                                  </div>
                                  );
                                })}
                                            </div>
                                          </div>
                                        ) : (
                                          selectedAttrs.length === 0 && (
                                            <div className="py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                              <Layers className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                              <p className="text-xs text-gray-500">No attributes linked yet</p>
                                            </div>
                                          )
                                        )}
                                      </motion.div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <ListTree className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-400 mb-2">No subcategories yet</p>
                                <button
                                  type="button"
                                  onClick={() => setIsAddingSubcategory(true)}
                                  className="text-xs font-semibold text-jozi-forest hover:text-jozi-gold transition-colors"
                                >
                                  Add your first subcategory
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Info Banner - Attributes are linked to subcategories */}
                      {editingItem.type === 'category' && (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-blue-900 mb-1">Attributes are linked to subcategories</p>
                            <p className="text-xs text-blue-800 leading-relaxed">
                              Click the <Layers className="w-3 h-3 inline" /> icon next to any subcategory to manage its attributes. Attributes are only linked at the subcategory level, not at the category level.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                          Changes may take a few minutes to propagate across the platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 justify-end">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsModalOpen(false);
                        setNewSubcategories([]);
                        setIsAddingSubcategory(false);
                        setSubcategoryForm({ name: '', description: '', status: 'Active' });
                        setSelectedAttributes([]);
                        setIsSelectingAttribute(false);
                        setSelectedAttributeId('');
                        setIsAttributeRequired(false);
                        setAttributeOptions([]);
                        setNewAttributeOption('');
                        setLinkedCategoryAttributes([]);
                      }} 
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-jozi-forest text-white rounded-xl font-semibold text-sm hover:bg-jozi-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save {editingItem.type === 'category' ? 'Category' : 'Subcategory'}
                        </>
                      )}
                    </button>
                  </div>
                 </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {confirmModal.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {confirmModal.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={confirmModal.onConfirm}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete {confirmModal.type === 'category' ? 'Category' : 'Subcategory'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Attribute Modal */}
      <AnimatePresence>
        {isCreateAttributeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCreateAttributeModalOpen(false)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAttribute ? 'Edit' : 'Create'} Global Attribute
                </h2>
                <button 
                  onClick={() => {
                    setIsCreateAttributeModalOpen(false);
                    setEditingAttribute(null);
                    setNewAttributeForm({ name: '', slug: '', type: AttributeType.TEXT, unit: undefined });
                  }} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Attribute Name *</label>
                  <input 
                    type="text" 
                    value={newAttributeForm.name}
                    onChange={(e) => {
                      setNewAttributeForm(prev => ({ 
                        ...prev, 
                        name: e.target.value,
                        slug: prev.slug || generateSlug(e.target.value)
                      }));
                    }}
                    placeholder="e.g. Brand, Color, Size" 
                    className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 font-medium text-sm text-gray-900 placeholder-gray-400 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Slug *</label>
                  <input 
                    type="text" 
                    value={newAttributeForm.slug}
                    onChange={(e) => setNewAttributeForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. brand, color, size" 
                    className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 font-medium text-sm text-gray-900 placeholder-gray-400 outline-none transition-all" 
                  />
                  <p className="text-xs text-gray-500">URL-friendly identifier (auto-generated from name)</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Type *</label>
                  <select
                    value={newAttributeForm.type}
                    onChange={(e) => setNewAttributeForm(prev => ({ ...prev, type: e.target.value as AttributeType }))}
                    className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 font-medium text-sm text-gray-900 outline-none transition-all"
                  >
                    <option value={AttributeType.TEXT}>Text</option>
                    <option value={AttributeType.NUMBER}>Number</option>
                    <option value={AttributeType.SELECT}>Select (Dropdown)</option>
                    <option value={AttributeType.BOOLEAN}>Boolean</option>
                    <option value={AttributeType.TEXTAREA}>Textarea</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Unit (Optional)</label>
                  <input 
                    type="text" 
                    value={newAttributeForm.unit || ''}
                    onChange={(e) => setNewAttributeForm(prev => ({ ...prev, unit: e.target.value || undefined }))}
                    placeholder="e.g. months, kg, cm" 
                    className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 font-medium text-sm text-gray-900 placeholder-gray-400 outline-none transition-all" 
                  />
                  <p className="text-xs text-gray-500">Unit of measurement (e.g., "months" for warranty)</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Global attributes can be reused across multiple categories. Options for select-type attributes are set when linking to categories.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 justify-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsCreateAttributeModalOpen(false);
                      setNewAttributeForm({ name: '', slug: '', type: AttributeType.TEXT, unit: undefined });
                    }} 
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={editingAttribute ? handleUpdateAttribute : handleCreateAttribute}
                    disabled={isSubmitting || !newAttributeForm.name.trim() || !newAttributeForm.slug.trim()}
                    className="px-8 py-3 bg-jozi-forest text-white rounded-xl font-semibold text-sm hover:bg-jozi-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingAttribute ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingAttribute ? 'Update Attribute' : 'Create Attribute'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Link Attributes Modal */}
      <AnimatePresence>
        {isLinkAttributeModalOpen && selectedCategoryForLinking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => {
                setIsLinkAttributeModalOpen(false);
                setSelectedCategoryForLinking(null);
                setSelectedAttributes([]);
                setSelectedAttributeId('');
                setIsAttributeRequired(false);
                setAttributeOptions([]);
                setNewAttributeOption('');
              }} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Link Attributes to {('categoryId' in selectedCategoryForLinking && selectedCategoryForLinking.categoryId === null) ? 'Category' : 'Subcategory'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedCategoryForLinking.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsLinkAttributeModalOpen(false);
                    setSelectedCategoryForLinking(null);
                    setSelectedAttributes([]);
                    setSelectedAttributeId('');
                    setIsAttributeRequired(false);
                    setAttributeOptions([]);
                    setNewAttributeOption('');
                  }} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Select Attribute Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Add Attribute</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700">Select Global Attribute *</label>
                      <select
                        value={selectedAttributeId}
                        onChange={(e) => {
                          setSelectedAttributeId(e.target.value);
                          const attr = globalAttributes.find(a => a.id === e.target.value);
                          if (attr && attr.type === AttributeType.SELECT) {
                            setAttributeOptions([]);
                          }
                        }}
                        className="w-full bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all"
                      >
                        <option value="">Choose an attribute...</option>
                        {globalAttributes
                          .filter(attr => !linkedCategoryAttributes.some(linked => linked.attributeId === attr.id))
                          .filter(attr => !selectedAttributes.some(sa => sa.attributeId === attr.id))
                          .map(attr => (
                            <option key={attr.id} value={attr.id}>
                              {attr.name} ({attr.type}{attr.unit ? `, ${attr.unit}` : ''})
                            </option>
                          ))}
                      </select>
                    </div>

                    {selectedAttributeId && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Required</label>
                        <div className="flex items-center h-[52px]">
                          <input
                            type="checkbox"
                            id="isRequiredLink"
                            checked={isAttributeRequired}
                            onChange={(e) => setIsAttributeRequired(e.target.checked)}
                            className="w-5 h-5 text-jozi-forest border-gray-300 rounded focus:ring-jozi-gold"
                          />
                          <label htmlFor="isRequiredLink" className="ml-2 text-sm font-medium text-gray-700">
                            This attribute is required
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Options for Select type */}
                  {selectedAttributeId && globalAttributes.find(a => a.id === selectedAttributeId)?.type === AttributeType.SELECT && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700">Options (for this category)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add option value"
                          value={newAttributeOption}
                          onChange={(e) => setNewAttributeOption(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAttributeOption();
                            }
                          }}
                          className="flex-1 bg-gray-50 border border-gray-300 focus:border-jozi-gold focus:ring-2 focus:ring-jozi-gold/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleAddAttributeOption}
                          disabled={!newAttributeOption?.trim()}
                          className="px-4 py-2 bg-jozi-forest text-white rounded-xl font-semibold text-sm hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {attributeOptions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {attributeOptions.map((option, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                            >
                              {option}
                              <button
                                type="button"
                                onClick={() => handleRemoveAttributeOption(option)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedAttributeId && (
                    <button
                      type="button"
                      onClick={handleAddSelectedAttribute}
                      disabled={!selectedAttributeId}
                      className="w-full px-4 py-2 bg-jozi-forest text-white rounded-xl font-semibold text-sm hover:bg-jozi-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Selection
                    </button>
                  )}
                </div>

                {/* Linked Attributes List */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Linked Attributes ({linkedCategoryAttributes.length + selectedAttributes.length})
                  </h3>
                  
                  {loadingLinkedAttributes ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-6 h-6 text-jozi-gold animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Loading linked attributes...</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {/* Selected attributes (to be linked) */}
                      {selectedAttributes.map((selected) => {
                        const attr = globalAttributes.find(a => a.id === selected.attributeId);
                        if (!attr) return null;
                        
                        const typeIcons = {
                          [AttributeType.TEXT]: Type,
                          [AttributeType.NUMBER]: Hash,
                          [AttributeType.SELECT]: List,
                          [AttributeType.BOOLEAN]: CheckCircle2,
                          [AttributeType.TEXTAREA]: Type,
                        };
                        const Icon = typeIcons[attr.type as AttributeType] || Type;
                        
                        return (
                          <div
                            key={selected.attributeId}
                            className="flex items-center justify-between p-3 rounded-lg border bg-emerald-50 border-emerald-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{attr.name}</p>
                                {selected.options && selected.options.length > 0 && (
                                  <p className="text-xs text-gray-500">Options: {selected.options.join(', ')}</p>
                                )}
                              </div>
                              {selected.isRequired && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedAttribute(selected.attributeId)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                      
                      {/* Already linked attributes */}
                      {linkedCategoryAttributes.map((linked) => {
                        const attr = linked.attribute || globalAttributes.find(a => a.id === linked.attributeId);
                        if (!attr) return null;
                        
                        const typeIcons = {
                          [AttributeType.TEXT]: Type,
                          [AttributeType.NUMBER]: Hash,
                          [AttributeType.SELECT]: List,
                          [AttributeType.BOOLEAN]: CheckCircle2,
                          [AttributeType.TEXTAREA]: Type,
                        };
                        const Icon = typeIcons[attr.type as AttributeType] || Type;
                        
                        return (
                          <div
                            key={linked.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{attr.name}</p>
                                {linked.options && linked.options.length > 0 && (
                                  <p className="text-xs text-gray-500">Options: {linked.options.join(', ')}</p>
                                )}
                              </div>
                              {linked.isRequired && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm('Are you sure you want to unlink this attribute?')) {
                                  const response = await deleteCategoryAttributeAction(linked.id);
                                  if (!response.error) {
                                    showSuccess('Attribute unlinked successfully');
                                    await fetchLinkedCategoryAttributes(selectedCategoryForLinking.id);
                                  } else {
                                    showError(response.message || 'Failed to unlink attribute');
                                  }
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                      
                      {selectedAttributes.length === 0 && linkedCategoryAttributes.length === 0 && (
                        <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                          <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No attributes linked yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsLinkAttributeModalOpen(false);
                      setSelectedCategoryForLinking(null);
                      setSelectedAttributes([]);
                      setSelectedAttributeId('');
                      setIsAttributeRequired(false);
                      setAttributeOptions([]);
                      setNewAttributeOption('');
                    }} 
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={async () => {
                      if (selectedAttributes.length > 0) {
                        await handleLinkAttributesToCategory(selectedCategoryForLinking.id);
                        await fetchLinkedCategoryAttributes(selectedCategoryForLinking.id);
                        setSelectedAttributes([]);
                        setSelectedAttributeId('');
                        setIsAttributeRequired(false);
                        setAttributeOptions([]);
                        setNewAttributeOption('');
                      }
                    }}
                    disabled={selectedAttributes.length === 0}
                    className="px-8 py-3 bg-jozi-forest text-white rounded-xl font-semibold text-sm hover:bg-jozi-dark transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Link {selectedAttributes.length > 0 ? `${selectedAttributes.length} ` : ''}Attribute{selectedAttributes.length !== 1 ? 's' : ''}
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

export default AdminCategoryManagement;