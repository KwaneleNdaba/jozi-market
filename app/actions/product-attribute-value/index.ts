'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import {
  IProductAttributeValue,
  ICreateProductAttributeValue,
  ICreateBulkProductAttributeValue,
  IUpdateProductAttributeValue,
} from '@/interfaces/product-attribute-value/productAttributeValue';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';

/**
 * Server action to create a product attribute value
 */
export async function createProductAttributeValueAction(
  productAttributeValueData: ICreateProductAttributeValue
): Promise<CustomResponse<IProductAttributeValue>> {
  try {
    logger.info('[Product Attribute Value Action] Creating product attribute value:', {
      productId: productAttributeValueData.productId,
      attributeId: productAttributeValueData.attributeId,
    });

    const response = await serverPOST(`${baseUrl}/product-attribute-value`, productAttributeValueData);

    logger.info('[Product Attribute Value Action] Product attribute value created successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error creating product attribute value:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to create product attribute value',
      error: true,
    };
  }
}

/**
 * Server action to create bulk product attribute values
 */
export async function createBulkProductAttributeValuesAction(
  bulkData: ICreateBulkProductAttributeValue
): Promise<CustomResponse<IProductAttributeValue[]>> {
  try {
    logger.info('[Product Attribute Value Action] Creating bulk product attribute values:', {
      productId: bulkData.productId,
      count: bulkData.attributes.length,
    });

    const response = await serverPOST(`${baseUrl}/product-attribute-value/bulk`, bulkData);

    logger.info('[Product Attribute Value Action] Bulk product attribute values created successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error creating bulk product attribute values:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to create bulk product attribute values',
      error: true,
    };
  }
}

/**
 * Server action to get product attribute value by ID
 */
export async function getProductAttributeValueByIdAction(
  id: string
): Promise<CustomResponse<IProductAttributeValue>> {
  try {
    logger.info('[Product Attribute Value Action] Fetching product attribute value:', id);

    const response = await serverGET(`${baseUrl}/product-attribute-value/${id}`);

    logger.info('[Product Attribute Value Action] Product attribute value fetched successfully');

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error fetching product attribute value:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to fetch product attribute value',
      error: true,
    };
  }
}

/**
 * Server action to get product attribute values by product ID
 */
export async function getProductAttributeValuesByProductIdAction(
  productId: string
): Promise<CustomResponse<IProductAttributeValue[]>> {
  try {
    logger.info('[Product Attribute Value Action] Fetching product attribute values for product:', productId);

    const response = await serverGET(`${baseUrl}/product-attribute-value/product/${productId}`);

    logger.info('[Product Attribute Value Action] Product attribute values fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error fetching product attribute values by product ID:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch product attribute values by product ID',
      error: true,
    };
  }
}

/**
 * Server action to get product attribute values by attribute ID
 */
export async function getProductAttributeValuesByAttributeIdAction(
  attributeId: string
): Promise<CustomResponse<IProductAttributeValue[]>> {
  try {
    logger.info('[Product Attribute Value Action] Fetching product attribute values for attribute:', attributeId);

    const response = await serverGET(`${baseUrl}/product-attribute-value/attribute/${attributeId}`);

    logger.info('[Product Attribute Value Action] Product attribute values fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error fetching product attribute values by attribute ID:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch product attribute values by attribute ID',
      error: true,
    };
  }
}

/**
 * Server action to get all product attribute values
 */
export async function getAllProductAttributeValuesAction(): Promise<CustomResponse<IProductAttributeValue[]>> {
  try {
    logger.info('[Product Attribute Value Action] Fetching all product attribute values');

    const response = await serverGET(`${baseUrl}/product-attribute-values`);

    logger.info('[Product Attribute Value Action] All product attribute values fetched successfully:', {
      count: response?.data?.length || 0,
    });

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error fetching all product attribute values:', err);
    return {
      data: [],
      message: err instanceof Error ? err.message : 'Failed to fetch all product attribute values',
      error: true,
    };
  }
}

/**
 * Server action to update product attribute value
 */
export async function updateProductAttributeValueAction(
  updateData: IUpdateProductAttributeValue
): Promise<CustomResponse<IProductAttributeValue>> {
  try {
    logger.info('[Product Attribute Value Action] Updating product attribute value:', updateData.id);

    const response = await serverPUT(`${baseUrl}/product-attribute-value`, updateData);

    logger.info('[Product Attribute Value Action] Product attribute value updated successfully');

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error updating product attribute value:', err);
    return {
      data: null as any,
      message: err instanceof Error ? err.message : 'Failed to update product attribute value',
      error: true,
    };
  }
}

/**
 * Server action to delete product attribute value
 */
export async function deleteProductAttributeValueAction(
  id: string
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Product Attribute Value Action] Deleting product attribute value:', id);

    const response = await serverDELETE(`${baseUrl}/product-attribute-value/${id}`);

    logger.info('[Product Attribute Value Action] Product attribute value deleted successfully');

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error deleting product attribute value:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to delete product attribute value',
      error: true,
    };
  }
}

/**
 * Server action to delete all product attribute values by product ID
 */
export async function deleteProductAttributeValuesByProductIdAction(
  productId: string
): Promise<CustomResponse<null>> {
  try {
    logger.info('[Product Attribute Value Action] Deleting product attribute values for product:', productId);

    const response = await serverDELETE(`${baseUrl}/product-attribute-value/product/${productId}`);

    logger.info('[Product Attribute Value Action] Product attribute values deleted successfully');

    return response;
  } catch (err) {
    logger.error('[Product Attribute Value Action] Error deleting product attribute values by product ID:', err);
    return {
      data: null,
      message: err instanceof Error ? err.message : 'Failed to delete product attribute values by product ID',
      error: true,
    };
  }
}
