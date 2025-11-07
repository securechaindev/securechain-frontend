'use client'

import { useState, useCallback } from 'react'
import { depexAPI } from '@/lib/api/apiClient'
import { useToast } from '@/hooks/ui/useToast'
import { getDepexErrorMessage } from '@/lib/utils/errorDetails'
import type {
  PackageInfoRequest,
  PackageInfoResponse,
  PackageInfoResult,
} from '@/types/PackageInfo'

interface PackageInfoState {
  isLoading: boolean
  data: PackageInfoResult | null
  error: string | null
  nodeType: string | null
}

export function usePackageInfo(translations: Record<string, any> = {}) {
  const { toast } = useToast()

  const [state, setState] = useState<PackageInfoState>({
    isLoading: false,
    data: null,
    error: null,
    nodeType: null,
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
        getDepexErrorMessage(error?.code || error?.detail, translations) ||
        error?.message ||
        fallbackMessage
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      })
    },
    [toast, translations]
  )

  const getPackageInfo = useCallback(
    async (params: PackageInfoRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        data: null,
        nodeType: params.node_type,
      }))

      try {
        const response = await depexAPI.operations.ssc.packageInfo(params)

        if (response.ok && response.data) {
          if (response.data.code === 'no_dependencies_package') {
            setState(prev => ({
              ...prev,
              data: response.data.data,
              isLoading: false,
            }))
            showSuccess(
              translations.packageInfoNoDependencies || 'The package has no dependencies.'
            )
            return response.data.data
          }

          if (response.data.code === 'package_info_success') {
            setState(prev => ({
              ...prev,
              data: response.data.data,
              isLoading: false,
            }))
            showSuccess(
              translations.packageInfoSuccess || 'Package information retrieved successfully.'
            )
            return response.data.data
          }
        }

        throw new Error('Unexpected response format')
      } catch (error: any) {
        showError(error, 'Failed to get package information')
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
      nodeType: null,
    })
  }, [])

  return {
    ...state,
    getPackageInfo,
    clearResults,
  }
}
