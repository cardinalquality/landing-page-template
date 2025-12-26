/**
 * Environment Configuration with Validation
 *
 * Centralizes all environment variable access and provides
 * type-safe getters with runtime validation.
 *
 * Usage:
 *   import { env } from '@/core/lib/env'
 *   console.log(env.appUrl) // Type-safe access
 *   validateEnv() // Call on app startup
 */

type Environment = 'development' | 'production' | 'test'
type DataProvider = 'mock' | 'shopify' | 'custom'

interface EnvConfig {
  // App Environment
  nodeEnv: Environment
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean

  // App URLs
  appUrl: string
  apiUrl: string

  // Data Provider
  dataProvider: DataProvider

  // Tenant Configuration
  defaultTenant: string
  allowedTenants: string[]

  // Feature Flags
  enableChatbot: boolean
  enableAnalytics: boolean

  // Database (Optional)
  databaseUrl?: string
  directUrl?: string

  // Supabase (Optional)
  supabaseUrl?: string
  supabaseAnonKey?: string
}

/**
 * Gets a required environment variable
 * Throws if not found (unless fallback provided)
 */
function getRequiredEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Please add it to your .env file or environment configuration.`
    )
  }
  return value
}

/**
 * Gets an optional environment variable
 */
function getOptionalEnv(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback
}

/**
 * Gets a boolean environment variable
 */
function getBooleanEnv(key: string, fallback: boolean = false): boolean {
  const value = process.env[key]
  if (!value) return fallback
  return value === 'true' || value === '1'
}

/**
 * Centralized environment configuration
 * All environment variables should be accessed through this object
 */
export const env: EnvConfig = {
  // App Environment
  nodeEnv: (process.env.NODE_ENV || 'development') as Environment,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // App URLs
  appUrl: getRequiredEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  apiUrl: getOptionalEnv('NEXT_PUBLIC_API_URL') || getRequiredEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000') + '/api',

  // Data Provider
  dataProvider: (getOptionalEnv('NEXT_PUBLIC_DATA_PROVIDER', 'shopify') as DataProvider),

  // Tenant Configuration
  defaultTenant: getRequiredEnv('NEXT_PUBLIC_DEFAULT_TENANT', 'eonlife'),
  allowedTenants: (getOptionalEnv('NEXT_PUBLIC_ALLOWED_TENANTS', 'eonlife,reluma') || '').split(',').map(t => t.trim()).filter(Boolean),

  // Feature Flags
  enableChatbot: getBooleanEnv('NEXT_PUBLIC_ENABLE_CHATBOT', true),
  enableAnalytics: getBooleanEnv('NEXT_PUBLIC_ENABLE_ANALYTICS', false),

  // Database (Optional)
  databaseUrl: getOptionalEnv('DATABASE_URL'),
  directUrl: getOptionalEnv('DIRECT_URL'),

  // Supabase (Optional)
  supabaseUrl: getOptionalEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getOptionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
}

/**
 * Validates environment configuration
 * Call this on application startup to catch configuration errors early
 *
 * @example
 * // In your root layout or _app.tsx
 * if (env.isDevelopment) {
 *   validateEnv()
 * }
 */
export function validateEnv(): void {
  const issues: string[] = []

  // Log current environment
  if (env.isDevelopment) {
    console.log('\n🔧 Environment Configuration:')
    console.log(`   Mode: ${env.nodeEnv}`)
    console.log(`   App URL: ${env.appUrl}`)
    console.log(`   Data Provider: ${env.dataProvider}`)
    console.log(`   Default Tenant: ${env.defaultTenant}`)
    console.log(`   Allowed Tenants: ${env.allowedTenants.join(', ')}`)
  }

  // Validate Shopify configuration if using Shopify provider
  if (env.dataProvider === 'shopify') {
    const defaultTenantUpper = env.defaultTenant.toUpperCase()
    const domain = process.env[`SHOPIFY_${defaultTenantUpper}_STORE_DOMAIN`]
    const token = process.env[`SHOPIFY_${defaultTenantUpper}_STOREFRONT_ACCESS_TOKEN`]

    if (!domain) {
      issues.push(`Missing SHOPIFY_${defaultTenantUpper}_STORE_DOMAIN`)
    } else if (env.isDevelopment) {
      console.log(`   Shopify Store: ${domain}`)
    }

    if (!token) {
      issues.push(`Missing SHOPIFY_${defaultTenantUpper}_STOREFRONT_ACCESS_TOKEN`)
    }

    // Validate all allowed tenants have Shopify config
    for (const tenant of env.allowedTenants) {
      const tenantUpper = tenant.toUpperCase()
      const tenantDomain = process.env[`SHOPIFY_${tenantUpper}_STORE_DOMAIN`]
      const tenantToken = process.env[`SHOPIFY_${tenantUpper}_STOREFRONT_ACCESS_TOKEN`]

      if (!tenantDomain || !tenantToken) {
        if (env.isDevelopment) {
          console.warn(`   ⚠️  Incomplete Shopify config for tenant "${tenant}"`)
        }
      }
    }
  }

  // Validate database if configured
  if (env.databaseUrl && env.isDevelopment) {
    console.log('   Database: Configured ✓')
  }

  // Report issues
  if (issues.length > 0) {
    console.error('\n❌ Environment Validation Failed:')
    issues.forEach(issue => console.error(`   - ${issue}`))
    console.error('\nPlease check your .env files and Vercel configuration.\n')

    if (env.isProduction) {
      throw new Error('Environment validation failed. Check logs above.')
    } else {
      console.warn('⚠️  Falling back to mock data provider\n')
    }
  } else if (env.isDevelopment) {
    console.log('   ✅ Environment validation passed\n')
  }
}

/**
 * Gets the Shopify environment for logging/debugging
 * Useful to see which Shopify store (dev/prod) is being used
 */
export function getShopifyEnvironment(tenantSlug: string): {
  storeDomain: string | undefined
  isConfigured: boolean
} {
  const tenantUpper = tenantSlug.toUpperCase()
  const storeDomain = process.env[`SHOPIFY_${tenantUpper}_STORE_DOMAIN`]
  const accessToken = process.env[`SHOPIFY_${tenantUpper}_STOREFRONT_ACCESS_TOKEN`]

  return {
    storeDomain,
    isConfigured: !!(storeDomain && accessToken),
  }
}
