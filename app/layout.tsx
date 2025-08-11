import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secure Chain - Software Supply Chain Security',
  description: 'Open-source tools for dependency analysis and vulnerability assessment',
  icons: {
    icon: '/images/securechain-logo.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
