'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/ui'
import { STORAGE_KEYS } from '@/constants'
import { authAPI } from '@/lib/api'
import type { User } from '@/types'

export function useHomeAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)

      if (userEmail) {
        setUser({ email: userEmail })
        setIsAuthenticated(true)
      } else {
        router.push('/login')
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    setIsSubmitting(true)

    try {
      await authAPI.logout()

      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)

      setUser(null)
      setIsAuthenticated(false)

      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      })

      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
      setUser(null)
      setIsAuthenticated(false)

      router.push('/login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    isSubmitting,
    handleLogout,
    setIsSubmitting,
  }
}
