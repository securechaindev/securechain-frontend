'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { GitPullRequest, Loader2, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/ui'
import { depexAPI } from '@/lib/api'

interface InitializationTabProps {
  userId: string
  translations: Record<string, any>
}

export default function InitializationTab({ userId, translations }: InitializationTabProps) {
  const [repoOwner, setRepoOwner] = useState('')
  const [repoName, setRepoName] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [depexLoading, setDepexLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleRepoInit = async () => {
    if (!repoOwner.trim() || !repoName.trim()) {
      toast({
        title: translations.errorTitle,
        description: 'Repository owner and name are required',
        variant: 'destructive',
      })
      return
    }

    setDepexLoading(true)
    setErrorMessage(null)

    try {
      const response = await depexAPI.initializeRepository({
        owner: repoOwner,
        name: repoName,
        user_id: userId,
      })

      if (response.ok && response.data) {
        const successMessage =
          response.data.message ||
          translations.repositoryInitializedSuccessfully ||
          'Repository initialized successfully'

        setRepoOwner('')
        setRepoName('')

        toast({
          title: translations.repositoryInitialized || 'Repository Initialized',
          description: successMessage,
        })
      } else {
        throw new Error(response.data?.error || 'Unexpected response format')
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        error.details ||
        translations.networkErrorDescription ||
        'Failed to initialize repository'

      setErrorMessage(errorMessage)

      toast({
        title: translations.errorTitle || 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <GitPullRequest className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">{translations.initializeDataTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">
            {translations.initializeRepositoryTitle}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="repoOwner" className="text-sm font-medium">
                {translations.repositoryOwnerLabel}
              </Label>
              <Input
                id="repoOwner"
                value={repoOwner}
                onChange={e => setRepoOwner(e.target.value)}
                placeholder={translations.repositoryOwnerPlaceholder}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repoName" className="text-sm font-medium">
                {translations.repositoryNameLabel}
              </Label>
              <Input
                id="repoName"
                value={repoName}
                onChange={e => setRepoName(e.target.value)}
                placeholder={translations.repositoryNamePlaceholder}
                className="w-full"
              />
            </div>
          </div>
          <Button
            onClick={handleRepoInit}
            disabled={depexLoading || !repoOwner.trim() || !repoName.trim()}
            className="w-full sm:w-auto"
            size="sm"
          >
            {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            <span className="text-xs sm:text-sm">{translations.initializeRepositoryButton}</span>
          </Button>
          {errorMessage && (
            <div className="p-3 rounded-md flex items-start gap-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm leading-relaxed break-words">{errorMessage}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
