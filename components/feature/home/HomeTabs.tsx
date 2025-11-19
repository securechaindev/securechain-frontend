'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { Package, GitPullRequest, FileText, Shield } from 'lucide-react'
import dynamic from 'next/dynamic'
import {
  RepositoriesTab,
  PackagesTab,
  InitializationTab,
  PackageInitModal,
} from '@/components/feature/depex'
import { UserVEXsTab, UserTIXsTab } from '@/components/feature/vexgen'
import { usePackageOperations } from '@/hooks/api'
import { STORAGE_KEYS } from '@/constants'
import type { User } from '@/types'

const GitHubIcon = dynamic(
  () => import('react-icons/si').then(mod => ({ default: mod.SiGithub })),
  {
    ssr: false,
    loading: () => <div className="h-4 w-4 animate-pulse bg-muted rounded" />,
  }
)

interface HomeTabsProps {
  user: User | null
}

export default function HomeTabs({ user }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState('initialization')

  const packageOperations = usePackageOperations()
  const {
    depexLoading,
    showPackageInitModal,
    setShowPackageInitModal,
    pendingPackageInit,
    handlePackageInit,
    handleCancelPackageInit,
  } = packageOperations

  // Load active tab from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem(STORAGE_KEYS.HOME_ACTIVE_TAB)
      if (savedTab) {
        setActiveTab(savedTab)
      }
    }
  }, [])

  // Save active tab to localStorage when it changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.HOME_ACTIVE_TAB, value)
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 md:py-8">
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto gap-1 sm:gap-2 p-1 sm:p-2">
            <TabsTrigger
              value="initialization"
              className="flex flex-col gap-1 sm:gap-2 py-2 sm:py-3 px-0.5 sm:px-2 text-[10px] sm:text-xs md:text-sm min-h-[60px] sm:min-h-[70px] items-center justify-center"
            >
              <GitPullRequest className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-center leading-none break-words max-w-full">
                Initialization
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="repositories"
              className="flex flex-col gap-1 sm:gap-2 py-2 sm:py-3 px-0.5 sm:px-2 text-[10px] sm:text-xs md:text-sm min-h-[60px] sm:min-h-[70px] items-center justify-center"
            >
              <GitHubIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-center leading-none break-words max-w-full">
                Repositories
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="packages"
              className="flex flex-col gap-1 sm:gap-2 py-2 sm:py-3 px-0.5 sm:px-2 text-[10px] sm:text-xs md:text-sm min-h-[60px] sm:min-h-[70px] items-center justify-center"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-center leading-none break-words max-w-full">
                Packages
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="user-vexs"
              className="flex flex-col gap-1 sm:gap-2 py-2 sm:py-3 px-0.5 sm:px-2 text-[10px] sm:text-xs md:text-sm min-h-[60px] sm:min-h-[70px] items-center justify-center"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-center leading-none break-words max-w-full">
                User VEXs
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="user-tixs"
              className="flex flex-col gap-1 sm:gap-2 py-2 sm:py-3 px-0.5 sm:px-2 text-[10px] sm:text-xs md:text-sm min-h-[60px] sm:min-h-[70px] items-center justify-center"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-center leading-none break-words max-w-full">
                User TIXs
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="initialization" className="mt-2 sm:mt-4 md:mt-6">
            <InitializationTab />
          </TabsContent>

          <TabsContent value="repositories" className="mt-2 sm:mt-4 md:mt-6">
            <RepositoriesTab user={user} />
          </TabsContent>

          <TabsContent value="packages" className="mt-2 sm:mt-4 md:mt-6">
            <PackagesTab packageOperations={packageOperations} />
          </TabsContent>

          <TabsContent value="user-vexs" className="mt-2 sm:mt-4 md:mt-6">
            <UserVEXsTab />
          </TabsContent>

          <TabsContent value="user-tixs" className="mt-2 sm:mt-4 md:mt-6">
            <UserTIXsTab />
          </TabsContent>
        </Tabs>

        <PackageInitModal
          open={showPackageInitModal}
          onOpenChange={setShowPackageInitModal}
          pendingPackageInit={pendingPackageInit}
          depexLoading={depexLoading}
          onInitialize={handlePackageInit}
          onCancel={handleCancelPackageInit}
        />
      </div>
    </div>
  )
}
