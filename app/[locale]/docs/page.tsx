import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Database, FileText, Lock, Globe, Code, BookOpen, ExternalLink } from 'lucide-react'
import { ThemeToggle } from '@/components/layout'
import { LanguageToggle } from '@/components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export default async function DocsPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getDictionary(locale)

  // Function to get method color variant
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
    {
      method: 'GET',
      path: '/auth/health',
      summary: t.docs.healthCheck,
      description: t.docs.healthCheckDescription,
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t.docs.backToHome}
              </Link>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/securechain-logo.ico"
                  alt="Secure Chain Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="font-bold">Secure Chain API</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle currentLang={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            {t.docs.apiDocumentationBadge}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight pb-2">
            {t.docs.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">{t.docs.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/securechaindev" target="_blank" rel="noopener noreferrer">
                {t.docs.viewOnGitHub} <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">{t.docs.overview}</TabsTrigger>
              <TabsTrigger value="auth">{t.docs.auth}</TabsTrigger>
              <TabsTrigger value="graph">{t.docs.graph}</TabsTrigger>
              <TabsTrigger value="file-ops">{t.docs.fileOps}</TabsTrigger>
              <TabsTrigger value="config-ops">{t.docs.configOps}</TabsTrigger>
              <TabsTrigger value="schemas">{t.docs.schemas}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t.docs.apiInformation}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">{t.docs.version}</h4>
                        <p className="text-muted-foreground">1.0.0</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t.docs.openapi}</h4>
                        <p className="text-muted-foreground">3.1.0</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t.docs.baseUrl}</h4>
                        <p className="text-muted-foreground font-mono">
                          https://api.securechain.dev
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t.docs.authentication}</h4>
                        <p className="text-muted-foreground">{t.docs.jwtBearerToken}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Shield className="h-6 w-6 text-blue-500" />
                      </div>
                      <CardTitle>{t.docs.authenticationTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {t.docs.authenticationDescription}
                      </p>
                      <Badge variant="secondary">8 {t.docs.endpoints}</Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Database className="h-6 w-6 text-green-500" />
                      </div>
                      <CardTitle>{t.docs.dependencyGraphTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {t.docs.dependencyGraphDescription}
                      </p>
                      <Badge variant="secondary">6 {t.docs.endpoints}</Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Code className="h-6 w-6 text-purple-500" />
                      </div>
                      <CardTitle>{t.docs.fileOperationsTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {t.docs.fileOperationsDescription}
                      </p>
                      <Badge variant="secondary">5 {t.docs.endpoints}</Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="h-6 w-6 text-indigo-500" />
                      </div>
                      <CardTitle>{t.docs.configOperationsTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {t.docs.configOperationsDescription}
                      </p>
                      <Badge variant="secondary">3 {t.docs.endpoints}</Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t.docs.supportedEcosystems}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {nodeTypes.map(nodeType => (
                        <div
                          key={nodeType}
                          className="flex items-center gap-2 p-3 border rounded-lg"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="font-mono text-sm">{nodeType}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Auth Tab */}
            <TabsContent value="auth" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t.docs.authEndpoints}
                    </CardTitle>
                    <CardDescription>{t.docs.authEndpointsDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {authEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className={`${getMethodColor(endpoint.method)} border`}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono">{endpoint.path}</code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Auth Required
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{endpoint.summary}</h4>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Graph Tab */}
            <TabsContent value="graph" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      {t.docs.graphEndpoints}
                    </CardTitle>
                    <CardDescription>{t.docs.graphEndpointsDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {depexGraphEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className={`${getMethodColor(endpoint.method)} border`}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono">{endpoint.path}</code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Auth Required
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{endpoint.summary}</h4>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* File Operations Tab */}
            <TabsContent value="file-ops" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      {t.docs.fileEndpoints}
                    </CardTitle>
                    <CardDescription>{t.docs.fileEndpointsDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {depexFileOperationEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className={`${getMethodColor(endpoint.method)} border`}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono">{endpoint.path}</code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Auth Required
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{endpoint.summary}</h4>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Config Operations Tab */}
            <TabsContent value="config-ops" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t.docs.configEndpoints}
                    </CardTitle>
                    <CardDescription>{t.docs.configEndpointsDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {depexConfigOperationEndpoints.map((endpoint, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge className={`${getMethodColor(endpoint.method)} border`}>
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono">{endpoint.path}</code>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Auth Required
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{endpoint.summary}</h4>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Schemas Tab */}
            <TabsContent value="schemas" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t.docs.requestSchemas}
                    </CardTitle>
                    <CardDescription>{t.docs.requestSchemasDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schemas.map((schema, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{schema.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{schema.description}</p>
                          <div className="space-y-1">
                            <h5 className="text-sm font-medium">{t.docs.fields}:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {schema.fields.map((field, fieldIndex) => (
                                <li key={fieldIndex} className="font-mono text-xs">
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
                  <CardHeader>
                    <CardTitle>{t.docs.enumerations}</CardTitle>
                    <CardDescription>{t.docs.enumerationsDescription}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {enums.map((enumItem, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{enumItem.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {enumItem.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {enumItem.values.map(value => (
                              <code key={value} className="text-sm p-2 bg-muted rounded">
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
      <footer className="border-t py-12 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image
              src="/images/securechain-logo.ico"
              alt="Secure Chain Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
            <span className="font-bold">Secure Chain API</span>
          </div>
          <p className="text-sm text-muted-foreground">{t.docs.footerText}</p>
        </div>
      </footer>
    </div>
  )
}
