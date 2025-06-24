// components/ui/Badge.tsx
interface BadgeProps {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent-yellow' | 'accent-green' | 'accent-purple'
    size?: 'sm' | 'md' | 'lg'
    className?: string
  }
  
  export default function Badge({ children, variant = 'primary', size = 'md', className = '' }: BadgeProps) {
    const variantClasses = {
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'badge-danger',
      neutral: 'bg-neutral-100 text-neutral-800',
      'accent-yellow': 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20',
      'accent-green': 'bg-accent-green/10 text-accent-green border border-accent-green/20',
      'accent-purple': 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20'
    }
  
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm'
    }
  
    return (
      <span className={`badge ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
        {children}
      </span>
    )
  }