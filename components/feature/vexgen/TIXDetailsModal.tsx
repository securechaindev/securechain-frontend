'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui'
import {
  AlertTriangle,
  Info,
  Calendar,
  Shield,
  ExternalLink,
  Bug,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface CVSSInfo {
  vuln_impact: number
  attack_vector: string
}

interface CWEInfo {
  '@id': string
  name: string
}

interface TIXStatement {
  vulnerability: {
    '@id': string
    name: string
    description: string
    cvss: CVSSInfo
    cwes: CWEInfo[]
  }
  products: Array<{
    identifiers: {
      purl: string
    }
  }>
  timestamp: string
  reachable_code: Array<{
    path_to_file: string
    used_artefacts: Array<{
      artefact_name: string
      artefact_type: string
      sources?: string[]
      used_in_lines: number[] | string
    }>
  }>
  exploits: any[]
}

interface TIXDocument {
  tix?: {
    author: string
    role: string
    timestamp: string
    tooling: string
    version: string
    statements: TIXStatement[]
  }
  author: string
  role: string
  timestamp: string
  tooling: string
  version: string
  statements: TIXStatement[]
}

interface TIXData extends TIXDocument {}

interface TIXDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  tixData: TIXData | null
  loading: boolean
  repositoryName: string
  translations: Record<string, any>
}

export default function TIXDetailsModal({
  isOpen,
  onClose,
  tixData,
  loading,
  repositoryName,
  translations,
}: TIXDetailsModalProps) {
  const [expandedPayloads, setExpandedPayloads] = useState<Set<string>>(new Set())

  const togglePayload = (exploitId: string) => {
    const newExpanded = new Set(expandedPayloads)
    if (newExpanded.has(exploitId)) {
      newExpanded.delete(exploitId)
    } else {
      newExpanded.add(exploitId)
    }
    setExpandedPayloads(newExpanded)
  }
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getImpactColor = (score: number) => {
    if (score >= 7.0) return 'destructive'
    if (score >= 4.0) return 'default'
    return 'secondary'
  }

  const getImpactLabel = (score: number, translations: Record<string, any>) => {
    if (score >= 7.0) return translations.tixDetailsModal?.high || 'High'
    if (score >= 4.0) return translations.tixDetailsModal?.medium || 'Medium'
    return translations.tixDetailsModal?.low || 'Low'
  }

  const extractPurlInfo = (purl: string) => {
    const parts = purl.split('/')
    const packagePart = parts[parts.length - 1]
    const [name, version] = packagePart.includes('@')
      ? packagePart.split('@')
      : [packagePart, 'unknown']
    return { name, version }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-7xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">
              {translations.tixDetailsModal?.title || 'TIX (Threat Intelligence eXchange)'} -{' '}
              {repositoryName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm sm:text-base">
                {translations.tixDetailsModal?.loadingText || 'Loading TIX details...'}
              </span>
            </div>
          )}

          {!loading && tixData && (
            <div className="space-y-4 sm:space-y-6">
              {/* Document Header */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    {translations.tixDetailsModal?.documentInfo || 'Document Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.tixDetailsModal?.author || 'Author'}
                      </p>
                      <p className="text-xs sm:text-sm truncate">
                        {tixData.tix?.author || tixData.author}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.tixDetailsModal?.role || 'Role'}
                      </p>
                      <p className="text-xs sm:text-sm truncate">
                        {tixData.tix?.role || tixData.role}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.tixDetailsModal?.version || 'Version'}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {tixData.tix?.version || tixData.version}
                      </Badge>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.tixDetailsModal?.creationDate || 'Creation Date'}
                      </p>
                      <p className="text-xs sm:text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(tixData.tix?.timestamp || tixData.timestamp || '')}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {translations.tixDetailsModal?.tooling || 'Tooling'}
                    </p>
                    <a
                      href={tixData.tix?.tooling || tixData.tooling}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
                    >
                      <span className="truncate">{tixData.tix?.tooling || tixData.tooling}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Threats Section */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Bug className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {translations.tixDetailsModal?.threatsIdentified || 'Threats Identified'} (
                      {(tixData.tix?.statements || tixData.statements)?.length || 0})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {(tixData.tix?.statements || tixData.statements)?.map(
                      (statement: any, index: number) => (
                        <Card key={index} className="border-l-2 sm:border-l-4 border-l-orange-500">
                          <CardContent className="p-3 sm:p-4">
                            <div className="space-y-3 sm:space-y-4">
                              {/* Vulnerability Header */}
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                                  <h4 className="font-semibold text-sm sm:text-base truncate">
                                    {statement.vulnerability.name}
                                  </h4>
                                  {statement.vulnerability.cvss.vuln_impact > 0 && (
                                    <Badge
                                      variant={getImpactColor(
                                        statement.vulnerability.cvss.vuln_impact
                                      )}
                                      className="text-xs flex-shrink-0"
                                    >
                                      {getImpactLabel(
                                        statement.vulnerability.cvss.vuln_impact,
                                        translations
                                      )}{' '}
                                      ({statement.vulnerability.cvss.vuln_impact})
                                    </Badge>
                                  )}
                                </div>
                                <a
                                  href={statement.vulnerability['@id']}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0"
                                >
                                  <span className="hidden sm:inline">
                                    {translations.tixDetailsModal?.viewDetails || 'View details'}
                                  </span>
                                  <span className="sm:hidden">Details</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>

                              {/* Description */}
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                                  {statement.vulnerability.description}
                                </p>
                              </div>

                              {/* CVSS Vector */}
                              {statement.vulnerability.cvss.attack_vector && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    {translations.tixDetailsModal?.cvssVector || 'CVSS Vector'}
                                  </p>
                                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                                    {statement.vulnerability.cvss.attack_vector}
                                  </code>
                                </div>
                              )}

                              {/* CWEs */}
                              {statement.vulnerability.cwes.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {translations.tixDetailsModal?.relatedCWEs || 'Related CWEs'}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {statement.vulnerability.cwes.map(
                                      (cwe: any, cweIndex: number) => (
                                        <a
                                          key={cweIndex}
                                          href={cwe['@id']}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-block"
                                        >
                                          <Badge
                                            variant="outline"
                                            className="text-xs hover:bg-accent cursor-pointer transition-colors"
                                          >
                                            {cwe.name}
                                            <ExternalLink className="h-2 w-2 ml-1" />
                                          </Badge>
                                        </a>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Affected Products */}
                              {statement.products.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {translations.tixDetailsModal?.affectedProducts ||
                                      'Affected Products'}
                                  </p>
                                  <div className="space-y-1">
                                    {statement.products.map(
                                      (product: any, productIndex: number) => {
                                        const { name, version } = extractPurlInfo(
                                          product.identifiers.purl
                                        )
                                        return (
                                          <div
                                            key={productIndex}
                                            className="flex items-center gap-2 text-xs"
                                          >
                                            <Badge variant="secondary" className="truncate">
                                              {name}
                                            </Badge>
                                            <span className="text-muted-foreground">
                                              v{version}
                                            </span>
                                          </div>
                                        )
                                      }
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Analysis Status */}
                              <div className="space-y-3 sm:space-y-4 pt-2 border-t">
                                {/* Reachable Code */}
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {translations.tixDetailsModal?.reachableCode ||
                                      'Reachable Code'}
                                  </p>
                                  {statement.reachable_code.length > 0 ? (
                                    <div className="space-y-2">
                                      <Badge variant="destructive" className="text-xs mb-2">
                                        {statement.reachable_code.length}{' '}
                                        {translations.tixDetailsModal?.found || 'found'}
                                      </Badge>
                                      <div className="bg-muted/30 rounded-lg p-2 sm:p-3 space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 overflow-y-auto">
                                        {statement.reachable_code.map(
                                          (codeEntry: any, codeIndex: number) => (
                                            <div
                                              key={codeIndex}
                                              className="text-xs bg-background rounded border p-2 sm:p-3"
                                            >
                                              <div className="font-mono text-orange-600 font-medium mb-2 break-all text-xs sm:text-sm">
                                                📁 {codeEntry.path_to_file}
                                              </div>
                                              {codeEntry.used_artefacts &&
                                                codeEntry.used_artefacts.length > 0 && (
                                                  <div className="space-y-2">
                                                    <p className="text-muted-foreground font-medium text-xs">
                                                      {translations.tixDetailsModal?.artefacts ||
                                                        'artefacts'}
                                                      :
                                                    </p>
                                                    {codeEntry.used_artefacts.map(
                                                      (artefact: any, artefactIndex: number) => (
                                                        <div
                                                          key={artefactIndex}
                                                          className="bg-muted/50 rounded p-2 ml-2"
                                                        >
                                                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                                            <Badge
                                                              variant="secondary"
                                                              className="text-xs"
                                                            >
                                                              {artefact.artefact_type}
                                                            </Badge>
                                                            <code className="text-xs font-bold text-blue-600 break-all">
                                                              {artefact.artefact_name}
                                                            </code>
                                                          </div>

                                                          {/* Sources */}
                                                          {artefact.sources &&
                                                            artefact.sources.length > 0 && (
                                                              <div className="mb-2">
                                                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                                                  {translations.tixDetailsModal
                                                                    ?.sources || 'Sources'}
                                                                  :
                                                                </p>
                                                                <div className="flex flex-wrap gap-1">
                                                                  {artefact.sources.map(
                                                                    (
                                                                      source: string,
                                                                      sourceIndex: number
                                                                    ) => (
                                                                      <Badge
                                                                        key={sourceIndex}
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                      >
                                                                        {source}
                                                                      </Badge>
                                                                    )
                                                                  )}
                                                                </div>
                                                              </div>
                                                            )}

                                                          {artefact.used_in_lines && (
                                                            <div className="text-muted-foreground text-xs">
                                                              {translations.tixDetailsModal
                                                                ?.lines || 'Lines'}
                                                              :{' '}
                                                              {typeof artefact.used_in_lines ===
                                                              'string'
                                                                ? artefact.used_in_lines
                                                                    .split(',')
                                                                    .map(
                                                                      (
                                                                        line: string,
                                                                        lineIndex: number
                                                                      ) => (
                                                                        <span
                                                                          key={lineIndex}
                                                                          className="inline-block bg-orange-100 text-orange-800 px-1 rounded mr-1 text-xs"
                                                                        >
                                                                          {line.trim()}
                                                                        </span>
                                                                      )
                                                                    )
                                                                : Array.isArray(
                                                                      artefact.used_in_lines
                                                                    )
                                                                  ? artefact.used_in_lines.map(
                                                                      (line: number) => (
                                                                        <span
                                                                          key={line}
                                                                          className="inline-block bg-orange-100 text-orange-800 px-1 rounded mr-1 text-xs"
                                                                        >
                                                                          {line}
                                                                        </span>
                                                                      )
                                                                    )
                                                                  : null}
                                                            </div>
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">
                                      {translations.tixDetailsModal?.notFound || 'Not found'}
                                    </Badge>
                                  )}
                                </div>

                                {/* Known Exploits */}
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {translations.tixDetailsModal?.knownExploits ||
                                      'Known Exploits'}
                                  </p>
                                  {statement.exploits.length > 0 ? (
                                    <div className="space-y-2">
                                      <Badge variant="destructive" className="text-xs mb-2">
                                        {statement.exploits.length}{' '}
                                        {translations.tixDetailsModal?.available || 'available'}
                                      </Badge>
                                      <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                                        {statement.exploits.map(
                                          (exploit: any, exploitIndex: number) => {
                                            const exploitId = `${index}-${exploitIndex}`
                                            const isExpanded = expandedPayloads.has(exploitId)
                                            const shouldTruncate =
                                              exploit.payload && exploit.payload.length > 500

                                            return (
                                              <div
                                                key={exploitIndex}
                                                className="bg-muted/30 rounded-lg p-2 sm:p-3"
                                              >
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                  <a
                                                    href={exploit['@id']}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 break-all"
                                                  >
                                                    {exploit.name}
                                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                                  </a>
                                                  {exploit.attack_vector &&
                                                    exploit.attack_vector !== 'NONE' && (
                                                      <Badge variant="outline" className="text-xs">
                                                        {exploit.attack_vector}
                                                      </Badge>
                                                    )}
                                                </div>
                                                {exploit.description &&
                                                  exploit.description.trim() && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                      {exploit.description}
                                                    </p>
                                                  )}
                                                {exploit.payload && (
                                                  <div className="bg-background border rounded p-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                      <p className="text-xs font-medium text-muted-foreground">
                                                        Payload/Details:
                                                      </p>
                                                      {shouldTruncate && (
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => togglePayload(exploitId)}
                                                          className="h-6 px-2 text-xs"
                                                        >
                                                          {isExpanded ? (
                                                            <>
                                                              <ChevronUp className="h-3 w-3 mr-1" />
                                                              Show less
                                                            </>
                                                          ) : (
                                                            <>
                                                              <ChevronDown className="h-3 w-3 mr-1" />
                                                              Show more
                                                            </>
                                                          )}
                                                        </Button>
                                                      )}
                                                    </div>
                                                    <div
                                                      className={`text-xs font-mono text-gray-700 dark:text-gray-300 overflow-y-auto ${
                                                        isExpanded ? 'max-h-96' : 'max-h-20'
                                                      }`}
                                                    >
                                                      <pre className="whitespace-pre-wrap break-words">
                                                        {isExpanded || !shouldTruncate
                                                          ? exploit.payload
                                                          : `${exploit.payload.substring(0, 500)}...`}
                                                      </pre>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          }
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">
                                      {translations.tixDetailsModal?.notKnown || 'Not known'}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Timestamp */}
                              <div className="text-xs text-muted-foreground pt-2 border-t">
                                {translations.tixDetailsModal?.analyzed || 'Analyzed'}:{' '}
                                {formatDate(statement.timestamp)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !tixData && (
            <div className="text-center py-8">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {translations.tixDetailsModal?.errorText || 'Could not load TIX information'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
