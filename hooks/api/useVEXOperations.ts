'use client'

import { useState } from 'react'
import { vexgenAPI } from '@/lib/api'
import type { VEXDocument, VEXDownloadRequest } from '@/types/VEX'
import { useToast } from '@/hooks/ui'

interface UseVEXOperationsReturn {
  // State
  vexDocuments: VEXDocument[]
  selectedVEX: VEXDocument | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchUserVEXs: (userId: string) => Promise<void>
  fetchVEX: (vexId: string) => Promise<void>
  downloadVEX: (vexId: string, filename?: string) => Promise<void>
  clearSelectedVEX: () => void
  clearError: () => void
}

export const useVEXOperations = (): UseVEXOperationsReturn => {
  const [vexDocuments, setVEXDocuments] = useState<VEXDocument[]>([])
  const [selectedVEX, setSelectedVEX] = useState<VEXDocument | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUserVEXs = async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await vexgenAPI.getUserVEXs(userId)
      setVEXDocuments(response.data.data || [])

      toast({
        title: 'VEX Documents Loaded',
        description: `Found ${response.data.data.length || 0} VEX documents`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch VEX documents'
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

  const fetchVEX = async (vexId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await vexgenAPI.getVEX(vexId)
      setSelectedVEX(response.data.data)

      toast({
        title: 'VEX Document Loaded',
        description: 'VEX document details loaded successfully',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch VEX document'
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

  const downloadVEX = async (vexId: string, filename?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await vexgenAPI.downloadVEX(vexId)

      // Handle file download
      if (response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = filename || `vex-document-${vexId}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: 'Download Started',
          description: 'VEX document download has started',
        })
      } else {
        throw new Error('Invalid response format for file download')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download VEX document'
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

  const clearSelectedVEX = () => {
    setSelectedVEX(null)
  }

  const clearError = () => {
    setError(null)
  }

  return {
    // State
    vexDocuments,
    selectedVEX,
    isLoading,
    error,

    // Actions
    fetchUserVEXs,
    fetchVEX,
    downloadVEX,
    clearSelectedVEX,
    clearError,
  }
}
