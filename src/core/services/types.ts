/**
 * Core Service Types
 *
 * These interfaces define the contract for all data providers
 * (Mock, Shopify, Custom API). UI components use these types
 * and don't care about the underlying implementation.
 */

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  compareAtPrice?: number
  images: string[]
  rating?: number
  reviewCount?: number
  badge?: 'sale' | 'new' | 'bestseller' | 'travel'
  inStock: boolean
  lowStock?: boolean
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  inStock: boolean
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  variantId?: string // Shopify variant ID for checkout
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface Customer {
  email: string
  firstName: string
  lastName: string
  phone?: string
  shippingAddress: Address
  billingAddress?: Address
}

export interface Address {
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
}

export interface PaymentInfo {
  method: 'credit_card' | 'paypal' | 'apple_pay'
  // Payment details would be tokenized in real implementation
  token?: string
}

export interface PaymentResult {
  success: boolean
  orderId?: string
  error?: string
}
