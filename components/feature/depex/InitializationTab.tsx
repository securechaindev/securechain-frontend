'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { GitPullRequest, Loader2, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/ui'
import { depexAPI } from '@/lib/api'

interface InitializationTabProps {}

export default function InitializationTab({}: InitializationTabProps) {
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
        title: 'Error',
        description: 'Repository owner and name are required',
        variant: 'destructive',
      })
      return
    }

    setDepexLoading(true)
    setErrorMessage(null)

    try {
      const requestData = {
        owner: repoOwner.trim(),
        name: repoName.trim(),
      }

      const response = await depexAPI.initializeRepository(requestData)

      const code = response.data?.code

      if (code === 'repository_queued_for_processing') {
        setRepoOwner('')
        setRepoName('')

        toast({
          title: 'Success',
          description: 'The repository has been queued for processing',
        })
      } else if (code === 'repository_processing_in_progress') {
        toast({
          variant: 'default',
          title: 'Info',
          description: 'The repository is already being processed',
        })
      } else if (code === 'repository_not_found') {
        const errorMsg = `Repository ${repoName} not found for owner ${repoOwner}`
        setErrorMessage(errorMsg)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg,
        })
      } else if (code === 'date_not_found') {
        const errorMsg = `Last commit date not found in repository ${repoName} for owner ${repoOwner}`
        setErrorMessage(errorMsg)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg,
        })
      } else if (code === 'error_initializing_repository') {
        const errorMsg = 'An error occurred while initializing the repository'
        setErrorMessage(errorMsg)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg,
        })
      } else {
        throw new Error('Unexpected response code')
      }
    } catch (error: any) {
      const code = error.code
      let errorMsg = ''

      if (code === 'repository_not_found') {
        errorMsg = 'Repository not found'
      } else if (code === 'date_not_found') {
        errorMsg = 'Last commit date not found in repository'
      } else if (code === 'error_initializing_repository') {
        errorMsg = 'An error occurred while initializing the repository'
      } else {
        errorMsg = error.message || 'An error occurred while initializing the repository'
      }

      setErrorMessage(errorMsg)

      toast({
        title: 'Error',
        description: errorMsg,
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
          <span className="truncate">Initialize a Repository</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="repoOwner" className="text-sm font-medium">
                Repository Owner
              </Label>
              <Input
                id="repoOwner"
                value={repoOwner}
                onChange={e => setRepoOwner(e.target.value)}
                placeholder="securechaindev"
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repoName" className="text-sm font-medium">
                Repository Name
              </Label>
              <Input
                id="repoName"
                value={repoName}
                onChange={e => setRepoName(e.target.value)}
                placeholder="securechain-depex"
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
            <span className="text-xs sm:text-sm">Initialize Repository</span>
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
