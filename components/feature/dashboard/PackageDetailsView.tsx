'use client'

import { useState } from 'react'
import {
  Button,
  Badge,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  Calendar,
  Hash,
  TrendingUp,
  TrendingDown,
  Search,
  User,
  LogOut,
} from 'lucide-react'
import { usePackage } from '@/context'
import { ThemeToggle, LanguageToggle } from '@/components/layout'

interface PackageDetailsViewProps {
  translations: Record<string, any>
  locale: 'en' | 'es'
  onLocaleChange?: (_locale: 'en' | 'es') => void
  userEmail?: string
  onLogout?: () => void
}

export default function PackageDetailsView({
  translations,
  locale,
  onLocaleChange,
  userEmail,
  onLogout,
}: PackageDetailsViewProps) {
  const { packageDetails, setIsViewingPackage } = usePackage()
  const [sortBy, setSortBy] = useState<'semver' | 'vulnerabilities' | 'score'>('semver')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')

  if (!packageDetails) return null

  const getSeverityColor = (score: number) => {
    if (score >= 4) return 'bg-red-500'
    if (score >= 3) return 'bg-orange-500'
    if (score >= 2) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getSeverityLabel = (score: number) => {
    if (score >= 4) return translations.docs.critical
    if (score >= 3) return translations.docs.high
    if (score >= 2) return translations.docs.medium
    return translations.docs.low
  }

  const sortedVersions = packageDetails.versions
    .filter(
      version => searchTerm === '' || version.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let compareValue = 0

      switch (sortBy) {
        case 'semver':
          const serialA = a.serial_number || 0
          const serialB = b.serial_number || 0
          compareValue = serialA - serialB
          break
        case 'vulnerabilities':
          compareValue = a.vulnerabilities.length - b.vulnerabilities.length
          break
        case 'score':
          compareValue = a.weighted_mean - b.weighted_mean
          break
      }

      return sortOrder === 'asc' ? compareValue : -compareValue
    })

  const handleClose = () => {
    setIsViewingPackage(false)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{translations.docs.packageBackToHome}</span>
              </Button>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="font-bold text-sm sm:text-base">{translations.docs.packageDetailsTitle}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {userEmail && (
                <Badge variant="secondary" className="gap-1 text-xs sm:text-sm hidden sm:flex">
                  <User className="h-3 w-3" />
                  <span className="hidden md:inline">{userEmail}</span>
                  <span className="md:hidden">{userEmail.split('@')[0]}</span>
                </Badge>
              )}
              <LanguageToggle currentLang={locale} />
              <ThemeToggle />
              {onLogout && (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="px-2 sm:px-3"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{translations.logoutButton}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Package Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {packageDetails.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{translations.docs.vendor}</p>
                  <p className="font-semibold">{packageDetails.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{translations.docs.importName}</p>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {packageDetails.import_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{translations.docs.totalVersions}</p>
                  <p className="font-semibold">{packageDetails.versions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{translations.docs.lastUpdated}</p>
                  <p className="text-sm">{new Date(packageDetails.moment).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sort Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-base sm:text-lg">
                  {translations.docs.versions} ({sortedVersions.length}{' '}
                  {translations.docs.versionsOf} {packageDetails.versions.length})
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-3 py-2 text-sm border rounded-md bg-background min-w-0 flex-1 sm:flex-none sm:min-w-[180px]"
                  >
                    <option value="semver">{translations.docs.sortBySemver}</option>
                    <option value="vulnerabilities">
                      {translations.docs.sortByVulnerabilities}
                    </option>
                    <option value="score">{translations.docs.sortByScore}</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center justify-center gap-2 py-2 px-3 min-w-[100px]"
                  >
                    {sortOrder === 'asc' ? (
                      <>
                        <TrendingUp className="h-4 w-4" />
                        <span className="hidden sm:inline">{translations.docs.sortAscending}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4" />
                        <span className="hidden sm:inline">{translations.docs.sortDescending}</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={translations.docs.searchVersions}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchTerm && sortedVersions.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {translations.docs.noVersionsFound} &quot;{searchTerm}&quot;
                  </p>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Versions List */}
          <div className="space-y-4">
            {sortedVersions?.map((version, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        v{version.name}
                      </Badge>
                      <Badge className={`text-white ${getSeverityColor(version.weighted_mean)}`}>
                        {getSeverityLabel(version.weighted_mean)}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {version.release_date ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(version.release_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {translations.docs.noDate}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Hash className="h-3 w-3" />
                        {translations.docs.serial}: {version.serial_number}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {translations.docs.weightedMean}
                      </p>
                      <p className="text-lg font-semibold">{version.weighted_mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{translations.docs.meanScore}</p>
                      <p className="text-lg font-semibold">{version.mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {translations.docs.vulnerabilities}
                      </p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        {version.vulnerabilities.length}
                      </p>
                    </div>
                  </div>

                  {version.vulnerabilities.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {translations.docs.vulnerabilities}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {version.vulnerabilities.map((vuln, vulnIndex) => (
                          <Badge
                            key={vulnIndex}
                            variant="destructive"
                            className="text-xs cursor-pointer hover:bg-destructive/80 transition-colors"
                            onClick={() =>
                              window.open(`https://osv.dev/vulnerability/${vuln}`, '_blank')
                            }
                          >
                            {vuln}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
