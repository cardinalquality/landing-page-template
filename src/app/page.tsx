'use client'

import { useEffect, useState } from 'react'
import { Hero } from '@/core/components/sections'
import { ProductCard } from '@/core/components/molecules'
import { getTenantConfig } from '@/tenants/config'
import { useCartStore } from '@/core/stores/cart'
import type { Product } from '@/core/services'

export default function HomePage() {
  // Eonlife is the store, ReLuma is the product
  const tenant = getTenantConfig('eonlife')!
  const addItem = useCartStore((state) => state.addItem)
  
  // State for Shopify products
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API (Shopify or Mock based on NEXT_PUBLIC_DATA_PROVIDER)
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch('/api/products?tenant=eonlife')
        const data = await response.json()
        
        if (data.success && data.products.length > 0) {
          setProducts(data.products)
        } else {
          // Fallback to tenant config products if API returns empty
          setProducts(tenant.content.products.map(p => ({
            ...p,
            description: '',
            images: p.image ? [p.image] : [],
            inStock: p.inStock ?? true,
          })))
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products')
        // Fallback to tenant config products
        setProducts(tenant.content.products.map(p => ({
          ...p,
          description: '',
          images: p.image ? [p.image] : [],
          inStock: p.inStock ?? true,
        })))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [tenant.content.products])

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      addItem(product)
    }
  }

  return (
    <main className="min-h-screen">
      <Hero
        headline={tenant.content.hero.headline}
        subheadline={tenant.content.hero.subheadline}
        ctaText={tenant.content.hero.ctaText}
        backgroundImage={tenant.content.hero.backgroundImage}
        productImage={tenant.content.hero.productImage}
      />

      {/* About Section - What is ReLuma? */}
      <section id="about" className="py-20" style={{ backgroundColor: tenant.theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
              {tenant.content.about.title}
            </h2>
            <div className="w-24 h-1 mx-auto" style={{ backgroundColor: tenant.theme.primaryColor }}></div>
          </div>
          <p className="text-lg md:text-xl text-center max-w-4xl mx-auto leading-relaxed" style={{ color: tenant.theme.textColor }}>
            {tenant.content.about.description}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
              Shop Our Collection
            </h2>
            <div className="w-24 h-1 mx-auto" style={{ backgroundColor: tenant.theme.primaryColor }}></div>
            {/* Data source indicator (remove in production) */}
            <p className="text-sm text-gray-500 mt-2">
              Source: {process.env.NEXT_PUBLIC_DATA_PROVIDER || 'mock'} 
              {loading && ' • Loading...'}
              {error && ` • ${error}`}
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  image={product.images[0]}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  badge={product.badge}
                  inStock={product.inStock}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
