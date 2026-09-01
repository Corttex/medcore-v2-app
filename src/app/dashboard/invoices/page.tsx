"use client";

import React from "react";
import { Receipt, FileText } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Financeiro</span>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface mt-2">
            Emitir <span className="text-gradient">NF</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Emissão e gerenciamento de Notas Fiscais
          </p>
        </div>
        <button className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black opacity-50 cursor-not-allowed">
          <FileText size={18} /> Emitir Nova NF
        </button>
      </div>

      <div className="p-16 bg-surface rounded-3xl border border-outline-variant/40 text-center shadow-sm">
        <Receipt size={48} className="mx-auto mb-4 text-primary opacity-30" />
        <h3 className="font-heading text-xl font-black text-on-surface mb-2">Integração Fiscal Pendente</h3>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto">
          O módulo de Emissão de Notas Fiscais requer a configuração do certificado digital. 
          Esta funcionalidade será ativada na próxima fase de integração.
        </p>
      </div>
    </div>
  );
}
