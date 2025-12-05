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
    name: 'EonLife',
    domain: 'eonlife.com',
    theme: {
      primaryColor: '#00B5AD', // Teal from mockup
      secondaryColor: '#2D3748', // Dark slate for text
      accentColor: '#38B2AC', // Lighter teal accent
      backgroundColor: '#FFFFFF',
      textColor: '#1A202C',
      logo: '/assets/eonlife/logos/eon logo 1000px.png',
      favicon: '/favicons/eonlife-favicon.ico',
      // Extended theme for new design
      gradientStart: '#00B5AD',
      gradientEnd: '#319795',
      heroOverlay: 'rgba(0, 181, 173, 0.85)',
    },
    content: {
      hero: {
        headline: 'Defy Aging with ReLuma Anti-Aging Serum',
        subheadline: 'A revolutionary breakthrough in skin science and technology to help reduce your wrinkles',
        ctaText: 'Shop Now',
        ctaSecondary: 'Learn More',
        backgroundImage: '/assets/eonlife/models/slider-2_girl-black-hair.jpg',
        productImage: '/assets/eonlife/products/Reluma Large Bottle.png',
        stats: [
          { value: '387', label: 'Growth Factors' },
          { value: '98%', label: 'Saw Results' },
          { value: '4-6', label: 'Weeks to See Change' },
        ],
      },
      about: {
        title: 'What is ReLuma?',
        description: 'ReLuma is the first bio-tech skin serum featuring Multiple Skin Growth Factors and Matrix Proteins, redefining skin care for the 21st Century. With over 387 Growth Factors identified, compared to similar products with fewer than 9.',
        eonlifeInfo: 'EonLife Global is the exclusive authorized distributor of ReLuma products. We partner directly with the scientists and researchers who developed this breakthrough formula, ensuring you receive only authentic, premium-quality serums backed by real science.',
        features: [
          'Rapidly diminishes fine lines and wrinkles',
          'Natural anti-inflammatory properties',
          'Repairs damaged cells and regenerates tissue',
          'Evens skin tone and lightens pigmentation',
          'Exclusive formula only available through EonLife',
        ],
      },
      science: {
        title: 'The Science of Growth Factors',
        description: 'Growth factors are very specific peptides that emit biological signals involved in the regulation of cell growth and function. They trigger cells to divide, grow, and produce matrix proteins like collagen.',
        keyFact: '387 Growth Factors vs. competitors with fewer than 9',
      },
      beforeAfter: [
        { 
          name: 'Georgia', 
          before: '/assets/eonlife/before-after/georgia after.jpg', 
          after: '/assets/eonlife/before-after/georgia before.jpg',
          testimonial: 'I noticed visible improvement in just 4 weeks!',
        },
        { 
          name: 'Janet', 
          before: '/assets/eonlife/before-after/janet after.jpg', 
          after: '/assets/eonlife/before-after/janet before.jpg',
          testimonial: 'My skin feels smoother and looks more radiant.',
        },
        { 
          name: 'Josie - Eyes', 
          before: '/assets/eonlife/before-after/josie eye after.jpg', 
          after: '/assets/eonlife/before-after/josie eye b4.jpg',
          testimonial: 'The fine lines around my eyes have diminished significantly.',
        },
      ],
      testimonials: [
        {
          name: 'Rosa Cardinal',
          location: 'Medical Esthetician',
          text: 'I have been in the skin care industry for over 37 years. Three weeks into using ReLuma and the difference was indisputably evident. My eyes have improved tremendously, my face has a glow, and my skin looks so much more even.',
          rating: 5,
        },
        {
          name: 'Kim Penney',
          location: 'Verified Customer',
          text: 'I am amazed at how my scars have faded away. My skin has been renewed and you can barely see the scars. I believe the ingredients in Reluma are the reason for this amazing healing.',
          rating: 5,
        },
        {
          name: 'MK',
          location: 'Spa Director, Ritz Carlton Naples',
          text: 'It\'s incredible! Everyone thinks I have had surgery and keep commenting on how good I look. Thank you so much for sharing this with me.',
          rating: 5,
        },
        {
          name: 'Ursula Kaiser',
          location: 'Verified Customer',
          text: 'I have been using ReLuma for two months and I have seen dramatic changes in my face. My lines and wrinkles softened and I have a more youthful look. Everyone tells me that I really look vibrant and rested.',
          rating: 5,
        },
      ],
      products: [
        {
          id: 'reluma-serum-large',
          name: 'ReLuma Skin Illuminating Serum',
          subtitle: '30ml / 1.0 FL.OZ',
          price: 230.00,
          compareAtPrice: 279.99,
          image: '/assets/eonlife/products/Reluma Large Bottle.png',
          rating: 4.9,
          reviewCount: 387,
          badge: 'bestseller',
          inStock: true,
          description: 'Our flagship serum featuring 387 human growth factors for comprehensive skin rejuvenation.',
        },
        {
          id: 'reluma-serum-small',
          name: 'ReLuma Travel Size',
          subtitle: '15ml / 0.5 FL.OZ',
          price: 129.00,
          image: '/assets/eonlife/products/Reluma Small bottle.png',
          rating: 4.8,
          reviewCount: 156,
          badge: 'travel',
          inStock: true,
          description: 'Perfect for travel or to try before committing to the full size.',
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
      title: 'EonLife | ReLuma Anti-Aging Serum with 387 Growth Factors',
      description: 'Defy aging with ReLuma - the revolutionary bio-tech skin serum featuring 387 human growth factors. Reduce wrinkles, tighten skin, restore luminosity.',
      keywords: ['anti-aging serum', 'growth factors skincare', 'stem cell serum', 'ReLuma', 'wrinkle reduction', 'skin rejuvenation', 'EonLife'],
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
