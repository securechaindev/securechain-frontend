import { Badge, Button } from '@/components/ui'
import { BookOpen, ExternalLink } from 'lucide-react'

export const HeroSection: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto text-center">
        <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          API Documentation
        </Badge>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight pb-2">
          Secure Chain API Documentation
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
          Comprehensive documentation for the Secure Chain API, including authentication, dependency
          analysis, and VEX/TIX generation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
            <a href="https://github.com/securechaindev" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
