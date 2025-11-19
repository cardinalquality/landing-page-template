import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Universal E-Commerce Platform',
  description: 'Multi-tenant e-commerce platform built with Next.js 16',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
