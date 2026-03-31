import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SituacaoCliente =
  | 'ativo'
  | 'inativo'
  | 'bloqueado'
  | 'prospect'
  | 'em_analise'

interface Cliente {
  id: string
  codigo: string
  razaoSocial: string
  nomeFantasia: string
  cidade: string
  uf: string
  situacao: SituacaoCliente
}

const SITUACAO_CONFIG: Record<SituacaoCliente, { label: string; color: string; bg: string; dot: string }> = {
  ativo:      { label: 'Ativo',       color: '#166534', bg: '#DCFCE7', dot: '#22C55E' },
  inativo:    { label: 'Inativo',     color: '#1C1917', bg: '#E7E5E4', dot: '#78716C' },
  bloqueado:  { label: 'Bloqueado',   color: '#7F1D1D', bg: '#FEE2E2', dot: '#EF4444' },
  prospect:   { label: 'Prospect',    color: '#4C1D95', bg: '#EDE9FE', dot: '#8B5CF6' },
  em_analise: { label: 'Em Análise',  color: '#78350F', bg: '#FEF3C7', dot: '#F59E0B' },
}

const CLIENTES_MOCK: Cliente[] = [
  { id: '1',  codigo: '000001', razaoSocial: 'Empresa Alpha Ltda',         nomeFantasia: 'Alpha',       cidade: 'São Paulo',       uf: 'SP', situacao: 'ativo' },
  { id: '2',  codigo: '000002', razaoSocial: 'Beta Comércio S/A',          nomeFantasia: 'Beta',        cidade: 'Rio de Janeiro',  uf: 'RJ', situacao: 'ativo' },
  { id: '3',  codigo: '000003', razaoSocial: 'Gama Indústria ME',          nomeFantasia: 'Gama Ind.',   cidade: 'Curitiba',        uf: 'PR', situacao: 'bloqueado' },
  { id: '4',  codigo: '000004', razaoSocial: 'Delta Serviços Ltda',        nomeFantasia: 'Delta',       cidade: 'Belo Horizonte',  uf: 'MG', situacao: 'em_analise' },
  { id: '5',  codigo: '000005', razaoSocial: 'Epsilon Tech S/A',           nomeFantasia: 'Epsilon',     cidade: 'Porto Alegre',    uf: 'RS', situacao: 'ativo' },
  { id: '6',  codigo: '000006', razaoSocial: 'Zeta Logística ME',          nomeFantasia: 'Zeta Log.',   cidade: 'Salvador',        uf: 'BA', situacao: 'inativo' },
  { id: '7',  codigo: '000007', razaoSocial: 'Eta Construções Ltda',       nomeFantasia: 'Eta Obras',   cidade: 'Fortaleza',       uf: 'CE', situacao: 'prospect' },
  { id: '8',  codigo: '000008', razaoSocial: 'Theta Alimentos S/A',        nomeFantasia: 'Theta',       cidade: 'Recife',          uf: 'PE', situacao: 'ativo' },
  { id: '9',  codigo: '000009', razaoSocial: 'Iota Varejo Ltda',           nomeFantasia: 'Iota',        cidade: 'Manaus',          uf: 'AM', situacao: 'ativo' },
  { id: '10', codigo: '000010', razaoSocial: 'Kappa Atacado S/A',          nomeFantasia: 'Kappa',       cidade: 'Brasília',        uf: 'DF', situacao: 'em_analise' },
  { id: '11', codigo: '000011', razaoSocial: 'Lambda Distribuidora Ltda',  nomeFantasia: 'Lambda',      cidade: 'Goiânia',         uf: 'GO', situacao: 'ativo' },
  { id: '12', codigo: '000012', razaoSocial: 'Mu Exportações ME',          nomeFantasia: 'Mu Export.',  cidade: 'Florianópolis',   uf: 'SC', situacao: 'inativo' },
]

function SituacaoBadge({ situacao }: { situacao: SituacaoCliente }) {
  const cfg = SITUACAO_CONFIG[situacao]
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

export function ClientesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [situacaoFiltro, setSituacaoFiltro] = useState<SituacaoCliente | 'todos'>('todos')

  const clientesFiltrados = CLIENTES_MOCK.filter(c => {
    const matchSearch =
      c.codigo.includes(search) ||
      c.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
      c.nomeFantasia.toLowerCase().includes(search.toLowerCase())
    const matchSituacao = situacaoFiltro === 'todos' || c.situacao === situacaoFiltro
    return matchSearch && matchSituacao
  })

  return (
    <>
      <style>{`
        .clientes-search {
          padding: 9px 14px 9px 34px;
          border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .clientes-search::placeholder { color: var(--color-text-secondary); }
        .clientes-search:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
        }
        .clientes-select {
          padding: 9px 14px; border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text); cursor: pointer;
          transition: border-color 0.15s; white-space: nowrap;
        }
        .clientes-select:focus { border-color: #16A34A; }
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
        .table-row-cliente { transition: background 0.12s; cursor: pointer; }
        .table-row-cliente:hover { background: #F0FDF4; }
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

        {/* Cabeçalho fixo da página */}
        <div style={{ padding: '16px 28px 16px', flexShrink: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
            Clientes
          </h1>
        </div>

        {/* Card com toolbar fixa + tabela com scroll */}
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
                className="clientes-search"
                placeholder="Buscar por código, razão social ou fantasia..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="clientes-select"
              value={situacaoFiltro}
              onChange={e => setSituacaoFiltro(e.target.value as SituacaoCliente | 'todos')}
            >
              <option value="todos">Todas as situações</option>
              {Object.entries(SITUACAO_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <button className="btn-incluir" onClick={() => navigate('/cadastros/clientes/novo')}>
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
                <col style={{ width: '11%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '21%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '18%' }} />
              </colgroup>
              <thead>
                <tr>
                  {['Código', 'Razão Social', 'Nome Fantasia', 'Cidade / UF', ''].map(col => (
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
                <col style={{ width: '11%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '21%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '18%' }} />
              </colgroup>
              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente, i) => (
                    <tr
                      key={cliente.id}
                      className="table-row-cliente"
                      style={{ borderBottom: i < clientesFiltrados.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onClick={() => navigate(`/cadastros/clientes/${cliente.id}`)}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#15803D' }}>
                          {cliente.codigo}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cliente.razaoSocial}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cliente.nomeFantasia}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                        {cliente.cidade}{' '}
                        <span style={{ marginLeft: 4, fontSize: 11, fontWeight: 600, color: '#15803D', background: '#DCFCE7', borderRadius: 4, padding: '1px 5px' }}>
                          {cliente.uf}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button className="btn-acao" onClick={() => navigate(`/cadastros/clientes/${cliente.id}`)}>
                            Visualizar
                          </button>
                          <button className="btn-acao" onClick={() => navigate(`/cadastros/clientes/${cliente.id}/editar`)}>
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
              {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} encontrado{clientesFiltrados.length !== 1 ? 's' : ''}
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