/**
 * Shopping Cart Store (Zustand)
 *
 * Client-side state management for shopping cart.
 * Persists to localStorage so cart survives page refreshes.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '../services/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (product: Product, quantity?: number, variantId?: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed values
  itemCount: number
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, _get) => ({
      items: [],
      isOpen: false,
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,

      addItem: (product, quantity = 1, variantId?: string) => {
        set((state) => {
          // Use the first variant ID if not provided
          const effectiveVariantId = variantId || product.variants?.[0]?.id
          
          // Check if product already in cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.variantId === effectiveVariantId
          )

          let newItems: CartItem[]

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            newItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            // Add new item
            newItems = [
              ...state.items,
              {
                id: `cart-item-${Date.now()}`,
                product,
                quantity,
                variantId: effectiveVariantId,
              },
            ]
          }

          return {
            items: newItems,
            ...calculateTotals(newItems),
          }
        })
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0
            const newItems = state.items.filter((item) => item.id !== itemId)
            return {
              items: newItems,
              ...calculateTotals(newItems),
            }
          }

          const newItems = state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )

          return {
            items: newItems,
            ...calculateTotals(newItems),
          }
        })
      },

      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId)
          return {
            items: newItems,
            ...calculateTotals(newItems),
          }
        })
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
        })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },
    }),
    {
      name: 'eonlife-cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items
      onRehydrateStorage: () => (state) => {
        // Recalculate totals after rehydration
        if (state && state.items.length > 0) {
          const totals = calculateTotals(state.items)
          state.itemCount = totals.itemCount
          state.subtotal = totals.subtotal
          state.tax = totals.tax
          state.shipping = totals.shipping
          state.total = totals.total
        }
      },
    }
  )
)

/**
 * Helper: Calculate cart totals
 */
function calculateTotals(items: CartItem[]) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Tax: 8.5% (would be dynamic based on location in real app)
  const tax = subtotal * 0.085

  // Shipping: Free over $100, otherwise $10
  const shipping = subtotal >= 100 ? 0 : 10

  const total = subtotal + tax + shipping

  return {
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
