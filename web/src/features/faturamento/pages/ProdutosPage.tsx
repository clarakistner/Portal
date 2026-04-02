import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SituacaoProduto = 'ativo' | 'inativo'

type TipoProduto = 'produto_acabado' | 'materia_prima' | 'servico' | 'embalagem' | 'revenda'

interface Produto {
  id: string
  codigo: string
  descricao: string
  unidade: string
  grupo: string
  tipo: TipoProduto
  preco: number
  situacao: SituacaoProduto
}

const SITUACAO_CONFIG: Record<SituacaoProduto, { label: string; color: string; bg: string; dot: string }> = {
  ativo:   { label: 'Ativo',   color: '#166534', bg: '#DCFCE7', dot: '#22C55E' },
  inativo: { label: 'Inativo', color: '#1C1917', bg: '#E7E5E4', dot: '#78716C' },
}

const TIPO_CONFIG: Record<TipoProduto, { label: string; color: string; bg: string }> = {
  produto_acabado: { label: 'Produto Acabado', color: '#1E3A5F', bg: '#DBEAFE' },
  materia_prima:   { label: 'Matéria-Prima',   color: '#78350F', bg: '#FEF3C7' },
  servico:         { label: 'Serviço',          color: '#4C1D95', bg: '#EDE9FE' },
  embalagem:       { label: 'Embalagem',        color: '#1C1917', bg: '#E7E5E4' },
  revenda:         { label: 'Revenda',          color: '#065F46', bg: '#D1FAE5' },
}

const PRODUTOS_MOCK: Produto[] = [
  { id: '1',  codigo: 'PRD0001', descricao: 'Parafuso Sextavado M8',        unidade: 'PC',  grupo: 'Fixadores',       tipo: 'produto_acabado', preco: 0.45,    situacao: 'ativo' },
  { id: '2',  codigo: 'PRD0002', descricao: 'Chapa de Aço 3mm',             unidade: 'KG',  grupo: 'Matérias-Primas', tipo: 'materia_prima',   preco: 8.90,    situacao: 'ativo' },
  { id: '3',  codigo: 'PRD0003', descricao: 'Caixa de Papelão 40x30x20',   unidade: 'PC',  grupo: 'Embalagens',      tipo: 'embalagem',       preco: 3.20,    situacao: 'ativo' },
  { id: '4',  codigo: 'PRD0004', descricao: 'Motor Elétrico 5cv',           unidade: 'PC',  grupo: 'Elétricos',       tipo: 'produto_acabado', preco: 1250.00, situacao: 'ativo' },
  { id: '5',  codigo: 'PRD0005', descricao: 'Instalação e Configuração',    unidade: 'HR',  grupo: 'Serviços',        tipo: 'servico',         preco: 180.00,  situacao: 'ativo' },
  { id: '6',  codigo: 'PRD0006', descricao: 'Tinta Epóxi Cinza 18L',        unidade: 'LT',  grupo: 'Químicos',        tipo: 'revenda',         preco: 215.00,  situacao: 'ativo' },
  { id: '7',  codigo: 'PRD0007', descricao: 'Porca Sextavada M8',           unidade: 'PC',  grupo: 'Fixadores',       tipo: 'produto_acabado', preco: 0.30,    situacao: 'inativo' },
  { id: '8',  codigo: 'PRD0008', descricao: 'Perfil de Alumínio 6m',        unidade: 'BR',  grupo: 'Matérias-Primas', tipo: 'materia_prima',   preco: 95.00,   situacao: 'ativo' },
  { id: '9',  codigo: 'PRD0009', descricao: 'Manutenção Preventiva',        unidade: 'SV',  grupo: 'Serviços',        tipo: 'servico',         preco: 350.00,  situacao: 'ativo' },
  { id: '10', codigo: 'PRD0010', descricao: 'Rolamento 6205 2RS',           unidade: 'PC',  grupo: 'Rolamentos',      tipo: 'revenda',         preco: 28.50,   situacao: 'ativo' },
  { id: '11', codigo: 'PRD0011', descricao: 'Fita de Borracha Vedante',     unidade: 'MT',  grupo: 'Vedação',         tipo: 'produto_acabado', preco: 4.75,    situacao: 'inativo' },
  { id: '12', codigo: 'PRD0012', descricao: 'Resina Poliéster 200kg',       unidade: 'KG',  grupo: 'Químicos',        tipo: 'materia_prima',   preco: 12.30,   situacao: 'ativo' },
]

function formatPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function SituacaoBadge({ situacao }: { situacao: SituacaoProduto }) {
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

function TipoBadge({ tipo }: { tipo: TipoProduto }) {
  const cfg = TIPO_CONFIG[tipo]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: 6,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}

export function ProdutosPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [situacaoFiltro, setSituacaoFiltro] = useState<SituacaoProduto | 'todos'>('todos')
  const [tipoFiltro, setTipoFiltro] = useState<TipoProduto | 'todos'>('todos')

  const produtosFiltrados = PRODUTOS_MOCK.filter(p => {
    const matchSearch =
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.descricao.toLowerCase().includes(search.toLowerCase()) ||
      p.grupo.toLowerCase().includes(search.toLowerCase())
    const matchSituacao = situacaoFiltro === 'todos' || p.situacao === situacaoFiltro
    const matchTipo = tipoFiltro === 'todos' || p.tipo === tipoFiltro
    return matchSearch && matchSituacao && matchTipo
  })

  return (
    <>
      <style>{`
        .produtos-search {
          padding: 9px 14px 9px 34px;
          border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .produtos-search::placeholder { color: var(--color-text-secondary); }
        .produtos-search:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
        }
        .produtos-select {
          padding: 9px 14px; border: 1.5px solid var(--color-border);
          border-radius: 8px; font-size: 14px; outline: none;
          font-family: var(--font-body); background: white;
          color: var(--color-text); cursor: pointer;
          transition: border-color 0.15s; white-space: nowrap;
        }
        .produtos-select:focus { border-color: #16A34A; }
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
        .table-row-produto { transition: background 0.12s; cursor: pointer; }
        .table-row-produto:hover { background: #F0FDF4; }
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
            Produtos
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
                className="produtos-search"
                placeholder="Buscar por código, descrição ou grupo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="produtos-select"
              value={tipoFiltro}
              onChange={e => setTipoFiltro(e.target.value as TipoProduto | 'todos')}
            >
              <option value="todos">Todos os tipos</option>
              {Object.entries(TIPO_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <select
              className="produtos-select"
              value={situacaoFiltro}
              onChange={e => setSituacaoFiltro(e.target.value as SituacaoProduto | 'todos')}
            >
              <option value="todos">Todas as situações</option>
              {Object.entries(SITUACAO_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <button className="btn-incluir" onClick={() => navigate('/cadastros/produtos/novo')}>
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
                <col style={{ width: '12%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr>
                  {['Código', 'Descrição', 'UN', 'Grupo / Família', 'Tipo', ''].map(col => (
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
                <col style={{ width: '12%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <tbody>
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((produto, i) => (
                    <tr
                      key={produto.id}
                      className="table-row-produto"
                      style={{ borderBottom: i < produtosFiltrados.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                      onClick={() => navigate(`/cadastros/produtos/${produto.id}`)}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#15803D' }}>
                          {produto.codigo}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {produto.descricao}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        {produto.unidade}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {produto.grupo}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <TipoBadge tipo={produto.tipo} />
                      </td>
                      <td style={{ padding: '14px 20px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button className="btn-acao" onClick={() => navigate(`/cadastros/produtos/${produto.id}/editar`)}>
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
              {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
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