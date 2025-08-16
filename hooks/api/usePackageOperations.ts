'use client'
import { useState } from 'react'
import { useToast } from '@/hooks/ui'
import { usePackage } from '@/context'
import { depexAPI } from '@/lib/api'
import { getDepexErrorMessage, getDepexSuccessMessage, APIError } from '@/lib/utils'
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

      if (
        response.ok &&
        response.data.code === 'get_package_status_success' &&
        response.data.package
      ) {
        setPackageDetails(response.data.package)
        setIsViewingPackage(true)

        const successMessage = getDepexSuccessMessage('get_package_status_success', translations)
        toast({
          title: translations.successTitle || 'Success',
          description: successMessage,
        })
      } else if (response.data.code === 'package_not_found') {
        setPendingPackageInit({ packageName, nodeType })
        setShowPackageInitModal(true)
      } else {
        const errorMessage = getDepexErrorMessage(
          response.data.code || 'unknown_error',
          translations
        )
        toast({
          title: translations.errorTitle,
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error getting package status:', error)

      let errorMessage = 'Failed to get package status'

      if (
        error.status === 404 ||
        (error instanceof APIError && error.code === 'package_not_found')
      ) {
        setPendingPackageInit({ packageName, nodeType })
        setShowPackageInitModal(true)
        return
      } else if (error instanceof APIError && error.code) {
        errorMessage = getDepexErrorMessage(error.code, translations)
      }

      toast({
        title: translations.errorTitle,
        description: errorMessage,
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
      const response = await depexAPI.initializePackage({
        package_name: packageToInit.packageName,
        node_type: packageToInit.nodeType,
      })

      if (response.ok && response.data.code === 'package_initializing') {
        const successMessage = getDepexSuccessMessage('package_initializing', translations)
        toast({
          title: translations.packageInitialized || 'Package Initialized',
          description: successMessage,
        })
        setShowPackageInitModal(false)
        setPendingPackageInit(null)
      } else {
        const errorMessage = getDepexErrorMessage(
          response.data.code || 'unknown_error',
          translations
        )
        toast({
          title: translations.errorTitle,
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error initializing package:', error)

      let errorMessage = 'Failed to initialize package'
      if (error instanceof APIError && error.code) {
        errorMessage = getDepexErrorMessage(error.code, translations)
      }

      toast({
        title: translations.errorTitle,
        description: errorMessage,
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
