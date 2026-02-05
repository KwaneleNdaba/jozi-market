'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { IProduct, ICreateProduct, IUpdateProduct } from '@/interfaces/product/product';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

/**
 * Server action to create a product
 * Automatically adds userId from the authenticated user's token if not provided
 */
export async function createProductAction(
  productData: ICreateProduct
): Promise<CustomResponse<IProduct>> {
  try {
    // Get userId from token if not provided
    if (!productData.userId) {
      const decodedUser = await decodeServerAccessToken();
      if (!decodedUser?.id) {
        return {
          data: null as any,
          message: 'Authentication required. Please log in to create a product.',
          error: true,
        };
      }
      productData.userId = decodedUser.id;
    }

    logger.info('[Product Action] Creating product:', {
      title: productData.title,
      sku: productData.sku,
      userId: productData.userId,
      categoryId: productData.technicalDetails.categoryId,
      subcategoryId: productData.technicalDetails.subcategoryId,
    });

    const response = await serverPOST(`${baseUrl}/product`, productData);
    
    logger.info('[Product Action] Product created successfully:', {
      id: response?.data?.id,
      title: response?.data?.title,
    });

    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error creating product:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create product',
      error: true,
    };
  }
}

/**
 * Server action to get product by ID
 */
export async function getProductByIdAction(
  id: string
): Promise<CustomResponse<IProduct>> {
  try {
    logger.info('[Product Action] Fetching product by ID:', id);
    const response = await serverGET(`${baseUrl}/product/${id}`);
    logger.info('[Product Action] Product fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error fetching product:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch product',
      error: true,
    };
  }
}

/**
 * Server action to get product by SKU
 */
export async function getProductBySkuAction(
  sku: string
): Promise<CustomResponse<IProduct>> {
  try {
    logger.info('[Product Action] Fetching product by SKU:', sku);
    const response = await serverGET(`${baseUrl}/product/sku/${sku}`);
    logger.info('[Product Action] Product fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error fetching product:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch product',
      error: true,
    };
  }
}

/**
 * Server action to get products by category ID
 */
export async function getProductsByCategoryIdAction(
  categoryId: string,
  params?: { page?: number; limit?: number }
): Promise<CustomResponse<IProduct[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const url = `${baseUrl}/product/category/${categoryId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    logger.info('[Product Action] Fetching products by category ID:', categoryId);
    const response = await serverGET(url);
    logger.info('[Product Action] Products fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error fetching products:', err);
    return {
      data: [] as IProduct[],
      message: err?.message || 'Failed to fetch products',
      error: true,
    };
  }
}

/**
 * Server action to get products by subcategory ID
 */
export async function getProductsBySubcategoryIdAction(
  subcategoryId: string,
  params?: { page?: number; limit?: number }
): Promise<CustomResponse<IProduct[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const url = `${baseUrl}/product/subcategory/${subcategoryId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    logger.info('[Product Action] Fetching products by subcategory ID:', subcategoryId);
    const response = await serverGET(url);
    logger.info('[Product Action] Products fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error fetching products:', err);
    return {
      data: [] as IProduct[],
      message: err?.message || 'Failed to fetch products',
      error: true,
    };
  }
}

/**
 * Server action to get products by user ID (vendor's products)
 */
export async function getProductsByUserIdAction(
  userId: string,
  status?: string
): Promise<CustomResponse<IProduct[]>> {
  try {
    const url = status
      ? `${baseUrl}/product/user/${userId}?status=${encodeURIComponent(status)}`
      : `${baseUrl}/product/user/${userId}`;
    
    logger.info('[Product Action] Fetching products by user ID:', userId, status ? `with status: ${status}` : '');
    const response = await serverGET(url);
    logger.info('[Product Action] Products fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error fetching products by user ID:', err);
    return {
      data: [] as IProduct[],
      message: err?.message || 'Failed to fetch products',
      error: true,
    };
  }
}

/**
 * Server action to get current user's products
 * Automatically uses the authenticated user's ID from token
 */
export async function getMyProductsAction(
  status?: string
): Promise<CustomResponse<IProduct[]>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: [] as IProduct[],
        message: 'Authentication required. Please log in to view your products.',
        error: true,
      };
    }

    return await getProductsByUserIdAction(decodedUser.id, status);
  } catch (err: any) {
    logger.error('[Product Action] Error fetching my products:', err);
    return {
      data: [] as IProduct[],
      message: err?.message || 'Failed to fetch products',
      error: true,
    };
  }
}

/**
 * Server action to get all products with optional status filter
 */
export async function getAllProductsAction(
  params?: { status?: string; page?: number; limit?: number }
): Promise<CustomResponse<IProduct[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    
    const url = `${baseUrl}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    logger.info('[Product Action] Fetching all products', params?.status ? `with status: ${params.status}` : '');
    const response = await serverGET(url);
    logger.info('[Product Action] Products fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error fetching products:', err);
    return {
      data: [] as IProduct[],
      message: err?.message || 'Failed to fetch products',
      error: true,
    };
  }
}

/**
 * Server action to update a product
 */
export async function updateProductAction(
  updateData: IUpdateProduct
): Promise<CustomResponse<IProduct>> {
  try {
    logger.info('[Product Action] Updating product:', {
      id: updateData.id,
      title: updateData.title,
    });

    const response = await serverPUT(`${baseUrl}/product`, updateData);
    
    logger.info('[Product Action] Product updated successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error updating product:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update product',
      error: true,
    };
  }
}

/**
 * Server action to delete a product
 */
export async function deleteProductAction(
  id: string
): Promise<CustomResponse<void>> {
  try {
    logger.info('[Product Action] Deleting product:', id);
    const response = await serverDELETE(`${baseUrl}/product/${id}`);
    logger.info('[Product Action] Product deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Product Action] Error deleting product:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete product',
      error: true,
    };
  }
}
