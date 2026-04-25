import { api } from '../services/api'

function normalizeAuthResponse(data) {
  if (!data || typeof data !== 'object') return data
  // Backend may return `{ access_token, user }` (NestJS convention)
  if (!data.token && data.access_token) {
    return { ...data, token: data.access_token }
  }
  return data
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  return normalizeAuthResponse(res.data)
}

export async function signup({ name, email, password, role }) {
  const res = await api.post('/auth/signup', { name, email, password, role })
  return normalizeAuthResponse(res.data)
}

