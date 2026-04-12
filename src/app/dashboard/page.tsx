"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  Target, 
  Zap,
  Activity,
  AlertTriangle,
  ChevronRight,
  ClipboardCheck,
  Building2,
  FileText,
  AlertOctagon,
  Brain,
  Users
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/modules/dashboard/components/StatCard";
import { PinGate } from "@/modules/auth/components/PinGate";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const [showProtected, setShowProtected] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);

  return (
    <>
      {showProtected && (
        <PinGate 
          onSuccess={() => {
            setPinVerified(true);
            setShowProtected(false);
          }}
          onCancel={() => setShowProtected(false)}
          title="Relatório de Visão BioFlow"
        />
      )}

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">CORE VISION V2.0</span>
             <div className="flex items-center gap-1.5 ml-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
               <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">Stream de IA ATIVO</span>
             </div>
          </div>
          <h1 className="font-heading text-6xl lg:text-7xl font-black tracking-tighter text-on-surface leading-[0.9] italic">
            BioFlow <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-on-surface-variant text-base lg:text-lg italic font-medium leading-relaxed max-w-2xl opacity-80">
            "O Observador Clínico não se limita a registrar dados; ele decifra a narrativa silenciosa da biologia humana para orquestrar uma precisão que salva vidas."
          </p>
          <div className="flex items-center gap-2 pt-2 group cursor-pointer w-fit">
            <div className="w-6 h-[2px] bg-primary group-hover:w-10 transition-all"></div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Protocolo de Inteligência Core</span>
          </div>
        </div>

        <button 
          onClick={() => setShowProtected(true)}
          className="btn-gradient px-8 py-5 rounded-2xl flex items-center gap-3 hover:shadow-primary/30 active:scale-95 transition-all text-sm group"
        >
          <span className="font-heading font-black">Gerar Auditoria de Visão</span>
          <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Main Content Area */}
        <div className="xl:col-span-8 space-y-16">
          
          {/* Priority Actions */}
          <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-10 relative overflow-hidden group animate-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert size={180} />
            </div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="font-heading text-2xl font-black text-on-surface tracking-tight italic line-clamp-1">Ações Prioritárias</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Sincronização Necessária</p>
              </div>
              <button className="p-3 bg-surface-container-highest/50 rounded-xl hover:bg-surface-container-highest transition-colors">
                <Activity size={18} className="text-zinc-500" />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <Link href="/dashboard/emergency" className="flex items-center justify-between p-6 bg-surface-container-highest/20 hover:bg-error/5 border border-outline-variant/10 hover:border-error/20 rounded-2xl transition-all cursor-pointer group/item">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center text-error group-hover/item:scale-110 transition-transform">
                    <AlertOctagon size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-on-surface text-lg">Sobrecarga Crítica no Centro de Trauma</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Alerta Vermelho Nivel 4 - Alocação de Recursos Necessária</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-error/10 text-error border border-error/20 text-[9px] font-black uppercase tracking-widest rounded-md">Crítico</span>
                  <ChevronRight size={18} className="text-zinc-700 group-hover/item:text-error transition-all translate-x-0 group-hover/item:translate-x-1" />
                </div>
              </Link>

              <Link href="/dashboard/processes" className="flex items-center justify-between p-6 bg-surface-container-highest/20 hover:bg-primary/5 border border-outline-variant/10 hover:border-primary/20 rounded-2xl transition-all cursor-pointer group/item">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-on-surface text-lg">Sincronização do Protocolo de Bio-Síntese</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Alinhamento estratégico para as iniciativas do 2º Trimestre</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest rounded-md">Otimizar</span>
                  <ChevronRight size={18} className="text-zinc-700 group-hover/item:text-primary transition-all translate-x-0 group-hover/item:translate-x-1" />
                </div>
              </Link>

              <Link href="/dashboard/admin" className="flex items-center justify-between p-6 bg-surface-container-highest/20 hover:bg-emerald-500/5 border border-outline-variant/10 hover:border-emerald-500/20 rounded-2xl transition-all cursor-pointer group/item">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover/item:scale-110 transition-transform">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-on-surface text-lg">Auditoria de Governança Institucional</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Validação semestral dos módulos de gestão clínica</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-md">Auditável</span>
                  <ChevronRight size={18} className="text-zinc-700 group-hover/item:text-emerald-500 transition-all translate-x-0 group-hover/item:translate-x-1" />
                </div>
              </Link>
            </div>
          </section>

          {/* Quick Access Grid */}
          <section className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
             <div className="flex items-center gap-2 mb-8">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h2 className="font-heading text-xl font-black text-on-surface italic">Navegação Mestre</h2>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Arquitetura', icon: Building2, href: '/dashboard/architecture', color: 'text-primary' },
                  { label: 'IA Executiva', icon: Brain, href: '/dashboard/ai-exec', color: 'text-primary' },
                  { label: 'Agenda', icon: Clock, href: '/dashboard/agenda', color: 'text-emerald-500' },
                  { label: 'Reuniões', icon: Users, href: '/dashboard/meetings', color: 'text-amber-500' },
                ].map((item, i) => (
                  <Link key={i} href={item.href} className="group p-6 bg-surface-container-low border border-outline-variant/10 rounded-[2rem] hover:border-primary/30 transition-all text-center space-y-3">
                     <item.icon size={28} className={cn("mx-auto transition-transform group-hover:scale-110", item.color)} />
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-on-surface transition-colors">{item.label}</p>
                  </Link>
                ))}
             </div>
          </section>

          {/* Recent Feed */}
          <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="font-heading text-xl font-black text-on-surface italic">Fluxo de Registros</h3>
            </div>

            <div className="space-y-6">
              {[
                { time: "14:22", type: "REGISTROS CIRÚRGICOS", content: "Novo recorde de eficiência alcançado na ala de cardiologia robótica (Unidade 7).", color: "text-primary" },
                { time: "11:05", type: "SINCRONIZAÇÃO FARMA", content: "Contrato de reposição farmacêutica trimestral assinado para o Hub MedCore Sul.", color: "text-emerald-500" },
                { time: "08:30", type: "SISTEMA", content: "Auditoria de arquitetura interna concluída. 0 vulnerabilidades detectadas no núcleo Executivo de IA.", color: "text-zinc-500" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-4 h-4 rounded-full border-2 border-background ring-4 ring-offset-0 bg-transparent transition-all group-hover:scale-125", 
                      item.color.replace('text-', 'ring-').concat('/20 border-').concat(item.color.replace('text-', '')))}></div>
                    {i !== 2 && <div className="w-[1px] flex-1 bg-outline-variant/10 my-1"></div>}
                  </div>
                  <div className="pb-8">
                    <p className="text-[10px] font-black tracking-widest uppercase mb-1">
                      <span className="text-on-surface/40">{item.time} — </span>
                      <span className={item.color}>{item.type}</span>
                    </p>
                    <p className="text-on-surface-variant font-medium leading-relaxed group-hover:text-on-surface transition-colors">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Status Area */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <StatCard label="Compromissos" value="84%" icon={Building2} trend={{ value: "12%", isPositive: true }} color="teal" />
            <StatCard label="Estratégicos" value="12" icon={Target} color="cyan" />
            <StatCard label="Documentos" value="1.4k" icon={FileText} trend={{ value: "48", isPositive: true }} color="zinc" />
            <StatCard label="Pendências" value="09" icon={AlertOctagon} trend={{ value: "02", isPositive: false }} color="zinc" />
          </div>

          {/* Performance Indicators */}
          <section className="bg-surface-container-low/50 backdrop-blur-md border border-outline-variant/10 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1 h-5 bg-primary rounded-full"></div>
              <h3 className="font-heading text-lg font-black text-on-surface italic">Indicadores de Desempenho</h3>
            </div>

            <div className="space-y-8">
              {[
                { label: "PRECISÃO CLÍNICA", value: "99.4%", progress: 99.4, color: "bg-emerald-500" },
                { label: "ADERÊNCIA AO PROTOCOLO", value: "87.2%", progress: 87.2, color: "bg-primary" },
                { label: "OTIMIZAÇÃO DE RECURSOS", value: "64.0%", progress: 64, color: "bg-secondary" },
                { label: "VELOCIDADE DE FLUXO DE PACIENTES", value: "42.1%", progress: 42.1, color: "bg-zinc-700" }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{item.label}</label>
                    <span className="font-heading font-black text-sm text-on-surface">{item.value}</span>
                  </div>
                  <div className="h-2 bg-surface-container-highest/50 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.color)} 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-surface-container-highest/30 border border-outline-variant/10 flex items-start gap-4 group cursor-pointer hover:bg-surface-container-highest/50 transition-all">
               <div className="w-12 h-12 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                  <span className="text-[10px] font-black text-primary rotate-90">CORE</span>
               </div>
               <div>
                 <h4 className="text-xs font-black text-on-surface uppercase tracking-widest mb-1">Insight do Observador IA</h4>
                 <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                   A análise neural sugere que a otimização da aderência aos protocolos poderia aumentar a receita institucional em 14,3% neste trimestre.
                 </p>
               </div>
            </div>
          </section>

        </div>

      </div>
    </>
  );
}
