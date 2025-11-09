'use client'
import { useEffect } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import RepositoryCard from './RepositoryCard'
import { useRepositories } from '@/hooks/api'
import type { User } from '@/types'

const GitHubIcon = dynamic(
  () => import('react-icons/si').then(mod => ({ default: mod.SiGithub })),
  {
    ssr: false,
    loading: () => <div className="h-5 w-5 animate-pulse bg-muted rounded" />,
  }
)

interface RepositoriesTabProps {
  user: User | null
  translations: Record<string, any>
}

export default function RepositoriesTab({ user, translations }: RepositoriesTabProps) {
  const { userRepositories, depexLoading, fetchUserRepositories } = useRepositories(translations)

  useEffect(() => {
    fetchUserRepositories()
  }, [fetchUserRepositories])

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <GitHubIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">{translations.yourRepositoriesTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
          {translations.yourRepositoriesDescription}{' '}
          <span className="font-semibold break-all">{user?.email}</span>
        </p>
        <Button
          onClick={fetchUserRepositories}
          disabled={depexLoading}
          className="mb-4 w-full sm:w-auto"
          size="sm"
        >
          {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <span className="text-xs sm:text-sm">{translations.refreshRepositoriesButton}</span>
        </Button>
        {userRepositories.length === 0 && !depexLoading && (
          <p className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-lg">
            {translations.noRepositoriesFound}
          </p>
        )}
        {userRepositories.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {userRepositories.map((repo, index) => (
              <RepositoryCard key={index} repository={repo} translations={translations} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
