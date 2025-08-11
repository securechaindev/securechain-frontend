'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export function OverviewDiagram() {
  const { resolvedTheme } = useTheme()

  return (
    <>
      {resolvedTheme === 'dark' ? (
        <Image
          src="/images/overview-dark.png"
          alt="Secure Chain Workflow Diagram Dark Mode"
          width={800}
          height={450}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      ) : (
        <Image
          src="/images/overview-light.png"
          alt="Secure Chain Workflow Diagram Light Mode"
          width={800}
          height={450}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      )}
    </>
  )
}
