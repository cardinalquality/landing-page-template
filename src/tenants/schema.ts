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

export interface TenantConfig {
  id: string
  slug: string
  name: string
  domain: string
  theme: TenantTheme
  features: TenantFeatures
  seo: TenantSEO
  stripeAccountId?: string
}

export type TenantSlug = 'reluma' | 'eonlife'
