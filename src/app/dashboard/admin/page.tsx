"use client";

import React from "react";
import { AccessLinkGenerator } from "@/modules/admin/components/AccessLinkGenerator";
import { Shield, Users, ListFilter, Activity, ShieldCheck, Lock, Globe, Fingerprint, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPage() {
  return (
    <>
      <div className="space-y-16 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">GOVERNANCE MODULE</span>
            </div>
            <h1 className="font-heading text-6xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
              Central de <span className="text-gradient">Governança</span>
            </h1>
            <p className="text-on-surface-variant font-medium italic opacity-80 max-w-xl">
              Monitoramento de protocolos de acesso, auditoria de identidades e gestão de autoridade em tempo real.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-black text-zinc-500">
                  U{i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black">+4</div>
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Admin Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Main Governance Area */}
          <div className="xl:col-span-8 space-y-16">
            
            <section className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
              <AccessLinkGenerator />
            </section>
            
            <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10 relative overflow-hidden group animate-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={180} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-on-surface font-heading tracking-tight italic">
                      Colaboradores Ativos
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Fluxo de Identidade BioFlow</p>
                  </div>
                  <button className="px-5 py-2.5 bg-surface-container-highest/50 border border-outline-variant/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-on-surface hover:border-primary/30 transition-all flex items-center gap-2">
                    <ListFilter size={14} /> Refinar Auditoria
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Dra. Helena Silva", role: "Gestor Executivo", status: "ONLINE", lastSeen: "Agora", color: "text-emerald-500" },
                    { name: "Dr. Ricardo Santos", role: "Auditor Externo", status: "DORMANT", lastSeen: "Há 12h", color: "text-zinc-600" },
                    { name: "Sist. Alpha Core", role: "IA Observadora", status: "ACTIVE", lastSeen: "Tempo Real", color: "text-primary" },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/5 rounded-2xl transition-all group/item cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-surface-container-highest border border-outline-variant/10 flex items-center justify-center relative overflow-hidden group-hover/item:border-primary/20 transition-all">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                          <span className="text-sm font-black text-zinc-400 group-hover/item:text-primary transition-colors">{user.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div>
                          <p className="text-lg font-black text-on-surface font-heading tracking-tight italic">{user.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{user.role}</p>
                            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                            <p className="text-[10px] text-zinc-600 font-medium italic">Ref: CORE-ID-{784 + i}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="hidden md:block text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Última Atividade</p>
                          <p className="text-xs font-bold text-on-surface-variant">{user.lastSeen}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 min-w-[80px]">
                          <span className={cn("text-[9px] font-black tracking-[0.2em] transition-all", user.color)}>{user.status}</span>
                          <div className={cn("h-1 w-full rounded-full opacity-20", user.color.replace('text-', 'bg-'))}>
                             <div className={cn("h-full rounded-full transition-all duration-1000", user.color.replace('text-', 'bg-'))} style={{ width: user.status === 'ONLINE' || user.status === 'ACTIVE' ? '100%' : '15%' }}></div>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-zinc-700 group-hover/item:text-primary transition-all opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Security & Analytics Sidebar */}
          <aside className="xl:col-span-4 space-y-12 animate-in slide-in-from-right-4 duration-700 delay-300">
            
            <section className="bg-surface-container-low/50 backdrop-blur-md border border-primary/20 rounded-[2.5rem] p-10 relative overflow-hidden group">
              <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[80px]"></div>
              
              <h3 className="text-xl font-black text-primary mb-10 flex items-center gap-3 font-heading tracking-tight underline decoration-primary/20 decoration-2 underline-offset-8">
                <ShieldCheck size={28} strokeWidth={2.5} /> SEGURANÇA ELITE
              </h3>

              <div className="space-y-10 relative z-10">
                <div className="flex items-start gap-4 group/sec cursor-pointer">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20 transition-all group-hover/sec:scale-110 shadow-[0_0_15px_rgba(58,223,250,0.1)]">
                    <Fingerprint size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-on-surface uppercase tracking-widest mb-1.5">Protocolo Biométrico</h4>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic opacity-80 group-hover/sec:opacity-100 transition-opacity">Camada de autenticação de 2 fatores ativada para todos os gestores nível 9.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/sec cursor-pointer">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-2xl border border-secondary/20 transition-all group-hover/sec:scale-110 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
                    <Globe size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-on-surface uppercase tracking-widest mb-1.5">Geo-Fencing Ativo</h4>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic opacity-80 group-hover/sec:opacity-100 transition-opacity">Restrição de IP institucional configurada para 12 localizações autorizadas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group/sec cursor-pointer">
                  <div className="p-3 bg-on-surface/5 text-zinc-400 rounded-2xl border border-outline-variant/10 transition-all group-hover/sec:scale-110">
                    <Lock size={22} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-on-surface uppercase tracking-widest mb-1.5">Criptografia RSA-4096</h4>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic opacity-80 group-hover/sec:opacity-100 transition-opacity">Backup sincronizado para o núcleo frio (Cold Core) a cada 4 horas.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-10 bg-surface-container-highest/20 border border-outline-variant/10 rounded-[2.5rem] relative overflow-hidden">
               <div className="relative z-10">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Mantra Operacional</p>
                <p className="text-xs text-zinc-400 font-bold italic leading-relaxed uppercase tracking-widest">
                  "A governança é a arquitetura da confiança. No silêncio do código, a precisão fala mais alto que a autoridade."
                </p>
                <div className="h-[2px] w-12 bg-primary mt-8 rounded-full shadow-[0_0_10px_#3adffa]"></div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>
            </section>

            <div className="px-6">
              <button className="w-full flex items-center justify-between p-4 bg-error/5 hover:bg-error/10 border border-error/10 text-error rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <Shield size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Protocolo de Limpeza</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
