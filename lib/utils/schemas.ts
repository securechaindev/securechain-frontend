import type { Schema, Enum } from '@/types'

export const getSchemas = (): Schema[] => [
  {
    name: 'SignUpRequest',
    description: 'Request schema for user signup',
    fields: ['email (string, email format)', 'password (string)'],
  },
  {
    name: 'LoginRequest',
    description: 'Request schema for user login',
    fields: ['email (string, email format)', 'password (string, 8-20 chars)'],
  },
  {
    name: 'AccountExistsRequest',
    description: 'Request schema for checking account existence',
    fields: ['email (string, email format)'],
  },
  {
    name: 'ChangePasswordRequest',
    description: 'Request schema for changing password',
    fields: [
      'email (string, email format)',
      'old_password (string, 8-20 chars)',
      'new_password (string, 8-20 chars)',
    ],
  },
  {
    name: 'VerifyTokenRequest',
    description: 'Request schema for token verification',
    fields: ['token (string or null)'],
  },
  {
    name: 'CreateApiKeyRequest',
    description: 'Request to create a new API key',
    fields: [
      'name (string, 1-100 chars, descriptive name for the API key)',
      'duration_days (integer, enum: 10, 20, or 30 days)',
    ],
  },
  {
    name: 'InitRepositoryRequest',
    description: 'Request schema for repository initialization',
    fields: [
      'owner (string)',
      'name (string)',
      'moment (datetime, optional)',
      'add_extras (boolean, default: false)',
      'is_complete (boolean, default: false)',
    ],
  },
  {
    name: 'InitPackageRequest',
    description: 'Request schema for package initialization',
    fields: ['node_type (NodeType)', 'package_name (string)'],
  },
  {
    name: 'FileInfoRequest',
    description: 'Request schema for file information',
    fields: [
      'node_type (NodeType)',
      'requirement_file_id (string, UUID pattern)',
      'max_depth (integer)',
    ],
  },
  {
    name: 'ValidGraphRequest',
    description: 'Request schema for graph validation',
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'max_depth (integer)',
      'node_type (NodeType)',
    ],
  },
  {
    name: 'MinMaxImpactRequest',
    description: 'Request schema for minimize/maximize impact operations',
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
    description: 'Request schema for filtering configurations',
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
    description: 'Request schema for configuration validation',
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
    description: 'Request schema for completing configurations',
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
    description: 'Request schema for configuration by impact',
    fields: [
      'requirement_file_id (string, UUID pattern)',
      'max_level (integer)',
      'impact (number, 0-10)',
      'node_type (NodeType)',
      'agregator (Aggregator)',
    ],
  },
  {
    name: 'GenerateVEXTIXRequest',
    description: 'Request to generate VEX and TIX documents for a repository',
    fields: ['owner (string, min length: 1)', 'name (string, min length: 1)'],
  },
]

export const getEnums = (): Enum[] => [
  {
    name: 'NodeType',
    description: 'Supported package ecosystem types',
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
    description: 'Aggregation methods for impact calculations',
    values: ['mean', 'weighted_mean'],
  },
]
