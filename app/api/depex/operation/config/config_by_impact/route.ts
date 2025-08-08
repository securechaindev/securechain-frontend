import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    const { searchParams } = new URL(request.url)
    const authHeader = request.headers.get('authorization')

    const response = await fetch(
      `${BACKEND_URL}/depex/operation/config/config_by_impact?${searchParams}`,
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
    console.error('Config by impact API error:', error)
    return NextResponse.json(
      {
        error: getTranslation(t, 'depexApiErrors.networkError'),
      },
      { status: 500 }
    )
  }
}
