// Validation utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

export const isPositiveNumber = (value: any): value is number => {
  return typeof value === 'number' && value > 0
}

// Package name validation for different ecosystems
export const isValidPackageName = (name: string, ecosystem: string): boolean => {
  switch (ecosystem.toLowerCase()) {
    case 'pypi':
      // PyPI package naming rules
      return /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(name)
    case 'npm':
      // NPM package naming rules
      return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
    case 'maven':
      // Maven artifact naming (simplified)
      return /^[a-zA-Z0-9._-]+$/.test(name)
    case 'rubygems':
      // RubyGems naming rules
      return /^[a-zA-Z0-9._-]+$/.test(name)
    case 'cargo':
      // Cargo package naming rules
      return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)
    case 'nuget':
      // NuGet package naming rules
      return /^[a-zA-Z0-9._-]+$/.test(name)
    default:
      return /^[a-zA-Z0-9._-]+$/.test(name)
  }
}

// Version validation
export const isValidVersion = (version: string): boolean => {
  // Semantic versioning pattern
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
  return semverRegex.test(version)
}

// Repository URL validation
export const isValidRepositoryUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false
  
  const validHosts = [
    'github.com',
    'gitlab.com',
    'bitbucket.org',
    'codeberg.org',
    'git.sr.ht'
  ]
  
  try {
    const urlObj = new URL(url)
    return validHosts.some(host => urlObj.hostname.includes(host))
  } catch {
    return false
  }
}

// Form validation schemas
export interface ValidationRule<T = any> {
  required?: boolean
  message: string
  validator: (value: T) => boolean
}

export interface ValidationSchema {
  [key: string]: ValidationRule[]
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

export const validateForm = (
  data: Record<string, any>,
  schema: ValidationSchema
): ValidationResult => {
  const errors: Record<string, string[]> = {}

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    const fieldErrors: string[] = []

    for (const rule of rules) {
      // Check required
      if (rule.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(rule.message)
        continue
      }

      // Skip validation if not required and value is empty
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue
      }

      // Run custom validator
      if (!rule.validator(value)) {
        fieldErrors.push(rule.message)
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Common validation schemas
export const authValidationSchema: ValidationSchema = {
  email: [
    {
      required: true,
      message: 'Email is required',
      validator: (value) => isNonEmptyString(value)
    },
    {
      required: false,
      message: 'Please enter a valid email address',
      validator: (value) => isValidEmail(value)
    }
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
      validator: (value) => isNonEmptyString(value)
    },
    {
      required: false,
      message: 'Password must be at least 8 characters long',
      validator: (value) => typeof value === 'string' && value.length >= 8
    }
  ]
}

export const packageValidationSchema: ValidationSchema = {
  name: [
    {
      required: true,
      message: 'Package name is required',
      validator: (value) => isNonEmptyString(value)
    }
  ],
  version: [
    {
      required: false,
      message: 'Please enter a valid version number',
      validator: (value) => !value || isValidVersion(value)
    }
  ]
}

export const repositoryValidationSchema: ValidationSchema = {
  url: [
    {
      required: true,
      message: 'Repository URL is required',
      validator: (value) => isNonEmptyString(value)
    },
    {
      required: false,
      message: 'Please enter a valid repository URL',
      validator: (value) => isValidRepositoryUrl(value)
    }
  ],
  name: [
    {
      required: true,
      message: 'Repository name is required',
      validator: (value) => isNonEmptyString(value)
    },
    {
      required: false,
      message: 'Repository name must be at least 2 characters long',
      validator: (value) => typeof value === 'string' && value.length >= 2
    }
  ]
}
