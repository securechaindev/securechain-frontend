'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export function ArchitectureDiagram() {
  const { resolvedTheme } = useTheme()

  return (
    <>
      {resolvedTheme === 'dark' ? (
        <Image
          src="/images/architecture-dark.png"
          alt="Secure Chain System Architecture Diagram Dark Mode"
          width={1000}
          height={500}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      ) : (
        <Image
          src="/images/architecture-light.png"
          alt="Secure Chain System Architecture Diagram Light Mode"
          width={1000}
          height={500}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      )}
    </>
  )
}
