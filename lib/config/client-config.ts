// Client-safe configuration
// This file only contains configuration that can be safely used in the browser

// Environment variables type (client-safe only)
interface ClientEnvironment {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_API_URL?: string
  NEXT_PUBLIC_APP_URL?: string
  NEXT_PUBLIC_SENTRY_DSN?: string
  NEXT_PUBLIC_POSTHOG_KEY?: string
  NEXT_PUBLIC_POSTHOG_HOST?: string
}

// Get environment variables at build time (Next.js will replace these at build time)
const clientEnv: ClientEnvironment = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
}

// Client configuration class
class ClientConfig {
  private env: ClientEnvironment

  constructor() {
    this.env = clientEnv
  }

  // Environment checks
  get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development'
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production'
  }

  get isTest(): boolean {
    return this.env.NODE_ENV === 'test'
  }

  // API configuration
  get apiUrl(): string {
    if (this.env.NEXT_PUBLIC_API_URL) {
      return this.env.NEXT_PUBLIC_API_URL
    }
    
    if (this.isDevelopment) {
      return 'http://localhost:3001'
    }
    
    return 'https://api.securechain.dev'
  }

  get appUrl(): string {
    if (this.env.NEXT_PUBLIC_APP_URL) {
      return this.env.NEXT_PUBLIC_APP_URL
    }
    
    if (this.isDevelopment) {
      return 'http://localhost:3000'
    }
    
    if (this.isTest) {
      return 'http://localhost:3001'
    }
    return 'https://securechain.dev'
  }

  // App version (client-safe default)
  get appVersion(): string {
    return '1.0.0' // Static version for client
  }

  // API configuration
  get app() {
    return {
      name: 'SecureChain',
      version: this.appVersion,
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
        animations: !this.isTest,
        devtools: this.isDevelopment,
      },
    }
  }

  // Feature flags
  get enableDevtools(): boolean {
    return this.isDevelopment
  }

  get enableAnalytics(): boolean {
    return this.isProduction && !!this.env.NEXT_PUBLIC_POSTHOG_KEY
  }

  get enableSentry(): boolean {
    return this.isProduction && !!this.env.NEXT_PUBLIC_SENTRY_DSN
  }

  // Validation methods
  validateClientConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Only validate client-accessible variables
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

// Create and export singleton instance
export const clientConfig = new ClientConfig()

// Export type for use in other files
export type { ClientEnvironment }
