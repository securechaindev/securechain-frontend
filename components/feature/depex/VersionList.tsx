'use client'

import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import type { VersionDetail } from '@/types/PackageInfo'
import { useState } from 'react'

interface VersionListProps {
  versions: VersionDetail[]
  packageName: string
}

export function VersionList({ versions, packageName }: VersionListProps) {
  const [sortBy, setSortBy] = useState<'name' | 'weighted_mean' | 'vulnerabilities'>(
    'weighted_mean'
  )
  const [filterQuery, setFilterQuery] = useState('')

  // Filter and sort versions
  const filteredAndSortedVersions = versions
    .filter(v => v.name.toLowerCase().includes(filterQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, undefined, { numeric: true })
      } else if (sortBy === 'weighted_mean') {
        return b.weighted_mean - a.weighted_mean
      } else {
        return b.vulnerability_count.length - a.vulnerability_count.length
      }
    })

  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-green-600 dark:text-green-400'
    if (score < 3) return 'text-yellow-600 dark:text-yellow-400'
    if (score < 7) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBadgeVariant = (
    score: number
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score === 0) return 'outline'
    if (score < 3) return 'secondary'
    if (score < 7) return 'default'
    return 'destructive'
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="version-filter" className="sr-only">
            Filter versions
          </Label>
          <Input
            id="version-filter"
            type="text"
            placeholder="Search versions..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="version-sort" className="sr-only">
            Sort by
          </Label>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger id="version-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="weighted_mean">Score</SelectItem>
              <SelectItem value="vulnerabilities">Vulnerabilities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Version Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedVersions.map((version, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              {/* Version Name */}
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-bold">{version.name}</p>
                <Badge variant={getScoreBadgeVariant(version.weighted_mean)} className="text-xs">
                  {version.weighted_mean.toFixed(2)}
                </Badge>
              </div>

              {/* Package Name */}
              <p className="text-xs text-muted-foreground truncate">{packageName}</p>

              {/* Scores */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-muted-foreground">Weighted:</span>
                  <span className={getScoreColor(version.weighted_mean)}>
                    {version.weighted_mean.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-muted-foreground">Mean:</span>
                  <span className={getScoreColor(version.mean)}>{version.mean.toFixed(2)}</span>
                </div>
              </div>

              {/* Vulnerabilities */}
              {version.vulnerability_count.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="font-medium">
                      {version.vulnerability_count.length}{' '}
                      {version.vulnerability_count.length === 1
                        ? 'vulnerability'
                        : 'vulnerabilities'}
                    </span>
                  </div>
                  <div className="max-h-24 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {version.vulnerability_count.map((vuln: string, idx: number) => (
                        <Badge key={idx} variant="destructive" className="text-xs px-1 py-0">
                          {vuln}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span>✓</span>
                  <span>No vulnerabilities</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results */}
      {filteredAndSortedVersions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No versions found</div>
      )}

      {/* Summary */}
      <div className="text-sm text-muted-foreground text-center">
        {`Showing ${filteredAndSortedVersions.length} of ${versions.length} versions`}
      </div>
    </div>
  )
}
