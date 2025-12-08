/**
 * Cart API Route Integration Tests
 *
 * Tests the /api/cart endpoint to ensure it correctly interfaces with Shopify.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST, GET } from './route'
import { ShopifyCartService } from '@/core/providers/ShopifyCartProvider'

// Mock Shopify Cart Service
vi.mock('@/core/providers/ShopifyCartProvider', () => ({
  ShopifyCartService: vi.fn().mockImplementation(() => ({
    addItem: vi.fn(),
    getCart: vi.fn(),
    setCartId: vi.fn(),
    transformCart: vi.fn(),
  })),
}))

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}))

// Mock tenant config
vi.mock('@/tenants/config', () => ({
  getTenantConfig: vi.fn(() => ({
    id: 'eonlife-001',
    slug: 'eonlife',
    name: 'EonLife',
    shopify: {
      storeDomain: 'eonlife-dev.myshopify.com',
      storefrontAccessToken: 'test-token',
      apiVersion: '2025-01',
    },
  })),
}))

describe('Cart API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('POST /api/cart', () => {
    it('should require variantId in request body', async () => {
      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ quantity: 1 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('variantId is required')
    })

    it('should return error if Shopify not configured', async () => {
      const { getTenantConfig } = await import('@/tenants/config')
      vi.mocked(getTenantConfig).mockReturnValueOnce(undefined)

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          variantId: 'gid://shopify/ProductVariant/123',
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Shopify not configured')
    })

    it('should create cart with item and return checkout URL', async () => {
      const mockCart = {
        id: 'gid://shopify/Cart/test-cart-id',
        checkoutUrl: 'https://test.myshopify.com/cart/c/test',
        totalQuantity: 1,
        cost: {
          totalAmount: { amount: '100', currencyCode: 'USD' },
          subtotalAmount: { amount: '100', currencyCode: 'USD' },
        },
        lines: { edges: [] },
      }

      const mockAddItem = vi.fn().mockResolvedValue(mockCart)
      vi.mocked(ShopifyCartService).mockImplementation(
        () =>
          ({
            addItem: mockAddItem,
            setCartId: vi.fn(),
          }) as any
      )

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          variantId: 'gid://shopify/ProductVariant/123',
          quantity: 1,
          tenant: 'eonlife',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.checkoutUrl).toBe(mockCart.checkoutUrl)
      expect(data.cartId).toBe(mockCart.id)
      expect(mockAddItem).toHaveBeenCalledWith(
        'gid://shopify/ProductVariant/123',
        1
      )
    })

    it('should handle cart creation failure', async () => {
      const mockAddItem = vi.fn().mockResolvedValue(null)
      vi.mocked(ShopifyCartService).mockImplementation(
        () =>
          ({
            addItem: mockAddItem,
            setCartId: vi.fn(),
          }) as any
      )

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          variantId: 'gid://shopify/ProductVariant/123',
          quantity: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to add item to cart')
    })

    it('should use existing cart if cartId cookie present', async () => {
      const { cookies } = await import('next/headers')
      const existingCartId = 'gid://shopify/Cart/existing-cart'

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: existingCartId }),
        set: vi.fn(),
      } as any)

      const mockSetCartId = vi.fn()
      const mockAddItem = vi.fn().mockResolvedValue({
        id: existingCartId,
        checkoutUrl: 'https://test.myshopify.com/cart/c/test',
        totalQuantity: 2,
        cost: {
          totalAmount: { amount: '200', currencyCode: 'USD' },
          subtotalAmount: { amount: '200', currencyCode: 'USD' },
        },
        lines: { edges: [] },
      })

      vi.mocked(ShopifyCartService).mockImplementation(
        () =>
          ({
            addItem: mockAddItem,
            setCartId: mockSetCartId,
          }) as any
      )

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          variantId: 'gid://shopify/ProductVariant/456',
          quantity: 1,
        }),
      })

      await POST(request)

      expect(mockSetCartId).toHaveBeenCalledWith(existingCartId)
    })
  })

  describe('GET /api/cart', () => {
    it('should return null if no cart exists', async () => {
      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any)

      const mockGetCart = vi.fn().mockResolvedValue(null)
      vi.mocked(ShopifyCartService).mockImplementation(
        () =>
          ({
            getCart: mockGetCart,
            setCartId: vi.fn(),
          }) as any
      )

      const request = new Request('http://localhost:3000/api/cart?tenant=eonlife')
      const response = await GET(request)
      const data = await response.json()

      expect(data.cart).toBeNull()
      expect(data.checkoutUrl).toBeNull()
    })

    it('should return cart if cartId cookie present', async () => {
      const { cookies } = await import('next/headers')
      const cartId = 'gid://shopify/Cart/test'

      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: cartId }),
      } as any)

      const mockCart = {
        id: cartId,
        checkoutUrl: 'https://test.myshopify.com/cart/c/test',
        totalQuantity: 1,
        cost: {
          totalAmount: { amount: '100', currencyCode: 'USD' },
          subtotalAmount: { amount: '100', currencyCode: 'USD' },
        },
        lines: { edges: [] },
      }

      const mockGetCart = vi.fn().mockResolvedValue(mockCart)
      vi.mocked(ShopifyCartService).mockImplementation(
        () =>
          ({
            getCart: mockGetCart,
            setCartId: vi.fn(),
          }) as any
      )

      const request = new Request('http://localhost:3000/api/cart?tenant=eonlife')
      const response = await GET(request)
      const data = await response.json()

      expect(data.checkoutUrl).toBe(mockCart.checkoutUrl)
      expect(data.cartId).toBe(mockCart.id)
    })
  })
})
