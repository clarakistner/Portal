import { createContext } from 'react'

export interface User {
  id: number
  nome: string
  login: string
  email: string
  perfil: string
  empresa: string
}

export interface AuthContextData {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (login: string, senha: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)