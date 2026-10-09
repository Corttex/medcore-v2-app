"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar, 
  Download, 
  Filter, 
  ChevronDown,
  Activity,
  ArrowUpRight,
  PieChart,
  LineChart,
  Users,
  Brain,
  FileText
} from "lucide-react";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("Últimos 30 dias");

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-rd-cyan/10 border border-rd-cyan/20 text-rd-cyan text-xs font-semibold uppercase tracking-widest rounded-full">
              Business Intelligence
            </span>
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tighter text-on-surface ">
            Relatórios <span className="text-gradient-lilac">Estratégicos</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1 max-w-xl font-medium">
            Análise granular de performance assistencial e financeira orquestrada por IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="bg-surface-container border border-white/10 rounded-2xl px-5 py-2.5 text-sm font-medium text-on-surface flex items-center gap-3 hover:bg-surface-container-highest transition-all">
              <Calendar size={16} className="text-rd-cyan" />
              {timeRange}
              <ChevronDown size={14} className="text-zinc-500 group-hover:rotate-180 transition-transform" />
            </button>
          </div>
          <button className="btn-gradient-lilac p-2.5 rounded-xl hover:shadow-rd-cyan/20 active:scale-95 transition-all text-white">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Receita Total" value="R$ 0,00" icon={TrendingUp} trend={{ value: "14%", isPositive: true }} color="lilac" />
        <StatCard label="Atendimentos" value="0" icon={Activity} trend={{ value: "8%", isPositive: true }} color="emerald" />
        <StatCard label="Conversão" value="0%" icon={Target} trend={{ value: "3%", isPositive: false }} color="zinc" />
        <StatCard label="Novos Pacientes" value="0" icon={Users} trend={{ value: "22%", isPositive: true }} color="zinc" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Chart Area */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-surface-container-low/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-on-surface ">Fluxo de Receita vs Despesa</h3>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-[0.2em] mt-0.5">Análise Comparativa Semestral</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rd-cyan"></div>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Receita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Despesa</span>
                </div>
              </div>
            </div>

            {/* Mock Chart Visualization */}
            <div className="h-64 w-full relative group">
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                {[45, 60, 35, 70, 85, 50, 90, 75, 80, 65, 55, 95].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group/bar w-full max-w-[10px]">
                    <div 
                      className="w-full bg-rd-cyan/20 rounded-full transition-all duration-1000 ease-out group-hover:h-full relative overflow-hidden" 
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute bottom-0 left-0 w-full bg-rd-cyan rounded-full" style={{ height: '70%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-zinc-600 uppercase tracking-tighter">M{i+1}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 border-b border-l border-white/10"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4">
              <h4 className="font-heading text-base font-semibold text-on-surface ">Distribuição por Especialidade</h4>
              <div className="space-y-3">
                {[
                  { label: "Dermatologia", value: "45%", color: "bg-rd-cyan" },
                  { label: "Cardiologia", value: "30%", color: "bg-indigo-500" },
                  { label: "Ortopedia", value: "25%", color: "bg-emerald-500" }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-widest">
                      <span className="text-on-surface-variant">{item.label}</span>
                      <span className="text-on-surface">{item.value}</span>
                    </div>
                    <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: item.value }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan mb-0.5">
                <Brain size={20} className="animate-pulse" />
              </div>
              <h4 className="font-heading text-base font-semibold text-on-surface ">Insights do VitalFlow AI</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
                "Aguardando volume de dados para gerar insights de alocação de receita."
              </p>
              <button className="text-xs font-semibold text-rd-cyan uppercase tracking-[0.2em] border-b border-rd-cyan/50 pb-0.5 hover:border-rd-cyan transition-all">
                Ver Detalhes do Insight
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Reports */}
        <div className="xl:col-span-4 space-y-4">
          <section className="bg-surface-container-low/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="font-heading text-base font-semibold text-on-surface mb-4">Faturas Recentes</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-container-highest/20 border border-white/10 hover:bg-surface-container-highest/40 transition-all group flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-zinc-400 group-hover:text-rd-cyan transition-colors">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">FAT-2024-{1000+i}</p>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Unidade São Lucas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-on-surface">R$ 4.250,00</p>
                    <p className="text-xs text-emerald-500 font-semibold uppercase tracking-widest">Pago</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] hover:bg-surface-container-highest transition-all">
              Ver Todas as Faturas
            </button>
          </section>

          <section className="bg-gradient-to-br from-rd-cyan/10 to-indigo-500/10 border border-rd-cyan/20 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-heading text-base font-semibold text-rd-cyan ">Exportação Personalizada</h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                Gere PDFs ou planilhas (.xlsx) completas com filtros avançados e análise de IA.
              </p>
              <button className="mt-3 flex items-center gap-2 text-xs font-semibold text-rd-cyan uppercase tracking-[0.2em]">
                Configurar Exportação <ArrowUpRight size={12} />
              </button>
            </div>
            <Download size={80} className="absolute -bottom-6 -right-6 opacity-5 text-rd-cyan" />
          </section>
        </div>
      </div>
    </div>
  );
}
