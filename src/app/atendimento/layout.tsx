import React from "react";
import Link from "next/link";
import { Stethoscope, LogOut } from "lucide-react";

export default function AtendimentoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Navbar Minimalista */}
      <nav className="h-16 bg-surface border-b border-outline-variant/30 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rd-cyan to-blue-600 p-0.5">
            <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
              <Stethoscope size={20} className="text-rd-cyan" />
            </div>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-on-surface">Med<span className="text-gradient-brand">Core</span> Médico</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
            Voltar à Recepção
          </Link>
          <button className="flex items-center gap-2 text-sm font-semibold text-error/80 hover:text-error transition-colors px-3 py-1.5 rounded-lg hover:bg-error/10">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col relative">
        {children}
      </main>
    </div>
  );
}
