"use client";

import React, { useState } from "react";
import { X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface NFFormProps {
  unitId: string;
  onClose: () => void;
  onSuccess: (nota: any) => void;
}

export function NFForm({ unitId, onClose, onSuccess }: NFFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tomadorNome: "",
    tomadorDocumento: "",
    tomadorEmail: "",
    tomadorEndereco: "",
    descricao: "Consulta Médica",
    valor: "",
    ambiente: "HOMOLOGACAO"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/notas-fiscais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          unitId,
          cnae: "8630503",
          codigoServico: "04.01"
        })
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data);
      } else {
        alert("Erro ao emitir nota");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-end p-4">
      <div className="bg-surface w-full max-w-2xl h-full rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-outline-variant/40 animate-in slide-in-from-right-8 duration-300">
        <div className="px-6 py-5 border-b border-outline-variant/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-on-surface">Emitir Nova NFS-e</h2>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest flex items-center gap-1">
                {formData.ambiente === "HOMOLOGACAO" ? (
                  <span className="text-amber-500 flex items-center gap-1"><AlertCircle size={12}/> HOMOLOGAÇÃO</span>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> PRODUÇÃO</span>
                )}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
            <X size={20} />
          </button>
        </div>

        <form id="nfForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20 pb-2">1. Dados do Tomador (Paciente)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Nome Completo / Razão Social</label>
                <input required name="tomadorNome" value={formData.tomadorNome} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Ex: João da Silva" />
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">CPF ou CNPJ</label>
                <input required name="tomadorDocumento" value={formData.tomadorDocumento} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">E-mail (Para envio da NF)</label>
                <input type="email" name="tomadorEmail" value={formData.tomadorEmail} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="joao@email.com" />
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Endereço Completo</label>
                <input name="tomadorEndereco" value={formData.tomadorEndereco} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Rua A, 123 - Cidade/UF" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20 pb-2">2. Dados do Serviço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Descrição do Serviço</label>
                <textarea required name="descricao" value={formData.descricao} onChange={handleChange} rows={2} className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Valor do Serviço (R$)</label>
                <input required type="number" step="0.01" name="valor" value={formData.valor} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg font-semibold text-primary" placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-1 block ml-1">Ambiente de Emissão</label>
                <select name="ambiente" value={formData.ambiente} onChange={handleChange} className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option value="HOMOLOGACAO">Homologação (Sem Valor Fiscal)</option>
                  <option value="PRODUCAO">Produção (Nota Oficial)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="p-4 rounded-2xl bg-surface-container-high/50 border border-outline-variant/30">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-on-surface-variant">Valor Bruto:</span>
              <span className="font-medium text-on-surface">R$ {parseFloat(formData.valor || "0").toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-on-surface-variant">Deduções/Impostos Retidos:</span>
              <span className="font-medium text-error">- R$ 0.00</span>
            </div>
            <div className="border-t border-outline-variant/20 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Valor Líquido</span>
              <span className="text-xl font-heading font-semibold text-primary">R$ {parseFloat(formData.valor || "0").toFixed(2)}</span>
            </div>
          </div>

        </form>

        <div className="p-6 border-t border-outline-variant/20 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-outline-variant/40 bg-surface hover:bg-surface-container text-on-surface text-sm font-semibold transition-all">
            Cancelar
          </button>
          <button 
            type="submit" 
            form="nfForm"
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all text-white shadow-lg ${formData.ambiente === 'PRODUCAO' ? 'bg-gradient-to-r from-primary to-secondary-container hover:shadow-primary/30' : 'bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/30'}`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            {formData.ambiente === 'PRODUCAO' ? 'Emitir Nota Oficial' : 'Emitir Nota (Teste)'}
          </button>
        </div>
      </div>
    </div>
  );
}
