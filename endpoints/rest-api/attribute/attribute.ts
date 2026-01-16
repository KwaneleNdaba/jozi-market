import { baseUrl } from "../../url";
import { CustomResponse } from "@/interfaces/response";
import { IAttribute, ICreateAttribute, IUpdateAttribute } from "@/interfaces/attribute/attribute";
import { GET, POST, PUT, DELETE } from "@/lib/client";
import { logger } from "@/lib/log";

const AttributeBaseURL = `${baseUrl}/attribute`;

export const ATTRIBUTE_API = {
  /**
   * Create a new global attribute
   */
  CREATE_ATTRIBUTE: async (attributeData: ICreateAttribute): Promise<CustomResponse<IAttribute>> => {
    try {
      logger.info(`[ATTRIBUTE_API] Creating attribute: ${attributeData.name}`);
      const response = await POST(`${AttributeBaseURL}`, attributeData);
      logger.info(`[ATTRIBUTE_API] Attribute created successfully`);
      return response;
    } catch (err) {
      logger.error("[ATTRIBUTE_API] Error creating attribute:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to create attribute",
        error: true,
      };
    }
  },

  /**
   * Get all attributes
   */
  GET_ALL_ATTRIBUTES: async (): Promise<CustomResponse<IAttribute[]>> => {
    try {
      logger.info(`[ATTRIBUTE_API] Fetching all attributes`);
      const response = await GET(`${baseUrl}/attributes`);
      logger.info(`[ATTRIBUTE_API] Attributes fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[ATTRIBUTE_API] Error fetching attributes:", err);
      return {
        data: [],
        message: err instanceof Error ? err.message : "Failed to fetch attributes",
        error: true,
      };
    }
  },

  /**
   * Get attribute by ID
   */
  GET_ATTRIBUTE_BY_ID: async (id: string): Promise<CustomResponse<IAttribute>> => {
    try {
      logger.info(`[ATTRIBUTE_API] Fetching attribute: ${id}`);
      const response = await GET(`${AttributeBaseURL}/${id}`);
      logger.info(`[ATTRIBUTE_API] Attribute fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[ATTRIBUTE_API] Error fetching attribute:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to fetch attribute",
        error: true,
      };
    }
  },

  /**
   * Get attribute by slug
   */
  GET_ATTRIBUTE_BY_SLUG: async (slug: string): Promise<CustomResponse<IAttribute>> => {
    try {
      logger.info(`[ATTRIBUTE_API] Fetching attribute by slug: ${slug}`);
      const response = await GET(`${AttributeBaseURL}/slug/${slug}`);
      logger.info(`[ATTRIBUTE_API] Attribute fetched successfully`);
      return response;
    } catch (err) {
      logger.error("[ATTRIBUTE_API] Error fetching attribute:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to fetch attribute",
        error: true,
      };
    }
  },

  /**
   * Update attribute
   */
  UPDATE_ATTRIBUTE: async (updateData: IUpdateAttribute): Promise<CustomResponse<IAttribute>> => {
    try {
      logger.info(`[ATTRIBUTE_API] Updating attribute: ${updateData.id}`);
      const response = await PUT(`${AttributeBaseURL}`, updateData);
      logger.info(`[ATTRIBUTE_API] Attribute updated successfully`);
      return response;
    } catch (err) {
      logger.error("[ATTRIBUTE_API] Error updating attribute:", err);
      return {
        data: null as any,
        message: err instanceof Error ? err.message : "Failed to update attribute",
        error: true,
      };
    }
  },

  /**
   * Delete attribute
   */
  DELETE_ATTRIBUTE: async (id: string): Promise<CustomResponse<null>> => {
    try {
      logger.info(`[ATTRIBUTE_API] Deleting attribute: ${id}`);
      const response = await DELETE(`${AttributeBaseURL}/${id}`);
      logger.info(`[ATTRIBUTE_API] Attribute deleted successfully`);
      return response;
    } catch (err) {
      logger.error("[ATTRIBUTE_API] Error deleting attribute:", err);
      return {
        data: null,
        message: err instanceof Error ? err.message : "Failed to delete attribute",
        error: true,
      };
    }
  },
};
