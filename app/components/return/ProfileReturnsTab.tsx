'use client';

import React, { useEffect, useState } from 'react';
import type { IReturn } from '@/interfaces/return/return';
import { getMyReturnsAction, getReturnByIdAction, cancelReturnAction } from '@/app/actions/return/index';
import { useToast } from '@/app/contexts/ToastContext';
import ReturnsTable from './ReturnsTable';
import ReturnDetailDrawer from './ReturnDetailDrawer';

const ProfileReturnsTab: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [returns, setReturns] = useState<IReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IReturn | null>(null);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await getMyReturnsAction();
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

  const handleView = (r: IReturn) => {
    setSelected(r);
  };

  const handleCloseDrawer = () => {
    setSelected(null);
  };

  const handleCancel = async (returnId: string) => {
    const res = await cancelReturnAction(returnId);
    if (res.error) {
      showError(res.message ?? 'Failed to cancel return');
      return;
    }
    showSuccess('Return cancelled');
    await fetchReturns();
  };

  return (
    <div className="bg-white rounded-5xl p-10 border border-jozi-forest/5 shadow-soft text-left">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-jozi-forest uppercase tracking-tight">
          My Returns
        </h3>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          {returns.length} return{returns.length !== 1 ? 's' : ''}
        </p>
      </div>
      <ReturnsTable
        returns={returns}
        loading={loading}
        onView={handleView}
        showCustomer={false}
      />
      <ReturnDetailDrawer
        returnRecord={selected}
        onClose={handleCloseDrawer}
        mode="customer"
        onCancel={handleCancel}
        onActionSuccess={fetchReturns}
      />
    </div>
  );
};

export default ProfileReturnsTab;
