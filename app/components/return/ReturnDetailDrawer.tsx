'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, User, Receipt, RotateCcw, Loader2 } from 'lucide-react';
import type { IReturn, IReturnItem } from '@/interfaces/return/return';
import {
  getReturnStatusStyles,
  RETURN_STATUS_LABELS,
  formatReturnRefundAmount,
  getReturnOrderNumber,
  getReturnRequestedDate,
  getReturnItemProductName,
  getReturnItemImage,
  getReturnItemUnitPrice,
} from './returnUtils';

export interface ReturnDetailDrawerProps {
  returnRecord: IReturn | null;
  onClose: () => void;
  /** Customer: show cancel. Admin: show review/status actions. */
  mode?: 'customer' | 'admin';
  onCancel?: (returnId: string) => Promise<void>;
  onReview?: (returnId: string, approved: boolean, rejectionReason?: string) => Promise<void>;
  onStatusUpdate?: (returnId: string, status: string) => Promise<void>;
  /** When a child action (cancel/review/status) is successful, parent may refetch. */
  onActionSuccess?: () => void;
}

const ReturnDetailDrawer: React.FC<ReturnDetailDrawerProps> = ({
  returnRecord,
  onClose,
  mode = 'customer',
  onCancel,
  onReview,
  onStatusUpdate,
  onActionSuccess,
}) => {
  const [busy, setBusy] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  const handleCancel = async () => {
    if (!returnRecord?.id || !onCancel) return;
    setBusy(true);
    try {
      await onCancel(returnRecord.id);
      onActionSuccess?.();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = async () => {
    if (!returnRecord?.id || !onReview) return;
    setBusy(true);
    try {
      await onReview(returnRecord.id, true);
      onActionSuccess?.();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!returnRecord?.id || !onReview) return;
    setBusy(true);
    try {
      await onReview(returnRecord.id, false, rejectReason || undefined);
      onActionSuccess?.();
      setShowRejectInput(false);
      setRejectReason('');
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const status = (returnRecord?.status as string)?.toLowerCase() ?? '';
  const isRequested = status === 'requested';
  const canCancel = mode === 'customer' && isRequested && !!onCancel;
  const canReview = mode === 'admin' && isRequested && !!onReview;
  const orderNumber = returnRecord ? getReturnOrderNumber(returnRecord) : '';
  const requestedDate = returnRecord ? getReturnRequestedDate(returnRecord) : '';
  const refundAmount = returnRecord ? formatReturnRefundAmount(returnRecord.refundAmount) : '—';
  const items = (returnRecord?.items ?? []) as IReturnItem[];
  const user = (returnRecord?.user ?? undefined) as { fullName?: string; email?: string } | undefined;

  return (
    <AnimatePresence>
      {returnRecord && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-jozi-dark/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
            <div>
              <h2 className="text-2xl font-black text-jozi-forest tracking-tighter uppercase">
                Return {returnRecord.id ? returnRecord.id.slice(0, 8) : ''}
              </h2>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getReturnStatusStyles(
                    returnRecord.status as string
                  )}`}
                >
                  {RETURN_STATUS_LABELS[status] ?? returnRecord.status}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {requestedDate}
                </span>
                <span className="text-[10px] text-gray-500">Order {orderNumber}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white rounded-xl transition-colors shadow-sm"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-jozi-forest" />
            </button>
          </div>

          <div className="grow overflow-y-auto p-8 space-y-8">
            <div>
              <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest border-l-4 border-jozi-gold pl-3 mb-4">
                Reason
              </h3>
              <p className="text-gray-700 font-medium italic">&quot;{returnRecord.reason}&quot;</p>
              {returnRecord.rejectionReason && (
                <div className="mt-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                    Rejection reason
                  </p>
                  <p className="text-sm text-red-800 mt-1">{returnRecord.rejectionReason}</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-jozi-forest uppercase tracking-widest">
                  Returned Items
                </h3>
                <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">
                  {items.length} item(s)
                </span>
              </div>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-gray-400 text-sm">No items.</p>
                ) : (
                  items.map((item: IReturnItem, idx: number) => {
                    const name = getReturnItemProductName(item);
                    const img = getReturnItemImage(item);
                    const unitPrice = getReturnItemUnitPrice(item);
                    const lineTotal = unitPrice * (item.quantity ?? 0);
                    return (
                      <div
                        key={item.id ?? idx}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
                            {img ? (
                              <img
                                src={img}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-300" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-jozi-forest text-sm truncate">{name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                              Qty: {item.quantity}
                            </p>
                            {item.reason && (
                              <p className="text-xs text-gray-500 mt-1 italic truncate">
                                {item.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            R{unitPrice.toFixed(2)} × {item.quantity}
                          </p>
                          <p className="font-black text-jozi-forest">R{lineTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {(user || returnRecord.order) && (
              <div className="grid gap-6">
                {user && (
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" /> Customer
                    </h4>
                    <p className="font-bold text-jozi-forest">{user.fullName ?? '—'}</p>
                    <p className="text-sm text-gray-500">{user.email ?? ''}</p>
                  </div>
                )}
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Refund
                  </h4>
                  <p className="font-black text-xl text-jozi-forest">{refundAmount}</p>
                  {returnRecord.refundStatus && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                      {String(returnRecord.refundStatus)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {(canCancel || canReview) && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={busy}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Cancel return
                  </button>
                )}
                {canReview && (
                  <div className="flex flex-col gap-3">
                    {showRejectInput ? (
                      <>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Rejection reason (optional)"
                          className="w-full p-4 border border-gray-200 rounded-xl text-sm resize-none"
                          rows={3}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleReject}
                            disabled={busy}
                            className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Confirm reject
                          </button>
                          <button
                            onClick={() => {
                              setShowRejectInput(false);
                              setRejectReason('');
                            }}
                            disabled={busy}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                          >
                            Back
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={handleApprove}
                          disabled={busy}
                          className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Approve
                        </button>
                        <button
                          onClick={() => setShowRejectInput(true)}
                          disabled={busy}
                          className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReturnDetailDrawer;
