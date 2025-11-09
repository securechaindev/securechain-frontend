import { useState } from 'react'
import { vexgenAPI } from '@/lib/api/apiClient'
import { useToast } from '@/hooks/ui/useToast'
import { APIError } from '@/lib/utils'

interface UseVEXGenReturn {
  generateVEXTIX: (request: { owner: string; name: string }) => Promise<void>
  isLoading: boolean
  error: string | null
}

interface UseVEXGenProps {
  translations?: Record<string, any>
}

export const useVEXGen = (props?: UseVEXGenProps): UseVEXGenReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const generateVEXTIX = async (request: { owner: string; name: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await vexgenAPI.generateVEXTIX(request)

      if (response.data instanceof Blob) {
        // Handle file download
        const blob = response.data
        const filename =
          response.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] ||
          'vex_tix_sbom.zip'

        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: 'Success',
          description: 'VEX and TIX files generated and downloaded successfully',
          variant: 'default',
        })
      } else {
        toast({
          title: 'Success',
          description: 'VEX and TIX generation completed',
          variant: 'default',
        })
      }
    } catch (err: any) {
      let errorMessage = err?.message || 'Failed to generate VEX and TIX files'

      if (err?.status === 404) {
        const code = err?.code || err?.data?.code
        if (code === 'sbom_not_found' || code === 'repository_not_found' || !code) {
          errorMessage = props?.translations?.sbomNotFoundError
        }
      }

      setError(errorMessage)

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateVEXTIX,
    isLoading,
    error,
  }
}
