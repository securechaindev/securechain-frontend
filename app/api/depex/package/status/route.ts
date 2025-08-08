import { NextRequest, NextResponse } from 'next/server'
import { getApiTranslations, getTranslation } from '../../../../../lib/server-i18n'
import { withAuth } from '../../../../../lib/api-auth'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest) {
  const { t } = getApiTranslations(request)

  return withAuth(request, async authToken => {
    try {
      const { searchParams } = new URL(request.url)
      const packageName = searchParams.get('packageName')
      const nodeType = searchParams.get('nodeType') || 'PyPIPackage' // Default to PyPI

      // Validate nodeType against allowed values
      const allowedNodeTypes = [
        'RubyGemsPackage',
        'CargoPackage',
        'NuGetPackage',
        'PyPIPackage',
        'NPMPackage',
        'MavenPackage',
      ]

      if (!allowedNodeTypes.includes(nodeType)) {
        return NextResponse.json(
          {
            code: 'invalid_node_type',
            message: `Invalid node_type. Must be one of: ${allowedNodeTypes.join(', ')}`,
          },
          { status: 400 }
        )
      }

      const response = await fetch(
        `${BACKEND_URL}/depex/graph/package/status?package_name=${packageName}&node_type=${nodeType}`,
        {
          method: 'GET',
          headers: {
            Authorization: authToken,
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
  })
}
