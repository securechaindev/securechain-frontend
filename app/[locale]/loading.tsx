import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  )
}
