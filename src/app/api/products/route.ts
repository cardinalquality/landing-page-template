/**
 * Products API Route
 * 
 * Server-side endpoint that fetches products from the configured provider.
 * This is necessary because Shopify credentials are server-only env vars.
 */

import { NextResponse } from 'next/server'
import { createProductService } from '@/core/services'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tenant = searchParams.get('tenant') || undefined
    
    // Create product service for the specified tenant
    const service = createProductService(tenant)
    
    // Fetch products
    const products = await service.getProducts()
    
    return NextResponse.json({
      success: true,
      provider: process.env.NEXT_PUBLIC_DATA_PROVIDER || 'mock',
      products,
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        provider: process.env.NEXT_PUBLIC_DATA_PROVIDER || 'mock',
        products: []
      },
      { status: 500 }
    )
  }
}

