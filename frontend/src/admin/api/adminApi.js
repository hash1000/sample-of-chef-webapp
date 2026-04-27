import { api, getApiErrorMessage } from '../../services/api'

export async function fetchAdminSummary() {
  const [dashboard, orders] = await Promise.all([
    api.get('/admin/dashboard'),
    api.get('/admin/orders', { params: { limit: 8 } }),
  ])

  return {
    ...dashboard.data,
    recentOrders: orders.data?.items ?? [],
  }
}

export async function fetchAdminUsers() {
  // Recommended endpoint: GET /admin/users
  const res = await api.get('/admin/users')
  return res.data
}

export async function fetchAdminRestaurants() {
  // Recommended endpoint: GET /admin/restaurants
  const res = await api.get('/admin/restaurants')
  return res.data
}

export async function createAdminRestaurant(payload) {
  const res = await api.post('/admin/restaurants', payload)
  return res.data
}

export async function updateAdminRestaurant(id, payload) {
  const res = await api.patch(`/admin/restaurants/${id}`, payload)
  return res.data
}

export async function approveAdminRestaurant(id) {
  const res = await api.patch(`/admin/restaurants/${id}/approve`)
  return res.data
}

export async function rejectAdminRestaurant(id) {
  const res = await api.patch(`/admin/restaurants/${id}/reject`)
  return res.data
}

export async function blockAdminRestaurant(id) {
  const res = await api.patch(`/admin/restaurants/${id}/block`)
  return res.data
}

export async function unblockAdminRestaurant(id) {
  const res = await api.patch(`/admin/restaurants/${id}/unblock`)
  return res.data
}

export async function fetchAdminOrders() {
  // Recommended endpoint: GET /admin/orders
  const res = await api.get('/admin/orders')
  return res.data
}

export async function fetchAdminRiders() {
  throw new Error('Rider role removed from system')
}

export async function fetchAdminPayments() {
  // Recommended endpoint: GET /admin/payments
  const res = await api.get('/admin/payments')
  return res.data
}

export function toErrorMessage(err) {
  return getApiErrorMessage(err)
}

