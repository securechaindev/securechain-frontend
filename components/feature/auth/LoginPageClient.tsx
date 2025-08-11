'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/auth'
import { AuthHeader, AuthLoading, AuthTabs, UseLoginForm } from '@/components/feature/auth'

interface LoginPageClientProps {
  locale: 'en' | 'es'
  translations: {
    authDemoTitle: string
    authDemoDescription: string
    authLoading: string
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
    backToLanding: string
  }
}

export default function LoginPageClient({ locale, translations: t }: LoginPageClientProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthState()

  const formHook = UseLoginForm({ locale, translations: t })

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(`/${locale}/home`)
    }
  }, [isAuthenticated, isLoading, locale, router])

  if (isLoading) {
    return <AuthLoading message={t.authLoading} />
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
