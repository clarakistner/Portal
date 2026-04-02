import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type StatusTitulo = 'aberto' | 'pago' | 'vencido' | 'cancelado' | 'parcial'
type TipoTitulo = 'duplicata' | 'cheque' | 'boleto' | 'pix' | 'cartao'

interface ContaPagar {
  id: string
  numeroTitulo: string
  tipo: TipoTitulo
  codigoFornecedor: string
  nomeFornecedor: string
  dataEmissao: string
  dataVencimento: string
  status: StatusTitulo
}

const STATUS_CONFIG: Record<StatusTitulo, { label: string; color: string; bg: string; dot: string }> = {
  aberto:    { label: 'Aberto',       color: '#166534', bg: '#DCFCE7', dot: '#22C55E' },
  pago:      { label: 'Pago',         color: '#1E3A5F', bg: '#DBEAFE', dot: '#3B82F6' },
  vencido:   { label: 'Vencido',      color: '#7F1D1D', bg: '#FEE2E2', dot: '#EF4444' },
  cancelado: { label: 'Cancelado',    color: '#1C1917', bg: '#E7E5E4', dot: '#78716C' },
  parcial:   { label: 'Pago Parcial', color: '#78350F', bg: '#FEF3C7', dot: '#F59E0B' },
}

const TIPO_CONFIG: Record<TipoTitulo, { label: string }> = {
  duplicata: { label: 'Duplicata' },
  cheque:    { label: 'Cheque' },
  boleto:    { label: 'Boleto' },
  pix:       { label: 'PIX' },
  cartao:    { label: 'Cartão' },
}

const CONTAS_MOCK: ContaPagar[] = [
  { id: '1',  numeroTitulo: '000001', tipo: 'boleto',    codigoFornecedor: '000001', nomeFornecedor: 'Aço Brasil Distribuidora Ltda',  dataEmissao: '2026-02-01', dataVencimento: '2026-03-01', status: 'pago' },
  { id: '2',  numeroTitulo: '000002', tipo: 'duplicata', codigoFornecedor: '000002', nomeFornecedor: 'Metalúrgica São Paulo S/A',       dataEmissao: '2026-02-05', dataVencimento: '2026-03-05', status: 'pago' },
  { id: '3',  numeroTitulo: '000003', tipo: 'pix',       codigoFornecedor: '000003', nomeFornecedor: 'Químicos do Sul ME',              dataEmissao: '2026-02-10', dataVencimento: '2026-02-10', status: 'pago' },
  { id: '4',  numeroTitulo: '000004', tipo: 'boleto',    codigoFornecedor: '000004', nomeFornecedor: 'Embalagens Curitiba Ltda',        dataEmissao: '2026-02-12', dataVencimento: '2026-03-12', status: 'vencido' },
  { id: '5',  numeroTitulo: '000005', tipo: 'duplicata', codigoFornecedor: '000005', nomeFornecedor: 'Elétrica Industrial S/A',         dataEmissao: '2026-02-15', dataVencimento: '2026-03-15', status: 'vencido' },
  { id: '6',  numeroTitulo: '000006', tipo: 'cheque',    codigoFornecedor: '000006', nomeFornecedor: 'Rolamentos e Fixadores ME',       dataEmissao: '2026-02-18', dataVencimento: '2026-03-18', status: 'parcial' },
  { id: '7',  numeroTitulo: '000007', tipo: 'boleto',    codigoFornecedor: '000007', nomeFornecedor: 'Alumínio Norte Distribuidora',    dataEmissao: '2026-03-01', dataVencimento: '2026-04-01', status: 'aberto' },
  { id: '8',  numeroTitulo: '000008', tipo: 'pix',       codigoFornecedor: '000008', nomeFornecedor: 'Vedações Técnicas Ltda',          dataEmissao: '2026-03-05', dataVencimento: '2026-04-05', status: 'aberto' },
  { id: '9',  numeroTitulo: '000009', tipo: 'duplicata', codigoFornecedor: '000009', nomeFornecedor: 'Tintas e Revestimentos S/A',      dataEmissao: '2026-03-08', dataVencimento: '2026-04-08', status: 'aberto' },
  { id: '10', numeroTitulo: '000010', tipo: 'boleto',    codigoFornecedor: '000010', nomeFornecedor: 'Polímeros do Centro-Oeste ME',    dataEmissao: '2026-03-10', dataVencimento: '2026-04-10', status: 'aberto' },
  { id: '11', numeroTitulo: '000011', tipo: 'cartao',    codigoFornecedor: '000011', nomeFornecedor: 'Ferramentas Industriais Ltda',    dataEmissao: '2026-03-15', dataVencimento: '2026-04-15', status: 'cancelado' },
  { id: '12', numeroTitulo: '000012', tipo: 'duplicata', codigoFornecedor: '000012', nomeFornecedor: 'Logística e Transporte S/A',      dataEmissao: '2026-03-20', dataVencimento: '2026-04-20', status: 'aberto' },
]

function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

function StatusBadge({ status }: { status: StatusTitulo }) {
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

export function ContasPagarPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<StatusTitulo | 'todos'>('todos')

  const contasFiltradas = CONTAS_MOCK.filter(c => {
    const matchSearch =
      c.numeroTitulo.includes(search) ||
      c.nomeFornecedor.toLowerCase().includes(search.toLowerCase()) ||
      c.codigoFornecedor.includes(search)
    const matchStatus = statusFiltro === 'todos' || c.status === statusFiltro
    return matchSearch && matchStatus
  })

  const COL_WIDTHS = {
    titulo:          140,
    tipo:            120,
    codFornecedor:   140,
    nomeFornecedor:  260,
    emissao:         140,
    vencimento:      150,
    status:          150,
  }

  const totalDataWidth = Object.values(COL_WIDTHS).reduce((a, b) => a + b, 0)
  const acoesWidth = 80

  return (
    <>
      <style>{`
        .cp-search {
          padding: 9px 14px 9px 34px;
          border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .cp-search::placeholder { color: var(--color-text-secondary); }
        .cp-search:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
        }
        .cp-select {
          padding: 9px 14px; border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text); cursor: pointer;
          transition: border-color 0.15s; white-space: nowrap;
        }
        .cp-select:focus { border-color: #16A34A; }
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
        .table-row-cp { transition: background 0.12s; cursor: pointer; }
        .table-row-cp:hover td { background: #F0FDF4 !important; }
        .btn-acao {
          padding: 5px 12px; border-radius: 6px;
          border: 1.5px solid var(--color-border);
          background: white; font-size: 12px; font-weight: 500;
          color: var(--color-text-secondary); cursor: pointer;
          transition: all 0.15s; font-family: var(--font-body);
        }
        .btn-acao:hover { border-color: #16A34A; color: #16A34A; background: #F0FDF4; }
        .sticky-actions {
          position: sticky;
          right: 0;
          z-index: 2;
          box-shadow: -4px 0 8px rgba(0,0,0,0.06);
        }
        .sticky-actions-header {
          position: sticky;
          right: 0;
          z-index: 4;
          box-shadow: -4px 0 8px rgba(0,0,0,0.06);
        }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
      }}>

        <div style={{ padding: '16px 28px 16px', flexShrink: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
            Contas a Pagar
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

          {/* Toolbar */}
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
                className="cp-search"
                placeholder="Buscar por título, fornecedor ou código..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select className="cp-select" value={statusFiltro} onChange={e => setStatusFiltro(e.target.value as StatusTitulo | 'todos')}>
              <option value="todos">Todos os status</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <button className="btn-incluir" onClick={() => navigate('/financeiro/contas-pagar/novo')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Incluir
            </button>
          </div>

          {/* Tabela com scroll horizontal + coluna sticky */}
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <table style={{ borderCollapse: 'collapse', width: totalDataWidth + acoesWidth, minWidth: '100%', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: COL_WIDTHS.titulo }} />
                <col style={{ width: COL_WIDTHS.tipo }} />
                <col style={{ width: COL_WIDTHS.codFornecedor }} />
                <col style={{ width: COL_WIDTHS.nomeFornecedor }} />
                <col style={{ width: COL_WIDTHS.emissao }} />
                <col style={{ width: COL_WIDTHS.vencimento }} />
                <col style={{ width: COL_WIDTHS.status }} />
                <col style={{ width: acoesWidth }} />
              </colgroup>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid var(--color-border)' }}>
                  {['Nº Título', 'Tipo', 'Cód. Fornecedor', 'Nome do Fornecedor', 'Dt. Emissão', 'Dt. Vencimento', 'Status'].map(col => (
                    <th key={col} style={{
                      padding: '11px 16px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap', letterSpacing: '0.03em',
                      background: '#FAFAFA',
                      position: 'sticky', top: 0, zIndex: 1,
                    }}>
                      {col}
                    </th>
                  ))}
                  <th className="sticky-actions-header" style={{
                    padding: '11px 16px',
                    background: '#FAFAFA',
                    position: 'sticky', top: 0, right: 0, zIndex: 4,
                  }} />
                </tr>
              </thead>
              <tbody>
                {contasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                      Nenhum título encontrado.
                    </td>
                  </tr>
                ) : (
                  contasFiltradas.map((conta, i) => (
                    <tr
                      key={conta.id}
                      className="table-row-cp"
                      style={{ borderBottom: i < contasFiltradas.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onClick={() => navigate(`/financeiro/contas-pagar/${conta.id}`)}
                    >
                      <td style={{ padding: '13px 16px', background: 'white' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#15803D' }}>
                          {conta.numeroTitulo}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text)', background: 'white', whiteSpace: 'nowrap' }}>
                        {TIPO_CONFIG[conta.tipo].label}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text-secondary)', background: 'white', whiteSpace: 'nowrap' }}>
                        {conta.codigoFornecedor}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 14, color: 'var(--color-text)', background: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conta.nomeFornecedor}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text-secondary)', background: 'white', whiteSpace: 'nowrap' }}>
                        {formatDate(conta.dataEmissao)}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, background: 'white', whiteSpace: 'nowrap',
                        color: conta.status === 'vencido' ? '#EF4444' : 'var(--color-text-secondary)',
                        fontWeight: conta.status === 'vencido' ? 600 : 400,
                      }}>
                        {formatDate(conta.dataVencimento)}
                      </td>
                      <td style={{ padding: '13px 16px', background: 'white' }}>
                        <StatusBadge status={conta.status} />
                      </td>
                      <td
                        className="sticky-actions"
                        style={{ padding: '13px 16px', background: 'white' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button className="btn-acao" onClick={() => navigate(`/financeiro/contas-pagar/${conta.id}/editar`)}>
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

          {/* Rodapé */}
          <div style={{
            padding: '11px 20px', flexShrink: 0,
            borderTop: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FAFAFA',
          }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {contasFiltradas.length} título{contasFiltradas.length !== 1 ? 's' : ''} encontrado{contasFiltradas.length !== 1 ? 's' : ''}
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