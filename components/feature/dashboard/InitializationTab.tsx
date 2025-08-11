'use client'

import { useState } from 'react'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { GitPullRequest, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/ui'
import { API_ENDPOINTS } from '@/constants'
import type { RepositoryInitResult } from '@/types'

interface InitializationTabProps {
  userId: string
  translations: Record<string, any>
}

export default function InitializationTab({ userId, translations }: InitializationTabProps) {
  const [repoOwner, setRepoOwner] = useState('')
  const [repoName, setRepoName] = useState('')
  const [repoInitResult, setRepoInitResult] = useState<RepositoryInitResult | null>(null)
  const [depexLoading, setDepexLoading] = useState(false)
  
  const { toast } = useToast()

  const handleRepoInit = async () => {
    setDepexLoading(true)
    setRepoInitResult(null)
    try {
      const response = await fetch(API_ENDPOINTS.DEPEX.REPOSITORY_INIT, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner: repoOwner, name: repoName, user_id: userId }),
      })
      const data = await response.json()
      setRepoInitResult(data)
      if (response.ok) {
        toast({
          title: translations.repositoryInitialized,
          description: data.message,
        })
      } else {
        toast({
          title: translations.errorTitle,
          description: data.error || 'Failed to initialize repository',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: translations.errorTitle,
        description: error.message || translations.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5" /> {translations.initializeDataTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{translations.initializeRepositoryTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="repoOwner">{translations.repositoryOwnerLabel}</Label>
              <Input
                id="repoOwner"
                value={repoOwner}
                onChange={e => setRepoOwner(e.target.value)}
                placeholder={translations.repositoryOwnerPlaceholder}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repoName">{translations.repositoryNameLabel}</Label>
              <Input
                id="repoName"
                value={repoName}
                onChange={e => setRepoName(e.target.value)}
                placeholder={translations.repositoryNamePlaceholder}
              />
            </div>
          </div>
          <Button onClick={handleRepoInit} disabled={depexLoading}>
            {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {translations.initializeRepositoryButton}
          </Button>
          {repoInitResult && (
            <div
              className={`p-3 rounded-md flex items-center gap-2 ${repoInitResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
            >
              {repoInitResult.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{repoInitResult.message}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
