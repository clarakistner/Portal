import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  login: z.string().min(1, 'Informe o usuário'),
  senha: z.string().min(1, 'Informe a senha'),
})

type LoginForm = z.infer<typeof loginSchema>

interface LoginPageProps {
  onSuccess?: () => void
  phase?: 'idle' | 'exiting' | 'done'
}

export function LoginPage({ onSuccess, phase }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (_data: LoginForm) => {
    onSuccess?.()
  }

  const isExiting = phase === 'exiting'

  return (
    <>
      <style>{`
        .login-input {
          width: 100%; padding: 12px 16px;
          border: 1.5px solid #D1FAE5; border-radius: 10px;
          font-size: 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff; color: #0F172A;
          font-family: var(--font-body);
        }
        .login-input::placeholder { color: #94A3B8; }
        .login-input:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .login-input.error { border-color: #EF4444; }
        .login-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #16A34A 0%, #15803D 60%, #166534 100%);
          color: white; border: none; border-radius: 10px;
          font-size: 15px; font-weight: 600; font-family: var(--font-display);
          cursor: pointer; transition: transform 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 2px 8px rgba(22,163,74,0.25); letter-spacing: 0.01em;
        }
        .login-btn:hover, .login-btn:focus {
          transform: scale(1.025);
          box-shadow: 0 6px 20px rgba(22,163,74,0.35);
          outline: none;
        }
        .login-btn:active { transform: scale(0.99); }
        .eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          border: none; background: transparent;
          cursor: pointer; padding: 4px;
          color: #94A3B8; display: flex; align-items: center;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #16A34A; }
        .green-panel {
          display: none;
          width: 50%;
          background: linear-gradient(160deg, #166534 0%, #15803D 50%, #14532D 100%);
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .green-panel.exiting {
          transform: translateX(200%);
        }
        .login-form-side {
          transition: opacity 0.3s ease;
        }
        .login-form-side.exiting {
          opacity: 0;
          pointer-events: none;
        }
        @media (min-width: 1024px) {
          .green-panel { display: flex !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#F8FAFC',
        overflow: 'hidden',
      }}>

        {/* Painel verde */}
        <div className={`green-panel${isExiting ? ' exiting' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 50, height: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="icon.svg" alt="Logo" style={{ width: 60, height: 60, objectFit: 'contain' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'white' }}>
              Nambor
            </span>
          </div>

          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700,
              color: 'white', lineHeight: 1.15, marginBottom: 20,
            }}>
              Integração com<br />Protheus<br />simplificada.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.7 }}>
              Digite pedidos, acompanhe integrações<br />e gerencie dados em tempo real.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            {['Faturamento', 'Financeiro', 'Produção'].map(m => (
              <span key={m} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <div
          className={`login-form-side${isExiting ? ' exiting' : ''}`}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 380 }}>

            {/* Logo mobile */}
            <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 14, height: 14, background: 'white', borderRadius: 3 }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Nambor</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>
              Bem-vindo de volta
            </h2>
            <p style={{ color: '#64748B', fontSize: 15, marginBottom: 36 }}>
              Entre com suas credenciais para continuar.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Usuário */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Usuário</label>
                <input
                  {...register('login')}
                  type="text"
                  placeholder="seu.usuario"
                  autoComplete="username"
                  className={`login-input${errors.login ? ' error' : ''}`}
                />
                {errors.login && <span style={{ fontSize: 12, color: '#EF4444' }}>{errors.login.message}</span>}
              </div>

              {/* Senha */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    {...register('senha')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`login-input${errors.senha ? ' error' : ''}`}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.senha && <span style={{ fontSize: 12, color: '#EF4444' }}>{errors.senha.message}</span>}
              </div>

              <button type="submit" className="login-btn" style={{ marginTop: 8 }}>
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}