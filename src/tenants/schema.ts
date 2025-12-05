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
  price: number
  compareAtPrice?: number
  image?: string
  rating?: number
  reviewCount?: number
  badge?: 'sale' | 'new' | 'bestseller'
  inStock?: boolean
  lowStock?: boolean
}

export interface TenantContent {
  hero: {
    headline: string
    subheadline: string
    ctaText: string
    backgroundImage: string
    productImage: string
  }
  about: {
    title: string
    description: string
  }
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
