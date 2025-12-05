import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EonLife | ReLuma Anti-Aging Serum with 387 Growth Factors',
  description: 'Defy aging with ReLuma - the revolutionary bio-tech skin serum featuring 387 human growth factors. Exclusive distributor: EonLife Global.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
