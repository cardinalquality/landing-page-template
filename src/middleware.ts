/**
 * Middleware for locale detection and routing
 *
 * Automatically detects user's preferred language and redirects to appropriate locale
 */

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /images, /fonts, /videos (static files)
  // - error pages
  matcher: ['/((?!api|_next|_vercel|_global-error|images|fonts|videos|.*\\..*).*)'],
}
