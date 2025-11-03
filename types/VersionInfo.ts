export interface VersionInfoRequest {
  package_name: string
  version_name: string
  max_depth: number
  node_type: string
}

export interface VersionDetail {
  name: string
  weighted_mean: number
  mean: number
  vulnerability_count: string[]
}

export interface DirectDependencyVersion {
  package_name: string
  package_vendor: string
  package_constraints: string
  versions: VersionDetail[]
}

export interface VersionInfoResult {
  total_direct_dependencies: number
  total_indirect_dependencies: number
  direct_dependencies: DirectDependencyVersion[]
  indirect_dependencies_by_depth: {
    [depth: string]: DirectDependencyVersion[]
  }
}

export interface VersionInfoResponse {
  code: string
  message: string
  result?: VersionInfoResult
}
