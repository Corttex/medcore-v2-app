"use client";

import React, { useState } from "react";
import { 
  HandCoins, Download, Search, Filter, 
  CheckCircle2, AlertTriangle, Users, Stethoscope, 
  DollarSign, ArrowUpRight
} from "lucide-react";

import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

const MOCK_REPASSES = [
  { id: "REP-101", medico: "Dr. Carlos Silva", especialidade: "Dermatologia", procedimentos: 45, valorBruto: 18500.00, comissao: 60, valorRepasse: 11100.00, status: "PENDENTE" },
  { id: "REP-102", medico: "Dra. Ana Paula", especialidade: "Cardiologia", procedimentos: 32, valorBruto: 12800.00, comissao: 70, valorRepasse: 8960.00, status: "PAGO" },
  { id: "REP-103", medico: "Dr. Roberto Justo", especialidade: "Ortopedia", procedimentos: 28, valorBruto: 15400.00, comissao: 50, valorRepasse: 7700.00, status: "EM_PROCESSAMENTO" },
];

export default function RepassesMedicosPage() {
  const { isDemoMode } = useDashboardContext();
  const [activeTab, setActiveTab] = useState<"ANALITICO" | "SINTETICO">("ANALITICO");

  const repasses = isDemoMode ? MOCK_REPASSES : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        {/* Lado Esquerdo: Resumo em Tempo Real */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <strong className="text-violet-500 font-bold">{isDemoMode ? "12" : "0"}</strong> profissionais elegíveis no ciclo
            </p>
          </div>
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400">
            A Repassar: <strong className="text-violet-500 font-bold ml-1">{isDemoMode ? "R$ 18.800" : "R$ 0,00"}</strong>
          </div>
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Retenção: <strong className="text-emerald-500 font-bold ml-1">{isDemoMode ? "R$ 11.200" : "R$ 0,00"}</strong>
          </div>
        </div>

        {/* Lado Direito: Ação Primária */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]">
            <HandCoins size={16} /> Executar Repasses (Pix)
          </button>
        </div>
      </div>

      {/* KPI Cards Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-violet-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Total a Repassar</h3>
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                <DollarSign size={14} />
              </div>
            </div>
            <p className="text-3xl font-heading font-semibold text-on-surface">R$ 18.800</p>
            <p className="text-xs text-violet-500 mt-2 font-medium">Provisionado para este ciclo</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Retenção Clínica</h3>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Building2Icon />
              </div>
            </div>
            <p className="text-3xl font-heading font-semibold text-on-surface">R$ 11.200</p>
            <p className="text-xs text-emerald-500 mt-2 font-medium">Margem retida pela clínica</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Profissionais</h3>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users size={14} />
              </div>
            </div>
            <p className="text-3xl font-heading font-semibold text-on-surface">12</p>
            <p className="text-xs text-blue-500 mt-2 font-medium">Médicos elegíveis ao repasse</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Glosas Descontadas</h3>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <AlertTriangle size={14} />
              </div>
            </div>
            <p className="text-3xl font-heading font-semibold text-on-surface">R$ 1.250</p>
            <p className="text-xs text-amber-500 mt-2 font-medium">Repassadas aos responsáveis</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 shadow-sm">
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold text-on-surface">Lotes de Repasse (Ciclo Mensal)</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="Buscar médico..." 
                  className="pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-violet-500 transition-colors w-64 text-on-surface"
                />
              </div>
              <button className="p-2 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container transition-all">
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-outline-variant/30">
                  <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Profissional</th>
                  <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Qtd. Procedimentos</th>
                  <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Valor Bruto</th>
                  <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">% Comissão</th>
                  <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant text-violet-500">Repasse Líquido</th>
                  <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant">Status</th>
                  <th className="pb-3 text-sm uppercase tracking-widest font-bold text-on-surface-variant text-right">Extrato</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {repasses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Stethoscope size={32} className="opacity-40" />
                        <p className="font-semibold text-sm">Nenhum repasse médico pendente</p>
                        <p className="text-xs text-zinc-500 max-w-sm">
                          Para inspecionar o layout completo e tabelas preenchidas com dados de teste, ative o botão &quot;Dados Demo: Sim&quot; na barra superior.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  repasses.map((rep) => (
                    <tr key={rep.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/40">
                            <Stethoscope size={14}/>
                          </div>
                          <div>
                            <p className="font-semibold text-on-surface">{rep.medico}</p>
                            <p className="text-sm text-on-surface-variant uppercase tracking-wider">{rep.especialidade}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-on-surface-variant">{rep.procedimentos}</td>
                      <td className="py-4 font-medium text-on-surface">R$ {rep.valorBruto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td className="py-4 font-medium text-on-surface">{rep.comissao}%</td>
                      <td className="py-4 font-semibold text-violet-500">R$ {rep.valorRepasse.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-sm uppercase font-bold tracking-wider rounded-md border ${
                          rep.status === 'PENDENTE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                          rep.status === 'EM_PROCESSAMENTO' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="p-2 rounded-xl text-violet-500 hover:bg-violet-500/10 transition-colors inline-flex items-center justify-center">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function Building2Icon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
    </svg>
  );
}
