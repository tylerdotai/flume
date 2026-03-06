'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getMe, login as apiLogin, register as apiRegister } from '@/lib/api'

interface User {
  id: number
  email: string
  username: string
  full_name?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('flume_token')
    if (storedToken) {
      setToken(storedToken)
      getMe(storedToken)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('flume_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { access_token } = await apiLogin(email, password)
      setToken(access_token)
      localStorage.setItem('flume_token', access_token)
      const userData = await getMe(access_token)
      setUser(userData)
    } catch (err: any) {
      const msg = err?.message || err?.toString() || 'Login failed'
      alert('Login error: ' + msg)
      throw err
    }
  }

  const register = async (email: string, username: string, password: string) => {
    try {
      await apiRegister(email, username, password)
      await login(email, password)
    } catch (err: any) {
      const msg = err?.message || err?.toString() || 'Registration failed'
      alert('Registration error: ' + msg)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('flume_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
