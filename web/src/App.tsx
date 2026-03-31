import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { PrivateRoute } from './components/shared/PrivateRoute'
import { LoginPage } from './features/auth/pages/LoginPage'
import { Layout } from './components/layout/Layout'

function AppRoutes() {
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'done'>('idle')
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    // Fase 1: painel verde sai pela direita
    setPhase('exiting')

    // Fase 2: navega para o dashboard (menu entra pela esquerda)
    setTimeout(() => {
      navigate('/dashboard')
      setPhase('done')
    }, 600)
  }

  return (
    <Routes>
      <Route path="/login" element={
        <LoginPage
          onSuccess={handleLoginSuccess}
          phase={phase}
        />
      } />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout sidebarAnimating={phase === 'done'} />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App