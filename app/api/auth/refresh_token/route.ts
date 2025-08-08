import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    const body = await request.json().catch(() => ({}))
    const authHeader = request.headers.get('authorization')
    
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
        'Cookie': `refresh_token=${refreshToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    const data = await response.json()

    if (response.ok) {
      const nextResponse = NextResponse.json(data, { status: response.status })
      
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        nextResponse.headers.set('Set-Cookie', setCookieHeader)
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
      { status: 503 }
    )
  }
}
