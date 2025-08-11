'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { GitPullRequest, Loader2, CheckCircle, XCircle } from 'lucide-react'
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
        const successMessage = response.data.message || translations.repositoryInitializedSuccessfully || 'Repository initialized successfully'
        
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
      const errorMessage = error.message || error.details || translations.networkErrorDescription || 'Failed to initialize repository'
      
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
          <Button onClick={handleRepoInit} disabled={depexLoading || !repoOwner.trim() || !repoName.trim()}>
            {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {translations.initializeRepositoryButton}
          </Button>
          {errorMessage && (
            <div className="p-3 rounded-md flex items-center gap-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <XCircle className="h-5 w-5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
