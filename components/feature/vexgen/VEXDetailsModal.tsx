'use client'

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
} from '@/components/ui'
import { AlertTriangle, Info, Calendar, Shield, ExternalLink, Bug } from 'lucide-react'

interface VEXStatement {
  vulnerability: {
    '@id': string
    name: string
    description: string
  }
  products: Array<{
    identifiers: {
      purl: string
    }
  }>
  timestamp: string
  last_updated: string
  supplier: string
  status: string
  justification: string
  impact_statement: number
}

interface VEXMetadata {
  '@context': string
  '@id': string
  author: string
  role: string
  timestamp: string
  last_updated?: string
  version: string
  tooling: string
  statements: VEXStatement[]
}

interface VEXData {
  metadata: VEXMetadata
}

interface VEXDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  vexData: VEXData | null
  loading: boolean
  repositoryName: string
  translations: Record<string, any>
}

export default function VEXDetailsModal({
  isOpen,
  onClose,
  vexData,
  loading,
  repositoryName,
  translations,
}: VEXDetailsModalProps) {
  const metadata = vexData?.metadata || null

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
    if (score >= 7.0) return translations.vexDetailsModal?.high || 'High'
    if (score >= 4.0) return translations.vexDetailsModal?.medium || 'Medium'
    return translations.vexDetailsModal?.low || 'Low'
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
              {translations.vexDetailsModal?.title || 'VEX Document'} - {repositoryName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm sm:text-base">
                {translations.vexDetailsModal?.loadingText || 'Loading VEX details...'}
              </span>
            </div>
          )}

          {!loading && vexData && (
            <div className="space-y-4 sm:space-y-6">
              {/* Document Header */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    {translations.vexDetailsModal?.documentInfo || 'Document Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.vexDetailsModal?.author || 'Author'}
                      </p>
                      <p className="text-xs sm:text-sm truncate">{metadata?.author}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.vexDetailsModal?.role || 'Role'}
                      </p>
                      <p className="text-xs sm:text-sm truncate">{metadata?.role}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.vexDetailsModal?.version || 'Version'}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {metadata?.version}
                      </Badge>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {translations.vexDetailsModal?.creationDate || 'Creation Date'}
                      </p>
                      <p className="text-xs sm:text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{formatDate(metadata?.timestamp || '')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {translations.vexDetailsModal?.tooling || 'Tooling'}
                    </p>
                    <a
                      href={metadata?.tooling}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
                    >
                      <span className="truncate">{metadata?.tooling}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Vulnerabilities Section */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Bug className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">
                      {translations.vexDetailsModal?.vulnerabilitiesFound ||
                        'Vulnerabilities Found'}{' '}
                      ({metadata?.statements?.length || 0})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {metadata?.statements?.map((statement, index) => (
                      <Card key={index} className="border-l-2 sm:border-l-4 border-l-red-500">
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-3 sm:space-y-4">
                            {/* Vulnerability Header */}
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                                <h4 className="font-semibold text-sm sm:text-base truncate">
                                  {statement.vulnerability.name}
                                </h4>
                                {statement.impact_statement > 0 && (
                                  <Badge
                                    variant={getImpactColor(statement.impact_statement)}
                                    className="text-xs flex-shrink-0"
                                  >
                                    {getImpactLabel(statement.impact_statement, translations)} (
                                    {statement.impact_statement})
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
                                  {translations.vexDetailsModal?.viewDetails || 'View details'}
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

                            {/* VEX Status and Justification */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Status
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {statement.status || 'Not specified'}
                                </Badge>
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Supplier
                                </p>
                                <Badge variant="secondary" className="text-xs truncate">
                                  {statement.supplier || 'Unknown'}
                                </Badge>
                              </div>
                            </div>

                            {/* Justification */}
                            {statement.justification && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Justification
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                  {statement.justification}
                                </p>
                              </div>
                            )}

                            {/* Affected Products */}
                            {statement.products.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">
                                  {translations.vexDetailsModal?.affectedProducts ||
                                    'Affected Products'}
                                </p>
                                <div className="space-y-1">
                                  {statement.products.map((product, productIndex) => {
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
                                        <span className="text-muted-foreground">v{version}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Timestamp */}
                            <div className="text-xs text-muted-foreground pt-2 border-t">
                              {translations.vexDetailsModal?.analyzed || 'Analyzed'}:{' '}
                              {formatDate(statement.timestamp)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && !vexData && (
            <div className="text-center py-8">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {translations.vexDetailsModal?.errorText || 'Could not load VEX information'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
