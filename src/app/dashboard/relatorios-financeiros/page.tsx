"use client";

import React from "react";
import { PieChart, Download } from "lucide-react";

export default function FinanceReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold uppercase tracking-widest rounded-full">Financeiro</span>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-on-surface mt-2">
            Relatório de <span className="text-gradient">Dados</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Dashboards, DRE e indicadores financeiros
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold border border-outline-variant/40 bg-surface text-on-surface opacity-50 cursor-not-allowed">
          <Download size={18} /> Exportar Relatório
        </button>
      </div>

      <div className="p-16 bg-surface rounded-3xl border border-outline-variant/40 text-center shadow-sm">
        <PieChart size={48} className="mx-auto mb-4 text-primary opacity-30" />
        <h3 className="font-heading text-xl font-semibold text-on-surface mb-2">Processamento de Dados</h3>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto">
          Os dashboards financeiros estão sendo configurados. 
          Em breve, você terá acesso a gráficos consolidados de receitas, despesas e fluxo de caixa.
        </p>
      </div>
    </div>
  );
}
