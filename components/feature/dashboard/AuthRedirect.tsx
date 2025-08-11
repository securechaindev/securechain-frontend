import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Shield } from 'lucide-react'

interface AuthRedirectProps {
  locale: 'en' | 'es'
  translations: Record<string, any>
}

export default function AuthRedirect({ locale, translations }: AuthRedirectProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {translations.goToLoginTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{translations.goToLoginDescription}</p>
          <Button asChild className="w-full">
            <Link href={`/${locale}/login`}>{translations.goToLoginButton}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
