'use client'

import { useState } from 'react'

const REUNIOES = [
  { day: '02', month: 'ABR', title: 'Reunião de Diretoria — Q1 2026', meta: 'Sala Executiva · 14:00 · 2h', parts: 6, badge: 'cc-badge-done', btext: 'Realizada' },
  { day: '28', month: 'MAR', title: 'Comitê de Gestão Hospitalar', meta: 'Auditório · 09:00 · 3h', parts: 8, badge: 'cc-badge-done', btext: 'Realizada' },
  { day: '21', month: 'MAR', title: 'Reunião DTI — infraestrutura', meta: 'Online · Zoom · 1h30', parts: 4, badge: 'cc-badge-done', btext: 'Realizada' },
]

const PROXIMAS = [
  { day: '07', month: 'ABR', title: 'Comitê de Gestão', meta: 'Auditório · 08:30', parts: 7, badge: 'cc-badge-open', btext: 'Agendada' },
  { day: '15', month: 'ABR', title: 'Assembleia Geral Ordinária', meta: 'Auditório · 09:00', parts: 12, badge: 'cc-badge-open', btext: 'Agendada' },
]

export default function SectionReunioes() {
  const [tab, setTab] = useState<'passadas' | 'proximas'>('passadas')
  const [newOpen, setNewOpen] = useState(false)
  const list = tab === 'passadas' ? REUNIOES : PROXIMAS

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="cc-filter-bar" style={{ marginBottom: 0 }}>
          <button className={`cc-pill${tab === 'passadas' ? ' active' : ''}`} onClick={() => setTab('passadas')}>Realizadas</button>
          <button className={`cc-pill${tab === 'proximas' ? ' active' : ''}`} onClick={() => setTab('proximas')}>Próximas</button>
        </div>
        <button className="cc-btn-primary" style={{ fontSize: 11, padding: '7px 15px' }} onClick={() => setNewOpen(true)}>+ Nova Reunião</button>
      </div>

      <div className="cc-card">
        <div className="cc-card-header">
          <div className="cc-card-title">👥 {tab === 'passadas' ? 'Reuniões Realizadas' : 'Próximas Reuniões'}</div>
        </div>
        <div className="cc-card-body">
          {list.map((r, i) => (
            <div key={i} className="cc-meeting-card">
              <div className="cc-meeting-date">
                <div className="cc-meeting-day" style={{ color: 'var(--lavender)', fontSize: 20 }}>{r.day}</div>
                <div className="cc-meeting-month">{r.month}</div>
              </div>
              <div className="cc-meeting-info">
                <div className="cc-meeting-title">{r.title}</div>
                <div className="cc-meeting-meta">{r.meta}</div>
              </div>
              <div className="cc-participants">
                {Array.from({ length: Math.min(r.parts, 4) }).map((_, pi) => (
                  <div key={pi} className="cc-part-av">{String.fromCharCode(65 + pi)}</div>
                ))}
                {r.parts > 4 && <div className="cc-part-av">+{r.parts - 4}</div>}
              </div>
              <span className={`cc-badge ${r.badge}`} style={{ marginLeft: 8 }}>{r.btext}</span>
            </div>
          ))}
          {tab === 'passadas' && (
            <div className="cc-card" style={{ marginTop: 16 }}>
              <div className="cc-card-header">
                <div className="cc-card-title">📄 Atas Arquivadas</div>
              </div>
              <div className="cc-card-body">
                <div className="cc-table-wrap">
                  <table className="cc-table">
                    <thead><tr><th>Data</th><th>Reunião</th><th>Pauta</th><th>Arquivo</th></tr></thead>
                    <tbody>
                      {[
                        ['02/04/26', 'Diretoria Q1', 'Resultados, prioridades Q2', 'ATA-02-04-26.pdf'],
                        ['28/03/26', 'Comitê Gestão', 'Processos e indicadores', 'ATA-28-03-26.pdf'],
                        ['21/03/26', 'DTI', 'Infraestrutura e contratos', 'ATA-21-03-26.pdf'],
                      ].map(([dt, rn, pauta, arq]) => (
                        <tr key={dt}>
                          <td style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10 }}>{dt}</td>
                          <td style={{ fontWeight: 600 }}>{rn}</td>
                          <td style={{ color: 'var(--text3)', fontSize: 11 }}>{pauta}</td>
                          <td>
                            <button className="cc-btn-sm" style={{ fontSize: 10, padding: '3px 8px' }}>
                              ⬇ {arq}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {newOpen && (
        <div className="cc-modal-overlay open" onClick={() => setNewOpen(false)}>
          <div className="cc-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cc-modal-top">
              <div className="cc-modal-title">+ Agendar Nova Reunião</div>
              <button className="cc-modal-close" onClick={() => setNewOpen(false)}>✕</button>
            </div>
            <div className="cc-form-group"><div className="cc-form-label">Pauta / Título *</div><input className="cc-form-input" placeholder="Tema da reunião..." /></div>
            <div className="cc-form-row cols-2">
              <div><div className="cc-form-label">Data *</div><input className="cc-form-input" type="date" /></div>
              <div><div className="cc-form-label">Hora</div><input className="cc-form-input" type="time" /></div>
            </div>
            <div className="cc-form-row cols-2">
              <div><div className="cc-form-label">Local / Link</div><input className="cc-form-input" placeholder="Sala / Zoom" /></div>
              <div><div className="cc-form-label">Participantes (emails)</div><input className="cc-form-input" placeholder="email1, email2..." /></div>
            </div>
            <div className="cc-form-group"><div className="cc-form-label">Observações</div><textarea className="cc-form-input" rows={2} style={{ resize: 'vertical' }} /></div>
            <div className="cc-modal-actions">
              <button className="cc-btn-primary" onClick={() => setNewOpen(false)}>Confirmar reunião</button>
              <button className="cc-btn-sm" onClick={() => setNewOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
