/**
 * Shopify Cart Provider
 *
 * Implements cart functionality using Shopify Storefront API.
 * Handles cart creation, updates, and checkout URL generation.
 *
 * @see https://shopify.dev/docs/api/storefront/2024-01/objects/Cart
 */

import { createStorefrontApiClient, StorefrontApiClient } from '@shopify/storefront-api-client'
import type { TenantShopifyConfig } from '@/tenants/schema'
import type { Cart, CartItem, Product } from '../services/types'

/**
 * GraphQL Mutations for Cart operations
 */
const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`

const MUTATIONS = {
  createCart: `
    ${CART_FRAGMENT}
    mutation CreateCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  addToCart: `
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  updateCart: `
    ${CART_FRAGMENT}
    mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  removeFromCart: `
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `,

  getCart: `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
  `,
}

/**
 * Shopify Cart Service
 *
 * Manages shopping cart via Shopify Storefront API
 */
export class ShopifyCartService {
  private client: StorefrontApiClient
  private cartId: string | null = null

  constructor(config: TenantShopifyConfig) {
    this.client = createStorefrontApiClient({
      storeDomain: config.storeDomain,
      apiVersion: config.apiVersion || '2025-01',
      publicAccessToken: config.storefrontAccessToken,
    })
  }

  /**
   * Get or create a cart
   */
  async getOrCreateCart(): Promise<ShopifyCart | null> {
    if (this.cartId) {
      const cart = await this.getCart()
      if (cart) return cart
    }

    // Create new cart
    return this.createCart()
  }

  /**
   * Create a new cart
   */
  async createCart(lines?: CartLineInput[]): Promise<ShopifyCart | null> {
    try {
      const { data, errors } = await this.client.request(MUTATIONS.createCart, {
        variables: { lines: lines || [] },
      })

      if (errors || data?.cartCreate?.userErrors?.length > 0) {
        console.error('Shopify cart errors:', errors || data?.cartCreate?.userErrors)
        return null
      }

      const cart = data?.cartCreate?.cart
      if (cart) {
        this.cartId = cart.id
      }
      return cart
    } catch (error) {
      console.error('Failed to create Shopify cart:', error)
      return null
    }
  }

  /**
   * Get existing cart by ID
   */
  async getCart(): Promise<ShopifyCart | null> {
    if (!this.cartId) return null

    try {
      const { data, errors } = await this.client.request(MUTATIONS.getCart, {
        variables: { cartId: this.cartId },
      })

      if (errors) {
        console.error('Shopify API errors:', errors)
        return null
      }

      return data?.cart || null
    } catch (error) {
      console.error('Failed to get Shopify cart:', error)
      return null
    }
  }

  /**
   * Add item to cart
   */
  async addItem(variantId: string, quantity: number = 1): Promise<ShopifyCart | null> {
    const cart = await this.getOrCreateCart()
    if (!cart) return null

    try {
      const { data, errors } = await this.client.request(MUTATIONS.addToCart, {
        variables: {
          cartId: this.cartId,
          lines: [{ merchandiseId: variantId, quantity }],
        },
      })

      if (errors || data?.cartLinesAdd?.userErrors?.length > 0) {
        console.error('Shopify cart errors:', errors || data?.cartLinesAdd?.userErrors)
        return null
      }

      return data?.cartLinesAdd?.cart
    } catch (error) {
      console.error('Failed to add item to Shopify cart:', error)
      return null
    }
  }

  /**
   * Update item quantity in cart
   */
  async updateQuantity(lineId: string, quantity: number): Promise<ShopifyCart | null> {
    if (!this.cartId) return null

    try {
      const { data, errors } = await this.client.request(MUTATIONS.updateCart, {
        variables: {
          cartId: this.cartId,
          lines: [{ id: lineId, quantity }],
        },
      })

      if (errors || data?.cartLinesUpdate?.userErrors?.length > 0) {
        console.error('Shopify cart errors:', errors || data?.cartLinesUpdate?.userErrors)
        return null
      }

      return data?.cartLinesUpdate?.cart
    } catch (error) {
      console.error('Failed to update Shopify cart:', error)
      return null
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(lineId: string): Promise<ShopifyCart | null> {
    if (!this.cartId) return null

    try {
      const { data, errors } = await this.client.request(MUTATIONS.removeFromCart, {
        variables: {
          cartId: this.cartId,
          lineIds: [lineId],
        },
      })

      if (errors || data?.cartLinesRemove?.userErrors?.length > 0) {
        console.error('Shopify cart errors:', errors || data?.cartLinesRemove?.userErrors)
        return null
      }

      return data?.cartLinesRemove?.cart
    } catch (error) {
      console.error('Failed to remove item from Shopify cart:', error)
      return null
    }
  }

  /**
   * Get Shopify checkout URL
   * Redirects user to Shopify's hosted checkout
   */
  getCheckoutUrl(): string | null {
    // This will be set after cart operations
    // The actual URL comes from the cart response
    return null
  }

  /**
   * Set cart ID (for restoring cart from storage)
   */
  setCartId(cartId: string): void {
    this.cartId = cartId
  }

  /**
   * Get current cart ID
   */
  getCartId(): string | null {
    return this.cartId
  }

  /**
   * Transform Shopify cart to our internal Cart type
   */
  static transformCart(shopifyCart: ShopifyCart): Cart {
    const items: CartItem[] = shopifyCart.lines.edges.map((edge) => ({
      id: edge.node.id,
      product: {
        id: edge.node.merchandise.product.id,
        name: edge.node.merchandise.product.title,
        price: parseFloat(edge.node.merchandise.price.amount),
        images: edge.node.merchandise.product.featuredImage
          ? [edge.node.merchandise.product.featuredImage.url]
          : [],
        inStock: true,
      },
      quantity: edge.node.quantity,
      variantId: edge.node.merchandise.id,
    }))

    return {
      items,
      subtotal: parseFloat(shopifyCart.cost.subtotalAmount.amount),
      tax: shopifyCart.cost.totalTaxAmount
        ? parseFloat(shopifyCart.cost.totalTaxAmount.amount)
        : 0,
      shipping: 0, // Calculated at checkout
      total: parseFloat(shopifyCart.cost.totalAmount.amount),
    }
  }
}

/**
 * Types for Shopify Cart API
 */
interface CartLineInput {
  merchandiseId: string
  quantity: number
}

interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: { amount: string; currencyCode: string }
    subtotalAmount: { amount: string; currencyCode: string }
    totalTaxAmount?: { amount: string; currencyCode: string }
  }
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          price: { amount: string; currencyCode: string }
          product: {
            id: string
            title: string
            handle: string
            featuredImage?: { url: string; altText?: string }
          }
        }
      }
    }>
  }
}

export type { ShopifyCart }

