'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { InfoIcon } from 'lucide-react'
import type { FileInfoResult } from '@/types/RequirementOperations'

interface FileInfoDisplayProps {
  fileInfo: FileInfoResult
  translations: Record<string, any>
  onOpenVersionModal: (_dependency: any) => void
}

export function FileInfoDisplay({
  fileInfo,
  translations,
  onOpenVersionModal,
}: FileInfoDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5" />
          {translations.docs?.requirementOperations?.fileInfoTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {fileInfo.total_direct_dependencies || 0}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {translations.docs?.requirementOperations?.totalDirect}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-secondary">
              {fileInfo.total_indirect_dependencies || 0}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              {translations.docs?.requirementOperations?.totalIndirect}
            </div>
          </div>
        </div>

        {fileInfo.direct_dependencies && fileInfo.direct_dependencies.length > 0 && (
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-semibold mb-3">
              {translations.docs?.requirementOperations?.directDependencies}
            </h4>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              {fileInfo.direct_dependencies.map((dep, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm truncate flex-1">{dep.package_name}</h5>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenVersionModal(dep)}
                        className="ml-2 text-xs px-2 py-1"
                      >
                        {translations.docs?.requirementOperations?.viewVersionsShort}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {translations.docs?.requirementOperations?.vendor}:
                        </span>
                        <span className="font-mono">{dep.package_vendor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {translations.docs?.requirementOperations?.constraints}:
                        </span>
                        <span className="font-mono">{dep.package_constraints}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {translations.docs?.requirementOperations?.dependencyName}
                    </TableHead>
                    <TableHead>{translations.docs?.requirementOperations?.vendor}</TableHead>
                    <TableHead>{translations.docs?.requirementOperations?.constraints}</TableHead>
                    <TableHead className="text-center">
                      {translations.docs?.requirementOperations?.actions}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileInfo.direct_dependencies.map((dep, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{dep.package_name}</TableCell>
                      <TableCell>{dep.package_vendor}</TableCell>
                      <TableCell>{dep.package_constraints}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => onOpenVersionModal(dep)}>
                          {translations.docs?.requirementOperations?.viewVersions}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {fileInfo.indirect_dependencies_by_depth &&
          Object.keys(fileInfo.indirect_dependencies_by_depth).length > 0 && (
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3">
                {translations.docs?.requirementOperations?.indirectDependencies}
              </h4>
              {Object.entries(fileInfo.indirect_dependencies_by_depth).map(
                ([depth, dependencies]) => (
                  <div key={depth} className="mb-4">
                    <h5 className="text-sm sm:text-md font-medium mb-2">
                      {translations.docs?.requirementOperations?.depthLevel} {depth}
                    </h5>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-2">
                      {dependencies.map((dep, index) => (
                        <Card key={index} className="p-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h6 className="font-medium text-sm truncate flex-1">
                                {dep.package_name}
                              </h6>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onOpenVersionModal(dep)}
                                className="ml-2 text-xs px-2 py-1"
                              >
                                {translations.docs?.requirementOperations?.viewVersionsShort}
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {translations.docs?.requirementOperations?.vendor}:
                                </span>
                                <span className="font-mono text-right">{dep.package_vendor}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {translations.docs?.requirementOperations?.constraints}:
                                </span>
                                <span className="font-mono text-right">
                                  {dep.package_constraints}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>
                              {translations.docs?.requirementOperations?.dependencyName}
                            </TableHead>
                            <TableHead>
                              {translations.docs?.requirementOperations?.vendor}
                            </TableHead>
                            <TableHead>
                              {translations.docs?.requirementOperations?.constraints}
                            </TableHead>
                            <TableHead className="text-center">
                              {translations.docs?.requirementOperations?.actions}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dependencies.map((dep, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{dep.package_name}</TableCell>
                              <TableCell>{dep.package_vendor}</TableCell>
                              <TableCell>{dep.package_constraints}</TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onOpenVersionModal(dep)}
                                >
                                  {translations.docs?.requirementOperations?.viewVersions}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </CardContent>
    </Card>
  )
}
