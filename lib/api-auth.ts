import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from './server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

interface TokenRefreshResult {
  accessToken?: string
  refreshToken?: string
  success: boolean
}

export async function refreshAccessTokenApi(refreshToken?: string): Promise<TokenRefreshResult> {
  try {
    // Si no se proporciona refreshToken, intentar usar el endpoint Next.js que maneja las cookies
    if (!refreshToken) {
      const response = await fetch('/api/auth/refresh_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          success: true,
        }
      }
      
      return { success: false }
    }

    // Si se proporciona refreshToken, llamar directamente al backend
    const response = await fetch(`${BACKEND_URL}/auth/refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        success: true,
      }
    }
    
    return { success: false }
  } catch (error) {
    console.error('Error refreshing token in API:', error)
    return { success: false }
  }
}

export async function checkTokenValidity(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/check_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: accessToken}),
    })

    return response.ok
  } catch (error) {
    console.error('Error checking token validity:', error)
    return false
  }
}

export async function getValidTokenFromRequest(request: NextRequest): Promise<{
  token: string | null
  response: NextResponse | null
  refreshed: boolean
  newAccessToken?: string
  newRefreshToken?: string
}> {
  const { t } = getApiTranslations(request)
  
  // Obtener tokens de headers o cookies
  let authHeader = request.headers.get('authorization')
  const accessTokenCookie = request.cookies.get('access_token')?.value
  const refreshTokenCookie = request.cookies.get('refresh_token')?.value

  // Si no hay header pero sí cookie, construir el header
  if (!authHeader && accessTokenCookie) {
    authHeader = `Bearer ${accessTokenCookie}`
  }

  if (!authHeader) {
    return {
      token: null,
      response: NextResponse.json(
        { error: getTranslation(t, 'authApiErrors.unauthorized') },
        { status: 401 }
      ),
      refreshed: false,
    }
  }

  // Extraer el token del header
  const accessToken = authHeader.replace('Bearer ', '')

  // Verificar si el token es válido
  const isValid = await checkTokenValidity(accessToken)

  console.log('Token validity check:', isValid, accessToken.substring(0, 10) + '...')
  
  if (isValid) {
    return {
      token: authHeader,
      response: null,
      refreshed: false,
    }
  }

  console.log('Refresh token cookie:', refreshTokenCookie ? 'Present' : 'Not found')

  // Si el token no es válido, intentar renovarlo
  if (refreshTokenCookie) {
    const refreshResult = await refreshAccessTokenApi(refreshTokenCookie)
    
    if (refreshResult.success && refreshResult.accessToken) {
      return {
        token: `Bearer ${refreshResult.accessToken}`,
        response: null,
        refreshed: true,
        newAccessToken: refreshResult.accessToken,
        newRefreshToken: refreshResult.refreshToken,
      }
    }
  }

  // Si no se pudo renovar, devolver error de autorización
  return {
    token: null,
    response: NextResponse.json(
      { error: getTranslation(t, 'authApiErrors.tokenExpired') },
      { status: 401 }
    ),
    refreshed: false,
  }
}

export function setTokenCookiesInResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string
): NextResponse {
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutos
  })

  if (refreshToken) {
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })
  }

  return response
}

// Wrapper para manejar automáticamente la renovación de tokens en endpoints
export async function withTokenRefresh(
  request: NextRequest,
  handler: (_authToken: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const { token, response: errorResponse, refreshed, newAccessToken, newRefreshToken } = await getValidTokenFromRequest(request)
  
  if (errorResponse) {
    return errorResponse
  }

  // Ejecutar el handler con el token válido
  const response = await handler(token!)
  
  // Si el token fue renovado, actualizar las cookies en la respuesta
  if (refreshed && newAccessToken) {
    setTokenCookiesInResponse(response, newAccessToken, newRefreshToken)
  }

  return response
}
