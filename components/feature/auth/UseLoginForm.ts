'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/ui'
import { useAuthState } from '@/hooks/auth'


interface UseLoginFormProps {
  locale: 'en' | 'es'
  translations: {
    errorTitle: string
    fillAllFieldsError: string
    loginSuccessTitle: string
    loginSuccessDescription: string
    loginFailedTitle: string
    invalidCredentialsError: string
    loginErrorTitle: string
    networkErrorDescription: string
    passwordMismatchTitle: string
    passwordMismatchError: string
    accountCreatedTitle: string
    accountCreatedDescription: string
  }
}

export function UseLoginForm({ locale, translations: t }: UseLoginFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { login } = useAuthState()
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

      if (result.success) {
        toast({
          title: t.loginSuccessTitle,
          description: t.loginSuccessDescription,
        })

        setLoginEmail('')
        setLoginPassword('')

        router.push(`/${locale}/home`)
      } else {
        toast({
          title: t.loginFailedTitle,
          description: result.error || t.invalidCredentialsError,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: t.loginErrorTitle,
        description: t.networkErrorDescription,
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
      toast({
        title: t.passwordMismatchTitle,
        description: t.passwordMismatchError,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      toast({
        title: t.accountCreatedTitle,
        description: t.accountCreatedDescription,
      })
      setSignupEmail('')
      setSignupPassword('')
      setConfirmPassword('')
      setActiveTab('login')
      setIsSubmitting(false)
    }, 1000)
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
