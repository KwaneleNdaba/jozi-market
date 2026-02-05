import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { IProduct, ICreateProduct, IUpdateProduct } from "@/interfaces/product/product";
import { POST, GET, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const ProductBaseURL = `${baseUrl}/product`;

export const PRODUCT_API = {
  /**
   * Create a new product
   */
  CREATE_PRODUCT: async (productData: ICreateProduct): Promise<CustomResponse<IProduct>> => {
    try {
      logger.info(`[PRODUCT_API] Creating product: ${productData.title}`);
      const response = await POST(`${ProductBaseURL}`, productData);
      logger.info(`[PRODUCT_API] Product created successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error creating product:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to create product",
        error: true,
      };
    }
  },

  /**
   * Get product by ID
   */
  GET_PRODUCT_BY_ID: async (id: string): Promise<CustomResponse<IProduct>> => {
    try {
      logger.info(`[PRODUCT_API] Fetching product by ID: ${id}`);
      const response = await GET(`${ProductBaseURL}/${id}`);
      logger.info(`[PRODUCT_API] Product fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error fetching product:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch product",
        error: true,
      };
    }
  },

  /**
   * Get product by SKU
   */
  GET_PRODUCT_BY_SKU: async (sku: string): Promise<CustomResponse<IProduct>> => {
    try {
      logger.info(`[PRODUCT_API] Fetching product by SKU: ${sku}`);
      const response = await GET(`${ProductBaseURL}/sku/${sku}`);
      logger.info(`[PRODUCT_API] Product fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error fetching product:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to fetch product",
        error: true,
      };
    }
  },

  /**
   * Get products by category ID with pagination
   */
  GET_PRODUCTS_BY_CATEGORY_ID: async (
    categoryId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CustomResponse<IProduct[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      
      const url = `${ProductBaseURL}/category/${categoryId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      logger.info(`[PRODUCT_API] Fetching products by category ID: ${categoryId}`);
      const response = await GET(url);
      logger.info(`[PRODUCT_API] Products fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error fetching products:", err);
      return {
        data: [] as IProduct[],
        message: err?.message || "Failed to fetch products",
        error: true,
      };
    }
  },

  /**
   * Get products by subcategory ID with pagination
   */
  GET_PRODUCTS_BY_SUBCATEGORY_ID: async (
    subcategoryId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CustomResponse<IProduct[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      
      const url = `${ProductBaseURL}/subcategory/${subcategoryId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      logger.info(`[PRODUCT_API] Fetching products by subcategory ID: ${subcategoryId}`);
      const response = await GET(url);
      logger.info(`[PRODUCT_API] Products fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error fetching products:", err);
      return {
        data: [] as IProduct[],
        message: err?.message || "Failed to fetch products",
        error: true,
      };
    }
  },

  /**
   * Get products by user ID (vendor's products) with pagination
   */
  GET_PRODUCTS_BY_USER_ID: async (
    userId: string,
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<CustomResponse<IProduct[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.set('status', params.status);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      
      const url = `${ProductBaseURL}/user/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      logger.info(`[PRODUCT_API] Fetching products by user ID: ${userId}${params?.status ? ` with status: ${params.status}` : ''}`);
      const response = await GET(url);
      logger.info(`[PRODUCT_API] Products fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error fetching products by user ID:", err);
      return {
        data: [] as IProduct[],
        message: err?.message || "Failed to fetch products",
        error: true,
      };
    }
  },

  /**
   * Get all products with optional status filter and pagination
   */
  GET_ALL_PRODUCTS: async (
    params?: { status?: string; page?: number; limit?: number }
  ): Promise<CustomResponse<IProduct[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.set('status', params.status);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      
      const url = `${baseUrl}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      logger.info(`[PRODUCT_API] Fetching all products${params?.status ? ` with status: ${params.status}` : ''}`);
      const response = await GET(url);
      logger.info(`[PRODUCT_API] Products fetched successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error fetching products:", err);
      return {
        data: [] as IProduct[],
        message: err?.message || "Failed to fetch products",
        error: true,
      };
    }
  },

  /**
   * Update product
   */
  UPDATE_PRODUCT: async (updateData: IUpdateProduct): Promise<CustomResponse<IProduct>> => {
    try {
      logger.info(`[PRODUCT_API] Updating product: ${updateData.id}`);
      const response = await PUT(`${ProductBaseURL}`, updateData);
      logger.info(`[PRODUCT_API] Product updated successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error updating product:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to update product",
        error: true,
      };
    }
  },

  /**
   * Delete product
   */
  DELETE_PRODUCT: async (id: string): Promise<CustomResponse<void>> => {
    try {
      logger.info(`[PRODUCT_API] Deleting product: ${id}`);
      const response = await DELETE(`${ProductBaseURL}/${id}`);
      logger.info(`[PRODUCT_API] Product deleted successfully`);
      return response;
    } catch (err: any) {
      logger.error("[PRODUCT_API] Error deleting product:", err);
      return {
        data: null as any,
        message: err?.message || "Failed to delete product",
        error: true,
      };
    }
  },
};
