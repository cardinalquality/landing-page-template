/**
 * Cart API Route
 *
 * Server-side endpoint for Shopify cart operations.
 * Creates cart, adds items, and returns checkout URL.
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ShopifyCartService } from '@/core/providers/ShopifyCartProvider'
import { getTenantConfig } from '@/tenants/config'

const CART_COOKIE_NAME = 'shopify_cart_id'

/**
 * Get cart service for tenant
 */
function getCartService(tenantSlug: string = 'eonlife') {
  const tenant = getTenantConfig(tenantSlug)

  if (!tenant?.shopify) {
    return null
  }

  return new ShopifyCartService(tenant.shopify)
}

/**
 * GET /api/cart - Get current cart
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get('tenant') || 'eonlife'

  const cartService = getCartService(tenant)
  if (!cartService) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 400 })
  }

  // Get cart ID from cookie
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value

  if (cartId) {
    cartService.setCartId(cartId)
  }

  const cart = await cartService.getCart()

  if (!cart) {
    return NextResponse.json({ cart: null, checkoutUrl: null })
  }

  return NextResponse.json({
    cart: ShopifyCartService.transformCart(cart),
    checkoutUrl: cart.checkoutUrl,
    cartId: cart.id,
  })
}

/**
 * POST /api/cart - Add item to cart or create new cart
 */
export async function POST(request: Request) {
  const body = await request.json()
  const { variantId, quantity = 1, tenant = 'eonlife' } = body

  if (!variantId) {
    return NextResponse.json({ error: 'variantId is required' }, { status: 400 })
  }

  const cartService = getCartService(tenant)
  if (!cartService) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 400 })
  }

  // Get existing cart ID from cookie
  const cookieStore = await cookies()
  const existingCartId = cookieStore.get(CART_COOKIE_NAME)?.value

  if (existingCartId) {
    cartService.setCartId(existingCartId)
  }

  // Add item to cart (creates new cart if needed)
  const cart = await cartService.addItem(variantId, quantity)

  if (!cart) {
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
  }

  // Create response with cart data
  const response = NextResponse.json({
    success: true,
    cart: ShopifyCartService.transformCart(cart),
    checkoutUrl: cart.checkoutUrl,
    cartId: cart.id,
  })

  // Set cart ID cookie (expires in 14 days)
  response.cookies.set(CART_COOKIE_NAME, cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14, // 14 days
  })

  return response
}

/**
 * PATCH /api/cart - Update item quantity
 */
export async function PATCH(request: Request) {
  const body = await request.json()
  const { lineId, quantity, tenant = 'eonlife' } = body

  if (!lineId) {
    return NextResponse.json({ error: 'lineId is required' }, { status: 400 })
  }

  const cartService = getCartService(tenant)
  if (!cartService) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 400 })
  }

  // Get cart ID from cookie
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value

  if (!cartId) {
    return NextResponse.json({ error: 'No cart found' }, { status: 404 })
  }

  cartService.setCartId(cartId)
  const cart = await cartService.updateQuantity(lineId, quantity)

  if (!cart) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    cart: ShopifyCartService.transformCart(cart),
    checkoutUrl: cart.checkoutUrl,
  })
}

/**
 * DELETE /api/cart - Remove item from cart
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const lineId = searchParams.get('lineId')
  const tenant = searchParams.get('tenant') || 'eonlife'

  if (!lineId) {
    return NextResponse.json({ error: 'lineId is required' }, { status: 400 })
  }

  const cartService = getCartService(tenant)
  if (!cartService) {
    return NextResponse.json({ error: 'Shopify not configured' }, { status: 400 })
  }

  // Get cart ID from cookie
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value

  if (!cartId) {
    return NextResponse.json({ error: 'No cart found' }, { status: 404 })
  }

  cartService.setCartId(cartId)
  const cart = await cartService.removeItem(lineId)

  if (!cart) {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    cart: ShopifyCartService.transformCart(cart),
    checkoutUrl: cart.checkoutUrl,
  })
}

