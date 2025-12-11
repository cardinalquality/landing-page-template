import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  // TODO: Load locale-specific metadata from translations
  const titles = {
    en: 'EonLife | ReLuma Anti-Aging Serum with 387 Growth Factors',
    es: 'EonLife | Suero Anti-Edad ReLuma con 387 Factores de Crecimiento',
  }

  const descriptions = {
    en: 'Defy aging with ReLuma - the revolutionary bio-tech skin serum featuring 387 human growth factors. Exclusive distributor: EonLife Global.',
    es: 'Desafía el envejecimiento con ReLuma - el revolucionario suero biotecnológico con 387 factores de crecimiento humanos. Distribuidor exclusivo: EonLife Global.',
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Get messages for the locale
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
