'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { getTenantConfig } from '@/tenants/config'
import { useCartStore } from '@/core/stores/cart'
import { CartSidebar } from '@/core/components/organisms'
import type { Product } from '@/core/services/types'
const ChatBot = dynamic(() => import('@/components/ChatBot'), { ssr: false })

export default function HomePage() {
  const tenant = getTenantConfig('eonlife')!
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const itemCount = useCartStore((state) => state.itemCount)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeBeforeAfter, setActiveBeforeAfter] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load n8n chat widget
  useEffect(() => {
    if (!document.querySelector('#n8n-chat-script')) {
      const s = document.createElement('script')
      s.id = 'n8n-chat-script'
      s.type = 'module'
      s.src = 'https://cdn.jsdelivr.net/npm/@n8n/chat@latest'
      document.body.appendChild(s)
    }
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/products?tenant=${tenant.slug}`)
        const data = await response.json()
        if (data.success && data.products) {
          setProducts(
            data.products.map((p: any) => ({
              ...p,
              description: p.description || '',
              images:
                (Array.isArray(p.images) && p.images.length && p.images) ||
                (p.featuredImage?.url ? [p.featuredImage.url] : undefined) ||
                (p.image ? [p.image] : ['/assets/eonlife/products/Reluma Large Bottle.png']),
              inStock: p.inStock ?? true,
            })),
          )
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [tenant.slug])

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, product.variants?.[0]?.id)
    openCart()
  }

  const content = tenant.content as any

  return (
    <>
      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Single Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - Single, Larger */}
            <a href="/" className="flex-shrink-0">
              <Image
                src="/assets/eonlife/logos/eon logo 1000px.png"
                alt="EonLife"
                width={260}
                height={90}
                className={`transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'} w-auto`}
                priority
              />
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['Products', 'Science', 'Results', 'Reviews'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className={`font-medium transition-colors ${
                    scrolled ? 'text-gray-700 hover:text-teal-600' : 'text-white hover:text-teal-200'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className={`relative p-3 rounded-full transition-all ${
                scrolled 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-teal-500 rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background - Split Design */}
          <div className="absolute inset-0 flex">
            {/* Left - Teal Gradient */}
            <div 
              className="w-full lg:w-3/5 h-full"
              style={{ background: 'linear-gradient(135deg, #00B5AD 0%, #008B8B 100%)' }}
            />
            {/* Right - Image (hidden on mobile) */}
            <div className="hidden lg:block w-2/5 h-full relative">
              <Image
                src="/assets/eonlife/models/AdobeStock_190974587.jpeg"
                alt="Beautiful skin"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/80 to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  {content.hero.headline}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-lg">
                  {content.hero.subheadline}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    Shop Now
                  </button>
                  <button
                    onClick={() => document.getElementById('science')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-90" />
                  <Image
                    src="/assets/eonlife/products/Reluma Large Bottle.png"
                    alt="ReLuma Serum"
                    width={350}
                    height={450}
                    className="relative z-10 drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* ==================== STATS BAR ==================== */}
        <section className="py-8 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 text-center text-white">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-teal-400">387</div>
                <div className="text-sm md:text-base text-gray-400">Growth Factors</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-teal-400">98%</div>
                <div className="text-sm md:text-base text-gray-400">Saw Results</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-teal-400">4-6</div>
                <div className="text-sm md:text-base text-gray-400">Weeks to Change</div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== ABOUT SECTION ==================== */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-4 bg-teal-500/10 rounded-3xl" />
                <Image
                  src="/assets/eonlife/models/slider-3_Beige-Background-and-women.jpg"
                  alt="Beautiful skin"
                  width={600}
                  height={700}
                  className="relative rounded-2xl shadow-2xl object-cover"
                />
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-teal-600">
                  {content.about.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {content.about.description}
                </p>
                
                {/* EonLife Info */}
                <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-8 rounded-r-lg">
                  <p className="text-gray-700">
                    <strong className="text-teal-700">EonLife Global</strong> is the exclusive authorized distributor of ReLuma products. We partner directly with the scientists who developed this breakthrough formula.
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4">
                  {(content.about.features || []).map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SCIENCE SECTION ==================== */}
        <section id="science" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-teal-600">
                The Science of Growth Factors
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {content.science?.description}
              </p>
            </div>

            {/* Big Number Highlight */}
            <div className="relative overflow-hidden rounded-3xl p-12 text-center text-white mb-16 bg-gradient-to-br from-teal-500 to-teal-700">
              <div className="relative z-10">
                <div className="text-7xl md:text-9xl font-bold mb-4">387</div>
                <div className="text-xl md:text-2xl font-medium mb-2">Growth Factors Identified</div>
                <div className="text-white/80">vs. competitors with fewer than 9</div>
              </div>
            </div>

            {/* Science Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'TGF-β Family', desc: 'Most important growth factor in skin. Potent stimulator of collagen production.', icon: '🧬' },
                { title: 'PDGF', desc: 'Platelet-derived growth factor promotes matrix production and reduces inflammation.', icon: '💧' },
                { title: 'Matrix Proteins', desc: 'Essential proteins that support skin structure and promote cellular regeneration.', icon: '✨' },
              ].map((card, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-teal-600">{card.title}</h3>
                  <p className="text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== RELUMA COPY / STORY ==================== */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-teal-600">Why ReLuma Works</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                ReLuma is the first bio-tech skin serum featuring multiple skin growth factors and matrix proteins,
                redefining skin care for the 21st century. Over 387 growth factors have been identified—far more than
                competing products. It rapidly diminishes the appearance of fine lines, helps repair damaged cells, and
                naturally calms inflammation for smoother, more even skin.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Exclusive to EonLife Global: we partner directly with the researchers behind ReLuma to ensure
                authenticity and maximum efficacy. Used daily, ReLuma supports collagen production, boosts hydration, and
                restores luminosity—making it ideal post-procedure (lasers, peels, Retin-A), or as a premium daily
                anti-aging regimen.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Trusted by medical estheticians with decades of experience, ReLuma has shown visible improvements in as
                little as 4–6 weeks for texture, tone, and fine lines.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== BEFORE/AFTER SECTION ==================== */}
        <section id="results" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-teal-600">
                Real Results, Real People
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See the transformative power of ReLuma
              </p>
            </div>

            {content.beforeAfter && content.beforeAfter.length > 0 && (
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Slider */}
                <div className="relative aspect-square max-w-md mx-auto w-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={content.beforeAfter[activeBeforeAfter].before}
                    alt="Before"
                    fill
                    className="object-cover"
                  />
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <Image
                      src={content.beforeAfter[activeBeforeAfter].after}
                      alt="After"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Slider Handle */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">Before</div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white text-gray-800 text-sm rounded-full shadow">After</div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-teal-600">
                    {content.beforeAfter[activeBeforeAfter].name}'s Transformation
                  </h3>
                  <p className="text-lg text-gray-600 italic mb-8">
                    "{content.beforeAfter[activeBeforeAfter].testimonial}"
                  </p>

                  {/* Thumbnails */}
              <div className="flex gap-4 justify-center">
                    {content.beforeAfter.map((item: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBeforeAfter(idx)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === activeBeforeAfter ? 'border-teal-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={item.after} alt={item.name} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ==================== PRODUCTS SECTION ==================== */}
        <section id="products" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-teal-600">Shop ReLuma</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The next generation in age-defying skin care
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100">
                    <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={250}
                          height={300}
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-48 h-60 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {!product.inStock && (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-gray-500 text-white text-sm rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-teal-600">${product.price.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="px-6 py-3 bg-teal-500 text-white rounded-full font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-600 hover:shadow-lg"
                        >
                          {product.inStock ? 'Add to Cart' : 'Sold Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section id="testimonials" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-teal-600">What Our Customers Say</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(content.testimonials || []).map((t: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 text-sm italic">"{t.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-24 bg-gradient-to-br from-teal-500 to-teal-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Skin?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have discovered the power of 387 growth factors.
            </p>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white text-teal-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12">
              {/* Logo & About */}
              <div className="md:col-span-2">
                <Image
                  src="/assets/eonlife/logos/eon logo 1000px.png"
                  alt="EonLife"
                  width={180}
                  height={60}
                  className="h-14 w-auto mb-6"
                />
                <p className="text-gray-400 max-w-md">
                  EonLife Global is the exclusive authorized distributor of ReLuma products. 
                  Redefining skincare for the 21st century with 387 human growth factors.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                  <li><a href="#science" className="hover:text-white transition-colors">Science</a></li>
                  <li><a href="#results" className="hover:text-white transition-colors">Results</a></li>
                  <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>support@eonlife.com</li>
                  <li>1-800-EON-LIFE</li>
                </ul>
                {/* Social Icons */}
                <div className="flex gap-4 mt-6">
                  {/* Facebook */}
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2.2c3.2,0,3.6,0,4.9.1,3.3.1,4.8,1.7,4.9,4.9.1,1.3.1,1.6.1,4.8s0,3.6-.1,4.9c-.1,3.2-1.7,4.8-4.9,4.9-1.3.1-1.6.1-4.9.1s-3.6,0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9C2.4,3.9,4,2.3,7.1,2.2,8.4,2.2,8.8,2.2,12,2.2ZM12,0C8.7,0,8.3,0,7,0,2.7.3.3,2.7,0,7,0,8.3,0,8.7,0,12s0,3.7,0,5c.3,4.3,2.7,6.7,7,7,1.3,0,1.7,0,5,0s3.7,0,5,0c4.3-.3,6.7-2.7,7-7,0-1.3,0-1.7,0-5s0-3.7,0-5C23.7,2.7,21.3.3,17,0,15.7,0,15.3,0,12,0Zm0,5.8A6.2,6.2,0,1,0,18.2,12,6.2,6.2,0,0,0,12,5.8ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.4,4.2a1.4,1.4,0,1,0,1.4,1.4A1.4,1.4,0,0,0,18.4,4.2Z"/>
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.45,20.45H16.9V14.88c0-1.33,0-3-1.85-3s-2.13,1.45-2.13,2.94v5.66H9.37V9h3.41v1.56h0a3.74,3.74,0,0,1,3.37-1.85c3.6,0,4.27,2.37,4.27,5.46ZM5.34,7.43A2.06,2.06,0,1,1,7.4,5.37,2.06,2.06,0,0,1,5.34,7.43Zm1.77,13H3.56V9H7.11ZM22.22,0H1.77A1.75,1.75,0,0,0,0,1.73V22.27A1.75,1.75,0,0,0,1.77,24H22.22A1.76,1.76,0,0,0,24,22.27V1.73A1.76,1.76,0,0,0,22.22,0Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} EonLife Global LLC. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      {/* Chatbot */}
      {process.env.NEXT_PUBLIC_ENABLE_CHATBOT !== 'false' && <ChatBot />}
    </>
  )
}
