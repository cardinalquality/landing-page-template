import { cn } from '@/core/lib/cn'

export type BadgeVariant = 'sale' | 'new' | 'lowStock' | 'outOfStock' | 'bestseller'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

/**
 * Badge Component
 *
 * Small label for product tags, status indicators, etc.
 *
 * @example
 * ```tsx
 * <Badge variant="sale">50% OFF</Badge>
 * <Badge variant="new">New</Badge>
 * ```
 */
export function Badge({ variant = 'sale', children, className }: BadgeProps) {
  const variantStyles = {
    sale: 'bg-red-500 text-white',
    new: 'bg-blue-500 text-white',
    lowStock: 'bg-orange-500 text-white',
    outOfStock: 'bg-gray-500 text-white',
    bestseller: 'bg-yellow-500 text-white',
  }

  return (
    <span
      className={cn(
        'inline-block px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
