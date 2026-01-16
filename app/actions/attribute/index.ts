'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { IAttribute, ICreateAttribute, IUpdateAttribute } from '@/interfaces/attribute/attribute';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';

/**
 * Server action to create a global attribute
 */
export async function createAttributeAction(
  attributeData: ICreateAttribute
): Promise<CustomResponse<IAttribute>> {
  try {
    logger.info('[Attribute Action] Creating attribute:', {
      name: attributeData.name,
      slug: attributeData.slug,
    });

    const response = await serverPOST(`${baseUrl}/attribute`, attributeData);
    
    logger.info('[Attribute Action] Attribute created successfully:', {
      id: response?.data?.id,
      name: response?.data?.name,
    });

    return response;
  } catch (err) {
    logger.error('[Attribute Action] Error creating attribute:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to create attribute',
      error: true,
    };
  }
}

/**
 * Server action to get all attributes
 */
export async function getAllAttributesAction(): Promise<CustomResponse<IAttribute[]>> {
  try {
    logger.info('[Attribute Action] Fetching all attributes');
    
    const response = await serverGET(`${baseUrl}/attributes`);
    
    logger.info('[Attribute Action] Attributes fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Attribute Action] Error fetching attributes:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch attributes',
      error: true,
    };
  }
}

/**
 * Server action to get attribute by ID
 */
export async function getAttributeByIdAction(
  id: string
): Promise<CustomResponse<IAttribute>> {
  try {
    logger.info('[Attribute Action] Fetching attribute:', id);
    
    const response = await serverGET(`${baseUrl}/attribute/${id}`);
    
    logger.info('[Attribute Action] Attribute fetched successfully');

    return response;
  } catch (err) {
    logger.error('[Attribute Action] Error fetching attribute:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to fetch attribute',
      error: true,
    };
  }
}

/**
 * Server action to update attribute
 */
export async function updateAttributeAction(
  updateData: IUpdateAttribute
): Promise<CustomResponse<IAttribute>> {
  try {
    logger.info('[Attribute Action] Updating attribute:', updateData.id);
    
    const response = await serverPUT(`${baseUrl}/attribute`, updateData);
    
    logger.info('[Attribute Action] Attribute updated successfully');

    return response;
  } catch (err) {
    logger.error('[Attribute Action] Error updating attribute:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to update attribute',
      error: true,
    };
  }
}

/**
 * Server action to delete attribute
 */
export async function deleteAttributeAction(
  id: string
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Attribute Action] Deleting attribute:', id);
    
    const response = await serverDELETE(`${baseUrl}/attribute/${id}`);
    
    logger.info('[Attribute Action] Attribute deleted successfully');

    return response;
  } catch (err) {
    logger.error('[Attribute Action] Error deleting attribute:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to delete attribute',
      error: true,
    };
  }
}
