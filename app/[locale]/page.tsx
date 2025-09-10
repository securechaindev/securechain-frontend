import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui'
import {
  ExternalLink,
  CheckCircle,
  Database,
  Zap,
  Users,
  Heart,
  Server,
  BookOpen,
  Bot,
} from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { ThemeToggle, LanguageToggle } from '@/components/layout'
import { TryButton } from '@/components/common'
import Image from 'next/image'
import { getDictionary, type Locale } from '@/lib/i18n'
import { ArchitectureDiagram, OverviewDiagram } from '@/components/feature/diagrams'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/securechain-logo.ico"
                alt="Secure Chain Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-lg sm:text-xl font-bold">Secure Chain</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle currentLang={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
            {t.heroBadge}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight pb-2">
            {t.heroTitle}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            {t.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <TryButton locale={locale} buttonText={t.loginButton} />
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href={`/${locale}/docs`}>
                {t.apiDocsButton} <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href="https://securechaindev.github.io/" target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-5 w-5" />
                {t.documentationLink}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Overview */}
      <section id="tools" className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.toolsTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">{t.toolsDescription}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {/* Depex Card */}
            <Card className="relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Image
                      src="/images/depex-logo.ico"
                      alt="Depex Logo"
                      width={40}
                      height={40}
                      className="h-6 w-auto"
                    />
                  </div>
                  <CardTitle className="text-2xl">{t.depexTitle}</CardTitle>
                </div>
                <CardDescription className="text-base">{t.depexDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-muted-foreground">{t.depexFullDescription}</p>

                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {t.depexFeaturesTitle}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• {t.depexFeature1}</li>
                    <li>• {t.depexFeature2}</li>
                    <li>• {t.depexFeature3}</li>
                    <li>• {t.depexFeature4}</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-4 mt-auto">
                  <Button className="flex-1 gap-2" asChild>
                    <a
                      href="https://github.com/securechaindev/securechain-depex"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SiGithub className="h-5 w-5" />
                      {t.viewDepexButton} <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* VEXGen Card */}
            <Card className="relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Image
                      src="/images/vexgen-logo.ico"
                      alt="VEXGen Logo"
                      width={40}
                      height={40}
                      className="h-6 w-auto"
                    />
                  </div>
                  <CardTitle className="text-2xl">{t.vexgenTitle}</CardTitle>
                </div>
                <CardDescription className="text-base">{t.vexgenDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-muted-foreground">{t.vexgenFullDescription}</p>

                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {t.vexgenFeaturesTitle}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• {t.vexgenFeature1}</li>
                    <li>• {t.vexgenFeature2}</li>
                    <li>• {t.vexgenFeature3}</li>
                    <li>• {t.vexgenFeature4}</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-4 mt-auto">
                  <Button className="flex-1 gap-2" asChild>
                    <a
                      href="https://github.com/securechaindev/securechain-vexgen"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SiGithub className="h-5 w-5" />
                      {t.viewVEXGenButton} <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* MCP Server Card */}
            <Card className="relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full" />
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle className="text-2xl">{t.mcpTitle}</CardTitle>
                </div>
                <CardDescription className="text-base">{t.mcpDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-muted-foreground">{t.mcpFullDescription}</p>

                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {t.mcpFeaturesTitle}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• {t.mcpFeature1}</li>
                    <li>• {t.mcpFeature2}</li>
                    <li>• {t.mcpFeature3}</li>
                    <li>• {t.mcpFeature4}</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-4 mt-auto">
                  <Button className="flex-1 gap-2" asChild>
                    <a
                      href="https://github.com/securechaindev/securechain-mcp-server"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SiGithub className="h-5 w-5" />
                      {t.viewMCPButton} <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" className="gap-2" asChild>
                    <a
                      href="https://www.pulsemcp.com/servers/securechaindev-secure-chain"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t.viewPulseMCPButton}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Features */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-center sm:text-left">{t.openSourceBadge}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-center sm:text-left">{t.gnuLicensedBadge}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-center sm:text-left">{t.communityDrivenBadge}</span>
            </div>
          </div>
        </div>
      </section>

      {/* New Zenodo Data Dump Section */}
      <section id="data-dumps" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            {t.zenodoDataDumpTitle}
          </h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {t.zenodoDataDumpDescription}
          </p>
          <Button variant="outline" className="gap-2 w-full sm:w-auto" asChild>
            <a href="https://zenodo.org/records/16739081" target="_blank" rel="noopener noreferrer">
              {t.viewDataDumpButton} <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.howTheyWorkTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              {t.howTheyWorkDescription}
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
                {t.diagramExplanationTitle}
              </h3>
              <div className="flex justify-center mb-4 sm:mb-6">
                <OverviewDiagram />
              </div>
              <p className="text-muted-foreground text-center px-4">{t.diagramExplanationText}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.useCasesTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">{t.useCasesDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t.enterpriseSecurityTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {t.enterpriseSecurityText}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t.cicdIntegrationTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {t.cicdIntegrationText}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full md:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t.openSourceProjectsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {t.openSourceProjectsText}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Server className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              {t.architectureTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              {t.architectureDescription}
            </p>
          </div>

          <Card className="max-w-5xl mx-auto">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
                {t.architectureDiagramExplanationTitle}
              </h3>
              <div className="flex justify-center mb-4 sm:mb-6 overflow-x-auto">
                <ArchitectureDiagram />
              </div>
              <p className="text-muted-foreground text-center px-4">
                {t.architectureDiagramExplanationText}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section (formerly CTA) */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.contactTitle}</h2>
          <p className="text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
            {t.contactDescription}
          </p>

          {/* Email Contact */}
          <div className="mb-6 sm:mb-8">
            <p className="text-base sm:text-lg text-muted-foreground mb-2">
              {t.contactGetInTouchText}
            </p>
            <a
              href="mailto:hi@securechain.dev"
              className="text-xl sm:text-2xl font-semibold text-primary hover:text-primary/80 transition-colors break-all"
            >
              hi@securechain.dev
            </a>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
            <Button variant="outline" className="gap-2 w-full sm:w-auto" asChild>
              <a href="https://github.com/securechaindev" target="_blank" rel="noopener noreferrer">
                <SiGithub className="h-5 w-5" />
                {t.githubOrgLink}
              </a>
            </Button>
            <Button variant="outline" className="gap-2 w-full sm:w-auto" asChild>
              <a
                href="https://zenodo.org/communities/securechaindev/records"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-5 w-5" />
                {t.zenodoOrgLink}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Supporters Section */}
      <section id="supporters" className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              {t.supportersTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              {t.supportersDescription}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* IDEA Research Group */}
              <Card className="p-4 sm:p-6 lg:p-8">
                <CardContent className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#f9f4ff] dark:bg-[#f9f4ff] rounded-full">
                    <Image
                      src="/assets/images/idea-logo.png"
                      alt="IDEA Research Group Logo"
                      width={70}
                      height={70}
                      className="h-12 w-auto sm:h-16"
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.ideaTitle}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      {t.ideaLocation}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-4 leading-relaxed px-2 sm:px-0">
                      {t.ideaText}
                    </p>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto text-sm px-4 py-2 min-h-[40px] flex items-center justify-center whitespace-nowrap"
                    >
                      <a
                        href="https://www.idea.us.es/home/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {t.visitIdeaButton}
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* I3US Institute */}
              <Card className="p-4 sm:p-6 lg:p-8">
                <CardContent className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#f4f9ff] dark:bg-[#f4f9ff] rounded-full">
                    <Image
                      src="/assets/images/i3us-logo.png"
                      alt="I3US Institute Logo"
                      width={170}
                      height={70}
                      className="h-10 w-auto sm:h-12"
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.i3usTitle}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                      {t.i3usLocation}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-4 leading-relaxed px-2 sm:px-0">
                      {t.i3usText}
                    </p>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full sm:w-auto text-sm px-4 py-2 min-h-[40px] flex items-center justify-center whitespace-nowrap"
                    >
                      <a
                        href="https://i3us.us.es/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {t.visitI3usButton}
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground">{t.supportersFooterText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image
                src="/images/securechain-logo.ico"
                alt="Secure Chain Logo"
                width={64}
                height={64}
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
              <span className="text-lg sm:text-xl font-bold">Secure Chain</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto px-4">
              {t.footerDescription}
            </p>
          </div>

          <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-muted-foreground">
            <p>{t.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
