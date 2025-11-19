'use client'

import { useState } from 'react'
import { Button, Badge, Input, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
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
  Key,
  Network,
  GitBranch,
  Copy,
} from 'lucide-react'
import { usePackage } from '@/context'
import { ThemeToggle } from '@/components/layout'
import { ApiKeysDialog } from '@/components/feature/auth'
import { PackageInfoDialog } from './PackageInfoDialog'
import { VersionInfoDialog } from './VersionInfoDialog'
import PackageGraphView from './PackageGraphView'

interface PackageDetailsViewProps {
  userEmail?: string
  onLogout?: () => void
}

export default function PackageDetailsView({
  userEmail,
  onLogout,
}: PackageDetailsViewProps) {
  const { packageDetails, setIsViewingPackage, packageNodeType } = usePackage()
  const [sortBy, setSortBy] = useState<'semver' | 'vulnerabilities' | 'score'>('semver')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [apiKeysOpen, setApiKeysOpen] = useState(false)
  const [packageInfoOpen, setPackageInfoOpen] = useState(false)
  const [graphOpen, setGraphOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!packageDetails) return null

  const getSeverityColor = (score: number) => {
    if (score >= 4) return 'bg-red-500'
    if (score >= 3) return 'bg-orange-500'
    if (score >= 2) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getSeverityLabel = (score: number) => {
    if (score >= 4) return 'Critical'
    if (score >= 3) return 'High'
    if (score >= 2) return 'Medium'
    return 'Low'
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
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="font-bold text-sm sm:text-base">
                  Package Details
                </span>
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
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setApiKeysOpen(true)}
                  variant="outline"
                  size="sm"
                  className="px-2 sm:px-3"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground hidden md:inline">
                  Manage API Keys
                </span>
              </div>
              {onLogout && (
                <Button onClick={onLogout} variant="outline" size="sm" className="px-2 sm:px-3">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {packageDetails.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setPackageInfoOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Network className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      Package Info
                    </span>
                    <span className="sm:hidden">Info</span>
                  </Button>

                  <Button
                    onClick={() => setGraphOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M7.6 7.6L11 16" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M13 16L16.4 7.6" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    <span className="hidden sm:inline">Graph</span>
                    <span className="sm:hidden">G</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">PURL</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all">
                      {packageDetails.purl}
                    </code>
                    <button
                      onClick={() => {
                        const purl = packageDetails.purl
                        navigator.clipboard?.writeText(purl)
                        setCopiedId('package')
                        setTimeout(() => setCopiedId(null), 2000)
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 relative"
                      title="Copy PURL"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedId === 'package' && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-semibold">{packageDetails.vendor || 'n/a'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Versions</p>
                  <p className="font-semibold">{packageDetails.versions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(packageDetails.moment).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <p className="text-sm text-muted-foreground">
                    Repository URL
                  </p>
                  {packageDetails.repository_url ? (
                    <a
                      href={packageDetails.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm break-all"
                    >
                      {packageDetails.repository_url}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sort Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-base sm:text-lg">
                  Versions ({sortedVersions.length}{' '}
                  of {packageDetails.versions.length})
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-3 py-2 text-sm border rounded-md bg-background min-w-0 flex-1 sm:flex-none sm:min-w-[180px]"
                  >
                    <option value="semver">Semver</option>
                    <option value="vulnerabilities">
                      Vulnerabilities
                    </option>
                    <option value="score">Score</option>
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
                        <span className="hidden sm:inline">Ascending</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4" />
                        <span className="hidden sm:inline">Descending</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search versions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchTerm && sortedVersions.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No versions found matching &quot;{searchTerm}&quot;
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
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          v{version.name}
                        </Badge>
                        <Badge className={`text-white ${getSeverityColor(version.weighted_mean)}`}>
                          {getSeverityLabel(version.weighted_mean)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">PURL</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all">
                          {version.purl}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(version.purl)
                            setCopiedId(version.purl)
                            setTimeout(() => setCopiedId(null), 2000)
                          }}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1 relative flex-shrink-0"
                          title="Copy version PURL"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedId === version.purl && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setSelectedVersion(version.name)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <GitBranch className="h-3 w-3" />
                          <span className="hidden sm:inline">
                            Version Info
                          </span>
                          <span className="sm:hidden">Info</span>
                        </Button>
                        <span className="text-xs text-muted-foreground hidden md:inline">
                          Analyze dependencies for this version
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {version.release_date
                          ? `Release Date: ${new Date(version.release_date).toLocaleDateString()}`
                          : 'No date'}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Hash className="h-3 w-3" />
                        Serial: {version.serial_number}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Weighted Mean
                      </p>
                      <p className="text-lg font-semibold">{version.weighted_mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mean Score</p>
                      <p className="text-lg font-semibold">{version.mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vulnerabilities
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
                        Vulnerabilities:
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

      <ApiKeysDialog open={apiKeysOpen} onOpenChange={setApiKeysOpen} />

      {packageNodeType && (
        <PackageInfoDialog
          open={packageInfoOpen}
          onOpenChange={setPackageInfoOpen}
          packageName={packageDetails.name}
          nodeType={packageNodeType}
        />
      )}

      {packageNodeType && (
        <PackageGraphView
          open={graphOpen}
          onOpenChange={setGraphOpen}
          packageName={packageDetails.name}
          purl={packageDetails.purl}
          nodeType={packageNodeType}
        />
      )}

      {packageNodeType && (
        <VersionInfoDialog
          open={selectedVersion !== null}
          onOpenChange={open => !open && setSelectedVersion(null)}
          packageName={packageDetails.name}
          versionName={selectedVersion || undefined}
          nodeType={packageNodeType}
        />
      )}
    </div>
  )
}
