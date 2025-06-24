import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  help?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  success?: boolean
}

export default function Input({
  label,
  error,
  help,
  icon: Icon,
  iconPosition = 'left',
  success,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-neutral-400" />
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'input',
            Icon && iconPosition === 'left' && 'pl-10',
            Icon && iconPosition === 'right' && 'pr-10',
            error && 'input-error',
            success && 'input-success',
            className
          )}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-neutral-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="form-error">{error}</p>
      )}
      
      {help && !error && (
        <p className="form-help">{help}</p>
      )}
    </div>
  )
} 