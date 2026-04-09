import { Bell, Search, Command } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="h-[60px] border-b border-[#ffffff0a] bg-[#030303]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-[#ffffff05] hover:bg-[#ffffff0a] transition-colors border border-[#ffffff0a] px-3 py-1.5 rounded-md text-zinc-500 w-[280px] shadow-inner cursor-text" role="search" aria-label="Busca Global">
          <Search size={14} className="text-zinc-600" />
          <span className="text-[13px] flex-1 font-medium tracking-wide">Buscar fluxos...</span>
          <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-[4px] border border-white/5 text-[10px] text-zinc-400 font-mono shadow-sm">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-zinc-500 hover:text-zinc-300 transition-colors duration-200" aria-label="Notificações">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#030303] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        </button>
        
        <div className="hidden sm:flex flex-col items-end border-l border-white/10 pl-5">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">SLA Global</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
            <p className="text-xs font-semibold text-emerald-400 font-mono">99.98%</p>
          </div>
        </div>
      </div>
    </header>
  )
}
