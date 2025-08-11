'use client'

import { useCallback } from 'react'
import { authenticatedFetch, checkAuthStatus, isTokenExpired } from '@/lib/auth/auth'
import { API_ENDPOINTS } from '@/constants'

export function useAuth() {
  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    return authenticatedFetch(url, options)
  }, [])

  const checkAuth = useCallback(async () => {
    return checkAuthStatus()
  }, [])

  const checkTokenExpiry = useCallback(async () => {
    return isTokenExpired()
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      window.location.href = '/login'
    }
  }, [])

  return {
    makeAuthenticatedRequest,
    checkAuth,
    checkTokenExpiry,
    logout,
  }
}
