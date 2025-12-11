/**
 * Locale-aware navigation utilities
 *
 * Provides type-safe navigation functions that handle locales
 */

import { createNavigation } from 'next-intl/navigation'
import { locales, defaultLocale } from './config'

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  pathnames: {},
})
