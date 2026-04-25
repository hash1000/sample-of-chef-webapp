const STORAGE_KEY = 'amricanFood.auth'

export function getAuthSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.token !== 'string' || !parsed.token) return null
    if (!parsed.user || typeof parsed.user !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function setAuthSnapshot(snapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
}

export function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAuthToken() {
  return getAuthSnapshot()?.token || null
}
