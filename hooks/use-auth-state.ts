'use client'
import { useState, useEffect } from 'react'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  email: string | null
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    email: null,
  })

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check_token', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: data.user_id || localStorage.getItem('user_id'),
          email: localStorage.getItem('user_email'),
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          email: null,
        })
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_email')
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        email: null,
      })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok && data.code === 'success') {
        localStorage.setItem('user_id', data.user_id)
        localStorage.setItem('user_email', email)
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: data.user_id,
          email: email,
        })

        return { success: true, data }
      } else {
        return { success: false, error: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_email')
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        email: null,
      })
    }
  }

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    const response = await fetch(url, defaultOptions)

    if (response.status === 401) {
      const refreshResponse = await fetch('/api/auth/refresh_token', {
        method: 'POST',
        credentials: 'include',
      })

      if (refreshResponse.ok) {
        // Reintentar la request original
        return fetch(url, defaultOptions)
      } else {
        // Si no se puede refrescar, hacer logout
        await logout()
        throw new Error('Authentication expired')
      }
    }

    return response
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    authenticatedFetch,
  }
}
