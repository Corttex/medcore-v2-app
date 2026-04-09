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
  { title: 'Meu Prontuário', href: '/bioflow', icon: ClipboardList, roles: ['individual_user'] },
  
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
    <aside aria-label="Navegação Lateral" className="fixed left-0 top-0 h-screen w-64 bg-[#030303]/90 backdrop-blur-3xl border-r border-white/5 flex flex-col p-4 z-50 transition-all duration-300 shadow-[2px_0_24px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(16,185,129,0.15)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 opacity-20 blur-md pointer-events-none" />
          <span className="text-white text-xs font-bold relative z-10 drop-shadow-md">⚕</span>
        </div>
        <span className="font-bold text-sm tracking-[0.15em] uppercase text-zinc-100">CONTE CORE</span>
      </div>

      <nav className="flex-1 space-y-1.5 px-1">
        <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 mb-4 px-2">Menu</div>
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 group overflow-hidden ${
                isActive 
                  ? 'bg-zinc-800/40 text-emerald-400 border border-emerald-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.2)]' 
                  : 'text-zinc-400 border border-transparent hover:bg-zinc-900/50 hover:text-zinc-200 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                <span className={`text-[13px] tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.title}</span>
              </div>
              {isActive && (
                <>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] rounded-l-full" />
                </>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center justify-between px-2 mb-4 group cursor-pointer hover:bg-white/5 rounded-md p-2 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 shadow-inner">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#030303] rounded-full" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-zinc-200 truncate">{profile?.full_name || 'Usuário'}</span>
              <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider truncate">{profile?.role || 'Visitante'}</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); signOut(); }}
            className="text-zinc-600 hover:text-red-400 transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
