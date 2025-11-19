'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Shield, Download, Loader2, AlertCircle, Eye, Calendar } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useToast } from '@/hooks/ui'
import { vexgenAPI } from '@/lib/api'
import type { TIXDocument } from '@/types'
import TIXDetailsModal from './TIXDetailsModal'

const GitHubIcon = dynamic(
  () => import('react-icons/si').then(mod => ({ default: mod.SiGithub })),
  {
    ssr: false,
    loading: () => <div className="h-4 w-4 animate-pulse bg-muted rounded" />}
)

interface UserTIXsTabProps {
  }

export default function UserTIXsTab({ }: UserTIXsTabProps) {
  const [tixDocuments, setTIXDocuments] = useState<TIXDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [selectedTixId, setSelectedTixId] = useState<string | null>(null)
  const [tixDetailsData, setTixDetailsData] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'})
  }

  const fetchUserTIXs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await vexgenAPI.getUserTIXs()

      if (response.ok && response.data) {
        setTIXDocuments(response.data.data || [])
      } else {
        throw new Error('Failed to fetch TIX documents')
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch TIX documents'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'})
    } finally {
      setLoading(false)
    }
  }, ['Failed to fetch TIX documents', 'Error', toast])

  const handleDownloadTIX = async (tixId: string, fileName: string) => {
    setDownloadingId(tixId)
    try {
      const response = await vexgenAPI.downloadTIX(tixId)
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`)
      }

      if (response.data instanceof Blob) {
        if (response.data.size === 0) {
          throw new Error('Received empty file')
        }
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName || `tix_${tixId}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: 'Success',
          description: 'TIX document downloaded successfully'})
      } else {
        throw new Error('Expected file data but received: ' + typeof response.data)
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.detail || 'Failed to download TIX document'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'})
    } finally {
      setDownloadingId(null)
    }
  }

  const handleViewTIX = async (tixId: string) => {
    setSelectedTixId(tixId)
    setShowDetailsModal(true)
    setLoadingDetails(true)
    setTixDetailsData(null)

    try {
      const response = await vexgenAPI.getTIX(tixId)

      if (response.ok && response.data) {
        const tixData = response.data.data
        setTixDetailsData(tixData)
      } else {
        throw new Error('Error al cargar los detalles del TIX')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Error al cargar los detalles del TIX',
        variant: 'destructive'})
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedTixId(null)
    setTixDetailsData(null)
  }

  useEffect(() => {
    fetchUserTIXs()
  }, [fetchUserTIXs])

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">TIX Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 mb-6">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            View and manage your TIX (Threat Intelligence eXchange) documents
          </p>
          <div className="flex justify-center sm:justify-end">
            <Button
              onClick={fetchUserTIXs}
              disabled={loading}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto max-w-xs"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              <span className="text-xs sm:text-sm">Refresh</span>
            </Button>
          </div>
        </div>

        {tixDocuments.length === 0 && !loading && (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <AlertCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No TIX documents found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Generate TIX documents from your repositories
            </p>
          </div>
        )}

        {tixDocuments.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {tixDocuments.map(tix => (
              <div
                key={tix._id}
                className="border rounded-lg p-3 sm:p-4 bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <GitHubIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h3 className="font-semibold text-sm sm:text-base break-all min-w-0 flex-1">
                        <span className="text-muted-foreground">{tix.owner}/</span>
                        <span>{tix.name}</span>
                      </h3>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        TIX
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">
                        SBOM: <span className="font-mono">{tix.sbom_name}</span>
                      </p>
                      {tix.moment && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(tix.moment)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewTIX(tix._id)}
                        className="h-8 flex-1 sm:flex-initial"
                      >
                        <Eye className="h-3 w-3" />
                        <span className="ml-2 text-xs">View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDownloadTIX(tix._id, `tix_${tix.owner}_${tix.name}.zip`)
                        }
                        disabled={downloadingId === tix._id}
                        className="h-8 flex-1 sm:flex-initial"
                      >
                        {downloadingId === tix._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                        <span className="ml-2 text-xs">Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <TIXDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
        tixData={tixDetailsData}
        loading={loadingDetails}
        repositoryName={
          selectedTixId
            ? tixDocuments.find(t => t._id === selectedTixId)?.owner +
                '/' +
                tixDocuments.find(t => t._id === selectedTixId)?.name || ''
            : ''
        }
        />
    </Card>
  )
}
