import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TabsContent,
} from '@/components/ui'
import { FileText } from 'lucide-react'
import { EndpointCard } from '../shared/EndpointCard'
import type { Endpoint } from '@/lib/utils/endpointData'

interface VexgenTabProps {
  vexgenEndpoints: Endpoint[]
  t: any
}

export const VexgenTab: React.FC<VexgenTabProps> = ({ vexgenEndpoints, t }) => {
  return (
    <TabsContent value="vexgen" className="mt-4 sm:mt-6">
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              {t.docs.vexgen.title}
            </CardTitle>
            <CardDescription className="text-sm">{t.docs.vexgen.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* VEX Endpoints */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  VEX (Vulnerability Exploitability eXchange)
                </h3>
                <div className="space-y-3">
                  {vexgenEndpoints
                    .filter(endpoint => endpoint.tag === 'VEX')
                    .map((endpoint, index) => (
                      <EndpointCard key={index} endpoint={endpoint} index={index} t={t} />
                    ))}
                </div>
              </div>

              {/* TIX Endpoints */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  TIX (Threat Intelligence eXchange)
                </h3>
                <div className="space-y-3">
                  {vexgenEndpoints
                    .filter(endpoint => endpoint.tag === 'TIX')
                    .map((endpoint, index) => (
                      <EndpointCard key={index} endpoint={endpoint} index={index} t={t} />
                    ))}
                </div>
              </div>

              {/* Generation Endpoints */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  {t.docs.vexgen.generationTitle}
                </h3>
                <div className="space-y-3">
                  {vexgenEndpoints
                    .filter(endpoint => endpoint.tag === 'Generation')
                    .map((endpoint, index) => (
                      <EndpointCard key={index} endpoint={endpoint} index={index} t={t} />
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
