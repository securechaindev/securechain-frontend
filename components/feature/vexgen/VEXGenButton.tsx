'use client'

import { Button } from '@/components/ui'
import { FileText } from 'lucide-react'
import { useVEXGen } from '@/hooks/api/useVEXTIXGeneneration'

interface VEXGenButtonProps {
  owner: string
  name: string
  translations: Record<string, any>
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

export const VEXGenButton: React.FC<VEXGenButtonProps> = ({
  owner,
  name,
  translations,
  className = '',
  size = 'sm',
  variant = 'outline',
}) => {
  const { generateVEXTIX, isLoading } = useVEXGen({ translations })

  const handleClick = async () => {
    await generateVEXTIX({ owner, name })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      variant={variant}
      className={className}
      title={`Generate VEX/TIX for ${owner}/${name}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1 sm:mr-2"></div>
          <span className="hidden sm:inline text-xs">
            {translations?.generatingVexTix || 'Generating...'}
          </span>
          <span className="sm:hidden">...</span>
        </>
      ) : (
        <>
          <FileText className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline text-xs">
            {translations?.generateVexTixButton || 'Generate VEX/TIX'}
          </span>
        </>
      )}
    </Button>
  )
}
