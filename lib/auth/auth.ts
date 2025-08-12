import { authAPI, apiClient } from '@/lib/api'

export async function isTokenExpired(): Promise<boolean> {
  try {
    await authAPI.checkToken()
    return false
  } catch {
    return true
  }
}

export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean
  tokenValid: boolean
}> {
  try {
    const response = await authAPI.checkToken()

    return {
      isAuthenticated: true,
      tokenValid: response.data.valid || true,
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
    const response = await authAPI.refreshToken()

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      success: true,
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
  try {
    const endpoint = url.replace(apiClient['config'].baseURL, '')
    const response = await apiClient.request(endpoint, {
      method: (options.method as any) || 'GET',
      headers: options.headers as Record<string, string>,
      body: options.body,
      signal: options.signal || undefined,
    })

    const responseInit: ResponseInit = {
      status: response.status,
      statusText: response.ok ? 'OK' : 'Error',
      headers: response.headers,
    }

    return new Response(JSON.stringify(response.data), responseInit)
  } catch (error) {
    console.warn('Using fallback fetch due to error:', error)
    return fetch(url, {
      ...options,
      credentials: 'include',
    })
  }
}

export function useAuthenticatedFetch() {
  return authenticatedFetch
}
