import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)
const TOKEN_KEY = 'easybuy_auth_token'
const USER_KEY = 'easybuy_auth_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(Boolean(token))
  const { notify } = useToast()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let active = true
    authService
      .me(token)
      .then((profile) => {
        if (active && profile) setUser(profile)
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [token])

  const persistSession = (result) => {
    setToken(result.token)
    setUser(result.user)
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    if (result.demo) notify('Backend unavailable — signed in using demo mode.', 'info')
  }

  const login = async (credentials) => {
    const result = await authService.login(credentials)
    persistSession(result)
    return result.user
  }

  const register = async (payload) => {
    const result = await authService.register(payload)
    persistSession(result)
    return result.user
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    authService.clearDemoSession()
    notify('You have been signed out.', 'info')
  }

  const value = { user, token, loading, isAuthenticated: Boolean(user), login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
