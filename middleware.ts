import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken?: string
  refreshToken?: string
  success: boolean
}> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/user/refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        success: true,
      }
    }

    return { success: false }
  } catch (error) {
    console.error('Error refreshing token:', error)
    return { success: false }
  }
}

async function isTokenValid(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/user/check_token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: accessToken }),
    })
    return response.ok
  } catch (error) {
    console.error('Error checking token:', error)
    return false
  }
}

async function handleTokenRefresh(request: NextRequest): Promise<NextResponse | null> {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!accessToken || !refreshToken) {
    return null
  }

  const tokenIsValid = await isTokenValid(accessToken)
  if (tokenIsValid) {
    return null
  }

  const refreshResult = await refreshAccessToken(refreshToken)

  if (refreshResult.success && refreshResult.accessToken) {
    const response = NextResponse.next()
    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set('access_token', refreshResult.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    })

    if (refreshResult.refreshToken) {
      response.cookies.set('refresh_token', refreshResult.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
      })
    }

    return response
  } else {
    const response = NextResponse.redirect(new URL('/login', request.url))

    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')

    return response
  }
}

export async function middleware(request: NextRequest) {
  const tokenRefreshResponse = await handleTokenRefresh(request)
  if (tokenRefreshResponse) {
    return tokenRefreshResponse
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
}
