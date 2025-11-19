import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load and display the homepage', async ({ page }) => {
    await page.goto('/')

    // Check for main heading
    await expect(page.getByRole('heading', { name: /universal e-commerce platform/i })).toBeVisible()
  })

  test('should display both CTA buttons', async ({ page }) => {
    await page.goto('/')

    // Check for primary and secondary CTAs
    const getStartedButton = page.getByRole('button', { name: /get started/i })
    const learnMoreButton = page.getByRole('button', { name: /learn more/i })

    await expect(getStartedButton).toBeVisible()
    await expect(learnMoreButton).toBeVisible()
  })

  test('should show testing infrastructure status', async ({ page }) => {
    await page.goto('/')

    // Verify infrastructure indicators
    await expect(page.getByText(/testing infrastructure/i)).toBeVisible()
    await expect(page.getByText(/tdd proven/i)).toBeVisible()
    await expect(page.getByText(/multi-tenant/i)).toBeVisible()
    await expect(page.getByText(/database/i)).toBeVisible()
  })

  test('buttons should be interactive', async ({ page }) => {
    await page.goto('/')

    const getStartedButton = page.getByRole('button', { name: /get started/i })

    // Button should respond to hover
    await getStartedButton.hover()
    await expect(getStartedButton).toBeVisible()

    // Button should be clickable (no action yet, just verifying it's not disabled)
    await expect(getStartedButton).toBeEnabled()
  })

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /universal e-commerce platform/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    await page.goto('/')

    // Check for proper HTML structure
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Buttons should be keyboard accessible
    const getStartedButton = page.getByRole('button', { name: /get started/i })
    await getStartedButton.focus()
    await expect(getStartedButton).toBeFocused()
  })
})
