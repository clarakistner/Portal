import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type TipoCondicao = 'a_vista' | 'parcelado' | 'recorrente' | 'consignado'

interface CondicaoPagamento {
  id: string
  codigo: string
  tipo: TipoCondicao
  condicao: string
  descricao: string
}

const TIPO_CONFIG: Record<TipoCondicao, { label: string; color: string; bg: string; dot: string }> = {
  a_vista:    { label: 'À Vista',     color: '#166534', bg: '#DCFCE7', dot: '#22C55E' },
  parcelado:  { label: 'Parcelado',   color: '#1E3A5F', bg: '#DBEAFE', dot: '#3B82F6' },
  recorrente: { label: 'Recorrente',  color: '#4C1D95', bg: '#EDE9FE', dot: '#8B5CF6' },
  consignado: { label: 'Consignado',  color: '#78350F', bg: '#FEF3C7', dot: '#F59E0B' },
}

const CONDICOES_MOCK: CondicaoPagamento[] = [
  { id: '1',  codigo: 'CP001', tipo: 'a_vista',    condicao: '000',     descricao: 'Pagamento à vista no ato da compra' },
  { id: '2',  codigo: 'CP002', tipo: 'a_vista',    condicao: '007',     descricao: 'Pagamento à vista em 7 dias' },
  { id: '3',  codigo: 'CP003', tipo: 'a_vista',    condicao: '014',     descricao: 'Pagamento à vista em 14 dias' },
  { id: '4',  codigo: 'CP004', tipo: 'parcelado',  condicao: '028/056', descricao: 'Parcelado em 2x sem juros (28/56 dias)' },
  { id: '5',  codigo: 'CP005', tipo: 'parcelado',  condicao: '030/060/090', descricao: 'Parcelado em 3x (30/60/90 dias)' },
  { id: '6',  codigo: 'CP006', tipo: 'parcelado',  condicao: '030/060/090/120', descricao: 'Parcelado em 4x (30/60/90/120 dias)' },
  { id: '7',  codigo: 'CP007', tipo: 'parcelado',  condicao: '028/056/084/112/140', descricao: 'Parcelado em 5x sem juros' },
  { id: '8',  codigo: 'CP008', tipo: 'recorrente', condicao: '030',     descricao: 'Cobrança recorrente mensal (todo dia 30)' },
  { id: '9',  codigo: 'CP009', tipo: 'recorrente', condicao: '015',     descricao: 'Cobrança recorrente quinzenal' },
  { id: '10', codigo: 'CP010', tipo: 'consignado', condicao: '060',     descricao: 'Consignado com prazo de 60 dias para acerto' },
  { id: '11', codigo: 'CP011', tipo: 'consignado', condicao: '090',     descricao: 'Consignado com prazo de 90 dias para acerto' },
  { id: '12', codigo: 'CP012', tipo: 'parcelado',  condicao: '030/060/090/120/150/180', descricao: 'Parcelado em 6x' },
]

function TipoBadge({ tipo }: { tipo: TipoCondicao }) {
  const cfg = TIPO_CONFIG[tipo]
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

export function CondicoesPagamentoPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<TipoCondicao | 'todos'>('todos')

  const condicoesFiltradas = CONDICOES_MOCK.filter(c => {
    const matchSearch =
      c.codigo.toLowerCase().includes(search.toLowerCase()) ||
      c.condicao.toLowerCase().includes(search.toLowerCase()) ||
      c.descricao.toLowerCase().includes(search.toLowerCase())
    const matchTipo = tipoFiltro === 'todos' || c.tipo === tipoFiltro
    return matchSearch && matchTipo
  })

  return (
    <>
      <style>{`
        .condpgto-search {
          padding: 9px 14px 9px 34px;
          border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .condpgto-search::placeholder { color: var(--color-text-secondary); }
        .condpgto-search:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
        }
        .condpgto-select {
          padding: 9px 14px; border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text); cursor: pointer;
          transition: border-color 0.15s; white-space: nowrap;
        }
        .condpgto-select:focus { border-color: #16A34A; }
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
        .table-row-condpgto { transition: background 0.12s; cursor: pointer; }
        .table-row-condpgto:hover { background: #F0FDF4; }
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
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
      }}>

        <div style={{ padding: '16px 28px 16px', flexShrink: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
            Condições de Pagamento
          </h1>
        </div>

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
                className="condpgto-search"
                placeholder="Buscar por código, condição ou descrição..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="condpgto-select"
              value={tipoFiltro}
              onChange={e => setTipoFiltro(e.target.value as TipoCondicao | 'todos')}
            >
              <option value="todos">Todos os tipos</option>
              {Object.entries(TIPO_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <button className="btn-incluir" onClick={() => navigate('/faturamento/condicoes-pagamento/novo')}>
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
                <col style={{ width: '10%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '44%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr>
                  {['Código', 'Tipo', 'Cond. Pagto', 'Descrição', ''].map(col => (
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
                <col style={{ width: '10%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '44%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <tbody>
                {condicoesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                      Nenhuma condição encontrada.
                    </td>
                  </tr>
                ) : (
                  condicoesFiltradas.map((cond, i) => (
                    <tr
                      key={cond.id}
                      className="table-row-condpgto"
                      style={{ borderBottom: i < condicoesFiltradas.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onClick={() => navigate(`/faturamento/condicoes-pagamento/${cond.id}`)}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#15803D' }}>
                          {cond.codigo}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <TipoBadge tipo={cond.tipo} />
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--color-text)', fontFamily: 'var(--font-display)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cond.condicao}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cond.descricao}
                      </td>
                      <td style={{ padding: '14px 20px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button className="btn-acao" onClick={() => navigate(`/faturamento/condicoes-pagamento/${cond.id}/editar`)}>
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
              {condicoesFiltradas.length} condição{condicoesFiltradas.length !== 1 ? 'ões' : ''} encontrada{condicoesFiltradas.length !== 1 ? 's' : ''}
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