interface Environment {
  NODE_ENV: 'development' | 'production'
  NEXT_PUBLIC_API_URL?: string
  NEXT_PUBLIC_APP_URL?: string
  NEXT_PUBLIC_SENTRY_DSN?: string
  NEXT_PUBLIC_POSTHOG_KEY?: string
  NEXT_PUBLIC_POSTHOG_HOST?: string
  DATABASE_URL?: string
  NEXTAUTH_SECRET?: string
  NEXTAUTH_URL?: string
}

function parseEnv(): Environment {
  const env = process.env as any

  return {
    NODE_ENV: env.NODE_ENV || 'development',
    NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: env.NEXT_PUBLIC_POSTHOG_HOST,
    DATABASE_URL: env.DATABASE_URL,
    NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: env.NEXTAUTH_URL,
  }
}

export class Config {
  private static instance: Config
  private env: Environment

  private constructor() {
    this.env = parseEnv()
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }

  public get nodeEnv(): string {
    return this.env.NODE_ENV
  }

  public get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development'
  }

  public get isProduction(): boolean {
    return this.env.NODE_ENV === 'production'
  }

  public get apiUrl(): string {
    return this.env.NEXT_PUBLIC_API_URL || this.getDefaultApiUrl()
  }

  public get appUrl(): string {
    return this.env.NEXT_PUBLIC_APP_URL || this.getDefaultAppUrl()
  }

  public get sentryDsn(): string | undefined {
    return this.env.NEXT_PUBLIC_SENTRY_DSN
  }

  public get posthogKey(): string | undefined {
    return this.env.NEXT_PUBLIC_POSTHOG_KEY
  }

  public get posthogHost(): string | undefined {
    return this.env.NEXT_PUBLIC_POSTHOG_HOST
  }

  public get databaseUrl(): string | undefined {
    return this.env.DATABASE_URL
  }

  public get nextAuthSecret(): string | undefined {
    return this.env.NEXTAUTH_SECRET
  }

  public get nextAuthUrl(): string | undefined {
    return this.env.NEXTAUTH_URL
  }

  public get features() {
    return {
      analytics: this.isProduction && !!this.posthogKey,
      errorTracking: this.isProduction && !!this.sentryDsn,
      development: this.isDevelopment,
    }
  }

  public get app() {
    return {
      name: 'SecureChain',
      version: this.getAppVersion(),
      description: 'Dependency Analysis Platform',
      url: this.appUrl,
      api: {
        url: this.apiUrl,
        timeout: 30000, // 30 seconds
        retries: 3,
      },
      ui: {
        defaultTheme: 'system' as const,
        defaultLocale: 'en' as const,
        animations: true,
        devtools: this.isDevelopment,
      },
      security: {
        requireAuth: true,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        csrfProtection: this.isProduction,
      },
    }
  }

  private getDefaultApiUrl(): string {
    if (this.isDevelopment) {
      return 'http://localhost:8000'
    }
    return 'https://api.securechain.dev'
  }

  private getDefaultAppUrl(): string {
    if (this.isDevelopment) {
      return 'http://localhost:3000'
    }
    return 'https://securechain.dev'
  }

  private getAppVersion(): string {
    try {
      return require('../../package.json').version || '1.0.0'
    } catch {
      return '1.0.0'
    }
  }

  public validateConfig(): boolean {
    try {
      if (this.isProduction) {
        if (!this.env.NEXT_PUBLIC_API_URL) {
          throw new Error('NEXT_PUBLIC_API_URL is required in production')
        }
        if (!this.env.NEXTAUTH_SECRET) {
          throw new Error('NEXTAUTH_SECRET is required in production')
        }
      }

      return true
    } catch (error) {
      console.error('❌ Configuration validation failed:', error)
      return false
    }
  }

  public getDebugInfo() {
    return {
      nodeEnv: this.nodeEnv,
      apiUrl: this.apiUrl,
      appUrl: this.appUrl,
      features: this.features,
      timestamp: new Date().toISOString(),
    }
  }
}

export const config = Config.getInstance()

export const { app, features } = config
export const isDevelopment = config.isDevelopment
export const isProduction = config.isProduction
