import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ExternalLink,
  CheckCircle,
  Database,
  Zap,
  Users,
  Heart,
  Server,
  BookOpen,
} from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { TryButton } from '@/components/try-button'
import Image from 'next/image'
import { ContactModal } from '@/components/contact-modal'
import { getDictionary, type Locale } from '@/lib/i18n'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { OverviewDiagram } from '@/components/overview-diagram'

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
            {/* Espacio vacío a la izquierda para mantener el balance */}
            <div className="w-10"></div>

            {/* Logo y nombre centrados */}
            <div className="flex items-center justify-center space-x-2">
              <Image
                src="/images/securechain-logo.ico"
                alt="Secure Chain Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">Secure Chain</span>
            </div>

            {/* Theme toggle y Language toggle a la derecha */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle currentLang={locale} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            {t.heroBadge}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight pb-2">
            {t.heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TryButton locale={locale} buttonText={t.loginButton} />
            <Button size="lg" variant="outline" asChild>
              <a href="/docs" target="_blank" rel="noopener noreferrer">
                {t.openApiDocsButton} <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Overview */}
      <section id="tools" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.toolsTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.toolsDescription}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Depex Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
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
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t.depexFullDescription}</p>

                <div className="space-y-2">
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

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 gap-2" asChild>
                    <a href="https://github.com/securechaindev/securechain-depex">
                      <SiGithub className="h-5 w-5" />
                      {t.viewDepexButton}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* VEXGen Card */}
            <Card className="relative overflow-hidden">
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
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t.vexgenFullDescription}</p>

                <div className="space-y-2">
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

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 gap-2" asChild>
                    <a href="https://github.com/securechaindev/securechain-vexgen">
                      <SiGithub className="h-5 w-5" />
                      {t.viewVEXGenButton}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Features - Pegado a las herramientas */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t.openSourceBadge}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t.gnuLicensedBadge}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t.communityDrivenBadge}
            </div>
          </div>
        </div>
      </section>

      {/* New Zenodo Data Dump Section */}
      <section id="data-dumps" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <ExternalLink className="h-8 w-8 text-blue-500" />
            {t.zenodoDataDumpTitle}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.zenodoDataDumpDescription}
          </p>
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://zenodo.org/records/16739081" target="_blank" rel="noopener noreferrer">
              {t.viewDataDumpButton} <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </section>

      {/* Comparison Section - Updated with images and explanation */}
      <section id="comparison" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.howTheyWorkTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.howTheyWorkDescription}</p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-center">{t.diagramExplanationTitle}</h3>
              <div className="flex justify-center mb-6">
                <OverviewDiagram />
              </div>
              <p className="text-muted-foreground text-center">{t.diagramExplanationText}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.useCasesTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.useCasesDescription}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-2">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>{t.enterpriseSecurityTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.enterpriseSecurityText}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>{t.cicdIntegrationTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.cicdIntegrationText}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle>{t.openSourceProjectsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t.openSourceProjectsText}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* New Architecture Section */}
      <section id="architecture" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Server className="h-8 w-8 text-primary" />
              {t.architectureTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.architectureDescription}</p>
          </div>

          <Card className="max-w-5xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-center">
                {t.architectureDiagramExplanationTitle}
              </h3>
              <div className="flex justify-center mb-6">
                <ArchitectureDiagram />
              </div>
              <p className="text-muted-foreground text-center">
                {t.architectureDiagramExplanationText}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section (formerly CTA) */}
      <section id="contact" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t.contactTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{t.contactDescription}</p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-8">
            <ContactModal
              currentLang={locale}
              translations={{
                contactModalTitle: t.contactModalTitle,
                contactModalDescription: t.contactModalDescription,
                emailLabel: t.emailLabel,
                emailPlaceholder: t.emailPlaceholder,
                subjectLabel: t.subjectLabel,
                subjectPlaceholder: t.subjectPlaceholder,
                messageLabel: t.messageLabel,
                messagePlaceholder: t.messagePlaceholder,
                contactEmailHelperText: t.contactEmailHelperText,
                cancelButton: t.cancelButton,
                sendButton: t.sendButton,
                sendingButton: t.sendingButton,
                toastErrorTitle: t.toastErrorTitle,
                toastErrorDescription: t.toastErrorDescription,
                toastInvalidEmailTitle: t.toastInvalidEmailTitle,
                toastInvalidEmailDescription: t.toastInvalidEmailDescription,
                contactToastSuccessTitle: t.contactToastSuccessTitle,
                contactToastSuccessDescription: t.contactToastSuccessDescription,
                toastSubmissionFailedTitle: t.toastSubmissionFailedTitle,
                contactToastSubmissionFailedDescription: t.contactToastSubmissionFailedDescription,
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://github.com/securechaindev" target="_blank" rel="noopener noreferrer">
                <SiGithub className="h-5 w-5" />
                {t.githubOrgLink}
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a
                href="https://zenodo.org/communities/securechaindev/records"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-5 w-5" />
                {t.zenodoOrgLink}
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://securechaindev.github.io/" target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-5 w-5" />
                {t.documentationLink}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Supporters Section */}
      <section id="supporters" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              {t.supportersTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.supportersDescription}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* IDEA Research Group */}
              <Card className="p-8">
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center w-20 h-20 bg-[#f9f4ff] dark:bg-[#f9f4ff] rounded-full">
                    <Image
                      src="/assets/images/idea-logo.png"
                      alt="IDEA Research Group Logo"
                      width={70}
                      height={70}
                      className="h-16 w-auto"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{t.ideaTitle}</h3>
                    <p className="text-muted-foreground mb-4">{t.ideaLocation}</p>
                    <p className="text-sm text-muted-foreground mb-4">{t.ideaText}</p>
                    <Button variant="outline" asChild>
                      <a
                        href="https://www.idea.us.es/home/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.visitIdeaButton}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* I3US Institute */}
              <Card className="p-8">
                <CardContent className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center w-20 h-20 bg-[#f4f9ff] dark:bg-[#f4f9ff] rounded-full">
                    <Image
                      src="/assets/images/i3us-logo.png"
                      alt="I3US Institute Logo"
                      width={170}
                      height={70}
                      className="h-12 w-auto"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{t.i3usTitle}</h3>
                    <p className="text-muted-foreground mb-4">{t.i3usLocation}</p>
                    <p className="text-sm text-muted-foreground mb-4">{t.i3usText}</p>
                    <Button variant="outline" asChild>
                      <a href="https://i3us.us.es/" target="_blank" rel="noopener noreferrer">
                        {t.visitI3usButton}
                        <ExternalLink className="h-4 w-4 ml-2" />
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
      <footer className="border-t py-12 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image
                src="/images/securechain-logo.ico"
                alt="Secure Chain Logo"
                width={64}
                height={64}
                className="h-16 w-16"
              />
              <span className="font-bold">Secure Chain</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">{t.footerDescription}</p>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>{t.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
