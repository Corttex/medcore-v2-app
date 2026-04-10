'use client'

import { useState } from 'react'

const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

interface EventItem { time: string; name: string; sub: string; color: string; type: string }

const ALL_EVENTS: Record<string, EventItem[]> = {
  '3': [
    { time: '09:00', name: 'Revisão orçamentária Q2', sub: 'Sala de Diretoria · 2h', color: 'var(--lavender)', type: 'Diretoria' },
    { time: '14:00', name: 'Reunião com DTI', sub: 'Online · Zoom · 1h', color: 'var(--info)', type: 'TI' },
  ],
  '7': [
    { time: '08:30', name: 'Comitê de Gestão', sub: 'Auditório · 3h', color: 'var(--lavender)', type: 'Diretoria' },
    { time: '15:00', name: 'Visita ANVISA', sub: 'UTI · Equipe técnica', color: 'var(--danger)', type: 'Regulatório' },
  ],
  '10': [
    { time: '10:00', name: 'Treinamento — Prontuário', sub: 'RH · 100 funcionários', color: 'var(--success)', type: 'RH' },
  ],
  '15': [
    { time: '09:00', name: 'Assembleia Geral', sub: 'Auditório · Diretoria + Conselhos', color: 'var(--lavender)', type: 'Institucional' },
    { time: '14:30', name: 'Revisão contratos — jurídico', sub: 'Sala 3 · Advocacia', color: 'var(--warning)', type: 'Jurídico' },
    { time: '17:00', name: 'Webinar SBHCI', sub: 'Online · 90min', color: 'var(--info)', type: 'Educação' },
  ],
  '22': [
    { time: '08:00', name: 'Reunião Diretoria Clínica', sub: 'Videoconferência · 2h', color: 'var(--lavender)', type: 'Diretoria' },
  ],
}

const DAYS_WITH_EVENTS = new Set(Object.keys(ALL_EVENTS).map(Number))

export default function SectionAgenda() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [newEventOpen, setNewEventOpen] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', local: '', type: 'Reunião', desc: '' })

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: { day: number; cur: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, cur: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true })
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, cur: false })

  const events = ALL_EVENTS[String(selectedDay)] || []

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div>
      <div className="cc-grid-2">
        {/* CALENDAR */}
        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">📅 {MONTHS_PT[month]} {year}</div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="cc-cal-nav-btn" onClick={prevMonth}>‹</button>
              <button className="cc-cal-nav-btn" onClick={nextMonth}>›</button>
            </div>
          </div>
          <div className="cc-card-body">
            <div className="cc-cal-grid" style={{ marginBottom: 8 }}>
              {DAYS_PT.map(d => <div key={d} className="cc-cal-day-name">{d}</div>)}
            </div>
            <div className="cc-cal-grid">
              {cells.map((c, i) => {
                const isToday = c.cur && c.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const isSelected = c.cur && c.day === selectedDay
                const hasEvt = c.cur && DAYS_WITH_EVENTS.has(c.day)
                return (
                  <div
                    key={i}
                    className={`cc-cal-day${isToday ? ' today' : ''}${isSelected && !isToday ? ' selected' : ''}${!c.cur ? ' other-month' : ''}`}
                    onClick={() => c.cur && setSelectedDay(c.day)}
                  >
                    {c.day}
                    {hasEvt && <div className="cc-event-pip" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* EVENTS */}
        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-title">
              {selectedDay === today.getDate() && month === today.getMonth() ? '⚡ Hoje' : `📌 Dia ${selectedDay}`}
              {events.length > 0 && <span style={{ background: 'rgba(168,85,247,.2)', color: 'var(--lilac)', fontSize: 10, padding: '2px 7px', borderRadius: 20 }}>{events.length}</span>}
            </div>
            <button className="cc-btn-sm" onClick={() => setNewEventOpen(true)}>+ Novo</button>
          </div>
          <div className="cc-card-body">
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Sem compromissos</div>
                <div style={{ fontSize: 11 }}>Nenhum evento agendado para este dia</div>
                <button className="cc-btn-primary" style={{ padding: '8px 16px', marginTop: 14, fontSize: 11 }} onClick={() => setNewEventOpen(true)}>Adicionar evento</button>
              </div>
            ) : events.map((ev, i) => (
              <div key={i} className="cc-event-strip" style={{ borderLeftColor: ev.color }}>
                <div className="cc-event-time">{ev.time}</div>
                <div style={{ flex: 1 }}>
                  <div className="cc-event-name">{ev.name}</div>
                  <div className="cc-event-sub">{ev.sub}</div>
                </div>
                <span className="cc-badge cc-badge-progress" style={{ fontSize: 9 }}>{ev.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPCOMING */}
      <div className="cc-card" style={{ marginTop: 18 }}>
        <div className="cc-card-header">
          <div className="cc-card-title">🔜 Próximos Compromissos</div>
          <button className="cc-btn-sm" onClick={() => setNewEventOpen(true)}>+ Agendar</button>
        </div>
        <div className="cc-card-body">
          {[
            { day: '07', month: 'ABR', title: 'Comitê de Gestão Hospitalar', meta: 'Auditório · 08:30 · 3h · Diretoria', color: 'var(--lavender)', badge: 'cc-badge-progress', btext: 'Reunião' },
            { day: '10', month: 'ABR', title: 'Treinamento Sistema de Prontuário', meta: 'RH · 10:00 · 4h · 100 participantes', color: 'var(--success)', badge: 'cc-badge-done', btext: 'Treinamento' },
            { day: '15', month: 'ABR', title: 'Assembleia Geral Ordinária', meta: 'Auditório · 09:00 · 6h · Público', color: 'var(--warning)', badge: 'cc-badge-waiting', btext: 'Assembleia' },
            { day: '22', month: 'ABR', title: 'Reunião Diretoria Clínica', meta: 'Videoconferência · 08:00 · 2h', color: 'var(--info)', badge: 'cc-badge-open', btext: 'Videoconf.' },
          ].map((m, i) => (
            <div key={i} className="cc-meeting-card">
              <div className="cc-meeting-date">
                <div className="cc-meeting-day" style={{ color: m.color }}>{m.day}</div>
                <div className="cc-meeting-month">{m.month}</div>
              </div>
              <div className="cc-meeting-info">
                <div className="cc-meeting-title">{m.title}</div>
                <div className="cc-meeting-meta">{m.meta}</div>
              </div>
              <span className={`cc-badge ${m.badge}`}>{m.btext}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NEW EVENT MODAL */}
      {newEventOpen && (
        <div className="cc-modal-overlay open" onClick={() => setNewEventOpen(false)}>
          <div className="cc-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cc-modal-top">
              <div className="cc-modal-title">+ Novo Evento na Agenda</div>
              <button className="cc-modal-close" onClick={() => setNewEventOpen(false)}>✕</button>
            </div>
            <div className="cc-form-group">
              <div className="cc-form-label">Título do evento *</div>
              <input className="cc-form-input" placeholder="Ex: Reunião com DTI" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="cc-form-row cols-2">
              <div>
                <div className="cc-form-label">Data *</div>
                <input className="cc-form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <div className="cc-form-label">Horário *</div>
                <input className="cc-form-input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div className="cc-form-row cols-2">
              <div>
                <div className="cc-form-label">Local / Link</div>
                <input className="cc-form-input" placeholder="Sala / Zoom / Online" value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))} />
              </div>
              <div>
                <div className="cc-form-label">Tipo</div>
                <select className="cc-form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {['Reunião', 'Treinamento', 'Assembleia', 'Visita', 'Videoconferência', 'Outro'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="cc-form-group">
              <div className="cc-form-label">Descrição</div>
              <textarea className="cc-form-input" rows={3} placeholder="Pauta e obs..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div className="cc-modal-actions">
              <button className="cc-btn-primary" onClick={() => setNewEventOpen(false)}>Agendar evento</button>
              <button className="cc-btn-sm" onClick={() => setNewEventOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
