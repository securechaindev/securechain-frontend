export function getErrorMessage(code: string, translations: Record<string, any>): string {
  const errorCodes: Record<string, string> = {
    // Auth error codes
    user_already_exists: translations.authErrorCodes?.userAlreadyExists || 'User already exists',
    user_no_exist: translations.authErrorCodes?.userNotFound || 'User not found',
    user_incorrect_password: translations.authErrorCodes?.incorrectPassword || 'Incorrect password',
    user_invalid_old_password:
      translations.authErrorCodes?.invalidOldPassword || 'Invalid old password',
    password_mismatch: translations.authErrorCodes?.passwordMismatch || 'Passwords do not match',
    missing_refresh_token:
      translations.authErrorCodes?.missingRefreshToken || 'Missing refresh token',
    token_revoked: translations.authErrorCodes?.tokenRevoked || 'Token has been revoked',
    token_missing: translations.authErrorCodes?.tokenMissing || 'Token is missing',
    token_expired: translations.authErrorCodes?.tokenExpired || 'Token has expired',
    token_invalid: translations.authErrorCodes?.tokenInvalid || 'Token is invalid',
    token_error: translations.authErrorCodes?.tokenError || 'Token verification error',

    // General backend error codes
    validation_error:
      translations.backendErrorCodes?.validationError || 'Validation error occurred',
    http_error: translations.backendErrorCodes?.httpError || 'HTTP error occurred',
    internal_error: translations.backendErrorCodes?.internalError || 'Internal server error',

    // Depex/Graph error codes
    package_not_found: translations.depexErrorCodes?.packageNotFound || 'Package not found',
    version_not_found: translations.depexErrorCodes?.versionNotFound || 'Version not found',
    version_already_exists:
      translations.depexErrorCodes?.versionAlreadyExists || 'Version already exists',
    no_repo: translations.depexErrorCodes?.noRepo || 'Repository not found or not accessible',

    // Network and generic errors
    network_error: translations.authErrorCodes?.networkError || 'Network error',
    server_error: translations.authErrorCodes?.serverError || 'Server error',
    unknown_error: translations.authErrorCodes?.unknownError || 'Unknown error occurred',
  }

  return errorCodes[code] || translations.authErrorCodes?.unknownError || 'Unknown error occurred'
}

export function getSuccessMessage(code: string, translations: Record<string, any>): string {
  const successCodes: Record<string, string> = {
    // Auth success codes
    signup_success: translations.authSuccessCodes?.signupSuccess || 'Account created successfully',
    user_created_successfully:
      translations.authSuccessCodes?.signupSuccess || 'Account created successfully',
    login_success: translations.authSuccessCodes?.loginSuccess || 'Login successful',
    logout_success: translations.authSuccessCodes?.logoutSuccess || 'Logout successful',
    change_password_success:
      translations.authSuccessCodes?.changePasswordSuccess || 'Password changed successfully',
    account_exists_success:
      translations.authSuccessCodes?.accountExistsSuccess || 'Account check completed',
    token_verification_success:
      translations.authSuccessCodes?.tokenVerificationSuccess || 'Token is valid',
    refresh_token_success:
      translations.authSuccessCodes?.refreshTokenSuccess || 'Token refreshed successfully',

    // Depex/Graph success codes
    get_repositories_success:
      translations.depexSuccessCodes?.getRepositoriesSuccess ||
      'Repositories retrieved successfully',
    get_package_status_success:
      translations.depexSuccessCodes?.getPackageStatusSuccess ||
      'Package status retrieved successfully',
    get_version_status_success:
      translations.depexSuccessCodes?.getVersionStatusSuccess ||
      'Version status retrieved successfully',
    version_initializing:
      translations.depexSuccessCodes?.versionInitializing || 'Version initialization started',
    package_initializing:
      translations.depexSuccessCodes?.packageInitializing || 'Package initialization started',
    init_repo: translations.depexSuccessCodes?.initRepo || 'Repository initialization started',
  }

  return (
    successCodes[code] ||
    translations.authSuccessCodes?.unknownSuccess ||
    'Operation completed successfully'
  )
}

export function isErrorCode(code: string): boolean {
  const errorCodes = [
    // Auth error codes
    'user_already_exists',
    'user_no_exist',
    'user_incorrect_password',
    'user_invalid_old_password',
    'password_mismatch',
    'missing_refresh_token',
    'token_revoked',
    'token_missing',
    'token_expired',
    'token_invalid',
    'token_error',

    // General backend error codes
    'validation_error',
    'http_error',
    'internal_error',

    // Depex/Graph error codes
    'package_not_found',
    'version_not_found',
    'version_already_exists',
    'no_repo',

    // Network and generic errors
    'network_error',
    'server_error',
    'unknown_error',
  ]

  return errorCodes.includes(code)
}

export function getDepexErrorMessage(code: string, translations: Record<string, any>): string {
  const depexErrorCodes: Record<string, string> = {
    package_not_found: translations.depexErrorCodes?.packageNotFound || 'Package not found',
    version_not_found: translations.depexErrorCodes?.versionNotFound || 'Version not found',
    version_already_exists:
      translations.depexErrorCodes?.versionAlreadyExists || 'Version already exists',
    no_repo: translations.depexErrorCodes?.noRepo || 'Repository not found',
    validation_error: translations.backendErrorCodes?.validationError || 'Validation error',
    http_error: translations.backendErrorCodes?.httpError || 'HTTP error',
    internal_error: translations.backendErrorCodes?.internalError || 'Internal server error',
    network_error: translations.depexApiErrors?.networkError || 'Network error',
    server_error: translations.depexApiErrors?.serverError || 'Server error',
  }

  return (
    depexErrorCodes[code] || translations.depexApiErrors?.networkError || 'Unknown error occurred'
  )
}

export function getDepexSuccessMessage(code: string, translations: Record<string, any>): string {
  const depexSuccessCodes: Record<string, string> = {
    get_repositories_success:
      translations.depexSuccessCodes?.getRepositoriesSuccess ||
      'Repositories retrieved successfully',
    get_package_status_success:
      translations.depexSuccessCodes?.getPackageStatusSuccess ||
      'Package status retrieved successfully',
    get_version_status_success:
      translations.depexSuccessCodes?.getVersionStatusSuccess ||
      'Version status retrieved successfully',
    version_initializing:
      translations.depexSuccessCodes?.versionInitializing || 'Version initialization started',
    package_initializing:
      translations.depexSuccessCodes?.packageInitializing || 'Package initialization started',
    init_repo: translations.depexSuccessCodes?.initRepo || 'Repository initialization started',
  }

  return (
    depexSuccessCodes[code] ||
    translations.depexApiSuccess?.operationCompleted ||
    'Operation completed successfully'
  )
}
