'use client'

import { useState, useCallback } from 'react'
import { depexAPI } from '@/lib/api/apiClient'
import { useToast } from '@/hooks/ui/useToast'
import { getDepexErrorMessage, getDepexSuccessMessage } from '@/lib/utils/errorDetails'
import type {
  FileInfoRequest,
  ValidGraphRequest,
  ImpactOperationRequest,
  FilterConfigsRequest,
  ValidConfigRequest,
  CompleteConfigRequest,
  ConfigByImpactRequest,
  FileInfoResult,
  Configuration,
} from '@/types/RequirementOperations'

interface RequirementOperationsState {
  isLoading: boolean
  selectedOperation: string | null
  fileInfoResult: FileInfoResult | null
  validationResult: boolean | null
  configurations: Configuration[] | null
  singleConfiguration: Configuration | null
  error: string | null
}

export function useRequirementOperations(translations: Record<string, any> = {}) {
  const { toast } = useToast()

  const [state, setState] = useState<RequirementOperationsState>({
    isLoading: false,
    selectedOperation: null,
    fileInfoResult: null,
    validationResult: null,
    configurations: null,
    singleConfiguration: null,
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
        getDepexErrorMessage(error?.code || error?.detail, translations) || error?.message || fallbackMessage
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      })
    },
    [toast, translations]
  )

  const handleResponse = useCallback((response: any, operationType: string) => {
    if (response && typeof response === 'object' && 'data' in response) {
      if (response.ok) {
        if (response.data && response.data.code === 'operation_success') {
          return response.data.data
        }
        return response.data.data
      } else {
        if (response.data && response.data.code) {
          return response.data
        }
        throw new Error(`${operationType} failed: ${response.status}`)
      }
    }

    if (response && response.success) {
      return response.data
    } else {
      throw new Error(`${operationType} failed: ${response?.message || 'Unknown error'}`)
    }
  }, [])

  const getFileInfo = useCallback(
    async (params: FileInfoRequest) => {
      setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'file_info' }))

      try {
        const response = await depexAPI.operations.ssc.fileInfo(params)
        const result = handleResponse(response, 'file info retrieval')

        if (
          result &&
          typeof result === 'object' &&
          result.code &&
          result.code !== 'operation_success'
        ) {
          setState(prev => ({ ...prev, isLoading: false }))
          return result
        }

        if (result) {
          setState(prev => ({ ...prev, fileInfoResult: result, isLoading: false }))
          showSuccess(
            translations.docs?.requirementOperations?.fileInfoSuccess ||
              'Información del archivo obtenida exitosamente'
          )
          return result
        }
      } catch (error) {
        showError(error, 'Failed to get file info')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const validateGraph = useCallback(
    async (params: ValidGraphRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        selectedOperation: 'valid_graph',
      }))

      try {
        const response = await depexAPI.operations.smt.validGraph(params)
        const result = handleResponse(response, 'graph validation')

        if (result !== null) {
          setState(prev => ({ ...prev, validationResult: result, isLoading: false }))
          const message = result
            ? translations.docs?.requirementOperations?.graphValid ||
              'El grafo del fichero de requisitos es válido'
            : translations.docs?.requirementOperations?.graphInvalid ||
              'El grafo del fichero de requisitos es inválido'
          showSuccess(message)
          return result
        }
      } catch (error) {
        showError(error, 'Failed to validate graph')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const minimizeImpact = useCallback(
    async (params: ImpactOperationRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        selectedOperation: 'minimize_impact',
      }))

      try {
        const response = await depexAPI.operations.smt.minimizeImpact(params)
        const result = handleResponse(response, 'impact minimization')

        if (result) {
          setState(prev => ({ ...prev, configurations: result, isLoading: false }))
          showSuccess(
            translations.docs?.requirementOperations?.minimizeSuccess ||
              'Minimización de impacto completada exitosamente'
          )
          return result
        }
      } catch (error) {
        showError(error, 'Failed to minimize impact')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const maximizeImpact = useCallback(
    async (params: ImpactOperationRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        selectedOperation: 'maximize_impact',
      }))

      try {
        const response = await depexAPI.operations.smt.maximizeImpact(params)
        const result = handleResponse(response, 'impact maximization')

        if (result) {
          setState(prev => ({ ...prev, configurations: result, isLoading: false }))
          showSuccess(
            translations.docs?.requirementOperations?.maximizeSuccess ||
              'Maximización de impacto completada exitosamente'
          )
          return result
        }
      } catch (error) {
        showError(error, 'Failed to maximize impact')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const filterConfigs = useCallback(
    async (params: FilterConfigsRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        selectedOperation: 'filter_configs',
      }))

      try {
        const response = await depexAPI.operations.smt.filterConfigs(params)
        const result = handleResponse(response, 'configuration filtering')

        if (result) {
          setState(prev => ({ ...prev, configurations: result, isLoading: false }))
          showSuccess(
            translations.docs?.requirementOperations?.filterSuccess ||
              'Filtrado de configuraciones completado exitosamente'
          )
          return result
        }
      } catch (error) {
        showError(error, 'Failed to filter configurations')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const validateConfig = useCallback(
    async (params: ValidConfigRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        selectedOperation: 'valid_config',
      }))

      try {
        const response = await depexAPI.operations.smt.validConfig(params)
        const result = handleResponse(response, 'configuration validation')

        if (result !== null) {
          setState(prev => ({ ...prev, validationResult: result, isLoading: false }))
          const message = result
            ? translations.docs?.requirementOperations?.configValid || 'La configuración es válida'
            : translations.docs?.requirementOperations?.configInvalid ||
              'La configuración es inválida'
          showSuccess(message)
          return result
        }
      } catch (error) {
        showError(error, 'Failed to validate configuration')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const completeConfig = useCallback(
    async (params: CompleteConfigRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        selectedOperation: 'complete_config',
      }))

      try {
        const response = await depexAPI.operations.smt.completeConfig(params)
        const result = handleResponse(response, 'configuration completion')

        if (result) {
          setState(prev => ({ ...prev, singleConfiguration: result, isLoading: false }))
          showSuccess(
            translations.docs?.requirementOperations?.completeSuccess ||
              'Configuración completada exitosamente'
          )
          return result
        }
      } catch (error) {
        showError(error, 'Failed to complete configuration')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const configByImpact = useCallback(
    async (params: ConfigByImpactRequest) => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        selectedOperation: 'config_by_impact',
      }))

      try {
        const response = await depexAPI.operations.smt.configByImpact(params)
        const result = handleResponse(response, 'configuration by impact')

        if (result) {
          setState(prev => ({ ...prev, singleConfiguration: result, isLoading: false }))
          showSuccess(
            translations.docs?.requirementOperations?.configByImpactSuccess ||
              'Configuración por impacto completada exitosamente'
          )
          return result
        }
      } catch (error) {
        showError(error, 'Failed to get configuration by impact')
        throw error
      }
    },
    [handleResponse, showError, showSuccess, translations]
  )

  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      selectedOperation: null,
      fileInfoResult: null,
      validationResult: null,
      configurations: null,
      singleConfiguration: null,
      error: null,
    })
  }, [])

  return {
    ...state,
    getFileInfo,
    validateGraph,
    minimizeImpact,
    maximizeImpact,
    filterConfigs,
    validateConfig,
    completeConfig,
    configByImpact,
    clearResults,
    isExecuting: state.isLoading,
  }
}
