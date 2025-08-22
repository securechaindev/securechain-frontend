'use client'

import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { XCircleIcon, AlertTriangleIcon } from 'lucide-react'

interface ErrorDisplayProps {
  results: {
    type: string
    data: any
  }
  translations: Record<string, any>
}

export function ErrorDisplay({ results, translations }: ErrorDisplayProps) {
  if (results.data?.detail === 'memory_out') {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>{translations.docs?.requirementOperations?.memoryOut}</div>
            <div className="text-sm text-muted-foreground">
              {translations.docs?.requirementOperations?.memoryOutSuggestion}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (results.data?.detail === 'smt_timeout') {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div>{translations.docs?.requirementOperations?.smtTimeout}</div>
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
    errorMessage = translations.docs?.requirementOperations?.memoryOut
    suggestion = translations.docs?.requirementOperations?.memoryOutSuggestion
  } else if (
    results.data?.message?.includes('Request failed') ||
    results.data?.message?.includes('Network error')
  ) {
    errorMessage = translations.docs?.requirementOperations?.networkError
    suggestion = translations.docs?.requirementOperations?.networkErrorSuggestion
  } else {
    errorMessage =
      results.data?.message ||
      translations.httpError ||
      translations.errorTitle ||
      translations.error ||
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
