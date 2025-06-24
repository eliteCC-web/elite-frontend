import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  help?: string
  icon?: LucideIcon
  options: SelectOption[]
  placeholder?: string
  onChange?: (value: string) => void
  success?: boolean
}

export default function Select({
  label,
  error,
  help,
  icon: Icon,
  options,
  placeholder,
  onChange,
  success,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-neutral-400" />
          </div>
        )}
        
        <select
          id={selectId}
          className={cn(
            'select',
            Icon && 'pl-10',
            error && 'input-error',
            success && 'input-success',
            className
          )}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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