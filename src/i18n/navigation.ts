/**
 * Locale-aware navigation utilities
 *
 * Provides type-safe navigation functions that handle locales
 */

import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
