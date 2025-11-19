'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/ui'
import { useAuthState } from '@/hooks/auth'
import { getErrorMessage, getSuccessMessage } from '@/lib/utils'

export function UseLoginForm() {
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
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login(loginEmail, loginPassword)

      if (result.success && result.code) {
        const successMessage = getSuccessMessage(result.code)

        toast({
          title: 'Login Successful! ✅',
          description: successMessage,
        })

        setLoginEmail('')
        setLoginPassword('')

        router.push('/home')
      } else if (result.code) {
        const errorMessage = getErrorMessage(result.code)

        toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Login Failed',
          description: getErrorMessage('unknown_error'),
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Login Error',
        description: getErrorMessage('network_error'),
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
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
      return
    }

    if (signupPassword !== confirmPassword) {
      const errorMessage = getErrorMessage('password_mismatch')
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signup(signupEmail, signupPassword, confirmPassword)

      if (result.success && result.code) {
        const successMessage = getSuccessMessage(result.code)

        toast({
          title: 'Account Created! ✅',
          description: successMessage,
        })

        setSignupEmail('')
        setSignupPassword('')
        setConfirmPassword('')

        router.push('/home')
      } else if (result.code) {
        const errorMessage = getErrorMessage(result.code)

        toast({
          title: 'Signup Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Signup Error',
          description: 'Network error occurred',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: 'Signup Error',
        description: 'Network error occurred',
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
