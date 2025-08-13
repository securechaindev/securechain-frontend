'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { Package, GitPullRequest } from 'lucide-react'
import dynamic from 'next/dynamic'
import RepositoriesTab from './RepositoriesTab'
import PackagesTab from './PackagesTab'
import InitializationTab from './InitializationTab'
import PackageInitModal from './PackageInitModal'
import { usePackageOperations } from '@/hooks/api'
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
  userId: string
  translations: Record<string, any>
}

export default function HomeTabs({ user, userId, translations }: HomeTabsProps) {
  const packageOperations = usePackageOperations(translations)
  const {
    depexLoading,
    showPackageInitModal,
    setShowPackageInitModal,
    pendingPackageInit,
    handlePackageInit,
    handleCancelPackageInit,
  } = packageOperations

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="repositories" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger
              value="repositories"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3"
            >
              <GitHubIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm truncate">{translations.repositoriesTab}</span>
            </TabsTrigger>
            <TabsTrigger
              value="packages"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3"
            >
              <Package className="h-4 w-4" />
              <span className="text-xs sm:text-sm truncate">{translations.packagesTab}</span>
            </TabsTrigger>
            <TabsTrigger
              value="initialization"
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-3"
            >
              <GitPullRequest className="h-4 w-4" />
              <span className="text-xs sm:text-sm truncate">{translations.initializationTab}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="mt-4 sm:mt-6">
            <RepositoriesTab user={user} userId={userId} translations={translations} />
          </TabsContent>

          <TabsContent value="packages" className="mt-4 sm:mt-6">
            <PackagesTab
              userId={userId}
              translations={translations}
              packageOperations={packageOperations}
            />
          </TabsContent>

          <TabsContent value="initialization" className="mt-4 sm:mt-6">
            <InitializationTab userId={userId} translations={translations} />
          </TabsContent>
        </Tabs>

        <PackageInitModal
          open={showPackageInitModal}
          onOpenChange={setShowPackageInitModal}
          pendingPackageInit={pendingPackageInit}
          depexLoading={depexLoading}
          translations={translations}
          onInitialize={handlePackageInit}
          onCancel={handleCancelPackageInit}
        />
      </div>
    </div>
  )
}
