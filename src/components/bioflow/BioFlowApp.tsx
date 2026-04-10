'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import SectionDashboard from './sections/SectionDashboard'
import SectionAgenda from './sections/SectionAgenda'
import SectionReunioes from './sections/SectionReunioes'
import SectionDocumentos from './sections/SectionDocumentos'
import SectionProcessos from './sections/SectionProcessos'
import SectionDemandas from './sections/SectionDemandas'
import SectionNotificacoes from './sections/SectionNotificacoes'
import SectionIA from './sections/SectionIA'
import SectionArquitetura from './sections/SectionArquitetura'

type Section = 'dashboard' | 'agenda' | 'reunioes' | 'documentos' | 'processos' | 'demandas' | 'notificacoes' | 'ia' | 'arquitetura'

const PAGE_TITLES: Record<Section, { title: string; sub: string }> = {
  dashboard:     { title: 'Visão Executiva',    sub: 'Painel da Diretoria' },
  agenda:        { title: 'Agenda',             sub: 'Compromissos e eventos' },
  reunioes:      { title: 'Reuniões',           sub: 'Atas e próximas reuniões' },
  documentos:    { title: 'Documentos',         sub: 'Gestão documental' },
  processos:     { title: 'Processos',          sub: 'Acompanhamento estratégico' },
  demandas:      { title: 'Demandas Externas',  sub: 'Órgãos e convênios' },
  notificacoes:  { title: 'Notificações',       sub: 'Central de alertas' },
  ia:            { title: 'IA Executiva',       sub: 'CORE Intelligence' },
  arquitetura:   { title: 'Arquitetura',        sub: 'Stack e segurança' },
}

const QUOTES = [
  { text: '"Liderar é criar um ambiente onde as pessoas podem fazer o melhor trabalho de suas vidas."', author: '— Daniel Pink' },
  { text: '"A eficiência é fazer as coisas certo; a eficácia é fazer as coisas certas."', author: '— Peter Drucker' },
  { text: '"Gestão é a arte de transformar decisões em resultados."', author: '— CONTE CORE' },
]

export default function BioFlowApp() {
  const { profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [section, setSection] = useState<Section>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  const [unread] = useState(5)

  const getInitials = () => {
    const name = profile?.full_name || profile?.email || '?'
    return name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || '??'
  }

  const getUserName = () => profile?.full_name || profile?.email?.split('@')[0] || 'Usuário'

  const getUserRole = () => {
    const roles: Record<string, string> = {
      individual_user: 'Acesso Individual',
      super_admin: 'Super Admin',
      company_admin: 'Gestor Empresarial',
      employee: 'Colaborador',
    }
    return roles[profile?.role || ''] || 'Usuário'
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navigate = useCallback((s: Section) => {
    setSection(s)
    setMobileOpen(false)
    setProfileOpen(false)
  }, [])

  // Close profile on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const el = document.getElementById('cc-profile-drop')
      const btn = document.getElementById('cc-avatar-btn')
      if (el && !el.contains(e.target as Node) && !btn?.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const navItems: { id: Section; label: string; badge?: string | number; icon: string }[] = [
    { id: 'dashboard',    label: 'Visão Executiva',   icon: 'grid'   },
    { id: 'agenda',       label: 'Agenda',            badge: 3, icon: 'calendar' },
    { id: 'reunioes',     label: 'Reuniões',          icon: 'users'  },
    { id: 'documentos',   label: 'Documentos',        icon: 'folder' },
    { id: 'processos',    label: 'Processos',         badge: 7, icon: 'settings' },
    { id: 'demandas',     label: 'Demandas Externas', icon: 'clipboard' },
    { id: 'notificacoes', label: 'Notificações',      badge: unread, icon: 'bell' },
    { id: 'ia',           label: 'IA Executiva',      badge: 'IA', icon: 'cpu' },
    { id: 'arquitetura',  label: 'Arquitetura',       icon: 'home'   },
  ]

  const SVG_ICONS: Record<string, React.ReactNode> = {
    grid: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    calendar: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    users: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    folder: <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    settings: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    clipboard: <svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
    bell: <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    cpu: <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 15h0M16 15h0"/></svg>,
    home: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    logout: <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    notif: <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  }

  const renderSection = () => {
    const props = { onNavigate: navigate }
    switch (section) {
      case 'dashboard':    return <SectionDashboard {...props} quote={quote} />
      case 'agenda':       return <SectionAgenda />
      case 'reunioes':     return <SectionReunioes />
      case 'documentos':   return <SectionDocumentos />
      case 'processos':    return <SectionProcessos />
      case 'demandas':     return <SectionDemandas />
      case 'notificacoes': return <SectionNotificacoes />
      case 'ia':           return <SectionIA userInitials={getInitials()} />
      case 'arquitetura':  return <SectionArquitetura />
      default:             return null
    }
  }

  const navSections = [
    { label: 'Principal', items: navItems.slice(0, 4) },
    { label: 'Gestão',    items: navItems.slice(4, 7) },
    { label: 'Inteligência', items: navItems.slice(7, 8) },
    { label: 'Sistema',   items: navItems.slice(8) },
  ]

  return (
    <div className="cc-app">
      {/* Mobile overlay */}
      {mobileOpen && <div className="cc-overlay active" onClick={() => setMobileOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`cc-sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="cc-logo-wrap">
          <div className="cc-logo">
            <div className="cc-logo-icon">⚕</div>
            <div className="cc-logo-text">
              <div className="cc-logo-name">CONTE CORE</div>
              <div className="cc-logo-sub">Gestão Hospitalar</div>
            </div>
          </div>
          <button className="cc-toggle-btn" onClick={() => setCollapsed(c => !c)} title="Recolher">
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className="cc-nav">
          {navSections.map(({ label, items }) => (
            <div key={label}>
              <div className="cc-nav-label">{label}</div>
              {items.map(item => (
                <button
                  key={item.id}
                  className={`cc-nav-item${section === item.id ? ' active' : ''}`}
                  onClick={() => navigate(item.id)}
                >
                  <span className="cc-nav-icon">{SVG_ICONS[item.icon]}</span>
                  <span className="cc-nav-text">{item.label}</span>
                  {item.badge && (
                    <span className="cc-nav-badge" style={item.badge === 'IA' ? { background: 'linear-gradient(90deg,#7C3AED,#A855F7)' } : {}}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="cc-sidebar-footer">
          <div className="cc-user-card" onClick={() => { setProfileOpen(p => !p) }}>
            <div className="cc-avatar">{getInitials()}</div>
            <div className="cc-user-info">
              <div className="cc-user-name">{getUserName()}</div>
              <div className="cc-user-role">{getUserRole()}</div>
            </div>
            <button className="cc-logout-btn" onClick={e => { e.stopPropagation(); handleLogout() }} title="Sair">⏻</button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={`cc-main${collapsed ? ' collapsed' : ''}`}>
        {/* TOPBAR */}
        <div className="cc-topbar">
          <button id="cc-hamburger" onClick={() => setMobileOpen(true)}>☰</button>
          <div className="cc-page-title">
            {PAGE_TITLES[section].title}
            <span>{PAGE_TITLES[section].sub}</span>
          </div>
          <div className="cc-topbar-actions">
            <input className="cc-search" placeholder="🔍 Buscar..." />
            <button
              className={`cc-vd-btn`}
              onClick={() => navigate('dashboard')}
            >
              <span style={{ display: 'flex', width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor', position: 'relative' }}>
                <span style={{ position: 'absolute', inset: 2, borderRadius: '50%', background: 'currentColor' }} />
              </span>
              <span className="btn-label"> Visão Diretoria</span>
            </button>
            <button className="cc-icon-btn" onClick={() => navigate('notificacoes')}>
              {SVG_ICONS.notif}
              {unread > 0 && <div className="cc-notif-dot" />}
            </button>
            <button className="cc-icon-btn" id="cc-avatar-btn" onClick={() => setProfileOpen(p => !p)}>
              <div className="cc-avatar" style={{ width: 28, height: 28, fontSize: 10, border: 'none' }}>{getInitials()}</div>
            </button>
          </div>
        </div>

        {/* PROFILE DROPDOWN */}
        <div id="cc-profile-drop" className={`cc-profile-drop${profileOpen ? ' open' : ''}`}>
          <div className="cc-pd-header">
            <div className="cc-pd-name">{getUserName()}</div>
            <div className="cc-pd-role">{getUserRole()}</div>
          </div>
          <button className="cc-pd-item" onClick={() => navigate('ia')}>🤖 IA Executiva</button>
          <button className="cc-pd-item" onClick={() => navigate('arquitetura')}>🏗 Arquitetura</button>
          <div className="cc-pd-divider" />
          <button className="cc-pd-item" style={{ color: 'var(--danger)' }} onClick={handleLogout}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair do sistema
            </span>
          </button>
        </div>

        {/* CONTENT */}
        <div className="cc-content">
          <div className="cc-section" key={section}>
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  )
}
