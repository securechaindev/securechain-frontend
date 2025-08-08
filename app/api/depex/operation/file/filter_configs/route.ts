import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    const body = await request.json()
    const authHeader = request.headers.get('authorization')

    const response = await fetch(`${BACKEND_URL}/depex/operation/file/filter_configs`, {
      method: 'POST',
      headers: {
        Authorization: authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Filter configs API error:', error)
    return NextResponse.json(
      {
        code: 'network_error',
        message: getTranslation(t, 'depexApiErrors.networkError'),
      },
      { status: 500 }
    )
  }
}
