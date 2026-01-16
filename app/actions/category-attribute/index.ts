'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { ICategoryAttribute, ICreateCategoryAttribute, IUpdateCategoryAttribute } from '@/interfaces/attribute/attribute';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';

/**
 * Server action to link an attribute to a category
 */
export async function createCategoryAttributeAction(
  data: ICreateCategoryAttribute
): Promise<CustomResponse<ICategoryAttribute>> {
  try {
    logger.info('[Category Attribute Action] Linking attribute to category:', {
      categoryId: data.categoryId,
      attributeId: data.attributeId,
    });

    const response = await serverPOST(`${baseUrl}/category-attribute`, data);
    
    logger.info('[Category Attribute Action] Category attribute created successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err) {
    logger.error('[Category Attribute Action] Error creating category attribute:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to link attribute to category',
      error: true,
    };
  }
}

/**
 * Server action to get all category attributes
 */
export async function getAllCategoryAttributesAction(): Promise<CustomResponse<ICategoryAttribute[]>> {
  try {
    logger.info('[Category Attribute Action] Fetching all category attributes');
    
    const response = await serverGET(`${baseUrl}/category-attributes`);
    
    logger.info('[Category Attribute Action] Category attributes fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Category Attribute Action] Error fetching category attributes:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch category attributes',
      error: true,
    };
  }
}

/**
 * Server action to get category attributes by category ID
 */
export async function getCategoryAttributesByCategoryIdAction(
  categoryId: string
): Promise<CustomResponse<ICategoryAttribute[]>> {
  try {
    logger.info('[Category Attribute Action] Fetching category attributes for category:', categoryId);
    
    const response = await serverGET(`${baseUrl}/category-attribute/category/${categoryId}`);
    
    logger.info('[Category Attribute Action] Category attributes fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Category Attribute Action] Error fetching category attributes:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch category attributes',
      error: true,
    };
  }
}

/**
 * Server action to get category attribute by ID
 */
export async function getCategoryAttributeByIdAction(
  id: string
): Promise<CustomResponse<ICategoryAttribute>> {
  try {
    logger.info('[Category Attribute Action] Fetching category attribute:', id);
    
    const response = await serverGET(`${baseUrl}/category-attribute/${id}`);
    
    logger.info('[Category Attribute Action] Category attribute fetched successfully');

    return response;
  } catch (err) {
    logger.error('[Category Attribute Action] Error fetching category attribute:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to fetch category attribute',
      error: true,
    };
  }
}

/**
 * Server action to update category attribute
 */
export async function updateCategoryAttributeAction(
  updateData: IUpdateCategoryAttribute
): Promise<CustomResponse<ICategoryAttribute>> {
  try {
    logger.info('[Category Attribute Action] Updating category attribute:', updateData.id);
    
    const response = await serverPUT(`${baseUrl}/category-attribute`, updateData);
    
    logger.info('[Category Attribute Action] Category attribute updated successfully');

    return response;
  } catch (err) {
    logger.error('[Category Attribute Action] Error updating category attribute:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to update category attribute',
      error: true,
    };
  }
}

/**
 * Server action to delete category attribute (unlink attribute from category)
 */
export async function deleteCategoryAttributeAction(
  id: string
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Category Attribute Action] Deleting category attribute:', id);
    
    const response = await serverDELETE(`${baseUrl}/category-attribute/${id}`);
    
    logger.info('[Category Attribute Action] Category attribute deleted successfully');

    return response;
  } catch (err) {
    logger.error('[Category Attribute Action] Error deleting category attribute:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to delete category attribute',
      error: true,
    };
  }
}
