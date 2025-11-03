'use client'

import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import type { DirectDependency } from '@/types/PackageInfo'

interface DirectDependenciesListProps {
  dependencies: DirectDependency[]
  translations: Record<string, any>
}

export function DirectDependenciesList({
  dependencies,
  translations,
}: DirectDependenciesListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5" />
        {translations.directDependencies || 'Direct Dependencies'} ({dependencies.length})
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dependencies.map((dep, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono">{dep.package_name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {translations.vendor || 'Vendor'}: {dep.package_vendor}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <span className="font-medium">{translations.constraints || 'Constraints'}:</span>
                <p className="font-mono mt-1 text-muted-foreground">{dep.package_constraints}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {translations.totalVersions || 'Total Versions'}:
                </span>
                <Badge variant="secondary">{dep.total_versions}</Badge>
              </div>

              {dep.vulnerabilities && dep.vulnerabilities.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">
                      {dep.vulnerabilities.length}{' '}
                      {translations.vulnerabilities || 'vulnerabilities'}
                    </span>
                  </div>
                  <div className="max-h-20 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {dep.vulnerabilities.map((vuln, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {vuln}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {dep.safe_versions && dep.safe_versions.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {translations.safeVersions || 'Safe Versions'}:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dep.safe_versions.map((version, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {version}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>{dep.status || translations.noVulnerabilities || 'No vulnerabilities'}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
