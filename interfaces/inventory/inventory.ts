export enum InventoryMovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUSTMENT = "ADJUSTMENT",
  RETURN = "RETURN",
}

export enum AdjustmentReasonType {
  AUDIT_CORRECTION = "Audit Correction",
  DAMAGED_STOCK = "Damaged Stock",
  FOUND_INVENTORY = "Found Inventory",
  INTERNAL_USE = "Internal Use",
  THEFT_LOSS = "Theft/Loss",
  EXPIRED_STOCK = "Expired Stock",
  QUALITY_CONTROL = "Quality Control Rejection",
  OTHER = "Other",
}

export type InventoryReferenceType =
  | "order"
  | "order_item"
  | "cart"
  | "restock"
  | "refund"
  | "reservation_release"
  | "manual";

export interface IInventory {
  id?: string;
  productVariantId?: string | null;
  productId?: string | null;
  quantityAvailable: number;
  quantityReserved: number;
  reorderLevel: number;
  warehouseLocation?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInventoryMovement {
  id?: string;
  productVariantId?: string | null;
  productId?: string | null;
  type: InventoryMovementType | string;
  quantity: number;
  reason: string;
  referenceId?: string | null;
  referenceType?: string | null;
  createdAt?: Date;
}

export interface IInventoryRestock {
  id?: string;
  productVariantId?: string | null;
  productId?: string | null;
  quantityAdded: number;
  costPerUnit: number;
  supplierName: string;
  restockDate: Date;
  createdAt?: Date;
}

export interface IReserveStock {
  productVariantId?: string | null;
  productId?: string | null;
  quantity: number;
  referenceId?: string | null;
  referenceType?: InventoryReferenceType;
}

export interface IReleaseReservation {
  productVariantId?: string | null;
  productId?: string | null;
  quantity: number;
  referenceId?: string | null;
}

export interface IDeductStock {
  productVariantId?: string | null;
  productId?: string | null;
  quantity: number;
  orderId: string;
  orderItemId: string;
  reason?: string;
}

export interface IRefundStock {
  productVariantId?: string | null;
  productId?: string | null;
  quantity: number;
  orderItemId: string;
  returnId?: string | null;
  reason?: string;
}

export interface IAdjustStock {
  productVariantId?: string | null;
  productId?: string | null;
  quantityDelta: number;
  reason: string;
  referenceId?: string | null;
}

export interface IRestockInput {
  productVariantId?: string | null;
  productId?: string | null;
  quantityAdded: number;
  costPerUnit: number;
  supplierName: string;
  restockDate?: Date;
}

export interface ILowStockItem {
  productVariantId?: string | null;
  productId?: string | null;
  quantityAvailable: number;
  quantityReserved: number;
  reorderLevel: number;
  variant?: { sku: string; name: string; productId: string };
  product?: { id: string; title: string; sku: string };
}

export interface ISetReorderLevel {
  reorderLevel: number;
}
