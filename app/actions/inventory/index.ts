'use server';

import { serverPOST, serverGET, serverPUT } from '@/lib/server-client';
import { baseUrl } from '@/endpoints/url';
import {
  IInventory,
  IInventoryMovement,
  IInventoryRestock,
  ILowStockItem,
  IRestockInput,
  IAdjustStock,
  ISetReorderLevel,
} from '@/interfaces/inventory/inventory';
import { CustomResponse } from '@/interfaces/response';
import { logger } from '@/lib/log';
import { decodeServerAccessToken } from '@/lib/server-auth';

/**
 * Server action to get inventory by variant ID
 */
export async function getInventoryByVariantAction(
  variantId: string
): Promise<CustomResponse<IInventory>> {
  try {
    logger.info('[Inventory Action] Fetching inventory for variant:', variantId);
    const response = await serverGET(`${baseUrl}/inventory/variant/${variantId}`);
    logger.info('[Inventory Action] Inventory fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error fetching inventory:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch inventory',
      error: true,
    };
  }
}

/**
 * Server action to get inventory by product ID
 */
export async function getInventoryByProductAction(
  productId: string
): Promise<CustomResponse<IInventory>> {
  try {
    logger.info('[Inventory Action] Fetching inventory for product:', productId);
    const response = await serverGET(`${baseUrl}/inventory/product/${productId}`);
    logger.info('[Inventory Action] Inventory fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error fetching inventory:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to fetch inventory',
      error: true,
    };
  }
}

/**
 * Server action to get movements by variant ID
 */
export async function getMovementsByVariantAction(
  variantId: string,
  limit?: number
): Promise<CustomResponse<IInventoryMovement[]>> {
  try {
    const url = limit
      ? `${baseUrl}/inventory/variant/${variantId}/movements?limit=${limit}`
      : `${baseUrl}/inventory/variant/${variantId}/movements`;
    
    logger.info('[Inventory Action] Fetching movements for variant:', variantId);
    const response = await serverGET(url);
    logger.info('[Inventory Action] Movements fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error fetching movements:', err);
    return {
      data: [] as IInventoryMovement[],
      message: err?.message || 'Failed to fetch movements',
      error: true,
    };
  }
}

/**
 * Server action to get movements by product ID
 */
export async function getMovementsByProductAction(
  productId: string,
  limit?: number
): Promise<CustomResponse<IInventoryMovement[]>> {
  try {
    const url = limit
      ? `${baseUrl}/inventory/product/${productId}/movements?limit=${limit}`
      : `${baseUrl}/inventory/product/${productId}/movements`;
    
    logger.info('[Inventory Action] Fetching movements for product:', productId);
    const response = await serverGET(url);
    logger.info('[Inventory Action] Movements fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error fetching movements:', err);
    return {
      data: [] as IInventoryMovement[],
      message: err?.message || 'Failed to fetch movements',
      error: true,
    };
  }
}

/**
 * Server action to get low stock items for a vendor
 */
export async function getLowStockByVendorAction(
  vendorId: string
): Promise<CustomResponse<ILowStockItem[]>> {
  try {
    logger.info('[Inventory Action] Fetching low stock items for vendor:', vendorId);
    const response = await serverGET(`${baseUrl}/inventory/vendor/${vendorId}/low-stock`);
    logger.info('[Inventory Action] Low stock items fetched successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error fetching low stock items:', err);
    return {
      data: [] as ILowStockItem[],
      message: err?.message || 'Failed to fetch low stock items',
      error: true,
    };
  }
}

/**
 * Server action to get low stock items for current vendor
 */
export async function getMyLowStockAction(): Promise<CustomResponse<ILowStockItem[]>> {
  try {
    const decodedUser = await decodeServerAccessToken();
    if (!decodedUser?.id) {
      return {
        data: [] as ILowStockItem[],
        message: 'Authentication required. Please log in.',
        error: true,
      };
    }

    return await getLowStockByVendorAction(decodedUser.id);
  } catch (err: any) {
    logger.error('[Inventory Action] Error fetching my low stock items:', err);
    return {
      data: [] as ILowStockItem[],
      message: err?.message || 'Failed to fetch low stock items',
      error: true,
    };
  }
}

/**
 * Server action to record a restock
 */
export async function restockAction(
  data: IRestockInput
): Promise<CustomResponse<{ inventory: IInventory; restock: IInventoryRestock }>> {
  try {
    logger.info('[Inventory Action] Recording restock:', {
      productVariantId: data.productVariantId,
      productId: data.productId,
      quantityAdded: data.quantityAdded,
      supplierName: data.supplierName,
    });

    const response = await serverPOST(`${baseUrl}/inventory/restock`, data);
    
    logger.info('[Inventory Action] Restock recorded successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error recording restock:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to record restock',
      error: true,
    };
  }
}

/**
 * Server action to adjust inventory
 */
export async function adjustInventoryAction(
  data: IAdjustStock
): Promise<CustomResponse<IInventory>> {
  try {
    logger.info('[Inventory Action] Adjusting inventory:', {
      productVariantId: data.productVariantId,
      productId: data.productId,
      quantityDelta: data.quantityDelta,
      reason: data.reason,
    });

    const response = await serverPOST(`${baseUrl}/inventory/adjust`, data);
    
    logger.info('[Inventory Action] Inventory adjusted successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error adjusting inventory:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to adjust inventory',
      error: true,
    };
  }
}

/**
 * Server action to set reorder level for variant
 */
export async function setReorderLevelVariantAction(
  variantId: string,
  reorderLevel: number
): Promise<CustomResponse<IInventory>> {
  try {
    logger.info('[Inventory Action] Setting reorder level for variant:', variantId, reorderLevel);
    const response = await serverPUT(
      `${baseUrl}/inventory/variant/${variantId}/reorder-level`,
      { reorderLevel }
    );
    logger.info('[Inventory Action] Reorder level set successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error setting reorder level:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to set reorder level',
      error: true,
    };
  }
}

/**
 * Server action to set reorder level for product
 */
export async function setReorderLevelProductAction(
  productId: string,
  reorderLevel: number
): Promise<CustomResponse<IInventory>> {
  try {
    logger.info('[Inventory Action] Setting reorder level for product:', productId, reorderLevel);
    const response = await serverPUT(
      `${baseUrl}/inventory/product/${productId}/reorder-level`,
      { reorderLevel }
    );
    logger.info('[Inventory Action] Reorder level set successfully');
    return response;
  } catch (err: any) {
    logger.error('[Inventory Action] Error setting reorder level:', err);
    return {
      data: null as any,
      message: err?.message || 'Failed to set reorder level',
      error: true,
    };
  }
}
