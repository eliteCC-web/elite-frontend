import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn'
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    success: 'bg-success-500 hover:bg-success-600 text-white py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-success-500 active:scale-95',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-warning-500 active:scale-95'
  }

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }

  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="spinner h-4 w-4" />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
      )}
    </button>
  )
} 