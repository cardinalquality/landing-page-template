/**
 * Service Factory
 *
 * Automatically selects the right provider based on environment configuration.
 * Set NEXT_PUBLIC_DATA_PROVIDER in .env.local to switch:
 * - "mock"    → MockProductService (hardcoded data for development)
 * - "shopify" → ShopifyProductService (Shopify Storefront API)
 * - "custom"  → Future: CustomProductService (your own API)
 */

import type { IProductService } from './interfaces'
import { MockProductService } from '../providers/MockProvider'
import { ShopifyProductService } from '../providers/ShopifyProvider'
import { getTenantConfig, getDefaultTenant } from '@/tenants/config'

/**
 * Data Provider Types
 */
type DataProvider = 'mock' | 'shopify' | 'custom'

/**
 * Get the configured data provider from environment
 */
function getDataProvider(): DataProvider {
  const provider = process.env.NEXT_PUBLIC_DATA_PROVIDER as DataProvider
  return provider || 'mock'
}

/**
 * Create Product Service based on provider and tenant
 *
 * Each tenant can have its own Shopify store, allowing this template
 * to be reused for multiple clients/brands.
 */
function createProductService(tenantSlug?: string): IProductService {
  const provider = getDataProvider()
  const tenant = tenantSlug ? getTenantConfig(tenantSlug) : getDefaultTenant()

  switch (provider) {
    case 'shopify':
      if (!tenant?.shopify) {
        console.warn(
          `Shopify provider requested but no Shopify config found for tenant "${tenant?.slug}". ` +
            `Falling back to mock provider. Check your .env.local file.`
        )
        return new MockProductService()
      }
      return new ShopifyProductService(tenant.shopify)

    case 'custom':
      // TODO: Implement CustomProductService when ready
      console.warn('Custom provider not yet implemented. Using mock provider.')
      return new MockProductService()

    case 'mock':
    default:
      return new MockProductService()
  }
}

/**
 * Default Product Service Instance
 *
 * Uses the default tenant's configuration.
 * For multi-tenant apps, use createProductService(tenantSlug) instead.
 */
export const productService: IProductService = createProductService()

/**
 * Factory function for creating tenant-specific services
 * Use this when you need to fetch products for a specific tenant
 */
export { createProductService }

/**
 * Re-export types for convenience
 */
export type { Product, Cart, CartItem, Order, Customer } from './types'
export type { IProductService, ICartService, ICheckoutService } from './interfaces'
