"use client";

import React from "react";
import { 
  Building2, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  LayoutDashboard,
  ArrowUpRight,
  Target,
  Users,
  Calendar,
  Layers,
  Search,
  ChevronRight
} from "lucide-react";
import { StatCard } from "@/modules/dashboard/components/StatCard";
import { cn } from "@/lib/utils";

export default function EnterpriseDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Executive Summary Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-full italic">Executive Control Center</span>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               Sincronizado Global
             </div>
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
            Hub <span className="text-gradient">MedCore Enterprise</span>
          </h1>
          <p className="text-on-surface-variant text-sm italic font-medium leading-relaxed max-w-2xl opacity-80">
            Visão consolidada de performance, compliance e throughput operacional de todas as unidades da rede em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <button className="bg-surface-container-high border border-outline-variant/30 px-5 py-3 rounded-xl flex items-center gap-3 hover:bg-surface-container-highest active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest italic group">
              <Calendar size={16} className="text-primary" />
              Relatório Consolidado Q2
           </button>
           <button className="btn-gradient px-5 py-3 rounded-xl flex items-center gap-3 hover:shadow-primary/30 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest italic group">
              Configurar Unidade
              <ArrowUpRight size={16} />
           </button>
        </div>
      </div>

      {/* Corporate KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Receita Consolidada" value="R$ 15.4M" icon={TrendingUp} trend={{ value: "18%", isPositive: true }} color="teal" />
        <StatCard label="Capacidade da Rede" value="84%" icon={Layers} trend={{ value: "4%", isPositive: false }} color="cyan" />
        <StatCard label="Atendimentos Global" value="28,401" icon={Users} trend={{ value: "12%", isPositive: true }} color="zinc" />
        <StatCard label="Taxa de Compliance" value="98.2%" icon={Target} trend={{ value: "1%", isPositive: true }} color="zinc" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Unit Matrix Monitoring */}
        <div className="xl:col-span-8 flex flex-col gap-8">
           <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[1.5rem] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-black text-on-surface italic tracking-tight">Matriz de Unidades Hospitalares</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">Status Operacional Individualizado</p>
                </div>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={12} />
                  <input 
                    type="text" 
                    placeholder="Filtrar unidade..." 
                    className="bg-surface-container border border-outline-variant/10 rounded-lg py-1.5 pl-8 pr-3 text-[9px] font-black uppercase tracking-widest text-on-surface focus:outline-none focus:border-primary/50 transition-all w-40"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/10">
                        <th className="py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Unidade</th>
                        <th className="py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">Ocupação</th>
                        <th className="py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">EBITDA</th>
                        <th className="py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">NPS</th>
                        <th className="py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest italic text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {[
                        { name: "São Lucas (Sede)", occ: "92%", rev: "+14%", nps: "4.8", status: "Crítico", color: "text-error" },
                        { name: "Metropolitano", occ: "78%", rev: "+8%", nps: "4.5", status: "Estável", color: "text-emerald-500" },
                        { name: "Centro de Trauma Alpha", occ: "96%", rev: "+22%", nps: "4.2", status: "Overload", color: "text-error" },
                        { name: "Unidade Norte", occ: "64%", rev: "-2%", nps: "4.9", status: "Operacional", color: "text-emerald-500" },
                        { name: "Hospital da Mulher", occ: "82%", rev: "+10%", nps: "4.7", status: "Estável", color: "text-emerald-500" },
                      ].map((unit, i) => (
                        <tr key={i} className="hover:bg-surface-container-highest/20 transition-colors cursor-pointer group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                <Building2 size={16} />
                              </div>
                              <span className="text-xs font-black text-on-surface">{unit.name}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", parseInt(unit.occ) > 90 ? "bg-error" : "bg-primary")} style={{ width: unit.occ }}></div>
                              </div>
                              <span className="text-[10px] font-black text-on-surface">{unit.occ}</span>
                            </div>
                          </td>
                          <td className="py-4 text-[10px] font-black text-emerald-500 tracking-tighter">{unit.rev}</td>
                          <td className="py-4 text-[10px] font-black text-on-surface">{unit.nps}</td>
                          <td className="py-4 text-right">
                             <span className={cn("text-[9px] font-black uppercase tracking-widest", unit.color)}>{unit.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
           </section>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[1.5rem] p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-primary rounded-full"></div>
                        <h3 className="font-heading text-base font-black text-on-surface italic">EBITDA Consolidado</h3>
                     </div>
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-80">+14.2% YoY</span>
                  </div>
                  <div className="h-44 w-full relative group">
                     <div className="absolute inset-0 flex items-end justify-between px-2 gap-1.5">
                        {[40, 55, 45, 70, 65, 85, 80, 95, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/5 rounded-t-lg relative overflow-hidden group/bar">
                             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/40 to-primary/10 transition-all duration-700 hover:opacity-100 opacity-60" style={{ height: `${h}%` }}></div>
                          </div>
                        ))}
                     </div>
                     <div className="absolute inset-0 border-b border-outline-variant/10"></div>
                  </div>
               </section>

               <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-outline-variant/10 rounded-[1.5rem] p-6 space-y-4 relative overflow-hidden group/risk">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/risk:opacity-10 transition-opacity">
                    <AlertTriangle size={80} />
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <Target size={20} className="text-primary" />
                    </div>
                    <h3 className="font-heading text-base font-black text-white italic tracking-tighter">Meta de Expansão 2026</h3>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed relative z-10">
                     Ocupação média da rede atingiu patamar crítico para expansão CAPEX aprovada.
                  </p>
                  <div className="space-y-2 pt-2 relative z-10">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400">
                       <span>CAPEX UTILIZED</span>
                       <span>94.2%</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '94.2%' }}></div>
                     </div>
                  </div>
               </section>
           </div>
        </div>

        {/* Global Feed & Risks */}
        <div className="xl:col-span-4 flex flex-col gap-8">
            <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[1.5rem] p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-heading text-base font-black text-on-surface italic">Health Heatmap (Rede)</h3>
                 <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Real-time</span>
               </div>
               <div className="grid grid-cols-5 gap-2 mb-6">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "aspect-square rounded-[4px] transition-all hover:scale-110 cursor-help",
                        i % 7 === 0 ? "bg-error animate-pulse" : i % 3 === 0 ? "bg-amber-500" : "bg-emerald-500/40"
                      )}
                      title={`Status Unit Group ${i}`}
                    ></div>
                  ))}
               </div>
               <div className="space-y-3">
                  {[
                    { type: 'Fiscal', msg: "Auditoria na unidade Sede.", status: 'HIGHT', color: 'text-error' },
                    { type: 'Operacional', msg: "Overload em Trauma Alpha (+12h).", status: 'CRITICAL', color: 'text-error' },
                  ].map((risk, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-highest/20 border border-outline-variant/5">
                       <span className="text-[9px] font-black text-on-surface italic truncate pr-4">"{risk.msg}"</span>
                       <span className={cn("text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-current", risk.color)}>{risk.status}</span>
                    </div>
                  ))}
               </div>
            </section>

            <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[1.5rem] p-6 space-y-4">
               <h3 className="font-heading text-base font-black text-on-surface italic">Live Feed <span className="text-zinc-500 text-[10px] ml-2 font-normal uppercase tracking-widest">Streaming...</span></h3>
               <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 group cursor-pointer">
                       <div className="relative">
                         <div className="w-7 h-7 rounded-lg bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Activity size={12} />
                         </div>
                         {i < 3 && <div className="absolute top-8 left-3.5 w-px h-4 bg-outline-variant/20"></div>}
                       </div>
                       <div className="flex-1">
                         <p className="text-[10px] font-black text-on-surface italic leading-snug">Expansão de leitos aprovada para Unidade Metropolitano.</p>
                         <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Há {i * 10} min</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
        </div>
      </div>
    </div>
  );
}
