import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../lib/server-i18n'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
  const { t } = getApiTranslations(request)

  try {
    console.log('=== LOGOUT API START ===')
    const authHeader = request.headers.get('authorization')
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    console.log('Logout request cookies:', {
      access_token: accessToken ? 'EXISTS' : 'NULL',
      refresh_token: refreshToken ? 'EXISTS' : 'NULL'
    })

    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: authHeader || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    const data = await response.json()
    console.log('FastAPI logout response:', {
      status: response.status,
      ok: response.ok
    })

    const nextResponse = NextResponse.json(data, { status: response.status })

    // Eliminar cookies de autenticación
    nextResponse.cookies.delete('access_token')
    nextResponse.cookies.delete('refresh_token')
    
    console.log('Cookies deleted from response')
    console.log('=== LOGOUT API END ===')

    return nextResponse
  } catch (error) {
    console.error('Logout API error:', error)
    console.log('Logout failed, still deleting cookies as fallback')
    const response = NextResponse.json(
      {
        code: 'network_error',
        message: getTranslation(t, 'authApiErrors.networkError'),
      },
      { status: 500 }
    )

    // Eliminar cookies incluso si hay error
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    console.log('Cookies deleted from error response')
    
    return response
  }
}
