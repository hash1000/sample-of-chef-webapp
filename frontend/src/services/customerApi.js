import { api } from './api'

export async function listRestaurants(params = {}) {
  const res = await api.get('/restaurants', { params })
  return res.data
}

export async function getRestaurant(id) {
  const res = await api.get(`/restaurant/${id}`)
  return res.data
}

export async function createOrder(payload) {
  const res = await api.post('/orders', payload)
  return res.data
}

export async function getOrder(id) {
  const res = await api.get(`/orders/${id}`)
  return res.data
}

export async function listMyOrders() {
  const res = await api.get('/orders/user')
  return res.data
}
