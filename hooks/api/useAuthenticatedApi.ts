'use client'

import { useCallback } from 'react'
import { apiClient } from '@/lib/api'
import { RequestOptions } from '@/lib/api/api-client'

export function useAuthenticatedApi() {
  const get = useCallback(
    async <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => {
      return await apiClient.get<T>(endpoint, options)
    },
    []
  )

  const post = useCallback(
    async <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>) => {
      return await apiClient.post<T>(endpoint, body, options)
    },
    []
  )

  const put = useCallback(
    async <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>) => {
      return await apiClient.put<T>(endpoint, body, options)
    },
    []
  )

  const del = useCallback(
    async <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => {
      return await apiClient.delete<T>(endpoint, options)
    },
    []
  )

  const patch = useCallback(
    async <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>) => {
      return await apiClient.patch<T>(endpoint, body, options)
    },
    []
  )

  const upload = useCallback(
    async <T = any>(
      endpoint: string,
      formData: FormData,
      options?: Omit<RequestOptions, 'method' | 'body'>
    ) => {
      return await apiClient.upload<T>(endpoint, formData, options)
    },
    []
  )

  return {
    get,
    post,
    put,
    delete: del,
    patch,
    upload,
  }
}
