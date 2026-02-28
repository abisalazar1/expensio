import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export class ApiClass {
  private config: ReturnType<typeof useRuntimeConfig>['public']
  private tokenCookie: ReturnType<typeof useCookie<string>>
  private http: AxiosInstance

  constructor() {
    this.config = useRuntimeConfig().public
    this.tokenCookie = useCookie<string>(this.config.authCookieName)
    this.http = axios.create({
      baseURL: this.config.apiBase,
      withCredentials: true,
    })
    this.setHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    })

    this.http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config.headers['Authorization'] = this.getToken()
      return config
    })
  }

  resetUrl(): void {
    this.http.defaults.baseURL = this.config.apiBase
  }

  getToken(): string {
    return this.tokenCookie.value ? `Bearer ${this.tokenCookie.value}` : ''
  }

  setSocketId(id: string): void {
    this.setHeaders({ 'X-Socket-ID': id })
  }

  removeToken(): void {
    delete this.http.defaults.headers.common['Authorization']
  }

  handleError({ data, status }: { data: unknown; status: number } = { data: null, status: 0 }): Promise<never> {
    this.resetUrl()
    return Promise.reject({ data, status })
  }

  handleSuccess<T>(data: T): T {
    this.resetUrl()
    return data
  }

  setHeaders(headers: Record<string, string>): this {
    this.http.defaults.headers.common = {
      ...this.http.defaults.headers.common,
      ...headers,
    }
    return this
  }

  async get<T = unknown>(route: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.http.get<T>(route, { params, ...config })
      return this.handleSuccess(data)
    } catch (error: any) {
      return this.handleError(error.response)
    }
  }

  async post<T = unknown>(route: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.http.post<T>(route, payload, config)
      return this.handleSuccess(data)
    } catch (error: any) {
      return this.handleError(error.response)
    }
  }

  async put<T = unknown>(route: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.http.put<T>(route, payload, config)
      return this.handleSuccess(data)
    } catch (error: any) {
      return this.handleError(error.response)
    }
  }

  async delete<T = unknown>(route: string, payload?: unknown): Promise<T> {
    try {
      const { data } = await this.http.delete<T>(route, { data: payload })
      return this.handleSuccess(data)
    } catch (error: any) {
      return this.handleError(error.response)
    }
  }
}

export default defineNuxtPlugin({
  name: 'api',
  setup() {
    return {
      provide: {
        api: new ApiClass(),
      },
    }
  },
})
