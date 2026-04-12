import React from "react";
import { AccessLinkGenerator } from "@/modules/admin/components/AccessLinkGenerator";
import { Shield, Users, ListFilter, Activity } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Painel de Auditoria & Acessos</h1>
        <p className="text-zinc-500">Controle permissões globais e gere acessos para terceiros com segurança.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <AccessLinkGenerator />
          
          <section className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-cyan-400" /> Colaboradores Ativos
              </h3>
              <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                <ListFilter size={14} /> Filtrar
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: "Dra. Helena Silva", role: "Gestor", status: "Online" },
                { name: "Dr. Ricardo Santos", role: "Auditor Externo", status: "Offline" },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-black">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-emerald-500' : 'bg-zinc-700'}`}></span>
                    <span className="text-[10px] text-zinc-500 font-bold">{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <section className="p-8 bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-3xl">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Shield size={20} /> Segurança Ativa
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Validação de PIN</p>
                  <p className="text-[10px] text-zinc-500">Módulos de Auditoria e Jurídico protegidos com PIN de 4 dígitos.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Links Efêmeros</p>
                  <p className="text-[10px] text-zinc-500">Acessos externos expiram automaticamente após 24 horas.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl text-center">
            <p className="text-sm text-zinc-500 mb-4 font-medium italic">"Segurança é a fundação da confiança médica."</p>
            <div className="h-1 w-12 bg-cyan-500 mx-auto rounded-full"></div>
          </section>
        </aside>
      </div>
    </div>
  );
}
