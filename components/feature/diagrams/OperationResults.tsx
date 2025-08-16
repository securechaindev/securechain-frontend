'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import type { FileInfoResult } from '@/types/RequirementOperations'
import { VersionModal } from './VersionModal'
import { ErrorDisplay } from './ErrorDisplay'
import { FileInfoDisplay } from './FileInfoDisplay'

interface OperationResultsProps {
  results: {
    type: string
    data: any
  }
  translations: Record<string, any>
}

export function OperationResults({ results, translations }: OperationResultsProps) {
  const [selectedDependency, setSelectedDependency] = useState<any>(null)
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)

  const openVersionModal = (dependency: any) => {
    setSelectedDependency(dependency)
    setIsVersionModalOpen(true)
  }

  if (!results) {
    return (
      <Alert>
        <AlertDescription>{translations.docs?.requirementOperations?.noResults}</AlertDescription>
      </Alert>
    )
  }

  if (results.type === 'error') {
    return (
      <>
        <ErrorDisplay results={results} translations={translations} />
        <VersionModal
          isOpen={isVersionModalOpen}
          onOpenChange={setIsVersionModalOpen}
          dependency={selectedDependency}
          translations={translations}
        />
      </>
    )
  }

  const { type, data } = results

  if (type === 'fileInfo' && data?.result) {
    const fileInfo = data.result as FileInfoResult

    return (
      <>
        <FileInfoDisplay
          fileInfo={fileInfo}
          translations={translations}
          onOpenVersionModal={openVersionModal}
        />
        <VersionModal
          isOpen={isVersionModalOpen}
          onOpenChange={setIsVersionModalOpen}
          dependency={selectedDependency}
          translations={translations}
        />
      </>
    )
  }

  if (type === 'validateGraph') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{translations.docs?.requirementOperations?.validationResult}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={data ? 'default' : 'destructive'}>
            {data
              ? translations.docs?.requirementOperations?.valid
              : translations.docs?.requirementOperations?.invalid}
          </Badge>
        </CardContent>
      </Card>
    )
  }

  if (
    (type === 'minimizeImpact' ||
      type === 'maximizeImpact' ||
      type === 'filterConfigs' ||
      type === 'completeConfig' ||
      type === 'configByImpact') &&
    (Array.isArray(data) ||
      (typeof data === 'object' && (type === 'completeConfig' || type === 'configByImpact')))
  ) {
    const configArray = Array.isArray(data) ? data : [data]

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {type === 'minimizeImpact' && translations.docs?.requirementOperations?.minimizeSuccess}
            {type === 'maximizeImpact' && translations.docs?.requirementOperations?.maximizeSuccess}
            {type === 'filterConfigs' && translations.docs?.requirementOperations?.filterSuccess}
            {type === 'completeConfig' && translations.docs?.requirementOperations?.completeSuccess}
            {type === 'configByImpact' &&
              translations.docs?.requirementOperations?.configByImpactSuccess}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configArray.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              {translations.docs?.requirementOperations?.noResults}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {translations.docs?.requirementOperations?.configurations}: {configArray.length}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translations.docs?.requirementOperations?.configuration}</TableHead>
                    <TableHead className="text-center">
                      {translations.docs?.requirementOperations?.totalRisk}
                    </TableHead>
                    <TableHead className="text-center">
                      {translations.docs?.requirementOperations?.individualImpacts}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configArray.map((config: any, index: number) => {
                    const dependencies: any = {}
                    const impacts: any = {}
                    let totalRisk = 0

                    if (type === 'completeConfig' || type === 'configByImpact') {
                      Object.entries(config).forEach(([key, value]) => {
                        if (
                          key === 'impact' ||
                          key === 'total_impact' ||
                          key.startsWith('file_risk_')
                        ) {
                          totalRisk = Number(value)
                        } else if (key.startsWith('impact_')) {
                          impacts[key.replace('impact_', '')] = value
                        } else if (key !== 'configuration') {
                          dependencies[key] = value
                        }
                      })

                      if (config.configuration) {
                        Object.entries(config.configuration).forEach(([key, value]) => {
                          dependencies[key] = value
                        })
                      }
                    } else {
                      Object.entries(config).forEach(([key, value]) => {
                        if (key.startsWith('impact_')) {
                          impacts[key.replace('impact_', '')] = value
                        } else if (key.startsWith('file_risk_')) {
                          totalRisk = Number(value)
                        } else {
                          dependencies[key] = value
                        }
                      })
                    }

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                            {JSON.stringify(dependencies, null, 2)}
                          </pre>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              totalRisk < 3
                                ? 'default'
                                : totalRisk < 7
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {totalRisk.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            {Object.entries(impacts).map(([pkg, impact]) => (
                              <div key={pkg} className="flex justify-between items-center">
                                <span className="font-mono">{pkg}:</span>
                                <Badge
                                  variant="outline"
                                  className={`ml-2 ${
                                    Number(impact) < 3
                                      ? 'border-green-500 text-green-700'
                                      : Number(impact) < 7
                                        ? 'border-yellow-500 text-yellow-700'
                                        : 'border-red-500 text-red-700'
                                  }`}
                                >
                                  {Number(impact).toFixed(2)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.docs?.requirementOperations?.results}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
