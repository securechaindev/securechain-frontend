export interface TIXDocument {
  _id: string
  owner: string
  name: string
  sbom_name: string
  moment: string
  tix?: any
}

export interface TIXListResponse {
  tixs: TIXDocument[]
  detail: string
}

export interface TIXResponse {
  tix: TIXDocument
  detail: string
}

export interface TIXDownloadRequest {
  tix_id: string
}
