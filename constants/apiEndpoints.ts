export const API_ENDPOINTS = {
  USER: {
    LOGIN: '/api/auth/user/login',
    LOGOUT: '/api/auth/user/logout',
    SIGNUP: '/api/auth/user/signup',
    CHECK_TOKEN: '/api/auth/user/check_token',
    REFRESH_TOKEN: '/api/auth/user/refresh_token',
    CHANGE_PASSWORD: '/api/auth/user/change_password',
    ACCOUNT_EXISTS: '/api/auth/user/account_exists',
  },
  API_KEYS: {
    CREATE: '/api/auth/api-keys/create',
    LIST: '/api/auth/api-keys/list',
    REVOKE: (keyId: string) => `/api/auth/api-keys/${keyId}/revoke`,
  },
  DEPEX: {
    REPOSITORIES: '/api/depex/graph/repositories',
    REPOSITORY_INIT: '/api/depex/graph/repository/init',
    PACKAGE_STATUS: '/api/depex/graph/package/status',
    PACKAGE_INIT: '/api/depex/graph/package/init',
    VERSION_STATUS: '/api/depex/graph/version/status',
    OPERATION: {
      SSC: {
        FILE_INFO: '/api/depex/operation/ssc/file_info',
        PACKAGE_INFO: '/api/depex/operation/ssc/package_info',
        VERSION_INFO: '/api/depex/operation/ssc/version_info',
      },
      SMT: {
        FILTER_CONFIGS: '/api/depex/operation/smt/filter_configs',
        MAXIMIZE_IMPACT: '/api/depex/operation/smt/maximize_impact',
        MINIMIZE_IMPACT: '/api/depex/operation/smt/minimize_impact',
        VALID_GRAPH: '/api/depex/operation/smt/valid_graph',
        COMPLETE_CONFIG: '/api/depex/operation/smt/complete_config',
        CONFIG_BY_IMPACT: '/api/depex/operation/smt/config_by_impact',
        VALID_CONFIG: '/api/depex/operation/smt/valid_config',
      },
    },
  },
  VEXGEN: {
    GENERATE_VEX_TIX: '/api/vexgen/vex_tix/generate',
    GET_USER_VEXS: '/api/vexgen/vex/user',
    GET_VEX: (vexId: string) => `/api/vexgen/vex/show/${vexId}`,
    DOWNLOAD_VEX: '/api/vexgen/vex/download',
    GET_USER_TIXS: '/api/vexgen/tix/user',
    GET_TIX: (tixId: string) => `/api/vexgen/tix/show/${tixId}`,
    DOWNLOAD_TIX: '/api/vexgen/tix/download',
  },
} as const

export type ApiEndpoint = typeof API_ENDPOINTS
