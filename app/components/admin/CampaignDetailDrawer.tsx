'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Store, CheckCircle2, XCircle, Coins, Loader2, Image as ImageIcon } from 'lucide-react';
import type { IFreeProductCampaign } from '@/interfaces/freeProductCampaign/freeProductCampaign';
import { approveCampaignAction, rejectCampaignAction, updateCampaignAction } from '@/app/actions/freeProductCampaign';

export interface CampaignDetailDrawerProps {
  campaign: IFreeProductCampaign | null;
  onClose: () => void;
  onActionSuccess?: () => void;
}

const CampaignDetailDrawer: React.FC<CampaignDetailDrawerProps> = ({
  campaign,
  onClose,
  onActionSuccess,
}) => {
  const [busy, setBusy] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [pointsValue, setPointsValue] = useState(campaign?.pointsRequired || 0);
  const [isEditingPoints, setIsEditingPoints] = useState(false);

  const handleApprove = async () => {
    if (!campaign?.id) return;
    setBusy(true);
    try {
      const response = await approveCampaignAction(campaign.id);
      if (!response.error) {
        onActionSuccess?.();
        onClose();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!campaign?.id) return;
    setBusy(true);
    try {
      const response = await rejectCampaignAction(campaign.id);
      if (!response.error) {
        onActionSuccess?.();
        setShowRejectInput(false);
        setRejectReason('');
        onClose();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePoints = async () => {
    if (!campaign?.id || pointsValue < 1) return;
    setBusy(true);
    try {
      const response = await updateCampaignAction(campaign.id, {
        pointsRequired: pointsValue
      });
      if (!response.error) {
        onActionSuccess?.();
        setIsEditingPoints(false);
      }
    } finally {
      setBusy(false);
    }
  };

  const productName = campaign?.product?.title || 'Unknown Product';
  const productDescription = campaign?.product?.description || 'No description available';
  const productImages = campaign?.product?.images || [];
  
  // Handle applicant - it can be an array or single object
  const applicant = campaign?.vendor?.applicant;
  const vendorName = Array.isArray(applicant) 
    ? applicant[0]?.shopName 
    : applicant?.shopName || campaign?.vendor?.fullName || 'Unknown Vendor';
  
  const quantity = campaign?.quantity || 0;
  const isApproved = campaign?.isApproved || false;
  const isVisible = campaign?.isVisible || false;
  const hasVariant = !!campaign?.variant;
  const variantName = campaign?.variant?.name || '';
  const variantSku = campaign?.variant?.sku || '';
  const variantPrice = typeof campaign?.variant?.price === 'string' 
    ? parseFloat(campaign.variant.price) 
    : (campaign?.variant?.price || 0);
  const variantStock = campaign?.variant?.stock || 0;

  React.useEffect(() => {
    if (campaign) {
      setPointsValue(campaign.pointsRequired || 0);
    }
  }, [campaign]);

  return (
    <AnimatePresence>
      {campaign && (
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
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-jozi-forest to-jozi-dark shrink-0">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                  Campaign Details
                </h2>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}
                  >
                    {isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      isVisible
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-white hover:text-jozi-gold" />
              </button>
            </div>

            {/* Content */}
            <div className="grow overflow-y-auto p-8 space-y-6">
              {/* Product Images - Compact Gallery */}
              {productImages.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Product Gallery
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {productImages.slice(0, 4).map((image: any, idx: number) => {
                      const imageUrl = typeof image === 'object' && image.file ? image.file : typeof image === 'string' ? image : '';
                      return (
                        <div
                          key={idx}
                          className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-jozi-gold transition-all cursor-pointer"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={`${productName} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Details - More Compact */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-jozi-forest to-jozi-dark p-4 flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                      {hasVariant ? 'Product & Variant' : 'Product Name'}
                    </p>
                    <h3 className="font-black text-lg text-white truncate">{productName}</h3>
                    {hasVariant && (
                      <p className="text-sm font-bold text-white/80 mt-0.5">Variant: {variantName}</p>
                    )}
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{productDescription}</p>
                  </div>

                  {/* Variant Details */}
                  {hasVariant && (
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-2">Variant Details</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">SKU</p>
                          <p className="text-xs font-black text-amber-900 mt-0.5">{variantSku}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Price</p>
                          <p className="text-xs font-black text-amber-900 mt-0.5">R{variantPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Stock</p>
                          <p className="text-xs font-black text-amber-900 mt-0.5">{variantStock} units</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {hasVariant ? 'Variant Qty' : 'Product Qty'}
                      </p>
                      <p className="text-xl font-black text-jozi-forest">{quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign ID</p>
                      <p className="text-xs font-mono font-bold text-gray-500">{campaign.id.slice(0, 12)}...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Details - More Compact */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Store className="w-4 h-4 text-jozi-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor</p>
                    <p className="font-black text-base text-jozi-forest truncate">{vendorName}</p>
                  </div>
                </div>
              </div>

              {/* Points Assignment - Compact */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                      <Coins className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Points Required</p>
                  </div>
                  {!isEditingPoints && (
                    <button
                      onClick={() => setIsEditingPoints(true)}
                      className="px-3 py-1.5 bg-white text-amber-700 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-amber-100 transition-all border border-amber-200"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingPoints ? (
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={pointsValue}
                      onChange={(e) => setPointsValue(Number(e.target.value))}
                      min="1"
                      className="w-full px-4 py-2.5 bg-white border-2 border-amber-300 rounded-xl font-black text-xl text-center text-jozi-forest focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdatePoints}
                        disabled={busy || pointsValue < 1}
                        className="flex-1 py-2.5 bg-jozi-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-jozi-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {busy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPoints(false);
                          setPointsValue(campaign.pointsRequired || 0);
                        }}
                        disabled={busy}
                        className="px-4 py-2.5 bg-white text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-amber-900">{pointsValue.toLocaleString()} <span className="text-base text-amber-700">Points</span></p>
                )}
              </div>

              {/* Action Buttons */}
              {!isApproved && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {!showRejectInput ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleApprove}
                        disabled={busy}
                        className="py-3.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                      >
                        {busy ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Approve Campaign
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowRejectInput(true)}
                        disabled={busy}
                        className="py-3.5 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-2 border-red-200"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Campaign
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200 space-y-3">
                      <div>
                        <label className="text-[10px] font-black text-red-900 uppercase tracking-widest mb-2 block">
                          Rejection Reason (Optional)
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-sm"
                          rows={3}
                          placeholder="Explain why this campaign is being rejected..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleReject}
                          disabled={busy}
                          className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {busy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Confirm Rejection
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectInput(false);
                            setRejectReason('');
                          }}
                          disabled={busy}
                          className="px-4 py-2.5 bg-white text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
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

export default CampaignDetailDrawer;
