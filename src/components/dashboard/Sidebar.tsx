'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Stethoscope, 
  ClipboardList,
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: string[]
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['super_admin'] },
  { title: 'Dashboard', href: '/management', icon: LayoutDashboard, roles: ['company_admin'] },
  { title: 'Atendimento', href: '/workspace', icon: Stethoscope, roles: ['employee'] },
  { title: 'Dashboard', href: '/dashboard', icon: ClipboardList, roles: ['individual_user'] },
  
  { title: 'Empresas', href: '/admin/companies', icon: Building2, roles: ['super_admin'] },
  { title: 'Equipe', href: '/management/team', icon: Users, roles: ['company_admin'] },
  { title: 'Pagamentos', href: '/management/billing', icon: CreditCard, roles: ['company_admin', 'super_admin'] },
  { title: 'Configurações', href: '/settings', icon: Settings, roles: ['super_admin', 'company_admin', 'employee', 'individual_user'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  const filteredItems = navItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  )

  return (
    <aside aria-label="Navegação Lateral" className="fixed left-0 top-0 h-screen w-64 bg-[#020617]/90 backdrop-blur-3xl border-r border-white/5 flex flex-col p-4 z-50 transition-all duration-300 shadow-[4px_0_32px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] overflow-hidden">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <path d="M22 12H18L15 21L9 3L6 12H2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <span className="font-black text-[15px] tracking-tight text-white uppercase italic">MED<span className="text-teal-400">CORE</span></span>
      </div>

      <nav className="flex-1 space-y-1.5 px-1">
        <div className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-700 mb-6 px-3">Gestão Central</div>
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_8px_16px_rgba(0,0,0,0.2)]' 
                  : 'text-slate-500 border border-transparent hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-300 ${isActive ? 'text-teal-400' : 'text-slate-600 group-hover:text-slate-300'}`} />
                <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.title}</span>
              </div>
              {isActive && (
                <div className="absolute left-[-16px] top-3 bottom-3 w-1.5 bg-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.8)] rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center justify-between px-2 mb-4 group cursor-pointer hover:bg-white/5 rounded-2xl p-3 transition-all">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-[13px] font-bold text-slate-300 shadow-inner">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-teal-500 border-2 border-[#020617] rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-200 truncate">{profile?.full_name || 'Usuário'}</span>
              <span className="text-[10px] font-extrabold text-teal-500 uppercase tracking-widest truncate">{profile?.role || 'Acesso'}</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); signOut(); }}
            className="text-slate-600 hover:text-red-400 transition-all p-2 hover:bg-red-400/10 rounded-xl"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

    </aside>
  )
}
