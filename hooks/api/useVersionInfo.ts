'use client'

import { useState, useCallback } from 'react'
import { depexAPI } from '@/lib/api/apiClient'
import { useToast } from '@/hooks/ui/useToast'
import { getDepexErrorMessage } from '@/lib/utils/errorDetails'
import type { VersionInfoRequest, VersionInfoResponse } from '@/types/VersionInfo'

interface VersionInfoState {
  isLoading: boolean
  data: VersionInfoResponse | null
  error: string | null
}

export function useVersionInfo(translations: Record<string, any> = {}) {
  const { toast } = useToast()

  const [state, setState] = useState<VersionInfoState>({
    isLoading: false,
    data: null,
    error: null,
  })

  const showSuccess = useCallback(
    (message: string) => {
      const successTitle = translations.successTitle || translations.success || 'Success'

      toast({
        title: successTitle,
        description: message,
      })
    },
    [toast, translations]
  )

  const showError = useCallback(
    (error: any, fallbackMessage: string) => {
      const errorTitle = translations.errorTitle || translations.error || 'Error'

      const errorMessage =
        getDepexErrorMessage(error?.detail, translations) || error?.message || fallbackMessage
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      })
    },
    [toast, translations]
  )

  const getVersionInfo = useCallback(
    async (params: VersionInfoRequest) => {
      setState(prev => ({ ...prev, isLoading: true, error: null, data: null }))

      try {
        const response = await depexAPI.operations.ssc.versionInfo(params)

        if (response.ok && response.data) {
          if (response.data.code === 'no_dependencies_version') {
            setState(prev => ({
              ...prev,
              data: response.data,
              isLoading: false,
            }))
            showSuccess(
              response.data.message ||
                translations.versionInfoNoDependencies ||
                'The package version has no dependencies.'
            )
            return response.data
          }

          if (response.data.code === 'version_info_success') {
            setState(prev => ({
              ...prev,
              data: response.data,
              isLoading: false,
            }))
            showSuccess(
              response.data.message ||
                translations.versionInfoSuccess ||
                'Package version information retrieved successfully.'
            )
            return response.data
          }
        }

        throw new Error('Unexpected response format')
      } catch (error: any) {
        showError(error, 'Failed to get package version information')
        throw error
      }
    },
    [showError, showSuccess, translations]
  )

  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      data: null,
      error: null,
    })
  }, [])

  return {
    ...state,
    getVersionInfo,
    clearResults,
  }
}
