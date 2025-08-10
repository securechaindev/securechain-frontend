'use client'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { usePackage } from '@/context'
import { API_ENDPOINTS } from '@/constants'
import type { NodeType, PackageInitData } from '@/types/package'

export function usePackageOperations(translations: Record<string, any>) {
  const [packageName, setPackageName] = useState('')
  const [nodeType, setNodeType] = useState<NodeType>('PyPIPackage')
  const [depexLoading, setDepexLoading] = useState(false)
  const [showPackageInitModal, setShowPackageInitModal] = useState(false)
  const [pendingPackageInit, setPendingPackageInit] = useState<PackageInitData | null>(null)

  const { toast } = useToast()
  const { setPackageDetails, setIsViewingPackage } = usePackage()

  const handlePackageStatus = async () => {
    if (!packageName.trim()) {
      toast({
        title: translations.errorTitle,
        description: translations.packageNameRequired || 'Package name is required',
        variant: 'destructive',
      })
      return
    }
    
    setDepexLoading(true)
    try {
      const response = await fetch(
        `${API_ENDPOINTS.DEPEX.PACKAGE_STATUS}?packageName=${packageName}&nodeType=${nodeType}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      if (response.ok && data.package) {
        // Set package details in context and show the view
        setPackageDetails(data.package)
        setIsViewingPackage(true)
      } else if (response.status === 404 || data.code?.includes('package_not_found')) {
        // Package doesn't exist, show initialization modal
        setPendingPackageInit({ packageName, nodeType })
        setShowPackageInitModal(true)
      } else {
        toast({
          title: translations.errorTitle,
          description: data.error || data.message || 'Failed to get package status',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: translations.errorTitle,
        description: error.message || translations.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  const handlePackageInit = async () => {
    if (!pendingPackageInit) return
    
    const packageToInit = pendingPackageInit
    setDepexLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.DEPEX.PACKAGE_INIT, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_name: packageToInit.packageName,
          node_type: packageToInit.nodeType 
        }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: translations.packageInitialized,
          description: data.message,
        })
        setShowPackageInitModal(false)
        setPendingPackageInit(null)
      } else {
        toast({
          title: translations.errorTitle,
          description: data.error || 'Failed to initialize package',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: translations.errorTitle,
        description: error.message || translations.networkErrorDescription,
        variant: 'destructive',
      })
    } finally {
      setDepexLoading(false)
    }
  }

  const handleCancelPackageInit = () => {
    setShowPackageInitModal(false)
    setPendingPackageInit(null)
  }

  return {
    packageName,
    setPackageName,
    nodeType,
    setNodeType,
    depexLoading,
    setDepexLoading,
    showPackageInitModal,
    setShowPackageInitModal,
    pendingPackageInit,
    handlePackageStatus,
    handlePackageInit,
    handleCancelPackageInit
  }
}
