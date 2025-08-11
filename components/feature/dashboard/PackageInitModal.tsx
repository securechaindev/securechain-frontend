import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import type { PackageInitData } from '@/types'

interface PackageInitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingPackageInit: PackageInitData | null
  depexLoading: boolean
  translations: Record<string, any>
  onInitialize: () => void
  onCancel: () => void
}

export default function PackageInitModal({
  open,
  onOpenChange,
  pendingPackageInit,
  depexLoading,
  translations,
  onInitialize,
  onCancel
}: PackageInitModalProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.initializePackageModalTitle}</DialogTitle>
          <DialogDescription>
            {translations.initializePackageModalDescription.replace('{packageName}', pendingPackageInit?.packageName || '')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Button onClick={onInitialize} disabled={depexLoading}>
            {depexLoading ? translations.initializingPackage : translations.initializePackageButton}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {translations.cancelButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
