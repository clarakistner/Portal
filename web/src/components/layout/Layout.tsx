import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage'
import { PedidosVendaPage } from '../../features/faturamento/pages/PedidosdevendaPage'
import { ClientesPage } from '../../features/faturamento/pages/ClientesPage'
import { ProdutosPage } from '../../features/faturamento/pages/ProdutosPage'
import { FornecedoresPage } from '../../features/producao/pages/FornecedoresPage'
import { CondicoesPagamentoPage } from '../../features/faturamento/pages/CondPagamentoPage'
import { ContasReceberPage } from '../../features/financeiro/pages/ContasReceberPage'
import { ContasPagarPage } from '../../features/financeiro/pages/ContasPagar'

const NAV_ITEMS = [
  {
    label: 'Faturamento',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    children: [
      { label: 'Pedidos de Venda', path: '/faturamento/pedidos' },
      { label: 'Clientes', path: '/faturamento/clientes' },
      { label: 'Produtos', path: '/faturamento/produtos' },
      { label: 'Transportadoras', path: '/faturamento/transportadoras' },
      { label: 'Cond. Pagamento', path: '/faturamento/condicoes-pagamento' },
    ],
  },
  {
    label: 'Financeiro',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    children: [
      { label: 'Contas a Pagar', path: '/financeiro/contas-pagar' },
      { label: 'Contas a Receber', path: '/financeiro/contas-receber' },
    ],
  },
  {
    label: 'Produção',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
    children: [
      { label: 'Produtos', path: '/producao/produtos' },
      { label: 'Fornecedores', path: '/producao/fornecedores' },
      { label: 'Estoque', path: '/producao/estoque' },
    ],
  },
]

function PlaceholderPage({ title, group }: { title: string; group?: string }) {
  return (
    <div>
      {group && (
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4, fontWeight: 500 }}>
          {group}
        </p>
      )}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        {title}
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
        Módulo em desenvolvimento.
      </p>
    </div>
  )
}

export function Layout({ sidebarAnimating }: { sidebarAnimating?: boolean }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [openGroup, setOpenGroup] = useState<string | null>('Faturamento')
  const [collapsed, setCollapsed] = useState(false)
  const [entered, setEntered] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 30)
    return () => clearTimeout(t)
  }, [])

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  })

  const currentModule = () => {
    const path = location.pathname
    if (path === '/dashboard') return { group: null, page: 'Dashboard' }
    if (path === '/configuracoes') return { group: null, page: 'Configurações' }
    for (const g of NAV_ITEMS) {
      const found = g.children.find(i => i.path === path)
      if (found) return { group: g.label, page: found.label }
    }
    return { group: null, page: 'Portal' }
  }

  const { group, page } = currentModule()

  const handleLogout = () => {
    // Fase 1: expande o menu até 50vw e some o conteúdo
    setLoggingOut(true)

    // Fase 2: navega para login após a animação terminar
    setTimeout(() => {
      logout()
      navigate('/login')
    }, 600)
  }

  // Largura do sidebar: durante logout expande para 50vw
  const sidebarWidth = loggingOut ? '50vw' : collapsed ? 0 : 240

  return (
    <>
      <style>{`
        .sidebar-link {
          display: block; padding: 7px 10px; border-radius: 6px;
          font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 400;
          text-decoration: none; transition: all 0.15s;
          white-space: nowrap; overflow: hidden;
        }
        .sidebar-link:hover { color: white; background: rgba(255,255,255,0.08); }
        .sidebar-link.active { color: white; background: rgba(255,255,255,0.15); font-weight: 500; }
        .sidebar-group-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 9px 10px; border-radius: 8px; border: none;
          background: transparent; cursor: pointer; color: rgba(255,255,255,0.85);
          font-family: var(--font-display); font-weight: 600; font-size: 13px;
          transition: background 0.15s; white-space: nowrap; overflow: hidden;
        }
        .sidebar-group-btn:hover { background: rgba(255,255,255,0.08); }
        .sidebar-group-btn.open { color: white; background: rgba(255,255,255,0.1); }
        .sidebar-footer-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 8px; border: none;
          background: transparent; cursor: pointer; color: rgba(255,255,255,0.6);
          font-family: var(--font-body); font-size: 13px;
          transition: all 0.15s; white-space: nowrap; overflow: hidden;
        }
        .sidebar-footer-btn:hover { color: white; background: rgba(255,255,255,0.08); }
        .sidebar-wrapper {
          transform: translateX(-100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-wrapper.entered {
          transform: translateX(0);
        }
        .main-wrapper {
          opacity: 0; transform: translateX(20px);
          transition: opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s;
        }
        .main-wrapper.entered { opacity: 1; transform: translateX(0); }
        .main-wrapper.logging-out {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)', overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside
          className={`sidebar-wrapper${entered ? ' entered' : ''}`}
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            background: 'linear-gradient(180deg, #166534 0%, #15803D 40%, #14532D 100%)',
            display: 'flex', flexDirection: 'column',
            transition: loggingOut
              ? 'width 0.55s cubic-bezier(0.4,0,0.2,1), min-width 0.55s cubic-bezier(0.4,0,0.2,1)'
              : 'width 0.25s ease, min-width 0.25s ease, transform 0.5s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden',
            position: 'fixed', top: 0, left: 0, bottom: 0,
            zIndex: 100,
          }}
        >
          {/* Header fixo */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                overflow: 'hidden',
              }}>
                <img src="/icon.svg" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'white', whiteSpace: 'nowrap' }}>
                Nambor
              </span>
            </div>
          </div>

          {/* Nav com scroll */}
          <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8, marginBottom: 8,
                fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)',
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s',
              })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Dashboard
            </NavLink>

            {NAV_ITEMS.map((g) => (
              <div key={g.label} style={{ marginBottom: 2 }}>
                <button
                  className={`sidebar-group-btn${openGroup === g.label ? ' open' : ''}`}
                  onClick={() => setOpenGroup(openGroup === g.label ? null : g.label)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ flexShrink: 0 }}>{g.icon}</span>
                    {g.label}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform 0.2s', transform: openGroup === g.label ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div style={{
                  maxHeight: openGroup === g.label ? 300 : 0,
                  overflow: 'hidden', transition: 'max-height 0.25s ease', paddingLeft: 12,
                }}>
                  {g.children.map((item) => (
                    <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer fixo */}
          <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
            <button className="sidebar-footer-btn" onClick={() => navigate('/configuracoes')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Configurações
            </button>
            <button
              className="sidebar-footer-btn"
              onClick={handleLogout}
              style={{ marginTop: 2 }}
              disabled={loggingOut}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div
          className={`main-wrapper${entered ? ' entered' : ''}${loggingOut ? ' logging-out' : ''}`}
          style={{
            flex: 1,
            marginLeft: collapsed ? 0 : loggingOut ? '50vw' : 240,
            transition: loggingOut
              ? 'margin-left 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, transform 0.3s ease'
              : 'margin-left 0.25s ease, opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s',
            display: 'flex', flexDirection: 'column', minWidth: 0,
          }}
        >
          {/* Header */}
          <header style={{
            height: 56, background: 'white',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center',
            padding: '0 24px', gap: 16,
            position: 'sticky', top: 0, zIndex: 50,
          }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                padding: 6, borderRadius: 6, color: 'var(--color-text-secondary)',
                fontSize: 18, display: 'flex', alignItems: 'center', transition: 'background 0.15s',
              }}
            >☰</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {group && (
                <>
                  <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                    {group}
                  </span>
                  <span style={{ color: 'var(--color-border)', fontSize: 14 }}>/</span>
                </>
              )}
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>
                {page}
              </span>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{today}</span>

  <div style={{ width: 1, height: 24, background: 'var(--color-border)' }} />

  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ lineHeight: 1.3, textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
            {user?.nome ?? 'Usuário'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            {user?.perfil ?? 'Administrador'}
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: 'var(--color-border)' }} />

        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 14,
          color: '#15803D',
          whiteSpace: 'nowrap',
        }}>
          {user?.empresa ?? 'Nambor'}
        </span>
      </div>
    </div>
          </header>

          <main style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/faturamento/pedidos" element={<PedidosVendaPage />} />
            <Route path="/faturamento/pedidos/novo" element={<PlaceholderPage group="Faturamento" title="Novo Pedido de Venda" />} />
            <Route path="/faturamento/pedidos/:id" element={<PlaceholderPage group="Faturamento" title="Pedido de Venda" />} />
            <Route path="/faturamento/pedidos/:id/editar" element={<PlaceholderPage group="Faturamento" title="Editar Pedido de Venda" />} />

              <Route path="/faturamento/clientes" element={<ClientesPage />} />
            <Route path="/faturamento/clientes/novo" element={<PlaceholderPage group="Faturamento" title="Novo Cliente" />} />
            <Route path="/faturamento/clientes/:id" element={<PlaceholderPage group="Faturamento" title="Cliente" />} />
            <Route path="/faturamento/clientes/:id/editar" element={<PlaceholderPage group="Faturamento" title="Editar Cliente" />} />

              <Route path="/faturamento/produtos" element={<ProdutosPage />} />
              <Route path="/faturamento/produtos/novo" element={<PlaceholderPage group="Faturamento" title="Novo Produto" />} />
            <Route path="/faturamento/produtos/:id" element={<PlaceholderPage group="Faturamento" title="Produto" />} />
            <Route path="/faturamento/produtos/:id/editar" element={<PlaceholderPage group="Faturamento" title="Editar Produto" />} />

              <Route path="/faturamento/transportadoras" element={<PlaceholderPage group="Faturamento" title="Transportadoras" />} />

              <Route path="/faturamento/condicoes-pagamento" element={<CondicoesPagamentoPage />} />
              <Route path="/faturamento/condicoes-pagamento/novo" element={<PlaceholderPage group="Faturamento" title="Nova Condição de Pagamento" />} />
              <Route path="/faturamento/condicoes-pagamento/:id" element={<PlaceholderPage group="Faturamento" title="Condição de Pagamento" />} />
              <Route path="/faturamento/condicoes-pagamento/:id/editar" element={<PlaceholderPage group="Faturamento" title="Editar Condição de Pagamento" />} />


              <Route path="/financeiro/contas-pagar" element={<ContasPagarPage />} />
              <Route path="/financeiro/contas-pagar/novo" element={<PlaceholderPage group="Financeiro" title="Nova Conta a Pagar" />} />
              <Route path="/financeiro/contas-pagar/:id" element={<PlaceholderPage group="Financeiro" title="Conta a Pagar" />} />
              <Route path="/financeiro/contas-pagar/:id/editar" element={<PlaceholderPage group="Financeiro" title="Editar Conta a Pagar" />} />

             
              <Route path="/financeiro/contas-receber" element={<ContasReceberPage />} />
              <Route path="/financeiro/contas-receber/novo" element={<PlaceholderPage group="Financeiro" title="Nova Conta a Receber" />} />
              <Route path="/financeiro/contas-receber/:id" element={<PlaceholderPage group="Financeiro" title="Conta a Receber" />} />
              <Route path="/financeiro/contas-receber/:id/editar" element={<PlaceholderPage group="Financeiro" title="Editar Conta a Receber" />} />

             
            <Route path="/producao/produtos" element={<ProdutosPage />} />
            <Route path="/producao/produtos/novo" element={<PlaceholderPage group="Produção" title="Novo Produto" />} />
            <Route path="/producao/produtos/:id" element={<PlaceholderPage group="Produção" title="Produto" />} />
            <Route path="/producao/produtos/:id/editar" element={<PlaceholderPage group="Produção" title="Editar Produto" />} />

                <Route path="/producao/fornecedores" element={<FornecedoresPage />} />
              <Route path="/producao/fornecedores/novo" element={<PlaceholderPage group="Produção" title="Novo Fornecedor" />} />
            <Route path="/producao/fornecedores/:id" element={<PlaceholderPage group="Produção" title="Fornecedor" />} />
            <Route path="/producao/fornecedores/:id/editar" element={<PlaceholderPage group="Produção" title="Editar Fornecedor" />} />

              <Route path="/producao/estoque" element={<PlaceholderPage group="Produção" title="Estoque" />} />
              <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}