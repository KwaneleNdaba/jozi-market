'use client';

import React from 'react';
import { Eye, Loader2, Package } from 'lucide-react';
import type { IReturn } from '@/interfaces/return/return';
import {
  getReturnStatusStyles,
  RETURN_STATUS_LABELS,
  formatReturnRefundAmount,
  getReturnOrderNumber,
  getReturnRequestedDate,
  truncateId,
} from './returnUtils';

export interface ReturnsTableProps {
  returns: IReturn[];
  loading?: boolean;
  onView: (r: IReturn) => void;
  /** Admin: show customer column. Customer: hide it. */
  showCustomer?: boolean;
}

const ReturnsTable: React.FC<ReturnsTableProps> = ({
  returns,
  loading = false,
  onView,
  showCustomer = false,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-jozi-gold animate-spin mb-4" />
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
          Loading returns…
        </p>
      </div>
    );
  }

  if (!returns.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
          No returns found
        </p>
        <p className="text-gray-400 text-xs mt-2">
          {showCustomer ? 'Return requests will appear here.' : 'You have not requested any returns.'}
        </p>
      </div>
    );
  }

  const headers = ['Order ID', 'Date', ...(showCustomer ? ['Customer'] : []), 'Items', 'Refund', 'Status', 'View'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[1000px]">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h) => (
              <th
                key={h}
                className="pb-6 text-[10px] font-black uppercase text-gray-400 tracking-widest"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {returns.map((r) => {
            const status = (r.status as string)?.toLowerCase() ?? '';
            const label = RETURN_STATUS_LABELS[status] ?? r.status;
            const items = r.items || [];
            const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            return (
              <tr
                key={r.id}
                className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => onView(r)}
              >
                <td className="py-5 font-black text-jozi-dark text-sm">
                  {getReturnOrderNumber(r) ? `ORDER_${getReturnOrderNumber(r)?.split('_')[1] || r.id}` : r.id}
                </td>
                <td className="py-5 text-xs font-bold text-gray-500">
                  {getReturnRequestedDate(r)}
                </td>
                {showCustomer && (
                  <td className="py-5">
                    <p className="font-bold text-jozi-dark text-sm">
                      {(r.user as { fullName?: string })?.fullName ?? '—'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {(r.user as { email?: string })?.email ?? ''}
                    </p>
                  </td>
                )}
                <td className="py-5">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">
                      {totalItems} Items
                    </span>
                  </div>
                </td>
                <td className="py-5 font-black text-jozi-dark">
                  {formatReturnRefundAmount(r.refundAmount)}
                </td>
                <td className="py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getReturnStatusStyles(
                      r.status as string
                    )}`}
                  >
                    {label}
                  </span>
                </td>
                <td className="py-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(r);
                    }}
                    className="p-2 hover:bg-white rounded-xl transition-colors"
                    aria-label="View return"
                  >
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-jozi-forest" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnsTable;
