import { useState } from 'react'
import { vexgenAPI } from '@/lib/api/apiClient'
import { useToast } from '@/hooks/ui/useToast'

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

    toast({
      title: props?.translations?.successTitle || props?.translations?.success || 'Success',
      description:
        props?.translations?.vexTixGenerationStarted ||
        'VEX and TIX generation started. This may take a few minutes.',
      variant: 'default',
    })

    vexgenAPI
      .generateVEXTIX(request)
      .then(response => {
        if (response.data instanceof Blob) {
          const blob = response.data
          const filename =
            response.headers.get('content-disposition')?.match(/filename="(.+)"/)?.[1] ||
            'vex_tix_sbom.zip'

          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          toast({
            title: props?.translations?.successTitle || props?.translations?.success || 'Success',
            description:
              props?.translations?.vexTixGenerationSuccess ||
              'VEX and TIX files generated and downloaded successfully',
            variant: 'default',
          })
        } else {
          toast({
            title: props?.translations?.successTitle || props?.translations?.success || 'Success',
            description:
              props?.translations?.vexTixGenerationComplete || 'VEX and TIX generation completed',
            variant: 'default',
          })
        }
      })
      .catch((err: any) => {
        let errorMessage = err?.message || 'Failed to generate VEX and TIX files'

        if (err?.status === 404) {
          const code = err?.code || err?.data?.code
          if (code === 'sbom_not_found' || code === 'repository_not_found' || !code) {
            errorMessage =
              props?.translations?.sbomNotFoundError || 'SBOM not found for this repository'
          }
        }

        setError(errorMessage)

        toast({
          title: props?.translations?.errorTitle || props?.translations?.error || 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })

    setIsLoading(false)
  }

  return {
    generateVEXTIX,
    isLoading,
    error,
  }
}
