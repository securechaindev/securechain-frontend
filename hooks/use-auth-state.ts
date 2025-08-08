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
      console.log('=== useAuthState checkAuthStatus START ===')
      const response = await fetch('/api/auth/check_token', {
        method: 'GET',
        credentials: 'include',
      })

      console.log('checkAuthStatus response:', {
        ok: response.ok,
        status: response.status,
        url: response.url
      })

      if (response.ok) {
        const data = await response.json()
        console.log('checkAuthStatus SUCCESS, setting authenticated state')
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: data.user_id || localStorage.getItem('user_id'),
          email: localStorage.getItem('user_email'),
        })
      } else {
        console.log('checkAuthStatus FAILED, clearing localStorage:', {
          status: response.status,
          current_localStorage: {
            access_token: localStorage.getItem('access_token') ? 'EXISTS' : 'NULL',
            user_id: localStorage.getItem('user_id') ? 'EXISTS' : 'NULL',
            user_email: localStorage.getItem('user_email') ? 'EXISTS' : 'NULL'
          }
        })
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          email: null,
        })
        // Limpiar localStorage si el token no es válido
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_email')
        console.log('localStorage cleared by useAuthState')
      }
      console.log('=== useAuthState checkAuthStatus END ===')
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
      console.log('=== useAuthState LOGIN START ===')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()
      console.log('Login response:', {
        ok: response.ok,
        status: response.status,
        has_access_token: !!data.access_token,
        has_user_id: !!data.user_id
      })

      if (response.ok && data.access_token) {
        // Guardar solo información no sensible en localStorage
        localStorage.setItem('user_id', data.user_id)
        localStorage.setItem('user_email', email)
        console.log('Login SUCCESS, localStorage set:', {
          user_id: data.user_id,
          email: email
        })
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: data.user_id,
          email: email,
        })

        console.log('=== useAuthState LOGIN SUCCESS END ===')
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
      // Limpiar estado local
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

  // Función para hacer requests autenticadas
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

    // Si el token expiró, intentar refrescar automáticamente
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
