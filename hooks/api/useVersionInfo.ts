'use client'

import { useState, useCallback } from 'react'
import { depexAPI } from '@/lib/api/apiClient'
import { useToast } from '@/hooks/ui/useToast'
import { getErrorMessage } from '@/lib/utils/errorDetails'
import type { VersionInfoRequest, VersionInfoResult } from '@/types/VersionInfo'

interface VersionInfoState {
  isLoading: boolean
  data: VersionInfoResult | null
  error: string | null
  nodeType: string | null
}

export function useVersionInfo() {
  const { toast } = useToast()

  const [state, setState] = useState<VersionInfoState>({
    isLoading: false,
    data: null,
    error: null,
    nodeType: null})

  const showSuccess = useCallback(
    (message: string) => {
      const successTitle =
        'Success'

      toast({
        title: successTitle,
        description: message})
    },
    [toast]
  )

  const showError = useCallback(
    (error: any, fallbackMessage: string) => {
      const errorTitle =
        'Error'

      const errorMessage =
        getErrorMessage(error?.code || error?.detail) ||
        error?.message ||
        fallbackMessage
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive'})
    },
    [toast]
  )

  const getVersionInfo = useCallback(
    async (params: VersionInfoRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        data: null,
        nodeType: params.node_type}))

      try {
        const response = await depexAPI.operations.ssc.versionInfo(params)

        if (response.ok && response.data) {
          if (response.data.code === 'no_dependencies_version') {
            setState(prev => ({
              ...prev,
              data: response.data.data,
              isLoading: false}))
            showSuccess(
              'The package version has no dependencies.'
            )
            return response.data.data
          }

          if (response.data.code === 'version_info_success') {
            setState(prev => ({
              ...prev,
              data: response.data.data,
              isLoading: false}))
            showSuccess(
              'Package version information retrieved successfully.'
            )
            return response.data.data
          }
        }

        throw new Error('Unexpected response format')
      } catch (error: any) {
        showError(error, 'Failed to get package version information')
        throw error
      }
    },
    [showError, showSuccess]
  )

  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      data: null,
      error: null,
      nodeType: null})
  }, [])

  return {
    ...state,
    getVersionInfo,
    clearResults}
}
