'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { RequirementOperations } from '@/components/feature/diagrams'

interface RequirementOperationsModalProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  repositoryPath: string
  requirementFile: string
  requirementFileName: string
  repositoryName: string
  fileManager?: string
  translations: Record<string, any>
}

export function RequirementOperationsModal({
  open,
  onOpenChange,
  repositoryPath,
  requirementFile,
  requirementFileName,
  repositoryName,
  fileManager,
  translations,
}: RequirementOperationsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{translations.docs?.requirementOperations?.operationTitle}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {repositoryName} / {requirementFileName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <RequirementOperations
          repositoryPath={repositoryPath}
          requirementFile={requirementFile}
          requirementFileName={requirementFileName}
          fileManager={fileManager}
          translations={translations}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
