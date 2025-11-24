'use client'

import { Hero } from '@/core/components/sections'
import { ProductCard } from '@/core/components/molecules'
import { getTenantConfig } from '@/tenants/config'
import { useCartStore } from '@/core/stores/cart'

export default function HomePage() {
  // Eonlife is the store, ReLuma is the product
  const tenant = getTenantConfig('eonlife')!
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (productId: string) => {
    const product = tenant.content.products.find((p) => p.id === productId)
    if (product) {
      // Convert tenant product to full Product type and add to cart
      addItem({
        ...product,
        description: '',
        images: product.image ? [product.image] : [],
        inStock: product.inStock ?? true,
      })
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tenant.content.products.map((product) => (
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
