'use client'

import { usePathname } from 'next/navigation'
import { getTenantConfig, getDefaultTenant } from '@/tenants/config'
import type { TenantConfig } from '@/tenants/schema'

/**
 * useTenant Hook
 *
 * Extracts the tenant from the URL path and returns the tenant configuration.
 * Used throughout the app to access tenant-specific theming, features, and settings.
 *
 * @example
 * ```tsx
 * const tenant = useTenant()
 * console.log(tenant.name) // "Reluma" or "Eonlife"
 * ```
 */
export function useTenant(): TenantConfig {
  const pathname = usePathname()

  // Extract tenant slug from pathname (e.g., "/reluma/products" -> "reluma")
  const segments = pathname?.split('/').filter(Boolean) || []
  const tenantSlug = segments[0]

  // Get tenant config or fall back to default
  const tenant = tenantSlug ? getTenantConfig(tenantSlug) || getDefaultTenant() : getDefaultTenant()

  return tenant
}
