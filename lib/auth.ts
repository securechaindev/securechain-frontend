import { API_ENDPOINTS } from '@/constants'

export async function isTokenExpired(): Promise<boolean> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.CHECK_TOKEN, {
      method: 'GET',
      credentials: 'include',
    })

    return !response.ok
  } catch {
    return true
  }
}

export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean
  tokenValid: boolean
}> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.CHECK_TOKEN, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      return {
        isAuthenticated: true,
        tokenValid: data.valid || true,
      }
    }

    return {
      isAuthenticated: false,
      tokenValid: false,
    }
  } catch {
    return {
      isAuthenticated: false,
      tokenValid: false,
    }
  }
}

export async function refreshAccessToken(): Promise<{
  accessToken?: string
  refreshToken?: string
  success: boolean
}> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      method: 'POST',
      credentials: 'include',
    })

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return { success: false }
      }

      try {
        const data = await response.json()
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          success: true,
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError)
        return { success: false }
      }
    } else {
      return { success: false }
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return { success: false }
  }
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    credentials: 'include',
  })

  if (response.status === 401) {
    const refreshResult = await refreshAccessToken()

    if (refreshResult.success) {
      response = await fetch(url, {
        ...options,
        credentials: 'include',
      })
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Session expired')
    }
  }

  return response
}

export function useAuthenticatedFetch() {
  return authenticatedFetch
}
