'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Separator } from '@/components/ui/Separator'
import { usePackageInfo } from '@/hooks/api'
import { AlertCircle, Loader2, PackageOpen, RefreshCw } from 'lucide-react'
import { DirectDependenciesList } from './DirectDependenciesList'
import { IndirectDependenciesList } from './IndirectDependenciesList'
import { PackageInfoForm } from './PackageInfoForm'

interface PackageInfoViewProps {
  translations: Record<string, any>
}

export function PackageInfoView({ translations }: PackageInfoViewProps) {
  const { data, isLoading, error, getPackageInfo, clearResults } = usePackageInfo(translations)

  const handleAnalyze = async (packageName: string, maxDepth: number, nodeType: string) => {
    await getPackageInfo({ package_name: packageName, max_depth: maxDepth, node_type: nodeType })
  }

  const handleReset = () => {
    clearResults()
  }

  const result = data?.result

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageOpen className="h-6 w-6" />
            {translations.packageInfoTitle || 'Package Dependency Analysis'}
          </CardTitle>
          <CardDescription>
            {translations.packageInfoDescription ||
              'Analyze package dependencies, vulnerabilities, and the software supply chain'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PackageInfoForm
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            translations={translations}
          />
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{translations.error || 'Error'}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && !isLoading && !error && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{translations.summary || 'Summary'}</span>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {translations.newAnalysis || 'New Analysis'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {result.total_direct_dependencies}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {translations.directDependencies || 'Direct Dependencies'}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {result.total_indirect_dependencies}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {translations.indirectDependencies || 'Indirect Dependencies'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Dependencies */}
          {result.direct_dependencies.length > 0 && (
            <>
              <Separator />
              <DirectDependenciesList
                dependencies={result.direct_dependencies}
                translations={translations}
              />
            </>
          )}

          {/* Indirect Dependencies */}
          {Object.keys(result.indirect_dependencies_by_depth).length > 0 && (
            <>
              <Separator />
              <IndirectDependenciesList
                dependenciesByDepth={result.indirect_dependencies_by_depth}
                translations={translations}
              />
            </>
          )}

          {/* No Dependencies Message */}
          {result.direct_dependencies.length === 0 &&
            Object.keys(result.indirect_dependencies_by_depth).length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{translations.noDependencies || 'No Dependencies'}</AlertTitle>
                <AlertDescription>
                  {translations.noDependenciesMessage ||
                    'This package has no dependencies at the specified depth.'}
                </AlertDescription>
              </Alert>
            )}
        </div>
      )}
    </div>
  )
}
