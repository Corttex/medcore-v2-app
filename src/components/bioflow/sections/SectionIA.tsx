'use client'

import { useState, useRef, useEffect } from 'react'

interface Message { role: 'bot' | 'user'; text: string; time: string }

const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

const BOT_REPLIES: Record<string, string> = {
  default: 'Analisei os dados disponíveis. Recomendo focar nos processos críticos (#PRO-0091 e #PRO-0090) com maior urgência. Posso elaborar um relatório executivo detalhado ou sugerir um plano de ação imediato.',
  resumo: 'Resumo executivo da semana: 7 demandas estratégicas tratadas, 4 pendências críticas identificadas, taxa de resolutividade de 78%. Os três alertas prioritários são: contrato DTI (vence 05/04), ANVISA-UTI (laudo pendente) e auditoria Q1 (assinatura pendente).',
  anvisa: 'O processo #PRO-0090 (ANVISA-UTI) está em estágio crítico. O laudo técnico ainda não foi entregue. Prazo: 10/04/2026. Recomendo contato imediato com o Dr. Rodrigo F. e escalada para a diretoria clínica hoje.',
  riscos: 'Matriz de riscos atual: 🔴 CRÍTICO: ANVISA (embargo), Contrato TI (descontinuidade). 🟡 ALTO: Auditoria Q1, Alvarás sanitários. 🟢 CONTROLADO: Treinamentos, operações rotineiras.',
  agenda: 'Próximos compromissos estratégicos: 07/04 — Comitê de Gestão (Auditório, 08:30h); 10/04 — Treinamento Prontuário (RH, 10:00h); 15/04 — Assembleia Geral (09:00h). Confirmar presença disponível?',
}

const CHIPS = [
  { label: 'Resumo executivo', key: 'resumo' },
  { label: 'Status ANVISA', key: 'anvisa' },
  { label: 'Matriz de riscos', key: 'riscos' },
  { label: 'Próxima reunião', key: 'agenda' },
]

const INIT_MSGS: Message[] = [
  { role: 'bot', text: 'Olá! Sou a CORE Intelligence, sua IA executiva. Tenho acesso completo ao painel da diretoria. Posso elaborar relatórios, analisar processos críticos, sugerir prioridades e resumir reuniões. Como posso ajudar?', time: now() },
]

interface Props { userInitials: string }

export default function SectionIA({ userInitials }: Props) {
  const [msgs, setMsgs] = useState<Message[]>(INIT_MSGS)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', text: text.trim(), time: now() }
    setMsgs(m => [...m, userMsg])
    setInput('')
    setTyping(true)

    const lower = text.toLowerCase()
    const key = Object.keys(BOT_REPLIES).find(k => k !== 'default' && lower.includes(k)) || 'default'
    setTimeout(() => {
      setTyping(false)
      setMsgs(m => [...m, { role: 'bot', text: BOT_REPLIES[key], time: now() }])
    }, 1200 + Math.random() * 800)
  }

  return (
    <div>
      {/* IA HEADER */}
      <div className="cc-ia-header">
        <div className="cc-ia-avatar">
          <span style={{ fontSize: 22 }}>🧠</span>
          <div className="cc-ia-pulse" />
        </div>
        <div>
          <div className="cc-ia-name">CORE Intelligence</div>
          <div className="cc-ia-desc">Inteligência Artificial Executiva — Análise preditiva, relatórios e suporte estratégico</div>
        </div>
        <div className="cc-ia-status">● Ativo</div>
      </div>

      {/* CHIPS */}
      <div className="cc-chips">
        {CHIPS.map(c => (
          <button key={c.key} className="cc-chip" onClick={() => send(c.label)}>{c.label}</button>
        ))}
      </div>

      {/* CHAT */}
      <div className="cc-chat-box">
        {msgs.map((m, i) => (
          <div key={i} className={`cc-msg ${m.role === 'bot' ? 'cc-msg-bot' : 'cc-msg-user'}`}>
            <div className={`cc-msg-av ${m.role === 'user' ? 'cc-msg-user-av' : ''}`}>
              {m.role === 'bot' ? '🧠' : userInitials}
            </div>
            <div style={{ flex: 1 }}>
              <div className="cc-msg-name">{m.role === 'bot' ? 'CORE Intelligence' : 'Você'}</div>
              <div className="cc-bubble">{m.text}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, fontFamily: 'var(--font-mono),monospace' }}>{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="cc-msg cc-msg-bot">
            <div className="cc-msg-av">🧠</div>
            <div>
              <div className="cc-msg-name">CORE Intelligence</div>
              <div className="cc-bubble">
                <div className="cc-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="cc-ia-input-row">
        <input
          className="cc-ia-input"
          placeholder="Digite sua pergunta estratégica..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          disabled={typing}
        />
        <button className="cc-ia-send" onClick={() => send(input)} disabled={typing || !input.trim()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 7, textAlign: 'center' }}>
        CORE Intelligence · Dados institucionais · Contexto da semana carregado
      </div>
    </div>
  )
}
