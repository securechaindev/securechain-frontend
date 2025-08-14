'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { depexAPI } from '@/lib/api/apiClient';
import { useToast } from '@/hooks/ui/useToast';
import { getDepexErrorMessage, getDepexSuccessMessage } from '@/lib/utils/errorCodes';
import type {
  FileInfoRequest,
  ValidGraphRequest,
  ImpactOperationRequest,
  FilterConfigsRequest,
  ValidConfigRequest,
  CompleteConfigRequest,
  ConfigByImpactRequest,
  FileInfoResult,
  Configuration
} from '@/types/RequirementOperations';

interface RequirementOperationsState {
  isLoading: boolean;
  selectedOperation: string | null;
  fileInfoResult: FileInfoResult | null;
  validationResult: boolean | null;
  configurations: Configuration[] | null;
  singleConfiguration: Configuration | null;
  error: string | null;
}

export function useRequirementOperations() {
  const { t } = useTranslation('common');
  const { toast } = useToast();

  const [state, setState] = useState<RequirementOperationsState>({
    isLoading: false,
    selectedOperation: null,
    fileInfoResult: null,
    validationResult: null,
    configurations: null,
    singleConfiguration: null,
    error: null,
  });

  const showSuccess = useCallback((message: string) => {
    toast({ title: t('common.success'), description: message });
  }, [toast, t]);

  const showError = useCallback((error: any, fallbackMessage: string) => {
    const translations = {}; // Empty object for now, could be expanded with actual translations
    const errorMessage = getDepexErrorMessage(error?.code, translations) || error?.message || fallbackMessage;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    toast({ title: t('common.error'), description: errorMessage, variant: 'destructive' });
  }, [toast, t]);

  const handleResponse = useCallback((response: any, operationType: string) => {
    // If response is from apiClient, it should have { data, status, ok } structure
    if (response && typeof response === 'object' && 'data' in response) {
      if (response.ok) {
        // Check if the data has the expected Depex structure
        if (response.data && response.data.code === 'operation_success') {
          return response.data.result;
        }
        // Fallback to return data directly
        return response.data;
      } else {
        throw new Error(`${operationType} failed: ${response.status}`);
      }
    }
    
    // Legacy check for success field
    if (response && response.success) {
      return response.data;
    } else {
      throw new Error(`${operationType} failed: ${response?.message || 'Unknown error'}`);
    }
  }, []);

  // File operations
  const getFileInfo = useCallback(async (params: FileInfoRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'file_info' }));
    
    try {
      const response = await depexAPI.operations.file.fileInfo(params);
      const result = handleResponse(response, 'file info retrieval');
      
      if (result) {
        setState(prev => ({ ...prev, fileInfoResult: result, isLoading: false }));
        showSuccess(t('requirementOperations.fileInfoSuccess'));
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to get file info');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  const validateGraph = useCallback(async (params: ValidGraphRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'valid_graph' }));
    
    try {
      const response = await depexAPI.operations.file.validGraph(params);
      const result = handleResponse(response, 'graph validation');
      
      if (result !== null) {
        setState(prev => ({ ...prev, validationResult: result, isLoading: false }));
        const message = result 
          ? t('requirementOperations.graphValid')
          : t('requirementOperations.graphInvalid');
        showSuccess(message);
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to validate graph');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  const minimizeImpact = useCallback(async (params: ImpactOperationRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'minimize_impact' }));
    
    try {
      const response = await depexAPI.operations.file.minimizeImpact(params);
      const result = handleResponse(response, 'impact minimization');
      
      if (result) {
        setState(prev => ({ ...prev, configurations: result, isLoading: false }));
        showSuccess(t('requirementOperations.minimizeSuccess'));
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to minimize impact');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  const maximizeImpact = useCallback(async (params: ImpactOperationRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'maximize_impact' }));
    
    try {
      const response = await depexAPI.operations.file.maximizeImpact(params);
      const result = handleResponse(response, 'impact maximization');
      
      if (result) {
        setState(prev => ({ ...prev, configurations: result, isLoading: false }));
        showSuccess(t('requirementOperations.maximizeSuccess'));
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to maximize impact');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  const filterConfigs = useCallback(async (params: FilterConfigsRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'filter_configs' }));
    
    try {
      const response = await depexAPI.operations.file.filterConfigs(params);
      const result = handleResponse(response, 'configuration filtering');
      
      if (result) {
        setState(prev => ({ ...prev, configurations: result, isLoading: false }));
        showSuccess(t('requirementOperations.filterSuccess'));
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to filter configurations');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  // Config operations
  const validateConfig = useCallback(async (params: ValidConfigRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'valid_config' }));
    
    try {
      const response = await depexAPI.operations.config.validConfig(params);
      const result = handleResponse(response, 'configuration validation');
      
      if (result !== null) {
        setState(prev => ({ ...prev, validationResult: result, isLoading: false }));
        const message = result 
          ? t('requirementOperations.configValid')
          : t('requirementOperations.configInvalid');
        showSuccess(message);
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to validate configuration');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  const completeConfig = useCallback(async (params: CompleteConfigRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'complete_config' }));
    
    try {
      const response = await depexAPI.operations.config.completeConfig(params);
      const result = handleResponse(response, 'configuration completion');
      
      if (result) {
        setState(prev => ({ ...prev, singleConfiguration: result, isLoading: false }));
        showSuccess(t('requirementOperations.completeSuccess'));
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to complete configuration');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  const configByImpact = useCallback(async (params: ConfigByImpactRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedOperation: 'config_by_impact' }));
    
    try {
      const response = await depexAPI.operations.config.configByImpact(params);
      const result = handleResponse(response, 'configuration by impact');
      
      if (result) {
        setState(prev => ({ ...prev, singleConfiguration: result, isLoading: false }));
        showSuccess(t('requirementOperations.configByImpactSuccess'));
        return result;
      }
    } catch (error) {
      showError(error, 'Failed to get configuration by impact');
      throw error;
    }
  }, [handleResponse, showError, showSuccess, t]);

  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      selectedOperation: null,
      fileInfoResult: null,
      validationResult: null,
      configurations: null,
      singleConfiguration: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    // File operations
    getFileInfo,
    validateGraph,
    minimizeImpact,
    maximizeImpact,
    filterConfigs,
    // Config operations
    validateConfig,
    completeConfig,
    configByImpact,
    // Utility
    clearResults,
    isExecuting: state.isLoading
  };
}