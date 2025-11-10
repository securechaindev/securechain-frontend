export interface Endpoint {
  method: string
  path: string
  summary: string
  description: string
  auth?: boolean
  tag?: string
}

export const getEndpointData = (t: any) => {
  const authEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'POST',
          path: '/auth/user/signup',
          summary: t.docs.userSignup,
          description: t.docs.userSignupDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/user/login',
          summary: t.docs.userLogin,
          description: t.docs.userLoginDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/user/logout',
          summary: t.docs.userLogout,
          description: t.docs.userLogoutDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/auth/user/account_exists',
          summary: t.docs.accountExists,
          description: t.docs.accountExistsDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/user/change_password',
          summary: t.docs.changePassword,
          description: t.docs.changePasswordDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/auth/user/check_token',
          summary: t.docs.checkToken,
          description: t.docs.checkTokenDescription,
          auth: false,
        },
        {
          method: 'POST',
          path: '/auth/user/refresh_token',
          summary: t.docs.refreshToken,
          description: t.docs.refreshTokenDescription,
          auth: false,
        },
      ]

  const apiKeysEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'POST',
          path: '/auth/api-keys/create',
          summary: t.docs.createApiKey || 'Create API Key',
          description: t.docs.createApiKeyDescription || 'Create a new API key for a user',
          auth: true,
        },
        {
          method: 'GET',
          path: '/auth/api-keys/list',
          summary: t.docs.listApiKeys || 'List API Keys',
          description:
            t.docs.listApiKeysDescription ||
            'Retrieve a list of API keys for the authenticated user',
          auth: true,
        },
        {
          method: 'PATCH',
          path: '/auth/api-keys/{key_id}/revoke',
          summary: t.docs.revokeApiKey || 'Revoke API Key',
          description: t.docs.revokeApiKeyDescription || 'Revoke an existing API key for a user',
          auth: true,
        },
      ]

  const depexGraphEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'GET',
          path: '/depex/graph/repositories',
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

  const depexSSCOperationEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'POST',
          path: '/depex/operation/ssc/file_info',
          summary: t.docs.fileInfo,
          description: t.docs.fileInfoDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/ssc/package_info',
          summary: t.docs.packageInfo || 'Get Package Info',
          description:
            t.docs.packageInfoDescription || 'Retrieve detailed information about a package',
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/ssc/version_info',
          summary: t.docs.versionInfo || 'Get Version Info',
          description:
            t.docs.versionInfoDescription || 'Retrieve detailed information about a version',
          auth: true,
        },
      ]

  const depexSMTOperationEndpoints: Endpoint[] = !t?.docs
    ? []
    : [
        {
          method: 'POST',
          path: '/depex/operation/smt/filter_configs',
          summary: t.docs.filterConfigs,
          description: t.docs.filterConfigsDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/smt/maximize_impact',
          summary: t.docs.maximizeImpact,
          description: t.docs.maximizeImpactDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/smt/minimize_impact',
          summary: t.docs.minimizeImpact,
          description: t.docs.minimizeImpactDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/smt/valid_graph',
          summary: t.docs.validGraph,
          description: t.docs.validGraphDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/smt/complete_config',
          summary: t.docs.completeConfig,
          description: t.docs.completeConfigDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/smt/config_by_impact',
          summary: t.docs.configByImpact,
          description: t.docs.configByImpactDescription,
          auth: true,
        },
        {
          method: 'POST',
          path: '/depex/operation/smt/valid_config',
          summary: t.docs.validConfig,
          description: t.docs.validConfigDescription,
          auth: true,
        },
      ]

  const vexgenEndpoints: Endpoint[] = !t?.docs?.vexgen
    ? []
    : [
        {
          method: 'GET',
          path: '/vexgen/vex/user',
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
          method: 'GET',
          path: '/vexgen/vex/download/{vex_id}',
          summary: t.docs.vexgen.vexDownload,
          description: t.docs.vexgen.vexDownloadDescription,
          auth: true,
          tag: 'VEX',
        },
        {
          method: 'GET',
          path: '/vexgen/tix/user',
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
          method: 'GET',
          path: '/vexgen/tix/download/{tix_id}',
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
    apiKeysEndpoints,
    depexGraphEndpoints,
    depexSSCOperationEndpoints,
    depexSMTOperationEndpoints,
    vexgenEndpoints,
  }
}
