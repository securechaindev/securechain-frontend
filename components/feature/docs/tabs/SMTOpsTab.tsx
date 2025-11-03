import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TabsContent,
} from '@/components/ui'
import { Settings } from 'lucide-react'
import { EndpointCard } from '../shared/EndpointCard'
import type { Endpoint } from '@/lib/utils/endpointData'

interface SMTTabProps {
  depexSMTOperationEndpoints: Endpoint[]
  t: any
}

export const SMTTab: React.FC<SMTTabProps> = ({ depexSMTOperationEndpoints, t }) => {
  return (
    <TabsContent value="smt-ops" className="mt-4 sm:mt-6">
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              {t.docs.smtOperationsEndpoints}
            </CardTitle>
            <CardDescription className="text-sm">
              {t.docs.smtOperationsEndpointsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {depexSMTOperationEndpoints.map((endpoint, index) => (
                <EndpointCard key={index} endpoint={endpoint} index={index} t={t} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
