'use client'

import Image from 'next/image'

export interface HeroProps {
  headline: string
  subheadline: string
  ctaText: string
  ctaHref?: string
  backgroundImage?: string
  productImage?: string
  onCtaClick?: () => void
}

/**
 * Hero Section Component
 *
 * Full-width hero section with headline, subheadline, CTA, and background image.
 * Optimized for e-commerce landing pages.
 */
export function Hero({
  headline,
  subheadline,
  ctaText,
  backgroundImage,
  productImage,
  onCtaClick,
}: HeroProps) {
  return (
    <section className="relative min-h-screen pt-16 flex items-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {headline}
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onCtaClick}
                className="px-8 py-4 bg-[#D4A574] hover:bg-[#C69564] text-white rounded-full transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {ctaText}
              </button>
              <button
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all font-semibold text-lg border border-white/30"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Product Image */}
          {productImage && (
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src={productImage}
                alt="Product"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
