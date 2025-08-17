import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { Shield, Database, FileText, Lock, Globe, Code, BookOpen, ExternalLink } from 'lucide-react'
import { ThemeToggle, LanguageToggle } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export default async function DocsPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getDictionary(locale)

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'POST':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'PUT':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'DELETE':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'PATCH':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  const authEndpoints = [
    {
      method: 'POST',
      path: '/auth/signup',
      summary: t.docs.userSignup,
      description: t.docs.userSignupDescription,
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/login',
      summary: t.docs.userLogin,
      description: t.docs.userLoginDescription,
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/logout',
      summary: t.docs.userLogout,
      description: t.docs.userLogoutDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/auth/account_exists',
      summary: t.docs.accountExists,
      description: t.docs.accountExistsDescription,
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/change_password',
      summary: t.docs.changePassword,
      description: t.docs.changePasswordDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/auth/check_token',
      summary: t.docs.checkToken,
      description: t.docs.checkTokenDescription,
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/refresh_token',
      summary: t.docs.refreshToken,
      description: t.docs.refreshTokenDescription,
      auth: false,
    },
  ]

  const depexGraphEndpoints = [
    {
      method: 'GET',
      path: '/depex/package/{node_type}/{package_name}/status',
      summary: t.docs.getPackageStatus,
      description: t.docs.getPackageStatusDescription,
      auth: true,
    },
    {
      method: 'GET',
      path: '/depex/version/{node_type}/{package_name}/{version}/status',
      summary: t.docs.getVersionStatus,
      description: t.docs.getVersionStatusDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/version',
      summary: t.docs.initVersion,
      description: t.docs.initVersionDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/package',
      summary: t.docs.initPackage,
      description: t.docs.initPackageDescription,
      auth: true,
    },
  ]

  const depexFileOperationEndpoints = [
    {
      method: 'POST',
      path: '/depex/operation/file/file_info',
      summary: t.docs.fileInfo,
      description: t.docs.fileInfoDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/operation/file/valid_graph',
      summary: t.docs.validGraph,
      description: t.docs.validGraphDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/operation/file/minimize_impact',
      summary: t.docs.minimizeImpact,
      description: t.docs.minimizeImpactDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/operation/file/maximize_impact',
      summary: t.docs.maximizeImpact,
      description: t.docs.maximizeImpactDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/operation/file/filter_configs',
      summary: t.docs.filterConfigs,
      description: t.docs.filterConfigsDescription,
      auth: true,
    },
  ]

  const depexConfigOperationEndpoints = [
    {
      method: 'POST',
      path: '/depex/operation/config/valid_config',
      summary: t.docs.validConfig,
      description: t.docs.validConfigDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/operation/config/complete_config',
      summary: t.docs.completeConfig,
      description: t.docs.completeConfigDescription,
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/operation/config/config_by_impact',
      summary: t.docs.configByImpact,
      description: t.docs.configByImpactDescription,
      auth: true,
    },
  ]

  const nodeTypes = [
    'RubyGemsPackage',
    'CargoPackage',
    'NuGetPackage',
    'PyPIPackage',
    'NPMPackage',
    'MavenPackage',
  ]

  const schemas = [
    {
      name: 'SignUpRequest',
      description: t.docs.signUpRequestDescription,
      fields: ['email (string, email format)', 'password (string)'],
    },
    {
      name: 'LoginRequest',
      description: t.docs.loginRequestDescription,
      fields: ['email (string, email format)', 'password (string, 8-20 chars)'],
    },
    {
      name: 'AccountExistsRequest',
      description: t.docs.accountExistsRequestDescription,
      fields: ['email (string, email format)'],
    },
    {
      name: 'ChangePasswordRequest',
      description: t.docs.changePasswordRequestDescription,
      fields: [
        'email (string, email format)',
        'old_password (string, 8-20 chars)',
        'new_password (string, 8-20 chars)',
      ],
    },
    {
      name: 'VerifyTokenRequest',
      description: t.docs.verifyTokenRequestDescription,
      fields: ['token (string or null)'],
    },
    {
      name: 'InitRepositoryRequest',
      description: t.docs.initRepositoryRequestDescription,
      fields: [
        'owner (string)',
        'name (string)',
        'user_id (string)',
        'moment (datetime, optional)',
        'add_extras (boolean, default: false)',
        'is_complete (boolean, default: false)',
      ],
    },
    {
      name: 'InitPackageRequest',
      description: t.docs.initPackageRequestDescription,
      fields: ['node_type (NodeType)', 'package_name (string)'],
    },
    {
      name: 'InitVersionRequest',
      description: t.docs.initVersionRequestDescription,
      fields: ['node_type (NodeType)', 'package_name (string)', 'version_name (string)'],
    },
    {
      name: 'FileInfoRequest',
      description: t.docs.fileInfoRequestDescription,
      fields: [
        'node_type (NodeType)',
        'requirement_file_id (string, UUID pattern)',
        'max_level (integer)',
      ],
    },
    {
      name: 'ValidGraphRequest',
      description: t.docs.validGraphRequestDescription,
      fields: [
        'requirement_file_id (string, UUID pattern)',
        'max_level (integer)',
        'node_type (NodeType)',
      ],
    },
    {
      name: 'MinMaxImpactRequest',
      description: t.docs.minMaxImpactRequestDescription,
      fields: [
        'requirement_file_id (string, UUID pattern)',
        'limit (integer, min: 1)',
        'max_level (integer)',
        'node_type (NodeType)',
        'agregator (Agregator)',
      ],
    },
    {
      name: 'FilterConfigsRequest',
      description: t.docs.filterConfigsRequestDescription,
      fields: [
        'requirement_file_id (string, UUID pattern)',
        'max_threshold (number, 0-10)',
        'min_threshold (number, 0-10)',
        'limit (integer, min: 1)',
        'max_level (integer)',
        'node_type (NodeType)',
        'agregator (Agregator)',
      ],
    },
    {
      name: 'ValidConfigRequest',
      description: t.docs.validConfigRequestDescription,
      fields: [
        'requirement_file_id (string, UUID pattern)',
        'max_level (integer)',
        'node_type (NodeType)',
        'agregator (Agregator)',
        'config (object)',
      ],
    },
    {
      name: 'CompleteConfigRequest',
      description: t.docs.completeConfigRequestDescription,
      fields: [
        'requirement_file_id (string, UUID pattern)',
        'max_level (integer)',
        'node_type (NodeType)',
        'agregator (Agregator)',
        'config (object)',
      ],
    },
    {
      name: 'ConfigByImpactRequest',
      description: t.docs.configByImpactRequestDescription,
      fields: [
        'requirement_file_id (string, UUID pattern)',
        'max_level (integer)',
        'impact (number, 0-10)',
        'node_type (NodeType)',
        'agregator (Agregator)',
      ],
    },
  ]

  const enums = [
    {
      name: 'NodeType',
      description: t.docs.nodeTypeDescription,
      values: [
        'RubyGemsPackage',
        'CargoPackage',
        'NuGetPackage',
        'PyPIPackage',
        'NPMPackage',
        'MavenPackage',
      ],
    },
    {
      name: 'Agregator',
      description: t.docs.agregatorDescription,
      values: ['mean', 'weighted_mean'],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link
                href={`/${locale}`}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">{t.docs.backToHome}</span>
                <span className="sm:hidden">← Back</span>
              </Link>
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src="/images/securechain-logo.ico"
                  alt="Secure Chain Logo"
                  width={32}
                  height={32}
                  className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
                />
                <span className="font-bold text-sm sm:text-base truncate">
                  <span className="hidden md:inline">Secure Chain API</span>
                  <span className="md:hidden">SC API</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <LanguageToggle currentLang={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            {t.docs.apiDocumentationBadge}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight pb-2">
            {t.docs.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            {t.docs.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href="https://github.com/securechaindev" target="_blank" rel="noopener noreferrer">
                <span className="text-sm sm:text-base">{t.docs.viewOnGitHub}</span>
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                <span className="hidden sm:inline">{t.docs.overview}</span>
              </TabsTrigger>
              <TabsTrigger value="auth" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                <span className="hidden sm:inline">{t.docs.auth}</span>
              </TabsTrigger>
              <TabsTrigger value="graph" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                <span className="hidden sm:inline">{t.docs.graph}</span>
              </TabsTrigger>
              <TabsTrigger
                value="file-ops"
                className="text-xs sm:text-sm py-2 px-1 sm:px-3 col-span-3 lg:col-span-1"
              >
                <span className="hidden lg:inline">{t.docs.fileOps}</span>
              </TabsTrigger>
              <TabsTrigger
                value="config-ops"
                className="text-xs sm:text-sm py-2 px-1 sm:px-3 col-span-3 lg:col-span-1"
              >
                <span className="hidden lg:inline">{t.docs.configOps}</span>
              </TabsTrigger>
              <TabsTrigger
                value="schemas"
                className="text-xs sm:text-sm py-2 px-1 sm:px-3 col-span-3 lg:col-span-1"
              >
                <span className="hidden sm:inline">{t.docs.schemas}</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 sm:mt-6">
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
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">
                          {t.docs.version}
                        </h4>
                        <p className="text-muted-foreground text-sm">1.0.0</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">
                          {t.docs.openapi}
                        </h4>
                        <p className="text-muted-foreground text-sm">3.1.0</p>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">
                          {t.docs.baseUrl}
                        </h4>
                        <p className="text-muted-foreground font-mono text-xs sm:text-sm break-all">
                          https://securechain.dev/api/
                        </p>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">
                          {t.docs.authentication}
                        </h4>
                        <p className="text-muted-foreground text-sm">{t.docs.jwtBearerToken}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                  <Card className="md:col-span-2 xl:col-span-1">
                    <CardHeader className="pb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">
                        {t.docs.authenticationTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {t.docs.authenticationDescription}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        8 {t.docs.endpoints}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 xl:col-span-1">
                    <CardHeader className="pb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">
                        {t.docs.dependencyGraphTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {t.docs.dependencyGraphDescription}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        6 {t.docs.endpoints}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 xl:col-span-1">
                    <CardHeader className="pb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Code className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">
                        {t.docs.fileOperationsTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {t.docs.fileOperationsDescription}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        5 {t.docs.endpoints}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 xl:col-span-1">
                    <CardHeader className="pb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">
                        {t.docs.configOperationsTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {t.docs.configOperationsDescription}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        3 {t.docs.endpoints}
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
                        <div
                          key={nodeType}
                          className="flex items-center gap-2 p-3 border rounded-lg"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="font-mono text-xs sm:text-sm truncate">{nodeType}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Auth Tab */}
            <TabsContent value="auth" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t.docs.authEndpoints}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t.docs.authEndpointsDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {authEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <Badge
                                className={`${getMethodColor(endpoint.method)} border text-xs flex-shrink-0`}
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="text-xs sm:text-sm font-mono break-all">
                                {endpoint.path}
                              </code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1 text-xs w-fit">
                                <Lock className="h-3 w-3" />
                                <span className="hidden sm:inline">Auth Required</span>
                                <span className="sm:hidden">Auth</span>
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1 text-sm sm:text-base">
                            {endpoint.summary}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {endpoint.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Graph Tab */}
            <TabsContent value="graph" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t.docs.graphEndpoints}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t.docs.graphEndpointsDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {depexGraphEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <Badge
                                className={`${getMethodColor(endpoint.method)} border text-xs flex-shrink-0`}
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="text-xs sm:text-sm font-mono break-all">
                                {endpoint.path}
                              </code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1 text-xs w-fit">
                                <Lock className="h-3 w-3" />
                                <span className="hidden sm:inline">Auth Required</span>
                                <span className="sm:hidden">Auth</span>
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1 text-sm sm:text-base">
                            {endpoint.summary}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {endpoint.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* File Operations Tab */}
            <TabsContent value="file-ops" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Code className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t.docs.fileEndpoints}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t.docs.fileEndpointsDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {depexFileOperationEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <Badge
                                className={`${getMethodColor(endpoint.method)} border text-xs flex-shrink-0`}
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="text-xs sm:text-sm font-mono break-all">
                                {endpoint.path}
                              </code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1 text-xs w-fit">
                                <Lock className="h-3 w-3" />
                                <span className="hidden sm:inline">Auth Required</span>
                                <span className="sm:hidden">Auth</span>
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1 text-sm sm:text-base">
                            {endpoint.summary}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {endpoint.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Config Operations Tab */}
            <TabsContent value="config-ops" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t.docs.configEndpoints}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t.docs.configEndpointsDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {depexConfigOperationEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <Badge
                                className={`${getMethodColor(endpoint.method)} border text-xs flex-shrink-0`}
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="text-xs sm:text-sm font-mono break-all">
                                {endpoint.path}
                              </code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1 text-xs w-fit">
                                <Lock className="h-3 w-3" />
                                <span className="hidden sm:inline">Auth Required</span>
                                <span className="sm:hidden">Auth</span>
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1 text-sm sm:text-base">
                            {endpoint.summary}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {endpoint.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Schemas Tab */}
            <TabsContent value="schemas" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      {t.docs.requestSchemas}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {t.docs.requestSchemasDescription}
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
                            <h5 className="text-xs sm:text-sm font-medium">{t.docs.fields}:</h5>
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
                    <CardTitle className="text-lg sm:text-xl">{t.docs.enumerations}</CardTitle>
                    <CardDescription className="text-sm">
                      {t.docs.enumerationsDescription}
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
          </Tabs>
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
          <p className="text-xs sm:text-sm text-muted-foreground px-4">{t.docs.footerText}</p>
        </div>
      </footer>
    </div>
  )
}
