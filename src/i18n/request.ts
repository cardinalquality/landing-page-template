/**
 * Server-side i18n setup
 *
 * Provides translations for server components
 */

import { getRequestConfig } from 'next-intl/server'
import { locales } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale

  if (!locale || !locales.includes(locale as any)) {
    locale = 'en' // fallback to English
  }

  // Load all translation namespaces
  const [common, home, footer] = await Promise.all([
    import(`./locales/${locale}/common.json`),
    import(`./locales/${locale}/home.json`),
    import(`./locales/${locale}/footer.json`),
  ])

  return {
    locale,
    messages: {
      ...common.default,
      ...home.default,
      ...footer.default,
    },
  }
})
