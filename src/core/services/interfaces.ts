/**
 * Service Interfaces
 *
 * These interfaces define the contract that all providers must implement.
 * This allows us to swap between Mock → Shopify → Custom API seamlessly.
 */

import type {
  Product,
  Cart,
  Order,
  Customer,
  PaymentInfo,
  PaymentResult,
} from './types'

/**
 * Product Service
 * Handles all product-related operations
 */
export interface IProductService {
  /**
   * Get all products
   */
  getProducts(): Promise<Product[]>

  /**
   * Get a single product by ID
   */
  getProduct(id: string): Promise<Product | null>

  /**
   * Search products by query
   */
  searchProducts(query: string): Promise<Product[]>

  /**
   * Get products by category/tag
   */
  getProductsByCategory(category: string): Promise<Product[]>
}

/**
 * Cart Service
 * Handles cart state and operations
 */
export interface ICartService {
  /**
   * Get current cart
   */
  getCart(): Cart

  /**
   * Add item to cart
   */
  addItem(productId: string, quantity: number, variantId?: string): void

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): void

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): void

  /**
   * Clear entire cart
   */
  clearCart(): void

  /**
   * Get cart item count
   */
  getItemCount(): number
}

/**
 * Checkout Service
 * Handles order creation and payment processing
 */
export interface ICheckoutService {
  /**
   * Create order from cart
   */
  createOrder(cart: Cart, customer: Customer): Promise<Order>

  /**
   * Process payment for order
   */
  processPayment(orderId: string, paymentInfo: PaymentInfo): Promise<PaymentResult>

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Promise<Order | null>
}
