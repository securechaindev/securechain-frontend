import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/layout'
import { LanguageToggle } from '@/components/layout'

interface AuthHeaderProps {
  locale: 'en' | 'es'
  backToLanding: string
}

export function AuthHeader({ locale, backToLanding }: AuthHeaderProps) {
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
              {backToLanding}
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
  )
}
