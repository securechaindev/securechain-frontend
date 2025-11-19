import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TabsContent,
} from '@/components/ui'
import { Database } from 'lucide-react'
import { EndpointCard } from '../shared/EndpointCard'
import type { Endpoint } from '@/lib/utils/endpointData'

interface GraphTabProps {
  depexRepositoryEndpoints: Endpoint[]
}

export const GraphTab: React.FC<GraphTabProps> = ({ depexRepositoryEndpoints }) => {
  return (
    <TabsContent value="graph" className="mt-4 sm:mt-6">
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
              Dependency Graph Endpoints
            </CardTitle>
            <CardDescription className="text-sm">
              Analyze and visualize package dependencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {depexRepositoryEndpoints.map((endpoint, index) => (
                <EndpointCard key={index} endpoint={endpoint} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
