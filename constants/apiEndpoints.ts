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
    OPERATION: {
      SSC: {
        FILE_INFO: '/api/depex/operation/ssc/file_info',
        PACKAGE_INFO: '/api/depex/operation/ssc/package_info',
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
    GET_USER_VEXS: (userId: string) => `/api/vexgen/vex/user/${userId}`,
    GET_VEX: (vexId: string) => `/api/vexgen/vex/show/${vexId}`,
    DOWNLOAD_VEX: '/api/vexgen/vex/download',
    GET_USER_TIXS: (userId: string) => `/api/vexgen/tix/user/${userId}`,
    GET_TIX: (tixId: string) => `/api/vexgen/tix/show/${tixId}`,
    DOWNLOAD_TIX: '/api/vexgen/tix/download',
  },
} as const

export type ApiEndpoint = typeof API_ENDPOINTS
