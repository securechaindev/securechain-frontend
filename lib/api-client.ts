import { clientConfig } from './client-config'
import { APIError, NetworkError } from './errors'
import { API_ENDPOINTS } from '@/constants'

// API client configuration
interface APIClientConfig {
  baseURL: string
  timeout: number
  retries: number
  headers?: Record<string, string>
}

// Request options
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  signal?: AbortSignal
}

// Response wrapper
interface APIResponse<T = any> {
  data: T
  status: number
  headers: Headers
  ok: boolean
}

class APIClient {
  private config: APIClientConfig
  private defaultHeaders: Record<string, string>

  constructor(baseConfig?: Partial<APIClientConfig>) {
    this.config = {
      baseURL: clientConfig.apiUrl,
      timeout: clientConfig.app.api.timeout,
      retries: clientConfig.app.api.retries,
      ...baseConfig
    }

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  // Main request method
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries,
      signal
    } = options

    const url = this.buildURL(endpoint)
    const requestHeaders = { ...this.defaultHeaders, ...headers }

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      signal,
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestInit.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    return this.executeWithRetry(url, requestInit, retries, timeout)
  }

  // Convenience methods
  async get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  async put<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async patch<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  // Auth-specific methods
  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`
  }

  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization
  }

  // Upload method for form data
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<APIResponse<T>> {
    const uploadHeaders = { ...options?.headers }
    // Remove Content-Type to let browser set it with boundary for FormData
    delete uploadHeaders['Content-Type']

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: uploadHeaders
    })
  }

  // Private helper methods
  private buildURL(endpoint: string): string {
    // Handle absolute URLs
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint
    }

    // Handle relative URLs
    const baseURL = this.config.baseURL.endsWith('/') 
      ? this.config.baseURL.slice(0, -1) 
      : this.config.baseURL
    
    const cleanEndpoint = endpoint.startsWith('/') 
      ? endpoint 
      : `/${endpoint}`

    return `${baseURL}${cleanEndpoint}`
  }

  private getAuthToken(): string | null {
    // Try to get token from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  private async executeWithRetry(
    url: string,
    requestInit: RequestInit,
    retries: number,
    timeout: number
  ): Promise<APIResponse<any>> {
    let lastError: Error

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create timeout controller
        const timeoutController = new AbortController()
        const timeoutId = setTimeout(() => timeoutController.abort(), timeout)

        // Combine timeout signal with user signal
        const userSignal = requestInit.signal
        const combinedSignal = this.combineAbortSignals([
          timeoutController.signal,
          ...(userSignal ? [userSignal] : [])
        ])

        const response = await fetch(url, {
          ...requestInit,
          signal: combinedSignal
        })

        clearTimeout(timeoutId)

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new APIError(
            response.status,
            errorData.message || response.statusText,
            errorData.code,
            errorData.details
          )
        }

        // Parse response
        const data = await response.json().catch(() => null)

        return {
          data,
          status: response.status,
          headers: response.headers,
          ok: response.ok
        }

      } catch (error) {
        lastError = error as Error

        // Don't retry on user abort
        if (error instanceof Error && error.name === 'AbortError') {
          throw new NetworkError('Request was aborted', error)
        }

        // Don't retry on client errors (4xx)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) {
            throw error
          }
        }

        // If this is the last attempt, throw the error
        if (attempt === retries) {
          throw new NetworkError(
            `Request failed after ${retries + 1} attempts: ${lastError.message}`,
            lastError
          )
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }

  private combineAbortSignals(signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController()

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort()
        break
      }

      signal.addEventListener('abort', () => controller.abort(), { once: true })
    }

    return controller.signal
  }
}

// Create singleton instance
export const apiClient = new APIClient()

// Specific API service functions using centralized endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  
  signup: (userData: { email: string; password: string; name?: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData),
  
  logout: () =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  refreshToken: () =>
    apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN),
  
  checkToken: () =>
    apiClient.get(API_ENDPOINTS.AUTH.CHECK_TOKEN),
  
  accountExists: (email: string) =>
    apiClient.get(`${API_ENDPOINTS.AUTH.ACCOUNT_EXISTS}?email=${encodeURIComponent(email)}`),
  
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
}

export const depexAPI = {
  getRepositories: (userId: string) =>
    apiClient.get(API_ENDPOINTS.DEPEX.REPOSITORIES(userId)),
  
  initializeRepository: (data: any) =>
    apiClient.post(API_ENDPOINTS.DEPEX.REPOSITORY_INIT, data),
  
  getPackageStatus: (params: string) =>
    apiClient.get(`${API_ENDPOINTS.DEPEX.PACKAGE_STATUS}?${params}`),
  
  initializePackage: (data: any) =>
    apiClient.post(API_ENDPOINTS.DEPEX.PACKAGE_INIT, data),
  
  getVersionStatus: (params: string) =>
    apiClient.get(`${API_ENDPOINTS.DEPEX.VERSION_STATUS}?${params}`),
  
  initializeVersion: (data: any) =>
    apiClient.post(API_ENDPOINTS.DEPEX.VERSION_INIT, data),
  
  // Operation endpoints
  operations: {
    config: {
      getCompleteConfig: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.CONFIG.COMPLETE_CONFIG}?${params}`),
      
      getConfigByImpact: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.CONFIG.CONFIG_BY_IMPACT}?${params}`),
      
      getValidConfig: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.CONFIG.VALID_CONFIG}?${params}`),
    },
    file: {
      getFileInfo: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.FILE.FILE_INFO}?${params}`),
      
      filterConfigs: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.FILE.FILTER_CONFIGS}?${params}`),
      
      maximizeImpact: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.FILE.MAXIMIZE_IMPACT}?${params}`),
      
      minimizeImpact: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.FILE.MINIMIZE_IMPACT}?${params}`),
      
      getValidGraph: (params: string) =>
        apiClient.get(`${API_ENDPOINTS.DEPEX.OPERATION.FILE.VALID_GRAPH}?${params}`),
    }
  }
}

export const contactAPI = {
  sendMessage: (data: { name: string; email: string; message: string }) =>
    apiClient.post(API_ENDPOINTS.CONTACT, data)
}
