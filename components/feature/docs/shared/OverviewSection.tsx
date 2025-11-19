import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Shield, Database, Code, FileText, Globe, Settings } from 'lucide-react'

interface OverviewSectionProps {
  nodeTypes: string[]
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ nodeTypes }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            API Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Version</h4>
              <p className="text-muted-foreground text-sm">1.0.0</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">OpenAPI</h4>
              <p className="text-muted-foreground text-sm">3.1.0</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Base URL</h4>
              <p className="text-muted-foreground font-mono text-xs sm:text-sm break-all">
                https://securechain.dev/api/
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Authentication</h4>
              <p className="text-muted-foreground text-sm">JWT Bearer Token</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6">
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">Authentication & API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              User authentication, registration, and API key management endpoints
            </p>
            <Badge variant="secondary" className="text-xs">
              10 endpoints
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
              <Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">Dependency Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Analyze and visualize package dependencies and their relationships
            </p>
            <Badge variant="secondary" className="text-xs">
              5 endpoints
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">VEX & TIX Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Generate and manage Vulnerability Exploitability eXchange (VEX) and Threat Intelligence eXchange (TIX) documents
            </p>
            <Badge variant="secondary" className="text-xs">
              7 endpoints
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">SSC Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Software Supply Chain security analysis and validation operations
            </p>
            <Badge variant="secondary" className="text-xs">
              3 endpoints
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">SMT Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              Satisfiability Modulo Theories solver operations for configuration optimization
            </p>
            <Badge variant="secondary" className="text-xs">
              7 endpoints
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            Supported Ecosystems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {nodeTypes.map(nodeType => (
              <div key={nodeType} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="font-mono text-xs sm:text-sm truncate">{nodeType}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
