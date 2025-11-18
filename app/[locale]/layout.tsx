import type React from 'react'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/providers'
import { Toaster } from '@/components/ui'
import { PackageProvider } from '@/context'

const locales = ['en', 'es'] as const
type Locale = (typeof locales)[number]

export async function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <PackageProvider>{children}</PackageProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
