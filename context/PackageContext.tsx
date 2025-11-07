'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import type { NodeType } from '@/types'

interface PackageVersion {
  weighted_mean: number
  name: string
  release_date?: string
  mean: number
  vulnerabilities: string[]
  serial_number: number
}

interface PackageDetails {
  versions: PackageVersion[]
  vendor: string
  moment: string
  name: string
  import_name: string
  repository_url?: string
}

interface PackageContextType {
  packageDetails: PackageDetails | null
  setPackageDetails: (data: PackageDetails | null) => void
  isViewingPackage: boolean
  setIsViewingPackage: (viewing: boolean) => void
  packageNodeType: NodeType | null
  setPackageNodeType: (nodeType: NodeType | null) => void
}

const PackageContext = createContext<PackageContextType | undefined>(undefined)

export function PackageProvider({ children }: { children: ReactNode }) {
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null)
  const [isViewingPackage, setIsViewingPackage] = useState(false)
  const [packageNodeType, setPackageNodeType] = useState<NodeType | null>(null)

  return (
    <PackageContext.Provider
      value={{
        packageDetails,
        setPackageDetails,
        isViewingPackage,
        setIsViewingPackage,
        packageNodeType,
        setPackageNodeType,
      }}
    >
      {children}
    </PackageContext.Provider>
  )
}

export function usePackage() {
  const context = useContext(PackageContext)
  if (context === undefined) {
    throw new Error('usePackage must be used within a PackageProvider')
  }
  return context
}
