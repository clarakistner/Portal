import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type StatusPedido =
  | 'em_aberto'
  | 'encerrado'
  | 'liberado'
  | 'bloqueio_regra'
  | 'bloqueio_verba'
  | 'em_aprovacao'
  | 'rejeitado'

interface Pedido {
  id: string
  numero: string
  cliente: string
  dataEmissao: string
  status: StatusPedido
}

const STATUS_CONFIG: Record<StatusPedido, { label: string; color: string; bg: string; dot: string }> = {
  em_aberto:      { label: 'Em aberto',        color: '#166534', bg: '#DCFCE7', dot: '#22C55E' },
  encerrado:      { label: 'Encerrado',         color: '#7F1D1D', bg: '#FEE2E2', dot: '#EF4444' },
  liberado:       { label: 'Liberado',          color: '#1E3A5F', bg: '#DBEAFE', dot: '#3B82F6' },
  bloqueio_regra: { label: 'Bloqueio de Regra', color: '#1C1917', bg: '#E7E5E4', dot: '#78716C' },
  bloqueio_verba: { label: 'Bloqueio de Verba', color: '#78350F', bg: '#FEF3C7', dot: '#F59E0B' },
  em_aprovacao:   { label: 'Em Aprovação',      color: '#4C1D95', bg: '#EDE9FE', dot: '#8B5CF6' },
  rejeitado:      { label: 'Rejeitado',         color: '#7F1D1D', bg: '#FEE2E2', dot: '#EF4444' },
}

const PEDIDOS_MOCK: Pedido[] = [
  { id: '1', numero: '000001', cliente: 'Empresa Alpha Ltda',    dataEmissao: '2026-03-28', status: 'em_aberto' },
  { id: '2', numero: '000002', cliente: 'Beta Comércio S/A',     dataEmissao: '2026-03-27', status: 'em_aprovacao' },
  { id: '3', numero: '000003', cliente: 'Gama Indústria ME',     dataEmissao: '2026-03-26', status: 'liberado' },
  { id: '4', numero: '000004', cliente: 'Delta Serviços Ltda',   dataEmissao: '2026-03-25', status: 'bloqueio_regra' },
  { id: '5', numero: '000005', cliente: 'Epsilon Tech S/A',      dataEmissao: '2026-03-24', status: 'encerrado' },
  { id: '6', numero: '000006', cliente: 'Zeta Logística ME',     dataEmissao: '2026-03-23', status: 'bloqueio_verba' },
  { id: '7', numero: '000007', cliente: 'Eta Construções Ltda',  dataEmissao: '2026-03-22', status: 'rejeitado' },
  { id: '8', numero: '000008', cliente: 'Theta Alimentos S/A',   dataEmissao: '2026-03-21', status: 'em_aberto' },
  { id: '9', numero: '000009', cliente: 'Iota Varejo Ltda',      dataEmissao: '2026-03-20', status: 'liberado' },
  { id: '10', numero: '000010', cliente: 'Kappa Atacado S/A',    dataEmissao: '2026-03-19', status: 'em_aprovacao' },
  { id: '11', numero: '000011', cliente: 'Lambda Distribuidora', dataEmissao: '2026-03-18', status: 'em_aberto' },
  { id: '12', numero: '000012', cliente: 'Mu Exportações ME',    dataEmissao: '2026-03-17', status: 'encerrado' },
]

function StatusBadge({ status }: { status: StatusPedido }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

export function PedidosVendaPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<StatusPedido | 'todos'>('todos')

  const pedidosFiltrados = PEDIDOS_MOCK.filter(p => {
    const matchSearch =
      p.numero.includes(search) ||
      p.cliente.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFiltro === 'todos' || p.status === statusFiltro
    return matchSearch && matchStatus
  })

  return (
    <>
      <style>{`
        .pedidos-search {
          padding: 9px 14px 9px 34px;
          border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .pedidos-search::placeholder { color: var(--color-text-secondary); }
        .pedidos-search:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
        }
        .pedidos-select {
          padding: 9px 14px; border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text); cursor: pointer;
          transition: border-color 0.15s; white-space: nowrap;
        }
        .pedidos-select:focus { border-color: #16A34A; }
        .btn-incluir {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px;
          background: linear-gradient(135deg, #16A34A 0%, #15803D 100%);
          color: white; border: none; border-radius: 8px;
          font-size: 14px; font-weight: 600; font-family: var(--font-display);
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 2px 6px rgba(22,163,74,0.25); white-space: nowrap;
        }
        .btn-incluir:hover { transform: scale(1.03); box-shadow: 0 4px 14px rgba(22,163,74,0.35); }
        .btn-incluir:active { transform: scale(0.98); }
        .table-row { transition: background 0.12s; cursor: pointer; }
        .table-row:hover { background: #F0FDF4; }
        .btn-acao {
          padding: 5px 12px; border-radius: 6px;
          border: 1.5px solid var(--color-border);
          background: white; font-size: 12px; font-weight: 500;
          color: var(--color-text-secondary); cursor: pointer;
          transition: all 0.15s; font-family: var(--font-body);
        }
        .btn-acao:hover { border-color: #16A34A; color: #16A34A; background: #F0FDF4; }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 56px)',  /* desconta o header fixo do layout */
        overflow: 'hidden',
      }}>

        {/* ── Cabeçalho fixo da página ── */}
        <div style={{ padding: '16px 28px 16px', flexShrink: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
            Pedidos de Venda
          </h1>
        </div>

        {/* ── Card com toolbar fixa + tabela com scroll ── */}
        <div style={{
          margin: '0 28px 28px',
          background: 'white', borderRadius: 14,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex', flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
        }}>

          {/* Toolbar fixa */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', gap: 12,
            flexWrap: 'wrap', flexShrink: 0,
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', pointerEvents: 'none' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="pedidos-search"
                placeholder="Buscar por número ou cliente..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="pedidos-select"
              value={statusFiltro}
              onChange={e => setStatusFiltro(e.target.value as StatusPedido | 'todos')}
            >
              <option value="todos">Todos os status</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <button className="btn-incluir" onClick={() => navigate('/faturamento/pedidos/novo')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Incluir
            </button>
          </div>

          {/* Cabeçalho da tabela fixo */}
          <div style={{ flexShrink: 0, borderBottom: '1px solid var(--color-border)', background: '#FAFAFA' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '13%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '14%' }} />
              </colgroup>
              <thead>
                <tr>
                  {['Nº Pedido', 'Cliente', 'Data de Emissão', 'Status', ''].map(col => (
                    <th key={col} style={{
                      padding: '11px 20px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap', letterSpacing: '0.03em',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          {/* Corpo da tabela com scroll */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '13%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '14%' }} />
              </colgroup>
              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido, i) => (
                    <tr
                      key={pedido.id}
                      className="table-row"
                      style={{ borderBottom: i < pedidosFiltrados.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onClick={() => navigate(`/faturamento/pedidos/${pedido.id}`)}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#15803D' }}>
                          #{pedido.numero}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pedido.cliente}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(pedido.dataEmissao)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge status={pedido.status} />
                      </td>
                      <td style={{ padding: '14px 20px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button className="btn-acao" onClick={() => navigate(`/faturamento/pedidos/${pedido.id}`)}>
                            Visualizar
                          </button>
                          <button className="btn-acao" onClick={() => navigate(`/faturamento/pedidos/${pedido.id}/editar`)}>
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Rodapé fixo */}
          <div style={{
            padding: '11px 20px', flexShrink: 0,
            borderTop: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FAFAFA',
          }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {pedidosFiltrados.length} pedido{pedidosFiltrados.length !== 1 ? 's' : ''} encontrado{pedidosFiltrados.length !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Dados mockados — integração Protheus pendente
            </span>
          </div>
        </div>
      </div>
    </>
  )
}