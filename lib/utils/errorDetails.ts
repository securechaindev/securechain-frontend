export function getErrorMessage(detail: string, translations: Record<string, any>): string {
  const errorDetails: Record<string, string> = {
    // Auth error details
    user_already_exists: translations.authErrorDetails?.userAlreadyExists,
    user_no_exist: translations.authErrorDetails?.userNotFound,
    user_incorrect_password: translations.authErrorDetails?.incorrectPassword,
    user_invalid_old_password: translations.authErrorDetails?.invalidOldPassword,
    password_mismatch: translations.authErrorDetails?.passwordMismatch,
    missing_refresh_token: translations.authErrorDetails?.missingRefreshToken,
    token_revoked: translations.authErrorDetails?.tokenRevoked,
    token_missing: translations.authErrorDetails?.tokenMissing,
    token_expired: translations.authErrorDetails?.tokenExpired,
    token_invalid: translations.authErrorDetails?.tokenInvalid,
    token_error: translations.authErrorDetails?.tokenError,

    // General backend error details
    validation_error: translations.backendErrorDetails?.validationError,
    http_error: translations.backendErrorDetails?.httpError,
    internal_error: translations.backendErrorDetails?.internalError,

    // Depex/Graph error details
    package_not_found: translations.depexErrorDetails?.packageNotFound,
    version_not_found: translations.depexErrorDetails?.versionNotFound,
    version_already_exists: translations.depexErrorDetails?.versionAlreadyExists,
    no_repo: translations.depexErrorDetails?.noRepo,

    // Network and generic errors
    network_error: translations.authErrorDetails?.networkError,
    server_error: translations.authErrorDetails?.serverError,
    unknown_error: translations.authErrorDetails?.unknownError,
  }

  return errorDetails[detail] || translations.authErrorDetails?.unknownError
}

export function getSuccessMessage(detail: string, translations: Record<string, any>): string {
  const successDetails: Record<string, string> = {
    // Auth success details
    signup_success: translations.authSuccessDetails?.signupSuccess,
    user_created_successfully: translations.authSuccessDetails?.signupSuccess,
    login_success: translations.authSuccessDetails?.loginSuccess,
    logout_success: translations.authSuccessDetails?.logoutSuccess,
    change_password_success: translations.authSuccessDetails?.changePasswordSuccess,
    account_exists_success: translations.authSuccessDetails?.accountExistsSuccess,
    token_verification_success: translations.authSuccessDetails?.tokenVerificationSuccess,
    refresh_token_success: translations.authSuccessDetails?.refreshTokenSuccess,

    // Depex/Graph success details
    get_repositories_success: translations.depexSuccessDetails?.getRepositoriesSuccess,
    get_package_status_success: translations.depexSuccessDetails?.getPackageStatusSuccess,
    get_version_status_success: translations.depexSuccessDetails?.getVersionStatusSuccess,
    package_initializing: translations.depexSuccessDetails?.packageInitializing,
    init_repo: translations.depexSuccessDetails?.initRepo,
  }

  return successDetails[detail] || translations.authSuccessDetails?.unknownSuccess
}

export function isErrorDetail(detail: string): boolean {
  const errorDetails = [
    // Auth error details
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

    // General backend error details
    'validation_error',
    'http_error',
    'internal_error',

    // Depex/Graph error details
    'package_not_found',
    'version_not_found',
    'version_already_exists',
    'no_repo',

    // Network and generic errors
    'network_error',
    'server_error',
    'unknown_error',
  ]

  return errorDetails.includes(detail)
}

export function getDepexErrorMessage(detail: string, translations: Record<string, any>): string {
  const depexErrorDetails: Record<string, string> = {
    package_not_found: translations.depexErrorDetails?.packageNotFound,
    version_not_found: translations.depexErrorDetails?.versionNotFound,
    version_already_exists: translations.depexErrorDetails?.versionAlreadyExists,
    no_repo: translations.depexErrorDetails?.noRepo,
    validation_error: translations.backendErrorDetails?.validationError,
    http_error: translations.backendErrorDetails?.httpError,
    internal_error: translations.backendErrorDetails?.internalError,
    network_error: translations.depexApiErrors?.networkError,
    server_error: translations.depexApiErrors?.serverError,
  }

  return depexErrorDetails[detail] || translations.depexApiErrors?.networkError
}

export function getDepexSuccessMessage(detail: string, translations: Record<string, any>): string {
  const depexSuccessDetails: Record<string, string> = {
    get_repositories_success: translations.depexSuccessDetails?.getRepositoriesSuccess,
    get_package_status_success: translations.depexSuccessDetails?.getPackageStatusSuccess,
    get_version_status_success: translations.depexSuccessDetails?.getVersionStatusSuccess,
    package_initializing: translations.depexSuccessDetails?.packageInitializing,
    init_repo: translations.depexSuccessDetails?.initRepo,
  }

  return depexSuccessDetails[detail] || translations.depexApiSuccess?.operationCompleted
}
