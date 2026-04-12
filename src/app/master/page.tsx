"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Building2, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Users, 
  TrendingUp,
  ArrowRight,
  Monitor,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/modules/shared/components/Logo";

export default function MasterPanelPage() {
  return (
    <main className="min-h-screen bg-background text-on-surface p-4 md:p-8 selection:bg-lilac/30">
      {/* Header Centralizado */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-6">
          <Logo className="w-48 lg:w-56" width={220} height={65} />
          <div className="h-10 w-[1px] bg-outline-variant/30 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <h1 className="text-xl font-heading font-black tracking-tight text-on-surface">Master Control</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Global Management Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container rounded-2xl border border-outline-variant/50 p-4 flex gap-6">
            <div className="text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Users</p>
              <p className="text-sm font-black text-on-surface">1,248</p>
            </div>
            <div className="w-[1px] bg-outline-variant/30"></div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Uptime</p>
              <p className="text-sm font-black text-emerald-500">99.9%</p>
            </div>
            <div className="w-[1px] bg-outline-variant/30"></div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-1.5 mt-0.5 justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid de Portais Principais */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Portal 1: Módulo Operacional (Lilac) */}
        <Link 
          href="/dashboard"
          className="group relative flex flex-col p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/20 hover:border-lilac/40 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-lilac/10 hover:-translate-y-1"
        >
          {/* Background Aura */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-lilac/5 blur-[100px] rounded-full group-hover:bg-lilac/10 transition-all"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="w-16 h-16 rounded-[1.5rem] bg-lilac/10 border border-lilac/20 flex items-center justify-center text-lilac group-hover:scale-110 group-hover:bg-lilac group-hover:text-white transition-all duration-500">
              <Activity size={32} />
            </div>
            <div className="px-4 py-1.5 bg-lilac/10 border border-lilac/20 rounded-full">
              <p className="text-[10px] font-black text-lilac uppercase tracking-[0.2em]">Operational</p>
            </div>
          </div>

          <h2 className="text-4xl font-heading font-black text-on-surface tracking-tighter italic leading-none mb-4 group-hover:text-lilac transition-colors">
            VitalFlow <br /> Operational
          </h2>
          <p className="text-on-surface-variant text-base font-medium leading-relaxed max-w-xs mb-8 opacity-80">
            Interface de alta performance para médicos e profissionais de linha de frente.
          </p>

          <ul className="space-y-3 mb-10">
            {[
              "Auditoria VitalFlow Intelligence",
              "Gestão de Emergência Real-time",
              "Kanban & Fluxo de Notas",
              "IA Observer Ativo"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] font-bold text-zinc-500">
                <div className="w-1.5 h-1.5 rounded-full bg-lilac/40"></div>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant/10">
            <span className="text-xs font-black uppercase tracking-widest text-on-surface group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Acessar Módulo <ArrowRight size={16} />
            </span>
            <Monitor size={48} className="text-zinc-800 opacity-20" />
          </div>
        </Link>

        {/* Portal 2: Módulo Enterprise (Teal) */}
        <Link 
          href="/enterprise"
          className="group relative flex flex-col p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
        >
          {/* Background Aura */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Building2 size={32} />
            </div>
            <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Strategy</p>
            </div>
          </div>

          <h2 className="text-4xl font-heading font-black text-on-surface tracking-tighter italic leading-none mb-4 group-hover:text-primary transition-colors">
            Hub MedCore <br /> Enterprise
          </h2>
          <p className="text-on-surface-variant text-base font-medium leading-relaxed max-w-xs mb-8 opacity-80">
            Mission Control para holdings e grandes redes hospitalares de elite.
          </p>

          <ul className="space-y-3 mb-10">
            {[
              "Matriz de Performance Global",
              "Consolidado de EBITDA da Rede",
              "Auditoria de Risco de Holding",
              "Governança Multi-CNE"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-[13px] font-bold text-zinc-500">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant/10">
            <span className="text-xs font-black uppercase tracking-widest text-on-surface group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Acessar Hub <ArrowRight size={16} />
            </span>
            <Database size={48} className="text-zinc-800 opacity-20" />
          </div>
        </Link>
      </div>

      {/* Secondary Admin Actions */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
        {[
          { icon: Users, label: "Gestão Global de Usuários", value: "ADMIN", color: "text-amber-500" },
          { icon: ShieldCheck, label: "Logs de Segurança Audit", value: "SEC", color: "text-emerald-500" },
          { icon: TrendingUp, label: "Billing & Faturamento", value: "PAY", color: "text-blue-500" }
        ].map((action, i) => (
          <div key={i} className="p-4 bg-surface-container rounded-2xl border border-outline-variant/30 flex items-center gap-4 hover:bg-surface-container-high transition-all cursor-pointer group">
            <div className={cn("w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform", action.color)}>
              <action.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{action.value}</p>
              <p className="text-xs font-black text-on-surface">{action.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Footer Decoration */}
      <footer className="mt-20 max-w-7xl mx-auto text-center border-t border-outline-variant/10 pt-8 opacity-20">
        <p className="font-heading font-black text-6xl lg:text-8xl tracking-tighter uppercase select-none italic text-zinc-800">
          MedCore <span className="text-outline-variant">Control Tower</span>
        </p>
      </footer>
    </main>
  );
}
