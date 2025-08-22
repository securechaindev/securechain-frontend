export interface VEXDocument {
  _id: string
  owner: string
  name: string
  sbom_name: string
  moment: string
  vex?: any
}

export interface VEXListResponse {
  vexs: VEXDocument[]
  detail: string
}

export interface VEXResponse {
  vex: VEXDocument
  detail: string
}

export interface VEXDownloadRequest {
  vex_id: string
}
