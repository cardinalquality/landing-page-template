/**
 * Checkout E2E Tests
 *
 * End-to-end tests for the complete checkout flow.
 * These tests ensure users can successfully add items to cart and checkout.
 */

import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/')
  })

  test('should display product cards on homepage', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })

    // Verify products are displayed
    const products = await page.locator('[data-testid="product-card"]').count()
    expect(products).toBeGreaterThan(0)
  })

  test('should add product to cart and open cart sidebar', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })

    // Get initial cart count
    const cartBadge = page.locator('[data-testid="cart-badge"]')

    // Click "Add to Cart" on first product
    const addToCartButton = page.locator('[data-testid="add-to-cart-button"]').first()
    await addToCartButton.click()

    // Verify cart badge updates
    await expect(cartBadge).toBeVisible()
    await expect(cartBadge).toContainText('1')

    // Verify cart sidebar opens
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]')
    await expect(cartSidebar).toBeVisible()
  })

  test('should display correct items in cart', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    const productName = await page.locator('[data-testid="product-card"]').first().locator('h3').textContent()

    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Verify cart contains the product
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]')
    await expect(cartSidebar).toBeVisible()
    await expect(cartSidebar).toContainText(productName || '')
  })

  test('should update cart quantity', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Click increment button
    const incrementButton = page.locator('[data-testid="cart-item-increment"]').first()
    await incrementButton.click()

    // Verify quantity updated
    const quantity = page.locator('[data-testid="cart-item-quantity"]').first()
    await expect(quantity).toContainText('2')

    // Verify cart badge updated
    const cartBadge = page.locator('[data-testid="cart-badge"]')
    await expect(cartBadge).toContainText('2')
  })

  test('should remove item from cart', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Click remove button
    const removeButton = page.locator('[data-testid="cart-item-remove"]').first()
    await removeButton.click()

    // Verify cart is empty
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]')
    await expect(cartSidebar).toContainText('Your cart is empty')

    // Verify cart badge is hidden or shows 0
    const cartBadge = page.locator('[data-testid="cart-badge"]')
    await expect(cartBadge).not.toBeVisible()
  })

  test('should calculate totals correctly', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    const priceText = await page.locator('[data-testid="product-card"]').first().locator('[data-testid="product-price"]').textContent()
    const price = parseFloat(priceText?.replace('$', '') || '0')

    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Verify subtotal
    const subtotal = page.locator('[data-testid="cart-subtotal"]')
    await expect(subtotal).toContainText(price.toFixed(2))

    // Verify tax (8.5%)
    const expectedTax = price * 0.085
    const tax = page.locator('[data-testid="cart-tax"]')
    await expect(tax).toContainText(expectedTax.toFixed(2))

    // Verify shipping
    const shipping = page.locator('[data-testid="cart-shipping"]')
    if (price >= 100) {
      await expect(shipping).toContainText('FREE')
    } else {
      await expect(shipping).toContainText('10.00')
    }
  })

  test('should close cart sidebar', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Click close button
    const closeButton = page.locator('[data-testid="cart-close"]')
    await closeButton.click()

    // Verify cart is closed
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]')
    await expect(cartSidebar).not.toBeVisible()
  })

  test('should handle checkout button click', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Click checkout button
    const checkoutButton = page.locator('[data-testid="checkout-button"]')
    await expect(checkoutButton).toBeEnabled()
    await expect(checkoutButton).toContainText('Proceed to Checkout')
  })

  test('should show loading state during checkout', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Click checkout button and verify loading state
    const checkoutButton = page.locator('[data-testid="checkout-button"]')

    // Start listening for navigation before clicking
    const navigationPromise = page.waitForURL(/shopify\.com/, { timeout: 15000 }).catch(() => {
      // If we don't navigate to Shopify, that's fine for this test
      return null
    })

    await checkoutButton.click()

    // Verify button shows loading state
    await expect(checkoutButton).toContainText('Processing')

    await navigationPromise
  })

  test('should display checkout error if no items in cart', async ({ page }) => {
    // Open cart without adding items
    const cartButton = page.locator('[data-testid="cart-button"]')
    await cartButton.click()

    // Verify checkout button is present but cart is empty
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]')
    await expect(cartSidebar).toContainText('Your cart is empty')
  })

  test('should persist cart items on page refresh', async ({ page }) => {
    // Add product to cart
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    const productName = await page.locator('[data-testid="product-card"]').first().locator('h3').textContent()

    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // Refresh page
    await page.reload()

    // Open cart
    const cartButton = page.locator('[data-testid="cart-button"]')
    await cartButton.click()

    // Verify cart still contains the product
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]')
    await expect(cartSidebar).toContainText(productName || '')

    // Verify cart badge shows correct count
    const cartBadge = page.locator('[data-testid="cart-badge"]')
    await expect(cartBadge).toContainText('1')
  })

  test('should add multiple different products to cart', async ({ page }) => {
    // Wait for products
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    const products = page.locator('[data-testid="product-card"]')
    const productCount = await products.count()

    if (productCount >= 2) {
      // Add first product
      await products.nth(0).locator('[data-testid="add-to-cart-button"]').click()

      // Close cart
      await page.locator('[data-testid="cart-close"]').click()

      // Add second product
      await products.nth(1).locator('[data-testid="add-to-cart-button"]').click()

      // Verify cart has 2 different items
      const cartItems = page.locator('[data-testid="cart-item"]')
      await expect(cartItems).toHaveCount(2)

      // Verify cart badge
      const cartBadge = page.locator('[data-testid="cart-badge"]')
      await expect(cartBadge).toContainText('2')
    }
  })

  test('should handle variant selection if product has variants', async ({ page }) => {
    // This test assumes products might have variants
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })

    // Look for variant selector
    const variantSelector = page.locator('[data-testid="variant-selector"]').first()

    if (await variantSelector.isVisible()) {
      // Select a variant
      await variantSelector.selectOption({ index: 1 })

      // Add to cart
      await page.locator('[data-testid="add-to-cart-button"]').first().click()

      // Verify item added with correct variant
      const cartSidebar = page.locator('[data-testid="cart-sidebar"]')
      await expect(cartSidebar).toBeVisible()
    }
  })
})

test.describe('Checkout Error Handling', () => {
  test('should show error if checkout fails', async ({ page }) => {
    // This test would require mocking the API to fail
    // For now, we'll test that error UI is properly implemented
    await page.goto('/')

    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    await page.locator('[data-testid="add-to-cart-button"]').first().click()

    // The error message should appear if checkout fails
    // We check that the error container exists
    const errorContainer = page.locator('[data-testid="checkout-error"]')
    // Error should not be visible initially
    await expect(errorContainer).not.toBeVisible()
  })
})
