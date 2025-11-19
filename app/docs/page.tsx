import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TabsContent,
} from '@/components/ui'
import { FileText } from 'lucide-react'
import Image from 'next/image'
import {
  Navigation,
  HeroSection,
  OverviewSection,
  DocsTabs,
} from '@/components/feature/docs/shared'
import { AuthTab, GraphTab, SSCTab, SMTTab, VexgenTab } from '@/components/feature/docs/tabs'
import { nodeTypes } from '@/lib/utils/endpointUtils'
import { getEndpointData } from '@/lib/utils/endpointData'
import { getSchemas, getEnums } from '@/lib/utils/schemas'

export default function DocsPage() {
  const {
    authEndpoints,
    apiKeysEndpoints,
    depexGraphEndpoints,
    depexSSCOperationEndpoints,
    depexSMTOperationEndpoints,
    vexgenEndpoints,
  } = getEndpointData()

  // Get schemas and enums using utility functions
  const schemas = getSchemas()
  const enums = getEnums()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <DocsTabs>
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 sm:mt-6">
              <OverviewSection nodeTypes={nodeTypes} />
            </TabsContent>

            {/* Auth Tab */}
            <AuthTab authEndpoints={authEndpoints} apiKeysEndpoints={apiKeysEndpoints} />

            {/* VEXGen Tab */}
            <VexgenTab vexgenEndpoints={vexgenEndpoints} />

            {/* Graph Tab */}
            <GraphTab depexRepositoryEndpoints={depexGraphEndpoints} />

            {/* SSC Operations Tab (Software Supply Chain) */}
            <SSCTab depexSSCOperationEndpoints={depexSSCOperationEndpoints} />

            {/* SMT Operations Tab (Satisfiability Modulo Theories) */}
            <SMTTab depexSMTOperationEndpoints={depexSMTOperationEndpoints} />

            {/* Schemas Tab */}
            <TabsContent value="schemas" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      Request Schemas
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Data structures for API requests and responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {schemas.map((schema, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <h4 className="font-semibold mb-2 text-sm sm:text-base">{schema.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                            {schema.description}
                          </p>
                          <div className="space-y-1">
                            <h5 className="text-xs sm:text-sm font-medium">Fields:</h5>
                            <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                              {schema.fields.map((field, fieldIndex) => (
                                <li key={fieldIndex} className="font-mono text-xs break-all">
                                  • {field}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Enumerations</CardTitle>
                    <CardDescription className="text-sm">
                      Predefined value sets used across the API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 sm:space-y-6">
                      {enums.map((enumItem, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <h4 className="font-semibold mb-2 text-sm sm:text-base">
                            {enumItem.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                            {enumItem.description}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {enumItem.values.map(value => (
                              <code
                                key={value}
                                className="text-xs sm:text-sm p-2 bg-muted rounded break-all"
                              >
                                {value}
                              </code>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </DocsTabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image
              src="/images/securechain-logo.ico"
              alt="Secure Chain Logo"
              width={64}
              height={64}
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
            <span className="font-bold text-sm sm:text-base">
              <span className="hidden sm:inline">Secure Chain API</span>
              <span className="sm:hidden">SC API</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Complete API documentation for the Secure Chain platform
          </p>
        </div>
      </footer>
    </div>
  )
}
