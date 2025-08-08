import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include', // Incluir cookies del backend
    })

    const data = await response.json()

    console.log('=== LOGIN SUCCESS DEBUG ===')
    console.log('Login response from FastAPI:', {
      status: response.status,
      has_access_token: !!data.access_token,
      access_token_length: data.access_token?.length,
      has_refresh_token: !!data.refresh_token,
      refresh_token_length: data.refresh_token?.length,
      setCookieHeader: response.headers.get('set-cookie'),
      all_response_headers: Array.from(response.headers.entries()),
      response_data_keys: Object.keys(data),
      full_data: data
    })

    if (response.ok) {
      // Con la nueva implementación segura, no esperamos access_token en JSON
      const nextResponse = NextResponse.json(data, { status: response.status })

      // Configurar cookies con la misma configuración que FastAPI pero adaptada al entorno
      const isProduction = process.env.NODE_ENV === 'production'
      
      console.log('Setting cookies with config:', {
        isDevelopment: !isProduction,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
      })
      
      // Extraer tokens de las cookies que FastAPI envía
      const setCookieHeader = response.headers.get('set-cookie')
      let accessToken = data.access_token // Fallback para compatibilidad
      let refreshToken = data.refresh_token // Fallback para compatibilidad
      
      if (setCookieHeader) {
        const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/)
        const refreshTokenMatch = setCookieHeader.match(/refresh_token=([^;]+)/)
        
        if (accessTokenMatch) {
          accessToken = accessTokenMatch[1]
          console.log('Access token extracted from FastAPI set-cookie header')
        }
        
        if (refreshTokenMatch) {
          refreshToken = refreshTokenMatch[1]
          console.log('Refresh token extracted from FastAPI set-cookie header')
        }
      }
      
      if (accessToken) {
        nextResponse.cookies.set('access_token', accessToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
          path: '/',
          maxAge: 60 * 15, // 15 minutos
        })
        console.log('Access token cookie set successfully')
      }

      if (refreshToken) {
        nextResponse.cookies.set('refresh_token', refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 días
        })
        console.log('Refresh token cookie set successfully')
      }
      
      console.log('=== END LOGIN DEBUG ===')

      return nextResponse
    } else {
      const responseHeaders = new Headers()
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        responseHeaders.set('set-cookie', setCookieHeader)
      }

      return NextResponse.json(data, {
        status: response.status,
        headers: responseHeaders,
      })
    }
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      {
        valid: false,
        code: 'network_error',
        message: getTranslation(t, 'authApiErrors.networkError'),
      },
      { status: 500 }
    )
  }
}
