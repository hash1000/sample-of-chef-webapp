import { api, getApiErrorMessage } from '../../services/api'

export function toErrorMessage(err) {
  return getApiErrorMessage(err)
}

export async function fetchChefOrders({ status } = {}) {
  const res = await api.get('/chef/orders', { params: status ? { status } : undefined })
  return res.data
}

export async function fetchChefRestaurant() {
  const res = await api.get('/chef/restaurant')
  return res.data
}

export async function updateChefRestaurant(payload) {
  const res = await api.patch('/chef/restaurant', payload)
  return res.data
}

export async function uploadChefRestaurantBanner(file) {
  const formData = new FormData()
  formData.append('image', file)
  const res = await api.patch('/chef/restaurant/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
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

export async function createChefMenuItem(payload) {
  const res = await api.post('/chef/menu', payload)
  return res.data
}

export async function updateChefMenuItem(id, payload) {
  const res = await api.patch(`/chef/menu/${id}`, payload)
  return res.data
}

export async function uploadChefMenuItemImage(id, file) {
  const formData = new FormData()
  formData.append('image', file)
  const res = await api.patch(`/chef/menu/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function deleteChefMenuItem(id) {
  const res = await api.delete(`/chef/menu/${id}`)
  return res.data
}

export async function toggleChefMenuAvailability(id, isAvailable) {
  const res = await api.patch(`/chef/menu/${id}/availability`, { isAvailable })
  return res.data
}

