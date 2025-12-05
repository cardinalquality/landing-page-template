/**
 * Shopify Storefront API Provider
 *
 * Implements IProductService using Shopify Storefront API.
 * This allows seamless switching between Mock, Shopify, and Custom providers.
 *
 * @see https://shopify.dev/docs/api/storefront
 */

import { createStorefrontApiClient, StorefrontApiClient } from '@shopify/storefront-api-client'
import type { IProductService } from '../services/interfaces'
import type { Product } from '../services/types'
import type { TenantShopifyConfig } from '@/tenants/schema'

/**
 * GraphQL Fragments for reusable product fields
 */
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    availableForSale
    totalInventory
    variants(first: 10) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          availableForSale
        }
      }
    }
    tags
  }
`

/**
 * GraphQL Queries
 */
const QUERIES = {
  products: `
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `,

  product: `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFields
      }
    }
  `,

  productById: `
    ${PRODUCT_FRAGMENT}
    query GetProductById($id: ID!) {
      product(id: $id) {
        ...ProductFields
      }
    }
  `,

  searchProducts: `
    ${PRODUCT_FRAGMENT}
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `,

  productsByTag: `
    ${PRODUCT_FRAGMENT}
    query ProductsByTag($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `,
}

/**
 * Transform Shopify product data to our internal Product type
 */
function transformProduct(shopifyProduct: ShopifyProduct): Product {
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount)
  const compareAtPrice = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
    : undefined

  // Build images array with sensible fallbacks and deduplication
  const featured = shopifyProduct.featuredImage?.url
  const productImages = shopifyProduct.images?.edges?.map((edge) => edge.node.url).filter(Boolean) || []
  const variantImages =
    shopifyProduct.variants?.edges
      ?.map((edge) => edge.node?.image?.url)
      .filter(Boolean) || []

  const images = Array.from(new Set([featured, ...productImages, ...variantImages].filter(Boolean)))

  // Determine badge based on tags or price comparison
  let badge: Product['badge'] = undefined
  if (shopifyProduct.tags?.includes('bestseller')) badge = 'bestseller'
  else if (shopifyProduct.tags?.includes('new')) badge = 'new'
  else if (compareAtPrice && compareAtPrice > price) badge = 'sale'

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    images,
    inStock: shopifyProduct.availableForSale,
    lowStock: shopifyProduct.totalInventory !== null && shopifyProduct.totalInventory < 10,
    badge,
    variants: shopifyProduct.variants.edges.map((edge) => ({
      id: edge.node.id,
      name: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      compareAtPrice: edge.node.compareAtPrice
        ? parseFloat(edge.node.compareAtPrice.amount)
        : undefined,
      inStock: edge.node.availableForSale,
    })),
  }
}

/**
 * Shopify Product Service
 *
 * Fetches products from Shopify Storefront API
 */
export class ShopifyProductService implements IProductService {
  private client: StorefrontApiClient

  constructor(config: TenantShopifyConfig) {
    this.client = createStorefrontApiClient({
      storeDomain: config.storeDomain,
      apiVersion: config.apiVersion || '2025-01',
      publicAccessToken: config.storefrontAccessToken,
    })
  }

  async getProducts(): Promise<Product[]> {
    try {
      const { data, errors } = await this.client.request(QUERIES.products, {
        variables: { first: 50 },
      })

      if (errors) {
        console.error('Shopify API errors:', errors)
        return []
      }

      const products = data?.products?.edges || []
      return products.map((edge: { node: ShopifyProduct }) => transformProduct(edge.node))
    } catch (error) {
      console.error('Failed to fetch products from Shopify:', error)
      return []
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      // Check if ID is a Shopify GID or a handle
      const isGid = id.startsWith('gid://')
      const query = isGid ? QUERIES.productById : QUERIES.product
      const variables = isGid ? { id } : { handle: id }

      const { data, errors } = await this.client.request(query, { variables })

      if (errors) {
        console.error('Shopify API errors:', errors)
        return null
      }

      const product = isGid ? data?.product : data?.productByHandle
      return product ? transformProduct(product) : null
    } catch (error) {
      console.error('Failed to fetch product from Shopify:', error)
      return null
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, errors } = await this.client.request(QUERIES.searchProducts, {
        variables: { query, first: 20 },
      })

      if (errors) {
        console.error('Shopify API errors:', errors)
        return []
      }

      const products = data?.products?.edges || []
      return products.map((edge: { node: ShopifyProduct }) => transformProduct(edge.node))
    } catch (error) {
      console.error('Failed to search products from Shopify:', error)
      return []
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      // Shopify uses tags for categories, search by tag
      const { data, errors } = await this.client.request(QUERIES.productsByTag, {
        variables: { query: `tag:${category}`, first: 50 },
      })

      if (errors) {
        console.error('Shopify API errors:', errors)
        return []
      }

      const products = data?.products?.edges || []
      return products.map((edge: { node: ShopifyProduct }) => transformProduct(edge.node))
    } catch (error) {
      console.error('Failed to fetch products by category from Shopify:', error)
      return []
    }
  }
}

/**
 * Shopify API Response Types
 */
interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange?: {
    minVariantPrice?: {
      amount: string
      currencyCode: string
    }
  }
  featuredImage?: {
    url: string
    altText?: string
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText?: string
      }
    }>
  }
  availableForSale: boolean
  totalInventory: number | null
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        image?: {
          url: string
        }
        price: {
          amount: string
          currencyCode: string
        }
        compareAtPrice?: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
      }
    }>
  }
  tags?: string[]
}

