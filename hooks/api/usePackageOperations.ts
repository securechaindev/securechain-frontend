'use client'
import { useState } from 'react'
import { useToast } from '@/hooks/ui'
import { usePackage } from '@/context'
import { depexAPI } from '@/lib/api'
import type { NodeType, PackageInitData } from '@/types'

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
      const params = `package_name=${packageName}&node_type=${nodeType}`
      const response = await depexAPI.getPackageStatus(params)
      
      if (response.data.package) {
        // Set package details in context and show the view
        setPackageDetails(response.data.package)
        setIsViewingPackage(true)
      }
    } catch (error: any) {
      // Handle 404 (package not found) vs other errors
      if (error.status === 404 || error.code?.includes('package_not_found')) {
        // Package doesn't exist, show initialization modal
        setPendingPackageInit({ packageName, nodeType })
        setShowPackageInitModal(true)
      } else {
        toast({
          title: translations.errorTitle,
          description: error.message || 'Failed to get package status',
          variant: 'destructive',
        })
      }
    } finally {
      setDepexLoading(false)
    }
  }

  const handlePackageInit = async () => {
    if (!pendingPackageInit) return

    const packageToInit = pendingPackageInit
    setDepexLoading(true)
    try {
      const response = await depexAPI.initializePackage({
        package_name: packageToInit.packageName,
        node_type: packageToInit.nodeType,
      })
      
      toast({
        title: translations.packageInitialized,
        description: response.data.message,
      })
      setShowPackageInitModal(false)
      setPendingPackageInit(null)
    } catch (error: any) {
      toast({
        title: translations.errorTitle,
        description: error.message || 'Failed to initialize package',
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
    handleCancelPackageInit,
  }
}
