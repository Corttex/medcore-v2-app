'use client'

import { useState } from 'react'

interface Notif { id: number; type: 'critical' | 'attention' | 'info' | 'success'; title: string; desc: string; time: string; read: boolean }

const INITIAL: Notif[] = [
  { id: 1, type: 'critical', title: 'Prazo crítico: Contrato DTI vence em 5 dias', desc: '#PRO-0091 — Decisão da diretoria necessária com urgência máxima', time: 'Agora', read: false },
  { id: 2, type: 'critical', title: 'ANVISA: prazo regulatório em 10 dias', desc: '#PRO-0090 — UTI sem laudo techniques. Risco de embargo.', time: '15min', read: false },
  { id: 3, type: 'attention', title: 'Auditoria Q1: conformidade 91%', desc: '#PRO-0086 — Relatório final aguarda assinatura da diretoria.', time: '1h', read: false },
  { id: 4, type: 'info', title: 'Nova demanda exige relatório epidemiológico', desc: '#DEM-042 — Secretaria de Saúde SP. Prazo: 08/04/2026.', time: '2h', read: false },
  { id: 5, type: 'success', title: 'Ata da reunião de 02/04 gerada e arquivada', desc: 'Documento disponível em Documentos > Atas 2026.', time: '3h', read: false },
  { id: 6, type: 'info', title: 'Processo #PRO-0087 atualizado: 20% concluído', desc: 'Licitação EPI hospitalar — próxima etapa: análise de propostas.', time: '4h', read: false },
  { id: 7, type: 'success', title: 'Treinamento de prontuário confirmado para dia 10', desc: 'Sala principal · RH · 100 participantes confirmados.', time: 'Ontem', read: true },
  { id: 8, type: 'attention', title: 'Renovação de alvarás: 3 docs faltando', desc: '#PRO-0088 — Laudo elétrico, certidão CREA e planta aprovada.', time: 'Ontem', read: true },
]

type TFilter = 'all' | 'unread' | 'critical' | 'attention' | 'info' | 'success'

export default function SectionNotificacoes() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL)
  const [filter, setFilter] = useState<TFilter>('all')

  const markRead = (id: number) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const markAll = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))
  const clear = () => setNotifs(ns => ns.filter(n => !n.read))

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter !== 'all') return n.type === filter
    return true
  })

  const unread = notifs.filter(n => !n.read).length

  const ICONS: Record<string, React.ReactNode> = {
    critical: <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    attention: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    info: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    success: <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  }

  const filterBtns: { key: TFilter; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'unread', label: `Não lidas (${unread})` },
    { key: 'critical', label: '🔴 Crítico' },
    { key: 'attention', label: '🟡 Atenção' },
    { key: 'info', label: '🔵 Info' },
    { key: 'success', label: '🟢 Sucesso' },
  ]

  return (
    <div>
      {/* HEADER ROW */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Central de Alertas</div>
          {unread > 0 && <span className="cc-badge cc-badge-high">{unread} não lidas</span>}
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <button className="cc-btn-sm" onClick={markAll} disabled={unread === 0} style={{ opacity: unread === 0 ? .4 : 1 }}>✓ Marcar todas</button>
          <button className="cc-btn-sm" onClick={clear}>Limpar lidas</button>
        </div>
      </div>

      <div className="cc-filter-bar">
        {filterBtns.map(fb => (
          <button key={fb.key} className={`cc-pill${filter === fb.key ? ' active' : ''}`} onClick={() => setFilter(fb.key)}>{fb.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Tudo em dia!</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Nenhuma notificação nesta categoria.</div>
        </div>
      ) : filtered.map(n => (
        <div key={n.id} className={`cc-notif-item n-${n.type}${n.read ? ' is-read' : ''}`}>
          <div className="cc-notif-icon">{ICONS[n.type]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="cc-notif-title">{n.title}</div>
            <div className="cc-notif-desc">{n.desc}</div>
            <div className="cc-notif-time">{n.time}</div>
          </div>
          {!n.read && (
            <button className="cc-notif-read-btn" onClick={() => markRead(n.id)} title="Marcar como lida">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
