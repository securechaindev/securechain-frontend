import { Button, Input, Label } from '@/components/ui'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import type { FormEvent } from 'react'

interface LoginFormProps {
  email: string
  setEmail: (_email: string) => void
  password: string
  setPassword: (_password: string) => void
  showPassword: boolean
  setShowPassword: (_show: boolean) => void
  isSubmitting: boolean
  onSubmit: (_e: FormEvent) => void
  translations: {
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    passwordPlaceholder: string
    loginButton: string
    loggingInButton: string
  }
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isSubmitting,
  onSubmit,
  translations: t,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm font-medium">
          {t.emailLabel}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="pl-10 h-11 sm:h-12 text-base"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-sm font-medium">
          {t.passwordLabel}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-10 pr-12 h-11 sm:h-12 text-base"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full h-11 sm:h-12 text-base font-medium"
        disabled={isSubmitting}
      >
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
  )
}
