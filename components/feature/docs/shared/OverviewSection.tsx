import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Shield, Database, Code, FileText, Globe, Settings } from 'lucide-react'

interface OverviewSectionProps {
  t: any
  nodeTypes: string[]
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ t, nodeTypes }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            {t.docs.apiInformation}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">{t.docs.version}</h4>
              <p className="text-muted-foreground text-sm">1.0.0</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">{t.docs.openapi}</h4>
              <p className="text-muted-foreground text-sm">3.1.0</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">{t.docs.baseUrl}</h4>
              <p className="text-muted-foreground font-mono text-xs sm:text-sm break-all">
                https://securechain.dev/api/
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">{t.docs.authentication}</h4>
              <p className="text-muted-foreground text-sm">{t.docs.jwtBearerToken}</p>
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
            <CardTitle className="text-base sm:text-lg">{t.docs.authenticationTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {t.docs.authenticationDescription}
            </p>
            <Badge variant="secondary" className="text-xs">
              10 {t.docs.endpoints}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
              <Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">{t.docs.dependencyGraphTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {t.docs.dependencyGraphDescription}
            </p>
            <Badge variant="secondary" className="text-xs">
              5 {t.docs.endpoints}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">{t.docs.vexgen.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {t.docs.vexgen.description}
            </p>
            <Badge variant="secondary" className="text-xs">
              7 {t.docs.endpoints}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
              <Code className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">{t.docs.fileOperationsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {t.docs.fileOperationsDescription}
            </p>
            <Badge variant="secondary" className="text-xs">
              3 {t.docs.endpoints}
            </Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
            </div>
            <CardTitle className="text-base sm:text-lg">{t.docs.configOperationsTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {t.docs.configOperationsDescription}
            </p>
            <Badge variant="secondary" className="text-xs">
              7 {t.docs.endpoints}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            {t.docs.supportedEcosystems}
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
