import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import {
  IProductAttributeValue,
  ICreateProductAttributeValue,
  ICreateBulkProductAttributeValue,
  IUpdateProductAttributeValue,
} from "@/interfaces/product-attribute-value/productAttributeValue";
import { GET, POST, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const ProductAttributeValueBaseURL = `${baseUrl}/product-attribute-value`;

export const PRODUCT_ATTRIBUTE_VALUE_API = {
  /**
   * Create a new product attribute value
   */
  CREATE_PRODUCT_ATTRIBUTE_VALUE: async (
    productAttributeValueData: ICreateProductAttributeValue
  ): Promise<CustomResponse<IProductAttributeValue>> => {
    try {
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Creating product attribute value for product: ${productAttributeValueData.productId}`
      );
      const response = await POST(`${ProductAttributeValueBaseURL}`, productAttributeValueData);
      logger.info(`[PRODUCT_ATTRIBUTE_VALUE_API] Product attribute value created successfully`);
      return response;
    } catch (err) {
      logger.error("[PRODUCT_ATTRIBUTE_VALUE_API] Error creating product attribute value:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to create product attribute value",
        error: true,
      };
    }
  },

  /**
   * Create bulk product attribute values
   */
  CREATE_BULK_PRODUCT_ATTRIBUTE_VALUES: async (
    bulkData: ICreateBulkProductAttributeValue
  ): Promise<CustomResponse<IProductAttributeValue[]>> => {
    try {
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Creating bulk product attribute values for product: ${bulkData.productId}`
      );
      const response = await POST(`${ProductAttributeValueBaseURL}/bulk`, bulkData);
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Bulk product attribute values created successfully`
      );
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error creating bulk product attribute values:",
        err
      );
      return {
        data: [],
        message:
          err instanceof Error ? err.message : "Failed to create bulk product attribute values",
        error: true,
      };
    }
  },

  /**
   * Get product attribute value by ID
   */
  GET_PRODUCT_ATTRIBUTE_VALUE_BY_ID: async (
    id: string
  ): Promise<CustomResponse<IProductAttributeValue>> => {
    try {
      logger.info(`[PRODUCT_ATTRIBUTE_VALUE_API] Fetching product attribute value: ${id}`);
      const response = await GET(`${ProductAttributeValueBaseURL}/${id}`);
      logger.info(`[PRODUCT_ATTRIBUTE_VALUE_API] Product attribute value fetched successfully`);
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error fetching product attribute value:",
        err
      );
      return {
        data: null as any,
        message:
          err instanceof Error ? err.message : "Failed to fetch product attribute value",
        error: true,
      };
    }
  },

  /**
   * Get product attribute values by product ID
   */
  GET_PRODUCT_ATTRIBUTE_VALUES_BY_PRODUCT_ID: async (
    productId: string
  ): Promise<CustomResponse<IProductAttributeValue[]>> => {
    try {
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Fetching product attribute values for product: ${productId}`
      );
      const response = await GET(`${ProductAttributeValueBaseURL}/product/${productId}`);
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Product attribute values fetched successfully`
      );
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error fetching product attribute values by product ID:",
        err
      );
      return {
        data: [],
        message:
          err instanceof Error
            ? err.message
            : "Failed to fetch product attribute values by product ID",
        error: true,
      };
    }
  },

  /**
   * Get product attribute values by attribute ID
   */
  GET_PRODUCT_ATTRIBUTE_VALUES_BY_ATTRIBUTE_ID: async (
    attributeId: string
  ): Promise<CustomResponse<IProductAttributeValue[]>> => {
    try {
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Fetching product attribute values for attribute: ${attributeId}`
      );
      const response = await GET(`${ProductAttributeValueBaseURL}/attribute/${attributeId}`);
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Product attribute values fetched successfully`
      );
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error fetching product attribute values by attribute ID:",
        err
      );
      return {
        data: [],
        message:
          err instanceof Error
            ? err.message
            : "Failed to fetch product attribute values by attribute ID",
        error: true,
      };
    }
  },

  /**
   * Get all product attribute values
   */
  GET_ALL_PRODUCT_ATTRIBUTE_VALUES: async (): Promise<
    CustomResponse<IProductAttributeValue[]>
  > => {
    try {
      logger.info(`[PRODUCT_ATTRIBUTE_VALUE_API] Fetching all product attribute values`);
      const response = await GET(`${baseUrl}/product-attribute-values`);
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] All product attribute values fetched successfully`
      );
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error fetching all product attribute values:",
        err
      );
      return {
        data: [],
        message:
          err instanceof Error ? err.message : "Failed to fetch all product attribute values",
        error: true,
      };
    }
  },

  /**
   * Update product attribute value
   */
  UPDATE_PRODUCT_ATTRIBUTE_VALUE: async (
    updateData: IUpdateProductAttributeValue
  ): Promise<CustomResponse<IProductAttributeValue>> => {
    try {
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Updating product attribute value: ${updateData.id}`
      );
      const response = await PUT(`${ProductAttributeValueBaseURL}`, updateData);
      logger.info(`[PRODUCT_ATTRIBUTE_VALUE_API] Product attribute value updated successfully`);
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error updating product attribute value:",
        err
      );
      return {
        data: null as any,
        message:
          err instanceof Error ? err.message : "Failed to update product attribute value",
        error: true,
      };
    }
  },

  /**
   * Delete product attribute value by ID
   */
  DELETE_PRODUCT_ATTRIBUTE_VALUE: async (id: string): Promise<CustomResponse<null>> => {
    try {
      logger.info(`[PRODUCT_ATTRIBUTE_VALUE_API] Deleting product attribute value: ${id}`);
      const response = await DELETE(`${ProductAttributeValueBaseURL}/${id}`);
      logger.info(`[PRODUCT_ATTRIBUTE_VALUE_API] Product attribute value deleted successfully`);
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error deleting product attribute value:",
        err
      );
      return {
        data: null,
        message:
          err instanceof Error ? err.message : "Failed to delete product attribute value",
        error: true,
      };
    }
  },

  /**
   * Delete all product attribute values by product ID
   */
  DELETE_PRODUCT_ATTRIBUTE_VALUES_BY_PRODUCT_ID: async (
    productId: string
  ): Promise<CustomResponse<null>> => {
    try {
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Deleting product attribute values for product: ${productId}`
      );
      const response = await DELETE(`${ProductAttributeValueBaseURL}/product/${productId}`);
      logger.info(
        `[PRODUCT_ATTRIBUTE_VALUE_API] Product attribute values deleted successfully`
      );
      return response;
    } catch (err) {
      logger.error(
        "[PRODUCT_ATTRIBUTE_VALUE_API] Error deleting product attribute values by product ID:",
        err
      );
      return {
        data: null,
        message:
          err instanceof Error
            ? err.message
            : "Failed to delete product attribute values by product ID",
        error: true,
      };
    }
  },
};
