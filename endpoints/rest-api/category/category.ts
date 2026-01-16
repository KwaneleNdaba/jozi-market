import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { ICategory, ICreateCategory, IUpdateCategory } from "@/interfaces/category/category";
import { GET, POST, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const CategoryBaseURL = `${baseUrl}/category`;

export const CATEGORY_API = {
  /**
   * Create a new category with optional subcategories
   */
  CREATE_CATEGORY: async (categoryData: ICreateCategory): Promise<CustomResponse<ICategory>> => {
    try {
      logger.info(`[CATEGORY_API] Creating category: ${categoryData.name}`);
      const response = await POST(`${CategoryBaseURL}`, categoryData);
      logger.info(`[CATEGORY_API] Category created successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_API] Error creating category:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to create category",
        error: true,
      };
    }
  },

  /**
   * Get all categories (with optional status filter)
   */
  GET_ALL_CATEGORIES: async (status?: string): Promise<CustomResponse<ICategory[]>> => {
    try {
      const url = status 
        ? `${baseUrl}/categorys?status=${encodeURIComponent(status)}`
        : `${baseUrl}/categorys`;
      logger.info(`[CATEGORY_API] Fetching categories${status ? ` with status: ${status}` : ''}`);
      const response = await GET(url);
      logger.info(`[CATEGORY_API] Categories fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_API] Error fetching categories:", err);
      return {
        data: [],
        message: err instanceof Error ? err.message : "Failed to fetch categories",
        error: true,
      };
    }
  },

  /**
   * Get category by ID
   */
  GET_CATEGORY_BY_ID: async (id: string): Promise<CustomResponse<ICategory>> => {
    try {
      logger.info(`[CATEGORY_API] Fetching category: ${id}`);
      const response = await GET(`${CategoryBaseURL}/${id}`);
      logger.info(`[CATEGORY_API] Category fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_API] Error fetching category:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to fetch category",
        error: true,
      };
    }
  },

  /**
   * Get subcategories by category ID
   */
  GET_SUBCATEGORIES_BY_CATEGORY_ID: async (categoryId: string): Promise<CustomResponse<ICategory[]>> => {
    try {
      logger.info(`[CATEGORY_API] Fetching subcategories for category: ${categoryId}`);
      const response = await GET(`${CategoryBaseURL}/${categoryId}/subcategories`);
      logger.info(`[CATEGORY_API] Subcategories fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_API] Error fetching subcategories:", err);
      return {
        data: [],
        message: err instanceof Error ? err.message : "Failed to fetch subcategories",
        error: true,
      };
    }
  },

  /**
   * Update category
   */
  UPDATE_CATEGORY: async (updateData: IUpdateCategory): Promise<CustomResponse<ICategory>> => {
    try {
      logger.info(`[CATEGORY_API] Updating category: ${updateData.id}`);
      const response = await PUT(`${CategoryBaseURL}`, updateData);
      logger.info(`[CATEGORY_API] Category updated successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_API] Error updating category:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update category",
        error: true,
      };
    }
  },

  /**
   * Delete category
   */
  DELETE_CATEGORY: async (id: string): Promise<CustomResponse<null>> => {
    try {
      logger.info(`[CATEGORY_API] Deleting category: ${id}`);
      const response = await DELETE(`${CategoryBaseURL}/${id}`);
      logger.info(`[CATEGORY_API] Category deleted successfully`);
      return response;
    } catch (err) {
      logger.error("[CATEGORY_API] Error deleting category:", err);
      return {
        data: null,
        message: err instanceof Error ? err.message : "Failed to delete category",
        error: true,
      };
    }
  },
};
