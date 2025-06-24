import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  help?: string
  success?: boolean
}

export default function Textarea({
  label,
  error,
  help,
  success,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={cn(
          'textarea',
          error && 'input-error',
          success && 'input-success',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="form-error">{error}</p>
      )}
      
      {help && !error && (
        <p className="form-help">{help}</p>
      )}
    </div>
  )
} 