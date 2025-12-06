/**
 * Multi-Tenant Configuration Schema
 *
 * Defines the structure for tenant-specific configurations
 * including theming, features, and branding.
 */

export interface TenantTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  logo: string
  favicon: string
  gradientStart?: string
  gradientEnd?: string
  heroOverlay?: string
}

export interface TenantFeatures {
  ecommerce: boolean
  blog: boolean
  multiLanguage: boolean
  stripe: boolean
  analytics: boolean
}

export interface TenantSEO {
  title: string
  description: string
  keywords: string[]
  ogImage: string
}

export interface TenantProduct {
  id: string
  name: string
  subtitle?: string
  description?: string
  price: number
  compareAtPrice?: number
  image?: string
  rating?: number
  reviewCount?: number
  badge?: 'sale' | 'new' | 'bestseller' | 'travel'
  inStock?: boolean
  lowStock?: boolean
}

export interface TenantContent {
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    ctaSecondary?: string
    backgroundImage: string
    productImage: string
    stats?: { value: string; label: string }[]
  }
  about: {
    title: string
    description: string
    eonlifeInfo?: string
    features?: string[]
  }
  science?: {
    title: string
    description: string
    keyFact?: string
  }
  beforeAfter?: {
    name: string
    before: string
    after: string
    testimonial: string
  }[]
  testimonials?: {
    name: string
    location: string
    text: string
    rating: number
  }[]
  products: TenantProduct[]
}

/**
 * Shopify store configuration per tenant
 * Each tenant can have its own Shopify store
 */
export interface TenantShopifyConfig {
  storeDomain: string // e.g., "your-store.myshopify.com"
  storefrontAccessToken: string
  apiVersion?: string // defaults to latest stable
}

export interface TenantConfig {
  id: string
  slug: string
  name: string
  domain: string
  theme: TenantTheme
  content: TenantContent
  features: TenantFeatures
  seo: TenantSEO
  // Payment/Commerce providers (per-tenant)
  stripeAccountId?: string
  shopify?: TenantShopifyConfig
}

export type TenantSlug = 'reluma' | 'eonlife'
