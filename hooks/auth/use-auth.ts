'use client'

import { useCallback } from 'react'
import { authenticatedFetch, checkAuthStatus, isTokenExpired } from '@/lib/auth/auth'
import { authAPI, apiClient } from '@/lib/api'

export function useAuth() {
  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    return authenticatedFetch(url, options)
  }, [])

  const makeApiRequest = useCallback(async (endpoint: string, options: any = {}) => {
    try {
      return await apiClient.request(endpoint, options)
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }, [])

  const checkAuth = useCallback(async () => {
    return checkAuthStatus()
  }, [])

  const checkTokenExpiry = useCallback(async () => {
    return isTokenExpired()
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      window.location.href = '/login'
    }
  }, [])

  return {
    makeAuthenticatedRequest,
    makeApiRequest,
    checkAuth,
    checkTokenExpiry,
    logout,
  }
}
