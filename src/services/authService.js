const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const DEMO_USERS_KEY = 'easybuy_demo_users'
const DEMO_SESSION_KEY = 'easybuy_demo_session'

const request = async (path, options = {}) => {
  const { headers = {}, ...rest } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...headers },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

const demoRegister = ({ name, email, password }) => {
  const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]')
  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.')
  }
  const user = { id: `demo-${Date.now()}`, name, email }
  users.push({ ...user, password })
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
  return { user, token: 'demo-token', demo: true }
}

const demoLogin = ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]')
  const match = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  )
  if (!match) throw new Error('Invalid email or password.')
  const user = { id: match.id, name: match.name, email: match.email }
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
  return { user, token: 'demo-token', demo: true }
}

export const authService = {
  async register(payload) {
    try {
      return await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
    } catch (error) {
      if (error instanceof TypeError) return demoRegister(payload)
      throw error
    }
  },
  async login(payload) {
    try {
      return await request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
    } catch (error) {
      if (error instanceof TypeError) return demoLogin(payload)
      throw error
    }
  },
  async me(token) {
    if (!token || token === 'demo-token') {
      return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY) || 'null')
    }
    const result = await request('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    return result.user
  },
  clearDemoSession() {
    localStorage.removeItem(DEMO_SESSION_KEY)
  },
}
