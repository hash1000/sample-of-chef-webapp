import { api, getApiErrorMessage } from '../../services/api'

// Recommended endpoints (implement on backend when ready):
// GET /chef/orders?status=
// GET /chef/orders/:id
// PATCH /chef/orders/:id/status
// GET /chef/menu
// POST /chef/menu
// PATCH /chef/menu/:id
// DELETE /chef/menu/:id

export function toErrorMessage(err) {
  return getApiErrorMessage(err)
}

export async function fetchChefOrders({ status } = {}) {
  const res = await api.get('/chef/orders', { params: status ? { status } : undefined })
  return res.data
}

export async function fetchChefOrder(id) {
  const res = await api.get(`/chef/orders/${id}`)
  return res.data
}

export async function updateChefOrderStatus(id, status) {
  const res = await api.patch(`/chef/orders/${id}/status`, { status })
  return res.data
}

export async function fetchChefMenu() {
  const res = await api.get('/chef/menu')
  return res.data
}

