'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'

interface DocsTabsProps {
  children: React.ReactNode
  t: any
}

export function DocsTabs({ children, t }: DocsTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Read the hash from URL on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (
      hash &&
      ['overview', 'auth', 'vexgen', 'graph', 'ssc-ops', 'smt-ops', 'schemas'].includes(hash)
    ) {
      setActiveTab(hash)
    }
  }, [])

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL hash without triggering navigation
    const newUrl = `${window.location.pathname}${window.location.search}#${value}`
    window.history.replaceState({}, '', newUrl)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-auto">
        <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
          <span className="lg:hidden">{t.docs.overview}</span>
          <span className="hidden lg:inline">{t.docs.overview}</span>
        </TabsTrigger>
        <TabsTrigger value="auth" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
          <span className="lg:hidden">{t.docs.auth}</span>
          <span className="hidden lg:inline">{t.docs.auth}</span>
        </TabsTrigger>
        <TabsTrigger value="vexgen" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
          <span className="lg:hidden">VEX/TIX</span>
          <span className="hidden lg:inline">{(t as any).vexgen?.tabTitle || 'VEX & TIX'}</span>
        </TabsTrigger>
        <TabsTrigger value="graph" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
          <span className="lg:hidden">{t.docs.graph}</span>
          <span className="hidden lg:inline">{t.docs.graph}</span>
        </TabsTrigger>
        <TabsTrigger value="ssc-ops" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
          <span className="lg:hidden">{t.docs.sscOps}</span>
          <span className="hidden lg:inline">{t.docs.sscOps}</span>
        </TabsTrigger>
        <TabsTrigger value="smt-ops" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
          <span className="lg:hidden">{t.docs.smtOps}</span>
          <span className="hidden lg:inline">{t.docs.smtOps}</span>
        </TabsTrigger>
        <TabsTrigger value="schemas" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
          <span className="lg:hidden">{t.docs.schemas}</span>
          <span className="hidden lg:inline">{t.docs.schemas}</span>
        </TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  )
}
