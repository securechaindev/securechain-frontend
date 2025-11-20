import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { KeyRound } from 'lucide-react'
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
}

export function AuthTabs({ activeTab, setActiveTab, loginProps, signupProps }: AuthTabsProps) {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <KeyRound className="h-6 w-6 text-primary" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <LoginForm {...loginProps} />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <SignupForm {...signupProps} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
