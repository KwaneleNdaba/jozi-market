/**
 * Return and ReturnItem interfaces aligned with backend types.
 * @see Backend: src/types/return.types.ts
 */

export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_TRANSIT = 'in_transit',
  RECEIVED = 'received',
  REFUND_PENDING = 'refund_pending',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/** Order item reference (from order_items) - product/variant when enriched */
export interface IReturnItemOrderItemProduct {
  id: string;
  title: string;
  sku?: string;
  images?: Array<{ index: number; file: string }>;
  vendorName?: string;
}

export interface IReturnItemOrderItemVariant {
  id: string;
  sku?: string;
  attributes?: Record<string, string>;
}

export interface IReturnItemOrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productVariantId?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status?: string;
  product?: IReturnItemOrderItemProduct;
  variant?: IReturnItemOrderItemVariant;
}

export interface IReturnItem {
  id?: string;
  returnId?: string;
  orderItemId: string;
  quantity: number;
  reason?: string | null;
  status?: ReturnStatus | string;
  requestedAt?: Date | string;
  reviewedBy?: string | null;
  reviewedAt?: Date | string | null;
  rejectionReason?: string | null;
  orderItem?: IReturnItemOrderItem;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IReturnOrderRef {
  id: string;
  orderNumber: string;
  totalAmount: number | string;
  status: string;
  createdAt: Date | string;
}

export interface IReturnUserRef {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  profileUrl?: string;
  address?: string;
}

export interface IReturn {
  id?: string;
  orderId: string;
  userId: string;
  status: ReturnStatus | string;
  reason: string;
  requestedAt?: Date | string;
  reviewedBy?: string | null;
  reviewedAt?: Date | string | null;
  rejectionReason?: string | null;
  refundAmount?: number | string | null;
  refundStatus?: RefundStatus | string | null;
  items?: IReturnItem[];
  order?: IReturnOrderRef;
  user?: IReturnUserRef;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ICreateReturnItemInput {
  orderItemId: string;
  quantity: number;
  reason?: string;
}

export interface ICreateReturn {
  orderId: string;
  userId: string;
  reason: string;
  items: ICreateReturnItemInput[];
}

export interface IUpdateReturn {
  id: string;
  status?: ReturnStatus | string;
  reviewedBy?: string;
  rejectionReason?: string;
  refundAmount?: number;
  refundStatus?: RefundStatus | string;
}

export interface IReviewReturn {
  returnId: string;
  status: ReturnStatus;
  reviewedBy: string;
  rejectionReason?: string;
}

export interface IReviewReturnItem {
  returnItemId: string;
  status: ReturnStatus;
  reviewedBy: string;
  rejectionReason?: string;
}

export interface IReturnWithDetails extends IReturn {
  items: IReturnItem[];
  order: IReturnOrderRef;
  user: IReturnUserRef;
}
