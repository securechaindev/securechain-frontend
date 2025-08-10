import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../server-i18n'
import { POST as refreshTokenRoute } from '../../app/api/auth/refresh_token/route'

const BACKEND_URL = process.env.BACKEND_URL

interface TokenRefreshResult {
  success: boolean
  newToken?: string
  response?: Response
}

export async function refreshAccessTokenApi(request: NextRequest): Promise<TokenRefreshResult> {
  try {
    // Llamar directamente al route handler de Next.js
    const response = await refreshTokenRoute(request)

    if (response.ok) {
      // Si el refresh fue exitoso, intentar extraer el nuevo token de las cookies de la respuesta
      const setCookieHeader = response.headers.get('set-cookie')
      let newToken: string | undefined

      if (setCookieHeader) {
        // Buscar el access_token en el set-cookie header
        const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/)
        if (accessTokenMatch) {
          newToken = accessTokenMatch[1]
        }
      }

      return {
        success: true,
        newToken,
        response, // Pasar la respuesta completa para acceder a las cookies
      }
    }

    return {
      success: false,
    }
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
      body: JSON.stringify({ token: accessToken }),
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
  refreshResponse?: Response
}> {
  const { t } = getApiTranslations(request)

  // Obtener token de headers o cookies
  let authHeader = request.headers.get('authorization')
  const accessTokenCookie = request.cookies.get('access_token')?.value
  const refreshTokenCookie = request.cookies.get('refresh_token')?.value

  // Si no hay header pero sí cookie, construir el header
  if (!authHeader && accessTokenCookie) {
    authHeader = `Bearer ${accessTokenCookie}`
  }

  // Si no hay token de acceso pero sí refresh token, intentar refrescar primero
  if (!authHeader && refreshTokenCookie) {
    const refreshResult = await refreshAccessTokenApi(request)

    if (refreshResult.success && refreshResult.newToken) {
      authHeader = `Bearer ${refreshResult.newToken}`
      // Necesitamos retornar indicando que se refrescó para propagar las cookies
      return {
        token: authHeader,
        response: null,
        refreshed: true,
        refreshResponse: refreshResult.response,
      }
    } else {
      return {
        token: null,
        response: NextResponse.json(
          { error: getTranslation(t, 'authApiErrors.tokenExpired') },
          { status: 401 }
        ),
        refreshed: false,
      }
    }
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

  if (isValid) {
    return {
      token: authHeader,
      response: null,
      refreshed: false,
    }
  }

  // Si el token no es válido, intentar renovarlo
  if (refreshTokenCookie) {
    const refreshResult = await refreshAccessTokenApi(request)

    if (refreshResult.success) {
      // Si tenemos el nuevo token, usarlo
      if (refreshResult.newToken) {
        const newAuthHeader = `Bearer ${refreshResult.newToken}`
        return {
          token: newAuthHeader,
          response: null,
          refreshed: true,
          refreshResponse: refreshResult.response,
        }
      } else {
        return {
          token: authHeader,
          response: null,
          refreshed: true,
          refreshResponse: refreshResult.response,
        }
      }
    }
  }

  return {
    token: null,
    response: NextResponse.json(
      { error: getTranslation(t, 'authApiErrors.tokenExpired') },
      { status: 401 }
    ),
    refreshed: false,
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (_authToken: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const {
    token,
    response: errorResponse,
    refreshed,
    refreshResponse,
  } = await getValidTokenFromRequest(request)

  if (errorResponse) {
    return errorResponse
  }

  // Ejecutar el handler con el token válido
  const response = await handler(token!)

  // Si el token fue renovado, propagar las cookies del refresh a la respuesta final
  if (refreshed && refreshResponse) {
    const setCookieHeader = refreshResponse.headers.get('set-cookie')
    if (setCookieHeader) {
      response.headers.set('Set-Cookie', setCookieHeader)
    }
  }

  return response
}
