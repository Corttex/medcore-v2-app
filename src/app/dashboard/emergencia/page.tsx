"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertOctagon, 
  Activity, 
  Zap, 
  Users, 
  ArrowRight, 
  Bell, 
  Volume2, 
  ShieldAlert,
  Clock,
  MapPin,
  ChevronRight,
  Stethoscope,
  Heart
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function EmergencyPage() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Critical Alert Banner */}
      <div className="bg-error/10 border border-error/30 rounded-[1.5rem] p-6 relative overflow-hidden group">
        <div className={cn(
          "absolute top-0 right-0 p-10 transition-all duration-1000",
          pulse ? "opacity-20 scale-110" : "opacity-5 scale-100"
        )}>
          <AlertOctagon size={240} className="text-error" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-error/20 border border-error/40 flex items-center justify-center text-error relative shrink-0">
                <ShieldAlert size={24} className="animate-bounce" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full animate-ping"></div>
             </div>
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="px-2 py-0.5 bg-error/20 border border-error/30 text-error text-sm font-semibold uppercase tracking-[0.2em] rounded">
                   Status: Crítico
                 </span>
                 <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest animate-pulse">
                   Alerta em tempo real ativo
                 </span>
               </div>
               <h2 className="font-heading text-xl lg:text-2xl font-semibold text-on-surface tracking-tighter ">
                 Sobrecarga no <span className="text-error">Centro de Trauma Alpha</span>
               </h2>
               <p className="text-on-surface-variant text-[11px] mt-0.5 max-w-xl font-medium">
                 8 admissões pendentes. Capacidade operacional em 96%. Protocolo de triagem vermelha ativado.
               </p>
             </div>
           </div>
           <button className="bg-error text-white px-5 py-3 rounded-xl font-semibold font-heading text-sm tracking-widest uppercase hover:bg-error/90 active:scale-95 transition-all shadow-lg shadow-error/30 flex items-center gap-3">
             Ativar Protocolo de Emergência <ArrowRight size={16} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Real-time Monitor */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[1.5rem] p-6 space-y-6">
            <div className="flex items-baseline justify-between">
              <div>
                <h3 className="font-heading text-xl font-semibold text-on-surface ">Monitor de Capacidade</h3>
                <p className="text-sm text-zinc-500 font-medium uppercase tracking-[0.2em] mt-1">Sincronização 2.4ms</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-outline-variant/10 font-semibold text-sm text-zinc-400">
                  <Activity size={12} className="text-emerald-500" /> LIVE
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Ocupação Leitos", value: "96%", status: "Crítico", color: "text-error", bg: "bg-error" },
                { label: "Tempo de Espera", value: "48 min", status: "Elevado", color: "text-amber-500", bg: "bg-amber-500" },
                { label: "Vans em Trânsito", value: "04", status: "Estável", color: "text-emerald-500", bg: "bg-emerald-500" }
              ].map((stat, i) => (
                <div key={i} className="bg-surface p-5 rounded-3xl border border-outline-variant/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                    <span className={cn("text-sm font-semibold uppercase tracking-tighter px-1.5 py-0.5 rounded border border-current opacity-70", stat.color)}>
                      {stat.status}
                    </span>
                  </div>
                  <h4 className={cn("text-2xl font-semibold font-heading tracking-tighter", stat.color)}>{stat.value}</h4>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", stat.bg)} style={{ width: stat.value.includes('%') ? stat.value : '60%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[1.5rem] p-6 space-y-8">
             <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-error rounded-full"></div>
                <h3 className="font-heading text-lg font-semibold text-on-surface ">Fila de Triagem Inteligente</h3>
             </div>

             <div className="space-y-4">
                {[
                  { id: "PX-2841", priority: "Imediata", wait: "2m", area: "Trauma", status: "Em Atendimento", color: "text-error" },
                  { id: "PX-2842", priority: "Urgente", wait: "12m", area: "Cardio", status: "Triado", color: "text-amber-500" },
                  { id: "PX-2843", priority: "Emergência", wait: "5m", area: "Neuro", status: "Em Trânsito", color: "text-error" },
                  { id: "PX-2844", priority: "Urgente", wait: "22m", area: "Geral", status: "Aguardando", color: "text-emerald-500" }
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/10 hover:border-rd-cyan/20 transition-all group">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-zinc-500 group-hover:text-rd-cyan transition-colors font-semibold text-sm">
                          {row.id.split('-')[1]}
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-on-surface">{row.id}</p>
                          <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{row.area}</p>
                        </div>
                     </div>
                     <div className="hidden md:flex items-center gap-8">
                        <div className="text-center w-16">
                          <p className="text-sm text-zinc-600 font-semibold uppercase tracking-widest mb-0.5">Prioridade</p>
                          <p className={cn("text-xs font-semibold uppercase tracking-tighter", row.color)}>{row.priority}</p>
                        </div>
                        <div className="text-center w-16">
                          <p className="text-sm text-zinc-600 font-semibold uppercase tracking-widest mb-0.5">Espera</p>
                          <p className="text-xs font-semibold text-on-surface">{row.wait}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500 font-medium">{row.status}</span>
                        <button className="p-1.5 text-zinc-700 hover:text-rd-cyan transition-colors">
                          <ChevronRight size={16} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Actions & Feed */}
        <div className="xl:col-span-4 space-y-8">
           <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-heading text-lg font-semibold text-on-surface ">Equipe de Plantão</h3>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm font-semibold uppercase tracking-widest rounded">14 Ativos</span>
              </div>
              
              <div className="space-y-5">
                {[
                  { name: "Dr. Thorne", role: "Coordenação", status: "Disponível", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" },
                  { name: "Dra. Helena", role: "Neurocirurgia", status: "Em Cirurgia", statusColor: "text-amber-500", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop" },
                  { name: "Dr. Marcos", role: "Traumatologia", status: "Disponível", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop" }
                ].map((staff, i) => (
                  <div key={staff.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <img src={staff.img} alt={staff.name} className="w-10 h-10 rounded-xl object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                      <div>
                        <p className="text-xs font-semibold text-on-surface">{staff.name}</p>
                        <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest">{staff.role}</p>
                      </div>
                    </div>
                    <span className={cn("text-xs font-semibold ", staff.statusColor || "text-emerald-500")}>
                      {staff.status}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-4 rounded-2xl bg-surface-container-highest/50 border border-outline-variant/10 text-sm font-semibold text-on-surface uppercase tracking-[0.2em] hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                 <Users size={14} /> Gerenciar Escala
              </button>
           </section>

           <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-5 bg-primary rounded-full"></div>
                 <h3 className="font-heading text-lg font-semibold text-on-surface ">Ações Rápidas</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { icon: Bell, label: "Acionar BIP", color: "text-zinc-500" },
                   { icon: Volume2, label: "Anúncio Geral", color: "text-zinc-500" },
                   { icon: MapPin, label: "Mapear Leitos", color: "text-zinc-500" },
                   { icon: Stethoscope, label: "Log Reserva", color: "text-rd-cyan" }
                 ].map((action, i) => (
                    <button key={i} className="p-4 bg-surface rounded-2xl border border-outline-variant/10 hover:border-rd-cyan/20 transition-all text-center space-y-1 group">
                       <action.icon size={18} className={cn("mx-auto transition-transform group-hover:scale-110", action.color)} />
                       <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest group-hover:text-on-surface transition-colors">{action.label}</p>
                    </button>
                 ))}
              </div>
           </section>

           <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-outline-variant/10 rounded-[2.5rem] p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Heart size={24} className="animate-pulse text-error" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-white tracking-tighter">Protocolo VitalFlow AI</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                A IA está monitorando os sinais vitais de 42 pacientes simultaneamente. Nenhuma anomalia crítica detectada nos últimos 15 min.
              </p>
           </section>
        </div>
      </div>
    </div>
  );
}
