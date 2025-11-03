'use client'

import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Shield } from 'lucide-react'
import type { DirectDependencyVersion } from '@/types/VersionInfo'
import { VersionList } from './VersionList'

interface DirectDependenciesVersionListProps {
  dependencies: DirectDependencyVersion[]
  translations: Record<string, any>
}

export function DirectDependenciesVersionList({
  dependencies,
  translations,
}: DirectDependenciesVersionListProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5" />
        {translations.directDependencies || 'Direct Dependencies'} ({dependencies.length})
      </h3>

      {dependencies.map((dep, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3 bg-muted/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-mono">{dep.package_name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {translations.vendor || 'Vendor'}: {dep.package_vendor}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {dep.package_constraints}
                </Badge>
                <Badge variant="secondary">
                  {dep.versions.length} {translations.versions || 'versions'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <VersionList
              versions={dep.versions}
              packageName={dep.package_name}
              translations={translations}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
