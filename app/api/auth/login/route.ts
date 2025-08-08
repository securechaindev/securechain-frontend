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
      credentials: 'include',
    })

    const data = await response.json()

    if (response.ok) {
      const nextResponse = NextResponse.json(data, { status: response.status })
      
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        nextResponse.headers.set('Set-Cookie', setCookieHeader)
      }

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
      { status: 503 }
    )
  }
}
