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

  const headers = ['Return ID', 'Order', 'Date', 'Status', 'Refund', ...(showCustomer ? ['Customer'] : []), ''];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((h) => (
              <th
                key={h}
                className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest whitespace-nowrap"
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
            return (
              <tr
                key={r.id}
                className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => onView(r)}
              >
                <td className="py-4 font-mono font-black text-jozi-forest text-sm">
                  {r.id ? truncateId(r.id, 8, 4) : '—'}
                </td>
                <td className="py-4 text-sm font-bold text-gray-700">
                  {getReturnOrderNumber(r)}
                </td>
                <td className="py-4 text-xs font-bold text-gray-500 whitespace-nowrap">
                  {getReturnRequestedDate(r)}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getReturnStatusStyles(
                      r.status as string
                    )}`}
                  >
                    {label}
                  </span>
                </td>
                <td className="py-4 font-black text-jozi-forest">
                  {formatReturnRefundAmount(r.refundAmount)}
                </td>
                {showCustomer && (
                  <td className="py-4">
                    <p className="font-bold text-jozi-forest text-sm">
                      {(r.user as { fullName?: string })?.fullName ?? '—'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {(r.user as { email?: string })?.email ?? ''}
                    </p>
                  </td>
                )}
                <td className="py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(r);
                    }}
                    className="p-2 hover:bg-jozi-forest/10 rounded-xl transition-colors"
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
