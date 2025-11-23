import Image from 'next/image'
import Link from 'next/link'
import { StarRating, Badge, Button } from '@/core/components/atoms'
import { cn } from '@/core/lib/cn'

export interface ProductCardProps {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  image?: string
  rating?: number
  reviewCount?: number
  badge?: 'sale' | 'new' | 'bestseller'
  inStock?: boolean
  lowStock?: boolean
  href?: string
  onAddToCart?: (id: string) => void
  className?: string
}

/**
 * ProductCard Component
 *
 * Displays product information in a card format with image, title, price, rating, and CTA.
 * Used in product grids and listings.
 */
export function ProductCard({
  id,
  name,
  price,
  compareAtPrice,
  image,
  rating = 0,
  reviewCount = 0,
  badge,
  inStock = true,
  lowStock = false,
  href,
  onAddToCart,
  className,
}: ProductCardProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0

  const cardContent = (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group',
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {hasDiscount && <Badge variant="sale">{discountPercentage}% OFF</Badge>}
          {badge === 'bestseller' && <Badge variant="bestseller">BESTSELLER</Badge>}
          {badge === 'new' && <Badge variant="new">NEW</Badge>}
          {lowStock && inStock && <Badge variant="lowStock">LOW STOCK</Badge>}
          {!inStock && <Badge variant="outOfStock">OUT OF STOCK</Badge>}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#8B7355] transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={rating} size="sm" />
            <span className="text-sm text-gray-600">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-lg text-gray-500 line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full bg-[#8B7355] hover:bg-[#7A6449]"
          disabled={!inStock}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAddToCart?.(id)
          }}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href as any} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
