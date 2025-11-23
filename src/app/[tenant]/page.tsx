'use client'

import { Hero } from '@/core/components/sections'
import { ProductCard } from '@/core/components/molecules'
import { useTenant } from '@/core/hooks/useTenant'

export default function TenantHomePage() {
  const tenant = useTenant()

  const handleAddToCart = (productId: string) => {
    console.log(`[${tenant.slug}] Add to cart:`, productId)
    // Will connect to cart state and Shopify API later
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

      {/* About Section - Uses Tenant Content */}
      <section className="py-20" style={{ backgroundColor: tenant.theme.secondaryColor }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: tenant.theme.primaryColor }}>
            {tenant.content.about.title}
          </h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: tenant.theme.textColor }}>
            {tenant.content.about.description}
          </p>
        </div>
      </section>

      {/* Products Section - Uses Tenant Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: tenant.theme.primaryColor }}>
            Shop Our Collection
          </h2>
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
