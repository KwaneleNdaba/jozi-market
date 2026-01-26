'use client';

import React, { useEffect, useState } from 'react';
import type { IReturn } from '@/interfaces/return/return';
import { ReturnStatus } from '@/interfaces/return/return';
import {
  getAllReturnsAction,
  reviewReturnAction,
  getReturnByIdAction,
} from '@/app/actions/return/index';
import { getCurrentUserAction } from '@/app/actions/auth/auth';
import { useToast } from '@/app/contexts/ToastContext';
import ReturnsTable from '../return/ReturnsTable';
import ReturnDetailDrawer from '../return/ReturnDetailDrawer';

const AdminResolutionReturnsSection: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [returns, setReturns] = useState<IReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IReturn | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await getAllReturnsAction();
      if (!res.error && res.data) setReturns(res.data);
      else if (res.error && res.message) showError(res.message);
    } catch (e) {
      showError('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const res = await getCurrentUserAction();
      if (!res.error && res.data?.id) setCurrentUserId(res.data.id);
    };
    loadUser();
  }, []);

  const handleView = (r: IReturn) => {
    setSelected(r);
  };

  const handleCloseDrawer = () => {
    setSelected(null);
  };

  const handleReview = async (
    returnId: string,
    approved: boolean,
    rejectionReason?: string
  ) => {
    if (!currentUserId) {
      showError('User context required to review');
      return;
    }
    const res = await reviewReturnAction({
      returnId,
      status: approved ? ReturnStatus.APPROVED : ReturnStatus.REJECTED,
      reviewedBy: currentUserId,
      rejectionReason: approved ? undefined : rejectionReason,
    });
    if (res.error) {
      showError(res.message ?? 'Failed to review return');
      return;
    }
    showSuccess(approved ? 'Return approved' : 'Return rejected');
    await fetchReturns();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-jozi-forest uppercase tracking-tight">
        Return requests
      </h3>
      <ReturnsTable
        returns={returns}
        loading={loading}
        onView={handleView}
        showCustomer
      />
      <ReturnDetailDrawer
        returnRecord={selected}
        onClose={handleCloseDrawer}
        mode="admin"
        onReview={handleReview}
        onActionSuccess={fetchReturns}
      />
    </div>
  );
};

export default AdminResolutionReturnsSection;
