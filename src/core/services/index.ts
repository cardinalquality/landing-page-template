/**
 * Service Factory
 *
 * This is the ONLY file that needs to change when swapping providers.
 * Change one line to switch between Mock → Shopify → Custom API.
 */

import type { IProductService } from './interfaces'
import { MockProductService } from '../providers/MockProvider'
// import { ShopifyProductService } from '../providers/ShopifyProvider'  // Future
// import { CustomProductService } from '../providers/CustomProvider'    // Future

/**
 * Product Service Instance
 *
 * TO SWITCH PROVIDERS:
 * - Mock:    new MockProductService()
 * - Shopify: new ShopifyProductService()
 * - Custom:  new CustomProductService()
 */
export const productService: IProductService = new MockProductService()

/**
 * Re-export types for convenience
 */
export type { Product, Cart, CartItem, Order, Customer } from './types'
export type { IProductService, ICartService, ICheckoutService } from './interfaces'
