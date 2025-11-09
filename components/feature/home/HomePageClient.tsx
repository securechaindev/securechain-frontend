'use client'

import { PackageDetailsView } from '@/components/feature/depex'
import { LoadingSpinner } from '@/components/ui'
import AuthRedirect from './AuthRedirect'
import HomeHeader from './HomeHeader'
import HomeTabs from './HomeTabs'
import { usePackage } from '@/context'
import { useHomeAuth } from '@/hooks/auth'
import { useLocalization } from '@/hooks/utils'

interface HomePageClientProps {
  locale: 'en' | 'es'
  translations: Record<string, any>
}

export default function HomePageClient({ locale, translations: t }: HomePageClientProps) {
  const { isAuthenticated, user, loading, isSubmitting, handleLogout } = useHomeAuth(locale)
  const { currentLocale, currentTranslations, handleLocaleChange } = useLocalization(locale, t)
  const { isViewingPackage } = usePackage()

  if (loading) {
    return <LoadingSpinner message={t.loadingDashboard} />
  }

  if (!isAuthenticated) {
    return <AuthRedirect locale={locale} translations={t} />
  }

  // Show package details view if viewing package
  if (isViewingPackage) {
    return (
      <PackageDetailsView
        translations={currentTranslations}
        locale={currentLocale}
        onLocaleChange={handleLocaleChange}
        userEmail={user?.email}
        onLogout={() => handleLogout(currentTranslations)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader
        user={user}
        locale={locale}
        translations={currentTranslations}
        isSubmitting={isSubmitting}
        onLocaleChange={handleLocaleChange}
        onLogout={() => handleLogout(currentTranslations)}
      />
      <HomeTabs user={user} translations={currentTranslations} />
    </div>
  )
}
