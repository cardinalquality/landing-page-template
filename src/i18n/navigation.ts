/**
 * Locale-aware navigation utilities
 *
 * Provides type-safe navigation functions that handle locales
 */

import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { locales } from './config'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })
