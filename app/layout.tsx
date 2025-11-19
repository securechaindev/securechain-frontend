import type React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers'
import { Toaster } from '@/components/ui'
import { PackageProvider } from '@/context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secure Chain - Software Supply Chain Security',
  description: 'Open-source tools for dependency analysis and vulnerability assessment',
  icons: {
    icon: '/images/securechain-logo.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
