"use client";

import React from "react";
import { ArrowUpRight, Plus } from "lucide-react";

export default function PayablesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Financeiro</span>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface mt-2">
            Contas a <span className="text-gradient">Pagar</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Gestão de pagamentos, fornecedores e despesas
          </p>
        </div>
        <button className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black opacity-50 cursor-not-allowed">
          <Plus size={18} /> Novo Pagamento
        </button>
      </div>

      <div className="p-16 bg-surface rounded-3xl border border-outline-variant/40 text-center shadow-sm">
        <ArrowUpRight size={48} className="mx-auto mb-4 text-primary opacity-30" />
        <h3 className="font-heading text-xl font-black text-on-surface mb-2">Módulo em Desenvolvimento</h3>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto">
          A interface para controle das suas Contas a Pagar está sendo estruturada. 
          Em breve, você poderá agendar e liquidar os pagamentos aqui.
        </p>
      </div>
    </div>
  );
}
