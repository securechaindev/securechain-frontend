import { clientConfig } from '@/lib/config/clientConfig'
import { APIError, NetworkError } from '@/lib/utils'
import { isValidMongoObjectId } from '@/lib/validation'
import { API_ENDPOINTS } from '@/constants'

interface APIClientConfig {
  baseURL: string
  timeout: number
  retries: number
  headers?: Record<string, string>
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  signal?: AbortSignal
}

export type { RequestOptions }

interface APIResponse<T = any> {
  data: T
  status: number
  headers: Headers
  ok: boolean
}

class APIClient {
  private config: APIClientConfig
  private defaultHeaders: Record<string, string>
  private isRefreshing: boolean = false
  private refreshPromise: Promise<boolean> | null = null

  constructor(baseConfig?: Partial<APIClientConfig>) {
    this.config = {
      baseURL: clientConfig.apiUrl,
      timeout: clientConfig.app.api.timeout,
      retries: clientConfig.app.api.retries,
      ...baseConfig,
    }

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries,
      signal,
    } = options

    const url = this.buildURL(endpoint)
    const requestHeaders = { ...this.defaultHeaders, ...headers }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      signal,
      credentials: 'include',
    }

    if (body && method !== 'GET') {
      requestInit.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    return this.executeWithRetry(url, requestInit, retries, timeout)
  }

  async get<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async delete<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<APIResponse<T>> {
    const uploadHeaders = { ...options?.headers }
    delete uploadHeaders['Content-Type']

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: uploadHeaders,
    })
  }

  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint
    }

    const baseURL = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    return `${baseURL}${cleanEndpoint}`
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
        const timeoutController = new AbortController()
        const timeoutId = setTimeout(() => timeoutController.abort(), timeout)

        const userSignal = requestInit.signal
        const combinedSignal = this.combineAbortSignals([
          timeoutController.signal,
          ...(userSignal ? [userSignal] : []),
        ])

        const response = await fetch(url, {
          ...requestInit,
          signal: combinedSignal,
        })

        clearTimeout(timeoutId)

        if (
          response.status === 401 &&
          !url.includes('/auth/refresh_token') &&
          !url.includes('/auth/login')
        ) {
          const refreshSuccess = await this.handleTokenRefresh()

          if (refreshSuccess) {
            const retryResponse = await fetch(url, {
              ...requestInit,
              signal: combinedSignal,
            })

            if (retryResponse.ok) {
              const contentType = retryResponse.headers.get('content-type') || ''
              let data: any = null

              if (
                contentType.includes('application/zip') ||
                contentType.includes('application/octet-stream') ||
                contentType.includes('application/pdf') ||
                retryResponse.headers.get('content-disposition')?.includes('attachment')
              ) {
                data = await retryResponse.blob()
              } else if (
                contentType.includes('application/json') ||
                contentType.includes('text/')
              ) {
                data = await retryResponse
                  .json()
                  .catch(() => retryResponse.text().catch(() => null))
              } else {
                data = await retryResponse
                  .json()
                  .catch(() => retryResponse.text().catch(() => null))
              }

              return {
                data,
                status: retryResponse.status,
                headers: retryResponse.headers,
                ok: retryResponse.ok,
              }
            }

            const errorData = await retryResponse.json().catch(() => ({}))
            throw new APIError(
              retryResponse.status,
              errorData.message || retryResponse.statusText,
              errorData.detail || 'unknown_error',
              errorData
            )
          } else {
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            throw new APIError(401, 'Session expired', 'TOKEN_EXPIRED')
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          throw new APIError(
            response.status,
            errorData.message || response.statusText,
            errorData.detail || 'unknown_error',
            errorData
          )
        }

        const contentType = response.headers.get('content-type') || ''
        let data: any = null

        if (
          contentType.includes('application/zip') ||
          contentType.includes('application/octet-stream') ||
          contentType.includes('application/pdf') ||
          response.headers.get('content-disposition')?.includes('attachment')
        ) {
          data = await response.blob()
        } else if (contentType.includes('application/json') || contentType.includes('text/')) {
          data = await response.json().catch(() => response.text().catch(() => null))
        } else {
          data = await response.json().catch(() => response.text().catch(() => null))
        }

        return {
          data,
          status: response.status,
          headers: response.headers,
          ok: response.ok,
        }
      } catch (error) {
        lastError = error as Error

        if (error instanceof Error && error.name === 'AbortError') {
          throw new NetworkError('Request was aborted', error)
        }

        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) {
            throw error
          }
        }

        if (attempt === retries) {
          throw new NetworkError(
            `Request failed after ${retries + 1} attempts: ${lastError.message}`,
            lastError
          )
        }

        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }

  private async handleTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing) {
      if (this.refreshPromise) {
        return await this.refreshPromise
      }
      return false
    }

    this.isRefreshing = true

    this.refreshPromise = (async () => {
      try {
        const refreshResponse = await fetch(this.buildURL(API_ENDPOINTS.AUTH.REFRESH_TOKEN), {
          method: 'POST',
          headers: this.defaultHeaders,
          credentials: 'include',
        })

        if (refreshResponse.ok) {
          return true
        } else {
          return false
        }
      } catch {
        return false
      } finally {
        this.isRefreshing = false
        this.refreshPromise = null
      }
    })()

    return await this.refreshPromise
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

export const apiClient = new APIClient()

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

  signup: (userData: { email: string; password: string; name?: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, userData),

  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  refreshToken: () => apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN),

  checkToken: () => apiClient.post(API_ENDPOINTS.AUTH.CHECK_TOKEN),

  accountExists: (email: string) =>
    apiClient.get(`${API_ENDPOINTS.AUTH.ACCOUNT_EXISTS}?email=${encodeURIComponent(email)}`),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
}

export const depexAPI = {
  getRepositories: (userId: string) => apiClient.get(API_ENDPOINTS.DEPEX.REPOSITORIES(userId)),

  initializeRepository: (data: any) => apiClient.post(API_ENDPOINTS.DEPEX.REPOSITORY_INIT, data),

  getPackageStatus: (params: string) =>
    apiClient.get(`${API_ENDPOINTS.DEPEX.PACKAGE_STATUS}?${params}`),

  initializePackage: (data: any) => apiClient.post(API_ENDPOINTS.DEPEX.PACKAGE_INIT, data),

  getVersionStatus: (params: string) =>
    apiClient.get(`${API_ENDPOINTS.DEPEX.VERSION_STATUS}?${params}`),

  initializeVersion: (data: any) => apiClient.post(API_ENDPOINTS.DEPEX.VERSION_INIT, data),

  operations: {
    config: {
      completeConfig: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.CONFIG.COMPLETE_CONFIG, data, { retries: 0 }),

      configByImpact: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.CONFIG.CONFIG_BY_IMPACT, data, { retries: 0 }),

      validConfig: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.CONFIG.VALID_CONFIG, data, { retries: 0 }),
    },
    file: {
      fileInfo: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.FILE.FILE_INFO, data, { retries: 0 }),

      filterConfigs: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.FILE.FILTER_CONFIGS, data, { retries: 0 }),

      maximizeImpact: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.FILE.MAXIMIZE_IMPACT, data, { retries: 0 }),

      minimizeImpact: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.FILE.MINIMIZE_IMPACT, data, { retries: 0 }),

      validGraph: (data: any) =>
        apiClient.post(API_ENDPOINTS.DEPEX.OPERATION.FILE.VALID_GRAPH, data, { retries: 0 }),
    },
  },
}

export const vexgenAPI = {
  generateVEXTIX: async (data: { owner: string; name: string; user_id: string }) => {
    if (!isValidMongoObjectId(data.user_id)) {
      throw new APIError(400, 'Invalid user ID format', 'INVALID_USER_ID')
    }

    const requestBody = {
      owner: data.owner.trim(),
      name: data.name.trim(),
      user_id: data.user_id,
    }

    const response = await apiClient.post(API_ENDPOINTS.VEXGEN.GENERATE_VEX_TIX, requestBody, {
      retries: 0,
    })

    if (response.data instanceof Blob || response.data instanceof ArrayBuffer) {
      return {
        ...response,
        data: response.data,
      }
    }

    return response
  },

  getUserVEXs: async (userId: string) => {
    return apiClient.get(API_ENDPOINTS.VEXGEN.GET_USER_VEXS(userId))
  },

  getVEX: async (vexId: string) => {
    return apiClient.get(API_ENDPOINTS.VEXGEN.GET_VEX(vexId))
  },

  downloadVEX: async (vexId: string) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.VEXGEN.DOWNLOAD_VEX,
        { vex_id: vexId },
        {
          retries: 0,
          headers: {
            Accept: 'application/octet-stream, application/json',
          },
        }
      )

      if (response.data instanceof Blob) {
        return {
          ...response,
          data: response.data,
        }
      } else {
        return response
      }
    } catch (error) {
      throw error
    }
  },

  getUserTIXs: async (userId: string) => {
    return apiClient.get(API_ENDPOINTS.VEXGEN.GET_USER_TIXS(userId))
  },

  getTIX: async (tixId: string) => {
    return apiClient.get(API_ENDPOINTS.VEXGEN.GET_TIX(tixId))
  },

  downloadTIX: async (tixId: string) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.VEXGEN.DOWNLOAD_TIX,
        { tix_id: tixId },
        {
          retries: 0,
          headers: {
            Accept: 'application/octet-stream, application/json',
          },
        }
      )

      if (response.data instanceof Blob) {
        return {
          ...response,
          data: response.data,
        }
      } else {
        return response
      }
    } catch (error) {
      throw error
    }
  },
}
