'use client'

import { useState } from 'react'
import { PinConfirmModal } from '@/components/modals/PinConfirmModal'
import { Trash2, Eye } from 'lucide-react'

const PROCESSOS = [
  { id: '#PRO-0092', title: 'Revisão estratégica de RH — reestruturação cargos', impact: 'Alto', urgency: 'Alta', status: 'Em andamento', resp: 'Dr. Alan S.', dept: 'RH', deadline: '28/04/26', progress: 35 },
  { id: '#PRO-0091', title: 'Renovação contrato DTI — infraestrutura tech', impact: 'Alto', urgency: 'Crítica', status: 'Decisão pendente', resp: 'Dra. Clara M.', dept: 'Jurídico', deadline: '05/04/26', progress: 85 },
  { id: '#PRO-0090', title: 'Regulatório: ANVISA — adequação UTI', impact: 'Alto', urgency: 'Crítica', status: 'Bloqueado', resp: 'Dr. Rodrigo F.', dept: 'Regulatório', deadline: '10/04/26', progress: 60 },
  { id: '#PRO-0089', title: 'Plano de treinamento em novas metodologias', impact: 'Médio', urgency: 'Norma', status: 'Em andamento', resp: 'Juliana Paz', dept: 'RH', deadline: '30/04/26', progress: 70 },
  { id: '#PRO-0088', title: 'Renovação alvarás sanitários — regularização', impact: 'Alto', urgency: 'Alta', status: 'Aguardando docs', resp: 'Dr. Márcio T.', dept: 'Regulatório', deadline: '20/04/26', progress: 45 },
  { id: '#PRO-0087', title: 'Licitação para fornecimento de EPI hospitalar', impact: 'Médio', urgency: 'Norma', status: 'Em andamento', resp: 'Sandra Cruz', dept: 'Compras', deadline: '15/05/26', progress: 20 },
  { id: '#PRO-0086', title: 'Auditoria fiscal Q1 2026', impact: 'Alto', urgency: 'Alta', status: 'Revisão final', resp: 'Marcos L.', dept: 'Financeiro', deadline: '15/04/26', progress: 91 },
]

type Filter = 'all' | 'Alta' | 'Crítica' | 'Em andamento' | 'Decisão pendente' | 'Bloqueado'

const STATUS_BADGE: Record<string, string> = {
  'Em andamento': 'cc-badge-progress',
  'Decisão pendente': 'cc-badge-decision',
  'Bloqueado': 'cc-badge-high',
  'Revisão final': 'cc-badge-medium',
  'Aguardando docs': 'cc-badge-waiting',
}

const URGENCY_BADGE: Record<string, string> = {
  Crítica: 'cc-badge-high',
  Alta: 'cc-badge-medium',
  Norma: 'cc-badge-done',
}

export default function SectionProcessos() {
  const [filter, setFilter] = useState<Filter>('all')
  const [newOpen, setNewOpen] = useState(false)
  const [detailIdx, setDetailIdx] = useState<number | null>(null)
  const [pinModalOpen, setPinModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', dept: '', impact: 'Alto', urgency: 'Alta', deadline: '', resp: '', desc: '' })
  
  // PIN states removed as they are handled by PinConfirmModal directly or not used here.

  const filtered = filter === 'all' ? PROCESSOS : PROCESSOS.filter(p =>
    p.urgency === filter || p.status === filter
  )

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'Crítica', label: '🔴 Crítica' },
    { key: 'Alta', label: '🟡 Alta' },
    { key: 'Em andamento', label: '🔵 Em andamento' },
    { key: 'Decisão pendente', label: '⚡ Decisão pendente' },
    { key: 'Bloqueado', label: '🚫 Bloqueado' },
  ]

  const detail = detailIdx !== null ? filtered[detailIdx] : null

  return (
    <div>
      {/* STATS */}
      <div className="cc-stats-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 18 }}>
        {[
          { v: '47', l: 'Total de Processos', c: 'var(--lavender)' },
          { v: '5', l: 'Decisão Pendente', c: 'var(--danger)' },
          { v: '78%', l: 'Taxa de Resolução', c: 'var(--success)' },
          { v: '12d', l: 'Prazo Médio', c: 'var(--info)' },
        ].map((s, i) => (
          <div key={i} className="cc-stat-card" style={{ '--cc-grad': `linear-gradient(90deg,${s.c},${s.c}99)` } as React.CSSProperties}>
            <div className="cc-stat-value" style={{ fontSize: 26 }}>{s.v}</div>
            <div className="cc-stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="cc-card">
        <div className="cc-card-header">
          <div className="cc-card-title">⚙ Processos Estratégicos</div>
          <button className="cc-btn-primary" style={{ fontSize: 11, padding: '7px 15px' }} onClick={() => setNewOpen(true)}>+ Novo Processo</button>
        </div>
        <div className="cc-card-body" style={{ paddingTop: 0 }}>
          <div className="cc-filter-bar">
            {filters.map(f => (
              <button key={f.key} className={`cc-pill${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
            ))}
          </div>
          <div className="cc-table-wrap">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Processo</th>
                  <th>Urgência</th>
                  <th>Status</th>
                  <th>Resp.</th>
                  <th>Prazo</th>
                  <th>Progresso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10, color: 'var(--lavender)', fontWeight: 700 }}>{p.id}</td>
                    <td style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text1)', fontWeight: 500 }}>{p.title}</td>
                    <td><span className={`cc-badge ${URGENCY_BADGE[p.urgency] || 'cc-badge-open'}`}>{p.urgency}</span></td>
                    <td><span className={`cc-badge ${STATUS_BADGE[p.status] || 'cc-badge-open'}`} style={{ fontSize: 10 }}>{p.status}</span></td>
                    <td style={{ fontSize: 11 }}>{p.resp}</td>
                    <td style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10 }}>{p.deadline}</td>
                    <td style={{ minWidth: 100 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="cc-progress" style={{ flex: 1, height: 4 }}>
                          <div className="cc-progress-fill" style={{ width: `${p.progress}%`, background: p.progress >= 80 ? 'linear-gradient(90deg,var(--success),var(--info))' : 'linear-gradient(90deg,var(--violet),var(--lavender))' }} />
                        </div>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono),monospace', color: 'var(--text3)', flexShrink: 0 }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="cc-btn-sm" style={{ padding: '6px', borderRadius: 8 }} onClick={() => setDetailIdx(i)}>
                          <Eye size={14} />
                        </button>
                        <button 
                          className="cc-btn-sm" 
                          style={{ padding: '6px', borderRadius: 8, color: 'var(--danger)', background: 'rgba(239,68,68,0.1)' }}
                          onClick={() => {
                            setItemToDelete(p.id)
                            setPinModalOpen(true)
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {detail && (
        <div className="cc-modal-overlay open" onClick={() => setDetailIdx(null)}>
          <div className="cc-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cc-modal-top">
              <div>
                <span style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'var(--lavender)', fontWeight: 700 }}>{detail.id}</span>
                <div className="cc-modal-title" style={{ marginTop: 4 }}>{detail.title}</div>
              </div>
              <button className="cc-modal-close" onClick={() => setDetailIdx(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0' }}>
              <span className={`cc-badge ${URGENCY_BADGE[detail.urgency]}`}>{detail.urgency}</span>
              <span className={`cc-badge ${STATUS_BADGE[detail.status] || 'cc-badge-open'}`}>{detail.status}</span>
              <span className="cc-badge cc-badge-reg">{detail.dept}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[['Responsável', detail.resp], ['Prazo', detail.deadline], ['Impacto', detail.impact], ['Progresso', `${detail.progress}%`]].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(168,85,247,.06)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="cc-progress" style={{ height: 7, marginBottom: 14 }}>
              <div className="cc-progress-fill" style={{ width: `${detail.progress}%` }} />
            </div>
            <div className="cc-modal-ai">
              <div className="cc-modal-ai-label">🤖 Recomendação CORE</div>
              <div className="cc-modal-ai-text">Prioridade detectada. Recomenda-se acompanhamento diário até resolução.</div>
            </div>
            <div className="cc-modal-actions">
              <button className="cc-btn-primary" style={{ fontSize: 11, padding: '7px 15px' }}>Atualizar status</button>
              <button className="cc-btn-sm" onClick={() => setDetailIdx(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PROCESS MODAL */}
      {newOpen && (
        <div className="cc-modal-overlay open" onClick={() => setNewOpen(false)}>
          <div className="cc-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cc-modal-top">
              <div className="cc-modal-title">+ Novo Processo</div>
              <button className="cc-modal-close" onClick={() => setNewOpen(false)}>✕</button>
            </div>
            <div className="cc-form-group">
              <div className="cc-form-label">Título do processo *</div>
              <input className="cc-form-input" placeholder="Descreva o processo..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="cc-form-row cols-2">
              <div>
                <div className="cc-form-label">Departamento</div>
                <select className="cc-form-input" value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}>
                  {['Diretoria', 'Jurídico', 'Financeiro', 'RH', 'TI', 'Regulatório', 'Compras', 'Médico'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <div className="cc-form-label">Urgência</div>
                <select className="cc-form-input" value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}>
                  {['Crítica', 'Alta', 'Norma'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="cc-form-row cols-2">
              <div>
                <div className="cc-form-label">Responsável</div>
                <input className="cc-form-input" placeholder="Nome do responsável" value={form.resp} onChange={e => setForm(f => ({ ...f, resp: e.target.value }))} />
              </div>
              <div>
                <div className="cc-form-label">Prazo *</div>
                <input className="cc-form-input" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              </div>
            </div>
            <div className="cc-form-group">
              <div className="cc-form-label">Descrição</div>
              <textarea className="cc-form-input" rows={3} placeholder="Detalhes, contexto, objetivos..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div className="cc-modal-actions">
              <button className="cc-btn-primary" onClick={() => setNewOpen(false)}>Registrar processo</button>
              <button className="cc-btn-sm" onClick={() => setNewOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {/* PIN CONFIRM MODAL */}
      <PinConfirmModal 
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onVerified={() => {
          setPinModalOpen(false)
          // Here we would actually delete the item
          alert(`Item ${itemToDelete} deletado com segurança via PIN.`)
          setItemToDelete(null)
        }}
      />
    </div>
  )
}
