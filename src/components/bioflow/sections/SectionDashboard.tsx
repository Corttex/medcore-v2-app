'use client'

import { useState } from 'react'

type Section = 'dashboard' | 'agenda' | 'reunioes' | 'documentos' | 'processos' | 'demandas' | 'notificacoes' | 'ia' | 'arquitetura'

interface Props {
  onNavigate: (s: Section) => void
  quote: { text: string; author: string }
}

interface PriorityItem {
  level: 'critical' | 'attention'
  title: string
  type: string
  deadline: string
  desc: string
}

const PRIORITIES: PriorityItem[] = [
  { level: 'critical', title: 'Revisão contrato fornecedor de TI — aguarda assinatura', type: 'Contrato', deadline: '05/04/26', desc: '#PRO-0091 aguarda assinatura da diretoria. Risco de descontinuidade dos serviços de TI se não assinado até 05/04.' },
  { level: 'critical', title: 'Adequação ANVISA – UTI: pendente aprovação regulatória', type: 'Regulatório', deadline: '10/04/26', desc: '#PRO-0090 — Laudo técnico pendente. Risco de embargo sanitário se não entregue.' },
  { level: 'attention', title: 'Auditoria financeira Q1 — relatório final pendente', type: 'Financeiro', deadline: '15/04/26', desc: '#PRO-0086 — Conformidade 91%. Aguarda assinatura do Diretor.' },
  { level: 'attention', title: 'Demanda Secretaria de Saúde SP — epidemiológico', type: 'Demanda', deadline: '08/04/26', desc: '#DEM-042 — Relatório epidemiológico. Prazo: 08/04/2026.' },
  { level: 'attention', title: 'Renovação de alvarás sanitários — docs incompletos', type: 'Regulatório', deadline: '20/04/26', desc: '#PRO-0088 — Faltam laudo elétrico e certidão CREA.' },
]

export default function SectionDashboard({ onNavigate, quote }: Props) {
  const [showVD, setShowVD] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<PriorityItem | null>(null)

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const openAnalise = (item: PriorityItem) => {
    setModalData(item)
    setModalOpen(true)
  }

  const kpis = [
    { value: '24', label: 'Compromissos institucionais', change: '+12%', up: true, color: '#7B3FB5', nav: 'agenda' as Section },
    { value: '47', label: 'Processos estratégicos ativos', change: '+3', up: true, color: '#60A5FA', nav: 'processos' as Section },
    { value: '312', label: 'Documentos sob gestão', change: '+28', up: true, color: '#34D399', nav: 'documentos' as Section },
    { value: '9', label: 'Pendências críticas em acompanhamento', change: '-2', up: false, color: '#F87171', nav: 'notificacoes' as Section },
  ]

  return (
    <div>
      {/* QUOTE */}
      <div className="cc-quote">
        <span style={{ fontSize: 20 }}>💎</span>
        <div>
          <div className="cc-quote-text">{quote.text}</div>
          <div className="cc-quote-author">{quote.author}</div>
        </div>
      </div>

      {/* PRIORITY BLOCK */}
      <div className="cc-priority-block">
        <div className="cc-priority-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div className="cc-priority-pulse" />
            <span className="cc-priority-title">AÇÕES PRIORITÁRIAS HOJE</span>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono), monospace' }}>{today}</span>
        </div>
        {PRIORITIES.map((item, i) => (
          <div key={i} className={`cc-priority-item ${item.level}`}>
            <span className={`cc-pi-ind ${item.level}`}>{item.level === 'critical' ? 'CRÍTICO' : 'ATENÇÃO'}</span>
            <div className="cc-pi-body">
              <div className="cc-pi-title">{item.title}</div>
              <div className="cc-pi-meta">
                <span style={{ background: 'rgba(168,85,247,.12)', color: 'var(--lilac)', padding: '1px 6px', borderRadius: 8, fontWeight: 600, fontSize: 10 }}>{item.type}</span>
                <span>Prazo: <strong style={{ color: item.level === 'critical' ? 'var(--danger)' : 'var(--warning)' }}>{item.deadline}</strong></span>
              </div>
            </div>
            <button className="cc-pi-action" onClick={() => openAnalise(item)}>Analisar →</button>
          </div>
        ))}
      </div>

      {/* VISÃO DIRETORIA TOGGLE */}
      <button className="cc-vd-btn" style={{ marginBottom: 18, padding: '8px 16px' }} onClick={() => setShowVD(v => !v)}>
        {showVD ? '▲ Ocultar' : '▼ Visão Diretoria'}
      </button>

      {showVD && (
        <div style={{ marginBottom: 20 }}>
          <div className="cc-vd-grid">
            <div className="cc-vd-card vd-danger">
              <div className="cc-vd-icon">⚠️</div>
              <div className="cc-vd-label">Pendências p/ Decisão</div>
              <div className="cc-vd-value">4</div>
              <div className="cc-vd-sub">2 contratos · 1 regulatório · 1 financeiro</div>
            </div>
            <div className="cc-vd-card vd-warn">
              <div className="cc-vd-icon">🔥</div>
              <div className="cc-vd-label">Riscos Institucionais</div>
              <div className="cc-vd-value">3</div>
              <div className="cc-vd-sub">ANVISA · Auditoria · Contrato TI</div>
            </div>
            <div className="cc-vd-card vd-purple">
              <div className="cc-vd-icon">⏱</div>
              <div className="cc-vd-label">Prazos Críticos</div>
              <div className="cc-vd-value">2</div>
              <div className="cc-vd-sub">Vencimento em até 7 dias</div>
            </div>
          </div>
          <div className="cc-card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Resumo Executivo da Semana</div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
              No período entre <strong>28/03 e 02/04/2026</strong>, foram conduzidas <strong>7 demandas estratégicas</strong>, com <strong>4 pendências críticas</strong> que requerem deliberação imediata. Resolutividade: <strong>78%</strong>.
            </p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="cc-stats-row">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="cc-stat-card"
            style={{ '--cc-grad': `linear-gradient(90deg,${kpi.color},${kpi.color}99)` } as React.CSSProperties}
            onClick={() => onNavigate(kpi.nav)}
          >
            <div className="cc-stat-icon" style={{ background: `${kpi.color}22`, color: kpi.color }}>
              <svg viewBox="0 0 24 24">
                {i === 0 && <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}
                {i === 1 && <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>}
                {i === 2 && <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>}
                {i === 3 && <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
              </svg>
            </div>
            <div className="cc-stat-value">{kpi.value}</div>
            <div className="cc-stat-label">{kpi.label}</div>
            <div className={`cc-stat-change ${kpi.up ? 'up' : 'dn'}`}>{kpi.change}</div>
            <div className="cc-stat-hint">Ver detalhes →</div>
          </div>
        ))}
      </div>

      {/* ACTIVITY + INDICATORS */}
      <div className="cc-grid-3">
        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">Movimentações Recentes</div>
          </div>
          <div className="cc-card-body">
            {[
              { color: 'var(--lavender)', text: 'Reunião de Diretoria registrada', time: 'Hoje, 14:32' },
              { color: 'var(--success)', text: 'Relatório Q1-2026.pdf protocolado', time: 'Hoje, 11:15' },
              { color: 'var(--warning)', text: '#PRO-0091 escalado p/ alta urgência', time: 'Ontem, 17:48' },
              { color: 'var(--info)', text: 'Demanda externa registrada por Dr. Alan', time: 'Ontem, 09:20' },
              { color: 'var(--lavender)', text: 'Ata semanal gerada e arquivada', time: '02/04, 08:00' },
            ].map((act, i) => (
              <div key={i} className="cc-activity-item">
                <div className="cc-act-dot" style={{ background: act.color }} />
                <div style={{ flex: 1 }}>
                  <div className="cc-act-text">{act.text}</div>
                  <div className="cc-act-time">{act.time}</div>
                </div>
                <span className="cc-act-arrow">›</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">Indicadores de Desempenho</div>
          </div>
          <div className="cc-card-body">
            {[
              { label: 'Resolutividade', pct: 78 },
              { label: 'Cumprimento agenda', pct: 92 },
              { label: 'Responsividade demandas', pct: 65 },
              { label: 'Conformidade documental', pct: 87 },
            ].map((ind, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{ind.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono),monospace' }}>{ind.pct}%</span>
                </div>
                <div className="cc-progress">
                  <div className="cc-progress-fill" style={{ width: `${ind.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RISK MATRIX + SLA */}
      <div className="cc-grid-2" style={{ marginTop: 16 }}>
        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">⚠ Matriz de Riscos</div>
          </div>
          <div className="cc-card-body" style={{ padding: '12px 16px' }}>
            {[
              { label: 'Regulatório · ANVISA', badge: 'cc-badge-high', text: 'Crítico', color: 'var(--danger)' },
              { label: 'Financeiro · Auditoria Q1', badge: 'cc-badge-medium', text: 'Médio', color: 'var(--warning)' },
              { label: 'Contratual · TI', badge: 'cc-badge-open', text: 'Em análise', color: 'var(--info)' },
              { label: 'Operacional · Limpeza', badge: 'cc-badge-done', text: 'Baixo', color: 'var(--success)' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderLeft: `3px solid ${r.color}`, borderRadius: '0 8px 8px 0', marginBottom: 7, background: `${r.color}11` }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</span>
                <span className={`cc-badge ${r.badge}`}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">⏱ SLA de Resposta</div>
            <span className="cc-badge cc-badge-done">No prazo</span>
          </div>
          <div className="cc-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, textAlign: 'center' }}>
              {[
                { val: '4h', label: 'Demandas', color: 'var(--success)' },
                { val: '2d', label: 'Processos', color: 'var(--info)' },
                { val: '1h', label: 'Urgências', color: 'var(--warning)' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '10px 6px', background: `${s.color}14`, borderRadius: 10, border: `1px solid ${s.color}26` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono),monospace', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ANALYSIS MODAL */}
      {modalOpen && modalData && (
        <div className="cc-modal-overlay open" onClick={() => setModalOpen(false)}>
          <div className="cc-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cc-modal-top">
              <div>
                <span className="cc-badge" style={{ background: modalData.level === 'critical' ? 'rgba(248,113,113,.15)' : 'rgba(251,191,36,.12)', color: modalData.level === 'critical' ? '#fca5a5' : '#fcd34d', border: `1px solid ${modalData.level === 'critical' ? 'rgba(248,113,113,.3)' : 'rgba(251,191,36,.25)'}`, marginBottom: 8, display: 'inline-flex' }}>
                  {modalData.level === 'critical' ? '⚠ CRÍTICO' : '⚡ ATENÇÃO'} · {modalData.type}
                </span>
                <div className="cc-modal-title">{modalData.title}</div>
              </div>
              <button className="cc-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', margin: '10px 0' }}>
              <span className="cc-badge cc-badge-medium">Prazo: {modalData.deadline}</span>
              <span className="cc-badge cc-badge-progress">{modalData.type}</span>
            </div>
            <div className="cc-modal-desc">{modalData.desc}</div>
            <div className="cc-modal-ai">
              <div className="cc-modal-ai-label">🤖 Análise CORE Intelligence</div>
              <div className="cc-modal-ai-text">
                Este item requer atenção imediata. Recomenda-se escalar para aprovação da diretoria nas próximas 24h e registrar a decisão no módulo de Processos para rastreabilidade regulatória.
              </div>
            </div>
            <div className="cc-modal-actions">
              <button className="cc-btn-primary" style={{ fontSize: 11, padding: '7px 16px' }} onClick={() => { setModalOpen(false); onNavigate('ia') }}>💬 Consultar IA</button>
              <button className="cc-btn-sm" onClick={() => { setModalOpen(false); onNavigate('processos') }}>Ver Processos</button>
              <button className="cc-btn-sm" onClick={() => setModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
