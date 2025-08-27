export interface Endpoint {
  method: string
  path: string
  summary: string
  description: string
  auth?: boolean
  tag?: string
}

export const getEndpointData = (t: any) => {
  // Auth endpoints (matching openapi.json)
  const authEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'POST',
          path: '/auth/signup',
          summary: t.docs.userSignup,
          description: t.docs.userSignupDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/login',
          summary: t.docs.userLogin,
          description: t.docs.userLoginDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/logout',
          summary: t.docs.userLogout,
          description: t.docs.userLogoutDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/auth/account_exists',
          summary: t.docs.accountExists,
          description: t.docs.accountExistsDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/change_password',
          summary: t.docs.changePassword,
          description: t.docs.changePasswordDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/auth/check_token',
          summary: t.docs.checkToken,
          description: t.docs.checkTokenDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/refresh_token',
          summary: t.docs.refreshToken,
          description: t.docs.refreshTokenDescription,
          auth: false,
        },
      ]

  // Depex Graph endpoints (matching openapi.json)
  const depexGraphEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'GET',
          path: '/depex/graph/repositories/{user_id}',
          summary: t.docs.getUserRepositories,
          description: t.docs.getUserRepositoriesDescription,
          auth: true,
        },
        {
          method: 'GET',
          path: '/depex/graph/package/status',
          summary: t.docs.getPackageStatus,
          description: t.docs.getPackageStatusDescription,
          auth: true,
        },
        {
          method: 'GET',
          path: '/depex/graph/version/status',
          summary: t.docs.getVersionStatus,
          description: t.docs.getVersionStatusDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/graph/version/init',
          summary: t.docs.initVersion,
          description: t.docs.initVersionDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/graph/package/init',
          summary: t.docs.initPackage,
          description: t.docs.initPackageDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/graph/repository/init',
          summary: t.docs.initRepository,
          description: t.docs.initRepositoryDescription,
          auth: true,
        },
      ]

  // Depex File Operation endpoints (matching openapi.json)
  const depexFileOperationEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'POST',
          path: '/depex/operation/file/file_info',
          summary: t.docs.fileInfo,
          description: t.docs.fileInfoDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/file/valid_graph',
          summary: t.docs.validGraph,
          description: t.docs.validGraphDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/file/minimize_impact',
          summary: t.docs.minimizeImpact,
          description: t.docs.minimizeImpactDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/file/maximize_impact',
          summary: t.docs.maximizeImpact,
          description: t.docs.maximizeImpactDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/file/filter_configs',
          summary: t.docs.filterConfigs,
          description: t.docs.filterConfigsDescription,
          auth: true,
        },
      ]

  // Depex Config Operation endpoints (matching openapi.json)
  const depexConfigOperationEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'POST',
          path: '/depex/operation/config/valid_config',
          summary: t.docs.validConfig,
          description: t.docs.validConfigDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/config/complete_config',
          summary: t.docs.completeConfig,
          description: t.docs.completeConfigDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/config/config_by_impact',
          summary: t.docs.configByImpact,
          description: t.docs.configByImpactDescription,
          auth: true,
        },
      ]

  // VEXGen endpoints (matching openapi.json)
  const vexgenEndpoints: Endpoint[] = !t?.docs?.vexgen
    ? []
    : [
        {
          method: 'GET',
          path: '/vexgen/vex/user/{user_id}',
          summary: t.docs.vexgen.vexUserDocuments,
          description: t.docs.vexgen.vexUserDocumentsDescription,
          auth: true,
          tag: 'VEX',
        },
        {
          method: 'GET',
          path: '/vexgen/vex/show/{vex_id}',
          summary: t.docs.vexgen.vexShowDocument,
          description: t.docs.vexgen.vexShowDocumentDescription,
          auth: true,
          tag: 'VEX',
        },
        {
          method: 'POST',
          path: '/vexgen/vex/download',
          summary: t.docs.vexgen.vexDownload,
          description: t.docs.vexgen.vexDownloadDescription,
          auth: true,
          tag: 'VEX',
        },
        {
          method: 'GET',
          path: '/vexgen/tix/user/{user_id}',
          summary: t.docs.vexgen.tixUserDocuments,
          description: t.docs.vexgen.tixUserDocumentsDescription,
          auth: true,
          tag: 'TIX',
        },
        {
          method: 'GET',
          path: '/vexgen/tix/show/{tix_id}',
          summary: t.docs.vexgen.tixShowDocument,
          description: t.docs.vexgen.tixShowDocumentDescription,
          auth: true,
          tag: 'TIX',
        },
        {
          method: 'POST',
          path: '/vexgen/tix/download',
          summary: t.docs.vexgen.tixDownload,
          description: t.docs.vexgen.tixDownloadDescription,
          auth: true,
          tag: 'TIX',
        },
        {
          method: 'POST',
          path: '/vexgen/vex_tix/generate',
          summary: t.docs.vexgen.generateFromRepo,
          description: t.docs.vexgen.generateFromRepoDescription,
          auth: true,
          tag: 'Generation',
        },
      ]

  return {
    authEndpoints,
    depexGraphEndpoints,
    depexFileOperationEndpoints,
    depexConfigOperationEndpoints,
    vexgenEndpoints,
  }
}
