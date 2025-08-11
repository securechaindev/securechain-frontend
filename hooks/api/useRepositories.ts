'use client'
import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/ui'
import { depexAPI } from '@/lib/api'
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
      setUserRepositories(response.data.repositories || [])
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
    setDepexLoading,
  }
}
