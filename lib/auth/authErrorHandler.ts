import { APIError } from '@/lib/utils'

export function handleAuthError(error: any): {
  isAuthError: boolean
  shouldRedirect: boolean
  message: string
} {
  if (error instanceof APIError) {
    if (error.status === 401) {
      return {
        isAuthError: true,
        shouldRedirect: error.detail === 'TOKEN_EXPIRED',
        message: error.message || 'Authentication required',
      }
    }

    if (error.status === 403) {
      return {
        isAuthError: true,
        shouldRedirect: false,
        message: 'Access denied',
      }
    }
  }

  if (
    error?.message?.includes('Session expired') ||
    error?.message?.includes('Authentication expired')
  ) {
    return {
      isAuthError: true,
      shouldRedirect: true,
      message: 'Session expired',
    }
  }

  return {
    isAuthError: false,
    shouldRedirect: false,
    message: error?.message || 'An error occurred',
  }
}

export async function withAuthErrorHandling<T>(
  apiCall: () => Promise<T>,
  onAuthError?: (_error: any) => void
): Promise<T> {
  try {
    return await apiCall()
  } catch (error) {
    const authErrorInfo = handleAuthError(error)

    if (authErrorInfo.isAuthError) {
      if (authErrorInfo.shouldRedirect && typeof window !== 'undefined') {
        window.location.href = '/login'
      }

      if (onAuthError) {
        onAuthError(error)
      }
    }

    throw error
  }
}
