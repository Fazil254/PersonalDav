import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { authAPI, setAccessToken, clearAccessToken } from '../api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const refreshTimerRef       = useRef(null)

  // ─── Silently refresh access token ───────────────────────────────────────
  const refreshAccessToken = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) throw new Error('No refresh token')
    const { default: axios } = await import('axios')
    const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
    setAccessToken(data.access)
    return data.access
  }, [])

  // ─── Schedule silent refresh 55 min after login (token expires at 60) ───
  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = setTimeout(async () => {
      try { await refreshAccessToken() }
      catch { /* token expired — user will be logged out on next request */ }
    }, 55 * 60 * 1000)
  }, [refreshAccessToken])

  // ─── Load user on mount ───────────────────────────────────────────────────
  const loadUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await refreshAccessToken()
      const { data } = await authAPI.me()
      setUser(data.user ?? data)
      scheduleRefresh()
    } catch {
      localStorage.removeItem('refresh_token')
      clearAccessToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [refreshAccessToken, scheduleRefresh])

  useEffect(() => {
    loadUser()
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    }
  }, [loadUser])

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (credentials) => {
    setError(null)
    try {
      const { data } = await authAPI.login(credentials)
      setAccessToken(data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      setUser(data.user)
      scheduleRefresh()
      return data
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        'Login failed. Please check your credentials.'
      setError(msg)
      throw err
    }
  }

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (formData) => {
    setError(null)
    try {
      const { data } = await authAPI.register(formData)
      setAccessToken(data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      setUser(data.user)
      scheduleRefresh()
      return data
    } catch (err) {
      const errData = err.response?.data
      const msg =
        errData?.email?.[0] ||
        errData?.password?.[0] ||
        errData?.detail ||
        'Registration failed.'
      setError(msg)
      throw err
    }
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    try {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) await authAPI.logout({ refresh })
    } catch { /* ignore blacklist errors */ }
    clearAccessToken()
    localStorage.removeItem('refresh_token')
    setUser(null)
    setError(null)
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const updateUser  = (updates) => setUser((u) => ({ ...u, ...updates }))
  const clearError  = ()        => setError(null)
  const isAdmin     = user?.role === 'admin'
  const isLoggedIn  = !!user

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAdmin,
      isLoggedIn,
      login,
      register,
      logout,
      updateUser,
      loadUser,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}