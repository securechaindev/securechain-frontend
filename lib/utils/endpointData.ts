export interface Endpoint {
  method: string
  path: string
  summary: string
  description: string
  auth?: boolean
  tag?: string
}

export const getEndpointData = () => {
  const authEndpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/auth/user/signup',
      summary: 'User Signup',
      description: 'Register a new user account',
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/user/login',
      summary: 'User Login',
      description: 'Login to an existing user account',
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/user/logout',
      summary: 'User Logout',
      description: 'Logout from the current session',
      auth: true,
    },
    {
      method: 'GET',
      path: '/auth/user/account-exists/{email}',
      summary: 'Account Exists',
      description: 'Check if a user account exists',
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/user/change-password',
      summary: 'Change Password',
      description: 'Change the password for the current user',
      auth: true,
    },
    {
      method: 'POST',
      path: '/auth/token/check',
      summary: 'Check Token',
      description: 'Verify the validity of a token',
      auth: false,
    },
    {
      method: 'POST',
      path: '/auth/token/refresh',
      summary: 'Refresh Token',
      description: 'Refresh the current authentication token',
      auth: true,
    },
  ]

  const apiKeysEndpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/auth/api-keys/create',
      summary: 'Create API Key',
      description: 'Create a new API key for a user',
      auth: true,
    },
    {
      method: 'GET',
      path: '/auth/api-keys/list',
      summary: 'List API Keys',
      description: 'List all API keys for the current user',
      auth: true,
    },
    {
      method: 'POST',
      path: '/auth/api-keys/{key_id}/revoke',
      summary: 'Revoke API Key',
      description: 'Revoke an existing API key for a user',
      auth: true,
    },
  ]

  const depexGraphEndpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/depex/user-repositories',
      summary: 'Get User Repositories',
      description: 'Retrieve all repositories for the current user',
      auth: true,
    },
    {
      method: 'GET',
      path: '/depex/package-status',
      summary: 'Get Package Status',
      description: 'Check the status of a package',
      auth: true,
    },
    {
      method: 'GET',
      path: '/depex/version-status',
      summary: 'Get Version Status',
      description: 'Check the status of a specific version',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/init-package',
      summary: 'Init Package',
      description: 'Initialize a new package for analysis',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/init-repository',
      summary: 'Init Repository',
      description: 'Initialize a repository for dependency analysis',
      auth: true,
    },
  ]

  const depexSSCOperationEndpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/depex/file-info',
      summary: 'File Info',
      description: 'Get information about a requirement file',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/package/{node_type}/{package}/info',
      summary: 'Get Package Info',
      description: 'Retrieve detailed information about a package',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/package/{node_type}/{package}/version/{version}/info',
      summary: 'Get Version Info',
      description: 'Retrieve detailed information about a version',
      auth: true,
    },
  ]

  const depexSMTOperationEndpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/depex/valid-graph',
      summary: 'Valid Graph',
      description: 'Validate a dependency graph for a requirement file',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/minimize-impact',
      summary: 'Minimize Impact',
      description: 'Find configurations that minimize dependency impact',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/maximize-impact',
      summary: 'Maximize Impact',
      description: 'Find configurations that maximize dependency impact',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/filter-configs',
      summary: 'Filter Configs',
      description: 'Filter configurations based on impact thresholds',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/valid-config',
      summary: 'Valid Config',
      description: 'Validate a specific configuration',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/complete-config',
      summary: 'Complete Config',
      description: 'Complete a partial configuration with optimal values',
      auth: true,
    },
    {
      method: 'POST',
      path: '/depex/config-by-impact',
      summary: 'Config By Impact',
      description: 'Get configuration recommendations based on impact level',
      auth: true,
    },
  ]

  const vexgenEndpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/vexgen/vex/user-documents',
      summary: 'VEX User Documents',
      description: 'List all VEX documents for a user',
      auth: true,
      tag: 'VEX',
    },
    {
      method: 'GET',
      path: '/vexgen/vex/show-document',
      summary: 'VEX Show Document',
      description: 'Retrieve a specific VEX document by ID',
      auth: true,
      tag: 'VEX',
    },
    {
      method: 'GET',
      path: '/vexgen/vex/download',
      summary: 'VEX Download',
      description: 'Download a VEX document as a file',
      auth: true,
      tag: 'VEX',
    },
    {
      method: 'GET',
      path: '/vexgen/tix/user-documents',
      summary: 'TIX User Documents',
      description: 'List all TIX documents for a user',
      auth: true,
      tag: 'TIX',
    },
    {
      method: 'GET',
      path: '/vexgen/tix/show-document',
      summary: 'TIX Show Document',
      description: 'Retrieve a specific TIX document by ID',
      auth: true,
      tag: 'TIX',
    },
    {
      method: 'GET',
      path: '/vexgen/tix/download',
      summary: 'TIX Download',
      description: 'Download a TIX document as a file',
      auth: true,
      tag: 'TIX',
    },
    {
      method: 'POST',
      path: '/vexgen/generate-from-repo',
      summary: 'Generate From Repository',
      description: 'Generate VEX/TIX documents from a repository',
      auth: true,
      tag: 'Generation',
    },
  ]

  return {
    authEndpoints,
    apiKeysEndpoints,
    depexGraphEndpoints,
    depexSSCOperationEndpoints,
    depexSMTOperationEndpoints,
    vexgenEndpoints,
  }
}
