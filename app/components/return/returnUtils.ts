import type { IReturn, IReturnItem } from '@/interfaces/return/return';

export const RETURN_STATUS_LABELS: Record<string, string> = {
  requested: 'Requested',
  approved: 'Approved',
  rejected: 'Rejected',
  in_transit: 'In Transit',
  received: 'Received',
  refund_pending: 'Refund Pending',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

export function getReturnStatusStyles(status: string): string {
  const s = (status || '').toLowerCase();
  if (s === 'requested') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (s === 'approved') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (s === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
  if (s === 'in_transit') return 'bg-purple-50 text-purple-700 border-purple-200';
  if (s === 'received') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (s === 'refund_pending') return 'bg-orange-50 text-orange-700 border-orange-200';
  if (s === 'refunded') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'cancelled') return 'bg-gray-100 text-gray-600 border-gray-200';
  return 'bg-gray-50 text-gray-600 border-gray-200';
}

export function formatReturnRefundAmount(val: number | string | null | undefined): string {
  if (val == null) return '—';
  const n = typeof val === 'string' ? parseFloat(val) : val;
  return `R${(Number.isNaN(n) ? 0 : n).toFixed(2)}`;
}

export function truncateId(id: string, head = 8, tail = 4): string {
  if (!id || id.length <= head + tail) return id;
  return `${id.slice(0, head)}...${id.slice(-tail)}`;
}

export function getReturnOrderNumber(r: IReturn): string {
  return (r.order as { orderNumber?: string })?.orderNumber ?? (r.orderId ? truncateId(r.orderId) : '—');
}

export function getReturnRequestedDate(r: IReturn): string {
  const d = r.requestedAt ?? r.createdAt;
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getReturnItemProductName(item: IReturnItem): string {
  const oi = item.orderItem as { product?: { title?: string } } | undefined;
  return oi?.product?.title ?? 'Unknown product';
}

export function getReturnItemImage(item: IReturnItem): string | undefined {
  const oi = item.orderItem as { product?: { images?: Array<{ file?: string } | string> } } | undefined;
  const imgs = oi?.product?.images;
  if (!imgs?.length) return undefined;
  const first = imgs[0];
  return typeof first === 'string' ? first : (first as { file?: string }).file;
}

export function getReturnItemUnitPrice(item: IReturnItem): number {
  const oi = item.orderItem as { unitPrice?: number | string } | undefined;
  if (oi?.unitPrice == null) return 0;
  return typeof oi.unitPrice === 'string' ? parseFloat(oi.unitPrice) : oi.unitPrice;
}
