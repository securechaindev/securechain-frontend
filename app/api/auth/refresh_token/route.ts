import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    const body = await request.json().catch(() => ({}))
    const authHeader = request.headers.get('authorization')
    
    // Obtener refresh token del body o de las cookies
    const refreshToken = body.refresh_token || request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        {
          code: 'missing_refresh_token',
          message: getTranslation(t, 'authApiErrors.refreshTokenRequired'),
        },
        { status: 401 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/auth/refresh_token`, {
      method: 'POST',
      headers: {
        Authorization: authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    const data = await response.json()

    if (response.ok && data.access_token) {
      // Crear respuesta con las nuevas cookies
      const nextResponse = NextResponse.json(data, { status: response.status })
      
      // Configurar cookies con la misma configuración que FastAPI pero adaptada al entorno
      const isProduction = process.env.NODE_ENV === 'production'
      
      nextResponse.cookies.set('access_token', data.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 15, // 15 minutos
      })

      if (data.refresh_token) {
        nextResponse.cookies.set('refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 días
        })
      }

      return nextResponse
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Refresh token API error:', error)
    return NextResponse.json(
      {
        code: 'network_error',
        message: getTranslation(t, 'authApiErrors.networkError'),
      },
      { status: 500 }
    )
  }
}
