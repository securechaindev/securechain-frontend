'use client'
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/ui'
import { depexAPI } from '@/lib/api'
import { getDepexErrorMessage, getDepexSuccessMessage, APIError } from '@/lib/utils'
import type { Repository } from '@/types'

export function useRepositories(userId: string, translations: Record<string, any>) {
  const [userRepositories, setUserRepositories] = useState<Repository[]>([])
  const [depexLoading, setDepexLoading] = useState(false)
  const { toast } = useToast()

  const fetchUserRepositories = useCallback(async () => {
    if (!userId) {
      return
    }

    setDepexLoading(true)
    try {
      const response = await depexAPI.getRepositories(userId)

      if (response.ok && response.data.detail === 'get_repositories_success') {
        setUserRepositories(response.data.repositories || [])
        // Removed success notification - not needed when loading data
      } else {
        const errorMessage = getDepexErrorMessage(
          response.data.detail || 'unknown_error',
          translations
        )
        toast({
          title: translations.errorTitle || 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      let errorMessage = translations.networkErrorDescription || 'Network error occurred'

      if (error instanceof APIError && error.detail) {
        errorMessage = getDepexErrorMessage(error.detail, translations)
      }

      toast({
        title: translations.errorTitle || 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }, [userId, translations, toast])

  return {
    userRepositories,
    depexLoading,
    fetchUserRepositories,
    setDepexLoading,
  }
}
