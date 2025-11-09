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

export const isValidPackageName = (name: string, ecosystem: string): boolean => {
  switch (ecosystem.toLowerCase()) {
    case 'pypi':
      return /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/.test(name)
    case 'npm':
      return /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
    case 'maven':
      return /^[a-zA-Z0-9._-]+$/.test(name)
    case 'rubygems':
      return /^[a-zA-Z0-9._-]+$/.test(name)
    case 'cargo':
      return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)
    case 'nuget':
      return /^[a-zA-Z0-9._-]+$/.test(name)
    default:
      return /^[a-zA-Z0-9._-]+$/.test(name)
  }
}

export const isValidVersion = (version: string): boolean => {
  const semverRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
  return semverRegex.test(version)
}

export const isValidRepositoryUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false

  const validHosts = ['github.com', 'gitlab.com', 'bitbucket.org', 'codeberg.org', 'git.sr.ht']

  try {
    const urlObj = new URL(url)
    return validHosts.some(host => urlObj.hostname.includes(host))
  } catch {
    return false
  }
}

export interface ValidationRule<T = any> {
  required?: boolean
  message: string
  validator: (_value: T) => boolean
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
      if (rule.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(rule.message)
        continue
      }

      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue
      }

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
    errors,
  }
}

export const authValidationSchema: ValidationSchema = {
  email: [
    {
      required: true,
      message: 'Email is required',
      validator: value => isNonEmptyString(value),
    },
    {
      required: false,
      message: 'Please enter a valid email address',
      validator: value => isValidEmail(value),
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
      validator: value => isNonEmptyString(value),
    },
    {
      required: false,
      message: 'Password must be at least 8 characters long',
      validator: value => typeof value === 'string' && value.length >= 8,
    },
  ],
}

export const packageValidationSchema: ValidationSchema = {
  name: [
    {
      required: true,
      message: 'Package name is required',
      validator: value => isNonEmptyString(value),
    },
  ],
  version: [
    {
      required: false,
      message: 'Please enter a valid version number',
      validator: value => !value || isValidVersion(value),
    },
  ],
}

export const repositoryValidationSchema: ValidationSchema = {
  url: [
    {
      required: true,
      message: 'Repository URL is required',
      validator: value => isNonEmptyString(value),
    },
    {
      required: false,
      message: 'Please enter a valid repository URL',
      validator: value => isValidRepositoryUrl(value),
    },
  ],
  name: [
    {
      required: true,
      message: 'Repository name is required',
      validator: value => isNonEmptyString(value),
    },
    {
      required: false,
      message: 'Repository name must be at least 2 characters long',
      validator: value => typeof value === 'string' && value.length >= 2,
    },
  ],
}
