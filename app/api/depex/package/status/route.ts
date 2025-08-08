import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const packageName = searchParams.get('packageName')
    const authHeader = request.headers.get('authorization')

    const response = await fetch(
      `${BACKEND_URL}/depex/package/status?userId=${userId}&packageName=${packageName}`,
      {
        method: 'GET',
        headers: {
          Authorization: authHeader || '',
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Package status API error:', error)
    return NextResponse.json(
      {
        code: 'network_error',
        message: getTranslation(t, 'depexApiErrors.networkError'),
      },
      { status: 500 }
    )
  }
}
