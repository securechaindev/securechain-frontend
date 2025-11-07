'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui'
import { Search, AlertCircle } from 'lucide-react'
import { usePackageInfo } from '@/hooks/api'
import { DirectDependenciesList } from './DirectDependenciesList'
import { IndirectDependenciesList } from './IndirectDependenciesList'
import type { NodeType } from '@/types'

interface PackageInfoDialogProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  packageName?: string
  nodeType?: NodeType
  translations: Record<string, any>
}

export function PackageInfoDialog({
  open,
  onOpenChange,
  packageName: initialPackageName,
  nodeType: initialNodeType,
  translations,
}: PackageInfoDialogProps) {
  const [packageName, setPackageName] = useState('')
  const [maxDepth, setMaxDepth] = useState('3')

  const packageInfo = usePackageInfo(translations)

  useEffect(() => {
    if (initialPackageName) {
      setPackageName(initialPackageName)
    }
  }, [initialPackageName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!packageName.trim()) return

    const depth = parseInt(maxDepth, 10)
    if (isNaN(depth) || depth < 1) return

    await packageInfo.getPackageInfo({
      package_name: packageName.trim(),
      max_depth: depth,
      node_type: initialNodeType || 'PyPIPackage',
    })
  }

  const handleClose = () => {
    packageInfo.clearResults()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {translations.docs?.packageInfoTitle ||
              translations.packageInfoTitle ||
              'Package Dependency Analysis'}
          </DialogTitle>
          <DialogDescription>
            {translations.docs?.packageInfoDescription ||
              translations.packageInfoDescription ||
              'Analyze package dependencies, vulnerabilities, and the software supply chain'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Package Name Input */}
            <div className="space-y-2">
              <Label htmlFor="package-name">
                {translations.docs?.packageName || translations.packageName || 'Package Name'}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="package-name"
                type="text"
                placeholder="e.g., lodash"
                value={packageName}
                onChange={e => setPackageName(e.target.value)}
                disabled={true}
                readOnly
                required
              />
            </div>

            {/* Max Depth Input */}
            <div className="space-y-2">
              <Label htmlFor="max-depth">
                {translations.docs?.maxDepth || translations.maxDepth || 'Max Depth'}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="max-depth"
                type="number"
                min="1"
                max="10"
                placeholder="3"
                value={maxDepth}
                onChange={e => setMaxDepth(e.target.value)}
                disabled={packageInfo.isLoading}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={packageInfo.isLoading || !packageName.trim()}>
              <Search className="mr-2 h-4 w-4" />
              {packageInfo.isLoading
                ? translations.docs?.analyzing || translations.analyzing || 'Analyzing...'
                : translations.docs?.analyzePackage ||
                  translations.analyzePackage ||
                  'Analyze Package'}
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {packageInfo.isLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {packageInfo.error && !packageInfo.isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{packageInfo.error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {packageInfo.data && !packageInfo.isLoading && (
          <div className="space-y-6 mt-6">
            {packageInfo.data.direct_dependencies &&
              packageInfo.data.direct_dependencies.length > 0 && (
                <DirectDependenciesList
                  dependencies={packageInfo.data.direct_dependencies}
                  nodeType={packageInfo.nodeType || ''}
                  translations={translations.docs || translations}
                />
              )}
            {packageInfo.data.indirect_dependencies_by_depth &&
              Object.keys(packageInfo.data.indirect_dependencies_by_depth).length > 0 && (
                <IndirectDependenciesList
                  dependenciesByDepth={packageInfo.data.indirect_dependencies_by_depth}
                  nodeType={packageInfo.nodeType || ''}
                  translations={translations.docs || translations}
                />
              )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
