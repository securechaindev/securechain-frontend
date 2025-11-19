'use client'

import { PackageDetailsView } from '@/components/feature/depex'
import { LoadingSpinner } from '@/components/ui'
import AuthRedirect from './AuthRedirect'
import HomeHeader from './HomeHeader'
import HomeTabs from './HomeTabs'
import { usePackage } from '@/context'
import { useHomeAuth } from '@/hooks/auth'

export default function HomePageClient() {
  const { isAuthenticated, user, loading, isSubmitting, handleLogout } = useHomeAuth()
  const { isViewingPackage } = usePackage()

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (!isAuthenticated) {
    return <AuthRedirect />
  }

  // Show package details view if viewing package
  if (isViewingPackage) {
    return (
      <PackageDetailsView
        userEmail={user?.email}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader
        user={user}
        isSubmitting={isSubmitting}
        onLogout={handleLogout}
      />
      <HomeTabs user={user} />
    </div>
  )
}
