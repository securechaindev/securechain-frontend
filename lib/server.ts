// Server-side barrel exports
// This file includes utilities that require Node.js APIs (fs, require, etc.)

// All client-safe exports
export * from './client'

// Server-only utilities
export * from './auth/server-auth'
export * from './server-i18n'

// Server-only config (explicit import required)
// Use: import { serverConfig } from '@/lib/config/config'
