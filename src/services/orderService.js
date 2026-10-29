const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const LOCAL_ORDERS_KEY = 'easybuy_orders'

const readLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

const createLocalOrder = (order) => {
  const orders = readLocalOrders()
  const savedOrder = {
    ...order,
    _id: `EB${Date.now()}`,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([savedOrder, ...orders]))
  return savedOrder
}

const localOrdersForUser = (userId) => {
  const orders = readLocalOrders()
  if (!userId) return orders
  return orders.filter((order) => order.customer?.id === userId)
}

export const orderService = {
  async create(order, token) {
    if (!token || token === 'demo-token') return createLocalOrder(order)
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(order),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Could not place order')
      return data.order
    } catch (error) {
      if (error instanceof TypeError) return createLocalOrder(order)
      throw error
    }
  },
  async getAll(token, userId) {
    const localOrders = localOrdersForUser(userId)
    if (!token || token === 'demo-token') return localOrders
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Could not load orders')
      const data = await response.json()
      return data.orders
    } catch {
      return localOrders
    }
  },
  async getById(id, token, userId) {
    const localOrders = localOrdersForUser(userId)
    const localMatch = localOrders.find((order) => order._id === id)
    if (!token || token === 'demo-token') return localMatch || null
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Order not found')
      const data = await response.json()
      return data.order
    } catch {
      return localMatch || null
    }
  },
}
