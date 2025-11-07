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
import { useVersionInfo } from '@/hooks/api'
import { DirectDependenciesVersionList } from './DirectDependenciesVersionList'
import { IndirectDependenciesVersionList } from './IndirectDependenciesVersionList'
import type { NodeType } from '@/types'

interface VersionInfoDialogProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  packageName?: string
  versionName?: string
  nodeType?: NodeType
  translations: Record<string, any>
}

export function VersionInfoDialog({
  open,
  onOpenChange,
  packageName: initialPackageName,
  versionName: initialVersionName,
  nodeType: initialNodeType,
  translations,
}: VersionInfoDialogProps) {
  const [packageName, setPackageName] = useState('')
  const [versionName, setVersionName] = useState('')
  const [maxDepth, setMaxDepth] = useState('2')

  const versionInfo = useVersionInfo(translations)

  useEffect(() => {
    if (initialPackageName) {
      setPackageName(initialPackageName)
    }
  }, [initialPackageName])

  useEffect(() => {
    if (initialVersionName) {
      setVersionName(initialVersionName)
    }
  }, [initialVersionName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!packageName.trim() || !versionName.trim()) return

    const depth = parseInt(maxDepth, 10)
    if (isNaN(depth) || depth < 1) return

    await versionInfo.getVersionInfo({
      package_name: packageName.trim(),
      version_name: versionName.trim(),
      max_depth: depth,
      node_type: initialNodeType || 'PyPIPackage',
    })
  }

  const handleClose = () => {
    versionInfo.clearResults()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {translations.docs?.versionInfoTitle ||
              translations.versionInfoTitle ||
              'Package Version Dependency Analysis'}
          </DialogTitle>
          <DialogDescription>
            {translations.docs?.versionInfoDescription ||
              translations.versionInfoDescription ||
              'Analyze specific version dependencies with detailed vulnerability scores'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Package Name Input */}
            <div className="space-y-2">
              <Label htmlFor="package-name">
                {translations.docs?.packageName || translations.packageName || 'Package Name'}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="package-name"
                type="text"
                placeholder="e.g., requests"
                value={packageName}
                onChange={e => setPackageName(e.target.value)}
                disabled={true}
                readOnly
                required
              />
            </div>

            {/* Version Name Input */}
            <div className="space-y-2">
              <Label htmlFor="version-name">
                {translations.docs?.versionName || translations.versionName || 'Version Name'}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="version-name"
                type="text"
                placeholder="e.g., 2.23.0"
                value={versionName}
                onChange={e => setVersionName(e.target.value)}
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
                placeholder="2"
                value={maxDepth}
                onChange={e => setMaxDepth(e.target.value)}
                disabled={versionInfo.isLoading}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={versionInfo.isLoading || !packageName.trim() || !versionName.trim()}
            >
              <Search className="mr-2 h-4 w-4" />
              {versionInfo.isLoading
                ? translations.docs?.analyzing || translations.analyzing || 'Analyzing...'
                : translations.docs?.analyzeVersion ||
                  translations.analyzeVersion ||
                  'Analyze Version'}
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {versionInfo.isLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {versionInfo.error && !versionInfo.isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{versionInfo.error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {versionInfo.data && !versionInfo.isLoading && (
          <div className="space-y-6 mt-6">
            {versionInfo.data.direct_dependencies &&
              versionInfo.data.direct_dependencies.length > 0 && (
                <DirectDependenciesVersionList
                  dependencies={versionInfo.data.direct_dependencies}
                  nodeType={versionInfo.nodeType || ''}
                  translations={translations.docs || translations}
                />
              )}
            {versionInfo.data.indirect_dependencies_by_depth &&
              Object.keys(versionInfo.data.indirect_dependencies_by_depth).length > 0 && (
                <IndirectDependenciesVersionList
                  dependenciesByDepth={versionInfo.data.indirect_dependencies_by_depth}
                  nodeType={versionInfo.nodeType || ''}
                  translations={translations.docs || translations}
                />
              )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
