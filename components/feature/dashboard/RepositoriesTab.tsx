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
  userId: string
  translations: Record<string, any>
}

export default function RepositoriesTab({ user, userId, translations }: RepositoriesTabProps) {
  const { userRepositories, depexLoading, fetchUserRepositories } = useRepositories(
    userId,
    translations
  )

  useEffect(() => {
    if (userId) {
      fetchUserRepositories()
    }
  }, [userId, fetchUserRepositories])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitHubIcon className="h-5 w-5" /> {translations.yourRepositoriesTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {translations.yourRepositoriesDescription}{' '}
          <span className="font-semibold">{user?.email}</span>
        </p>
        <Button onClick={fetchUserRepositories} disabled={depexLoading} className="mb-4">
          {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {translations.refreshRepositoriesButton}
        </Button>
        {userRepositories.length === 0 && !depexLoading && (
          <p className="text-muted-foreground">{translations.noRepositoriesFound}</p>
        )}
        {userRepositories.length > 0 && (
          <div className="space-y-4">
            {userRepositories.map((repo, index) => (
              <RepositoryCard key={index} repository={repo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
