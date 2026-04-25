import { api } from '../services/api'

// Assumed backend routes (adjust paths if needed):
// POST /auth/login  { email, password } -> { token, user: { id, name, email, role } }
// POST /auth/signup { name, email, password, role } -> { token, user: { ... } }

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export async function signup({ name, email, password, role }) {
  const res = await api.post('/auth/signup', { name, email, password, role })
  return res.data
}

