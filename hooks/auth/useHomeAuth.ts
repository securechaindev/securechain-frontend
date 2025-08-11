'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/ui'
import { STORAGE_KEYS } from '@/constants'
import { authAPI } from '@/lib/api'
import type { User } from '@/types'

export function useHomeAuth(locale: 'en' | 'es') {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState('')

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID)
      const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)

      if (storedUserId && userEmail) {
        setUser({ id: storedUserId, email: userEmail })
        setUserId(storedUserId)
        setIsAuthenticated(true)
      } else {
        router.push(`/${locale}/login`)
      }
      setLoading(false)
    }

    checkAuth()
  }, [locale, router])

  const handleLogout = async (translations: Record<string, any>) => {
    setIsSubmitting(true)

    try {
      await authAPI.logout()

      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)

      setUser(null)
      setIsAuthenticated(false)

      toast({
        title: translations.loggedOutTitle,
        description: translations.loggedOutDescription,
      })

      router.push(`/${locale}/login`)
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
      setUser(null)
      setIsAuthenticated(false)

      router.push(`/${locale}/login`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isAuthenticated,
    user,
    loading,
    isSubmitting,
    userId,
    handleLogout,
    setIsSubmitting,
  }
}
