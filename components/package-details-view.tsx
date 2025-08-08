'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  Calendar,
  Hash,
  TrendingUp,
  TrendingDown,
  X,
  Search,
} from 'lucide-react'
import { usePackage } from '@/contexts/package-context'

export function PackageDetailsView() {
  const { packageDetails, setIsViewingPackage } = usePackage()
  const [sortBy, setSortBy] = useState<'date' | 'vulnerabilities' | 'score'>('date')
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
        case 'date':
          const dateA = a.release_date ? new Date(a.release_date).getTime() : 0
          const dateB = b.release_date ? new Date(b.release_date).getTime() : 0
          compareValue = dateA - dateB
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
      <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                <span className="font-bold">Package Details</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
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
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-semibold">{packageDetails.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Import Name</p>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {packageDetails.import_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Versions</p>
                  <p className="font-semibold">{packageDetails.versions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(packageDetails.moment).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sort Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Versions ({sortedVersions.length} of {packageDetails.versions.length})
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-3 py-1 text-sm border rounded-md bg-background"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="vulnerabilities">Sort by Vulnerabilities</option>
                    <option value="score">Sort by Score</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search versions by name (e.g., 1.25.3, 2.0)..."
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
                          No date
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Hash className="h-3 w-3" />
                        Serial: {version.serial_number}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Weighted Mean</p>
                      <p className="text-lg font-semibold">{version.weighted_mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mean Score</p>
                      <p className="text-lg font-semibold">{version.mean.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vulnerabilities</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        {version.vulnerabilities.length}
                      </p>
                    </div>
                  </div>

                  {version.vulnerabilities.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Vulnerabilities:</p>
                      <div className="flex flex-wrap gap-2">
                        {version.vulnerabilities.map((vuln, vulnIndex) => (
                          <Badge key={vulnIndex} variant="destructive" className="text-xs">
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
