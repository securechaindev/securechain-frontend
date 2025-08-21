export class BaseError extends Error {
  public readonly name: string
  public readonly isOperational: boolean

  constructor(name: string, message: string, isOperational = true) {
    super(message)
    this.name = name
    this.isOperational = isOperational

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }
  }
}

export class APIError extends BaseError {
  public readonly status: number
  public readonly detail?: string
  public readonly details?: any

  constructor(status: number, message: string, detail?: string, details?: any) {
    super('APIError', message)
    this.status = status
    this.detail = detail
    this.details = details
  }
}

export class ValidationError extends BaseError {
  public readonly field?: string
  public readonly value?: any

  constructor(message: string, field?: string, value?: any) {
    super('ValidationError', message)
    this.field = field
    this.value = value
  }
}

export class NetworkError extends BaseError {
  public readonly originalError?: Error

  constructor(message: string, originalError?: Error) {
    super('NetworkError', message)
    this.originalError = originalError
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed') {
    super('AuthenticationError', message)
  }
}
