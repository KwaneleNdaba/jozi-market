import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { ICategoryAttribute, ICreateCategoryAttribute, IUpdateCategoryAttribute } from "@/interfaces/attribute/attribute";
import { GET, POST, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const CategoryAttributeBaseURL = `${baseUrl}/category-attribute`;

export const CATEGORY_ATTRIBUTE_API = {
  /**
   * Create a category-attribute link (link attribute to category)
   */
  CREATE_CATEGORY_ATTRIBUTE: async (data: ICreateCategoryAttribute): Promise<CustomResponse<ICategoryAttribute>> => {
    try {
      logger.info(`[CATEGORY_ATTRIBUTE_API] Linking attribute ${data.attributeId} to category ${data.categoryId}`);
      const response = await POST(`${CategoryAttributeBaseURL}`, data);
      logger.info(`[CATEGORY_ATTRIBUTE_API] Category attribute created successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_ATTRIBUTE_API] Error creating category attribute:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to link attribute to category",
        error: true,
      };
    }
  },

  /**
   * Get all category attributes
   */
  GET_ALL_CATEGORY_ATTRIBUTES: async (): Promise<CustomResponse<ICategoryAttribute[]>> => {
    try {
      logger.info(`[CATEGORY_ATTRIBUTE_API] Fetching all category attributes`);
      const response = await GET(`${baseUrl}/category-attributes`);
      logger.info(`[CATEGORY_ATTRIBUTE_API] Category attributes fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_ATTRIBUTE_API] Error fetching category attributes:", err);
      return {
        data: [],
        message: err instanceof Error ? err.message : "Failed to fetch category attributes",
        error: true,
      };
    }
  },

  /**
   * Get category attributes by category ID
   */
  GET_CATEGORY_ATTRIBUTES_BY_CATEGORY_ID: async (categoryId: string): Promise<CustomResponse<ICategoryAttribute[]>> => {
    try {
      logger.info(`[CATEGORY_ATTRIBUTE_API] Fetching category attributes for category: ${categoryId}`);
      const response = await GET(`${CategoryAttributeBaseURL}/category/${categoryId}`);
      logger.info(`[CATEGORY_ATTRIBUTE_API] Category attributes fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_ATTRIBUTE_API] Error fetching category attributes:", err);
      return {
        data: [],
        message: err instanceof Error ? err.message : "Failed to fetch category attributes",
        error: true,
      };
    }
  },

  /**
   * Get category attribute by ID
   */
  GET_CATEGORY_ATTRIBUTE_BY_ID: async (id: string): Promise<CustomResponse<ICategoryAttribute>> => {
    try {
      logger.info(`[CATEGORY_ATTRIBUTE_API] Fetching category attribute: ${id}`);
      const response = await GET(`${CategoryAttributeBaseURL}/${id}`);
      logger.info(`[CATEGORY_ATTRIBUTE_API] Category attribute fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_ATTRIBUTE_API] Error fetching category attribute:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to fetch category attribute",
        error: true,
      };
    }
  },

  /**
   * Update category attribute
   */
  UPDATE_CATEGORY_ATTRIBUTE: async (updateData: IUpdateCategoryAttribute): Promise<CustomResponse<ICategoryAttribute>> => {
    try {
      logger.info(`[CATEGORY_ATTRIBUTE_API] Updating category attribute: ${updateData.id}`);
      const response = await PUT(`${CategoryAttributeBaseURL}`, updateData);
      logger.info(`[CATEGORY_ATTRIBUTE_API] Category attribute updated successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_ATTRIBUTE_API] Error updating category attribute:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update category attribute",
        error: true,
      };
    }
  },

  /**
   * Delete category attribute
   */
  DELETE_CATEGORY_ATTRIBUTE: async (id: string): Promise<CustomResponse<null>> => {
    try {
      logger.info(`[CATEGORY_ATTRIBUTE_API] Deleting category attribute: ${id}`);
      const response = await DELETE(`${CategoryAttributeBaseURL}/${id}`);
      logger.info(`[CATEGORY_ATTRIBUTE_API] Category attribute deleted successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_ATTRIBUTE_API] Error deleting category attribute:", err);
      return {
        data: null,
        message: err instanceof Error ? err.message : "Failed to delete category attribute",
        error: true,
      };
    }
  },
};
