import type { Schema, Enum } from '@/types'

export const getSchemas = (t: any): Schema[] => [
  {
    name: 'SignUpRequest',
    description: t.docs.signUpRequestDescription,
    fields: ['email (string, email format)', 'password (string)'],
  },
  {
    name: 'LoginRequest',
    description: t.docs.loginRequestDescription,
    fields: ['email (string, email format)', 'password (string, 8-20 chars)'],
  },
  {
    name: 'AccountExistsRequest',
    description: t.docs.accountExistsRequestDescription,
    fields: ['email (string, email format)'],
  },
  {
    name: 'ChangePasswordRequest',
    description: t.docs.changePasswordRequestDescription,
    fields: [
      'email (string, email format)',
      'old_password (string, 8-20 chars)',
      'new_password (string, 8-20 chars)',
    ],
  },
  {
    name: 'VerifyTokenRequest',
    description: t.docs.verifyTokenRequestDescription,
    fields: ['token (string or null)'],
  },
  {
    name: 'InitRepositoryRequest',
    description: t.docs.initRepositoryRequestDescription,
    fields: [
      'owner (string)',
      'name (string)',
      'user_id (string)',
      'moment (datetime, optional)',
      'add_extras (boolean, default: false)',
      'is_complete (boolean, default: false)',
    ],
  },
  {
    name: 'InitPackageRequest',
    description: t.docs.initPackageRequestDescription,
    fields: ['node_type (NodeType)', 'package_name (string)'],
  },
  {
    name: 'InitVersionRequest',
    description: t.docs.initVersionRequestDescription,
    fields: ['node_type (NodeType)', 'package_name (string)', 'version_name (string)'],
  },
  {
    name: 'FileInfoRequest',
    description: t.docs.fileInfoRequestDescription,
    fields: [
      'node_type (NodeType)',
      'requirement_file_id (string, UUID pattern)',
      'max_depth (integer)',
    ],
  },
  {
    name: 'ValidGraphRequest',
    description: t.docs.validGraphRequestDescription,
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'max_depth (integer)',
      'node_type (NodeType)',
    ],
  },
  {
    name: 'MinMaxImpactRequest',
    description: t.docs.minMaxImpactRequestDescription,
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'limit (integer, min: 1)',
      'max_depth (integer)',
      'node_type (NodeType)',
      'agregator (Aggregator)',
    ],
  },
  {
    name: 'FilterConfigsRequest',
    description: t.docs.filterConfigsRequestDescription,
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'max_threshold (number, 0-10)',
      'min_threshold (number, 0-10)',
      'limit (integer, min: 1)',
      'max_depth (integer)',
      'node_type (NodeType)',
      'agregator (Aggregator)',
    ],
  },
  {
    name: 'ValidConfigRequest',
    description: t.docs.validConfigRequestDescription,
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'max_depth (integer)',
      'node_type (NodeType)',
      'agregator (Aggregator)',
      'config (object)',
    ],
  },
  {
    name: 'CompleteConfigRequest',
    description: t.docs.completeConfigRequestDescription,
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'max_depth (integer)',
      'node_type (NodeType)',
      'agregator (Aggregator)',
      'config (object)',
    ],
  },
  {
    name: 'ConfigByImpactRequest',
    description: t.docs.configByImpactRequestDescription,
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'max_level (integer)',
      'impact (number, 0-10)',
      'node_type (NodeType)',
      'agregator (Aggregator)',
    ],
  },
  {
    name: 'DownloadVEXRequest',
    description: t.docs.downloadVEXRequestDescription || 'Request to download a VEX document by ID',
    fields: ['vex_id (string, 24-char hex pattern)'],
  },
  {
    name: 'DownloadTIXRequest',
    description: t.docs.downloadTIXRequestDescription || 'Request to download a TIX document by ID',
    fields: ['tix_id (string, 24-char hex pattern)'],
  },
  {
    name: 'GenerateVEXTIXRequest',
    description:
      t.docs.generateVEXTIXRequestDescription ||
      'Request to generate VEX and TIX documents for a repository',
    fields: [
      'owner (string, min length: 1)',
      'name (string, min length: 1)',
      'user_id (string, 24-char hex pattern)',
    ],
  },
]

export const getEnums = (t: any): Enum[] => [
  {
    name: 'NodeType',
    description: t.docs.nodeTypeDescription,
    values: [
      'RubyGemsPackage',
      'CargoPackage',
      'NuGetPackage',
      'PyPIPackage',
      'NPMPackage',
      'MavenPackage',
    ],
  },
  {
    name: 'Aggregator',
    description: t.docs.aggregatorDescription,
    values: ['mean', 'weighted_mean'],
  },
]
