/**
 * Routing configuration for next-intl
 *
 * Centralized routing config used by middleware and navigation
 */

import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})
