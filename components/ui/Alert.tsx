import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

export default function Alert({
  variant = 'info',
  title,
  children,
  className,
  onClose
}: AlertProps) {
  const variantConfig = {
    success: {
      classes: 'bg-success-50 border-success-200 text-success-800',
      icon: CheckCircle,
      iconColor: 'text-success-500'
    },
    error: {
      classes: 'alert-error',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      classes: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: AlertTriangle,
      iconColor: 'text-warning-500'
    },
    info: {
      classes: 'alert-info',
      icon: Info,
      iconColor: 'text-blue-500'
    }
  }

  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div className={cn('alert', config.classes, className)}>
      <div className="flex items-start gap-3">
        <Icon size={20} className={cn('mt-0.5 flex-shrink-0', config.iconColor)} />
        
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
} 