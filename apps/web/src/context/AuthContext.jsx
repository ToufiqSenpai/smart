import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { login as loginApi } from "../api/auth.api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true) 

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('authUser')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Gagal mem-parsing data user", error)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('authUser')
      }
    }
    
    setIsInitializing(false)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const result = await loginApi(credentials)
      const { accessToken, user: userData } = result.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('authUser', JSON.stringify(userData)) 
      
      setUser(userData)
      
      return result 
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
    setUser(null)
    window.location.href = '/login'
  }, [])

  if (isInitializing) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}