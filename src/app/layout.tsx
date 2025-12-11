import './globals.css'
import { CookieConsentWrapper } from '@/core/components/organisms/CookieConsent/CookieConsentWrapper'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="scroll-smooth">
      <body className="antialiased">
        {children}
        <CookieConsentWrapper />
      </body>
    </html>
  )
}
