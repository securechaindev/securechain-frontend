export type NodeType = 'PyPIPackage' | 'NPMPackage' | 'MavenPackage' | 'RubyGemsPackage' | 'CargoPackage' | 'NuGetPackage'

export interface PackageInitData {
  packageName: string
  nodeType: NodeType
}

export interface PackageStatusResponse {
  package?: any
  error?: string
  message?: string
}
