'use client'

import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { XCircleIcon, AlertTriangleIcon } from 'lucide-react'

interface ErrorDisplayProps {
  results: {
    type: string
    data: any
  }

}

export function ErrorDisplay({ results }: ErrorDisplayProps) {
  const errorCode = results.data?.code || results.data?.detail

  if (errorCode === 'memory_out') {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>'Memory limit exceeded'</div>
            <div className="text-sm text-muted-foreground">
              'Try reducing the depth or filtering dependencies'
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (errorCode === 'smt_timeout') {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>'SMT operation timed out'</div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Handle generic errors
  let errorMessage = ''
  let suggestion = ''

  const isMemoryError =
    results.data?.message?.includes('Insufficient Storage') ||
    results.data?.message?.includes('507') ||
    results.data?.message?.includes('Service temporarily unavailable')

  if (isMemoryError) {
    errorMessage = 'Memory limit exceeded'
    suggestion = 'Try reducing the depth or filtering dependencies'
  } else if (
    results.data?.message?.includes('Request failed') ||
    results.data?.message?.includes('Network error')
  ) {
    errorMessage = 'Network error'
    suggestion = 'Please check your connection and try again'
  } else {
    errorMessage =
      results.data?.message ||
      'Error'
  }

  return (
    <Alert variant="destructive">
      <XCircleIcon className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <div>{errorMessage}</div>
          {suggestion && <div className="text-sm text-muted-foreground">{suggestion}</div>}
        </div>
      </AlertDescription>
    </Alert>
  )
}
