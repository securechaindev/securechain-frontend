'use client'
import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '@/constants'
import { authAPI } from '@/lib/api'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  email: string | null
}

export function useAuthState() {
  const [isClient, setIsClient] = useState(false)
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    email: null,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkToken()

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        userId: response.data.user_id || localStorage.getItem(STORAGE_KEYS.USER_ID),
        email: localStorage.getItem(STORAGE_KEYS.USER_EMAIL),
      })
    } catch (error) {
      console.error('Error checking auth status:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        email: null,
      })
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
    }
  }

  const login = async (email: string, password: string) => {
    if (!isClient || typeof window === 'undefined') {
      return { success: false, error: 'Login must be called after client hydration' }
    }

    try {
      const response = await authAPI.login({ email, password })
      const data = response.data

      const isSuccess =
        response.ok && data.code === 'login_success' && response.status === 200 && data.user_id

      if (isSuccess) {
        localStorage.setItem(STORAGE_KEYS.USER_ID, data.user_id)
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: data.user_id,
          email: email,
        })

        return { success: true, data }
      } else {
        return {
          success: false,
          error: data.message || data.detail || data.error || 'Credenciales inválidas',
        }
      }
    } catch (error: any) {
      console.error('Error de red en login:', error)
      return {
        success: false,
        error: error.message || 'Error de conexión',
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        email: null,
      })
    }
  }

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (response.status === 401) {
        await logout()
        throw new Error('Authentication expired')
      }

      return response
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication expired') {
        throw error
      }

      throw error
    }
  }

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      checkAuthStatus()
    }
  }, [isClient])

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    authenticatedFetch,
  }
}
