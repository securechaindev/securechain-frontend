export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
    CHECK_TOKEN: '/api/auth/check_token',
    REFRESH_TOKEN: '/api/auth/refresh_token',
    CHANGE_PASSWORD: '/api/auth/change_password',
    ACCOUNT_EXISTS: '/api/auth/account_exists',
  },
  DEPEX: {
    REPOSITORIES: (userId: string) => `/api/depex/graph/repositories/${userId}`,
    REPOSITORY_INIT: '/api/depex/graph/repository/init',
    PACKAGE_STATUS: '/api/depex/graph/package/status',
    PACKAGE_INIT: '/api/depex/graph/package/init',
    VERSION_STATUS: '/api/depex/graph/version/status',
    VERSION_INIT: '/api/depex/graph/version/init',
    OPERATION: {
      CONFIG: {
        COMPLETE_CONFIG: '/api/depex/operation/config/complete_config',
        CONFIG_BY_IMPACT: '/api/depex/operation/config/config_by_impact',
        VALID_CONFIG: '/api/depex/operation/config/valid_config',
      },
      FILE: {
        FILE_INFO: '/api/depex/operation/file/file_info',
        FILTER_CONFIGS: '/api/depex/operation/file/filter_configs',
        MAXIMIZE_IMPACT: '/api/depex/operation/file/maximize_impact',
        MINIMIZE_IMPACT: '/api/depex/operation/file/minimize_impact',
        VALID_GRAPH: '/api/depex/operation/file/valid_graph',
      },
    },
  },
} as const

export type ApiEndpoint = typeof API_ENDPOINTS
