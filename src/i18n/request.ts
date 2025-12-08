/**
 * Server-side i18n setup
 *
 * Provides translations for server components
 */

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from './config'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  // Load all translation namespaces
  const [common, home, footer] = await Promise.all([
    import(`./locales/${locale}/common.json`),
    import(`./locales/${locale}/home.json`),
    import(`./locales/${locale}/footer.json`),
  ])

  return {
    messages: {
      ...common.default,
      ...home.default,
      ...footer.default,
    },
  }
})
