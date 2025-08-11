import { toast } from '@/hooks/ui'
import { HTTP_STATUS } from '@/constants'
import { BaseError, APIError, ValidationError, NetworkError, AuthenticationError } from './errors'

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  sessionId?: string
  timestamp?: Date
  metadata?: Record<string, any>
}

export interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  rethrow?: boolean
  fallbackMessage?: string
  onError?: (_error: BaseError, _context?: ErrorContext) => void
}

class ErrorHandler {
  private defaultOptions: ErrorHandlerOptions = {
    showToast: true,
    logError: true,
    rethrow: false,
    fallbackMessage: 'An unexpected error occurred',
  }

  public handle(error: unknown, context?: ErrorContext, options?: ErrorHandlerOptions): void {
    const opts = { ...this.defaultOptions, ...options }
    const processedError = this.processError(error)

    if (opts.logError) {
      this.logError(processedError, context)
    }

    if (opts.showToast) {
      this.showErrorToast(processedError, opts.fallbackMessage!)
    }

    if (opts.onError) {
      opts.onError(processedError, context)
    }

    if (opts.rethrow) {
      throw processedError
    }
  }

  private processError(error: unknown): BaseError {
    if (error instanceof BaseError) {
      return error
    }

    if (error instanceof Error) {
      // Check if it's a fetch-related error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return new NetworkError('Network connection failed', error)
      }

      // Check if it's a timeout error
      if (error.message.includes('timeout')) {
        return new NetworkError('Request timeout', error)
      }

      // Convert generic Error to BaseError
      return new BaseError('UnknownError', error.message, true)
    }

    // Handle string errors
    if (typeof error === 'string') {
      return new BaseError('StringError', error, true)
    }

    // Handle object errors (e.g., from API responses)
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as any

      if (errorObj.status && errorObj.message) {
        return new APIError(errorObj.status, errorObj.message, errorObj.code, errorObj.details)
      }

      return new BaseError('ObjectError', errorObj.message || 'Unknown error occurred', true)
    }

    return new BaseError('UnknownError', 'An unknown error occurred', true)
  }

  private logError(error: BaseError, context?: ErrorContext): void {
    const logData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      isOperational: error.isOperational,
      context,
      timestamp: new Date().toISOString(),
    }

    // Add specific error type data
    if (error instanceof APIError) {
      Object.assign(logData, {
        status: error.status,
        code: error.code,
        details: error.details,
      })
    }

    if (error instanceof ValidationError) {
      Object.assign(logData, {
        field: error.field,
        value: error.value,
      })
    }

    if (error instanceof NetworkError) {
      Object.assign(logData, {
        originalError: error.originalError?.message,
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
      if (context) {
        console.error('Context:', context)
      }
    }
  }

  private showErrorToast(error: BaseError, fallbackMessage: string): void {
    let title = 'Error'
    let description = fallbackMessage

    // Handle different error types
    if (error instanceof APIError) {
      const apiError = error as APIError
      switch (apiError.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          title = 'Authentication Error'
          description = 'Please log in again'
          break
        case HTTP_STATUS.FORBIDDEN:
          title = 'Access Denied'
          description = 'You do not have permission to perform this action'
          break
        case HTTP_STATUS.NOT_FOUND:
          title = 'Not Found'
          description = 'The requested resource was not found'
          break
        case HTTP_STATUS.CONFLICT:
          title = 'Conflict'
          description = apiError.message || 'A conflict occurred'
          break
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          title = 'Server Error'
          description = 'An internal server error occurred'
          break
        default:
          title = 'API Error'
          description = apiError.message || fallbackMessage
      }
    } else if (error instanceof ValidationError) {
      const validationError = error as ValidationError
      title = 'Validation Error'
      description = validationError.message
    } else if (error instanceof NetworkError) {
      title = 'Network Error'
      description = 'Please check your internet connection'
    } else if (error instanceof AuthenticationError) {
      const authError = error as AuthenticationError
      title = 'Authentication Error'
      description = authError.message
    } else {
      // For BaseError and other unknown errors
      title = 'Unknown Error'
      description = (error as BaseError).message || fallbackMessage
    }

    toast({
      variant: 'destructive',
      title,
      description,
    })
  }

  // Helper methods for common error scenarios
  public handleAPIResponse<T>(response: Response): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          const apiError = new APIError(
            response.status,
            errorData.message || response.statusText,
            errorData.code,
            errorData.details
          )

          reject(apiError)
          return
        }

        const data = await response.json()
        resolve(data)
      } catch (error) {
        reject(new NetworkError('Failed to parse API response', error as Error))
      }
    })
  }

  public async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    options?: ErrorHandlerOptions
  ): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      this.handle(error, context, options)
      return null
    }
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// Convenience functions
export const handleError = (
  error: unknown,
  context?: ErrorContext,
  options?: ErrorHandlerOptions
): void => {
  errorHandler.handle(error, context, options)
}

export const handleAsyncError = <T>(
  operation: () => Promise<T>,
  context?: ErrorContext,
  options?: ErrorHandlerOptions
): Promise<T | null> => {
  return errorHandler.handleAsyncOperation(operation, context, options)
}

export const handleAPIResponse = <T>(response: Response): Promise<T> => {
  return errorHandler.handleAPIResponse<T>(response)
}
