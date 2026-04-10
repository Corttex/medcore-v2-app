'use client'

import { useState } from 'react'

const DOCS = [
  { name: 'Relatório Q1-2026', ext: 'PDF', size: '2.3 MB', date: '02/04/26', type: 'Financeiro' },
  { name: 'Ata Diretoria 02-04', ext: 'DOCX', size: '890 KB', date: '02/04/26', type: 'Ata' },
  { name: 'Alvará Sanitário 2026', ext: 'PDF', size: '1.1 MB', date: '01/04/26', type: 'Regulatório' },
  { name: 'Contrato DTI 2026', ext: 'PDF', size: '3.4 MB', date: '28/03/26', type: 'Contrato' },
  { name: 'Laudo ANVISA-UTI', ext: 'PDF', size: '5.2 MB', date: '20/03/26', type: 'Regulatório' },
  { name: 'Plano de Treinamento RH', ext: 'PPTX', size: '12.0 MB', date: '15/03/26', type: 'RH' },
]

const EXT_COLOR: Record<string, string> = { PDF: 'var(--danger)', DOCX: 'var(--info)', PPTX: 'var(--warning)', XLSX: 'var(--success)' }

export default function SectionDocumentos() {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('Todos')
  const types = ['Todos', 'Financeiro', 'Ata', 'Regulatório', 'Contrato', 'RH']

  const visible = DOCS.filter(d =>
    (typeFilter === 'Todos' || d.type === typeFilter) &&
    d.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <div className="cc-card" style={{ marginBottom: 16 }}>
        <div className="cc-card-body">
          <div className="cc-upload-zone">
            <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Arraste arquivos aqui</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>PDF, DOCX, XLSX, PPTX — máx 50MB</div>
            <button className="cc-btn-primary" style={{ fontSize: 11, padding: '7px 18px' }}>Selecionar arquivo</button>
          </div>
        </div>
      </div>

      <div className="cc-card">
        <div className="cc-card-header">
          <div className="cc-card-title">📁 Documentos</div>
          <input className="cc-search" style={{ width: 200 }} placeholder="🔍 Buscar..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="cc-card-body">
          <div className="cc-filter-bar">
            {types.map(t => (
              <button key={t} className={`cc-pill${typeFilter === t ? ' active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
          <div className="cc-doc-grid">
            {visible.map((d, i) => (
              <div key={i} className="cc-doc-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${EXT_COLOR[d.ext] || 'var(--lavender)'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 3, alignItems: 'center' }}>
                      <span style={{ background: `${EXT_COLOR[d.ext] || 'var(--lavender)'}22`, color: EXT_COLOR[d.ext] || 'var(--lavender)', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4 }}>{d.ext}</span>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>{d.size}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono),monospace' }}>{d.date}</span>
                  <button className="cc-btn-sm" style={{ padding: '3px 9px', fontSize: 10 }}>⬇ Baixar</button>
                </div>
              </div>
            ))}
          </div>
          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 12 }}>Nenhum documento encontrado</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
