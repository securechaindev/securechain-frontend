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
  onOpenChange: (_open: boolean) => void
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
  onCancel,
}: PackageInitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 rounded-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl leading-tight">
            {translations.initializePackageModalTitle}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base leading-relaxed">
            {translations.initializePackageModalDescription.replace(
              '{packageName}',
              pendingPackageInit?.packageName || ''
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4">
          <Button
            onClick={onInitialize}
            disabled={depexLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
            size="sm"
          >
            <span className="text-xs sm:text-sm">
              {depexLoading
                ? translations.initializingPackage
                : translations.initializePackageButton}
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto order-1 sm:order-2"
            size="sm"
          >
            <span className="text-xs sm:text-sm">{translations.cancelButton}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
