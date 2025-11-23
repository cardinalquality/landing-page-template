'use client'

import { Hero } from '@/core/components/sections'
import { ProductCard } from '@/core/components/molecules'

// Mock product data - will be replaced with Shopify API later
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'ReLuma Renewal Serum',
    price: 129.99,
    compareAtPrice: 179.99,
    image: '/assets/eonlife/desktop/Section_3_assets/Small_Bottle.png',
    rating: 4.8,
    reviewCount: 234,
    badge: 'bestseller' as const,
    inStock: true,
  },
  {
    id: '2',
    name: 'ReLuma Daily Moisturizer',
    price: 89.99,
    compareAtPrice: 119.99,
    image: '/assets/eonlife/desktop/Section_5_assets/Section_5_Small_Bottle.png',
    rating: 4.6,
    reviewCount: 187,
    badge: 'sale' as const,
    inStock: true,
  },
  {
    id: '3',
    name: 'ReLuma Night Repair',
    price: 149.99,
    image: '/assets/eonlife/desktop/Section_10_assets/Small_Bottle.png',
    rating: 4.9,
    reviewCount: 312,
    badge: 'new' as const,
    inStock: true,
  },
]

export default function HomePage() {
  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId)
    // Will connect to cart state later
  }

  return (
    <main className="min-h-screen">
      <Hero
        headline="Discover Radiant, Youthful Skin"
        subheadline="Powered by 387 Human Growth Factors"
        ctaText="Shop Now"
        backgroundImage="/assets/eonlife/desktop/Section_1_assets/Section_1_1920x900.png"
        productImage="/assets/eonlife/desktop/Section_1_assets/Small_Bottle.png"
      />

      {/* What is ReLuma Section */}
      <section className="py-20 bg-[#F5F1ED]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#8B7355] mb-6">
            What is ReLuma?
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            ReLuma harnesses 387 human growth factors derived from ethically sourced stem cells
            to reduce wrinkles, tighten skin, and restore your natural luminosity.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#8B7355] mb-12 text-center">
            Shop Our Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
