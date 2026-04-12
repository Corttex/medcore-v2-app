"use client";

import React from "react";
import { Layers, Activity, Zap, CheckCircle2, AlertTriangle, ArrowRight, Settings, Plus, Search, Filter } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const processes = [
  { id: "PX-784", name: "Triagem Técnica - Unid. Sul", stage: "Mapeamento", progress: 85, priority: "ALTA", status: "OTIMIZADO", color: "text-primary" },
  { id: "PX-201", name: "Sincronização de Insumos", stage: "Sintetização", progress: 42, priority: "CRÍTICA", status: "GARGALO", color: "text-error" },
  { id: "PX-442", name: "Fluxo de Alta Hospitalar", stage: "Execução", progress: 100, priority: "MÉDIA", status: "CONCLUÍDO", color: "text-emerald-500" },
  { id: "PX-099", name: "Auditoria de Bio-Arquitetura", stage: "Mapeamento", progress: 15, priority: "ALTA", status: "AGUARDANDO", color: "text-zinc-500" },
];

export default function ProcessesPage() {
  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">OPERATIONAL MODULE</span>
            </div>
            <h1 className="font-heading text-6xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
              Fluxos de <span className="text-gradient">Processo</span>
            </h1>
            <p className="text-on-surface-variant font-medium italic opacity-80 max-w-xl">
              Engenharia de fluxos clínicos e otimização de protocolos operacionais no núcleo BioFlow.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-surface-container-highest/50 px-5 py-3 rounded-2xl border border-outline-variant/10 focus-within:border-primary/40 transition-all flex items-center group">
                <Search size={18} className="text-zinc-600 group-focus-within:text-primary transition-colors" />
                <input placeholder="Rastrear ID de processo..." className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-64 text-on-surface" />
             </div>
             <button className="btn-gradient px-8 py-4 rounded-2xl flex items-center gap-3 hover:shadow-primary/30 active:scale-95 transition-all text-sm font-heading font-black">
                <Plus size={20} />
                Projetar Fluxo
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Active Workflows Area */}
          <div className="xl:col-span-8 space-y-10">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-1 h-5 bg-primary rounded-full"></div>
                   <h3 className="font-heading text-xl font-black text-on-surface italic">Workflows Ativos</h3>
                </div>
                <div className="flex gap-2">
                   {['Tudo', 'Ativos', 'Gargalos', 'Concluídos'].map((f, i) => (
                     <button key={i} className={cn("px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all rounded-lg", 
                       i === 0 ? "bg-primary/20 text-primary border-primary/30" : "bg-transparent text-zinc-500 border-outline-variant/10 hover:border-zinc-700")}>
                       {f}
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                {processes.map((proc, i) => (
                  <div key={i} className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/5 hover:border-primary/20 rounded-[2.5rem] p-8 group transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Layers size={140} />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                       <div className="lg:col-span-4 space-y-2">
                          <div className="flex items-center gap-3">
                             <div className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", 
                               proc.priority === 'CRÍTICA' ? 'bg-error/20 text-error border border-error/20' : 'bg-primary/10 text-primary border border-primary/20'
                             )}>
                                {proc.priority}
                             </div>
                             <span className="text-[10px] text-zinc-500 font-bold tracking-widest">ID: {proc.id}</span>
                          </div>
                          <h4 className="font-heading font-black text-on-surface text-xl leading-tight group-hover:text-primary transition-colors">{proc.name}</h4>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Estágio: <span className="text-on-surface-variant italic">{proc.stage}</span></p>
                       </div>

                       <div className="lg:col-span-4 space-y-3">
                          <div className="flex justify-between items-end">
                             <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Progressão de Fluxo</label>
                             <span className="font-heading font-black text-sm text-on-surface">{proc.progress}%</span>
                          </div>
                          <div className="h-2 bg-surface-container-highest/50 rounded-full overflow-hidden">
                             <div 
                               className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
                                 proc.progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                               )} 
                               style={{ width: `${proc.progress}%` }}
                             ></div>
                          </div>
                       </div>

                       <div className="lg:col-span-4 flex items-center justify-end gap-6">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status IA</p>
                             <p className={cn("text-xs font-black uppercase tracking-tighter italic", proc.color)}>{proc.status}</p>
                          </div>
                          <div className="h-10 w-[1px] bg-white/5 mx-2"></div>
                          <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-container-highest/50 border border-outline-variant/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                             <ArrowRight size={20} className="text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Sidebar Area */}
          <aside className="xl:col-span-4 space-y-10">
             <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10 overflow-hidden relative group">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  <h3 className="font-heading text-xl font-black text-on-surface italic">Métricas de Vazão</h3>
                </div>

                <div className="space-y-10">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Latência de Decisão</span>
                         <span className="text-sm font-black text-primary">0.8s</span>
                      </div>
                      <div className="h-1.5 bg-surface-container-highest/30 rounded-full">
                         <div className="h-full w-[85%] bg-primary rounded-full shadow-[0_0_8px_#3adffa]"></div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Capacidade do Hub</span>
                         <span className="text-sm font-black text-emerald-500">Normal</span>
                      </div>
                      <div className="h-1.5 bg-surface-container-highest/30 rounded-full">
                         <div className="h-full w-[42%] bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Erros de Protocolo</span>
                         <span className="text-sm font-black text-zinc-500">0.02%</span>
                      </div>
                      <div className="h-1.5 bg-surface-container-highest/30 rounded-full">
                         <div className="h-full w-[5%] bg-zinc-600 rounded-full"></div>
                      </div>
                   </div>
                </div>

                <div className="mt-12 p-8 bg-error/5 rounded-[2rem] border border-error/10 relative overflow-hidden group/alert cursor-pointer hover:bg-error/10 transition-all">
                   <div className="relative z-10 flex items-start gap-4">
                      <div className="p-3 bg-error/20 text-error rounded-xl animate-pulse">
                         <AlertTriangle size={20} />
                      </div>
                      <div>
                         <h5 className="text-[10px] font-black text-error uppercase tracking-[0.2em] mb-1">Gargalo de Produção</h5>
                         <p className="text-[10px] text-zinc-500 font-medium italic leading-relaxed">
                            A unidade de Sincronização de Insumos (PX-201) está operando com latência crítica de +15min.
                         </p>
                      </div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-error/5 to-transparent"></div>
                </div>
             </section>

             <div className="px-6 flex gap-4">
                <button className="flex-1 flex items-center justify-center p-4 bg-surface-container-low border border-outline-variant/10 text-on-surface rounded-2xl hover:bg-surface-container-highest transition-all group">
                   <Settings size={18} className="group-hover:text-primary transition-colors" />
                </button>
                <button className="flex-grow-[3] flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant/10 text-on-surface rounded-2xl hover:bg-surface-container-highest transition-all px-8">
                   <span className="text-[10px] font-black uppercase tracking-widest">Auditar Histórico</span>
                   <CheckCircle2 size={16} className="text-zinc-600" />
                </button>
             </div>
          </aside>
        </div>
      </div>
    </>
  );
}
