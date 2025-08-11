'use client'
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/ui'
import { API_ENDPOINTS } from '@/constants'
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
      const response = await fetch(API_ENDPOINTS.DEPEX.REPOSITORIES(userId), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setUserRepositories(data.repositories || [])
      } else {
        toast({
          title: translations.errorTitle,
          description: data.error || 'Failed to fetch user repositories',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error fetching repositories:', error)
      toast({
        title: translations.errorTitle,
        description: error.message || translations.networkErrorDescription,
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
    setDepexLoading
  }
}
