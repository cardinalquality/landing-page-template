import { TenantConfig, TenantSlug } from './schema'

/**
 * Multi-Tenant Configurations
 *
 * Each brand (Reluma, Eonlife) has its own configuration
 * with custom theming, features, and SEO settings.
 */

export const TENANTS: Record<TenantSlug, TenantConfig> = {
  reluma: {
    id: 'reluma-001',
    slug: 'reluma',
    name: 'Reluma',
    domain: 'reluma.com',
    theme: {
      primaryColor: '#2563eb', // Blue-600
      secondaryColor: '#475569', // Slate-600
      accentColor: '#f59e0b', // Amber-500
      backgroundColor: '#ffffff',
      textColor: '#1e293b', // Slate-900
      logo: '/logos/reluma-logo.svg',
      favicon: '/favicons/reluma-favicon.ico',
    },
    features: {
      ecommerce: true,
      blog: true,
      multiLanguage: false,
      stripe: true,
      analytics: true,
    },
    seo: {
      title: 'Reluma - Premium E-Commerce Platform',
      description: 'Discover premium products and exceptional service at Reluma.',
      keywords: ['ecommerce', 'premium', 'reluma', 'online shopping'],
      ogImage: '/og-images/reluma-og.jpg',
    },
    stripeAccountId: process.env.RELUMA_STRIPE_ACCOUNT_ID,
  },

  eonlife: {
    id: 'eonlife-001',
    slug: 'eonlife',
    name: 'Eonlife',
    domain: 'eonlife.com',
    theme: {
      primaryColor: '#059669', // Emerald-600
      secondaryColor: '#64748b', // Slate-500
      accentColor: '#ec4899', // Pink-500
      backgroundColor: '#fafaf9', // Stone-50
      textColor: '#0f172a', // Slate-950
      logo: '/logos/eonlife-logo.svg',
      favicon: '/favicons/eonlife-favicon.ico',
    },
    features: {
      ecommerce: true,
      blog: true,
      multiLanguage: true,
      stripe: true,
      analytics: true,
    },
    seo: {
      title: 'Eonlife - Health & Wellness Products',
      description: 'Transform your life with Eonlife health and wellness solutions.',
      keywords: ['health', 'wellness', 'eonlife', 'longevity', 'supplements'],
      ogImage: '/og-images/eonlife-og.jpg',
    },
    stripeAccountId: process.env.EONLIFE_STRIPE_ACCOUNT_ID,
  },
}

/**
 * Get tenant configuration by slug
 */
export function getTenantConfig(slug: string): TenantConfig | undefined {
  return TENANTS[slug as TenantSlug]
}

/**
 * Get default tenant (from environment or fallback to 'reluma')
 */
export function getDefaultTenant(): TenantConfig {
  const defaultSlug = (process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'reluma') as TenantSlug
  return TENANTS[defaultSlug]
}
