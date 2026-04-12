import React from "react";
import { PinSettings } from "@/modules/auth/components/PinSettings";
import { Shield, User, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-zinc-500">Gerencie sua segurança e preferências de conta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <aside className="space-y-1">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-500/10 text-teal-400 font-medium transition-all">
              <Shield size={18} /> Segurança & PIN
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900 transition-all font-medium">
              <User size={18} /> Perfil Profissional
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900 transition-all font-medium">
              <Bell size={18} /> Notificações
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900 transition-all font-medium">
              <Palette size={18} /> Aparência
            </button>
          </nav>
        </aside>

        <main className="md:col-span-2 space-y-8">
          <PinSettings />
          
          <section className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl opacity-50 cursor-not-allowed">
            <h3 className="text-lg font-bold text-white mb-1">Módulos Ativos</h3>
            <p className="text-xs text-zinc-500 mb-6">Módulos habilitados para sua conta (Módulo Administrativo).</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                <span className="text-sm font-medium">Auditoria Clínica</span>
                <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full font-bold uppercase">Ativo</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                <span className="text-sm font-medium">Financeiro Executivo</span>
                <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold uppercase">Plano Pro</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
