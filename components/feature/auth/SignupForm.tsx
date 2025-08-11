import { Button, Input, Label } from '@/components/ui'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import type { FormEvent } from 'react'

interface SignupFormProps {
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
  translations: {
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    createPasswordPlaceholder: string
    confirmPasswordLabel: string
    confirmPasswordPlaceholder: string
    createAccountButton: string
    creatingAccountButton: string
  }
}

export function SignupForm({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isSubmitting,
  onSubmit,
  translations: t,
}: SignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">{t.emailLabel}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            type={showPassword ? 'text' : 'password'}
            placeholder={t.createPasswordPlaceholder}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pl-10 pr-10"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
  )
}
