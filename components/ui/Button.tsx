import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all',
          'focus:outline-none focus:ring-2 focus:ring-white/20',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variants
          variant === 'primary' && 'bg-white text-black hover:bg-gray-100',
          variant === 'secondary' && 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700',
          variant === 'ghost' && 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-500',
          
          // Sizes
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }