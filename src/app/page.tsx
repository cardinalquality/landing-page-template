import { redirect } from 'next/navigation'
import { getDefaultTenant } from '@/tenants/config'

/**
 * Root page - redirects to default tenant
 *
 * Users landing on "/" will be redirected to the default tenant's homepage
 * (e.g., "/eonlife" or "/reluma" depending on NEXT_PUBLIC_DEFAULT_TENANT env var)
 */
export default function RootPage() {
  const defaultTenant = getDefaultTenant()
  redirect(`/${defaultTenant.slug}`)
}
