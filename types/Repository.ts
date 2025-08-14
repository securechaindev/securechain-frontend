export interface RequirementFile {
  requirement_file_id: string
  name: string
  manager: string
}

export interface Repository {
  owner: string
  name: string
  is_complete: boolean
  requirement_files?: RequirementFile[]
}

export interface RepositoryInitResult {
  success: boolean
  message: string
}
