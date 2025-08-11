'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

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
}

interface PackageContextType {
  packageDetails: PackageDetails | null
  setPackageDetails: (data: PackageDetails | null) => void
  isViewingPackage: boolean
  setIsViewingPackage: (viewing: boolean) => void
}

const PackageContext = createContext<PackageContextType | undefined>(undefined)

export function PackageProvider({ children }: { children: ReactNode }) {
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null)
  const [isViewingPackage, setIsViewingPackage] = useState(false)

  return (
    <PackageContext.Provider
      value={{
        packageDetails,
        setPackageDetails,
        isViewingPackage,
        setIsViewingPackage,
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
