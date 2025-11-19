const ERROR_MESSAGES: Record<string, string> = {
  // Auth error details
  user_already_exists: 'An account with this email already exists',
  user_no_exist: 'User not found',
  user_incorrect_password: 'Incorrect password',
  user_invalid_old_password: 'Current password is invalid',
  password_mismatch: 'Passwords do not match',
  missing_refresh_token: 'Refresh token is missing',
  token_revoked: 'Session has been revoked',
  token_missing: 'Authentication token is missing',
  token_expired: 'Your session has expired. Please log in again',
  token_invalid: 'Invalid authentication token',
  token_error: 'Authentication error occurred',

  // General backend error details
  validation_error: 'Invalid request data provided',
  http_error: 'HTTP request error occurred',
  internal_error: 'Internal server error occurred',

  // Depex/Graph error details
  package_not_found: 'Package not found in the database',
  version_not_found: 'Version not found for this package',
  version_already_exists: 'Version already exists in the database',
  no_repo: 'Repository not found or not accessible',

  // Network and generic errors
  network_error: 'Network connection error',
  server_error: 'Server temporarily unavailable',
  unknown_error: 'An unexpected error occurred',
}

const SUCCESS_MESSAGES: Record<string, string> = {
  // Auth success details
  signup_success: 'Account created successfully',
  user_created_successfully: 'Account created successfully',
  login_success: 'Welcome! Login successful',
  logout_success: 'You have been logged out successfully',
  change_password_success: 'Your password has been updated successfully',
  account_exists_success: 'Account verification completed',
  token_verification_success: 'Token is valid',
  refresh_token_success: 'Session refreshed successfully',

  // Depex/Graph success details
  get_repositories_success: 'User repositories retrieved successfully',
  get_package_status_success: 'Package status retrieved successfully',
  get_version_status_success: 'Version status retrieved successfully',
  package_initializing: 'Package initialization process started',
  init_repo: 'Repository analysis started in background',
  unknown_success: 'Operation completed successfully',
}

export function getErrorMessage(detail: string): string {
  return ERROR_MESSAGES[detail] || ERROR_MESSAGES.unknown_error
}

export function getSuccessMessage(detail: string): string {
  return SUCCESS_MESSAGES[detail] || SUCCESS_MESSAGES.unknown_success
}
