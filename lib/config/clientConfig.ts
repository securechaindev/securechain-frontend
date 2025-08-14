interface ClientEnvironment {
  NODE_ENV: 'development' | 'production'
  NEXT_PUBLIC_API_URL?: string
  NEXT_PUBLIC_APP_URL?: string
  NEXT_PUBLIC_SENTRY_DSN?: string
  NEXT_PUBLIC_POSTHOG_KEY?: string
  NEXT_PUBLIC_POSTHOG_HOST?: string
}

const clientEnv: ClientEnvironment = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
}

class ClientConfig {
  private env: ClientEnvironment

  constructor() {
    this.env = clientEnv
  }

  get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development'
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production'
  }

  get apiUrl(): string {
    if (this.env.NEXT_PUBLIC_API_URL) {
      return this.env.NEXT_PUBLIC_API_URL
    }

    if (this.isDevelopment) {
      return 'http://localhost:3001'
    }

    return ''
  }

  get appUrl(): string {
    if (this.env.NEXT_PUBLIC_APP_URL) {
      return this.env.NEXT_PUBLIC_APP_URL
    }

    if (this.isDevelopment) {
      return 'http://localhost:3000'
    }

    return 'https://securechain.dev'
  }

  get appVersion(): string {
    return '1.0.0'
  }

  get app() {
    return {
      name: 'SecureChain',
      version: this.appVersion,
      description: 'Dependency Analysis Platform',
      url: this.appUrl,
      api: {
        url: this.apiUrl,
        timeout: 30000,
        retries: 3,
      },
      ui: {
        defaultTheme: 'system' as const,
        defaultLocale: 'en' as const,
        animations: true,
        devtools: this.isDevelopment,
      },
    }
  }

  get enableDevtools(): boolean {
    return this.isDevelopment
  }

  get enableAnalytics(): boolean {
    return this.isProduction && !!this.env.NEXT_PUBLIC_POSTHOG_KEY
  }

  get enableSentry(): boolean {
    return this.isProduction && !!this.env.NEXT_PUBLIC_SENTRY_DSN
  }

  validateClientConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (this.isProduction) {
      if (!this.env.NEXT_PUBLIC_API_URL) {
        errors.push('NEXT_PUBLIC_API_URL is required in production')
      }

      if (!this.env.NEXT_PUBLIC_APP_URL) {
        errors.push('NEXT_PUBLIC_APP_URL is required in production')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export const clientConfig = new ClientConfig()

export type { ClientEnvironment }
