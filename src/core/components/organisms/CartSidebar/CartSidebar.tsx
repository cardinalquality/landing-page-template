'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/core/stores/cart'
import { getTenantConfig } from '@/tenants/config'

export function CartSidebar() {
  const tenant = getTenantConfig('eonlife')!
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, tax, shipping, total, clearCart } =
    useCartStore()
  
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  /**
   * Handle Shopify Checkout
   * Creates a Shopify cart with all items and redirects to Shopify checkout
   */
  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      // Add each item to Shopify cart
      // We need the variant ID - for products with single variant, use the first one
      let checkoutUrl: string | null = null

      for (const item of items) {
        // Get the variant ID - if not stored, we need to fetch the product
        // For now, we'll use a workaround: the product ID from Shopify includes the variant
        const variantId = item.variantId || item.product.variants?.[0]?.id

        if (!variantId) {
          console.warn(`No variant ID for product ${item.product.name}, skipping...`)
          continue
        }

        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variantId,
            quantity: item.quantity,
            tenant: 'eonlife',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to add item to cart')
        }

        checkoutUrl = data.checkoutUrl
      }

      if (checkoutUrl) {
        // Clear local cart before redirecting
        clearCart()
        closeCart()
        // Redirect to Shopify checkout
        window.location.href = checkoutUrl
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setCheckoutError(error instanceof Error ? error.message : 'Checkout failed')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold" style={{ color: tenant.theme.primaryColor }}>
              Shopping Cart
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm" style={{ color: tenant.theme.primaryColor }}>
                        ${item.product.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded bg-white text-gray-700 font-bold hover:bg-gray-100 hover:border-gray-400 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded bg-white text-gray-700 font-bold hover:bg-gray-100 hover:border-gray-400 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Totals & Checkout */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8.5%)</span>
                <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span style={{ color: tenant.theme.primaryColor }}>${total.toFixed(2)}</span>
              </div>

              {/* Checkout Error */}
              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {checkoutError}
                </div>
              )}

              {/* Checkout Button */}
              <button
                className="w-full py-4 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: tenant.theme.accentColor }}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              {/* Test card info for Shopify Bogus Gateway */}
              <p className="text-xs text-gray-400 text-center">
                Test: Card # <strong>1</strong> • Any future date • Any CVV
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
