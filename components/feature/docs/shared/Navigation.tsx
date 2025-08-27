import { ThemeToggle, LanguageToggle } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'

interface NavigationProps {
  t: any
  locale: Locale
}

export const Navigation: React.FC<NavigationProps> = ({ t, locale }) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link
              href={`/${locale}`}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:inline">{t.docs.backToHome}</span>
              <span className="sm:hidden">{t.docs.back}</span>
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src="/images/securechain-logo.ico"
                alt="Secure Chain Logo"
                width={32}
                height={32}
                className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
              />
              <span className="font-bold text-sm sm:text-base truncate">
                <span className="hidden md:inline">{t.appName}</span>
                <span className="md:hidden">{t.appNameShort}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageToggle currentLang={locale} />
          </div>
        </div>
      </div>
    </nav>
  )
}
