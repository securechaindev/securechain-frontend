'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  User,
  Shield,
  LogOut,
  ArrowLeft,
  Package,
  GitPullRequest,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import Link from 'next/link'

const GitHubIcon = dynamic(
  () => import('react-icons/si').then(mod => ({ default: mod.SiGithub })),
  {
    ssr: false,
    loading: () => <div className="h-4 w-4 animate-pulse bg-muted rounded" />,
  }
)

interface User {
  id: string
  email: string
}

interface HomePageClientProps {
  locale: 'en' | 'es'
  translations: {
    homeDashboardTitle: string
    homeDashboardDescription: string
    logoutButton: string
    authenticatedStatus: string
    sessionActiveStatus: string
    userIdLabel: string
    tokenActiveLabel: string
    jwtSecuredLabel: string
    backToLanding: string
    loggedOutTitle: string
    loggedOutDescription: string
    logoutErrorTitle: string
    logoutErrorDescription: string
    networkErrorDescription: string
    goToLoginTitle: string
    goToLoginDescription: string
    goToLoginButton: string
    loadingDashboard: string

    depexPageTitle: string
    repositoriesTab: string
    packagesTab: string
    initializationTab: string
    yourRepositoriesTitle: string
    yourRepositoriesDescription: string
    refreshRepositoriesButton: string
    noRepositoriesFound: string
    packageVersionStatusTitle: string
    checkPackageStatusTitle: string
    packageNameLabel: string
    packageNamePlaceholder: string
    checkPackageStatusButton: string
    checkVersionStatusTitle: string
    packageVersionLabel: string
    packageVersionPlaceholder: string
    checkVersionStatusButton: string
    initializeDataTitle: string
    initializeRepositoryTitle: string
    repositoryOwnerLabel: string
    repositoryOwnerPlaceholder: string
    repositoryNameLabel: string
    repositoryNamePlaceholder: string
    initializeRepositoryButton: string
    initializePackageTitle: string
    initPackageNamePlaceholder: string
    initializePackageButton: string
    initializeVersionTitle: string
    initPackageVersionPlaceholder: string
    initializeVersionButton: string
    repositoryInitialized: string
    packageInitialized: string
    versionInitialized: string
    packageStatus: string
    versionStatus: string
    loadingText: string
    errorTitle: string
  }
}

export default function HomePageClient({ locale, translations: t }: HomePageClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [userId, setUserId] = useState('')
  const [repoOwner, setRepoOwner] = useState('')
  const [repoName, setRepoName] = useState('')
  const [packageName, setPackageName] = useState('')
  const [packageVersion, setPackageVersion] = useState('')
  const [repoInitResult, setRepoInitResult] = useState<any>(null)
  const [packageStatusResult, setPackageStatusResult] = useState<any>(null)
  const [versionStatusResult, setVersionStatusResult] = useState<any>(null)
  const [packageInitResult, setPackageInitResult] = useState<any>(null)
  const [versionInitResult, setVersionInitResult] = useState<any>(null)
  const [userRepositories, setUserRepositories] = useState<any[]>([])
  const [depexLoading, setDepexLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const fetchUserRepositories = useCallback(async () => {
    if (!userId) return

    setDepexLoading(true)
    try {
      const response = await fetch(`/api/depex/repositories/${userId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (response.ok) {
        setUserRepositories(data.repositories || [])
      } else {
        toast({
          title: t.errorTitle,
          description: data.error || 'Failed to fetch user repositories',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: t.errorTitle,
        description: error.message || t.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }, [userId, t, toast])

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('user_id')
      const userEmail = localStorage.getItem('user_email')

      if (userId && userEmail) {
        setUser({ id: userId, email: userEmail })
        setUserId(userId)
        setIsAuthenticated(true)
      } else {
        router.push(`/${locale}/login`)
      }
      setLoading(false)
    }

    checkAuth()
  }, [locale, router])

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserRepositories()
    }
  }, [isAuthenticated, userId, fetchUserRepositories])

  const handleLogout = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      localStorage.removeItem('user_id')
      localStorage.removeItem('user_email')

      setUser(null)
      setIsAuthenticated(false)

      toast({
        title: t.loggedOutTitle,
        description: t.loggedOutDescription,
      })

      router.push(`/${locale}/login`)
      
    } catch (error) {
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_email')
      setUser(null)
      setIsAuthenticated(false)
      
      router.push(`/${locale}/login`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRepoInit = async () => {
    setDepexLoading(true)
    setRepoInitResult(null)
    try {
      const response = await fetch('/api/depex/repository/init', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner: repoOwner, name: repoName, user_id: userId }),
      })
      const data = await response.json()
      setRepoInitResult(data)
      if (response.ok) {
        toast({
          title: t.repositoryInitialized,
          description: data.message,
        })
        fetchUserRepositories()
      } else {
        toast({
          title: t.errorTitle,
          description: data.error || 'Failed to initialize repository',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: t.errorTitle,
        description: error.message || t.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  const handlePackageStatus = async () => {
    setDepexLoading(true)
    setPackageStatusResult(null)
    try {
      const response = await fetch(
        `/api/depex/package/status?userId=${userId}&packageName=${packageName}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      setPackageStatusResult(data)
      if (response.ok) {
        toast({
          title: t.packageStatus,
          description: data.message,
        })
      } else {
        toast({
          title: t.errorTitle,
          description: data.error || 'Failed to get package status',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: t.errorTitle,
        description: error.message || t.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  const handleVersionStatus = async () => {
    setDepexLoading(true)
    setVersionStatusResult(null)
    try {
      const response = await fetch(
        `/api/depex/version/status?userId=${userId}&packageName=${packageName}&version=${packageVersion}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      setVersionStatusResult(data)
      if (response.ok) {
        toast({
          title: t.versionStatus,
          description: data.message,
        })
      } else {
        toast({
          title: t.errorTitle,
          description: data.error || 'Failed to get version status',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: t.errorTitle,
        description: error.message || t.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  const handlePackageInit = async () => {
    setDepexLoading(true)
    setPackageInitResult(null)
    try {
      const response = await fetch('/api/depex/package/init', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, packageName }),
      })
      const data = await response.json()
      setPackageInitResult(data)
      if (response.ok) {
        toast({
          title: t.packageInitialized,
          description: data.message,
        })
      } else {
        toast({
          title: t.errorTitle,
          description: data.error || 'Failed to initialize package',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: t.errorTitle,
        description: error.message || t.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  const handleVersionInit = async () => {
    setDepexLoading(true)
    setVersionInitResult(null)
    try {
      const response = await fetch('/api/depex/version/init', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, packageName, version: packageVersion }),
      })
      const data = await response.json()
      setVersionInitResult(data)
      if (response.ok) {
        toast({
          title: t.versionInitialized,
          description: data.message,
        })
      } else {
        toast({
          title: t.errorTitle,
          description: data.error || 'Failed to initialize version',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: t.errorTitle,
        description: error.message || t.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t.loadingDashboard}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              {t.goToLoginTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t.goToLoginDescription}</p>
            <Button asChild className="w-full">
              <Link href={`/${locale}/login`}>{t.goToLoginButton}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.backToLanding}
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold">{t.depexPageTitle}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <User className="h-3 w-3" />
                {user?.email}
              </Badge>
              <LanguageToggle currentLang={locale} />
              <ThemeToggle />
              <Button onClick={handleLogout} variant="outline" size="sm" disabled={isSubmitting}>
                <LogOut className="h-4 w-4 mr-2" />
                {t.logoutButton}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="repositories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="repositories">
                <GitHubIcon className="h-4 w-4 mr-2" /> {t.repositoriesTab}
              </TabsTrigger>
              <TabsTrigger value="packages">
                <Package className="h-4 w-4 mr-2" /> {t.packagesTab}
              </TabsTrigger>
              <TabsTrigger value="initialization">
                <GitPullRequest className="h-4 w-4 mr-2" /> {t.initializationTab}
              </TabsTrigger>
            </TabsList>

            {/* Repositories Tab */}
            <TabsContent value="repositories" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitHubIcon className="h-5 w-5" /> {t.yourRepositoriesTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.yourRepositoriesDescription}{' '}
                    <span className="font-semibold">{user?.email}</span>
                  </p>
                  <Button onClick={fetchUserRepositories} disabled={depexLoading} className="mb-4">
                    {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t.refreshRepositoriesButton}
                  </Button>
                  {userRepositories.length === 0 && !depexLoading && (
                    <p className="text-muted-foreground">{t.noRepositoriesFound}</p>
                  )}
                  {userRepositories.length > 0 && (
                    <div className="grid gap-4">
                      {userRepositories.map((repo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <GitHubIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">
                              {repo.owner}/{repo.repo}
                            </span>
                          </div>
                          <Badge variant={repo.status === 'active' ? 'default' : 'secondary'}>
                            {repo.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" /> {t.packageVersionStatusTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t.checkPackageStatusTitle}</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="packageName">{t.packageNameLabel}</Label>
                      <Input
                        id="packageName"
                        value={packageName}
                        onChange={e => setPackageName(e.target.value)}
                        placeholder={t.packageNamePlaceholder}
                      />
                    </div>
                    <Button onClick={handlePackageStatus} disabled={depexLoading}>
                      {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.checkPackageStatusButton}
                    </Button>
                    {packageStatusResult && (
                      <div
                        className={`p-3 rounded-md flex items-center gap-2 ${packageStatusResult.exists ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                      >
                        {packageStatusResult.exists ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        <span>{packageStatusResult.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold">{t.checkVersionStatusTitle}</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="packageVersion">{t.packageVersionLabel}</Label>
                      <Input
                        id="packageVersion"
                        value={packageVersion}
                        onChange={e => setPackageVersion(e.target.value)}
                        placeholder={t.packageVersionPlaceholder}
                      />
                    </div>
                    <Button onClick={handleVersionStatus} disabled={depexLoading}>
                      {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.checkVersionStatusButton}
                    </Button>
                    {versionStatusResult && (
                      <div
                        className={`p-3 rounded-md flex items-center gap-2 ${versionStatusResult.exists ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                      >
                        {versionStatusResult.exists ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        <span>{versionStatusResult.message}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Initialization Tab */}
            <TabsContent value="initialization" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitPullRequest className="h-5 w-5" /> {t.initializeDataTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t.initializeRepositoryTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="repoOwner">{t.repositoryOwnerLabel}</Label>
                        <Input
                          id="repoOwner"
                          value={repoOwner}
                          onChange={e => setRepoOwner(e.target.value)}
                          placeholder={t.repositoryOwnerPlaceholder}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="repoName">{t.repositoryNameLabel}</Label>
                        <Input
                          id="repoName"
                          value={repoName}
                          onChange={e => setRepoName(e.target.value)}
                          placeholder={t.repositoryNamePlaceholder}
                        />
                      </div>
                    </div>
                    <Button onClick={handleRepoInit} disabled={depexLoading}>
                      {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.initializeRepositoryButton}
                    </Button>
                    {repoInitResult && (
                      <div
                        className={`p-3 rounded-md flex items-center gap-2 ${repoInitResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                      >
                        {repoInitResult.success ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        <span>{repoInitResult.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold">{t.initializePackageTitle}</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="initPackageName">{t.packageNameLabel}</Label>
                      <Input
                        id="initPackageName"
                        value={packageName}
                        onChange={e => setPackageName(e.target.value)}
                        placeholder={t.initPackageNamePlaceholder}
                      />
                    </div>
                    <Button onClick={handlePackageInit} disabled={depexLoading}>
                      {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.initializePackageButton}
                    </Button>
                    {packageInitResult && (
                      <div
                        className={`p-3 rounded-md flex items-center gap-2 ${packageInitResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                      >
                        {packageInitResult.success ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        <span>{packageInitResult.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold">{t.initializeVersionTitle}</h3>
                    <div className="grid gap-2">
                      <Label htmlFor="initPackageVersion">{t.packageVersionLabel}</Label>
                      <Input
                        id="initPackageVersion"
                        value={packageVersion}
                        onChange={e => setPackageVersion(e.target.value)}
                        placeholder={t.initPackageVersionPlaceholder}
                      />
                    </div>
                    <Button onClick={handleVersionInit} disabled={depexLoading}>
                      {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {t.initializeVersionButton}
                    </Button>
                    {versionInitResult && (
                      <div
                        className={`p-3 rounded-md flex items-center gap-2 ${versionInitResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                      >
                        {versionInitResult.success ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        <span>{versionInitResult.message}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
