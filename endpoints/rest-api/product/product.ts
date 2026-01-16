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
   * Get products by category ID
   */
  GET_PRODUCTS_BY_CATEGORY_ID: async (categoryId: string): Promise<CustomResponse<IProduct[]>> => {
    try {
      logger.info(`[PRODUCT_API] Fetching products by category ID: ${categoryId}`);
      const response = await GET(`${ProductBaseURL}/category/${categoryId}`);
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
   * Get products by subcategory ID
   */
  GET_PRODUCTS_BY_SUBCATEGORY_ID: async (subcategoryId: string): Promise<CustomResponse<IProduct[]>> => {
    try {
      logger.info(`[PRODUCT_API] Fetching products by subcategory ID: ${subcategoryId}`);
      const response = await GET(`${ProductBaseURL}/subcategory/${subcategoryId}`);
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
   * Get products by user ID (vendor's products)
   */
  GET_PRODUCTS_BY_USER_ID: async (userId: string, status?: string): Promise<CustomResponse<IProduct[]>> => {
    try {
      const url = status
        ? `${ProductBaseURL}/user/${userId}?status=${encodeURIComponent(status)}`
        : `${ProductBaseURL}/user/${userId}`;
      logger.info(`[PRODUCT_API] Fetching products by user ID: ${userId}${status ? ` with status: ${status}` : ''}`);
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
   * Get all products with optional status filter
   */
  GET_ALL_PRODUCTS: async (status?: string): Promise<CustomResponse<IProduct[]>> => {
    try {
      const url = status
        ? `${baseUrl}/products?status=${encodeURIComponent(status)}`
        : `${baseUrl}/products`;
      logger.info(`[PRODUCT_API] Fetching all products${status ? ` with status: ${status}` : ''}`);
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
