'use client'

import { useState, useCallback } from 'react'
import { depexAPI } from '@/lib/api/apiClient'
import { useToast } from '@/hooks/ui/useToast'
import { getErrorMessage } from '@/lib/utils/errorDetails'
import type {
  PackageInfoRequest,
  PackageInfoResult} from '@/types/PackageInfo'

interface PackageInfoState {
  isLoading: boolean
  data: PackageInfoResult | null
  error: string | null
  nodeType: string | null
}

export function usePackageInfo() {
  const { toast } = useToast()

  const [state, setState] = useState<PackageInfoState>({
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

  const getPackageInfo = useCallback(
    async (params: PackageInfoRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        data: null,
        nodeType: params.node_type}))

      try {
        const response = await depexAPI.operations.ssc.packageInfo(params)

        if (response.ok && response.data) {
          if (response.data.code === 'no_dependencies_package') {
            setState(prev => ({
              ...prev,
              data: response.data.data,
              isLoading: false}))
            showSuccess(
              'The package has no dependencies.'
            )
            return response.data.data
          }

          if (response.data.code === 'package_info_success') {
            setState(prev => ({
              ...prev,
              data: response.data.data,
              isLoading: false}))
            showSuccess(
              'Package information retrieved successfully.'
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
    getPackageInfo,
    clearResults}
}
