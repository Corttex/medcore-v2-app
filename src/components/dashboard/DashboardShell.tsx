'use client'

import { Sidebar } from './Sidebar'


interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="cc-app min-h-screen bg-[#030712] text-white flex relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-cyan-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col relative z-10">
        {/* O DashboardHeader agora é provido pelas páginas individuais para maior flexibilidade */}
        <main className="flex-1 p-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </div>
    </div>
  )
}
