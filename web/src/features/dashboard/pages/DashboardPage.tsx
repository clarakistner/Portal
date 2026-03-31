const cards = [
  {
    title: 'Total de Pedidos',
    value: '1.234',
    sub: '+12% em relação ao mês anterior',
    positive: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    title: 'Receita Total',
    value: 'R$ 450K',
    sub: '+8% em relação ao mês anterior',
    positive: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: 'Produção Ativa',
    value: '45',
    sub: 'Ordens em andamento',
    positive: null,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    title: 'Integrações Pendentes',
    value: '7',
    sub: 'Aguardando envio ao Protheus',
    positive: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
]

export function DashboardPage() {
  return (
    <div style={{ padding: '16px 28px 28px', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Bem-vindo ao portal de integração.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 32,
      }}>
        {cards.map((card) => (
          <div key={card.title} style={{
            background: 'white',
            borderRadius: 14,
            padding: '20px 22px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'box-shadow 0.2s, transform 0.2s',
            cursor: 'default',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {card.title}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#F0FDF4',
                color: '#16A34A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28, fontWeight: 700,
              color: 'var(--color-text)', marginBottom: 6,
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: 12,
              color: card.positive === true ? '#16A34A' : card.positive === false ? '#EF4444' : 'var(--color-text-secondary)',
            }}>
              {card.positive === true && '↑ '}{card.positive === false && '↓ '}{card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Status de integração */}
      <div style={{
        background: 'white',
        borderRadius: 14,
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>
            Status de Integrações
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Últimas 24h</span>
        </div>
        <div style={{ padding: '8px 0' }}>
          {[
            { label: 'Integrados com sucesso', count: 48, color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Pendentes', count: 7, color: '#D97706', bg: '#FFFBEB' },
            { label: 'Com erro', count: 2, color: '#EF4444', bg: '#FEF2F2' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 22px',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#F8FAFC'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
            >
              <span style={{ fontSize: 14, color: 'var(--color-text)' }}>{item.label}</span>
              <span style={{
                fontSize: 12, fontWeight: 600, color: item.color,
                background: item.bg, padding: '3px 10px', borderRadius: 20,
              }}>
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}