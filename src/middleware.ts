/**
 * Middleware for locale detection and routing
 *
 * Automatically detects user's preferred language and redirects to appropriate locale
 */

import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix (even for default locale)
  localePrefix: 'always',
})

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /images, /fonts, /videos (static files)
  matcher: ['/((?!api|_next|_vercel|images|fonts|videos|.*\\..*).*)'],
}
