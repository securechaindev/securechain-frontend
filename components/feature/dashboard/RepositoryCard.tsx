'use client'

import { Badge, Button } from '@/components/ui'
import { Package, CheckCircle, XCircle, Settings } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Repository, RequirementFile } from '@/types'
import { RequirementOperationsModal } from './RequirementOperationsModal'

const GitHubIcon = dynamic(
  () => import('react-icons/si').then(mod => ({ default: mod.SiGithub })),
  {
    ssr: false,
    loading: () => <div className="h-6 w-6 animate-pulse bg-muted rounded" />,
  }
)

interface RepositoryCardProps {
  repository: Repository
  translations: Record<string, any>
}

export default function RepositoryCard({ repository, translations }: RepositoryCardProps) {
  const [selectedFile, setSelectedFile] = useState<RequirementFile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOperationsClick = (file: RequirementFile) => {
    setSelectedFile(file)
    setIsModalOpen(true)
  }

  return (
    <div className="border rounded-lg p-3 sm:p-4 bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <GitHubIcon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm sm:text-lg break-all">
            <span className="text-muted-foreground">{repository.owner}/</span>
            <span>{repository.name}</span>
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={repository.is_complete ? 'default' : 'secondary'} className="text-xs">
              {repository.is_complete ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{translations.complete}</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{translations.incomplete}</span>
                  <span className="sm:hidden">✗</span>
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {repository.requirement_files && repository.requirement_files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {translations.requirementFiles} ({repository.requirement_files.length})
            </span>
            <span className="sm:hidden">
              {translations.files} ({repository.requirement_files.length})
            </span>
          </h4>
          <div className="grid gap-2">
            {repository.requirement_files.map((file, fileIndex) => (
              <div
                key={fileIndex}
                className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-md border"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="font-mono text-xs sm:text-sm truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <Badge variant="outline" className="text-xs">
                    {file.manager}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOperationsClick(file)}
                    className="h-6 w-6 p-0 sm:h-8 sm:w-auto sm:px-2"
                    title={translations.docs?.requirementOperations?.analyzeRequirements}
                  >
                    <Settings className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline text-xs">
                      {translations.docs?.requirementOperations?.analyze}
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!repository.requirement_files || repository.requirement_files.length === 0) && (
        <div className="mt-4 p-3 bg-muted/30 rounded-md border border-dashed">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            <span className="hidden sm:inline">{translations.noRequirementFilesFound}</span>
            <span className="sm:hidden">{translations.noFilesFound}</span>
          </p>
        </div>
      )}

      {/* Requirement Operations Modal */}
      <RequirementOperationsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        repositoryPath={`${repository.owner}/${repository.name}`}
        requirementFile={selectedFile?.requirement_file_id || ''}
        requirementFileName={selectedFile?.name || ''}
        repositoryName={`${repository.owner}/${repository.name}`}
        fileManager={selectedFile?.manager || ''}
        translations={translations}
      />
    </div>
  )
}
