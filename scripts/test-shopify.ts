/**
 * Test Shopify Connection
 * 
 * Run with: npx tsx scripts/test-shopify.ts
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const STORE_DOMAIN = process.env.SHOPIFY_EONLIFE_STORE_DOMAIN || 'eonlife-dev.myshopify.com'
const ACCESS_TOKEN = process.env.SHOPIFY_EONLIFE_STOREFRONT_ACCESS_TOKEN || 'bdf633141b64a82134f2e5aa59cb0739'

async function testConnection() {
  console.log('🔄 Testing Shopify Storefront API connection...\n')
  console.log(`   Store: ${STORE_DOMAIN}`)
  console.log(`   Token: ${ACCESS_TOKEN.substring(0, 8)}...${ACCESS_TOKEN.substring(ACCESS_TOKEN.length - 4)}`)
  console.log('')

  const client = createStorefrontApiClient({
    storeDomain: STORE_DOMAIN,
    apiVersion: '2024-01',
    publicAccessToken: ACCESS_TOKEN,
  })

  // Test 1: Fetch shop info
  console.log('📍 Test 1: Fetching shop info...')
  try {
    const { data, errors } = await client.request(`
      query {
        shop {
          name
          primaryDomain {
            url
          }
        }
      }
    `)

    if (errors) {
      console.log('❌ Shop query failed:', errors)
    } else {
      console.log('✅ Shop info:', data?.shop)
    }
  } catch (error) {
    console.log('❌ Connection error:', (error as Error).message)
    return
  }

  // Test 2: Fetch products
  console.log('\n📦 Test 2: Fetching products...')
  try {
    const { data, errors } = await client.request(`
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              availableForSale
            }
          }
        }
      }
    `)

    if (errors) {
      console.log('❌ Products query failed:', errors)
    } else {
      const products = data?.products?.edges || []
      console.log(`✅ Found ${products.length} products:`)
      products.forEach((edge: any, i: number) => {
        const p = edge.node
        console.log(`   ${i + 1}. ${p.title} - $${p.priceRange.minVariantPrice.amount} ${p.priceRange.minVariantPrice.currencyCode}`)
      })

      if (products.length === 0) {
        console.log('\n⚠️  No products found. Make sure you have products in your Shopify store!')
        console.log('   Go to: Shopify Admin → Products → Add product')
      }
    }
  } catch (error) {
    console.log('❌ Products query error:', (error as Error).message)
  }

  console.log('\n✨ Shopify connection test complete!')
}

testConnection()

