// components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: 'blue' | 'red' | 'gray'
    text?: string
  }
  
  export default function LoadingSpinner({ 
    size = 'md', 
    color = 'blue', 
    text 
  }: LoadingSpinnerProps) {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    }
  
    const colorClasses = {
      blue: 'border-blue-600',
      red: 'border-red-600',
      gray: 'border-gray-600'
    }
  
    return (
      <div className="flex flex-col items-center justify-center">
        <div 
          className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
        />
        {text && (
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    )
  }
  