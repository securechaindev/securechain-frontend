export const STORAGE_KEYS = {
  USER_ID: 'user_id',
  USER_EMAIL: 'user_email',
  THEME: 'theme',
  LOCALE: 'locale',
  HOME_ACTIVE_TAB: 'home-active-tab',
} as const

export const LOCALES = {
  EN: 'en',
  ES: 'es',
} as const

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

export const NODE_TYPES = {
  PYPI: 'PyPIPackage',
  NPM: 'NPMPackage',
  MAVEN: 'MavenPackage',
  RUBYGEMS: 'RubyGemsPackage',
  CARGO: 'CargoPackage',
  NUGET: 'NuGetPackage',
} as const

export const NODE_TYPE_LABELS = {
  [NODE_TYPES.PYPI]: 'PyPI (Python)',
  [NODE_TYPES.NPM]: 'NPM (Node.js)',
  [NODE_TYPES.MAVEN]: 'Maven (Java)',
  [NODE_TYPES.RUBYGEMS]: 'RubyGems (Ruby)',
  [NODE_TYPES.CARGO]: 'Cargo (Rust)',
  [NODE_TYPES.NUGET]: 'NuGet (.NET)',
} as const

export const VULNERABILITY_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const
