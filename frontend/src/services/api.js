import axios from 'axios'
import { getAuthToken, clearAuthStorage } from '../auth/authStorage'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      clearAuthStorage()
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error) {
  const data = error?.response?.data
  if (!data) return error?.message || 'Something went wrong'

  if (typeof data === 'string') return data
  if (typeof data?.message === 'string') return data.message
  if (Array.isArray(data?.errors) && data.errors.length) {
    const first = data.errors[0]
    return typeof first === 'string' ? first : first?.message || 'Request failed'
  }

  return 'Request failed'
}
