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
      {/* Action Bar Compacta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Business Intelligence & Indicadores</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            Orquestrado por IA
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Performance Assistencial e Financeira
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 hover:border-zinc-400 transition-all">
              <Calendar size={14} className="text-rd-cyan" />
              {timeRange}
              <ChevronDown size={13} className="text-zinc-400 group-hover:rotate-180 transition-transform" />
            </button>
          </div>
          <button 
            className="p-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold hover:bg-rd-cyan/90 shadow-md shadow-rd-cyan/20 transition-all"
            title="Exportar Relatórios"
          >
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
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Fluxo de Receita vs Despesa</h3>
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">Análise Comparativa Semestral</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rd-cyan"></div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Receita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-700"></div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Despesa</span>
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
                    <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">M{i+1}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 border-b border-l border-zinc-200 dark:border-zinc-800"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 space-y-4 shadow-sm">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Distribuição por Especialidade</h4>
              <div className="space-y-3">
                {[
                  { label: "Dermatologia", value: "45%", color: "bg-rd-cyan" },
                  { label: "Cardiologia", value: "30%", color: "bg-indigo-500" },
                  { label: "Ortopedia", value: "25%", color: "bg-emerald-500" }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                      <span className="text-zinc-900 dark:text-zinc-100">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: item.value }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan mb-0.5">
                <Brain size={20} className="animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Insights do VitalFlow AI</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                "Aguardando volume de dados consolidado para calibrar a taxa de conversão assistencial."
              </p>
              <button className="text-xs font-bold text-rd-cyan uppercase tracking-wider border-b border-rd-cyan/50 pb-0.5 hover:border-rd-cyan transition-all">
                Ver Detalhes do Insight
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Reports */}
        <div className="xl:col-span-4 space-y-4">
          <section className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-4">Faturas Recentes</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 hover:border-rd-cyan/40 transition-all group flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-rd-cyan transition-colors">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">FAT-2026-{1000+i}</p>
                      <p className="text-[11px] text-zinc-400 font-medium">Unidade Geral</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">R$ 4.250,00</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Pago</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider hover:border-zinc-400 transition-all">
              Ver Todas as Faturas
            </button>
          </section>

          <section className="bg-gradient-to-br from-rd-cyan/10 to-indigo-500/10 border-2 border-rd-cyan/30 rounded-2xl p-6 space-y-3 relative overflow-hidden backdrop-blur-xl shadow-sm">
            <div className="relative z-10">
              <h3 className="font-bold text-sm text-rd-cyan">Exportação Personalizada</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                Gere relatórios executivos em PDF ou planilhas (.xlsx) completas com filtros hospitalares e análise de IA.
              </p>
              <button className="mt-3 flex items-center gap-2 text-xs font-bold text-rd-cyan uppercase tracking-wider hover:underline">
                Configurar Exportação <ArrowUpRight size={13} />
              </button>
            </div>
            <Download size={80} className="absolute -bottom-6 -right-6 opacity-5 text-rd-cyan pointer-events-none" />
          </section>
        </div>
      </div>
    </div>
  );
}
