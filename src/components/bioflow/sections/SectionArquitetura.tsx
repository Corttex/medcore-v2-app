'use client'

export default function SectionArquitetura() {
  const stack = [
    { layer: 'Frontend', name: 'Next.js 15', desc: 'App Router, RSC, Tailwind CSS 4.0', icon: '⚛️' },
    { layer: 'Auth & DB', name: 'Supabase', desc: 'RLS, Auth, Realtime, Storage', icon: '🔒' },
    { layer: 'IA Executiva', name: 'CORE Intelligence', desc: 'Análise preditiva e suporte estratégico', icon: '🧠' },
    { layer: 'Infraestrutura', name: 'Vercel Edge', desc: 'CDN global, Edge Functions, deploy CI/CD', icon: '⚡' },
    { layer: 'Monitoramento', name: 'Vercel Analytics', desc: 'Core Web Vitals, logs em tempo real', icon: '📊' },
    { layer: 'Design System', name: 'CONTE CORE DS', desc: 'Violet/lavanda, tipografia Sora, tokens CSS', icon: '🎨' },
  ]

  const security = [
    { title: 'RLS habilitado', desc: 'Row Level Security em todas as tabelas Supabase', ok: true },
    { title: 'JWT Auth', desc: 'Tokens de sessão via Supabase Auth (15min expiração)', ok: true },
    { title: 'Middleware de rotas', desc: 'Proteção por role: super_admin, individual_user', ok: true },
    { title: 'HTTPS forçado', desc: 'TLS 1.3 em toda a infraestrutura Vercel', ok: true },
    { title: 'Google OAuth', desc: 'Configurar Client ID no painel Supabase', ok: false },
    { title: 'PIN hospitalar', desc: 'Verificação de PIN no backend — em desenvolvimento', ok: false },
  ]

  const metrics = [
    { label: 'LCP', value: '< 1.5s', color: 'var(--success)' },
    { label: 'FID', value: '< 50ms', color: 'var(--success)' },
    { label: 'CLS', value: '< 0.05', color: 'var(--success)' },
    { label: 'Uptime', value: '99.9%', color: 'var(--lavender)' },
  ]

  return (
    <div>
      <div className="cc-card" style={{ marginBottom: 18 }}>
        <div className="cc-card-header">
          <div className="cc-card-title">🏗 Stack Tecnológica</div>
        </div>
        <div className="cc-card-body">
          <div className="cc-tech-grid">
            {stack.map((t, i) => (
              <div key={i} className="cc-tech-card">
                <div style={{ fontSize: 24, marginBottom: 7 }}>{t.icon}</div>
                <div className="cc-tech-layer">{t.layer}</div>
                <div className="cc-tech-name">{t.name}</div>
                <div className="cc-tech-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cc-grid-2" style={{ marginBottom: 18 }}>
        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">🔐 Segurança</div>
          </div>
          <div className="cc-card-body">
            {security.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 8px', borderBottom: '1px solid rgba(168,85,247,.07)', borderRadius: 8 }}>
                <span style={{ color: s.ok ? 'var(--success)' : 'var(--warning)', fontSize: 16, lineHeight: 1.4 }}>{s.ok ? '✅' : '⚠️'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">⚡ Performance</div>
            <span className="cc-badge cc-badge-done">Excelente</span>
          </div>
          <div className="cc-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 16 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ textAlign: 'center', background: `${m.color}14`, border: `1px solid ${m.color}26`, borderRadius: 12, padding: '14px 10px' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono),monospace', color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div className="cc-card" style={{ background: 'rgba(168,85,247,.06)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--lavender)', letterSpacing: '.1em', marginBottom: 6 }}>MAPA DE INTEGRAÇÃO</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.8 }}>
                <strong>Next.js</strong> ← <span style={{ color: 'var(--lavender)' }}>RSC</span> → <strong>Supabase</strong> ← <span style={{ color: 'var(--lavender)' }}>Auth</span> → <strong>Middleware</strong><br />
                <strong>CORE IA</strong> ← <span style={{ color: 'var(--lavender)' }}>context</span> → <strong>Dashboard</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cc-card">
        <div className="cc-card-header">
          <div className="cc-card-title">📋 Roadmap da Plataforma</div>
        </div>
        <div className="cc-card-body">
          {[
            { phase: 'Fase 1 — Concluída', items: ['Auth email/senha', 'RBAC por role', 'Dashboard executivo', 'Módulos: Agenda, Processos, IA'], done: true },
            { phase: 'Fase 2 — Em Desenvolvimento', items: ['Google OAuth (config Supabase)', 'PIN hospitalar', 'Kanban integrado', 'Notificações push (PWA)'], done: false },
            { phase: 'Fase 3 — Planejado', items: ['Plano Pro (assinatura)', 'BI e relatórios automatizados', 'App Mobile (React Native)', 'Integração com sistemas hospitalares'], done: false },
          ].map((ph, i) => (
            <div key={i} style={{ marginBottom: 16, padding: '13px 16px', background: ph.done ? 'rgba(52,211,153,.07)' : 'rgba(168,85,247,.07)', border: `1px solid ${ph.done ? 'rgba(52,211,153,.2)' : 'rgba(168,85,247,.15)'}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{ph.done ? '✅' : '🔄'}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{ph.phase}</span>
                <span className={`cc-badge ${ph.done ? 'cc-badge-done' : 'cc-badge-progress'}`}>{ph.done ? 'Concluída' : 'Em progresso'}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ph.items.map(item => (
                  <span key={item} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 10px', fontSize: 11, color: 'var(--text2)' }}>
                    {ph.done ? '✓' : '◯'} {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
