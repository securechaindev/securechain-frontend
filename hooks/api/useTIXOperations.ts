'use client'

import { useState } from 'react'
import { vexgenAPI } from '@/lib/api'
import type { TIXDocument, TIXDownloadRequest } from '@/types/TIX'
import { useToast } from '@/hooks/ui'

interface UseTIXOperationsReturn {
  // State
  tixDocuments: TIXDocument[]
  selectedTIX: TIXDocument | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchUserTIXs: (userId: string) => Promise<void>
  fetchTIX: (tixId: string) => Promise<void>
  downloadTIX: (tixId: string, filename?: string) => Promise<void>
  clearSelectedTIX: () => void
  clearError: () => void
}

export const useTIXOperations = (): UseTIXOperationsReturn => {
  const [tixDocuments, setTIXDocuments] = useState<TIXDocument[]>([])
  const [selectedTIX, setSelectedTIX] = useState<TIXDocument | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUserTIXs = async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await vexgenAPI.getUserTIXs(userId)
      setTIXDocuments(response.data.tixs || [])

      toast({
        title: 'TIX Documents Loaded',
        description: `Found ${response.data.tixs?.length || 0} TIX documents`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch TIX documents'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTIX = async (tixId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await vexgenAPI.getTIX(tixId)
      setSelectedTIX(response.data.tix)

      toast({
        title: 'TIX Document Loaded',
        description: 'TIX document details loaded successfully',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch TIX document'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTIX = async (tixId: string, filename?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await vexgenAPI.downloadTIX(tixId)

      // Handle file download
      if (response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = filename || `tix-document-${tixId}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: 'Download Started',
          description: 'TIX document download has started',
        })
      } else {
        throw new Error('Invalid response format for file download')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download TIX document'
      setError(errorMessage)
      toast({
        title: 'Download Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearSelectedTIX = () => {
    setSelectedTIX(null)
  }

  const clearError = () => {
    setError(null)
  }

  return {
    // State
    tixDocuments,
    selectedTIX,
    isLoading,
    error,

    // Actions
    fetchUserTIXs,
    fetchTIX,
    downloadTIX,
    clearSelectedTIX,
    clearError,
  }
}
