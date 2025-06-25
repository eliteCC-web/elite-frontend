/* eslint-disable */

'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '@/components/ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}: ConfirmDialogProps) {
  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      confirmVariant: 'danger' as const
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      confirmVariant: 'secondary' as const
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-blue-500',
      confirmVariant: 'primary' as const
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <Icon size={24} className={config.iconColor} />
        </div>
        
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-neutral-600 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onCancel ? onCancel : onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}