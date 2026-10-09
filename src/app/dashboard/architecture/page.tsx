"use client";

import React from "react";
import { Network, Database, Server, Cpu, Activity, Shield, HardDrive, Share2, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const systemNodes = [
  { name: "Node Alpha Core", status: "ESTÁVEL", cpu: "12%", ram: "4.2GB", uptime: "142d 08h", color: "text-emerald-500" },
  { name: "Node Bio-Sinc", status: "ESTÁVEL", cpu: "45%", ram: "18.1GB", uptime: "12d 22h", color: "text-rd-cyan" },
  { name: "Edge Jurídico-VA", status: "ESTÁVEL", cpu: "08%", ram: "1.2GB", uptime: "312d 14h", color: "text-zinc-500" },
  { name: "Gateway Global-X", status: "ALERTA", cpu: "92%", ram: "62.8GB", uptime: "04h 12m", color: "text-error" },
];

export default function ArchitecturePage() {
  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-rd-cyan/10 border border-rd-cyan/20 text-rd-cyan text-sm font-semibold uppercase tracking-widest rounded-full">SYSTEM ARCHITECTURE MODULE</span>
            </div>
            <h1 className="font-heading text-6xl font-semibold tracking-tighter text-on-surface leading-[0.9] ">
              Mapa de <span className="text-gradient-lilac">Estrutura</span>
            </h1>
            <p className="text-on-surface-variant font-medium opacity-80 max-w-xl">
              Visualização sistêmica da topologia VitalFlow, gerenciamento de nós e infraestrutura de autoridade distribuída.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-6 py-4 bg-surface-container-highest/50 hover:bg-surface-container-highest border border-outline-variant/10 rounded-2xl text-on-surface font-heading font-semibold text-sm transition-all group">
                <Terminal size={18} className="text-zinc-500 group-hover:text-rd-cyan transition-colors" />
                Root Terminal
             </button>
             <button className="btn-gradient-lilac px-8 py-4 rounded-2xl flex items-center gap-3 hover:shadow-rd-cyan/30 active:scale-95 transition-all text-sm font-heading font-semibold">
                <Network size={20} />
                Projetar Cluster
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Main Network Map View */}
          <div className="xl:col-span-8 space-y-10">
             
             {/* Visual Topology Mockup */}
             <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-lilac-low)_0%,_transparent_70%)] opacity-20 pointer-events-none"></div>
                
                {/* Visual Representation of Nodes */}
                <div className="relative w-full max-w-2xl h-[400px]">
                   {/* Central Core */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-rd-cyan/10 border-2 border-rd-cyan/30 flex items-center justify-center animate-pulse-slow shadow-[0_0_80px_var(--color-rd-cyan)] group-hover:shadow-[0_0_120px_var(--color-rd-cyan)] transition-all duration-1000">
                      <div className="text-center space-y-1">
                         <div className="flex justify-center mb-2"><Database size={42} className="text-rd-cyan"/></div>
                         <p className="text-sm font-semibold text-rd-cyan uppercase tracking-[0.3em]">ALPHA CORE</p>
                         <p className="text-sm text-zinc-500 font-medium">10.0.0.1</p>
                      </div>
                   </div>

                   {/* Orbital Nodes */}
                   {[0, 72, 144, 216, 288].map((angle, i) => (
                     <div key={i} 
                       className="absolute" 
                       style={{ 
                         top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 180}px)`, 
                         left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 180}px)`,
                         transform: 'translate(-50%, -50%)' 
                       }}
                     >
                        <div className="w-16 h-16 rounded-2xl bg-surface-container-highest/20 border border-outline-variant/10 hover:border-rd-cyan/40 hover:bg-rd-cyan/5 transition-all cursor-pointer flex items-center justify-center group/node">
                           <div className="w-1.5 h-1.5 bg-rd-cyan/40 rounded-full group-hover/node:scale-150 group-hover/node:bg-rd-cyan transition-all shadow-[0_0_10px_rgba(167,139,250,0)] group-hover/node:shadow-[0_0_15px_#a78bfa]"></div>
                        </div>
                     </div>
                   ))}

                   {/* Connecting Lines (Decorative) */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                      <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-rd-cyan/30 animate-spin-veryslow" />
                   </svg>
                </div>

                <div className="mt-8 flex gap-8">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                      <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Ativo/Seguro</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Sincronizando</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                      <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Latência Alta</span>
                   </div>
                </div>
             </section>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Throughput", value: "2.4 GB/s", icon: Activity, color: "text-rd-cyan" },
                  { label: "Requests/m", value: "142.8k", icon: Share2, color: "text-emerald-500" },
                  { label: "Active Nodes", value: "12/14", icon: Server, color: "text-amber-500" },
                  { label: "Sys Protection", value: "MAXIMA", icon: Shield, color: "text-rd-cyan" },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 p-6 rounded-[2rem] space-y-3 group hover:border-rd-cyan/20 transition-all">
                     <div className={cn("p-2 rounded-lg bg-surface-container-highest/50 w-fit transition-all group-hover:scale-110", stat.color)}>
                        <stat.icon size={18} />
                     </div>
                     <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest leading-none">{stat.label}</p>
                     <p className="font-heading text-xl font-semibold text-on-surface ">{stat.value}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Node Management Sidebar */}
          <aside className="xl:col-span-4 space-y-10">
             
             <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1 h-5 bg-rd-cyan rounded-full"></div>
                  <h3 className="font-heading text-xl font-semibold text-on-surface ">Status de Nós</h3>
                </div>

                <div className="space-y-6">
                   {systemNodes.map((node, j) => (
                     <div key={j} className="p-5 bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/5 rounded-2xl group/item transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                           <div className="space-y-1">
                              <h5 className="text-sm font-semibold text-on-surface group-hover/item:text-rd-cyan transition-colors">{node.name}</h5>
                              <div className="flex items-center gap-2">
                                 <span className={cn("text-sm font-semibold uppercase tracking-widest", node.color)}>{node.status}</span>
                                 <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                                 <span className="text-sm font-medium text-zinc-600 ">UP: {node.uptime}</span>
                              </div>
                           </div>
                           <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-zinc-600 group-hover/item:text-rd-cyan transition-all">
                              {node.status === 'ALERTA' ? <AlertCircle size={16} className="text-error animate-pulse"/> : <CheckCircle2 size={16}/>}
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <div className="flex justify-between items-center text-sm font-semibold text-zinc-500 uppercase"><span>CPU</span><span>{node.cpu}</span></div>
                              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                 <div className={cn("h-full rounded-full transition-all duration-1000", node.status === 'ALERTA' ? 'bg-error' : 'bg-rd-cyan')} style={{ width: node.cpu }}></div>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <div className="flex justify-between items-center text-sm font-semibold text-zinc-500 uppercase"><span>RAM</span><span>{node.ram}</span></div>
                              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                 <div className="h-full bg-zinc-500 rounded-full transition-all duration-1000" style={{ width: '40%' }}></div>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             <section className="bg-rd-cyan/5 border border-rd-cyan/20 rounded-[2.5rem] p-8 overflow-hidden relative group/cpu">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover/cpu:opacity-20 transition-opacity">
                   <Cpu size={140} />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-2">
                      <Cpu size={20} className="text-rd-cyan"/>
                      <h4 className="text-sm font-semibold text-on-surface uppercase tracking-[0.3em]">Hardware de Core</h4>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-semibold text-zinc-500">BIO-THREADING</span>
                         <span className="text-emerald-500 text-sm font-semibold uppercase">Otimizado</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-semibold text-zinc-500">COLD STORAGE</span>
                         <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">2.4PB</span>
                            <HardDrive size={12} className="text-zinc-600"/>
                         </div>
                      </div>
                   </div>
                   <button className="w-full py-4 bg-rd-cyan text-white text-sm font-semibold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_var(--color-rd-cyan)] active:scale-95 transition-all">Reboot Global Sync</button>
                </div>
             </section>

          </aside>
        </div>
      </div>
    </>
  );
}
