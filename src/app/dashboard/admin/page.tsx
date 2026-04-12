import React from "react";
import { AccessLinkGenerator } from "@/modules/admin/components/AccessLinkGenerator";
import { Shield, Users, ListFilter, Activity } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter font-heading">
          ADMIN <span className="text-zinc-600">STATION</span>
        </h1>
        <p className="text-zinc-500 font-medium italic">Central de auditoria, permissões globais e gestão de links efêmeros.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <AccessLinkGenerator />
          
          <section className="p-10 glass rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-zinc-900 group-hover:text-teal-500/10 transition-colors">
              <Users size={120} strokeWidth={4} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-white flex items-center gap-3 font-heading tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
                  COLABORADORES ATIVOS
                </h3>
                <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2">
                  <ListFilter size={14} /> Filtrar Lista
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Dra. Helena Silva", role: "Gestor", status: "Online" },
                  { name: "Dr. Ricardo Santos", role: "Auditor Externo", status: "Offline" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-teal-500/20 transition-all group/item">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-500 group-hover/item:border-teal-500/30 transition-all shadow-inner">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white font-heading">{user.name}</p>
                        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mt-1">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`}></span>
                      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">{user.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-10">
          <section className="p-10 glass-vibrant rounded-[2.5rem] border border-teal-500/20">
            <h3 className="text-lg font-black text-teal-400 mb-6 flex items-center gap-3 font-heading tracking-tight">
              <Shield size={24} strokeWidth={2.5} /> SEGURANÇA ATIVA
            </h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-teal-500/10 text-teal-500 rounded-2xl border border-teal-500/10 shadow-inner">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">Validação de PIN</p>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">Proteção de camadas sensíveis (Auditoria/Jurídico) com autenticação de 4 dígitos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-cyan-500/10 text-cyan-500 rounded-2xl border border-cyan-500/10 shadow-inner">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">Links Efêmeros</p>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">Geração de tokens de acesso externo com expiração automática em 24 horas.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="p-10 bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] text-center border-dashed">
            <p className="text-xs text-zinc-600 mb-6 font-bold italic leading-relaxed uppercase tracking-widest">"A operação deve ser invisível. A segurança deve ser absoluta."</p>
            <div className="h-1.5 w-16 bg-teal-500 mx-auto rounded-full shadow-[0_0_10px_rgba(45,212,191,0.3)]"></div>
          </section>
        </aside>
      </div>
    </div>
  );
}
