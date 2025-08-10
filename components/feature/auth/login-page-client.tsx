'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/use-auth-state'
import { AuthHeader, AuthLoading, AuthTabs, useLoginForm } from '@/components/feature/auth'

interface LoginPageClientProps {
  locale: 'en' | 'es'
  translations: {
    // Auth form translations
    authDemoTitle: string
    authDemoDescription: string
    loginTab: string
    signupTab: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    confirmPasswordLabel: string
    confirmPasswordPlaceholder: string
    createPasswordPlaceholder: string
    loginButton: string
    loggingInButton: string
    createAccountButton: string
    creatingAccountButton: string

    // Toast messages
    errorTitle: string
    fillAllFieldsError: string
    passwordMismatchTitle: string
    passwordMismatchError: string
    loginSuccessTitle: string
    loginSuccessDescription: string
    loginFailedTitle: string
    invalidCredentialsError: string
    loginErrorTitle: string
    networkErrorDescription: string
    signupErrorTitle: string
    accountCreatedTitle: string
    accountCreatedDescription: string
    signupFailedTitle: string
    createAccountFailedError: string
    loggedOutTitle: string
    loggedOutDescription: string
    logoutErrorTitle: string
    logoutErrorDescription: string
    enterEmailError: string
    checkFailedTitle: string
    accountFoundTitle: string
    accountNotFoundTitle: string
    passwordChangedTitle: string
    passwordChangedDescription: string
    passwordChangeFailedTitle: string
    passwordChangeErrorTitle: string
    enterTokenError: string
    tokenCheckErrorTitle: string
    tokenValidTitle: string
    tokenInvalidTitle: string
    tokenRefreshedTitle: string
    tokenRefreshedDescription: string
    refreshFailedTitle: string
    refreshErrorTitle: string

    // Back to landing
    backToLanding: string
  }
}

export default function LoginPageClient({ locale, translations: t }: LoginPageClientProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthState()

  // Use custom hook for form logic
  const formHook = useLoginForm({ locale, translations: t })

  // Check if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // User is already logged in, redirect to home
      router.push(`/${locale}/home`)
    }
  }, [isAuthenticated, isLoading, locale, router])

  // Show loading screen while checking authentication
  if (isLoading) {
    return <AuthLoading />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader locale={locale} backToLanding={t.backToLanding} />

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
          translations={t}
        />
      </div>
    </div>
  )
}
