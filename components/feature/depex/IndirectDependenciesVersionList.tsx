'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Network } from 'lucide-react'
import type { DirectDependencyVersion } from '@/types/VersionInfo'
import { VersionList } from './VersionList'

interface IndirectDependenciesVersionListProps {
  dependenciesByDepth: {
    [depth: string]: DirectDependencyVersion[]
  }
  nodeType: string
}

export function IndirectDependenciesVersionList({
  dependenciesByDepth,
  nodeType,
}: IndirectDependenciesVersionListProps) {
  const getNodeTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      PyPIPackage: 'PyPI',
      NPMPackage: 'NPM',
      MavenPackage: 'Maven',
      RubyGemsPackage: 'RubyGems',
      CargoPackage: 'Cargo',
      NuGetPackage: 'NuGet',
    }
    return typeMap[type] || type
  }

  const sortedDepths = Object.keys(dependenciesByDepth)
    .map(Number)
    .sort((a, b) => a - b)

  const totalCount = Object.values(dependenciesByDepth).reduce((sum, deps) => sum + deps.length, 0)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Network className="h-5 w-5" />
        Indirect Dependencies ({totalCount})
      </h3>

      <Accordion type="multiple" className="w-full space-y-2">
        {sortedDepths.map(depth => (
          <AccordionItem key={depth} value={`depth-${depth}`} className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Depth {depth}</Badge>
                <span className="text-sm text-muted-foreground">
                  {dependenciesByDepth[depth].length}{' '}
                  {dependenciesByDepth[depth].length === 1 ? 'package' : 'packages'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 mt-4">
                {dependenciesByDepth[depth].map((dep, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3 bg-muted/50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-mono">{dep.package_name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {getNodeTypeDisplay(nodeType)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Vendor: {dep.package_vendor}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {dep.package_constraints}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {dep.versions.length} versions
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <VersionList versions={dep.versions} packageName={dep.package_name} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
