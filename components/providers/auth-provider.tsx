'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { checkAuthStatus } from '@/lib/auth/auth'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  setIsAuthenticated: (_value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus()
        setIsAuthenticated(authStatus.isAuthenticated && authStatus.tokenValid)
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    setIsAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
