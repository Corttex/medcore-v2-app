"use client";

import React, { useState, useEffect } from "react";
import { Receipt, FileText, Download, CheckCircle2, XCircle, Clock, Search, Settings } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { NFSettings } from "@/features/dashboard/components/NFSettings";
import { NFForm } from "@/features/dashboard/components/NFForm";

export default function InvoicesPage() {
  const { selectedUnitId } = useDashboardContext();
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotas = async () => {
    if (!selectedUnitId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notas-fiscais?unitId=${selectedUnitId}`);
      if (res.ok) {
        const data = await res.json();
        setNotas(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, [selectedUnitId]);

  if (!selectedUnitId) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant animate-in fade-in">
        <p>Selecione um hospital/clínica no menu lateral para visualizar as Notas Fiscais.</p>
      </div>
    );
  }

  const autorizadas = notas.filter(n => n.status === "AUTORIZADA");
  const valorTotalAutorizado = autorizadas.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Action Bar Superior Compacta - Sem Duplicação de H1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        {/* Lado Esquerdo: Contadores Dinâmicos */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <strong className="text-emerald-500 font-bold">{autorizadas.length}</strong> autorizadas
            </p>
          </div>
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <strong className="text-blue-500 font-bold mr-1">{notas.filter(n => n.status === "EM_PROCESSAMENTO").length}</strong> em processamento
          </div>
          {notas.filter(n => n.status === "ERRO").length > 0 && (
            <div className="flex items-center bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-500">
              <strong className="font-bold mr-1">{notas.filter(n => n.status === "ERRO").length}</strong> rejeitadas
            </div>
          )}
        </div>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              showSettings 
                ? 'bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white' 
                : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Settings size={15} /> Configurações
          </button>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-to-r from-primary to-secondary-container hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] text-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <FileText size={16} /> Emitir Nova NF
          </button>
        </div>
      </div>

      {showSettings && <NFSettings />}

      {/* Resumo Financeiro Fiscal Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 transition-transform">
            <Receipt size={64} className="text-primary" />
          </div>
          <div className="flex items-center gap-2 mb-2 text-zinc-500 dark:text-zinc-400">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <p className="text-[11px] font-semibold uppercase tracking-widest">Faturamento Autorizado (Mês)</p>
          </div>
          <p className="font-heading font-semibold text-3xl text-on-surface">
            {valorTotalAutorizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">{autorizadas.length} notas emitidas com sucesso</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-2 text-zinc-500 dark:text-zinc-400">
            <Clock size={16} className="text-blue-500" />
            <p className="text-[11px] font-semibold uppercase tracking-widest">Em Processamento</p>
          </div>
          <p className="font-heading font-semibold text-3xl text-on-surface">
            {notas.filter(n => n.status === "EM_PROCESSAMENTO").length}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Aguardando retorno da prefeitura</p>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-rose-500/50 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-2 text-zinc-500 dark:text-zinc-400">
            <XCircle size={16} className="text-error" />
            <p className="text-[11px] font-semibold uppercase tracking-widest">Erros / Rejeitadas</p>
          </div>
          <p className="font-heading font-semibold text-3xl text-error">
             {notas.filter(n => n.status === "ERRO").length}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Revisão necessária</p>
        </div>
      </div>

      {/* Listagem de Notas Liquid Glass */}
      <div className="bg-white dark:bg-zinc-900/85 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg text-on-surface">Histórico de Emissões</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input type="text" placeholder="Buscar por cliente ou RPS..." className="pl-9 pr-4 py-2 bg-surface-container/50 border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/30 border-b border-outline-variant/20">
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Data / Status</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Cliente (Tomador)</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Serviço</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Nº NF / RPS</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant uppercase tracking-widest text-center">Arquivos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">Carregando notas...</td>
                </tr>
              ) : notas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    Nenhuma nota fiscal emitida ainda.<br/>Clique em "Emitir Nova NF" para começar.
                  </td>
                </tr>
              ) : (
                notas.map((nota) => (
                  <tr key={nota.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-on-surface">{new Date(nota.createdAt).toLocaleDateString('pt-BR')}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {nota.status === 'AUTORIZADA' && <><CheckCircle2 size={12} className="text-emerald-500"/><span className="text-sm font-bold uppercase tracking-wider text-emerald-500">Autorizada</span></>}
                        {nota.status === 'ERRO' && <><XCircle size={12} className="text-error"/><span className="text-sm font-bold uppercase tracking-wider text-error">Rejeitada</span></>}
                        {nota.status === 'EM_PROCESSAMENTO' && <><Clock size={12} className="text-blue-500"/><span className="text-sm font-bold uppercase tracking-wider text-blue-500">Processando</span></>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-on-surface">{nota.tomadorNome}</p>
                      <p className="text-xs text-on-surface-variant">{nota.tomadorDocumento}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-on-surface line-clamp-1 max-w-[200px]" title={nota.descricao}>{nota.descricao}</p>
                      <p className="text-xs text-on-surface-variant">CNAE: {nota.cnae}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-on-surface">{nota.numero || "---"}</p>
                      <p className="text-xs text-on-surface-variant">{nota.rps || "---"}</p>
                      {nota.ambiente === 'HOMOLOGACAO' && <span className="inline-block mt-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Homologação</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-semibold text-on-surface">R$ {nota.valor.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button disabled={!nota.pdfUrl} className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-30" title="Baixar PDF">
                          <FileText size={16} />
                        </button>
                        <button disabled={!nota.xmlUrl} className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors disabled:opacity-30" title="Baixar XML">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <NFForm 
          unitId={selectedUnitId} 
          onClose={() => setShowForm(false)} 
          onSuccess={(novaNota) => {
            setShowForm(false);
            setNotas([novaNota, ...notas]);
          }} 
        />
      )}
    </div>
  );
}
