"use client";

import React from "react";
import { PieChart, Download } from "lucide-react";

export default function FinanceReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-rd-cyan animate-pulse mr-2" />
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Módulo DRE & Análise Consolidada em processamento
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-60">
          <Download size={16} /> Exportar Relatório (PDF / XLS)
        </button>
      </div>

      <div className="p-16 bg-white dark:bg-zinc-900/85 backdrop-blur-xl rounded-3xl border-2 border-zinc-200 dark:border-zinc-700/80 text-center shadow-md">
        <PieChart size={48} className="mx-auto mb-4 text-rd-cyan opacity-40" />
        <h3 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Processamento de Dados Contábeis</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
          Os dashboards de DRE, fluxo de caixa e relatórios contábeis estão sendo sintetizados para os próximos ciclos.
        </p>
      </div>
    </div>
  );
}
