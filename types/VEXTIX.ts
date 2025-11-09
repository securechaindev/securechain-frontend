export interface VEXTIXGenerationRequest {
  owner: string
  name: string
}

export interface VEXTIXGenerationResponse {
  data: Blob
  filename: string
}
