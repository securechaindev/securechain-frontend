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
}

export function OperationResults({ results }: OperationResultsProps) {
  const [selectedDependency, setSelectedDependency] = useState<any>(null)
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)

  const openVersionModal = (dependency: any) => {
    setSelectedDependency(dependency)
    setIsVersionModalOpen(true)
  }

  if (!results) {
    return (
      <Alert>
        <AlertDescription>No results to display</AlertDescription>
      </Alert>
    )
  }

  if (results.type === 'error') {
    return (
      <>
        <ErrorDisplay results={results} />
        <VersionModal
          isOpen={isVersionModalOpen}
          onOpenChange={setIsVersionModalOpen}
          dependency={selectedDependency}
          />
      </>
    )
  }

  const { type, data } = results

  if (type === 'fileInfo') {
    // Los datos pueden venir en data.result o directamente en data
    const fileInfo = (data?.result || data) as FileInfoResult

    return (
      <>
        <FileInfoDisplay
          fileInfo={fileInfo}
          onOpenVersionModal={openVersionModal}
        />
        <VersionModal
          isOpen={isVersionModalOpen}
          onOpenChange={setIsVersionModalOpen}
          dependency={selectedDependency}
          />
      </>
    )
  }

  if (type === 'validateGraph') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Validation Result</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={data ? 'default' : 'destructive'}>
            {data
              ? 'Valid'
              : 'Invalid'}
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
            {type === 'minimizeImpact' && 'Successfully minimized impact'}
            {type === 'maximizeImpact' && 'Successfully maximized impact'}
            {type === 'filterConfigs' && 'Configurations filtered successfully'}
            {type === 'completeConfig' && 'Configuration completed successfully'}
            {type === 'configByImpact' &&
              'Configuration by impact retrieved'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configArray.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No results to display
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Configurations: {configArray.length}
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden space-y-4">
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
                    <Card key={index} className="p-3">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Configuration {index + 1}
                          </span>
                          <Badge
                            variant={
                              totalRisk < 3
                                ? 'default'
                                : totalRisk < 7
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            Total Risk: {totalRisk.toFixed(2)}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-xs font-medium mb-2 text-muted-foreground">
                            Configuration:
                          </p>
                          <pre className="text-[10px] bg-muted p-2 rounded overflow-x-auto text-wrap break-all">
                            {JSON.stringify(dependencies, null, 1)}
                          </pre>
                        </div>

                        {Object.keys(impacts).length > 0 && (
                          <div>
                            <p className="text-xs font-medium mb-2 text-muted-foreground">
                              Individual Impacts:
                            </p>
                            <div className="grid grid-cols-1 gap-1">
                              {Object.entries(impacts).map(([pkg, impact]) => (
                                <div
                                  key={pkg}
                                  className="flex justify-between items-center p-1 bg-muted/50 rounded text-xs"
                                >
                                  <span className="font-mono truncate flex-1 mr-2">{pkg}</span>
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] ${
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
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        Configuration
                      </TableHead>
                      <TableHead className="text-center">
                        Total Risk
                      </TableHead>
                      <TableHead className="text-center">
                        Individual Impacts
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
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Raw Data:
          </p>
          <pre className="text-[10px] sm:text-sm bg-muted p-3 sm:p-4 rounded-md overflow-x-auto text-wrap break-all whitespace-pre-wrap">
            {JSON.stringify(data, null, 1)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
