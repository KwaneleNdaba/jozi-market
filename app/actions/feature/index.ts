'use server';

import { serverPOST, serverGET, serverPUT, serverDELETE } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import { IFeature, ICreateFeature, IUpdateFeature } from '@/interfaces/subscription/subscription';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';

const FeatureBaseURL = `${baseUrl}/feature`;

/**
 * Helper function to generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Server action to create a feature (admin only)
 */
export async function createFeatureAction(
  featureData: ICreateFeature
): Promise<CustomResponse<IFeature>> {
  try {
    // Generate slug if not provided
    const dataWithSlug: ICreateFeature = {
      ...featureData,
      slug: featureData.slug || generateSlug(featureData.name),
    };

    logger.info('[Feature Action] Creating feature:', {
      name: dataWithSlug.name,
      slug: dataWithSlug.slug,
    });

    const response = await serverPOST(`${FeatureBaseURL}`, dataWithSlug);
    
    logger.info('[Feature Action] Feature created successfully:', {
      id: response?.data?.id,
      name: response?.data?.name,
    });

    return response;
  } catch (err: any) {
    logger.error('[Feature Action] Error creating feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to create feature',
      error: true,
    };
  }
}

/**
 * Server action to get feature by ID (public)
 */
export async function getFeatureByIdAction(
  id: string
): Promise<CustomResponse<IFeature>> {
  try {
    logger.info('[Feature Action] Fetching feature by ID:', id);
    const response = await serverGET(`${FeatureBaseURL}/${id}`);
    logger.info('[Feature Action] Feature fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Feature Action] Error fetching feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch feature',
      error: true,
    };
  }
}

/**
 * Server action to get feature by slug (public)
 */
export async function getFeatureBySlugAction(
  slug: string
): Promise<CustomResponse<IFeature>> {
  try {
    logger.info('[Feature Action] Fetching feature by slug:', slug);
    const response = await serverGET(`${FeatureBaseURL}/slug/${slug}`);
    logger.info('[Feature Action] Feature fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Feature Action] Error fetching feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch feature',
      error: true,
    };
  }
}

/**
 * Server action to get all features (public)
 */
export async function getAllFeaturesAction(): Promise<CustomResponse<IFeature[]>> {
  try {
    logger.info('[Feature Action] Fetching all features');
    const response = await serverGET(`${baseUrl}/features`);
    logger.info('[Feature Action] Features fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Feature Action] Error fetching features:', err);
    return {
      data: [] as IFeature[],
      message: err?.message || 'Failed to fetch features',
      error: true,
    };
  }
}

/**
 * Server action to update a feature (admin only)
 */
export async function updateFeatureAction(
  updateData: IUpdateFeature
): Promise<CustomResponse<IFeature>> {
  try {
    // Generate slug from name if name is being updated but slug is not
    const dataWithSlug: IUpdateFeature = { ...updateData };
    if (updateData.name && !updateData.slug) {
      dataWithSlug.slug = generateSlug(updateData.name);
    }

    logger.info('[Feature Action] Updating feature:', {
      id: dataWithSlug.id,
      name: dataWithSlug.name,
    });

    const response = await serverPUT(`${FeatureBaseURL}`, dataWithSlug);
    
    logger.info('[Feature Action] Feature updated successfully:', {
      id: response?.data?.id,
    });

    return response;
  } catch (err: any) {
    logger.error('[Feature Action] Error updating feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to update feature',
      error: true,
    };
  }
}

/**
 * Server action to delete a feature (admin only)
 */
export async function deleteFeatureAction(
  id: string
): Promise<CustomResponse<void>> {
  try {
    logger.info('[Feature Action] Deleting feature:', id);
    const response = await serverDELETE(`${FeatureBaseURL}/${id}`);
    logger.info('[Feature Action] Feature deleted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Feature Action] Error deleting feature:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to delete feature',
      error: true,
    };
  }
}
