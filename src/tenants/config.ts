import { TenantConfig, TenantSlug, TenantShopifyConfig } from './schema'

/**
 * Helper to get Shopify config from environment variables
 * Each tenant can have its own Shopify store
 */
function getShopifyConfig(tenantSlug: string): TenantShopifyConfig | undefined {
  const storeDomain = process.env[`SHOPIFY_${tenantSlug.toUpperCase()}_STORE_DOMAIN`]
  const accessToken = process.env[`SHOPIFY_${tenantSlug.toUpperCase()}_STOREFRONT_ACCESS_TOKEN`]

  if (!storeDomain || !accessToken) {
    return undefined
  }

  return {
    storeDomain,
    storefrontAccessToken: accessToken,
    apiVersion: '2025-01', // Latest stable version
  }
}

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
    content: {
      hero: {
        headline: 'Premium Products, Exceptional Results',
        subheadline: 'Elevate Your Lifestyle with Reluma',
        ctaText: 'Explore Products',
        backgroundImage: '/assets/eonlife/desktop/Section_1_assets/Section_1_1920x900.png',
        productImage: '/assets/eonlife/desktop/Section_1_assets/Small_Bottle.png',
      },
      about: {
        title: 'Why Choose Reluma?',
        description: 'Reluma offers premium quality products backed by science and innovation. Experience the difference that excellence makes.',
      },
      products: [
        {
          id: 'reluma-essential-kit',
          name: 'Essential Wellness Kit',
          price: 199.99,
          compareAtPrice: 249.99,
          image: '/assets/eonlife/desktop/Section_3_assets/Small_Bottle.png',
          rating: 4.7,
          reviewCount: 156,
          badge: 'bestseller',
          inStock: true,
        },
        {
          id: 'reluma-premium-supplement',
          name: 'Premium Daily Supplement',
          price: 79.99,
          image: '/assets/eonlife/desktop/Section_5_assets/Section_5_Small_Bottle.png',
          rating: 4.5,
          reviewCount: 98,
          inStock: true,
        },
        {
          id: 'reluma-advanced-formula',
          name: 'Advanced Recovery Formula',
          price: 159.99,
          compareAtPrice: 189.99,
          image: '/assets/eonlife/desktop/Section_10_assets/Small_Bottle.png',
          rating: 4.8,
          reviewCount: 203,
          badge: 'new',
          inStock: true,
        },
      ],
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
    shopify: getShopifyConfig('reluma'),
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
    content: {
      hero: {
        headline: 'Discover Radiant, Youthful Skin',
        subheadline: 'Powered by 387 Human Growth Factors',
        ctaText: 'Shop Now',
        backgroundImage: '/assets/eonlife/desktop/Section_1_assets/Section_1_1920x900.png',
        productImage: '/assets/eonlife/desktop/Section_1_assets/Small_Bottle.png',
      },
      about: {
        title: 'What is ReLuma?',
        description: 'ReLuma harnesses 387 human growth factors derived from ethically sourced stem cells to reduce wrinkles, tighten skin, and restore your natural luminosity.',
      },
      products: [
        {
          id: 'eonlife-reluma-serum',
          name: 'ReLuma Renewal Serum',
          price: 129.99,
          compareAtPrice: 179.99,
          image: '/assets/eonlife/desktop/Section_3_assets/Small_Bottle.png',
          rating: 4.8,
          reviewCount: 234,
          badge: 'bestseller',
          inStock: true,
        },
        {
          id: 'eonlife-reluma-moisturizer',
          name: 'ReLuma Daily Moisturizer',
          price: 89.99,
          compareAtPrice: 119.99,
          image: '/assets/eonlife/desktop/Section_5_assets/Section_5_Small_Bottle.png',
          rating: 4.6,
          reviewCount: 187,
          badge: 'sale',
          inStock: true,
        },
        {
          id: 'eonlife-reluma-night',
          name: 'ReLuma Night Repair',
          price: 149.99,
          image: '/assets/eonlife/desktop/Section_10_assets/Small_Bottle.png',
          rating: 4.9,
          reviewCount: 312,
          badge: 'new',
          inStock: true,
        },
      ],
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
    shopify: getShopifyConfig('eonlife'),
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
