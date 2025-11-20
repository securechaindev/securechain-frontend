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

  onInitialize: () => void
  onCancel: () => void
}

export default function PackageInitModal({
  open,
  onOpenChange,
  pendingPackageInit,
  depexLoading,
  onInitialize,
  onCancel,
}: PackageInitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 rounded-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl leading-tight">Initialize Package</DialogTitle>
          <DialogDescription className="text-sm sm:text-base leading-relaxed">
            {'Initialize package analysis'.replace(
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
              {depexLoading ? 'Initializing...' : 'Initialize'}
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto order-1 sm:order-2"
            size="sm"
          >
            <span className="text-xs sm:text-sm">Cancel</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
