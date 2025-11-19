'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/auth'
import { AuthHeader, AuthLoading, AuthTabs, UseLoginForm } from '@/components/feature/auth'

export default function LoginPageClient() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthState()

  const formHook = UseLoginForm()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/home')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <AuthLoading message="Verifying authentication..." />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      <div className="container mx-auto px-4 py-8">
        <AuthTabs
          activeTab={formHook.activeTab}
          setActiveTab={formHook.setActiveTab}
          loginProps={{
            email: formHook.loginEmail,
            setEmail: formHook.setLoginEmail,
            password: formHook.loginPassword,
            setPassword: formHook.setLoginPassword,
            showPassword: formHook.showLoginPassword,
            setShowPassword: formHook.setShowLoginPassword,
            isSubmitting: formHook.isSubmitting,
            onSubmit: formHook.handleLogin,
          }}
          signupProps={{
            email: formHook.signupEmail,
            setEmail: formHook.setSignupEmail,
            password: formHook.signupPassword,
            setPassword: formHook.setSignupPassword,
            confirmPassword: formHook.confirmPassword,
            setConfirmPassword: formHook.setConfirmPassword,
            showPassword: formHook.showSignupPassword,
            setShowPassword: formHook.setShowSignupPassword,
            showConfirmPassword: formHook.showConfirmPassword,
            setShowConfirmPassword: formHook.setShowConfirmPassword,
            isSubmitting: formHook.isSubmitting,
            onSubmit: formHook.handleSignup,
          }}
        />
      </div>
    </div>
  )
}
