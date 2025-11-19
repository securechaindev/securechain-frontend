'use client'
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/ui'
import { depexAPI } from '@/lib/api'
import { getErrorMessage, getSuccessMessage, APIError } from '@/lib/utils'
import type { Repository } from '@/types'

export function useRepositories() {
  const [userRepositories, setUserRepositories] = useState<Repository[]>([])
  const [depexLoading, setDepexLoading] = useState(false)
  const { toast } = useToast()

  const fetchUserRepositories = useCallback(async () => {
    setDepexLoading(true)
    try {
      const response = await depexAPI.getRepositories()

      if (response.ok && response.data.code === 'get_repositories_success') {
        const repositories = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data?.repositories || []
        setUserRepositories(repositories)
      } else {
        const errorMessage = getErrorMessage(
          response.data.code || 'unknown_error'
        )
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      let errorMessage = 'Network error occurred'

      if (error instanceof APIError && error.code) {
        errorMessage = 'An error occurred'
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }, [toast])

  return {
    userRepositories,
    depexLoading,
    fetchUserRepositories,
    setDepexLoading,
  }
}
