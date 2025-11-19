import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TabsContent,
} from '@/components/ui'
import { Shield } from 'lucide-react'
import { EndpointCard } from '../shared/EndpointCard'
import type { Endpoint } from '@/lib/utils/endpointData'

interface AuthTabProps {
  authEndpoints: Endpoint[]
  apiKeysEndpoints: Endpoint[]
}

export const AuthTab: React.FC<AuthTabProps> = ({ authEndpoints, apiKeysEndpoints }) => {
  return (
    <TabsContent value="auth" className="mt-4 sm:mt-6">
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              Authentication Endpoints
            </CardTitle>
            <CardDescription className="text-sm">User authentication and registration endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {authEndpoints.map((endpoint, index) => (
                <EndpointCard key={index} endpoint={endpoint} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              API Keys
            </CardTitle>
            <CardDescription className="text-sm">
              Create and manage API keys for authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {apiKeysEndpoints.map((endpoint, index) => (
                <EndpointCard key={index} endpoint={endpoint} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
