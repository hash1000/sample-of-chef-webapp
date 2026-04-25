import { api, getApiErrorMessage } from '../../services/api'

export async function fetchAdminSummary() {
  // If you later add a real endpoint (recommended): GET /admin/summary
  // For now, try best-effort calls and derive summary from what exists.
  const [orders] = await Promise.all([
    api.get('/orders/user').catch(() => ({ data: [] })), // placeholder until real admin orders exists
  ])

  const totalOrders = Array.isArray(orders.data) ? orders.data.length : 0
  const totalRevenueCents = (Array.isArray(orders.data) ? orders.data : []).reduce(
    (sum, o) => sum + (o?.total ?? 0),
    0,
  )

  return {
    totalUsers: '—',
    totalRestaurants: '—',
    totalOrders,
    totalRevenue: `$${(totalRevenueCents / 100).toFixed(2)}`,
    recentOrders: (Array.isArray(orders.data) ? orders.data : []).slice(0, 8),
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

export async function fetchAdminOrders() {
  // Recommended endpoint: GET /admin/orders
  const res = await api.get('/admin/orders')
  return res.data
}

export async function fetchAdminRiders() {
  // Recommended endpoint: GET /admin/riders
  const res = await api.get('/admin/riders')
  return res.data
}

export async function fetchAdminPayments() {
  // Recommended endpoint: GET /admin/payments
  const res = await api.get('/admin/payments')
  return res.data
}

export function toErrorMessage(err) {
  return getApiErrorMessage(err)
}

