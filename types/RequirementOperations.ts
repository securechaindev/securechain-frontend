import type { NodeType } from './Package'

export type AggregatorType = 'mean' | 'weighted_mean'

export interface Vulnerability {
  name: string
  weighted_mean: number
  mean: number
  vulnerability_count: string[]
}

export interface PackageVersion {
  name: string
  weighted_mean: number
  mean: number
  vulnerability_count: string[]
}

export interface Package {
  package_name: string
  package_vendor: string
  package_constraints: string
  versions: PackageVersion[]
}

export interface FileInfoResult {
  direct_dependencies: Package[]
  total_direct_dependencies: number
  indirect_dependencies_by_depth: Record<string, Package[]>
  total_indirect_dependencies: number
}

export interface Configuration {
  [packageName: string]: string | number
}

// Request interfaces
export interface FileInfoRequest {
  node_type: NodeType
  requirement_file_id: string
  max_depth: number
}

export interface ValidGraphRequest {
  node_type: NodeType
  requirement_file_id: string
  max_depth: number
}

export interface ImpactOperationRequest {
  node_type: NodeType
  limit: number
  requirement_file_id: string
  max_depth: number
  agregator: AggregatorType
}

export interface FilterConfigsRequest {
  node_type: NodeType
  limit: number
  max_threshold: number
  min_threshold: number
  requirement_file_id: string
  max_depth: number
  agregator: AggregatorType
}

export interface ValidConfigRequest {
  requirement_file_id: string
  max_depth: number
  node_type: NodeType
  agregator: AggregatorType
  config: Configuration
}

export interface CompleteConfigRequest {
  requirement_file_id: string
  max_level: number
  node_type: NodeType
  agregator: AggregatorType
  partial_config: Configuration
}

export interface ConfigByImpactRequest {
  requirement_file_id: string
  max_level: number
  node_type: NodeType
  agregator: AggregatorType
  impact: number
}

export interface OperationResponse<T> {
  code: 'operation_success' | 'no_dependencies' | 'smt_timeout'
  result: T | string
}

export type FileInfoResponse = OperationResponse<FileInfoResult>
export type ValidGraphResponse = OperationResponse<boolean>
export type ImpactOperationResponse = OperationResponse<Configuration[]>
export type FilterConfigsResponse = OperationResponse<Configuration[]>
export type ValidConfigResponse = OperationResponse<boolean>
export type CompleteConfigResponse = OperationResponse<Configuration>
export type ConfigByImpactResponse = OperationResponse<Configuration>

export interface RequirementFileOperationsState {
  isLoading: boolean
  selectedOperation: string | null
  fileInfoResult: FileInfoResult | null
  validationResult: boolean | null
  configurations: Configuration[] | null
  singleConfiguration: Configuration | null
  error: string | null
}
