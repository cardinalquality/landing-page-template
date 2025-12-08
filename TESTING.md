# Testing Guide

This document explains how to run tests and ensure code quality before deploying to production.

## Table of Contents

- [Overview](#overview)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Pre-Deployment Testing](#pre-deployment-testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Writing Tests](#writing-tests)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses a comprehensive testing strategy with multiple layers:

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test how different parts work together (e.g., API routes)
3. **E2E Tests** - Test complete user flows from end-to-end

### Testing Stack

- **Vitest** - Fast unit test framework
- **Testing Library** - React component testing utilities
- **Playwright** - End-to-end testing framework
- **GitHub Actions** - CI/CD automation
- **Vercel** - Deployment with pre-deployment checks

## Test Types

### Unit Tests

Located in `src/` alongside the code they test (e.g., `cart.test.ts` next to `cart.ts`).

**What they test:**
- Individual functions
- Component rendering
- State management (Zustand stores)
- Utility functions

**Example:**
```typescript
// src/core/stores/cart.test.ts
describe('Cart Store', () => {
  it('should add item to cart', () => {
    const { addItem, items } = useCartStore.getState()
    addItem(mockProduct, 1)
    expect(items).toHaveLength(1)
  })
})
```

### Integration Tests

Located in `src/app/api/**/*.test.ts` for API routes.

**What they test:**
- API endpoints
- Database operations
- External service integrations (Shopify, Stripe)

**Example:**
```typescript
// src/app/api/cart/route.test.ts
describe('POST /api/cart', () => {
  it('should create cart with item', async () => {
    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### E2E Tests

Located in `tests/e2e/`.

**What they test:**
- Complete user workflows
- Browser interactions
- Full checkout flow
- Cross-browser compatibility

**Example:**
```typescript
// tests/e2e/checkout.spec.ts
test('should add product to cart and checkout', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="add-to-cart-button"]')
  await page.click('[data-testid="checkout-button"]')
  await expect(page).toHaveURL(/shopify\.com/)
})
```

## Running Tests

### Quick Start

```bash
# Run all unit tests
npm test

# Run tests in watch mode (for development)
npm test

# Run tests once (for CI)
npm test -- --run

# Run with coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Development Workflow

**While coding:**
```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Run tests in watch mode
npm test
```

This will automatically re-run tests when you save files.

### Before Committing

```bash
# Run linter
npm run lint

# Run all unit tests
npm test -- --run

# Check TypeScript types
npx tsc --noEmit

# Run E2E tests (optional, but recommended)
npm run test:e2e
```

## Pre-Deployment Testing

### Vercel Deployment

Vercel is configured to run tests **before** every deployment. If tests fail, the deployment is cancelled.

**Configuration:** `vercel.json`
```json
{
  "buildCommand": "npm run test -- --run && npm run build"
}
```

### What Gets Tested Before Deploy

1. ✅ All unit tests pass
2. ✅ All integration tests pass
3. ✅ TypeScript type checking passes
4. ✅ Linting passes
5. ✅ Build succeeds

### Manual Pre-Deploy Check

Run this before pushing to main:

```bash
# Full pre-deploy check
npm run lint && npm test -- --run && npm run build
```

If everything passes, you're good to deploy!

## CI/CD Pipeline

### GitHub Actions

The project uses GitHub Actions to automatically test every push and pull request.

**Workflow:** `.github/workflows/test.yml`

**Jobs:**
1. **unit-tests** - Runs all unit and integration tests
2. **e2e-tests** - Runs Playwright E2E tests
3. **type-check** - Validates TypeScript types
4. **build-check** - Ensures the app builds successfully

**View test results:**
- Go to GitHub → Actions tab
- Click on your commit or PR
- View test results and logs

### Setting Up Secrets

For CI/CD to work, you need to add these secrets to GitHub:

1. Go to GitHub → Settings → Secrets → Actions
2. Add these secrets:
   - `SHOPIFY_EONLIFE_STORE_DOMAIN`
   - `SHOPIFY_EONLIFE_STOREFRONT_ACCESS_TOKEN`

### Vercel Integration

Vercel automatically:
1. Pulls your GitHub changes
2. Runs the build command (which includes tests)
3. If tests pass → deploys to production
4. If tests fail → cancels deployment and notifies you

## Writing Tests

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('MyComponent', () => {
  beforeEach(() => {
    // Reset state before each test
  })

  it('should do something', () => {
    // Arrange
    const input = 'test'

    // Act
    const result = myFunction(input)

    // Assert
    expect(result).toBe('expected')
  })
})
```

### Component Test Template

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/core/lib/test-utils'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should complete user flow', async ({ page }) => {
    await page.goto('/')
    await page.click('button')
    await expect(page).toHaveURL('/success')
  })
})
```

## Test Coverage

The project aims for **80% code coverage** minimum.

**Check coverage:**
```bash
npm run test:coverage
```

**View detailed report:**
```bash
npm run test:coverage
open coverage/index.html
```

**Coverage thresholds** (configured in `vitest.config.ts`):
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Critical Tests

### Cart & Checkout Tests

These tests prevent the "no checkout URL" bug from happening again:

**Unit tests:**
- `src/core/stores/cart.test.ts` - Cart store operations
- Tests variant ID handling, totals calculation, etc.

**Integration tests:**
- `src/app/api/cart/route.test.ts` - Cart API endpoints
- Tests Shopify integration, cart creation, etc.

**E2E tests:**
- `tests/e2e/checkout.spec.ts` - Full checkout flow
- Tests adding items, updating quantities, completing checkout

**Key scenarios tested:**
- ✅ Adding items with variant IDs
- ✅ Creating Shopify cart
- ✅ Adding multiple items to same cart
- ✅ Receiving checkout URL
- ✅ Handling errors gracefully

## Troubleshooting

### Tests failing locally

**Issue:** Tests pass on your machine but fail in CI

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear test cache
npx vitest --clearCache

# Run tests fresh
npm test -- --run
```

### E2E tests timing out

**Issue:** Playwright tests timeout waiting for elements

**Solution:**
```bash
# Increase timeout in playwright.config.ts
timeout: 30000 // 30 seconds

# Or use waitForSelector with timeout
await page.waitForSelector('[data-testid="element"]', {
  timeout: 10000
})
```

### Shopify API errors in tests

**Issue:** Tests fail because Shopify credentials are missing

**Solution:**
```bash
# Add to .env.local
SHOPIFY_EONLIFE_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_EONLIFE_STOREFRONT_ACCESS_TOKEN="your-token"
```

### Deployment fails on Vercel

**Issue:** Vercel deployment fails because tests fail

**Steps to debug:**
1. Check Vercel deployment logs
2. Look for test failures
3. Run same command locally:
   ```bash
   npm run test -- --run && npm run build
   ```
4. Fix failing tests
5. Push changes
6. Vercel will automatically retry

### Mock data issues

**Issue:** Tests fail because they expect specific mock data

**Solution:**
```typescript
// Use consistent mock data
const mockProduct = {
  id: 'gid://shopify/Product/123',
  name: 'Test Product',
  // ... rest of product
}

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
```

## Best Practices

### DO ✅

- Write tests before fixing bugs (TDD)
- Test edge cases and error handling
- Use descriptive test names
- Keep tests fast and focused
- Mock external dependencies (Shopify, Stripe)
- Run tests before committing

### DON'T ❌

- Skip writing tests for bug fixes
- Test implementation details
- Create tests that depend on each other
- Commit failing tests
- Mock too much (integration tests need real integrations)
- Ignore test failures

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run unit tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |
| `npm run lint` | Run linter |
| `npx tsc --noEmit` | Check TypeScript types |

## Support

If tests are failing and you're not sure why:

1. Check the error message carefully
2. Look at the test file to understand what's being tested
3. Run the test in isolation: `npm test -- cart.test.ts`
4. Add console.logs to debug
5. Check GitHub Actions logs for CI failures

## Summary

**Before every commit:**
```bash
npm run lint && npm test -- --run
```

**Before every deployment to production:**
- Tests automatically run on Vercel
- Deployment cancelled if tests fail
- Check GitHub Actions for detailed results

This ensures that bugs like "no checkout URL received" never make it to production again! 🎉
