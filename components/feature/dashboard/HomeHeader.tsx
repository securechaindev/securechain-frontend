import Link from 'next/link'
import { Button, Badge } from '@/components/ui'
import { ThemeToggle, LanguageToggle } from '@/components/layout'
import { User, Shield, LogOut, ArrowLeft } from 'lucide-react'
import type { User as UserType } from '@/types'

interface HomeHeaderProps {
  user: UserType | null
  locale: 'en' | 'es'
  translations: Record<string, any>
  isSubmitting: boolean
  onLocaleChange: (_locale: 'en' | 'es') => void
  onLogout: () => void
}

export default function HomeHeader({
  user,
  locale,
  translations,
  isSubmitting,
  onLogout,
}: HomeHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{translations.backToLanding}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="font-bold text-sm sm:text-base">{translations.depexPageTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm hidden sm:flex">
              <User className="h-3 w-3" />
              <span className="hidden md:inline">{user?.email}</span>
              <span className="md:hidden">{user?.email?.split('@')[0]}</span>
            </Badge>
            <LanguageToggle currentLang={locale} />
            <ThemeToggle />
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              className="px-2 sm:px-3"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{translations.logoutButton}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
