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
          <DialogTitle>
            {translations.docs?.requirementOperations?.versionsTitle}: {dependency.package_name}
          </DialogTitle>
        </DialogHeader>

        {dependency.versions && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <strong>{translations.docs?.requirementOperations?.vendor}:</strong>{' '}
              {dependency.package_vendor}
            </div>
            <div className="text-sm text-muted-foreground">
              <strong>{translations.docs?.requirementOperations?.constraints}:</strong>{' '}
              {dependency.package_constraints}
            </div>

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
        )}
      </DialogContent>
    </Dialog>
  )
}
