'use client'

import { useState } from 'react'

const DEMANDAS = [
  { id: '#DEM-042', origem: 'Secretaria Saúde SP', assunto: 'Relatório epidemiológico mensal', resp: 'Dr. Alan S.', prazo: '08/04/26', status: 'Pendente', urgency: 'Alta' },
  { id: '#DEM-041', origem: 'Ministério da Saúde', assunto: 'Dados de internação UTI — fev/mar', resp: 'Dra. Lúcia F.', prazo: '15/04/26', status: 'Em andamento', urgency: 'Media' },
  { id: '#DEM-040', origem: 'Plano Amili Saúde', assunto: 'Auditoria de prontuários 2025', resp: 'Dr. Marcos T.', prazo: '20/04/26', status: 'Aguardando', urgency: 'Baixa' },
  { id: '#DEM-039', origem: 'ANVISA – SP', assunto: 'Notificação vigilância sanitária', resp: 'Dr. Rodrigo F.', prazo: '10/04/26', status: 'Bloqueado', urgency: 'Alta' },
  { id: '#DEM-038', origem: 'CRM-SP', assunto: 'Listagem de médicos em atividade', resp: 'RH', prazo: '30/04/26', status: 'Concluído', urgency: 'Media' },
]

const ST_BADGE: Record<string, string> = {
  Pendente: 'cc-badge-waiting', 'Em andamento': 'cc-badge-progress',
  Aguardando: 'cc-badge-medium', Bloqueado: 'cc-badge-high', Concluído: 'cc-badge-done',
}

export default function SectionDemandas() {
  const [newOpen, setNewOpen] = useState(false)

  return (
    <div>
      <div className="cc-card">
        <div className="cc-card-header">
          <div className="cc-card-title">📋 Demandas Externas</div>
          <button className="cc-btn-primary" style={{ fontSize: 11, padding: '7px 15px' }} onClick={() => setNewOpen(true)}>+ Registrar Demanda</button>
        </div>
        <div className="cc-card-body">
          <div className="cc-inline-note">
            ⚡ <span><strong>2 demandas</strong> com prazo vencendo em até 7 dias. Priorize #DEM-042 e #DEM-039.</span>
          </div>
          <div className="cc-table-wrap">
            <table className="cc-table">
              <thead>
                <tr><th>ID</th><th>Origem</th><th>Assunto</th><th>Resp.</th><th>Prazo</th><th>Urgência</th><th>Status</th></tr>
              </thead>
              <tbody>
                {DEMANDAS.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10, color: 'var(--lavender)', fontWeight: 700 }}>{d.id}</td>
                    <td style={{ fontSize: 12, fontWeight: 600 }}>{d.origem}</td>
                    <td style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.assunto}</td>
                    <td style={{ fontSize: 11 }}>{d.resp}</td>
                    <td style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10 }}>{d.prazo}</td>
                    <td><span className={`cc-badge ${d.urgency === 'Alta' ? 'cc-badge-high' : d.urgency === 'Media' ? 'cc-badge-medium' : 'cc-badge-done'}`}>{d.urgency}</span></td>
                    <td><span className={`cc-badge ${ST_BADGE[d.status]}`} style={{ fontSize: 10 }}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {newOpen && (
        <div className="cc-modal-overlay open" onClick={() => setNewOpen(false)}>
          <div className="cc-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cc-modal-top">
              <div className="cc-modal-title">+ Registrar Demanda Externa</div>
              <button className="cc-modal-close" onClick={() => setNewOpen(false)}>✕</button>
            </div>
            <div className="cc-form-group"><div className="cc-form-label">Órgão / Origem *</div><input className="cc-form-input" placeholder="Ex: Secretaria de Saúde SP" /></div>
            <div className="cc-form-group"><div className="cc-form-label">Assunto da demanda *</div><input className="cc-form-input" placeholder="Descreva brevemente..." /></div>
            <div className="cc-form-row cols-2">
              <div><div className="cc-form-label">Responsável</div><input className="cc-form-input" placeholder="Nome do resp." /></div>
              <div><div className="cc-form-label">Prazo *</div><input className="cc-form-input" type="date" /></div>
            </div>
            <div className="cc-form-group">
              <div className="cc-form-label">Urgência</div>
              <select className="cc-form-input">
                <option>Alta</option><option>Media</option><option>Baixa</option>
              </select>
            </div>
            <div className="cc-form-group"><div className="cc-form-label">Detalhes</div><textarea className="cc-form-input" rows={3} style={{ resize: 'vertical' }} /></div>
            <div className="cc-modal-actions">
              <button className="cc-btn-primary" onClick={() => setNewOpen(false)}>Registrar demanda</button>
              <button className="cc-btn-sm" onClick={() => setNewOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
