// components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'white'
    text?: string
    className?: string
  }
  
  export default function LoadingSpinner({ 
    size = 'md', 
    color = 'primary', 
    text,
    className = ''
  }: LoadingSpinnerProps) {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16'
    }
  
    const colorClasses = {
      primary: 'border-primary-500',
      secondary: 'border-secondary-500',
      success: 'border-success-500',
      warning: 'border-warning-500',
      neutral: 'border-neutral-500',
      white: 'border-white'
    }
  
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div 
          className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}
        />
        {text && (
          <p className="mt-3 text-sm text-neutral-600 font-medium">{text}</p>
        )}
      </div>
    )
  }
  