/**
 * Environment Validation Script
 *
 * Validates that all required environment variables are properly configured
 * for the current environment.
 *
 * Usage:
 *   npm run validate:env
 *   npx tsx scripts/validate-env.ts
 */

import { env, validateEnv, getShopifyEnvironment } from '../src/core/lib/env'
import { getTenantConfig } from '../src/tenants/config'

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔍 Environment Configuration Validation')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

// Run core validation
validateEnv()

// Validate each tenant configuration
console.log('📋 Tenant Configuration Check:\n')

const tenants = env.allowedTenants

for (const slug of tenants) {
  console.log(`\n🏢 Tenant: ${slug}`)
  console.log('─'.repeat(50))

  const config = getTenantConfig(slug)

  if (!config) {
    console.log(`  ❌ Tenant config not found in TENANTS registry`)
    continue
  }

  // Check Shopify configuration
  const shopifyEnv = getShopifyEnvironment(slug)

  if (shopifyEnv.isConfigured) {
    console.log(`  ✅ Shopify: Configured`)
    console.log(`     Store: ${shopifyEnv.storeDomain}`)

    if (config.shopify) {
      console.log(`     API Version: ${config.shopify.apiVersion}`)
    }
  } else {
    console.log(`  ⚠️  Shopify: Not configured`)
    console.log(`     Missing environment variables:`)
    console.log(`     - SHOPIFY_${slug.toUpperCase()}_STORE_DOMAIN`)
    console.log(`     - SHOPIFY_${slug.toUpperCase()}_STOREFRONT_ACCESS_TOKEN`)
  }

  // Check Stripe configuration
  if (config.stripeAccountId) {
    console.log(`  ✅ Stripe: Configured`)
  } else {
    console.log(`  ⚠️  Stripe: Not configured (optional)`)
  }

  // Check theme
  if (config.theme) {
    console.log(`  ✅ Theme: Configured`)
    console.log(`     Primary Color: ${config.theme.primaryColor}`)
  }

  // Check features
  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature)

  if (enabledFeatures.length > 0) {
    console.log(`  ✅ Features: ${enabledFeatures.join(', ')}`)
  }
}

// Summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 Summary:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log(`Environment: ${env.nodeEnv}`)
console.log(`Data Provider: ${env.dataProvider}`)
console.log(`Default Tenant: ${env.defaultTenant}`)
console.log(`Allowed Tenants: ${env.allowedTenants.join(', ')}`)
console.log(`App URL: ${env.appUrl}`)
console.log(`Chatbot Enabled: ${env.enableChatbot}`)
console.log(`Analytics Enabled: ${env.enableAnalytics}`)

console.log('\n✨ Validation Complete!\n')

// Exit with appropriate code
const allConfigured = tenants.every(slug => {
  const shopifyEnv = getShopifyEnvironment(slug)
  return shopifyEnv.isConfigured || env.dataProvider === 'mock'
})

if (!allConfigured && env.dataProvider === 'shopify') {
  console.warn('⚠️  Warning: Some tenants are missing Shopify configuration.')
  console.warn('   Set missing environment variables or use mock data provider.\n')
  process.exit(1)
}

process.exit(0)
