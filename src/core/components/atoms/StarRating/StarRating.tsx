import { cn } from '@/core/lib/cn'

export interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * StarRating Component
 *
 * Displays a 5-star rating with support for half stars.
 * Automatically clamps rating between 0 and 5.
 *
 * @example
 * ```tsx
 * <StarRating rating={4.5} size="md" />
 * ```
 */
export function StarRating({ rating, size = 'md', className }: StarRatingProps) {
  // Clamp rating between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating))

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const renderStar = (index: number) => {
    const starValue = index + 1
    const isFilled = clampedRating >= starValue
    const isHalf = !isFilled && clampedRating >= starValue - 0.5

    return (
      <svg
        key={index}
        data-testid="star"
        data-filled={isFilled ? 'true' : 'false'}
        data-half={isHalf ? 'true' : 'false'}
        className={cn(sizeClasses[size], 'inline-block')}
        fill={isFilled || isHalf ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        {isHalf ? (
          <>
            {/* Half star: filled left half, outlined right half */}
            <defs>
              <linearGradient id={`half-${index}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${index})`}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
            <path
              fill="none"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </>
        ) : (
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        )}
      </svg>
    )
  }

  return (
    <div
      className={cn('inline-flex items-center gap-1 text-yellow-500', className)}
      role="img"
      aria-label={`${clampedRating} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map(renderStar)}
    </div>
  )
}
