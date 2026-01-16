'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { ICategory, ICreateCategory, IUpdateCategory, ICreateSubcategory } from '@/interfaces/category/category';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';

/**
 * Server action to create a category with optional subcategories
 */
export async function createCategoryAction(
  categoryData: ICreateCategory
): Promise<CustomResponse<ICategory>> {
  try {
    logger.info('[Category Action] Creating category:', {
      name: categoryData.name,
      subcategoriesCount: categoryData.subcategories?.length || 0,
    });

    const response = await serverPOST(`${baseUrl}/category`, categoryData);
    
    logger.info('[Category Action] Category created successfully:', {
      id: response?.data?.id,
      name: response?.data?.name,
    });

    return response;
  } catch (err) {
    logger.error('[Category Action] Error creating category:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to create category',
      error: true,
    };
  }
}

/**
 * Server action to get all categories
 */
export async function getAllCategoriesAction(
  status?: string
): Promise<CustomResponse<ICategory[]>> {
  try {
    const url = status
      ? `${baseUrl}/categories?status=${encodeURIComponent(status)}`
      : `${baseUrl}/categories`;

    logger.info('[Category Action] Fetching categories', status ? `with status: ${status}` : '');
    
    const response = await serverGET(url);
    
    logger.info('[Category Action] Categories fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Category Action] Error fetching categories:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch categories',
      error: true,
    };
  }
}

/**
 * Server action to get category by ID
 */
export async function getCategoryByIdAction(
  id: string
): Promise<CustomResponse<ICategory>> {
  try {
    logger.info('[Category Action] Fetching category:', id);
    
    const response = await serverGET(`${baseUrl}/category/${id}`);
    
    logger.info('[Category Action] Category fetched successfully');

    return response;
  } catch (err) {
    logger.error('[Category Action] Error fetching category:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to fetch category',
      error: true,
    };
  }
}

/**
 * Server action to get subcategories by category ID
 */
export async function getSubcategoriesByCategoryIdAction(
  categoryId: string
): Promise<CustomResponse<ICategory[]>> {
  try {
    logger.info('[Category Action] Fetching subcategories for category:', categoryId);
    
    const response = await serverGET(`${baseUrl}/category/${categoryId}/subcategories`);
    
    logger.info('[Category Action] Subcategories fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Category Action] Error fetching subcategories:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch subcategories',
      error: true,
    };
  }
}

/**
 * Server action to update category
 */
export async function updateCategoryAction(
  updateData: IUpdateCategory
): Promise<CustomResponse<ICategory>> {
  try {
    logger.info('[Category Action] Updating category:', updateData.id);
    
    const response = await serverPUT(`${baseUrl}/category`, updateData);
    
    logger.info('[Category Action] Category updated successfully');

    return response;
  } catch (err) {
    logger.error('[Category Action] Error updating category:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to update category',
      error: true,
    };
  }
}

/**
 * Server action to delete category
 */
export async function deleteCategoryAction(
  id: string
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Category Action] Deleting category:', id);
    
    const response = await serverDELETE(`${baseUrl}/category/${id}`);
    
    logger.info('[Category Action] Category deleted successfully');

    return response;
  } catch (err) {
    logger.error('[Category Action] Error deleting category:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to delete category',
      error: true,
    };
  }
}

/**
 * Server action to create a subcategory (category with parent)
 */
export async function createSubcategoryAction(
  categoryId: string,
  subcategoryData: ICreateSubcategory
): Promise<CustomResponse<ICategory>> {
  try {
    logger.info('[Category Action] Creating subcategory:', {
      categoryId,
      name: subcategoryData.name,
    });

    const categoryData: ICreateCategory = {
      name: subcategoryData.name,
      description: subcategoryData.description,
      status: subcategoryData.status,
      categoryId, // Set parent category ID
    };

    const response = await serverPOST(`${baseUrl}/category`, categoryData);
    
    // If backend returns categoryId as null, update it immediately
    if (response?.data && (!response.data.categoryId || response.data.categoryId === null)) {
      logger.info('[Category Action] Backend returned null categoryId, updating with parent ID');
      
      const updateResponse = await serverPUT(`${baseUrl}/category`, {
        id: response.data.id,
        categoryId, // Set the parent category ID
      });
      
      if (!updateResponse.error && updateResponse.data) {
        logger.info('[Category Action] Subcategory parent ID updated successfully');
        return {
          ...response,
          data: updateResponse.data,
        };
      } else {
        logger.warn('[Category Action] Failed to update subcategory parent ID, but subcategory was created');
      }
    }
    
    logger.info('[Category Action] Subcategory created successfully:', {
      id: response?.data?.id,
      name: response?.data?.name,
      categoryId: response?.data?.categoryId,
    });

    return response;
  } catch (err) {
    logger.error('[Category Action] Error creating subcategory:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to create subcategory',
      error: true,
    };
  }
}

/**
 * Server action to update a subcategory
 */
export async function updateSubcategoryAction(
  subcategoryId: string,
  updateData: Partial<ICreateSubcategory>
): Promise<CustomResponse<ICategory>> {
  try {
    logger.info('[Category Action] Updating subcategory:', subcategoryId);
    
    const updatePayload: IUpdateCategory = {
      id: subcategoryId,
      ...updateData,
    };

    const response = await serverPUT(`${baseUrl}/category`, updatePayload);
    
    logger.info('[Category Action] Subcategory updated successfully');

    return response;
  } catch (err) {
    logger.error('[Category Action] Error updating subcategory:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to update subcategory',
      error: true,
    };
  }
}
