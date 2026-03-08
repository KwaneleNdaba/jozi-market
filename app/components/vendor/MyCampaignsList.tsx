'use client';

import React, { useState, useEffect } from 'react';
import { Package, Calendar, EyeOff, CheckCircle, Clock, XCircle, Loader2, Trash2 } from 'lucide-react';
import { IFreeProductCampaign } from '@/interfaces/freeProductCampaign/freeProductCampaign';
import { CustomResponse } from '@/interfaces/response';

interface MyCampaignsListProps {
  fetchCampaigns: () => Promise<CustomResponse<IFreeProductCampaign[]>>;
  onDelete?: (id: string) => Promise<void>;
  refreshTrigger?: number; // Used to trigger refresh after new submission
}

export const MyCampaignsList: React.FC<MyCampaignsListProps> = ({ 
  fetchCampaigns,
  onDelete,
  refreshTrigger = 0
}) => {
  const [campaigns, setCampaigns] = useState<IFreeProductCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch campaigns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCampaigns();
        
        if (response.error || !response.data) {
          setError(response.message || 'Failed to fetch campaigns');
          setCampaigns([]);
        } else {
          setCampaigns(response.data);
        }
      } catch (err: any) {
        console.error('Error fetching campaigns:', err);
        setError(err?.message || 'Failed to fetch campaigns');
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchCampaigns, refreshTrigger]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      await onDelete(id);
      // Remove from local state
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Error deleting campaign:', err);
      alert(err?.message || 'Failed to delete campaign');
    } finally {
      setDeletingId(null);
    }
  };

  // Get status badge
  const getStatusBadge = (campaign: IFreeProductCampaign) => {
    if (!campaign.isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Approval
        </span>
      );
    }
    if (campaign.isVisible) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <EyeOff className="w-3 h-3 mr-1" />
        Hidden
      </span>
    );
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading your campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center space-x-3 text-red-600">
          <XCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Error loading campaigns</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No campaigns yet</p>
          <p className="text-xs text-gray-400 mt-1">Submit your first product above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Points Required
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Visibility
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Total Claims
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Submitted
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {campaign.product?.title || 'Unknown Product'}
                      </p>
                      {campaign.variant?.name && (
                        <p className="text-xs text-purple-600">
                          Variant: {campaign.variant.name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {campaign.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-blue-600">
                    {campaign.pointsRequired === 0 ? (
                      <span className="text-gray-400">Pending</span>
                    ) : (
                      `${campaign.pointsRequired} pts`
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {campaign.isVisible ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Visible
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {campaign.totalClaims || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(campaign)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(campaign.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {!campaign.isApproved && onDelete && (
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      disabled={deletingId === campaign.id}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete campaign (only allowed before approval)"
                    >
                      {deletingId === campaign.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  )}
                  {campaign.isApproved && (
                    <span className="text-xs text-gray-400">
                      Cannot edit after approval
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {campaigns.some(c => c.expiryDate) && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            * Some campaigns have expiry dates. Check individual campaigns for details.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCampaignsList;
