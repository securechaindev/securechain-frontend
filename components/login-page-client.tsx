'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useAuthState } from '@/hooks/use-auth-state'
import { Eye, EyeOff, Lock, Mail, Shield, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import Link from 'next/link'

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

    // Welcome section
    welcomeTitle: string
    welcomeDescription: string
    logoutButton: string
    authenticatedStatus: string
    sessionActiveStatus: string
    userIdLabel: string
    tokenActiveLabel: string
    jwtSecuredLabel: string

    // Auth features
    checkAccountTitle: string
    checkAccountDescription: string
    emailAddressLabel: string
    emailAddressPlaceholder: string
    checkAccountButton: string
    checkingButton: string

    changePasswordTitle: string
    changePasswordDescription: string
    currentPasswordLabel: string
    currentPasswordPlaceholder: string
    newPasswordLabel: string
    newPasswordPlaceholder: string
    changePasswordButton: string
    changingPasswordButton: string

    tokenVerificationTitle: string
    tokenVerificationDescription: string
    jwtTokenLabel: string
    jwtTokenPlaceholder: string
    jwtTokenHelperText: string
    verifyTokenButton: string
    verifyingTokenButton: string

    refreshTokenTitle: string
    refreshTokenDescription: string
    currentTokenLabel: string
    refreshTokenButton: string
    refreshingTokenButton: string

    // API section
    apiEndpointsTitle: string
    apiEndpointsDescription: string
    createAccountEndpoint: string
    userAuthEndpoint: string
    endSessionEndpoint: string
    checkAccountEndpoint: string
    updatePasswordEndpoint: string
    verifyJwtEndpoint: string
    renewAccessEndpoint: string

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
  const { toast } = useToast()
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuthState()

  // Form states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI states
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  // Check if user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // User is already logged in, redirect to home
      router.push(`/${locale}/home`)
    }
  }, [isAuthenticated, isLoading, locale, router])

  const handleLogin = async (e: React.FormEvent) => {
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

        // Redirect to home page
        router.push(`/${locale}/home`)
      } else {
        toast({
          title: t.loginFailedTitle,
          description: result.error || t.invalidCredentialsError,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t.loginErrorTitle,
        description: t.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
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

    // Simulate signup delay
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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.backToLanding}
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold">Secure Chain Beta</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle currentLang={locale} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                {t.authDemoTitle}
              </CardTitle>
              <CardDescription>{t.authDemoDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{t.loginTab}</TabsTrigger>
                  <TabsTrigger value="signup">{t.signupTab}</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">{t.emailLabel}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder={t.emailPlaceholder}
                          value={loginEmail}
                          onChange={e => setLoginEmail(e.target.value)}
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">{t.passwordLabel}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder={t.passwordPlaceholder}
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          className="pl-10 pr-10"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          {t.loggingInButton}
                        </>
                      ) : (
                        t.loginButton
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t.emailLabel}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder={t.emailPlaceholder}
                          value={signupEmail}
                          onChange={e => setSignupEmail(e.target.value)}
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t.passwordLabel}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? 'text' : 'password'}
                          placeholder={t.createPasswordPlaceholder}
                          value={signupPassword}
                          onChange={e => setSignupPassword(e.target.value)}
                          className="pl-10 pr-10"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{t.confirmPasswordLabel}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={t.confirmPasswordPlaceholder}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          {t.creatingAccountButton}
                        </>
                      ) : (
                        t.createAccountButton
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
