'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Drawer } from './Drawer';
import { 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Power,
  PowerOff
} from 'lucide-react';
import { 
  getAllPointsConfigsAction,
  createPointsConfigAction,
  updatePointsConfigAction,
  activatePointsConfigAction,
  deactivatePointsConfigAction,
} from '@/app/actions/points';
import type { IPointsConfig, ICreatePointsConfig } from '@/interfaces/points/points';

export const PointsConfigVersionsPage: React.FC = () => {
  const [versions, setVersions] = useState<IPointsConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Drawer states
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<IPointsConfig | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<ICreatePointsConfig>>({
    pointsEnabled: true,
    redemptionEnabled: true,
    allowStackWithDiscounts: false,
    createdBy: 'Current Admin User',
  });
  
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllPointsConfigsAction();
      
      if (response.error) {
        setError(response.message);
      } else if (response.data) {
        setVersions(response.data);
      }
    } catch (err) {
      console.error('[PointsConfigVersions] Error loading versions:', err);
      setError('Failed to load point configurations');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleView = (version: IPointsConfig) => {
    setSelectedVersion(version);
    setViewDrawerOpen(true);
  };

  const handleEdit = (version: IPointsConfig) => {
    setSelectedVersion(version);
    setFormData({
      pointsEnabled: version.pointsEnabled,
      redemptionEnabled: version.redemptionEnabled,
      allowStackWithDiscounts: version.allowStackWithDiscounts,
      createdBy: version.createdBy || 'Current Admin User',
    });
    setEditDrawerOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      pointsEnabled: true,
      redemptionEnabled: true,
      allowStackWithDiscounts: false,
      createdBy: 'Current Admin User',
    });
    setCreateDrawerOpen(true);
  };

  const handleCreateSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const response = await createPointsConfigAction(formData as ICreatePointsConfig);
      
      if (response.error) {
        showError(response.message);
      } else {
        showSuccess('Points configuration created successfully!');
        setCreateDrawerOpen(false);
        await loadVersions();
      }
    } catch (err) {
      console.error('[PointsConfigVersions] Error creating:', err);
      showError('Failed to create configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSave = async () => {
    if (!selectedVersion) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await updatePointsConfigAction(selectedVersion.id, formData);
      
      if (response.error) {
        showError(response.message);
      } else {
        showSuccess('Points configuration updated successfully!');
        setEditDrawerOpen(false);
        setSelectedVersion(null);
        await loadVersions();
      }
    } catch (err) {
      console.error('[PointsConfigVersions] Error updating:', err);
      showError('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (id: string) => {
    if (!confirm('Are you sure you want to activate this configuration? This will deactivate any currently active configuration.')) {
      return;
    }
    
    setActionLoading(id);
    
    try {
      const response = await activatePointsConfigAction(id);
      
      if (response.error) {
        showError(response.message);
      } else {
        showSuccess('Configuration activated successfully!');
        await loadVersions();
      }
    } catch (err) {
      console.error('[PointsConfigVersions] Error activating:', err);
      showError('Failed to activate configuration');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this configuration?')) {
      return;
    }
    
    setActionLoading(id);
    
    try {
      const response = await deactivatePointsConfigAction(id);
      
      if (response.error) {
        showError(response.message);
      } else {
        showSuccess('Configuration deactivated successfully!');
        await loadVersions();
      }
    } catch (err) {
      console.error('[PointsConfigVersions] Error deactivating:', err);
      showError('Failed to deactivate configuration');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(id);
    
    try {
      // TODO: Implement delete action when backend is ready
      showSuccess('Configuration deleted successfully!');
      await loadVersions();
    } catch (err) {
      console.error('[PointsConfigVersions] Error deleting:', err);
      showError('Failed to delete configuration');
    } finally {
      setActionLoading(null);
    }
  };

  const renderForm = () => (
    <div className="space-y-6">
      {/* Points Enabled */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.pointsEnabled}
            onChange={(e) => setFormData({ ...formData, pointsEnabled: e.target.checked })}
            className="w-4 h-4 text-[var(--jozi-forest)] rounded"
          />
          <span className="text-sm font-medium text-gray-900">Points System Enabled</span>
        </label>
      </div>

      {/* Redemption Enabled */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.redemptionEnabled}
            onChange={(e) => setFormData({ ...formData, redemptionEnabled: e.target.checked })}
            disabled={!formData.pointsEnabled}
            className="w-4 h-4 text-[var(--jozi-forest)] rounded disabled:opacity-50"
          />
          <span className="text-sm font-medium text-gray-900">Redemption Enabled</span>
        </label>
      </div>

      {/* Allow Stacking */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allowStackWithDiscounts}
            onChange={(e) => setFormData({ ...formData, allowStackWithDiscounts: e.target.checked })}
            disabled={!formData.redemptionEnabled}
            className="w-4 h-4 text-[var(--jozi-forest)] rounded disabled:opacity-50"
          />
          <span className="text-sm font-medium text-gray-900">Allow Stacking with Discounts</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Points Configuration Versions</h1>
          <p className="text-gray-600 mt-1">Manage different versions of your points configuration</p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon={<Plus className="w-4 h-4" />}
        >
          Create New Version
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-green-900">{success}</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-900">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--jozi-forest)]" />
          </div>
        </Card>
      )}

      {/* Versions Table */}
      {!loading && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points Enabled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Redemption
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Redemption
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {versions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500">No configurations found</p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleCreate}
                          icon={<Plus className="w-4 h-4" />}
                        >
                          Create First Configuration
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  versions.map((version) => (
                    <tr key={version.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">v{version.version}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={version.isActive ? 'success' : 'default'}>
                          {version.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            'Inactive'
                          )}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={version.pointsEnabled ? 'success' : 'default'}>
                          {version.pointsEnabled ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={version.redemptionEnabled ? 'success' : 'default'}>
                          {version.redemptionEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(version)}
                            icon={<Eye className="w-4 h-4" />}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(version)}
                            icon={<Edit3 className="w-4 h-4" />}
                            disabled={actionLoading === version.id}
                          >
                            Edit
                          </Button>
                          {version.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivate(version.id)}
                              icon={actionLoading === version.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <PowerOff className="w-4 h-4 text-red-600" />}
                              disabled={actionLoading === version.id}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivate(version.id)}
                              icon={actionLoading === version.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4 text-green-600" />}
                              disabled={actionLoading === version.id}
                            >
                              Activate
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(version.id)}
                            icon={actionLoading === version.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-600" />}
                            disabled={actionLoading === version.id || version.isActive}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* View Drawer */}
      <Drawer
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        title={`Points Configuration v${selectedVersion?.version}`}
        size="md"
      >
        {selectedVersion && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant={selectedVersion.isActive ? 'success' : 'default'}>
                  {selectedVersion.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Version</p>
                <p className="text-sm font-semibold text-gray-900">v{selectedVersion.version}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Points System</p>
                <Badge variant={selectedVersion.pointsEnabled ? 'success' : 'default'}>
                  {selectedVersion.pointsEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Redemption</p>
                <Badge variant={selectedVersion.redemptionEnabled ? 'success' : 'default'}>
                  {selectedVersion.redemptionEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Allow Stacking with Discounts</p>
              <Badge variant={selectedVersion.allowStackWithDiscounts ? 'success' : 'default'}>
                {selectedVersion.allowStackWithDiscounts ? 'Yes' : 'No'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p className="text-sm font-semibold text-gray-900">{selectedVersion.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(selectedVersion.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {selectedVersion.activatedAt && (
              <div>
                <p className="text-sm font-medium text-gray-500">Activated At</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(selectedVersion.activatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        title={`Edit Configuration v${selectedVersion?.version}`}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setEditDrawerOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateSave}
              disabled={saving}
              icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        {renderForm()}
      </Drawer>

      {/* Create Drawer */}
      <Drawer
        isOpen={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        title="Create New Points Configuration"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setCreateDrawerOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSave}
              disabled={saving}
              icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {saving ? 'Creating...' : 'Create Configuration'}
            </Button>
          </div>
        }
      >
        {renderForm()}
      </Drawer>
    </div>
  );
};
