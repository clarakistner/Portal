import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { User } from './AuthContext'
import { api } from '../services/api'

function getInitialToken(): string | null {
  return localStorage.getItem('@portal:token')
}

function getInitialUser(): User | null {
  const stored = localStorage.getItem('@portal:user')
  return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser)
  const [token, setToken] = useState<string | null>(getInitialToken)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (login: string, senha: string) => {
    const response = await api.post('/auth/login', { login, senha })
    const { token: newToken, user: newUser } = response.data

    localStorage.setItem('@portal:token', newToken)
    localStorage.setItem('@portal:user', JSON.stringify(newUser))

    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('@portal:token')
    localStorage.removeItem('@portal:user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isLoading: false,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}