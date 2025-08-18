'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface VersionModalProps {
  isOpen: boolean
  onOpenChange: (_open: boolean) => void
  dependency: any
  translations: Record<string, any>
}

export function VersionModal({
  isOpen,
  onOpenChange,
  dependency,
  translations,
}: VersionModalProps) {
  const [expandedVulns, setExpandedVulns] = useState<Set<number>>(new Set())

  const toggleVulnerabilities = (versionIndex: number) => {
    const newExpanded = new Set(expandedVulns)
    if (newExpanded.has(versionIndex)) {
      newExpanded.delete(versionIndex)
    } else {
      newExpanded.add(versionIndex)
    }
    setExpandedVulns(newExpanded)
  }

  if (!dependency) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {translations.docs?.requirementOperations?.versionsTitle}: {dependency.package_name}
          </DialogTitle>
        </DialogHeader>

        {dependency.versions && (
          <div className="space-y-4">
            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <div>
                <strong>{translations.docs?.requirementOperations?.vendor}:</strong>{' '}
                {dependency.package_vendor}
              </div>
              <div>
                <strong>{translations.docs?.requirementOperations?.constraints}:</strong>{' '}
                {dependency.package_constraints}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              {dependency.versions
                .sort((a: any, b: any) => (a.serial_number || 0) - (b.serial_number || 0))
                .map((version: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{version.name}</h4>
                      <Badge
                        variant={
                          version.vulnerability_count?.length === 0 ? 'default' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {version.vulnerability_count?.length || 0} vuln.
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mean:</span>
                        <Badge
                          variant={
                            version.mean === 0
                              ? 'default'
                              : version.mean < 3
                                ? 'secondary'
                                : version.mean < 7
                                  ? 'destructive'
                                  : 'destructive'
                          }
                          className="text-xs"
                        >
                          {version.mean?.toFixed(2) || '0.00'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">W. Mean:</span>
                        <Badge
                          variant={
                            version.weighted_mean === 0
                              ? 'default'
                              : version.weighted_mean < 3
                                ? 'secondary'
                                : version.weighted_mean < 7
                                  ? 'destructive'
                                  : 'destructive'
                          }
                          className="text-xs"
                        >
                          {version.weighted_mean?.toFixed(2) || '0.00'}
                        </Badge>
                      </div>
                    </div>

                    {version.vulnerability_count && version.vulnerability_count.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Vulnerabilidades:</p>
                        <div className="space-y-1">
                          {(expandedVulns.has(index)
                            ? version.vulnerability_count
                            : version.vulnerability_count.slice(0, 2)
                          ).map((vulnId: string, vulnIndex: number) => (
                            <div key={vulnIndex}>
                              <a
                                href={`https://osv.dev/vulnerability/${vulnId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-xs"
                              >
                                {vulnId}
                              </a>
                            </div>
                          ))}
                          {version.vulnerability_count.length > 2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVulnerabilities(index)}
                              className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800"
                            >
                              {expandedVulns.has(index)
                                ? translations.docs?.requirementOperations?.showLess
                                : `+${version.vulnerability_count.length - 2} más`}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translations.docs?.requirementOperations?.version}</TableHead>
                    <TableHead className="text-center">
                      {translations.docs?.requirementOperations?.meanScore}
                    </TableHead>
                    <TableHead className="text-center">
                      {translations.docs?.requirementOperations?.weightedMean}
                    </TableHead>
                    <TableHead className="text-center">
                      {translations.docs?.requirementOperations?.vulnerabilities}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependency.versions
                    .sort((a: any, b: any) => (a.serial_number || 0) - (b.serial_number || 0))
                    .map((version: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{version.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              version.mean === 0
                                ? 'default'
                                : version.mean < 3
                                  ? 'secondary'
                                  : version.mean < 7
                                    ? 'destructive'
                                    : 'destructive'
                            }
                          >
                            {version.mean?.toFixed(2) || '0.00'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              version.weighted_mean === 0
                                ? 'default'
                                : version.weighted_mean < 3
                                  ? 'secondary'
                                  : version.weighted_mean < 7
                                    ? 'destructive'
                                    : 'destructive'
                            }
                          >
                            {version.weighted_mean?.toFixed(2) || '0.00'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              version.vulnerability_count?.length === 0 ? 'default' : 'destructive'
                            }
                          >
                            {version.vulnerability_count?.length || 0}
                          </Badge>
                          {version.vulnerability_count && version.vulnerability_count.length > 0 && (
                            <div className="mt-1 text-xs space-y-1">
                              {(expandedVulns.has(index)
                                ? version.vulnerability_count
                                : version.vulnerability_count.slice(0, 3)
                              ).map((vulnId: string, vulnIndex: number) => (
                                <div key={vulnIndex}>
                                  <a
                                    href={`https://osv.dev/vulnerability/${vulnId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                  >
                                    {vulnId}
                                  </a>
                                </div>
                              ))}
                              {version.vulnerability_count.length > 3 && (
                                <div className="mt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleVulnerabilities(index)}
                                    className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    {expandedVulns.has(index)
                                      ? translations.docs?.requirementOperations?.showLess
                                      : `+${version.vulnerability_count.length - 3} ${translations.docs?.requirementOperations?.moreVulnerabilities}`}
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
