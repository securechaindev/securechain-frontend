import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '@/lib/server-i18n'
import { withAuth } from '@/lib/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
  const { t } = getApiTranslations(request)

  return withAuth(request, async authToken => {
    try {
      const body = await request.json()

      const response = await fetch(`${BACKEND_URL}/auth/change_password`, {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (error) {
      console.error('Change password API error:', error)
      return NextResponse.json(
        {
          code: 'network_error',
          message: getTranslation(t, 'authApiErrors.networkError'),
        },
        { status: 500 }
      )
    }
  })
}
