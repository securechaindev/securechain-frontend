import { Badge } from '@/components/ui'
import { Lock } from 'lucide-react'

interface EndpointCardProps {
  endpoint: {
    method: string
    path: string
    summary: string
    description: string
    auth?: boolean
  }
  index: number
  t: any
}

export const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, index, t }) => {
  const getMethodColorClasses = (method: string): string => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700'
      case 'POST':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
      case 'PUT':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700'
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700'
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'
    }
  }

  const methodColorClasses = getMethodColorClasses(endpoint.method)

  return (
    <div key={index} className="border rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${methodColorClasses}`}
          >
            {endpoint.method}
          </span>
          <code className="text-xs sm:text-sm font-mono break-all">{endpoint.path}</code>
        </div>
        {endpoint.auth && (
          <Badge variant="outline" className="gap-1 text-xs w-fit">
            <Lock className="h-3 w-3" />
            <span className="hidden sm:inline">{t.docs.authRequired}</span>
            <span className="sm:hidden">{t.docs.auth}</span>
          </Badge>
        )}
      </div>
      <h4 className="font-semibold mb-1 text-sm sm:text-base">{endpoint.summary}</h4>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {endpoint.description}
      </p>
    </div>
  )
}
