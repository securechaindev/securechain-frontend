import type React from 'react'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/toaster'

const inter = Inter({ subsets: ['latin'] })

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

  // Verificar que el locale es válido
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
