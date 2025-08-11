import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { Shield } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import type { FormEvent } from 'react'

interface AuthTabsProps {
  activeTab: string
  setActiveTab: (_tab: string) => void
  loginProps: {
    email: string
    setEmail: (_email: string) => void
    password: string
    setPassword: (_password: string) => void
    showPassword: boolean
    setShowPassword: (_show: boolean) => void
    isSubmitting: boolean
    onSubmit: (_e: FormEvent) => void
  }
  signupProps: {
    email: string
    setEmail: (_email: string) => void
    password: string
    setPassword: (_password: string) => void
    confirmPassword: string
    setConfirmPassword: (_password: string) => void
    showPassword: boolean
    setShowPassword: (_show: boolean) => void
    showConfirmPassword: boolean
    setShowConfirmPassword: (_show: boolean) => void
    isSubmitting: boolean
    onSubmit: (_e: FormEvent) => void
  }
  translations: {
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
  }
}

export function AuthTabs({
  activeTab,
  setActiveTab,
  loginProps,
  signupProps,
  translations: t,
}: AuthTabsProps) {
  return (
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
              <LoginForm
                {...loginProps}
                translations={{
                  emailLabel: t.emailLabel,
                  emailPlaceholder: t.emailPlaceholder,
                  passwordLabel: t.passwordLabel,
                  passwordPlaceholder: t.passwordPlaceholder,
                  loginButton: t.loginButton,
                  loggingInButton: t.loggingInButton,
                }}
              />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <SignupForm
                {...signupProps}
                translations={{
                  emailLabel: t.emailLabel,
                  emailPlaceholder: t.emailPlaceholder,
                  passwordLabel: t.passwordLabel,
                  createPasswordPlaceholder: t.createPasswordPlaceholder,
                  confirmPasswordLabel: t.confirmPasswordLabel,
                  confirmPasswordPlaceholder: t.confirmPasswordPlaceholder,
                  createAccountButton: t.createAccountButton,
                  creatingAccountButton: t.creatingAccountButton,
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
