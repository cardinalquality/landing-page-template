/**
 * Cart Store Unit Tests
 *
 * Tests the Zustand cart store to ensure cart operations work correctly.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cart'
import type { Product } from '../services/types'

// Mock product data
const mockProduct: Product = {
  id: 'gid://shopify/Product/123',
  name: 'Test Product',
  description: 'Test description',
  price: 100,
  images: ['/test-image.jpg'],
  inStock: true,
  variants: [
    {
      id: 'gid://shopify/ProductVariant/456',
      name: 'Default',
      price: 100,
      inStock: true,
    },
  ],
}

const mockProduct2: Product = {
  id: 'gid://shopify/Product/789',
  name: 'Test Product 2',
  description: 'Test description 2',
  price: 50,
  images: ['/test-image-2.jpg'],
  inStock: true,
  variants: [
    {
      id: 'gid://shopify/ProductVariant/101112',
      name: 'Default',
      price: 50,
      inStock: true,
    },
  ],
}

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    useCartStore.getState().clearCart()
  })

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct, 1, mockProduct.variants![0].id)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].product.id).toBe(mockProduct.id)
      expect(state.items[0].quantity).toBe(1)
      expect(state.items[0].variantId).toBe(mockProduct.variants![0].id)
    })

    it('should use first variant if no variantId provided', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct, 1)

      const state = useCartStore.getState()
      expect(state.items[0].variantId).toBe(mockProduct.variants![0].id)
    })

    it('should increment quantity if same product added twice', () => {
      const { addItem } = useCartStore.getState()
      const variantId = mockProduct.variants![0].id

      addItem(mockProduct, 1, variantId)
      addItem(mockProduct, 2, variantId)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(3)
    })

    it('should add separate items for different variants', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct, 1, 'variant-1')
      addItem(mockProduct, 1, 'variant-2')

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(2)
      expect(state.items[0].variantId).toBe('variant-1')
      expect(state.items[1].variantId).toBe('variant-2')
    })

    it('should update totals when item added', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct, 2, mockProduct.variants![0].id)

      const state = useCartStore.getState()
      expect(state.itemCount).toBe(2)
      expect(state.subtotal).toBe(200)
      expect(state.tax).toBeGreaterThan(0)
      expect(state.total).toBeGreaterThan(200)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState()

      addItem(mockProduct, 1, mockProduct.variants![0].id)
      const itemId = useCartStore.getState().items[0].id

      updateQuantity(itemId, 3)

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(3)
    })

    it('should remove item if quantity set to 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState()

      addItem(mockProduct, 1, mockProduct.variants![0].id)
      const itemId = useCartStore.getState().items[0].id

      updateQuantity(itemId, 0)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })

    it('should update totals when quantity changed', () => {
      const { addItem, updateQuantity } = useCartStore.getState()

      addItem(mockProduct, 1, mockProduct.variants![0].id)
      const itemId = useCartStore.getState().items[0].id

      updateQuantity(itemId, 5)

      const state = useCartStore.getState()
      expect(state.subtotal).toBe(500)
      expect(state.itemCount).toBe(5)
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { addItem, removeItem } = useCartStore.getState()

      addItem(mockProduct, 1, mockProduct.variants![0].id)
      const itemId = useCartStore.getState().items[0].id

      removeItem(itemId)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })

    it('should reduce item count when item removed', () => {
      const { addItem, removeItem } = useCartStore.getState()

      addItem(mockProduct, 2, mockProduct.variants![0].id)

      // Verify initial state
      let state = useCartStore.getState()
      const initialCount = state.itemCount
      const itemId = state.items[0].id

      // Remove item
      removeItem(itemId)

      // Verify removal
      state = useCartStore.getState()
      expect(state.itemCount).toBe(0)
      expect(state.items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { addItem, clearCart } = useCartStore.getState()

      addItem(mockProduct, 1, mockProduct.variants![0].id)
      addItem(mockProduct2, 1, mockProduct2.variants![0].id)

      clearCart()

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
      expect(state.itemCount).toBe(0)
      expect(state.subtotal).toBe(0)
      expect(state.total).toBe(0)
    })
  })

  describe('cart visibility', () => {
    it('should toggle cart open/closed', () => {
      const { toggleCart } = useCartStore.getState()

      expect(useCartStore.getState().isOpen).toBe(false)

      toggleCart()
      expect(useCartStore.getState().isOpen).toBe(true)

      toggleCart()
      expect(useCartStore.getState().isOpen).toBe(false)
    })

    it('should open cart', () => {
      const { openCart } = useCartStore.getState()

      openCart()
      expect(useCartStore.getState().isOpen).toBe(true)
    })

    it('should close cart', () => {
      const { openCart, closeCart } = useCartStore.getState()

      openCart()
      closeCart()
      expect(useCartStore.getState().isOpen).toBe(false)
    })
  })

  describe('totals calculations', () => {
    it('should calculate tax at 8.5%', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct, 1, mockProduct.variants![0].id)

      const state = useCartStore.getState()
      expect(state.tax).toBe(8.5) // 8.5% of 100
    })

    it('should apply free shipping over $100', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct, 2, mockProduct.variants![0].id) // $200 subtotal

      const state = useCartStore.getState()
      expect(state.shipping).toBe(0)
    })

    it('should charge $10 shipping under $100', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct2, 1, mockProduct2.variants![0].id) // $50 subtotal

      const state = useCartStore.getState()
      expect(state.shipping).toBe(10)
    })

    it('should calculate correct total', () => {
      const { addItem } = useCartStore.getState()

      addItem(mockProduct2, 1, mockProduct2.variants![0].id) // $50

      const state = useCartStore.getState()
      const expectedTotal = 50 + (50 * 0.085) + 10 // subtotal + tax + shipping
      expect(state.total).toBeCloseTo(expectedTotal, 2)
    })
  })

  describe('variant handling', () => {
    it('should store variantId with cart item', () => {
      const { addItem } = useCartStore.getState()
      const variantId = 'gid://shopify/ProductVariant/custom-123'

      addItem(mockProduct, 1, variantId)

      const state = useCartStore.getState()
      expect(state.items[0].variantId).toBe(variantId)
    })

    it('should handle products without variants gracefully', () => {
      const { addItem } = useCartStore.getState()
      const productNoVariants = { ...mockProduct, variants: undefined }

      addItem(productNoVariants, 1)

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].variantId).toBeUndefined()
    })
  })
})
