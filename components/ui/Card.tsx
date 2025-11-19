// components/ui/card.tsx
import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-zinc-900/50 border border-zinc-800 rounded-xl p-6',
          'transition-all hover:border-zinc-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
export { Card }