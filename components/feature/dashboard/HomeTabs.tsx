'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, GitPullRequest } from 'lucide-react'
import dynamic from 'next/dynamic'
import RepositoriesTab from './RepositoriesTab'
import PackagesTab from './PackagesTab'
import InitializationTab from './InitializationTab'
import PackageInitModal from './PackageInitModal'
import { usePackageOperations } from '@/hooks/usePackageOperations'
import type { User } from '@/types/auth'

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
    handleCancelPackageInit
  } = packageOperations

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="repositories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="repositories">
              <GitHubIcon className="h-4 w-4 mr-2" /> {translations.repositoriesTab}
            </TabsTrigger>
            <TabsTrigger value="packages">
              <Package className="h-4 w-4 mr-2" /> {translations.packagesTab}
            </TabsTrigger>
            <TabsTrigger value="initialization">
              <GitPullRequest className="h-4 w-4 mr-2" /> {translations.initializationTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="mt-6">
            <RepositoriesTab user={user} userId={userId} translations={translations} />
          </TabsContent>

          <TabsContent value="packages" className="mt-6">
            <PackagesTab userId={userId} translations={translations} packageOperations={packageOperations} />
          </TabsContent>

          <TabsContent value="initialization" className="mt-6">
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
