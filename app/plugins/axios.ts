import axios from 'axios'
import type { AxiosInstance } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  // Request interceptor — attach auth token if present
  api.interceptors.request.use((request) => {
    const token = useCookie('auth_token')
    if (token.value) {
      request.headers.Authorization = `Bearer ${token.value}`
    }
    return request
  })

  // Response interceptor — normalise errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status
      const message =
        error.response?.data?.message ?? 'An unexpected error occurred.'

      if (status === 401) {
        // Handle unauthenticated — extend this to redirect or clear session
        console.warn('[axios] Unauthenticated (401):', message)
      } else if (status === 403) {
        console.warn('[axios] Forbidden (403):', message)
      } else if (status === 422) {
        // Validation errors — error.response.data.errors contains field-level messages
        console.warn('[axios] Validation error (422):', error.response?.data?.errors)
      } else if (status >= 500) {
        console.error('[axios] Server error:', message)
      }

      return Promise.reject(error)
    },
  )

  return {
    provide: {
      api,
    },
  }
})
