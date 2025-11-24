import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/core/components/organisms'

export const metadata: Metadata = {
  title: 'Eonlife - ReLuma Skincare | 387 Human Growth Factors',
  description: 'Discover radiant, youthful skin with ReLuma. Powered by 387 Human Growth Factors for comprehensive skin rejuvenation.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  )
}
