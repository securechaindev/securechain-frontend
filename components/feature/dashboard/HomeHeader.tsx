import Link from 'next/link'
import { Button, Badge } from '@/components/ui'
import { ThemeToggle, LanguageToggle } from '@/components/layout'
import {
  User,
  Shield,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import type { User as UserType } from '@/types'

interface HomeHeaderProps {
  user: UserType | null
  locale: 'en' | 'es'
  translations: Record<string, any>
  isSubmitting: boolean
  onLocaleChange: (locale: 'en' | 'es') => void
  onLogout: () => void
}

export default function HomeHeader({
  user,
  locale,
  translations,
  isSubmitting,
  onLocaleChange,
  onLogout
}: HomeHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {translations.backToLanding}
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold">{translations.depexPageTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <User className="h-3 w-3" />
              {user?.email}
            </Badge>
            <LanguageToggle currentLang={locale} />
            <ThemeToggle />
            <Button onClick={onLogout} variant="outline" size="sm" disabled={isSubmitting}>
              <LogOut className="h-4 w-4 mr-2" />
              {translations.logoutButton}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
