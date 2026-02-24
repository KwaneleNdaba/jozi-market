'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Card } from './Card';
import { Table } from './Table';
import { 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  Loader2
} from 'lucide-react';
import type { IPointsConfigVersion } from '@/interfaces/admin/points-config';
import { getAllPointsConfigsAction } from '@/app/actions/points';
import type { IPointsConfig } from '@/interfaces/points/points';

export const ConfigurationListPage: React.FC = () => {
  const router = useRouter();
  const [versions, setVersions] = useState<IPointsConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; configId: string | null }>({
    isOpen: false,
    configId: null,
  });
  const [activateModal, setActivateModal] = useState<{ isOpen: boolean; configId: string | null }>({
    isOpen: false,
    configId: null,
  });

  // Load configurations on mount
  useEffect(() => {
    const fetchConfigs = async () => {
      setLoading(true);
      setError(null);
      const response = await getAllPointsConfigsAction();
      
      if (response.error) {
        setError(response.message);
      } else {
        setVersions(response.data || []);
      }
      setLoading(false);
    };

    fetchConfigs();
  }, []);

  const handleView = (configId: string) => {
    router.push(`/admin/points-config/${configId}?mode=view`);
  };

  const handleEdit = (configId: string) => {
    router.push(`/admin/points-config/${configId}?mode=edit`);
  };

  const handleCopy = (configId: string) => {
    setLoading(true);
    // TODO: Implement copy configuration API call
    setTimeout(() => {
      const config = versions.find(v => v.id === configId);
      if (config) {
        const newConfig: IPointsConfig = {
          ...config,
          id: `config-${Date.now()}`,
          version: Math.max(...versions.map(v => v.version)) + 1,
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          activatedAt: null,
          deactivatedAt: null,
        };
        setVersions([newConfig, ...versions]);
      }
      setLoading(false);
    }, 500);
  };

  const handleDelete = () => {
    if (!deleteModal.configId) return;
    
    setLoading(true);
    // TODO: Implement delete configuration API call
    setTimeout(() => {
      setVersions(versions.filter(v => v.id !== deleteModal.configId));
      setDeleteModal({ isOpen: false, configId: null });
      setLoading(false);
    }, 300);
  };

  const handleActivate = () => {
    if (!activateModal.configId) return;
    
    setLoading(true);
    // TODO: Implement activate configuration API call
    setTimeout(() => {
      setVersions(versions.map(v => {
        if (v.id === activateModal.configId) {
          return {
            ...v,
            isActive: true,
            activatedAt: new Date(),
          };
        }
        // Deactivate currently active version
        if (v.isActive) {
          return { ...v, isActive: false, deactivatedAt: new Date() };
        }
        return v;
      }));
      setActivateModal({ isOpen: false, configId: null });
      setLoading(false);
    }, 500);
  };

  const handleCreateNew = () => {
    router.push('/admin/points-config/new?mode=edit');
  };

  const getStatusBadge = (config: IPointsConfig) => {
    if (config.isActive) {
      return (
        <Badge variant="success" className="gap-1.5">
          <CheckCircle2 className="w-3 h-3" />
          Active
        </Badge>
      );
    }
    if (config.deactivatedAt) {
      return (
        <Badge variant="default" className="gap-1.5">
          <XCircle className="w-3 h-3" />
          Inactive
        </Badge>
      );
    }
    return (
      <Badge variant="warning" className="gap-1.5">
        <Clock className="w-3 h-3" />
        Draft
      </Badge>
    );
  };

  const getActionButtons = (config: IPointsConfig) => {
    const buttons = [];
    const isActive = config.isActive;

    // View button (all statuses)
    buttons.push(
      <Button
        key="view"
        variant="ghost"
        size="sm"
        icon={<Eye className="w-4 h-4" />}
        onClick={() => handleView(config.id)}
      >
        View
      </Button>
    );

    // Edit button (draft and archived)
    if (!isActive) {
      buttons.push(
        <Button
          key="edit"
          variant="ghost"
          size="sm"
          icon={<Edit className="w-4 h-4" />}
          onClick={() => handleEdit(config.id)}
        >
          Edit
        </Button>
      );
    }

    // Activate button (draft and archived)
    if (!isActive) {
      buttons.push(
        <Button
          key="activate"
          variant="secondary"
          size="sm"
          icon={<CheckCircle2 className="w-4 h-4" />}
          onClick={() => setActivateModal({ isOpen: true, configId: config.id })}
        >
          Activate
        </Button>
      );
    }

    // Copy button (all statuses)
    buttons.push(
      <Button
        key="copy"
        variant="ghost"
        size="sm"
        icon={<Copy className="w-4 h-4" />}
        onClick={() => handleCopy(config.id)}
      >
        Copy
      </Button>
    );

    // Delete button (draft and archived)
    if (!isActive) {
      buttons.push(
        <Button
          key="delete"
          variant="ghost"
          size="sm"
          icon={<Trash2 className="w-4 h-4 text-rose-600" />}
          onClick={() => setDeleteModal({ isOpen: true, configId: config.id })}
          className="text-rose-600 hover:bg-rose-50"
        >
          Delete
        </Button>
      );
    }

    return buttons;
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      key: 'version',
      header: 'Version',
      render: (row: IPointsConfig) => (
        <div className="font-semibold text-gray-900">
          Version {row.version}
        </div>
      ),
      width: '120px',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: IPointsConfig) => getStatusBadge(row),
      width: '140px',
    },
    {
      key: 'createdBy',
      header: 'Created By',
      render: (row: IPointsConfig) => (
        <div className="text-sm text-gray-700">{row.createdBy}</div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (row: IPointsConfig) => (
        <div className="text-sm text-gray-600">{formatDate(row.createdAt)}</div>
      ),
    },
    {
      key: 'activatedAt',
      header: 'Activated At',
      render: (row: IPointsConfig) => (
        <div className="text-sm text-gray-600">
          {formatDate(row.activatedAt)}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: IPointsConfig) => (
        <div className="flex items-center gap-2">
          {getActionButtons(row)}
        </div>
      ),
    },
  ];

  if (loading && versions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--jozi-forest)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Configurations</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Points Configuration</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage points earning, tiers, and rewards configuration
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-5 h-5" />}
          onClick={handleCreateNew}
        >
          Create New Configuration
        </Button>
      </div>

      {/* Configuration List */}
      {versions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No configurations yet</h3>
            <p className="text-sm text-gray-600 mb-6">
              Get started by creating your first points configuration
            </p>
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-5 h-5" />}
              onClick={handleCreateNew}
            >
              Create New Configuration
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={versions} />
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, configId: null })}
        title="Delete Configuration"
        description="Are you sure you want to delete this configuration? This action cannot be undone."
        variant="danger"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, configId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              Delete
            </Button>
          </>
        }
      />

      {/* Activate Confirmation Modal */}
      <Modal
        isOpen={activateModal.isOpen}
        onClose={() => setActivateModal({ isOpen: false, configId: null })}
        title="Activate Configuration"
        description="Activating this configuration will deactivate the current active version. Are you sure you want to proceed?"
        variant="warning"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setActivateModal({ isOpen: false, configId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleActivate}
              disabled={loading}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              Activate
            </Button>
          </>
        }
      />
    </div>
  );
};
