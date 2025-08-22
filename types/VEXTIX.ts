export interface VEXTIXGenerationRequest {
  owner: string
  name: string
  user_id: string
}

export interface VEXTIXGenerationResponse {
  data: Blob
  filename: string
}
