export interface PackageInfoRequest {
  package_name: string
  max_depth: number
  node_type: string
}

export interface VersionDetail {
  name: string
  weighted_mean: number
  mean: number
  vulnerability_count: string[]
  serial_number: number
}

export interface DirectDependency {
  package_name: string
  package_vendor: string
  package_constraints: string
  versions: VersionDetail[]
}

export interface IndirectDependency {
  package_name: string
  package_vendor: string
  package_constraints: string
  versions: VersionDetail[]
}

export interface PackageInfoResult {
  total_direct_dependencies: number
  total_indirect_dependencies: number
  direct_dependencies: DirectDependency[]
  indirect_dependencies_by_depth: {
    [depth: string]: IndirectDependency[]
  }
}

export interface PackageInfoResponse {
  code: string
  message: string
  result?: PackageInfoResult
}
