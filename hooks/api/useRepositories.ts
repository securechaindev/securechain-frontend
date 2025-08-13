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
      
      if (response.ok && response.data.code === 'get_repositories_success') {
        setUserRepositories(response.data.repositories || [])
        if (response.data.repositories?.length > 0) {
          const successMessage = getDepexSuccessMessage('get_repositories_success', translations)
          toast({
            title: translations.successTitle || 'Success',
            description: successMessage,
          })
        }
      } else {
        const errorMessage = getDepexErrorMessage(response.data.code || 'unknown_error', translations)
        toast({
          title: translations.errorTitle || 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error fetching repositories:', error)
      
      let errorMessage = translations.networkErrorDescription || 'Network error occurred'
      
      if (error instanceof APIError && error.code) {
        errorMessage = getDepexErrorMessage(error.code, translations)
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
