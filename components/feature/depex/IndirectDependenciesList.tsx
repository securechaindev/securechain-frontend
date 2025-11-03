'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { AlertTriangle, Network } from 'lucide-react'
import type { IndirectDependency } from '@/types/PackageInfo'

interface IndirectDependenciesListProps {
  dependenciesByDepth: {
    [depth: string]: IndirectDependency[]
  }
  translations: Record<string, any>
}

export function IndirectDependenciesList({
  dependenciesByDepth,
  translations,
}: IndirectDependenciesListProps) {
  const sortedDepths = Object.keys(dependenciesByDepth)
    .map(Number)
    .sort((a, b) => a - b)

  const totalCount = Object.values(dependenciesByDepth).reduce(
    (sum, deps) => sum + deps.length,
    0
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Network className="h-5 w-5" />
        {translations.indirectDependencies || 'Indirect Dependencies'} ({totalCount})
      </h3>

      <Accordion type="multiple" className="w-full space-y-2">
        {sortedDepths.map((depth) => (
          <AccordionItem key={depth} value={`depth-${depth}`} className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {translations.depth || 'Depth'} {depth}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {dependenciesByDepth[depth].length}{' '}
                  {dependenciesByDepth[depth].length === 1
                    ? translations.package || 'package'
                    : translations.packages || 'packages'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {dependenciesByDepth[depth].map((dep, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4 space-y-2">
                      <div>
                        <p className="font-mono text-sm font-medium">{dep.package_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {translations.vendor || 'Vendor'}: {dep.package_vendor}
                        </p>
                      </div>

                      {dep.vulnerabilities && dep.vulnerabilities.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">
                              {dep.vulnerabilities.length}{' '}
                              {translations.vulnerabilities || 'vulnerabilities'}
                            </span>
                          </div>
                          <div className="max-h-16 overflow-y-auto">
                            <div className="flex flex-wrap gap-1">
                              {dep.vulnerabilities.map((vuln, idx) => (
                                <Badge key={idx} variant="destructive" className="text-xs">
                                  {vuln}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
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
