'use client'

import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Shield } from 'lucide-react'
import type { DirectDependencyVersion } from '@/types/VersionInfo'
import { VersionList } from './VersionList'

interface DirectDependenciesVersionListProps {
  dependencies: DirectDependencyVersion[]
  nodeType: string

}

export function DirectDependenciesVersionList({
  dependencies,
  nodeType}: DirectDependenciesVersionListProps) {
  // Map node_type to friendly display names
  const getNodeTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      PyPIPackage: 'PyPI',
      NPMPackage: 'NPM',
      MavenPackage: 'Maven',
      RubyGemsPackage: 'RubyGems',
      CargoPackage: 'Cargo',
      NuGetPackage: 'NuGet'}
    return typeMap[type] || type
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Direct Dependencies ({dependencies.length})
      </h3>

      {dependencies.map((dep, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-3 bg-muted/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-mono">{dep.package_name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {getNodeTypeDisplay(nodeType)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Vendor: {dep.package_vendor}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {dep.package_constraints}
                </Badge>
                <Badge variant="secondary">
                  {dep.versions.length} versions
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <VersionList
              versions={dep.versions}
              packageName={dep.package_name}
              
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
