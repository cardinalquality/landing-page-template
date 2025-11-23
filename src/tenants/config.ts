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
      primaryColor: '#8B7355', // Warm brown/beige from Reluma branding
      secondaryColor: '#F5F1ED', // Light cream background
      accentColor: '#D4A574', // Gold accent
      backgroundColor: '#FFFFFF',
      textColor: '#2C2C2C',
      logo: '/assets/eonlife/desktop/Navagation/ReLuma_Logo.png',
      favicon: '/favicons/eonlife-favicon.ico',
    },
    features: {
      ecommerce: true,
      blog: false,
      multiLanguage: false,
      stripe: true,
      analytics: true,
    },
    seo: {
      title: 'Eonlife - ReLuma Skincare | 387 Human Growth Factors',
      description: 'Discover radiant, youthful skin with ReLuma. Powered by 387 Human Growth Factors for comprehensive skin rejuvenation.',
      keywords: ['skincare', 'anti-aging', 'growth factors', 'skin rejuvenation', 'ReLuma', 'eonlife'],
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
 * Get default tenant (from environment or fallback to 'eonlife')
 */
export function getDefaultTenant(): TenantConfig {
  const defaultSlug = (process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'eonlife') as TenantSlug
  return TENANTS[defaultSlug]
}
