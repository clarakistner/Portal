import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type StatusTitulo = 'aberto' | 'pago' | 'vencido' | 'cancelado' | 'parcial'
type TipoTitulo = 'duplicata' | 'cheque' | 'boleto' | 'pix' | 'cartao'

interface ContaReceber {
  id: string
  numeroTitulo: string
  parcela: string
  tipo: TipoTitulo
  portador: string
  codigoCliente: string
  nomeCliente: string
  loja: string
  dataEmissao: string
  dataPagamento: string | null
  status: StatusTitulo
}

const STATUS_CONFIG: Record<StatusTitulo, { label: string; color: string; bg: string; dot: string }> = {
  aberto:    { label: 'Aberto',        color: '#166534', bg: '#DCFCE7', dot: '#22C55E' },
  pago:      { label: 'Pago',          color: '#1E3A5F', bg: '#DBEAFE', dot: '#3B82F6' },
  vencido:   { label: 'Vencido',       color: '#7F1D1D', bg: '#FEE2E2', dot: '#EF4444' },
  cancelado: { label: 'Cancelado',     color: '#1C1917', bg: '#E7E5E4', dot: '#78716C' },
  parcial:   { label: 'Pago Parcial',  color: '#78350F', bg: '#FEF3C7', dot: '#F59E0B' },
}

const TIPO_CONFIG: Record<TipoTitulo, { label: string }> = {
  duplicata: { label: 'Duplicata' },
  cheque:    { label: 'Cheque' },
  boleto:    { label: 'Boleto' },
  pix:       { label: 'PIX' },
  cartao:    { label: 'Cartão' },
}

const CONTAS_MOCK: ContaReceber[] = [
  { id: '1',  numeroTitulo: '000001', parcela: '001/003', tipo: 'boleto',    portador: 'Banco do Brasil',  codigoCliente: '000001', nomeCliente: 'Empresa Alpha Ltda',        loja: '01', dataEmissao: '2026-03-01', dataPagamento: '2026-03-28', status: 'pago' },
  { id: '2',  numeroTitulo: '000001', parcela: '002/003', tipo: 'boleto',    portador: 'Banco do Brasil',  codigoCliente: '000001', nomeCliente: 'Empresa Alpha Ltda',        loja: '01', dataEmissao: '2026-03-01', dataPagamento: null,         status: 'aberto' },
  { id: '3',  numeroTitulo: '000001', parcela: '003/003', tipo: 'boleto',    portador: 'Banco do Brasil',  codigoCliente: '000001', nomeCliente: 'Empresa Alpha Ltda',        loja: '01', dataEmissao: '2026-03-01', dataPagamento: null,         status: 'aberto' },
  { id: '4',  numeroTitulo: '000002', parcela: '001/001', tipo: 'pix',       portador: 'Caixa Econômica',  codigoCliente: '000002', nomeCliente: 'Beta Comércio S/A',         loja: '01', dataEmissao: '2026-03-05', dataPagamento: '2026-03-05', status: 'pago' },
  { id: '5',  numeroTitulo: '000003', parcela: '001/002', tipo: 'duplicata', portador: 'Bradesco',         codigoCliente: '000003', nomeCliente: 'Gama Indústria ME',         loja: '02', dataEmissao: '2026-02-15', dataPagamento: null,         status: 'vencido' },
  { id: '6',  numeroTitulo: '000003', parcela: '002/002', tipo: 'duplicata', portador: 'Bradesco',         codigoCliente: '000003', nomeCliente: 'Gama Indústria ME',         loja: '02', dataEmissao: '2026-02-15', dataPagamento: null,         status: 'vencido' },
  { id: '7',  numeroTitulo: '000004', parcela: '001/001', tipo: 'cheque',    portador: 'Itaú',             codigoCliente: '000004', nomeCliente: 'Delta Serviços Ltda',       loja: '01', dataEmissao: '2026-03-10', dataPagamento: '2026-03-10', status: 'parcial' },
  { id: '8',  numeroTitulo: '000005', parcela: '001/004', tipo: 'cartao',    portador: 'Santander',        codigoCliente: '000005', nomeCliente: 'Epsilon Tech S/A',          loja: '01', dataEmissao: '2026-03-12', dataPagamento: null,         status: 'aberto' },
  { id: '9',  numeroTitulo: '000005', parcela: '002/004', tipo: 'cartao',    portador: 'Santander',        codigoCliente: '000005', nomeCliente: 'Epsilon Tech S/A',          loja: '01', dataEmissao: '2026-03-12', dataPagamento: null,         status: 'aberto' },
  { id: '10', numeroTitulo: '000006', parcela: '001/001', tipo: 'pix',       portador: 'Nubank',           codigoCliente: '000006', nomeCliente: 'Zeta Logística ME',         loja: '03', dataEmissao: '2026-03-20', dataPagamento: null,         status: 'cancelado' },
  { id: '11', numeroTitulo: '000007', parcela: '001/003', tipo: 'boleto',    portador: 'Banco do Brasil',  codigoCliente: '000007', nomeCliente: 'Eta Construções Ltda',      loja: '01', dataEmissao: '2026-03-22', dataPagamento: null,         status: 'aberto' },
  { id: '12', numeroTitulo: '000008', parcela: '001/001', tipo: 'duplicata', portador: 'Bradesco',         codigoCliente: '000008', nomeCliente: 'Theta Alimentos S/A',       loja: '02', dataEmissao: '2026-03-25', dataPagamento: '2026-03-26', status: 'pago' },
]

function formatDate(date: string | null) {
  if (!date) return <span style={{ color: 'var(--color-border)' }}>—</span>
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

export function ContasReceberPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<StatusTitulo | 'todos'>('todos')

  const contasFiltradas = CONTAS_MOCK.filter(c => {
    const matchSearch =
      c.numeroTitulo.includes(search) ||
      c.nomeCliente.toLowerCase().includes(search.toLowerCase()) ||
      c.codigoCliente.includes(search) ||
      c.portador.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFiltro === 'todos' || c.status === statusFiltro
    return matchSearch && matchStatus
  })

  const COL_WIDTHS = {
    titulo:      140,
    parcela:     110,
    tipo:        110,
    portador:    170,
    codCliente:  110,
    nomeCliente: 220,
    loja:         80,
    emissao:     140,
    pagamento:   150,
    status:      140,
  }

  const totalDataWidth = Object.values(COL_WIDTHS).reduce((a, b) => a + b, 0)
  const acoesWidth = 80

  return (
    <>
      <style>{`
        .cr-search {
          padding: 9px 14px 9px 34px;
          border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .cr-search::placeholder { color: var(--color-text-secondary); }
        .cr-search:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
        }
        .cr-select {
          padding: 9px 14px; border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text); cursor: pointer;
          transition: border-color 0.15s; white-space: nowrap;
        }
        .cr-select:focus { border-color: #16A34A; }
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
        .table-row-cr { transition: background 0.12s; cursor: pointer; }
        .table-row-cr:hover td { background: #F0FDF4 !important; }
        .btn-acao {
          padding: 5px 12px; border-radius: 6px;
          border: 1.5px solid var(--color-border);
          background: white; font-size: 12px; font-weight: 500;
          color: var(--color-text-secondary); cursor: pointer;
          transition: all 0.15s; font-family: var(--font-body);
        }
        .btn-acao:hover { border-color: #16A34A; color: #16A34A; background: #F0FDF4; }
        .sticky-col {
          position: sticky;
          right: 0;
          z-index: 2;
          box-shadow: -4px 0 8px rgba(0,0,0,0.06);
        }
        .sticky-col-header {
          position: sticky;
          right: 0;
          z-index: 3;
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
            Contas a Receber
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
                className="cr-search"
                placeholder="Buscar por título, cliente ou portador..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select className="cr-select" value={statusFiltro} onChange={e => setStatusFiltro(e.target.value as StatusTitulo | 'todos')}>
              <option value="todos">Todos os status</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <button className="btn-incluir" onClick={() => navigate('/financeiro/contas-receber/novo')}>
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
                <col style={{ width: COL_WIDTHS.parcela }} />
                <col style={{ width: COL_WIDTHS.tipo }} />
                <col style={{ width: COL_WIDTHS.portador }} />
                <col style={{ width: COL_WIDTHS.codCliente }} />
                <col style={{ width: COL_WIDTHS.nomeCliente }} />
                <col style={{ width: COL_WIDTHS.loja }} />
                <col style={{ width: COL_WIDTHS.emissao }} />
                <col style={{ width: COL_WIDTHS.pagamento }} />
                <col style={{ width: COL_WIDTHS.status }} />
                <col style={{ width: acoesWidth }} />
              </colgroup>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid var(--color-border)' }}>
                  {[
                    'Nº Título', 'Parcela', 'Tipo', 'Portador',
                    'Cód. Cliente', 'Nome do Cliente', 'Loja',
                    'Dt. Emissão', 'Dt. Pagamento', 'Status',
                  ].map(col => (
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
                  <th className="sticky-col-header" style={{
                    padding: '11px 16px', textAlign: 'left',
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    background: '#FAFAFA',
                    position: 'sticky', top: 0, right: 0, zIndex: 4,
                  }}>
                    {''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {contasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                      Nenhum título encontrado.
                    </td>
                  </tr>
                ) : (
                  contasFiltradas.map((conta, i) => (
                    <tr
                      key={conta.id}
                      className="table-row-cr"
                      style={{ borderBottom: i < contasFiltradas.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onClick={() => navigate(`/financeiro/contas-receber/${conta.id}`)}
                    >
                      <td style={{ padding: '13px 16px', background: 'white' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#15803D' }}>
                          {conta.numeroTitulo}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text-secondary)', background: 'white', whiteSpace: 'nowrap' }}>
                        {conta.parcela}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text)', background: 'white', whiteSpace: 'nowrap' }}>
                        {TIPO_CONFIG[conta.tipo].label}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text-secondary)', background: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conta.portador}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text-secondary)', background: 'white', whiteSpace: 'nowrap' }}>
                        {conta.codigoCliente}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 14, color: 'var(--color-text)', background: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conta.nomeCliente}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text-secondary)', background: 'white', textAlign: 'center' }}>
                        {conta.loja}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-text-secondary)', background: 'white', whiteSpace: 'nowrap' }}>
                        {formatDate(conta.dataEmissao)}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 13, background: 'white', whiteSpace: 'nowrap' }}>
                        {formatDate(conta.dataPagamento)}
                      </td>
                      <td style={{ padding: '13px 16px', background: 'white' }}>
                        <StatusBadge status={conta.status} />
                      </td>
                      <td
                        className="sticky-col"
                        style={{ padding: '13px 16px', background: 'white' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button className="btn-acao" onClick={() => navigate(`/financeiro/contas-receber/${conta.id}/editar`)}>
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