import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

async function handleTokenCheck(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    let authHeader = request.headers.get('authorization')
    const accessToken = request.cookies.get('access_token')?.value

    if (!authHeader && accessToken) {
      authHeader = `Bearer ${accessToken}`
    }

    if (!authHeader) {
      return NextResponse.json(
        {
          valid: false,
          code: 'missing_token',
          message: getTranslation(t, 'authApiErrors.unauthorized'),
        },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    const response = await fetch(`${BACKEND_URL}/auth/check_token`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
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

export async function GET(request: NextRequest) {
  return handleTokenCheck(request)
}

export async function POST(request: NextRequest) {
  return handleTokenCheck(request)
}
