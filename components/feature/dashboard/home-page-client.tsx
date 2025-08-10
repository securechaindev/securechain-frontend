'use client'
import PackageDetailsView from './package-details-view'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AuthRedirect from './AuthRedirect'
import HomeHeader from './HomeHeader'
import HomeTabs from './HomeTabs'
import { usePackage } from '@/context/package-context'
import { useHomeAuth } from '@/hooks/useHomeAuth'
import { useLocalization } from '@/hooks/useLocalization'

interface HomePageClientProps {
  locale: 'en' | 'es'
  translations: Record<string, any>
}

export default function HomePageClient({ locale, translations: t }: HomePageClientProps) {
  const { isAuthenticated, user, loading, isSubmitting, userId, handleLogout } = useHomeAuth(locale)
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
      <HomeTabs 
        user={user}
        userId={userId}
        translations={currentTranslations}
      />
    </div>
  )
}
