/**
 * Mock Data Provider
 *
 * Returns hardcoded data from tenant configuration.
 * This allows us to build the complete UI without API dependencies.
 * Later replaced with ShopifyProvider or CustomProvider.
 */

import type { IProductService } from '../services/interfaces'
import type { Product } from '../services/types'
import { getTenantConfig } from '@/tenants/config'

export class MockProductService implements IProductService {
  private products: Product[]

  constructor() {
    // Load products from Eonlife tenant config
    const tenant = getTenantConfig('eonlife')!

    // Convert tenant products to full Product type
    this.products = tenant.content.products.map((p) => ({
      ...p,
      description: this.getProductDescription(p.id),
      images: p.image ? [p.image] : [],
      inStock: p.inStock ?? true,
    }))
  }

  async getProducts(): Promise<Product[]> {
    // Simulate API delay
    await this.delay(100)
    return this.products
  }

  async getProduct(id: string): Promise<Product | null> {
    await this.delay(100)
    return this.products.find((p) => p.id === id) || null
  }

  async searchProducts(query: string): Promise<Product[]> {
    await this.delay(150)
    const lowerQuery = query.toLowerCase()
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    )
  }

  async getProductsByCategory(_category: string): Promise<Product[]> {
    await this.delay(100)
    // For now, return all products (can be extended with categories)
    return this.products
  }

  /**
   * Helper: Simulate API delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Helper: Get product descriptions
   * In real app, this would come from CMS or Shopify
   */
  private getProductDescription(productId: string): string {
    const descriptions: Record<string, string> = {
      'eonlife-reluma-serum':
        'Our flagship ReLuma Renewal Serum harnesses 387 human growth factors to reduce wrinkles, tighten skin, and restore your natural luminosity. Clinically proven results in just 4 weeks.',
      'eonlife-reluma-moisturizer':
        'The ReLuma Daily Moisturizer provides deep hydration while supporting skin regeneration. Lightweight formula absorbs quickly, perfect for daily use under makeup or alone.',
      'eonlife-reluma-night':
        'ReLuma Night Repair works while you sleep to repair and rejuvenate skin at the cellular level. Wake up to visibly smoother, more radiant skin.',
    }

    return descriptions[productId] || 'Premium skincare product powered by science.'
  }
}
