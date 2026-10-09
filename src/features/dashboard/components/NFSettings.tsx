"use client";

import React, { useState } from "react";
import { ShieldCheck, Upload, AlertCircle, FileText, CheckCircle2, ChevronRight } from "lucide-react";

export function NFSettings() {
  const [hasCert, setHasCert] = useState(false);

  return (
    <div className="bg-surface rounded-3xl border border-outline-variant/40 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-on-surface">Configuração Fiscal</h2>
          <p className="text-sm text-on-surface-variant">Gerencie seu certificado digital A1 e alíquotas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Certificado Digital */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">Certificado Digital (A1)</h3>
          
          {hasCert ? (
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={64} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Ativo e Validado</span>
              </div>
              <p className="font-semibold text-on-surface mb-1">CLÍNICA MÉDICA SAÚDE LTDA</p>
              <p className="text-xs text-on-surface-variant">CNPJ: 12.345.678/0001-99</p>
              <p className="text-xs text-on-surface-variant mt-2 font-medium">Válido até: 15/10/2027</p>
              
              <button onClick={() => setHasCert(false)} className="mt-4 text-xs font-semibold text-error hover:underline">
                Remover Certificado
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary/50 bg-surface-container/30 transition-all text-center cursor-pointer group" onClick={() => setHasCert(true)}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <p className="text-sm font-semibold text-on-surface mb-1">Fazer Upload do Certificado (.pfx)</p>
              <p className="text-xs text-on-surface-variant max-w-[200px] mx-auto">
                Clique para simular o envio do seu certificado A1
              </p>
            </div>
          )}
        </div>

        {/* Informações Fiscais */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">Parâmetros de Emissão</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Ambiente Padrão</label>
              <select className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="HOMOLOGACAO">Homologação (Testes sem valor fiscal)</option>
                <option value="PRODUCAO">Produção (Emissão Oficial)</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">CNAE Principal</label>
              <select className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="8630503">86.30-5-03 - Atividade médica ambulatorial restrita a consultas</option>
                <option value="8630501">86.30-5-01 - Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Código do Serviço (ISS)</label>
                <input type="text" defaultValue="04.01" className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Alíquota ISS (%)</label>
                <input type="number" defaultValue="2.00" step="0.01" className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 text-amber-600">
        <AlertCircle size={18} className="shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="font-semibold block mb-1">Nota sobre o ambiente de Testes:</strong>
          Esta tela de configurações está liberada no modo Sandbox. Você pode emitir notas de teste sem precisar fazer upload de um certificado real. Quando mudar para Produção, o upload será obrigatório.
        </div>
      </div>
    </div>
  );
}
