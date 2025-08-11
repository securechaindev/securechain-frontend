import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '@/lib/server-i18n'
import { withAuth } from '@/lib/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { t } = getApiTranslations(request)

  return withAuth(request, async authToken => {
    try {
      const { userId } = await params

      const response = await fetch(`${BACKEND_URL}/depex/graph/repositories/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error('User repositories API error:', error)
      return NextResponse.json(
        {
          code: 'network_error',
          message: getTranslation(t, 'depexApiErrors.networkError'),
        },
        { status: 500 }
      )
    }
  })
}
