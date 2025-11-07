'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { FileIcon, SettingsIcon } from 'lucide-react'
import { SSCOperationsForm } from './SSCOperationsForm'
import { SMTOperationsForm } from './SMTOperationsForm'
import { OperationResults } from './OperationResults'
import { useRequirementOperations } from '@/hooks/api'
import type { NodeType } from '@/types'

const getNodeTypeFromManager = (manager: string): NodeType => {
  const managerLower = manager.toLowerCase()

  if (managerLower.includes('maven') || managerLower.includes('pom')) {
    return 'MavenPackage'
  } else if (
    managerLower.includes('pip') ||
    managerLower.includes('python') ||
    managerLower.includes('requirements')
  ) {
    return 'PyPIPackage'
  } else if (
    managerLower.includes('npm') ||
    managerLower.includes('node') ||
    managerLower.includes('package.json')
  ) {
    return 'NPMPackage'
  } else if (managerLower.includes('cargo') || managerLower.includes('rust')) {
    return 'CargoPackage'
  } else if (managerLower.includes('ruby') || managerLower.includes('gem')) {
    return 'RubyGemsPackage'
  } else if (managerLower.includes('nuget') || managerLower.includes('dotnet')) {
    return 'NuGetPackage'
  } else {
    return 'PyPIPackage'
  }
}

interface OperationsProps {
  repositoryPath: string
  requirementFile: string
  requirementFileName?: string
  fileManager?: string
  translations: Record<string, any>
  onClose?: () => void
}

export function Operations({
  requirementFile,
  requirementFileName,
  fileManager,
  translations,
  onClose,
}: OperationsProps) {
  const [activeTab, setActiveTab] = useState('ssc')
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const operations = useRequirementOperations(translations)

  const handleSSCOperation = async (operation: string, params: any) => {
    setIsLoading(true)
    setResults(null)

    try {
      let result
      const nodeType = getNodeTypeFromManager(fileManager || 'pip')

      const baseRequest = {
        node_type: nodeType,
        requirement_file_id: requirementFile,
        max_depth: params.maxDepth,
      }

      switch (operation) {
        case 'fileInfo':
          result = await operations.getFileInfo({
            ...baseRequest,
            aggregator: params.aggregator,
          } as any)
          break

        default:
          throw new Error(`Unknown SSC operation: ${operation}`)
      }

      if (
        result &&
        typeof result === 'object' &&
        result.code &&
        result.code !== 'operation_success'
      ) {
        setResults({ type: operation, data: result })
      } else {
        setResults({ type: operation, data: result })
      }
    } catch (error) {
      setResults({
        type: 'error',
        data: { message: error instanceof Error ? error.message : String(error) },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSMTOperation = async (operation: string, params: any) => {
    setIsLoading(true)
    setResults(null)

    try {
      let result
      const nodeType = getNodeTypeFromManager(fileManager || 'pip')

      const baseRequest = {
        node_type: nodeType,
        requirement_file_id: requirementFile,
        max_depth: params.maxDepth,
      }

      switch (operation) {
        case 'validateGraph':
          result = await operations.validateGraph(baseRequest as any)
          break

        case 'minimizeImpact':
          result = await operations.minimizeImpact({
            ...baseRequest,
            aggregator: params.aggregator,
            limit: params.limit,
          } as any)
          break

        case 'maximizeImpact':
          result = await operations.maximizeImpact({
            ...baseRequest,
            aggregator: params.aggregator,
            limit: params.limit,
          } as any)
          break

        case 'filterConfigs':
          result = await operations.filterConfigs({
            ...baseRequest,
            aggregator: params.aggregator,
            limit: params.limit,
            min_threshold: params.minThreshold,
            max_threshold: params.maxThreshold,
          } as any)
          break

        case 'validateConfig':
          result = await operations.validateConfig({
            ...baseRequest,
            aggregator: params.aggregator,
            config: params.configuration,
          } as any)
          break

        case 'completeConfig':
          result = await operations.completeConfig({
            ...baseRequest,
            aggregator: params.aggregator,
            config: params.partialConfiguration,
          } as any)
          break

        case 'configByImpact':
          result = await operations.configByImpact({
            ...baseRequest,
            aggregator: params.aggregator,
            impact: params.impact,
          } as any)
          break

        default:
          throw new Error(`Unknown SMT operation: ${operation}`)
      }

      setResults({ type: operation, data: result })
    } catch (error) {
      setResults({
        type: 'error',
        data: { message: error instanceof Error ? error.message : String(error) },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setResults(null)
  }

  const showLoading = isLoading || operations.isExecuting

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            {translations.docs?.requirementOperations?.operationTitle}
          </CardTitle>
          <CardDescription>
            {translations.docs?.requirementOperations?.operationDescription}:{' '}
            {requirementFileName || requirementFile}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
              <TabsTrigger
                value="ssc"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-2 px-1 sm:px-3 min-h-[3.5rem] sm:min-h-0"
              >
                <FileIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-sm text-center leading-tight break-words max-w-full">
                  {translations.docs?.requirementOperations?.sscOperationsTitle || 'SSC'}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="smt"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-2 px-1 sm:px-3 min-h-[3.5rem] sm:min-h-0"
              >
                <SettingsIcon className="h-4 w-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-sm text-center leading-tight break-words max-w-full">
                  {translations.docs?.requirementOperations?.smtOperationsTitle || 'SMT'}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ssc" className="space-y-6">
              <SSCOperationsForm
                onExecute={handleSSCOperation}
                disabled={showLoading}
                translations={translations}
              />
            </TabsContent>

            <TabsContent value="smt" className="space-y-6">
              <SMTOperationsForm
                onExecute={handleSMTOperation}
                disabled={showLoading}
                translations={translations}
              />
            </TabsContent>
          </Tabs>

          {showLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">
                {translations.docs?.requirementOperations?.executing}
              </span>
            </div>
          )}

          {results && !showLoading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  {translations.docs?.requirementOperations?.results}
                </h3>
                <Button variant="outline" size="sm" onClick={clearResults}>
                  {translations.docs?.requirementOperations?.clearResults}
                </Button>
              </div>
              <OperationResults results={results} translations={translations} />
            </div>
          )}

          {onClose && (
            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                {translations.close}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
