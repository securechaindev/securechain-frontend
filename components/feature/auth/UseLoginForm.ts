'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/ui'
import { useAuthState } from '@/hooks/auth'
import { getErrorMessage, getSuccessMessage } from '@/lib/utils'

interface UseLoginFormProps {
  locale: 'en' | 'es'
  translations: {
    errorTitle: string
    fillAllFieldsError: string
    loginSuccessTitle: string
    loginFailedTitle: string
    loginErrorTitle: string
    accountCreatedTitle: string
    signupErrorTitle: string
    signupNetworkError: string
    authErrorDetails?: Record<string, string>
    authSuccessDetails?: Record<string, string>
    backendErrorDetails?: Record<string, string>
    depexErrorDetails?: Record<string, string>
    depexSuccessDetails?: Record<string, string>
  }
}

export function UseLoginForm({ locale, translations: t }: UseLoginFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { login, signup } = useAuthState()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    if (!loginEmail || !loginPassword) {
      toast({
        title: t.errorTitle,
        description: t.fillAllFieldsError,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login(loginEmail, loginPassword)

      if (result.success && result.code) {
        const successMessage = getSuccessMessage(result.code, t)

        toast({
          title: t.loginSuccessTitle,
          description: successMessage,
        })

        setLoginEmail('')
        setLoginPassword('')

        router.push(`/${locale}/home`)
      } else if (result.code) {
        const errorMessage = getErrorMessage(result.code, t)

        toast({
          title: t.loginFailedTitle,
          description: errorMessage,
          variant: 'destructive',
        })
      } else {
        toast({
          title: t.loginFailedTitle,
          description: getErrorMessage('unknown_error', t),
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: t.loginErrorTitle,
        description: getErrorMessage('network_error', t),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()

    if (!signupEmail || !signupPassword || !confirmPassword) {
      toast({
        title: t.errorTitle,
        description: t.fillAllFieldsError,
        variant: 'destructive',
      })
      return
    }

    if (signupPassword !== confirmPassword) {
      const errorMessage = getErrorMessage('password_mismatch', t)
      toast({
        title: t.errorTitle,
        description: errorMessage,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signup(signupEmail, signupPassword, confirmPassword)

      if (result.success && result.code) {
        const successMessage = getSuccessMessage(result.code, t)

        toast({
          title: t.accountCreatedTitle,
          description: successMessage,
        })

        setSignupEmail('')
        setSignupPassword('')
        setConfirmPassword('')

        router.push(`/${locale}/home`)
      } else if (result.code) {
        const errorMessage = getErrorMessage(result.code, t)

        toast({
          title: t.signupErrorTitle,
          description: errorMessage,
          variant: 'destructive',
        })
      } else {
        toast({
          title: t.signupErrorTitle,
          description: t.signupNetworkError,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: t.signupErrorTitle,
        description: t.signupNetworkError,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    confirmPassword,
    setConfirmPassword,
    showLoginPassword,
    setShowLoginPassword,
    showSignupPassword,
    setShowSignupPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmitting,
    activeTab,
    setActiveTab,
    handleLogin,
    handleSignup,
  }
}
