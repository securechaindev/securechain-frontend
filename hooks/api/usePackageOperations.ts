'use client'
import { useState } from 'react'
import { useToast } from '@/hooks/ui'
import { usePackage } from '@/context'
import { depexAPI } from '@/lib/api'
import { getErrorMessage, getSuccessMessage, APIError } from '@/lib/utils'
import type { NodeType, PackageInitData } from '@/types'

export function usePackageOperations() {
  const [packageName, setPackageName] = useState('')
  const [nodeType, setNodeType] = useState<NodeType>('PyPIPackage')
  const [depexLoading, setDepexLoading] = useState(false)
  const [showPackageInitModal, setShowPackageInitModal] = useState(false)
  const [pendingPackageInit, setPendingPackageInit] = useState<PackageInitData | null>(null)

  const { toast } = useToast()
  const { setPackageDetails, setIsViewingPackage, setPackageNodeType } = usePackage()

  const handlePackageStatus = async () => {
    if (!packageName.trim()) {
      toast({
        title: 'Error',
        description: 'Package name is required',
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
        response.data.data
      ) {
        setPackageDetails(response.data.data)
        setPackageNodeType(nodeType)
        setIsViewingPackage(true)

        const successMessage = 'Success'
        toast({
          title: 'Success',
          description: successMessage,
        })
      } else if (response.data.code === 'package_not_found') {
        setPendingPackageInit({ packageName, nodeType })
        setShowPackageInitModal(true)
      } else {
        const errorMessage = 'An error occurred'
        toast({
          title: 'Error',
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
        errorMessage = 'An error occurred'
      }

      toast({
        title: 'Error',
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
        const successMessage = 'Success'
        toast({
          title: 'Package Initialized',
          description: successMessage,
        })
        setShowPackageInitModal(false)
        setPendingPackageInit(null)
      } else {
        const errorMessage = 'An error occurred'
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error initializing package:', error)

      let errorMessage = 'Failed to initialize package'
      if (error instanceof APIError && error.code) {
        errorMessage = 'An error occurred'
      }

      toast({
        title: 'Error',
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
